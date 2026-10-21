# OffLand im App Store: Texte, Datenschutz-Angaben, Screenshots

Alles zum Kopieren für **App Store Connect → deine App**. Die Zeichengrenzen von Apple sind geprüft.

## 1. App-Informationen

| Feld | Inhalt |
|---|---|
| Name (max. 30) | `OffLand – Weniger Handy` |
| Untertitel (max. 30) | `Deine Insel wächst offline` |
| Primäre Kategorie | Gesundheit & Fitness |
| Sekundäre Kategorie | Lifestyle |
| Support-URL | `https://offlandapp.com` |
| Marketing-URL | `https://offlandapp.com/landing/` |
| Datenschutz-URL | `https://offlandapp.com/datenschutz/` |
| Preis | Kostenlos |
| Copyright | `2026 Emily Saß` |

## 2. Werbetext (max. 170, jederzeit änderbar)

```
Weniger Bildschirmzeit, glücklichere Insel: Jeder gute Tag holt einen Bewohner vom Handy zurück. Ohne Verbote, ohne Strafen – mit Herz, Humor und deiner eigenen Insel.
```

## 3. Beschreibung (max. 4000)

```
Was wäre, wenn weniger Handy sich anfühlt wie gewinnen?

OffLand ist eine kleine Insel, die nur wächst, wenn du nicht am Handy bist. Statt Verboten, Sperren und schlechtem Gewissen setzt OffLand auf Verantwortung und Gefühl: Deine Bewohner zählen auf dich.

SO FUNKTIONIERT'S
• Setz dir ein Tagesziel für deine Bildschirmzeit.
• Trag abends ein, wie lange du am Handy warst – oder lass OffLand es auf dem iPhone automatisch mitzählen.
• Bleibst du im Ziel, wird deine Insel glücklicher: Bewohner ziehen ein, Großprojekte entstehen, Feste werden gefeiert.
• Zu viel Handy bringt Wolken, Streit und App-Monster vor die Küste.

VOM SMOMBIE ZUM MENSCHEN
Neue Bewohner kommen als dunkle Schatten vom Festland, den Blick aufs leuchtende Handy gesenkt. Mit jedem guten Tag richten sie sich ein Stück auf, bekommen ihre Farbe zurück – und jubeln, wenn deine Insel ganz glücklich ist.

DEINE INSEL, DEINE LEUTE
• Gestalte jeden Bewohner in der Umkleide: Frisur, Bart, Muster, Extras – oder einer von 16 fertigen Looks.
• Mr. Bay, der leicht übermotivierte Bürgermeister, und Lucifer, die freche Inselkatze, erzählen dir die Geschichte von OffLand in Kapiteln.
• Bewohner schreiben dir Postkarten, haben Wünsche und erzählen im Inselgeflüster, was los ist.
• Reise später weiter: Tropeninsel, Fjorde, Wüste und Eis.

SIEH, WAS DU GEWINNST
• Gewonnene Zeit pro Woche und hochgerechnet aufs Jahr, mit Vergleichen, die man fühlt.
• Fokus-Bootsfahrt: Handy weg, Boot fährt raus, du konzentrierst dich.
• Inselminute: eine Minute Meeresrauschen zum Durchatmen.

ZUSAMMEN STATT ALLEIN
• Freunde, Wochen-Ranglisten und freundliche Duelle.
• Die Familieninsel: Eltern und Kinder bauen gemeinsam an einer Insel.

DEINE DATEN BLEIBEN BEI DIR
OffLand funktioniert ohne Anmeldung. Deine Insel liegt auf deinem Gerät. Keine Werbung, kein Tracking, kein Verkauf von Daten. Online-Funktionen wie Freunde, Backup oder Familieninsel sind freiwillig.

Weniger Handy. Mehr Insel.
```

## 4. Keywords (max. 100, ohne Leerzeichen nach Kommas)

```
bildschirmzeit,handyzeit,digital detox,fokus,achtsamkeit,gewohnheit,insel,familie,offline,smartphone
```

## 5. Neuerungen dieser Version (erste Version)

```
Willkommen auf OffLand! Die erste Version: deine Insel, deine Bewohner und jeder gute Tag ohne Handy zählt.
```

## 6. Hinweise für das App-Review-Team

Unter **App-Prüfung → Notizen**:

```
OffLand needs no account. Tap "Konto anlegen", enter any name and start the island.
To see progress quickly: Settings (avatar top right) → tap the version line 7 times → enable "Testmodus". A bar appears above the tab bar to simulate good/bad days.
Screen Time: "Bildschirmzeit automatisch" uses the Family Controls / DeviceActivity framework only on-device to count usage in 15-minute steps. No screen time data leaves the device unless the user joins optional friend rankings (weekly average minutes only).
Online features (friends, backup, family island) are optional and use Firebase (EU region).
```

## 7. App-Datenschutz („Datenschutzangaben“ in App Store Connect)

**Werden Daten erfasst?** → **Ja**

Für jeden Datentyp unten: **Verwendung zum Tracking → Nein**.

| Kategorie → Datentyp | Zweck | Mit Identität verknüpft? |
|---|---|---|
| Kontaktinformationen → **E-Mail-Adresse** | App-Funktionalität (Antwort auf Support-Anfragen, freiwillig) | Ja |
| Nutzerinhalte → **Kundensupport** | App-Funktionalität | Ja |
| Nutzerinhalte → **Andere Nutzerinhalte** (Inselname, Bewohner, verschlüsseltes Backup, Familieninsel) | App-Funktionalität | Ja |
| Kennungen → **Benutzer-ID** (anonyme Firebase-ID für Freunde und Backup) | App-Funktionalität | Ja |
| Nutzungsdaten → **Andere Nutzungsdaten** (Wochenschnitt der Bildschirmzeit für Freunde-Ranglisten) | App-Funktionalität | Ja |
| Nutzungsdaten → **Produktinteraktion** (anonyme Statistik, nur mit Zustimmung) | Analyse | Nein |
| Diagnose → **Absturzdaten** (Fehlerberichte, nur mit Zustimmung) | App-Funktionalität | Nein |

**Nicht** ankreuzen: Standort, Gesundheit & Fitness, Finanzen, Kontakte, Browserverlauf, Suchverlauf, Fotos, Audio, Käufe, sensible Daten, Werbedaten.
„Käufe“ bleibt auch mit OffLand Plus frei: Ob ein Abo aktiv ist, prüft die App nur auf dem Gerät, es wird nicht an uns übertragen.

Diese Angaben passen zum Datenschutz-Manifest in `ios/App/App/PrivacyInfo.xcprivacy` und zur Datenschutzerklärung unter offlandapp.com/datenschutz/.

## 8. Altersfreigabe

Im Fragebogen überall **Keine** bzw. **Nein** auswählen. Es gibt keine Gewalt, keine Glücksspiele und keine Käufe. Nur bei „Unbeschränkter Webzugang“ und „Nutzergenerierte Inhalte“ genau hinschauen: OffLand hat keinen offenen Webbrowser und keinen offenen Chat. Spitznamen sind für Freunde sichtbar, mehr nicht.

Ergebnis ist voraussichtlich **4+**. Laut Datenschutzerklärung ist OffLand ab 12 gedacht. Das passt trotzdem, denn die Freigabe sagt nur, dass nichts Ungeeignetes drin ist.

## 9. Screenshots

Die App ist nur fürs iPhone freigegeben, iPad-Screenshots braucht es nicht. Apple verlangt Screenshots für das **6,9"-iPhone** (1320 × 2868 Pixel). Kleinere iPhones werden daraus automatisch erzeugt. Die fertigen Bilder (1320 × 2868) bekommst du von Claude. Reihenfolge:

1. Insel mit glücklichen Bewohnern: „Weniger Handy. Mehr Insel.“
2. Verwandlung vom Smombie zum Menschen: „Jeder gute Tag holt jemanden zurück“
3. Abend eintragen: „Ziel geschafft? Deine Insel wächst“
4. Umkleide: „Gestalte deine Bewohner“
5. Gewonnene Zeit: „Sieh, was du gewinnst“
6. Bewohner: „Deine Insel, deine Leute“
7. Freunde: „Zusammen statt allein“

Bild 7 erwähnt im Freunde-Text „einen Monat Plus“. Wenn Plus in der Store-Version ausgeblendet ist, Bild 7 weglassen, sonst kann die Prüfung das bemängeln.

## 10. Antrag auf Family Controls (Bildschirmzeit)

