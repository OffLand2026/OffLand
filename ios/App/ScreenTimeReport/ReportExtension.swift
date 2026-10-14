import DeviceActivity
import SwiftUI

/// Zeigt im Start-Bildschirm den Tagesdurchschnitt der letzten 7 Tage an.
/// Apple lässt die Zahl nur hier in der abgeschotteten Erweiterung sehen: Die App selbst
/// bekommt sie nicht. Man liest den Wert ab und stellt den Regler darauf ein.
@main
struct OffLandReport: DeviceActivityReportExtension {
    var body: some DeviceActivityReportScene {
        AverageReport { text in AverageView(text: text) }
    }
}

extension DeviceActivityReport.Context {
    static let average = Self("average")
}

struct AverageReport: DeviceActivityReportScene {
    let context: DeviceActivityReport.Context = .average
    let content: (String) -> AverageView

    func makeConfiguration(representing data: DeviceActivityResults<DeviceActivityData>) async -> String {
        var total: TimeInterval = 0
        var days = Set<Date>()
        for await device in data {
            for await segment in device.activitySegments {
                total += segment.totalActivityDuration
                days.insert(Calendar.current.startOfDay(for: segment.dateInterval.start))
            }
        }
        guard !days.isEmpty else { return "–" }
        let minutes = Int(total / Double(days.count) / 60)
        return "\(minutes / 60) h \(minutes % 60) min"
    }
}

struct AverageView: View {
    let text: String

    var body: some View {
        VStack(spacing: 6) {
            Text("Dein Tagesdurchschnitt der letzten 7 Tage")
                .font(.subheadline)
                .foregroundColor(.secondary)
            Text(text)
                .font(.system(size: 40, weight: .heavy, design: .rounded))
        }
        .frame(maxWidth: .infinity)
        .padding()
    }
}
