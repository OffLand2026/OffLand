import Foundation
import FamilyControls
import ManagedSettings
import DeviceActivity

/// Insel-Schutz: Beim Öffnen gewählter Apps steht die Insel in der Tür (Apples „Shield“).
/// Gemeinsamer Teil für App, Monitor-Erweiterung, ShieldConfiguration und ShieldAction.
/// Alles liegt im gemeinsamen App-Group-Speicher, OffLand selbst sieht nie, welche Apps gewählt sind.
enum IslandShield {
    static let group = "group.com.offland2026.offland"
    static var defaults: UserDefaults? { UserDefaults(suiteName: group) }
    static let store = ManagedSettingsStore(named: ManagedSettingsStore.Name("offland.shield"))
    static let evening = DeviceActivityName("offland.shield.evening")
    static let relock = DeviceActivityName("offland.shield.relock")
    static let eveningHour = 21

    /// "off", "always", "evening" (ab 21 Uhr), "focus" (während der Fokus-Bootsfahrt) oder "plan" (eigene Zeitfenster, Plus)
    static var mode: String { defaults?.string(forKey: "shieldMode") ?? "off" }
    /// Wie lange „Trotzdem öffnen“ freigibt (Minuten Nutzung)
    static var unlockMinutes: Int { let v = defaults?.integer(forKey: "shieldUnlock") ?? 0; return v > 0 ? v : 5 }

    static func selection() -> FamilyActivitySelection? {
        guard let d = defaults?.data(forKey: "shieldSel") else { return nil }
        return try? PropertyListDecoder().decode(FamilyActivitySelection.self, from: d)
    }
    static func save(_ s: FamilyActivitySelection) {
        if let d = try? PropertyListEncoder().encode(s) { defaults?.set(d, forKey: "shieldSel") }
    }
    static func count(of s: FamilyActivitySelection?) -> Int {
        guard let s = s else { return 0 }
        return s.applicationTokens.count + s.categoryTokens.count + s.webDomainTokens.count
    }

    static func shouldShield(_ date: Date = Date()) -> Bool {
        switch mode {
        case "always": return true
        case "evening": return Calendar.current.component(.hour, from: date) >= eveningHour
        case "focus": return defaults?.bool(forKey: "shieldFocusOn") ?? false
        case "plan": return inWindow(date)
        default: return false
        }
    }

    // MARK: Eigene Zeitfenster (Plus): Minuten ab Mitternacht, Ende vor Anfang = über Mitternacht

    static var windows: [(Int, Int)] {
        guard let a = defaults?.array(forKey: "shieldWins") as? [[Int]] else { return [] }
        return a.compactMap { $0.count == 2 ? ($0[0], $0[1]) : nil }
    }
    static func saveWindows(_ w: [[Int]]) { defaults?.set(Array(w.prefix(4)), forKey: "shieldWins") }
    static func inWindow(_ date: Date) -> Bool {
        let c = Calendar.current.dateComponents([.hour, .minute], from: date)
        let m = (c.hour ?? 0) * 60 + (c.minute ?? 0)
        return windows.contains { s, e in
            let end = e >= 1440 ? 1440 : e
            return s < end ? (m >= s && m < end) : (m >= s || m < end)
        }
    }
    static func windowName(_ i: Int) -> DeviceActivityName { DeviceActivityName("offland.shield.w\(i)") }
    static func isWindow(_ a: DeviceActivityName) -> Bool { a.rawValue.hasPrefix("offland.shield.w") }
    /// Für jedes Fenster ein täglicher Zeitplan; Beginn und Ende schalten den Schutz in der Monitor-Erweiterung
    static func scheduleWindows(_ on: Bool) {
        let c = DeviceActivityCenter()
        c.stopMonitoring((0..<4).map(windowName))
        guard on else { return }
        for (i, w) in windows.prefix(4).enumerated() {
            let e = w.1 >= 1440 ? 1439 : w.1   // 24:00 heißt hier 23:59
            try? c.startMonitoring(windowName(i), during: DeviceActivitySchedule(
                intervalStart: DateComponents(hour: w.0 / 60, minute: w.0 % 60),
                intervalEnd: DateComponents(hour: e / 60, minute: e % 60),
                repeats: true))
        }
    }
    static func apply() {
        guard let s = selection(), count(of: s) > 0 else { clear(); return }
        store.shield.applications = s.applicationTokens.isEmpty ? nil : s.applicationTokens
        store.shield.applicationCategories = s.categoryTokens.isEmpty ? nil : .specific(s.categoryTokens)
        store.shield.webDomains = s.webDomainTokens.isEmpty ? nil : s.webDomainTokens
        store.shield.webDomainCategories = s.categoryTokens.isEmpty ? nil : .specific(s.categoryTokens)
    }
    static func clear() {
        store.shield.applications = nil
        store.shield.applicationCategories = nil
        store.shield.webDomains = nil
        store.shield.webDomainCategories = nil
    }
    /// Schutz an oder aus, je nach Modus und Uhrzeit
    static func refresh(_ date: Date = Date()) { if shouldShield(date) { apply() } else { clear() } }

