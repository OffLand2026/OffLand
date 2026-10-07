import UIKit
import Capacitor

/// Eigener Bridge-Controller, damit das lokale Bildschirmzeit-Plugin registriert wird.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(ScreenTimePlugin())
    }
}
