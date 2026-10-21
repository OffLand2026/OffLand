import Foundation
import Capacitor
import ActivityKit

/// Live-Insel (Plus): Countdown der Fokus-Bootsfahrt auf dem Sperrbildschirm und in der Dynamic Island (ab iOS 16.1).
/// JS: start({start, end, minutes, task, title, who, watch, done}) mit Zeiten in ms seit 1970, end({done}).
@objc(LiveIslandPlugin)
public class LiveIslandPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "LiveIslandPlugin"
    public let jsName = "LiveIsland"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "start", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "end", returnType: CAPPluginReturnPromise)
    ]

    @objc func start(_ call: CAPPluginCall) {
        guard #available(iOS 16.1, *), ActivityAuthorizationInfo().areActivitiesEnabled else { return call.resolve(["started": false]) }
        let now = Date(), minutes = call.getInt("minutes") ?? 25
        let start = Date(timeIntervalSince1970: (call.getDouble("start") ?? now.timeIntervalSince1970 * 1000) / 1000)
        let end = Date(timeIntervalSince1970: (call.getDouble("end") ?? (start.timeIntervalSince1970 + Double(minutes * 60)) * 1000) / 1000)
        guard end > now else { return call.resolve(["started": false]) }
        let attrs = FocusActivityAttributes(start: start, minutes: minutes,
                                            task: call.getString("task") ?? "Fokus",
                                            title: call.getString("title") ?? "Fokus-Bootsfahrt",
                                            who: call.getString("who") ?? "",
                                            watch: call.getString("watch") ?? "Lucifer passt auf",
                                            doneText: call.getString("done") ?? "Angekommen!")
        let state = FocusActivityAttributes.ContentState(end: end, done: false)
        Task {
            for a in Activity<FocusActivityAttributes>.activities { await LiveIslandPlugin.stop(a, done: false) }   // immer nur eine Fahrt
            do {
                if #available(iOS 16.2, *) {
                    _ = try Activity.request(attributes: attrs, content: ActivityContent(state: state, staleDate: end.addingTimeInterval(15 * 60)))
                } else {
                    _ = try Activity.request(attributes: attrs, contentState: state)
                }
                call.resolve(["started": true])
            } catch {
                call.resolve(["started": false, "error": error.localizedDescription])
            }
        }
    }

    @objc func end(_ call: CAPPluginCall) {
        guard #available(iOS 16.1, *) else { return call.resolve() }
        let done = call.getBool("done") ?? false
        Task {
            for a in Activity<FocusActivityAttributes>.activities { await LiveIslandPlugin.stop(a, done: done) }
            call.resolve()
        }
    }

    /// Angekommen: „Angekommen!“ bleibt noch zehn Minuten stehen. Abgebrochen: sofort weg.
    @available(iOS 16.1, *)
    static func stop(_ a: Activity<FocusActivityAttributes>, done: Bool) async {
        let st = FocusActivityAttributes.ContentState(end: Date(), done: done)
        let policy: ActivityUIDismissalPolicy = done ? .after(Date().addingTimeInterval(10 * 60)) : .immediate
        if #available(iOS 16.2, *) {
            await a.end(ActivityContent(state: st, staleDate: nil), dismissalPolicy: policy)
        } else {
            await a.end(using: st, dismissalPolicy: policy)
        }
    }
}
