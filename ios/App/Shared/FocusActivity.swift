import Foundation
#if canImport(ActivityKit)
import ActivityKit

/// Live-Insel (Plus): die Fokus-Bootsfahrt auf dem Sperrbildschirm und in der Dynamic Island.
/// Die App startet sie (App/LiveIslandPlugin.swift), das Widget zeichnet sie (OffLandWidget/OffLandWidget.swift).
/// Die Texte kommen fertig übersetzt aus der App.
@available(iOS 16.1, *)
struct FocusActivityAttributes: ActivityAttributes {
    struct ContentState: Codable, Hashable {
        var end: Date          // Ende der Bootsfahrt
        var done: Bool         // angekommen
    }
    var start: Date
    var minutes: Int
    var task: String           // wofür die Fahrt genutzt wird
    var title: String          // „Fokus-Bootsfahrt“
    var who: String            // wer mitsegelt
    var watch: String          // „Lucifer passt auf“
    var doneText: String       // „Angekommen!“
}
#endif