Ohne diese Freigabe darf die App die Bildschirmzeit im App Store nicht nutzen. Beantragen als Account Holder unter **developer.apple.com/contact/request/family-controls-distribution**, und zwar **fünfmal**: für `com.offland2026.offland` und die Erweiterungen `com.offland2026.offland.ScreenTimeMonitor`, `com.offland2026.offland.ScreenTimeReport`, `com.offland2026.offland.ShieldConfig` und `com.offland2026.offland.ShieldAction`. Wer die ersten drei schon beantragt hat, beantragt die beiden Shield-Erweiterungen nach und schreibt dazu, dass der Insel-Schutz (Punkt 6 unten) neu ist. Das Formular ist auf Englisch.

**App name:** OffLand

**Describe how your app will use the Family Controls framework:**

```
OffLand is a screen time wellbeing game for individuals and families. Users set a personal daily screen time goal; each evening the app compares the actual screen time to that goal. Staying under the goal makes a small virtual island grow and its residents happier. Going over has gentle in-game consequences. There are no penalties, ads or tracking.

We use Family Controls only with individual authorization (AuthorizationCenter.requestAuthorization(for: .individual)) so that users can measure their own screen time automatically instead of reading it from the Settings app every evening.

How it works:
1. The user opts in from the app settings and grants Screen Time access.
2. The user picks which apps and categories should count via FamilyActivityPicker. The selection stays opaque to us.
3. Our DeviceActivityMonitor extension registers usage thresholds in 15-minute steps for the current day. When a threshold is reached, the extension stores only the highest reached step (e.g. "90 minutes") for that day in the shared App Group.
4. When the user logs their day, the app pre-fills this value. The user can always correct it.
5. During setup, the user can open a DeviceActivityReport (our report extension) that shows their own daily average of the last 7 days, so they can set their starting value. The value is only displayed to the user inside the sandboxed report; the app itself never receives it.
6. Optional "Island guard": the user picks apps they tend to open on autopilot (e.g. social media). When they open one, ManagedSettings shows a shield with their own island and a resident waiting for them (ShieldConfiguration extension). "Back to the island" closes the app; "Open anyway" lifts the shield for a few minutes of use (ShieldAction extension, re-applied via DeviceActivity). Users choose when it applies (always, evenings from 9 pm, or during a focus session) and can turn it off at any time. We only count how often the user chose each button, on the device.

Data and privacy:
- We never read which apps or websites were used, only the daily total in 15-minute steps.
- This value stays on the device. It is never sent to our servers, never shared with third parties and never used for advertising.
- ManagedSettings is only used for the optional island guard the user sets up themselves. Nothing is ever blocked without an "open anyway" option.
- The feature is optional. The app works fully with manual entry, and users can turn automatic measuring off at any time.

Bundle IDs: com.offland2026.offland (app), com.offland2026.offland.ScreenTimeMonitor (DeviceActivityMonitor extension), com.offland2026.offland.ScreenTimeReport (DeviceActivityReport extension), com.offland2026.offland.ShieldConfig (ShieldConfiguration extension) and com.offland2026.offland.ShieldAction (ShieldAction extension).
```

Nach der Freigabe: In Certificates, Identifiers & Profiles bei allen fünf App-IDs die Fähigkeit **Family Controls (Distribution)** aktivieren und den TestFlight-Lauf mit „Bildschirmzeit-Berechtigung einbauen“ starten.


## 11. OffLand Plus: Abos in App Store Connect anlegen

Die App fragt die Abos über StoreKit 2 ab (`ios/App/App/PlusStorePlugin.swift`). Solange der App Store keine Abo-Produkte liefert, ist Plus in App und Webseite unsichtbar und nichts ist gesperrt (Schalter `plusAvailable()` in `js/app.js`). Sobald die Abos angelegt sind, erscheint Plus von selbst, auch schon in TestFlight.

Plus enthält: Weltreise (Welten 2 bis 5 mit eigenen Kapiteln; wo man schon wohnt, bleibt man), Saison-Inseln (Ostern, Sommer, Halloween, Advent mit Deko, Saison-Look, Festtag und Saisonstempel), „Mein Inseljahr“ (Monats- und Jahresrückblick als Story mit Bild zum Teilen), Live-Insel (Bootsfahrt als Live-Aktivität auf dem Sperrbildschirm und in der Dynamic Island, ab iOS 16.1), den Insel-Kurier (wöchentliche Inselzeitung), Zeit-Statistik (Kalender, Bestwerte, Hochrechnung, Fokus- und App-Auswertung), Insel-Schutz Pro, Goldene Lagune, Plus-Looks, +10 % Punkte und goldener Rahmen. Gratis bleiben Insel, Bewohner, Tagesbilanz, Familieninsel, Fokus-Boot, Inselminute und die laufende Woche im Zeit-Tab.

