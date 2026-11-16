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

    /// Wer im Schutz spricht: immer Lucifer (frech, schwarzer Humor) oder Mr. Bay (emotional, Verantwortung,
    /// „lass mich nicht allein“). Wechselt mit jedem Versuch, der Tag verschiebt den Anfang.
    /// Gleiche Texte in der Web-Vorschau (js/app.js, shieldMsg).
    static func lucLines(_ en: Bool, _ a: String) -> [String] {
        en ? ["“I have nine lives. You have one. And you're scrolling it away.”",
              "“Put it down. Or I'll push it off the table. You know I will.”",
              "“Your thumb has walked further today than you have.”",
              "“Your gravestone is ready: ‘Was only online for a minute.’”",
              "“Go ahead, open it. I'll watch. With popcorn.”",
              "“One more video and I inherit your deck chair.”",
              "“I told the shark you're coming for a swim. Don't let him down.”",
              "“\(a)? Again? I'm disappointed. And a little impressed.”"]
           : ["„Ich hab neun Leben. Du hast eins. Und das scrollst du gerade weg.“",
              "„Leg es weg. Sonst schubs ich es vom Tisch. Du weißt, ich mach das.“",
              "„Dein Daumen ist heute weiter gelaufen als du.“",
              "„Dein Grabstein steht schon: ‚War nur kurz online.‘“",
              "„Mach ruhig auf. Ich schau zu. Mit Popcorn.“",
              "„Noch ein Video, und ich erbe deinen Liegestuhl.“",
              "„Ich hab dem Hai gesagt, du kommst gleich schwimmen. Enttäusch ihn nicht.“",
              "„\(a)? Schon wieder? Ich bin enttäuscht. Und ein bisschen beeindruckt.“"]
    }
    static func bayLines(_ en: Bool, _ n: String) -> [String] {
        en ? ["“\(n) and I are saving you a spot on the pier.”",
              "“I'm sitting all alone on the pier. Are you coming back?”",
              "“The island needs you. And honestly, so do I.”",
              "“I lit the campfire just for you.”",
              "“You promised to look after us today.”",
              "“I'm not angry. Just a little sad.”",
              "“Who's going to water the palm tree while you're in here?”",
              "“Every minute in here is a minute missing on our island.”"]
           : ["„\(n) und ich halten dir am Steg einen Platz frei.“",
              "„Ich sitz hier ganz allein am Steg. Kommst du zurück?“",
              "„Die Insel braucht dich. Und ich, ehrlich gesagt, auch.“",
              "„Ich hab das Lagerfeuer extra für dich angemacht.“",
              "„Du hast versprochen, heute auf uns aufzupassen.“",
              "„Ich bin nicht böse. Nur ein bisschen traurig.“",
              "„Wer gießt die Palme, wenn du hier drin bist?“",
              "„Jede Minute hier drin fehlt uns auf der Insel.“"]
    }
    static var daySeed: Int { Int(Date().timeIntervalSince1970 / 86400) }

    static func message(app: String?) -> (title: String, subtitle: String, luc: Bool) {
        let i = info(), en = english, res = today("res"), tries = res + today("open")
        let n = someone(i, tries), pet = i.pet ?? "Lucifer"
        let a = (app?.isEmpty == false) ? app! : (en ? "this app" : "diese App")
        let seed = tries + daySeed, luc = seed % 2 == 1, k = seed / 2
        let lines = luc ? lucLines(en, a) : bayLines(en, n)
        let who = luc ? pet : "Mr. Bay"
        let tail = res > 0 ? (en ? "resisted \(res)× today" : "heute schon \(res)× widerstanden")
                           : (en ? "better put your phone down" : "leg dein Handy lieber weg")
        return (lines[k % lines.count], "\(who) · \(tail)", luc)
    }

    /// Mitteilung nach „App schließen“: Mr. Bay dankt gerührt, Lucifer ist fast beeindruckt
    static func thanks(_ res: Int) -> (title: String, body: String) {
        let en = english, pet = info().pet ?? "Lucifer"
        if (res + daySeed) % 2 == 0 {
            let b = en ? ["Thank you for staying. \(res)× resisted today. 💛", "You came back! The island can breathe again. 💛", "I knew I could count on you. \(res)× today. 💛"]
                       : ["Danke, dass du geblieben bist. Heute schon \(res)× widerstanden. 💛", "Du bist zurück! Die Insel atmet auf. 💛", "Ich wusste, auf dich ist Verlass. Heute \(res)×. 💛"]
            return ("Mr. Bay", b[res % b.count])
        }
        let l = en ? ["Hm. \(res)× resisted. I'm almost impressed. Almost.", "Fine. The shark gets the day off.", "Okay, you're still alive. \(res)× resisted."]
                   : ["Hm. \(res)× widerstanden. Ich bin fast beeindruckt. Fast.", "Na gut. Der Hai hat heute frei.", "Okay, du lebst noch. \(res)× widerstanden."]
        return (pet, l[res % l.count])
    }
}
