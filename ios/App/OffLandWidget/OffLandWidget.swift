import WidgetKit
import SwiftUI
import UIKit

/// Homescreen-Widget: zeigt die Insel mit Glück und Serie, ohne die App zu öffnen.
/// Die App legt die Werte im gemeinsamen Speicher ab (ScreenTimePlugin.widget).
struct IslandData: Codable {
    var name: String = "Deine Insel"
    var glueck: Int = 50
    var streak: Int = 0
    var people: Int = 0
    var animals: Int = 0
    var entered: String = ""      // zuletzt eingetragener Tag, JJJJ-MM-TT
    var lang: String? = nil       // Sprache der App: "de" oder "en"
    var budget: Int? = nil        // Tagesbudget in Minuten, für das Wetter
    var week: [Int?]? = nil       // eingetragene Minuten der letzten 7 Tage, heute zuletzt
    var imgPhase: String? = nil   // Tageszeit, zu der die App das Inselbild gezeichnet hat
    var en: Bool { !(lang ?? (Locale.preferredLanguages.first ?? "de")).hasPrefix("de") }

    static let group = "group.com.offland2026.offland"

    /// Werte aus dem gemeinsamen Speicher. Fehlt der Zugriff auf die App-Gruppe oder hat die App noch
    /// nichts abgelegt, sagt das Widget das ehrlich, statt erfundene Zahlen zu zeigen.
    static func loadLinked() -> (IslandData, WidgetLink) {
        guard let container = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: group) else { return (IslandData(), .noGroup) }
        let fromFile = try? Data(contentsOf: container.appendingPathComponent("widget.json"))
        let fromDefaults = UserDefaults(suiteName: group)?.string(forKey: "widget")?.data(using: .utf8)
        for data in [fromFile, fromDefaults].compactMap({ $0 }) {
            if let v = try? JSONDecoder().decode(IslandData.self, from: data) { return (v, .ok) }
        }
        return (IslandData(), .noData)
    }

    /// Wetter auf der Insel aus der heute gemessenen Bildschirmzeit (Monitor-Erweiterung):
    /// -1 keine Messung, 0 Sonne, 1 Wolken (über 60 % vom Budget), 2 Regen (Budget überschritten)
    func weather(_ date: Date) -> Int {
        guard let used = usedToday(date) else { return -1 }
        let m = Double(used), b = Double(budgetMin)
        return m >= b ? 2 : m >= b * 0.6 ? 1 : 0
    }

    var budgetMin: Int { max(30, budget ?? 180) }

    static func dayKey(_ date: Date) -> String {
        let f = DateFormatter(); f.locale = Locale(identifier: "en_US_POSIX"); f.dateFormat = "yyyy-MM-dd"
        return f.string(from: date)
    }

    /// Heute schon gemessene Bildschirmzeit in Minuten (Monitor-Erweiterung, in 15-Minuten-Schritten).
    /// nil, solange nichts gemessen wird (z. B. ohne Freigabe für Family Controls).
    func usedToday(_ date: Date) -> Int? {
        let key = "st_" + IslandData.dayKey(date)
        guard let ud = UserDefaults(suiteName: IslandData.group), ud.object(forKey: key) != nil else { return nil }
        return ud.integer(forKey: key)
    }

    /// Tageszeit wie in der App (skyNow): Nacht, Morgen, Tag, Abend
    static func phase(_ date: Date) -> String {
        let h = Calendar.current.component(.hour, from: date)
        return (h >= 21 || h < 6) ? "nacht" : h < 9 ? "morgen" : h < 18 ? "tag" : "abend"
    }

    /// Das Inselbild aus der App, aber nur, wenn es zur aktuellen Tageszeit passt
    func islandImage(_ date: Date) -> UIImage? {
        guard imgPhase == IslandData.phase(date),
              let c = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: IslandData.group) else { return nil }
        return UIImage(contentsOfFile: c.appendingPathComponent("island.png").path)
    }

    static func hm(_ m: Int) -> String {
        if m < 60 { return "\(m) min" }
        return m % 60 == 0 ? "\(m / 60) h" : String(format: "%d:%02d h", m / 60, m % 60)
    }
}

