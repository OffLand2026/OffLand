import ManagedSettings
import UserNotifications

/// Was die Knöpfe im Insel-Schutz tun.
/// „App schließen“: zählt als widerstanden, schließt die App und schickt einen kleinen Dank (von Mr. Bay oder Lucifer).
/// „Trotzdem öffnen“: zählt mit, gibt die Apps für ein paar Minuten Nutzung frei.
class ShieldActionExtension: ShieldActionDelegate {
    override func handle(action: ShieldAction, for application: ApplicationToken, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        respond(action, completionHandler)
    }
    override func handle(action: ShieldAction, for webDomain: WebDomainToken, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        respond(action, completionHandler)
    }
    override func handle(action: ShieldAction, for category: ActivityCategoryToken, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        respond(action, completionHandler)
    }

    private func respond(_ action: ShieldAction, _ done: @escaping (ShieldActionResponse) -> Void) {
        switch action {
        case .primaryButtonPressed:
            let n = IslandShield.count("res")
            thank(n)
            done(.close)
        case .secondaryButtonPressed:
            IslandShield.count("open")
            IslandShield.unlockForAWhile()
            done(.defer)
        @unknown default:
            done(.close)
        }
    }

    /// Mitteilung: ein Tipp darauf öffnet OffLand
    private func thank(_ n: Int) {
        let c = UNMutableNotificationContent()
        let m = IslandShield.thanks(n)
        c.title = m.title
        c.body = m.body
        c.sound = .default
        c.threadIdentifier = "offland.shield"
        let r = UNNotificationRequest(identifier: "offland.shield.thanks", content: c,
                                      trigger: UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false))
        UNUserNotificationCenter.current().add(r)
    }
}
