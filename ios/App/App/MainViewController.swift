import UIKit
import Capacitor
import UserNotifications

/// Eigener Bridge-Controller, damit die lokalen Plugins registriert werden.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(ScreenTimePlugin())
        bridge?.registerPluginInstance(FocusAlarmPlugin())
    }
}

/// Wecker für die Fokus-Bootsfahrt: eine Mitteilung mit Ton zum Ende der Fahrt,
/// die auch kommt, wenn das Handy gesperrt ist oder OffLand im Hintergrund liegt.
@objc(FocusAlarmPlugin)
public class FocusAlarmPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "FocusAlarmPlugin"
    public let jsName = "FocusAlarm"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "schedule", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "cancel", returnType: CAPPluginReturnPromise)
    ]
    static let requestId = "offland-focus"

    @objc func schedule(_ call: CAPPluginCall) {
        let seconds = call.getDouble("seconds") ?? 0
        let title = call.getString("title") ?? "OffLand"
        let body = call.getString("body") ?? ""
        let center = UNUserNotificationCenter.current()
        center.requestAuthorization(options: [.alert, .sound]) { granted, _ in
            guard granted, seconds > 0 else {
                call.resolve(["scheduled": false])
                return
            }
            let content = UNMutableNotificationContent()
            content.title = title
            content.body = body
            content.sound = .default
            let trigger = UNTimeIntervalNotificationTrigger(timeInterval: max(1, seconds), repeats: false)
            center.removePendingNotificationRequests(withIdentifiers: [FocusAlarmPlugin.requestId])
            center.add(UNNotificationRequest(identifier: FocusAlarmPlugin.requestId, content: content, trigger: trigger)) { error in
                call.resolve(["scheduled": error == nil])
            }
        }
    }

    @objc func cancel(_ call: CAPPluginCall) {
        let center = UNUserNotificationCenter.current()
        center.removePendingNotificationRequests(withIdentifiers: [FocusAlarmPlugin.requestId])
        center.removeDeliveredNotifications(withIdentifiers: [FocusAlarmPlugin.requestId])
        call.resolve()
    }
}