/// Nachsichtig lesen: fehlende Felder bekommen Standardwerte, Kommazahlen werden gerundet.
/// So scheitert nicht das ganze Widget an einem einzelnen unerwarteten Wert.
extension IslandData {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        func num(_ k: CodingKeys) -> Int? {
            guard let v = try? c.decode(Double.self, forKey: k), v.isFinite else { return nil }
            return Int(v.rounded())
        }
        self.init()
        if let v = try? c.decode(String.self, forKey: .name), !v.isEmpty { name = v }
        glueck = num(.glueck) ?? glueck
        streak = num(.streak) ?? streak
        people = num(.people) ?? people
        animals = num(.animals) ?? animals
        entered = (try? c.decode(String.self, forKey: .entered)) ?? ""
        lang = try? c.decode(String.self, forKey: .lang)
        budget = num(.budget)
        week = try? c.decode([Int?].self, forKey: .week)
        imgPhase = try? c.decode(String.self, forKey: .imgPhase)
    }
}

enum WidgetLink { case ok, noGroup, noData }

struct IslandEntry: TimelineEntry {
    let date: Date
    let data: IslandData
    var link: WidgetLink = .ok

    /// Hinweis statt Zahlen, solange keine echten Werte da sind
    var hint: String? {
        switch link {
        case .ok: return nil
        case .noGroup: return data.en ? "Widget can't reach the app" : "Widget hat keinen Zugriff auf die App"
        case .noData: return data.en ? "Open OffLand once" : "Öffne OffLand einmal"
        }
    }
}

struct IslandProvider: TimelineProvider {
    func placeholder(in context: Context) -> IslandEntry { IslandEntry(date: Date(), data: IslandData(glueck: 80, streak: 5, people: 6, animals: 3)) }
    func getSnapshot(in context: Context, completion: @escaping (IslandEntry) -> Void) {
        let (d, link) = IslandData.loadLinked()
        completion(IslandEntry(date: Date(), data: d, link: link))
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<IslandEntry>) -> Void) {
        // stündlich neu zeichnen, damit Tageszeit und „heute eintragen“ stimmen
        let next = Calendar.current.date(byAdding: .hour, value: 1, to: Date()) ?? Date().addingTimeInterval(3600)
        let (d, link) = IslandData.loadLinked()
        completion(Timeline(entries: [IslandEntry(date: Date(), data: d, link: link)], policy: .after(next)))
    }
}

struct IslandScene: View {
    let glueck: Int
    let date: Date
    var weather: Int = -1

    var body: some View {
        let h = Calendar.current.component(.hour, from: date)
        let night = h >= 21 || h < 6, evening = h >= 18
        let sky: [Color] = weather == 2 ? [Color(red: 0.29, green: 0.31, blue: 0.41), Color(red: 0.42, green: 0.45, blue: 0.56)]
            : weather == 1 && !night ? [Color(red: 0.56, green: 0.61, blue: 0.72), Color(red: 0.74, green: 0.78, blue: 0.85)]
            : night ? [Color(red: 0.11, green: 0.14, blue: 0.25), Color(red: 0.14, green: 0.22, blue: 0.35)]
            : evening ? [Color(red: 0.48, green: 0.36, blue: 0.62), Color(red: 0.95, green: 0.6, blue: 0.48)]
            : [Color(red: 0.53, green: 0.75, blue: 0.9), Color(red: 0.78, green: 0.88, blue: 0.95)]
        GeometryReader { g in
            let w = g.size.width, ht = g.size.height
            ZStack {
                LinearGradient(colors: sky, startPoint: .top, endPoint: .bottom)
                if weather < 2 {
                    Circle().fill(night ? Color(red: 0.95, green: 0.94, blue: 0.86) : Color(red: 1, green: 0.84, blue: 0.48))
                        .frame(width: w * 0.16).position(x: w * 0.8, y: ht * 0.22)
                }
                Rectangle().fill(Color(red: 0.23, green: 0.44, blue: 0.66)).frame(height: ht * 0.42).position(x: w / 2, y: ht * 0.79)
                Ellipse().fill(Color(red: 0.91, green: 0.84, blue: 0.64)).frame(width: w * 0.7, height: ht * 0.2).position(x: w / 2, y: ht * 0.62)
                Ellipse().fill(glueck >= 50 ? Color(red: 0.49, green: 0.75, blue: 0.42) : Color(red: 0.55, green: 0.6, blue: 0.45))
                    .frame(width: w * 0.5, height: ht * 0.22).position(x: w / 2, y: ht * 0.55)
                Rectangle().fill(Color(red: 0.6, green: 0.42, blue: 0.24)).frame(width: w * 0.025, height: ht * 0.2).position(x: w * 0.4, y: ht * 0.42)
                Circle().fill(Color(red: 0.31, green: 0.6, blue: 0.35)).frame(width: w * 0.16).position(x: w * 0.4, y: ht * 0.32)
                if glueck >= 80 { Text("✨").font(.system(size: ht * 0.12)).position(x: w * 0.62, y: ht * 0.4) }
                if weather >= 1 {
                    Ellipse().fill(Color.white.opacity(weather == 2 ? 0.55 : 0.8)).frame(width: w * 0.34, height: ht * 0.11).position(x: w * 0.32, y: ht * 0.2)
                    Ellipse().fill(Color.white.opacity(weather == 2 ? 0.45 : 0.7)).frame(width: w * 0.3, height: ht * 0.1).position(x: w * 0.66, y: ht * 0.16)
                }
                if weather == 2 {
                    ForEach(0..<7, id: \.self) { i in
                        Rectangle().fill(Color(red: 0.75, green: 0.8, blue: 0.95).opacity(0.8)).frame(width: 1.5, height: ht * 0.08)
                            .rotationEffect(.degrees(15)).position(x: w * (0.14 + Double(i) * 0.12), y: ht * (0.32 + Double(i % 2) * 0.06))
                    }
                } else if weather < 0 && glueck < 40 { Text("☁️").font(.system(size: ht * 0.16)).position(x: w * 0.25, y: ht * 0.2) }
            }
        }
    }
}

