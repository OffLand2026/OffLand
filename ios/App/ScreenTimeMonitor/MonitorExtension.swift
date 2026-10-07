import Foundation
import DeviceActivity

/// Läuft im Hintergrund, auch wenn OffLand geschlossen ist. Bei jeder erreichten Schwelle
/// (15, 30, 45 … Minuten Bildschirmzeit heute) wird der höchste Wert pro Tag gemerkt.
class MonitorExtension: DeviceActivityMonitor {
    private let defaults = UserDefaults(suiteName: "group.com.offland2026.offland")

    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        let key = "st_" + MonitorExtension.dayKey(Date())
        if defaults?.object(forKey: key) == nil { defaults?.set(0, forKey: key) }
    }

    override func eventDidReachThreshold(_ event: DeviceActivityEvent.Name, activity: DeviceActivityName) {
        super.eventDidReachThreshold(event, activity: activity)
        guard event.rawValue.hasPrefix("m"), let minutes = Int(event.rawValue.dropFirst()) else { return }
        let key = "st_" + MonitorExtension.dayKey(Date())
        if (defaults?.integer(forKey: key) ?? 0) < minutes {
            defaults?.set(minutes, forKey: key)
        }
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