    /// Abendmodus: Apple startet und beendet ihn über einen täglichen Zeitplan (Monitor-Erweiterung)
    static func scheduleEvening(_ on: Bool) {
        let c = DeviceActivityCenter()
        c.stopMonitoring([evening])
        guard on else { return }
        try? c.startMonitoring(evening, during: DeviceActivitySchedule(
            intervalStart: DateComponents(hour: eveningHour, minute: 0),
            intervalEnd: DateComponents(hour: 23, minute: 59),
            repeats: true))
    }

    /// „Trotzdem öffnen“: Schutz kurz aufheben und nach X Minuten Nutzung (spätestens nach 15 Minuten) wieder anschalten.
    /// Apple verlangt für Zeitpläne mindestens 15 Minuten, darum zählt die Nutzung als Ereignis darin.
    static func unlockForAWhile() {
        clear()
        guard let s = selection() else { return }
        let now = Date(), cal = Calendar.current
        let end = now.addingTimeInterval(Double(max(15, unlockMinutes + 1)) * 60)
        let parts: Set<Calendar.Component> = [.hour, .minute, .second]
        let schedule = DeviceActivitySchedule(intervalStart: cal.dateComponents(parts, from: now),
                                              intervalEnd: cal.dateComponents(parts, from: end), repeats: false)
        let event = DeviceActivityEvent(applications: s.applicationTokens, categories: s.categoryTokens,
                                        webDomains: s.webDomainTokens, threshold: DateComponents(minute: unlockMinutes))
        let c = DeviceActivityCenter()
        c.stopMonitoring([relock])
        do { try c.startMonitoring(relock, during: schedule, events: [DeviceActivityEvent.Name("relock"): event]) }
        catch { apply() }   // ohne Zeitplan (z. B. kurz vor Mitternacht) lieber gleich wieder schützen
    }

    // MARK: Zähler pro Tag

    static func dayKey(_ date: Date = Date()) -> String {
        let f = DateFormatter()
        f.calendar = Calendar(identifier: .gregorian)
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = TimeZone.current
        f.dateFormat = "yyyy-MM-dd"
        return f.string(from: date)
    }
    /// kind: "res" = widerstanden, "open" = trotzdem geöffnet
    @discardableResult static func count(_ kind: String) -> Int {
        let k = "sh_\(kind)_" + dayKey(), v = (defaults?.integer(forKey: k) ?? 0) + 1
        defaults?.set(v, forKey: k)
        return v
    }
    static func today(_ kind: String, day: String? = nil) -> Int { defaults?.integer(forKey: "sh_\(kind)_" + (day ?? dayKey())) ?? 0 }

    // MARK: Texte (Namen der Bewohner kommen aus der App)

    struct Info: Codable {
        var lang: String? = nil
        var names: [String]? = nil
        var pet: String? = nil
    }
    static func info() -> Info {
        guard let s = defaults?.string(forKey: "shieldInfo"), let d = s.data(using: .utf8),
              let i = try? JSONDecoder().decode(Info.self, from: d) else { return Info() }
        return i
    }
    static var english: Bool { !(info().lang ?? (Locale.preferredLanguages.first ?? "de")).hasPrefix("de") }

    private static func someone(_ i: Info, _ seed: Int) -> String {
        let names = (i.names ?? []).filter { !$0.isEmpty }
        if names.isEmpty { return english ? "Someone on your island" : "Jemand auf deiner Insel" }
        return names[seed % names.count]
    }

    static func message(app: String?) -> (title: String, subtitle: String) {
        let i = info(), en = english, res = today("res"), tries = res + today("open")
        let n = someone(i, tries), pet = i.pet ?? "Lucifer"
        let a = (app?.isEmpty == false) ? app! : (en ? "this app" : "diese App")
        let titles = en ? [
            "\(n) saved you a spot on the beach.",
            "\(n) asks if you're coming down to the pier.",
            "\(pet) saw you trying to open \(a).",
            "\(n) is building a sandcastle. Want to help?",
            "The sun is about to set on your island.",
            "\(n) is waiting by the campfire."
        ] : [
            "\(n) hat dir am Strand einen Platz freigehalten.",
            "\(n) fragt, ob du kurz zum Steg kommst.",
            "\(pet) hat gesehen, dass du \(a) öffnen wolltest.",
            "\(n) baut gerade eine Sandburg. Hilfst du mit?",
            "Auf deiner Insel geht gleich die Sonne unter.",
            "\(n) wartet am Lagerfeuer auf dich."
        ]
        let title = titles[tries % titles.count]
        let sub: String
        if tries == 0 {
            sub = en ? "Take a breath. Your island is one tap away." : "Kurz durchatmen. Deine Insel ist nur einen Tipp entfernt."
        } else if title.contains(pet) {
            sub = en ? "He's not saying anything. He's just looking." : "Er sagt nichts. Er guckt nur."
        } else {
            sub = en ? "You've been close \(tries + 1)× today. You resisted \(res)×." : "Du warst heute schon \(tries + 1)× kurz davor. \(res)× hast du widerstanden."
        }
        return (title, sub)
    }

    static func thanks(_ res: Int) -> String {
        let n = someone(info(), res)
        return english ? "💛 \(n) is happy! You resisted \(res)× today." : "💛 \(n) freut sich! Heute schon \(res)× widerstanden."
    }
}