/// Ring: wie viel vom Tagesbudget heute schon verbraucht ist. Ohne Messung zeigt er das Inselglück.
struct RingState {
    let frac: Double, color: Color, big: String, small: String, short: String
}

enum WColor {
    static let lime = Color(red: 0.78, green: 0.95, blue: 0.41)
    static let amber = Color(red: 1.0, green: 0.82, blue: 0.48)
    static let coral = Color(red: 1.0, green: 0.61, blue: 0.48)
    static let ground = Color(red: 0.08, green: 0.08, blue: 0.12)
}

struct BudgetRing<Inner: View>: View {
    let frac: Double
    let color: Color
    let line: CGFloat
    let inner: Inner
    init(frac: Double, color: Color, line: CGFloat, @ViewBuilder inner: () -> Inner) {
        self.frac = frac; self.color = color; self.line = line; self.inner = inner()
    }
    var body: some View {
        ZStack {
            Circle().stroke(Color.white.opacity(0.14), lineWidth: line)
            Circle().trim(from: 0, to: CGFloat(min(1, max(0.002, frac))))
                .stroke(color, style: StrokeStyle(lineWidth: line, lineCap: .round))
                .rotationEffect(.degrees(-90))
            inner.clipShape(Circle()).padding(line * 1.3)
        }
    }
}

/// Balken der letzten 7 Tage mit gestrichelter Budgetlinie; heute (zuletzt) live aus der Messung, falls noch nicht eingetragen
struct WeekBars: View {
    let values: [Int?]
    let budget: Int
    let labels: [String]
    let live: Bool
    var body: some View {
        GeometryReader { g in
            let barH = max(10, g.size.height - 14)
            let top = Double(max(budget * 3 / 2, values.compactMap { $0 }.max() ?? 0, 60))
            ZStack(alignment: .topLeading) {
                HStack(alignment: .bottom, spacing: 5) {
                    ForEach(0..<values.count, id: \.self) { i in
                        VStack(spacing: 3) {
                            Spacer(minLength: 0)
                            RoundedRectangle(cornerRadius: 3.5)
                                .fill(values[i] == nil ? Color.white.opacity(0.18) : (values[i]! <= budget ? WColor.lime : WColor.coral))
                                .frame(height: max(3, barH * CGFloat(Double(values[i] ?? 0) / top)))
                                .opacity(live && i == values.count - 1 ? 0.65 : 1)
                            Text(labels[i]).font(.system(size: 8.5, weight: .bold)).foregroundColor(.white.opacity(0.55)).frame(height: 11)
                        }
                    }
                }
                Path { p in
                    let y = barH * (1 - CGFloat(Double(budget) / top))
                    p.move(to: CGPoint(x: 0, y: y)); p.addLine(to: CGPoint(x: g.size.width, y: y))
                }
                .stroke(Color.white.opacity(0.35), style: StrokeStyle(lineWidth: 1, dash: [3, 3]))
            }
        }
    }
}

