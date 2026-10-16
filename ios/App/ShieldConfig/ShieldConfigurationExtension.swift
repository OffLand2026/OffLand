import ManagedSettings
import ManagedSettingsUI
import UIKit

/// Wie der Insel-Schutz aussieht, wenn eine gewählte App geöffnet wird.
/// Apple gibt den Aufbau vor (Bild, Titel, Text, zwei Knöpfe), Farben und Texte kommen von uns.
class ShieldConfigurationExtension: ShieldConfigurationDataSource {
    override func configuration(shielding application: Application) -> ShieldConfiguration { make(application.localizedDisplayName) }
    override func configuration(shielding application: Application, in category: ActivityCategory) -> ShieldConfiguration { make(application.localizedDisplayName) }
    override func configuration(shielding webDomain: WebDomain) -> ShieldConfiguration { make(webDomain.domain) }
    override func configuration(shielding webDomain: WebDomain, in category: ActivityCategory) -> ShieldConfiguration { make(webDomain.domain) }

    private func make(_ app: String?) -> ShieldConfiguration {
        let m = IslandShield.message(app: app), en = IslandShield.english, mins = IslandShield.unlockMinutes
        let night = UIColor(red: 0.078, green: 0.082, blue: 0.122, alpha: 1)
        let ink = UIColor(red: 0.953, green: 0.945, blue: 0.918, alpha: 1)
        let muted = UIColor(red: 0.643, green: 0.651, blue: 0.741, alpha: 1)
        let lime = UIColor(red: 0.784, green: 0.945, blue: 0.412, alpha: 1)
        return ShieldConfiguration(
            backgroundBlurStyle: .systemThickMaterialDark,
            backgroundColor: night,
            icon: UIImage(named: "ShieldIcon"),
            title: ShieldConfiguration.Label(text: m.title, color: ink),
            subtitle: ShieldConfiguration.Label(text: m.subtitle, color: muted),
            primaryButtonLabel: ShieldConfiguration.Label(text: en ? "Back to the island" : "Zurück zur Insel", color: night),
            primaryButtonBackgroundColor: lime,
            secondaryButtonLabel: ShieldConfiguration.Label(text: en ? "Open anyway · \(mins) min" : "Trotzdem öffnen · \(mins) Min.", color: muted)
        )
    }
}
