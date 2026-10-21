import Foundation
import UIKit
import Capacitor
import StoreKit

/// OffLand Plus: Abos über den App Store (StoreKit 2).
/// Die App erfährt nur, ob und bis wann ein Abo aktiv ist. Bezahlt wird ausschließlich über Apple.
/// Familien-Abo: ein Produkt mit aktivierter Familienfreigabe, Mitglieder bekommen es als „familyShared“.
@objc(PlusStorePlugin)
public class PlusStorePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "PlusStorePlugin"
    public let jsName = "PlusStore"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "products", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "manage", returnType: CAPPluginReturnPromise)
    ]
    private var updates: Task<Void, Never>?

    override public func load() {
        // Verlängerungen, Kündigungen, Käufe auf anderen Geräten und Familienfreigabe kommen hier an
        updates = Task.detached { [weak self] in
            for await result in Transaction.updates {
                if case .verified(let t) = result { await t.finish() }
                let s = await PlusStorePlugin.entitlement()
                self?.notifyListeners("change", data: s)
            }
        }
    }

    deinit { updates?.cancel() }

    /// Das am längsten laufende aktive Abo (eigenes oder per Familienfreigabe)
    static func entitlement() async -> [String: Any] {
        var best: Transaction?
        for await result in Transaction.currentEntitlements {
            guard case .verified(let t) = result, t.revocationDate == nil, t.productType == .autoRenewable else { continue }
            if best == nil || (t.expirationDate ?? .distantPast) > (best?.expirationDate ?? .distantPast) { best = t }
        }
        guard let t = best else { return ["active": false] }
        var d: [String: Any] = ["active": true, "product": t.productID, "family": t.ownershipType == .familyShared, "trial": t.offerType == .introductory]
        if let e = t.expirationDate { d["until"] = ISO8601DateFormatter().string(from: e) }
        return d
    }

    private static func unitName(_ u: Product.SubscriptionPeriod.Unit) -> String {
        switch u {
        case .day: return "day"
        case .week: return "week"
        case .month: return "month"
        case .year: return "year"
        @unknown default: return "month"
        }
    }

    private static func days(_ p: Product.SubscriptionPeriod) -> Int {
        switch p.unit {
        case .day: return p.value
        case .week: return p.value * 7
        case .month: return p.value * 30
        case .year: return p.value * 365
        @unknown default: return p.value
        }
    }

    @objc func products(_ call: CAPPluginCall) {
        let ids = call.getArray("ids", String.self) ?? []
        Task {
            do {
                let ps = try await Product.products(for: ids)
                var out: [[String: Any]] = []
                for p in ps {
                    var d: [String: Any] = ["id": p.id, "price": p.displayPrice, "value": NSDecimalNumber(decimal: p.price).doubleValue, "family": p.isFamilyShareable]
                    if let s = p.subscription {
                        d["unit"] = PlusStorePlugin.unitName(s.subscriptionPeriod.unit)
                        d["count"] = s.subscriptionPeriod.value
                        if let o = s.introductoryOffer, o.paymentMode == .freeTrial, await s.isEligibleForIntroOffer {
                            d["trialDays"] = PlusStorePlugin.days(o.period)
                        }
                    }
                    out.append(d)
                }
                call.resolve(["products": out])
            } catch {
                call.reject(error.localizedDescription)
            }
        }
    }

    @objc func purchase(_ call: CAPPluginCall) {
        guard let id = call.getString("id") else { return call.reject("Produkt fehlt") }
        Task {
            do {
                guard let p = try await Product.products(for: [id]).first else { return call.reject("Produkt nicht gefunden") }
                switch try await p.purchase() {
                case .success(let v):
                    guard case .verified(let t) = v else { return call.reject("Kauf konnte nicht bestätigt werden") }
                    await t.finish()
                    var s = await PlusStorePlugin.entitlement()
                    s["result"] = "ok"
                    call.resolve(s)
                case .userCancelled:
                    call.resolve(["result": "cancel"])
                case .pending:
                    call.resolve(["result": "pending"])
                @unknown default:
                    call.resolve(["result": "unknown"])
                }
            } catch {
                call.reject(error.localizedDescription)
            }
        }
    }

    @objc func status(_ call: CAPPluginCall) {
        Task { call.resolve(await PlusStorePlugin.entitlement()) }
    }

    /// „Käufe wiederherstellen“: holt die Käufe vom App Store neu (fragt ggf. nach der Apple-ID)
    @objc func restore(_ call: CAPPluginCall) {
        Task {
            try? await AppStore.sync()
            call.resolve(await PlusStorePlugin.entitlement())
        }
    }

    /// Abo verwalten oder kündigen: Apples eigenes Fenster
    @objc func manage(_ call: CAPPluginCall) {
        Task { @MainActor in
            if let scene = self.bridge?.viewController?.view.window?.windowScene {
                try? await AppStore.showManageSubscriptions(in: scene)
                call.resolve(["shown": true])
            } else if let url = URL(string: "https://apps.apple.com/account/subscriptions") {
                await UIApplication.shared.open(url)
                call.resolve(["shown": true])
            } else {
                call.resolve(["shown": false])
            }
        }
    }
}