struct OffLandWidgetView: View {
    @Environment(\.widgetFamily) var family
    let entry: IslandEntry

    /// Sperrbildschirm: nur das Wetter in Worten, ohne Zahlen
    private func lockLine(_ d: IslandData) -> String {
        switch d.weather(entry.date) {
        case 0: return d.en ? "☀️ Sunny on your island" : "☀️ Sonnig auf deiner Insel"
        case 1: return d.en ? "⛅ Clouds rolling in" : "⛅ Wolken ziehen auf"
        case 2: return d.en ? "🌧️ Rain, everyone's inside" : "🌧️ Regen, alle sind drinnen"
        default: return "🏝️ " + d.name
        }
    }

    private func lockSub(_ d: IslandData, _ r: RingState) -> String {
        if let hint = entry.hint { return hint }
        if d.usedToday(entry.date) != nil { return "\(r.big) \(r.small) · 🔥 \(d.streak)" }
        return d.en ? "\(d.glueck) % happy · 🔥 \(d.streak)" : "\(d.glueck) % Glück · 🔥 \(d.streak)"
    }

    private func ring(_ d: IslandData) -> RingState {
        if let used = d.usedToday(entry.date) {
            let f = Double(used) / Double(d.budgetMin)
            let col = f >= 1 ? WColor.coral : f >= 0.6 ? WColor.amber : WColor.lime
            let short = used < 60 ? "\(used)m" : String(format: "%d:%02d", used / 60, used % 60)
            return RingState(frac: f, color: col, big: IslandData.hm(used),
                             small: (d.en ? "of " : "von ") + IslandData.hm(d.budgetMin) + (d.en ? " today" : " heute"), short: short)
        }
        return RingState(frac: Double(d.glueck) / 100, color: WColor.lime, big: "\(d.glueck) %",
                         small: d.en ? "island happiness" : "Inselglück", short: "\(d.glueck)")
    }

    @ViewBuilder private func island(_ d: IslandData) -> some View {
        if let img = d.islandImage(entry.date) {
            Image(uiImage: img).resizable().scaledToFill()
        } else {
            IslandScene(glueck: d.glueck, date: entry.date, weather: d.weather(entry.date))
        }
    }

    private func weekValues(_ d: IslandData) -> ([Int?], Bool) {
        var v: [Int?] = Array((d.week ?? []).suffix(7))
        while v.count < 7 { v.insert(nil, at: 0) }
        if v[6] == nil, let used = d.usedToday(entry.date) { v[6] = used; return (v, true) }
        return (v, false)
    }

    private func weekLabels(_ d: IslandData) -> [String] {
        let f = DateFormatter(); f.locale = Locale(identifier: d.en ? "en_US" : "de_DE"); f.dateFormat = "EEEEE"
        return (0..<7).map { i in f.string(from: Calendar.current.date(byAdding: .day, value: i - 6, to: entry.date) ?? entry.date) }
    }

    private func weekLine(_ d: IslandData) -> String {
        let logged = (d.week ?? []).compactMap { $0 }
        if logged.isEmpty { return d.en ? "No days logged yet" : "Noch keine Tage eingetragen" }
        let good = logged.filter { $0 <= d.budgetMin }.count
        let goal = IslandData.hm(d.budgetMin)
        return d.en ? "\(good) of \(logged.count) days under \(goal)" : "\(good) von \(logged.count) Tagen unter \(goal)"
    }

