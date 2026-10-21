import WidgetKit
import SwiftUI

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
    var en: Bool { !(lang ?? (Locale.preferredLanguages.first ?? "de")).hasPrefix("de") }

    static func load() -> IslandData {
        guard let raw = UserDefaults(suiteName: "group.com.offland2026.offland")?.string(forKey: "widget"),
              let data = raw.data(using: .utf8),
              let v = try? JSONDecoder().decode(IslandData.self, from: data) else { return IslandData() }
        return v
    }

    /// Wetter auf der Insel aus der heute gemessenen Bildschirmzeit (Monitor-Erweiterung):
    /// -1 keine Messung, 0 Sonne, 1 Wolken (über 60 % vom Budget), 2 Regen (Budget überschritten)
    func weather(_ date: Date) -> Int {
        let f = DateFormatter(); f.locale = Locale(identifier: "en_US_POSIX"); f.dateFormat = "yyyy-MM-dd"
        let key = "st_" + f.string(from: date)
        guard let ud = UserDefaults(suiteName: "group.com.offland2026.offland"), ud.object(forKey: key) != nil else { return -1 }
        let m = Double(ud.integer(forKey: key)), b = Double(max(30, budget ?? 180))
        return m >= b ? 2 : m >= b * 0.6 ? 1 : 0
    }
}

struct IslandEntry: TimelineEntry {
    let date: Date
    let data: IslandData
}

struct IslandProvider: TimelineProvider {
    func placeholder(in context: Context) -> IslandEntry { IslandEntry(date: Date(), data: IslandData(glueck: 80, streak: 5, people: 6, animals: 3)) }
    func getSnapshot(in context: Context, completion: @escaping (IslandEntry) -> Void) { completion(IslandEntry(date: Date(), data: IslandData.load())) }
    func getTimeline(in context: Context, completion: @escaping (Timeline<IslandEntry>) -> Void) {
        // stündlich neu zeichnen, damit Tageszeit und „heute eintragen“ stimmen
        let next = Calendar.current.date(byAdding: .hour, value: 1, to: Date()) ?? Date().addingTimeInterval(3600)
        completion(Timeline(entries: [IslandEntry(date: Date(), data: IslandData.load())], policy: .after(next)))
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

struct OffLandWidgetView: View {
    @Environment(\.widgetFamily) var family
    let entry: IslandEntry

    private var today: String {
        let f = DateFormatter(); f.locale = Locale(identifier: "en_US_POSIX"); f.dateFormat = "yyyy-MM-dd"
        return f.string(from: entry.date)
    }

    /// Sperrbildschirm: nur das Wetter in Worten, ohne Zahlen
    private func lockLine(_ d: IslandData) -> String {
        switch d.weather(entry.date) {
        case 0: return d.en ? "☀️ Sunny on your island" : "☀️ Sonnig auf deiner Insel"
        case 1: return d.en ? "⛅ Clouds rolling in" : "⛅ Wolken ziehen auf"
        case 2: return d.en ? "🌧️ Rain, everyone's inside" : "🌧️ Regen, alle sind drinnen"
        default: return "🏝️ " + d.name
        }
    }

    var body: some View {
        if family == .accessoryRectangular {
            let d = entry.data
            let lock = VStack(alignment: .leading, spacing: 2) {
                Text(lockLine(d)).font(.system(size: 14, weight: .bold)).lineLimit(1)
                Text(d.en ? "\(d.glueck) % happy · 🔥 \(d.streak)" : "\(d.glueck) % Glück · 🔥 \(d.streak)").font(.system(size: 12)).foregroundColor(.secondary).lineLimit(1)
            }.frame(maxWidth: .infinity, alignment: .leading)
            if #available(iOS 17.0, *) { lock.containerBackground(.clear, for: .widget) } else { lock }
        } else {
            homeView
        }
    }

    @ViewBuilder private var homeView: some View {
        let d = entry.data, open = d.entered != today && Calendar.current.component(.hour, from: entry.date) >= 17
        let lime = Color(red: 0.78, green: 0.95, blue: 0.41)
        let content = HStack(spacing: 0) {
            ZStack(alignment: .bottomLeading) {
                IslandScene(glueck: d.glueck, date: entry.date, weather: d.weather(entry.date))
                VStack(alignment: .leading, spacing: 2) {
                    Text(d.en ? "\(d.glueck) % happy" : "\(d.glueck) % Glück").font(.system(size: 13, weight: .heavy, design: .rounded)).foregroundColor(.white)
                    Text("🔥 \(d.streak) " + (d.en ? (d.streak == 1 ? "day" : "days") : (d.streak == 1 ? "Tag" : "Tage"))).font(.system(size: 11, weight: .bold)).foregroundColor(.white.opacity(0.9))
                }
                .padding(8).background(Color.black.opacity(0.35)).cornerRadius(10).padding(8)
            }
            if family != .systemSmall {
                VStack(alignment: .leading, spacing: 6) {
                    Text(d.name).font(.system(size: 15, weight: .heavy, design: .rounded)).lineLimit(1)
                    Text(d.en ? "\(d.people) people · \(d.animals) animals" : "\(d.people) Menschen · \(d.animals) Tiere").font(.caption).foregroundColor(.secondary)
                    Spacer()
                    Text(open ? (d.en ? "Log today" : "Heute noch eintragen") : (d.en ? "Phone away, island grows" : "Handy weg, Insel wächst"))
                        .font(.system(size: 12, weight: .bold)).foregroundColor(open ? .orange : lime)
                }
                .padding(12).frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        if #available(iOS 17.0, *) {
            content.containerBackground(Color(red: 0.08, green: 0.08, blue: 0.12), for: .widget)
        } else {
            content.background(Color(red: 0.08, green: 0.08, blue: 0.12))
        }
    }
}

@main
struct OffLandWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "OffLandWidget", provider: IslandProvider()) { entry in
            OffLandWidgetView(entry: entry)
        }
        .configurationDisplayName((Locale.preferredLanguages.first ?? "de").hasPrefix("de") ? "Deine Insel" : "Your island")
        .description((Locale.preferredLanguages.first ?? "de").hasPrefix("de") ? "Glück und Serie deiner OffLand-Insel auf einen Blick." : "Your OffLand island's happiness and streak at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular])
    }
}
