import Foundation
import UIKit
import SwiftUI
import Capacitor
import FamilyControls
import DeviceActivity

/// Gemeinsamer Speicher von App und Monitor-Erweiterung.
let offlandGroup = "group.com.offland2026.offland"

/// Bildschirmzeit für OffLand: Erlaubnis anfragen, Apps auswählen, gemessene Minuten lesen.
/// Apple gibt keine exakten Minuten heraus. Die Monitor-Erweiterung bekommt aber Signale,
/// sobald eine Schwelle erreicht ist (hier alle 15 Minuten) und merkt sich die höchste pro Tag.
@objc(ScreenTimePlugin)
public class ScreenTimePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ScreenTimePlugin"
    public let jsName = "ScreenTime"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "authorize", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pickApps", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "minutes", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise)
    ]

    private var defaults: UserDefaults? { UserDefaults(suiteName: offlandGroup) }
    static let stepMinutes = 15
    static let maxMinutes = 12 * 60

    @objc func status(_ call: CAPPluginCall) {
        let s = AuthorizationCenter.shared.authorizationStatus
        let state: String
        switch s {
        case .approved: state = "approved"
        case .denied: state = "denied"
        default: state = "notDetermined"
        }
        call.resolve([
            "available": defaults != nil,
            "status": state,
            "monitoring": defaults?.bool(forKey: "monitoring") ?? false,
            "step": ScreenTimePlugin.stepMinutes
        ])
    }

    @objc func authorize(_ call: CAPPluginCall) {
        Task {
            do {
                try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
                call.resolve(["status": "approved"])
            } catch {
                call.reject("Bildschirmzeit wurde nicht erlaubt: \(error.localizedDescription)")
            }
        }
    }

    @objc func pickApps(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            var host: UIViewController?
            var initial = FamilyActivitySelection()
            if let data = self.defaults?.data(forKey: "selection"),
               let saved = try? PropertyListDecoder().decode(FamilyActivitySelection.self, from: data) {
                initial = saved
            }
            let view = ScreenTimePickerView(selection: initial) { selection in
                host?.dismiss(animated: true)
                guard let selection = selection else {
                    call.resolve(["ok": false])
                    return
                }
                do {
                    let data = try PropertyListEncoder().encode(selection)
                    self.defaults?.set(data, forKey: "selection")
                    try ScreenTimePlugin.startMonitoring(selection)
                    self.defaults?.set(true, forKey: "monitoring")
                    call.resolve(["ok": true])
                } catch {
                    call.reject("Messen konnte nicht gestartet werden: \(error.localizedDescription)")
                }
            }
            let controller = UIHostingController(rootView: view)
            host = controller
            self.bridge?.viewController?.present(controller, animated: true)
        }
    }

    @objc func minutes(_ call: CAPPluginCall) {
        let day = call.getString("day") ?? ScreenTimePlugin.dayKey(Date())
        let key = "st_" + day
        call.resolve([
            "day": day,
            "has": defaults?.object(forKey: key) != nil,
            "minutes": defaults?.integer(forKey: key) ?? 0
        ])
    }

    @objc func stop(_ call: CAPPluginCall) {
        DeviceActivityCenter().stopMonitoring()
        defaults?.set(false, forKey: "monitoring")
        call.resolve()
    }

    static func startMonitoring(_ selection: FamilyActivitySelection) throws {
        var events: [DeviceActivityEvent.Name: DeviceActivityEvent] = [:]
        for m in stride(from: stepMinutes, through: maxMinutes, by: stepMinutes) {
            events[DeviceActivityEvent.Name("m\(m)")] = DeviceActivityEvent(
                applications: selection.applicationTokens,
                categories: selection.categoryTokens,
                webDomains: selection.webDomainTokens,
                threshold: DateComponents(hour: m / 60, minute: m % 60)
            )
        }
        let schedule = DeviceActivitySchedule(
            intervalStart: DateComponents(hour: 0, minute: 0),
            intervalEnd: DateComponents(hour: 23, minute: 59),
            repeats: true
        )
        let center = DeviceActivityCenter()
        center.stopMonitoring()
        try center.startMonitoring(DeviceActivityName("offland.daily"), during: schedule, events: events)
    }

    static func dayKey(_ date: Date) -> String {
        let f = DateFormatter()
        f.calendar = Calendar(identifier: .gregorian)
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = TimeZone.current
        f.dateFormat = "yyyy-MM-dd"
        return f.string(from: date)
    }
}

/// Apples Auswahl, welche Apps und Kategorien zählen sollen.
struct ScreenTimePickerView: View {
    @State var selection: FamilyActivitySelection
    let done: (FamilyActivitySelection?) -> Void

    var body: some View {
        NavigationView {
            VStack(alignment: .leading, spacing: 0) {
                Text("Wähl am besten oben „Alle Apps und Kategorien“. OffLand sieht dabei nicht, welche Apps du nutzt, sondern bekommt nur die Zeit in 15-Minuten-Schritten.")
                    .font(.footnote)
                    .foregroundColor(.secondary)
                    .padding()
                FamilyActivityPicker(selection: $selection)
            }
            .navigationTitle("Was zählt?")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Abbrechen") { done(nil) }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Fertig") { done(selection) }
                }
            }
        }
    }
}