    var body: some View {
        let d = entry.data
        switch family {
        case .accessoryRectangular:
            let r = ring(d)
            let lock = VStack(alignment: .leading, spacing: 2) {
                Text(lockLine(d)).font(.system(size: 14, weight: .bold)).lineLimit(1)
                Text(lockSub(d, r)).font(.system(size: 12)).foregroundColor(.secondary).lineLimit(1)
            }.frame(maxWidth: .infinity, alignment: .leading)
            if #available(iOS 17.0, *) { lock.containerBackground(.clear, for: .widget) } else { lock }
        case .accessoryCircular:
            let r = ring(d)
            let lock = ZStack {
                Circle().stroke(Color.white.opacity(0.25), lineWidth: 4)
                Circle().trim(from: 0, to: CGFloat(min(1, max(0.002, r.frac))))
                    .stroke(Color.white, style: StrokeStyle(lineWidth: 4, lineCap: .round)).rotationEffect(.degrees(-90))
                VStack(spacing: 0) {
                    Text("🏝️").font(.system(size: 10))
                    Text(entry.hint == nil ? r.short : "–").font(.system(size: 14, weight: .heavy, design: .rounded)).minimumScaleFactor(0.6).lineLimit(1)
                }
            }.padding(2)
            if #available(iOS 17.0, *) { lock.containerBackground(.clear, for: .widget) } else { lock }
        default:
            homeView
        }
    }

    @ViewBuilder private var homeView: some View {
        let d = entry.data, r = ring(d)
        let content = Group {
            if let hint = entry.hint {
                VStack(alignment: .leading, spacing: 6) {
                    Text("OffLand").font(.system(size: 15, weight: .heavy, design: .rounded))
                    Text(hint).font(.system(size: 12, weight: .semibold)).foregroundColor(.white.opacity(0.75)).lineLimit(3)
                    Spacer(minLength: 0)
                }.padding(14).frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            } else if family == .systemSmall {
                VStack(spacing: 6) {
                    BudgetRing(frac: r.frac, color: r.color, line: 8) { island(d) }
                        .frame(width: 94, height: 94)
                    VStack(spacing: 1) {
                        Text(r.big).font(.system(size: 17, weight: .heavy, design: .rounded)).lineLimit(1)
                        Text(r.small + " · 🔥 \(d.streak)").font(.system(size: 10.5, weight: .semibold))
                            .foregroundColor(.white.opacity(0.7)).lineLimit(1).minimumScaleFactor(0.75)
                    }
                }.frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                let wv = weekValues(d)
                HStack(spacing: 14) {
                    VStack(spacing: 4) {
                        BudgetRing(frac: r.frac, color: r.color, line: 8) { island(d) }
                            .frame(width: 100, height: 100)
                        Text(r.big).font(.system(size: 15, weight: .heavy, design: .rounded)).lineLimit(1)
                        Text(r.small).font(.system(size: 9.5, weight: .semibold)).foregroundColor(.white.opacity(0.65)).lineLimit(1).minimumScaleFactor(0.7)
                    }.frame(width: 112)
                    VStack(alignment: .leading, spacing: 3) {
                        HStack {
                            Text(d.en ? "This week" : "Diese Woche").font(.system(size: 14, weight: .heavy, design: .rounded))
                            Spacer()
                            Text("🔥 \(d.streak)").font(.system(size: 12, weight: .heavy)).foregroundColor(WColor.lime)
                        }
                        Text(weekLine(d)).font(.system(size: 10.5, weight: .semibold)).foregroundColor(.white.opacity(0.65)).lineLimit(1).minimumScaleFactor(0.8)
                        WeekBars(values: wv.0, budget: d.budgetMin, labels: weekLabels(d), live: wv.1).padding(.top, 4)
                    }
                }.padding(14)
            }
        }
        .foregroundColor(.white)
        if #available(iOS 17.0, *) {
            content.containerBackground(WColor.ground, for: .widget)
        } else {
            content.background(WColor.ground)
        }
    }
}

struct OffLandWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "OffLandWidget", provider: IslandProvider()) { entry in
            OffLandWidgetView(entry: entry)
        }
        .configurationDisplayName((Locale.preferredLanguages.first ?? "de").hasPrefix("de") ? "Deine Insel" : "Your island")
        .description((Locale.preferredLanguages.first ?? "de").hasPrefix("de") ? "Deine Insel, dein Tagesbudget und deine Woche auf einen Blick." : "Your island, today's budget and your week at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryCircular, .accessoryRectangular])
    }
}

@main
struct OffLandWidgets: WidgetBundle {
    var body: some Widget {
        OffLandWidget()
        if #available(iOSApplicationExtension 16.1, *) {
            FocusLiveActivity()
        }
    }
}

// MARK: - Live-Insel (Plus): Fokus-Bootsfahrt auf dem Sperrbildschirm und in der Dynamic Island

