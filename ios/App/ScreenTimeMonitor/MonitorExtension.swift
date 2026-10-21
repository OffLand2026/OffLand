import Foundation
import DeviceActivity
import WidgetKit

/// Läuft im Hintergrund, auch wenn OffLand geschlossen ist. Bei jeder erreichten Schwelle
/// (15, 30, 45 … Minuten Bildschirmzeit heute) wird der höchste Wert pro Tag gemerkt.
/// Außerdem schaltet sie den Insel-Schutz: abends und in eigenen Zeitfenstern an und aus, nach „Trotzdem öffnen“ wieder an.
class MonitorExtension: DeviceActivityMonitor {
    private let defaults = UserDefaults(suiteName: "group.com.offland2026.offland")

    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        if activity == IslandShield.evening || IslandShield.isWindow(activity) { IslandShield.refresh(Date().addingTimeInterval(30)); return }
        if activity == IslandShield.relock { return }
        let key = "st_" + MonitorExtension.dayKey(Date())
        if defaults?.object(forKey: key) == nil { defaults?.set(0, forKey: key) }
    }

    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        if activity == IslandShield.evening {
            // Abendfenster vorbei: Schutz aus, außer ein anderer Modus verlangt ihn
            if IslandShield.mode == "evening" { IslandShield.clear() } else { IslandShield.refresh() }
        } else if activity == IslandShield.relock {
            IslandShield.refresh()
        } else if IslandShield.isWindow(activity) {
            // Zeitfenster vorbei: Schutz aus, außer ein anderes Fenster läuft gerade
            IslandShield.refresh(Date().addingTimeInterval(30))
        }
    }

    override func eventDidReachThreshold(_ event: DeviceActivityEvent.Name, activity: DeviceActivityName) {
        super.eventDidReachThreshold(event, activity: activity)
        if activity == IslandShield.relock {
            // Die freigegebenen Minuten sind aufgebraucht: Insel wieder in die Tür stellen
            IslandShield.refresh()
            DeviceActivityCenter().stopMonitoring([IslandShield.relock])
            return
        }
        guard event.rawValue.hasPrefix("m"), let minutes = Int(event.rawValue.dropFirst()) else { return }
        let key = "st_" + MonitorExtension.dayKey(Date())
        if (defaults?.integer(forKey: key) ?? 0) < minutes {
            defaults?.set(minutes, forKey: key)
            WidgetCenter.shared.reloadAllTimelines()   // Wetter auf der Insel im Widget nachziehen
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
