import Foundation
import UIKit
import SwiftUI
import Capacitor
import FamilyControls
import DeviceActivity
import WidgetKit
import UserNotifications

/// Sprache der nativen Texte: Englisch, wenn das iPhone nicht auf Deutsch steht
let offlandEN = !(Locale.preferredLanguages.first ?? "de").hasPrefix("de")
func L(_ de: String, _ en: String) -> String { offlandEN ? en : de }

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
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showAverage", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "widget", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "shieldPick", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "shieldSet", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "shieldFocus", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "shieldInfo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "shieldStats", returnType: CAPPluginReturnPromise)
    ]

    private var defaults: UserDefaults? { UserDefaults(suiteName: offlandGroup) }
    static let daily = DeviceActivityName("offland.daily")
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
                call.reject(L("Bildschirmzeit wurde nicht erlaubt: ", "Screen Time was not allowed: ") + error.localizedDescription)
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
                    call.reject(L("Messen konnte nicht gestartet werden: ", "Could not start measuring: ") + error.localizedDescription)
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
        DeviceActivityCenter().stopMonitoring([ScreenTimePlugin.daily])
        defaults?.set(false, forKey: "monitoring")
        call.resolve()
    }

    /// Zeigt Apples Bericht mit dem Tagesdurchschnitt der letzten 7 Tage (Report-Erweiterung).
    /// Die Zahl sieht nur die Person, die App bekommt sie nicht. Sie stellt danach den Regler ein.
    @objc func showAverage(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            var host: UIViewController?
            let view = ScreenTimeAverageView { host?.dismiss(animated: true); call.resolve() }
            let controller = UIHostingController(rootView: view)
            if let sheet = controller.sheetPresentationController { sheet.detents = [.medium()] }
            host = controller
            self.bridge?.viewController?.present(controller, animated: true)
        }
    }

    /// Werte für das Homescreen-Widget (OffLandWidget) ablegen und neu zeichnen lassen.
    @objc func widget(_ call: CAPPluginCall) {
        let json = call.getString("json") ?? "{}"
        defaults?.set(json, forKey: "widget")
        WidgetCenter.shared.reloadAllTimelines()
        call.resolve()
    }

    // MARK: Insel-Schutz (Shared/IslandShield.swift, Erweiterungen ShieldConfig und ShieldAction)

    /// Apps wählen, die die Insel bewacht
    @objc func shieldPick(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            var host: UIViewController?
            let view = ScreenTimePickerView(
                selection: IslandShield.selection() ?? FamilyActivitySelection(),
                title: L("Was bewacht die Insel?", "What does the island guard?"),
                hint: L("Wähl die Apps, bei denen du oft ohne nachzudenken landest, zum Beispiel Instagram oder TikTok. Beim Öffnen steht dann erst deine Insel in der Tür. OffLand sieht nicht, welche Apps du wählst.", "Pick the apps you tend to open without thinking, like Instagram or TikTok. When you open one, your island stands in the doorway first. OffLand never sees which apps you choose.")
            ) { selection in
                host?.dismiss(animated: true)
                guard let selection = selection else { call.resolve(["ok": false]); return }
                IslandShield.save(selection)
                IslandShield.refresh()
                call.resolve(["ok": true, "count": IslandShield.count(of: selection)])
            }
            let controller = UIHostingController(rootView: view)
            host = controller
            self.bridge?.viewController?.present(controller, animated: true)
        }
    }

    /// Modus ("off", "always", "evening", "focus") und Freigabe-Minuten für „Trotzdem öffnen“
    @objc func shieldSet(_ call: CAPPluginCall) {
        let mode = call.getString("mode") ?? IslandShield.mode
        defaults?.set(mode, forKey: "shieldMode")
        if let u = call.getInt("unlock") { defaults?.set(u, forKey: "shieldUnlock") }
        if let w = call.getArray("wins") {
            IslandShield.saveWindows(w.compactMap { ($0 as? [Any])?.compactMap { ($0 as? NSNumber)?.intValue } }.filter { $0.count == 2 })
        }
        IslandShield.scheduleEvening(mode == "evening")
        IslandShield.scheduleWindows(mode == "plan")
        DeviceActivityCenter().stopMonitoring([IslandShield.relock])
        IslandShield.refresh()
        if mode != "off" {
            UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { _, _ in }
        }
        call.resolve(["mode": mode, "active": IslandShield.shouldShield()])
    }

    /// Fokus-Bootsfahrt läuft oder ist vorbei (für den Modus "focus")
    @objc func shieldFocus(_ call: CAPPluginCall) {
        defaults?.set(call.getBool("on") ?? false, forKey: "shieldFocusOn")
        IslandShield.refresh()
        call.resolve(["active": IslandShield.shouldShield()])
    }

    /// Namen der Bewohner und Sprache für die Texte im Schutz
    @objc func shieldInfo(_ call: CAPPluginCall) {
        defaults?.set(call.getString("json") ?? "{}", forKey: "shieldInfo")
        call.resolve()
    }

    @objc func shieldStats(_ call: CAPPluginCall) {
        let day = call.getString("day") ?? IslandShield.dayKey()
        call.resolve([
            "day": day,
            "resisted": IslandShield.today("res", day: day),
            "opened": IslandShield.today("open", day: day),
            "mode": IslandShield.mode,
            "unlock": IslandShield.unlockMinutes,
            "count": IslandShield.count(of: IslandShield.selection()),
            "active": IslandShield.shouldShield()
        ])
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
        center.stopMonitoring([daily])
        try center.startMonitoring(daily, during: schedule, events: events)
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
    var title: String = L("Was zählt?", "What counts?")
    var hint: String = L("Wähl am besten oben „Alle Apps und Kategorien“. OffLand sieht dabei nicht, welche Apps du nutzt, sondern bekommt nur die Zeit in 15-Minuten-Schritten.", "Best choose “All Apps & Categories” at the top. OffLand never sees which apps you use, it only gets the time in 15-minute steps.")
    let done: (FamilyActivitySelection?) -> Void

    var body: some View {
        NavigationView {
            VStack(alignment: .leading, spacing: 0) {
                Text(hint)
                    .font(.footnote)
                    .foregroundColor(.secondary)
                    .padding()
                FamilyActivityPicker(selection: $selection)
            }
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(L("Abbrechen", "Cancel")) { done(nil) }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button(L("Fertig", "Done")) { done(selection) }
                }
            }
        }
    }
}

/// Bericht von Apple: Tagesdurchschnitt der letzten 7 Tage, angezeigt von der Erweiterung ScreenTimeReport.
struct ScreenTimeAverageView: View {
    let done: () -> Void
    private var filter: DeviceActivityFilter {
        let end = Date()
        let start = Calendar.current.date(byAdding: .day, value: -7, to: Calendar.current.startOfDay(for: end)) ?? end
        return DeviceActivityFilter(segment: .daily(during: DateInterval(start: start, end: end)))
    }

    var body: some View {
        NavigationView {
            VStack(spacing: 12) {
                DeviceActivityReport(DeviceActivityReport.Context("average"), filter: filter)
                    .frame(height: 140)
                Text(L("Stell den Regler „Bisheriger Schnitt“ in OffLand auf diesen Wert. Apple zeigt die Zahl nur hier an, OffLand selbst bekommt sie nicht.", "Set the “Previous average” slider in OffLand to this value. Apple only shows the number here, OffLand itself never receives it."))
                    .font(.footnote)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                Spacer()
            }
            .padding(.top)
            .navigationTitle(L("Deine Bildschirmzeit", "Your screen time"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(L("Fertig", "Done")) { done() }
                }
            }
        }
    }
}
