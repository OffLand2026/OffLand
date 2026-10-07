# OffLand auf TestFlight bringen – ohne Mac

Die iOS-App wird in der Cloud auf einem Mac von GitHub gebaut. Du brauchst nur einen Browser.
Einmalig richtest du bei Apple ein Konto ein und hinterlegst vier „Secrets“ bei GitHub.
Danach reicht ein Klick, um eine neue Testversion hochzuladen.

## 1. Apple Developer Program

1. Auf <https://developer.apple.com/programs/enroll/> mit deiner Apple-ID anmelden.
2. Als **Einzelperson** registrieren (99 € pro Jahr).
3. Warten, bis Apple das Konto freischaltet (oft 1–2 Tage).

## 2. App-ID anlegen

1. <https://developer.apple.com/account/resources/identifiers/list> öffnen.
2. **+** → **App IDs** → **App** → Weiter.
3. Beschreibung: `OffLand`, Bundle ID **Explicit**: `com.offland2026.offland`
4. Weiter → Registrieren.

## 3. App in App Store Connect anlegen

1. <https://appstoreconnect.apple.com/apps> → **+** → **Neue App**.
2. Plattform **iOS**, Name **OffLand** (ist der Name schon vergeben, z. B. „OffLand – Insel“ wählen),
   Primärsprache **Deutsch**, Bundle-ID `com.offland2026.offland`, SKU `offland`.

## 4. Team-ID nachschauen

<https://developer.apple.com/account> → **Mitgliedschaftsdetails** → **Team-ID** (10 Zeichen, z. B. `AB12CD34EF`).

## 5. API-Schlüssel erstellen

1. App Store Connect → **Benutzer und Zugriff** → **Integrationen** → **App Store Connect-API** → **Team-Schlüssel**.
2. **+** → Name `GitHub`, Zugriff **Admin** (nötig, damit die Cloud die Zertifikate selbst anlegen darf).
3. **Schlüssel-ID** und oben die **Aussteller-ID (Issuer ID)** notieren.
4. **API-Schlüssel laden** (`AuthKey_XXXX.p8`). Die Datei gibt es nur **einmal** zum Herunterladen – gut aufheben und niemandem schicken.

## 6. Secrets bei GitHub hinterlegen

Im Repository: **Settings → Secrets and variables → Actions → New repository secret**. Vier Stück:

| Name | Inhalt |
|---|---|
| `APPLE_TEAM_ID` | Team-ID aus Schritt 4 |
| `ASC_KEY_ID` | Schlüssel-ID aus Schritt 5 |
| `ASC_ISSUER_ID` | Aussteller-ID aus Schritt 5 |
| `ASC_KEY_P8` | kompletter Inhalt der `.p8`-Datei, inklusive der Zeilen `-----BEGIN PRIVATE KEY-----` und `-----END PRIVATE KEY-----` |

Secrets sind verschlüsselt und auch für dich nach dem Speichern nicht mehr lesbar.

## 7. Testversion hochladen

1. Im Repository **Actions** → **iOS-App bauen** → **Run workflow**.
2. Haken bei **Nach TestFlight hochladen** setzen → **Run workflow**.
3. Nach ca. 10–20 Minuten ist der Upload fertig. Apple verarbeitet den Build danach noch einmal 10–30 Minuten.

## 8. Auf dem iPhone testen

1. App Store Connect → deine App → **TestFlight** → **Interne Tests** → Gruppe anlegen → dich selbst hinzufügen.
2. Auf dem iPhone die App **TestFlight** aus dem App Store laden und mit derselben Apple-ID anmelden.
3. OffLand erscheint dort und lässt sich installieren.

Externe Tester:innen (per Link, bis 10.000) brauchen eine kurze Beta-Prüfung durch Apple.

## Bildschirmzeit automatisch messen

Die iPhone-App kann die Bildschirmzeit selbst mitmessen (Einstellungen → „Bildschirmzeit automatisch“). Apple liefert dabei keine genauen Minuten, sondern meldet jede erreichte 15-Minuten-Stufe. OffLand füllt damit beim Eintragen die Zeit vor.

Technisch gehören dazu ein Plugin in der App (`ios/App/App/ScreenTimePlugin.swift`) und eine Erweiterung, die im Hintergrund mitzählt (`ios/App/ScreenTimeMonitor`). Beide tauschen die Werte über die App Group `group.com.offland2026.offland` aus.

**Was du bei Apple einmalig brauchst:**

1. **App Group anlegen:** <https://developer.apple.com/account/resources/identifiers/list/applicationGroup> → **+** → Beschreibung `OffLand`, ID `group.com.offland2026.offland`.
2. **App-IDs:** Bei `com.offland2026.offland` die Fähigkeiten **App Groups** (mit der Gruppe oben) und **Family Controls** anhaken. Zusätzlich eine zweite App-ID `com.offland2026.offland.ScreenTimeMonitor` anlegen, mit denselben beiden Fähigkeiten.
3. **Family Controls für TestFlight und App Store beantragen:** <https://developer.apple.com/contact/request/family-controls-distribution>. Für **beide** Bundle-IDs beantragen, also auch für die Monitor-Erweiterung. Die Prüfung kann einige Tage bis Wochen dauern.

**Hochladen:**

- Bis Apple die Berechtigung freigegeben hat: wie bisher **Run workflow** mit „Nach TestFlight hochladen“. Die App funktioniert normal, nur „Bildschirmzeit automatisch“ meldet dann, dass der Zugriff nicht erlaubt ist.
- Nach der Freigabe zusätzlich den Haken **„Bildschirmzeit-Berechtigung (Family Controls) einbauen“** setzen. Dann ist die Berechtigung in der Testversion enthalten.
