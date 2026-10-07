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

## Bildschirmzeit automatisch auslesen (später)

Dafür braucht die App die Berechtigung **Family Controls**. Für TestFlight und den App Store muss sie bei Apple beantragt werden:
<https://developer.apple.com/contact/request/family-controls-distribution> – am besten gleich nach Schritt 3, weil die Freigabe dauern kann.