enum FocusLive {
    static let lime = Color(red: 0.78, green: 0.95, blue: 0.41)
    static let lilac = Color(red: 0.71, green: 0.64, blue: 1.0)
    static let ink = Color(red: 0.95, green: 0.95, blue: 0.92)
    static let muted = Color(red: 0.64, green: 0.65, blue: 0.74)
    static let ground = Color(red: 0.08, green: 0.08, blue: 0.12)
}

@available(iOSApplicationExtension 16.1, *)
struct FocusTimer: View {
    let a: FocusActivityAttributes
    let s: FocusActivityAttributes.ContentState
    var body: some View {
        if s.done {
            Text("✓")
        } else {
            Text(timerInterval: a.start...max(s.end, a.start.addingTimeInterval(1)), countsDown: true)
                .monospacedDigit()
                .multilineTextAlignment(.trailing)
        }
    }
}

@available(iOSApplicationExtension 16.1, *)
struct FocusBar: View {
    let a: FocusActivityAttributes
    let s: FocusActivityAttributes.ContentState
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            if s.done {
                Text(a.doneText).font(.headline).foregroundColor(FocusLive.lime)
            } else {
                ProgressView(timerInterval: a.start...max(s.end, a.start.addingTimeInterval(1)), countsDown: false) {
                    EmptyView()
                } currentValueLabel: {
                    EmptyView()
                }
                .tint(FocusLive.lime)
            }
            HStack(spacing: 6) {
                Text("🐈‍⬛")
                Text(a.watch).font(.caption.bold()).foregroundColor(FocusLive.lilac).lineLimit(1)
                Spacer(minLength: 4)
                Text(a.title).font(.caption2).foregroundColor(FocusLive.muted).lineLimit(1)
            }
        }
    }
}

@available(iOSApplicationExtension 16.1, *)
struct FocusLockView: View {
    let a: FocusActivityAttributes
    let s: FocusActivityAttributes.ContentState
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 12) {
                Text("⛵").font(.system(size: 34))
                VStack(alignment: .leading, spacing: 2) {
                    Text(a.task).font(.headline).foregroundColor(FocusLive.ink).lineLimit(1)
                    Text(a.who.isEmpty ? a.title : a.who).font(.subheadline).foregroundColor(FocusLive.muted).lineLimit(1)
                }
                Spacer(minLength: 6)
                FocusTimer(a: a, s: s)
                    .font(.system(size: 30, weight: .heavy, design: .rounded))
                    .foregroundColor(FocusLive.lime)
                    .frame(maxWidth: 120, alignment: .trailing)
            }
            FocusBar(a: a, s: s)
        }
        .padding(16)
    }
}

@available(iOSApplicationExtension 16.1, *)
struct FocusLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: FocusActivityAttributes.self) { context in
            FocusLockView(a: context.attributes, s: context.state)
                .activityBackgroundTint(FocusLive.ground)
                .activitySystemActionForegroundColor(FocusLive.ink)
        } dynamicIsland: { context in
            let a = context.attributes, s = context.state
            return DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Text("⛵").font(.system(size: 30)).padding(.leading, 4)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    FocusTimer(a: a, s: s)
                        .font(.system(size: 24, weight: .heavy, design: .rounded))
                        .foregroundColor(FocusLive.lime)
                        .frame(maxWidth: 96, alignment: .trailing)
                        .padding(.trailing, 4)
                }
                DynamicIslandExpandedRegion(.center) {
                    VStack(spacing: 1) {
                        Text(a.task).font(.headline).lineLimit(1)
                        Text(a.who.isEmpty ? a.title : a.who).font(.caption).foregroundColor(FocusLive.muted).lineLimit(1)
                    }
                }
                DynamicIslandExpandedRegion(.bottom) {
                    FocusBar(a: a, s: s).padding(.horizontal, 4)
                }
            } compactLeading: {
                Text("⛵")
            } compactTrailing: {
                FocusTimer(a: a, s: s)
                    .font(.system(size: 14, weight: .bold, design: .rounded))
                    .foregroundColor(FocusLive.lime)
                    .frame(maxWidth: 44)
            } minimal: {
                Text("⛵")
            }
            .keylineTint(FocusLive.lime)
        }
    }
}