**Voraussetzung:** Unter **Geschäftliches** (Business) den **Vertrag für kostenpflichtige Apps** annehmen und Bank- und Steuerangaben hinterlegen. Ohne diesen Vertrag lassen sich keine Abos verkaufen, auch nicht testen.

**1. Abo-Gruppe:** App → **Monetarisierung → Abonnements** → Gruppe **OffLand Plus** anlegen. Alle drei Abos kommen in diese eine Gruppe, damit man zwischen ihnen wechseln kann.

**2. Abos** (Produkt-IDs exakt so, die App sucht genau diese):

| Referenzname | Produkt-ID | Dauer | Preis (Vorschlag) | Einführungsangebot | Familienfreigabe |
|---|---|---|---|---|---|
| Plus Familie | `offland.plus.familie` | 1 Jahr | 44,99 € | 1 Woche kostenlos | **an** |
| Plus Jährlich | `offland.plus.jahr` | 1 Jahr | 29,99 € | 1 Woche kostenlos | aus |
| Plus Monatlich | `offland.plus.monat` | 1 Monat | 3,99 € | keins | aus |

Reihenfolge der Stufen in der Gruppe: Familie oben, dann Jährlich, dann Monatlich. Die Preise auf der Paywall kommen automatisch vom App Store (auch in anderen Währungen); die Euro-Beträge im Code sind nur der Ersatz für Browser und Tests.

**Familienfreigabe** heißt: Wer das Familien-Abo abschließt, teilt es mit bis zu 5 weiteren Personen seiner Apple-Familie. Die App erkennt das von selbst.

**3. Anzeigename und Beschreibung** je Abo (Deutsch und Englisch), z. B.:
- Jährlich: „OffLand Plus“ / „Weltreise, Zeit-Statistik, Insel-Schutz Pro, Goldene Lagune und Plus-Looks.“
- EN: „OffLand Plus“ / „World tour, time stats, Island Guard Pro, Golden Lagoon and Plus looks.“
- Familie: „OffLand Plus Familie“ / „Alles aus Plus für bis zu 6 Personen.“

**4. Prüfungsinformationen** je Abo: Screenshot der Paywall (Einstellungen → OffLand Plus → „Plus ansehen“) und als Notiz:

```
OffLand Plus unlocks optional extras: the world tour (4 more worlds with their own chapters), seasonal islands, a monthly and yearly recap story, a Live Activity for the focus boat trip, a weekly island newspaper, extended time statistics, custom schedules for the Island Guard, the "Golden Lagoon" island style, Plus looks for residents and +10% daily points. All core features stay free, including the family island. The paywall is in Settings → OffLand Plus. Restore Purchases is at the top of the paywall; Terms of Use (Apple standard EULA) and Privacy Policy are linked at the bottom.
```

**5. App-Beschreibung:** Am Ende der Beschreibung (Abschnitt 3) diese Zeilen ergänzen, Apple verlangt die Links:

```
OffLand Plus ist ein optionales Abo (monatlich oder jährlich, Familien-Abo für bis zu 6 Personen) mit kostenloser Probewoche beim Jahresabo. Die Zahlung erfolgt über deine Apple-ID; das Abo verlängert sich automatisch, wenn du es nicht mindestens 24 Stunden vor Ablauf in den Einstellungen kündigst.
Nutzungsbedingungen: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/
Datenschutz: https://offlandapp.com/datenschutz/
```

**6. Testen:** In TestFlight kosten Käufe nichts und Abos laufen im Zeitraffer (1 Jahr = 1 Stunde). Für eigene Sandbox-Tests unter **Benutzer und Zugriff → Sandbox** einen Testaccount anlegen.

**7. Einreichen:** Die Abos zusammen mit der App-Version zur Prüfung schicken (beim ersten Mal auf der Versionsseite unter „In-App-Käufe und Abonnements“ auswählen).
