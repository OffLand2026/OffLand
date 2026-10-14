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

    static func load() -> IslandData {
        guard let raw = UserDefaults(suiteName: "group.com.offland2026.offland")?.string(forKey: "widget"),
              let data = raw.data(using: .utf8),
              let v = try? JSONDecoder().decode(IslandData.self, from: data) else { return IslandData() }
        return v
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

    var body: some View {
        let h = Calendar.current.component(.hour, from: date)
        let night = h >= 21 || h < 6, evening = h >= 18
        let sky: [Color] = night ? [Color(red: 0.11, green: 0.14, blue: 0.25), Color(red: 0.14, green: 0.22, blue: 0.35)]
            : evening ? [Color(red: 0.48, green: 0.36, blue: 0.62), Color(red: 0.95, green: 0.6, blue: 0.48)]
            : [Color(red: 0.53, green: 0.75, blue: 0.9), Color(red: 0.78, green: 0.88, blue: 0.95)]
        GeometryReader { g in
            let w = g.size.width, ht = g.size.height
            ZStack {
                LinearGradient(colors: sky, startPoint: .top, endPoint: .bottom)
                Circle().fill(night ? Color(red: 0.95, green: 0.94, blue: 0.86) : Color(red: 1, green: 0.84, blue: 0.48))
                    .frame(width: w * 0.16).position(x: w * 0.8, y: ht * 0.22)
                Rectangle().fill(Color(red: 0.23, green: 0.44, blue: 0.66)).frame(height: ht * 0.42).position(x: w / 2, y: ht * 0.79)
                Ellipse().fill(Color(red: 0.91, green: 0.84, blue: 0.64)).frame(width: w * 0.7, height: ht * 0.2).position(x: w / 2, y: ht * 0.62)
                Ellipse().fill(glueck >= 50 ? Color(red: 0.49, green: 0.75, blue: 0.42) : Color(red: 0.55, green: 0.6, blue: 0.45))
                    .frame(width: w * 0.5, height: ht * 0.22).position(x: w / 2, y: ht * 0.55)
                Rectangle().fill(Color(red: 0.6, green: 0.42, blue: 0.24)).frame(width: w * 0.025, height: ht * 0.2).position(x: w * 0.4, y: ht * 0.42)
                Circle().fill(Color(red: 0.31, green: 0.6, blue: 0.35)).frame(width: w * 0.16).position(x: w * 0.4, y: ht * 0.32)
                if glueck >= 80 { Text("✨").font(.system(size: ht * 0.12)).position(x: w * 0.62, y: ht * 0.4) }
                if glueck < 40 { Text("☁️").font(.system(size: ht * 0.16)).position(x: w * 0.25, y: ht * 0.2) }
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

    var body: some View {
        let d = entry.data, open = d.entered != today && Calendar.current.component(.hour, from: entry.date) >= 17
        let lime = Color(red: 0.78, green: 0.95, blue: 0.41)
        let content = HStack(spacing: 0) {
            ZStack(alignment: .bottomLeading) {
                IslandScene(glueck: d.glueck, date: entry.date)
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(d.glueck) % Glück").font(.system(size: 13, weight: .heavy, design: .rounded)).foregroundColor(.white)
                    Text("🔥 \(d.streak) \(d.streak == 1 ? "Tag" : "Tage")").font(.system(size: 11, weight: .bold)).foregroundColor(.white.opacity(0.9))
                }
                .padding(8).background(Color.black.opacity(0.35)).cornerRadius(10).padding(8)
            }
            if family != .systemSmall {
                VStack(alignment: .leading, spacing: 6) {
                    Text(d.name).font(.system(size: 15, weight: .heavy, design: .rounded)).lineLimit(1)
                    Text("\(d.people) Menschen · \(d.animals) Tiere").font(.caption).foregroundColor(.secondary)
                    Spacer()
                    Text(open ? "Heute noch eintragen" : "Handy weg, Insel wächst")
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
        .configurationDisplayName("Deine Insel")
        .description("Glück und Serie deiner OffLand-Insel auf einen Blick.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
