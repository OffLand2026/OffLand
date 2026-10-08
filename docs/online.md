# Freunde und Ranglisten einrichten (Firebase)

OffLand nutzt für Freundschaften und Ranglisten **Firebase** von Google. Für ein Projekt dieser Größe ist der Gratis-Tarif „Spark“ dauerhaft kostenlos, eine Kreditkarte brauchst du nicht.
Die Einrichtung dauert etwa 10 Minuten und geht komplett im Browser.

Solange nichts eingerichtet ist, läuft OffLand ganz normal offline weiter.

**Stand:** Für OffLand ist das Projekt `offland2026` eingerichtet und in `js/online-config.js` eingetragen.

## 1. Firebase-Projekt anlegen

1. <https://console.firebase.google.com> öffnen und mit einem Google-Konto anmelden.
2. **Projekt erstellen** → Name `OffLand` → Weiter.
3. Google Analytics **ausschalten** (brauchen wir nicht) → **Projekt erstellen**.

## 2. Web-App hinzufügen

1. In der Projektübersicht auf das Symbol **`</>`** (Web) klicken.
2. Spitzname `OffLand` → **App registrieren** (Firebase Hosting **nicht** anhaken).
3. Es erscheint ein Code-Block mit `const firebaseConfig = { … }`. Diesen Block brauchen wir gleich. Später findest du ihn unter ⚙︎ → **Projekteinstellungen → Allgemein → Meine Apps**.
   Achtung: Den Block unter **Dienstkonten** („firebase-admin“, „serviceAccountKey“) brauchen wir **nicht**, und dort bitte auch keinen privaten Schlüssel erzeugen.

## 3. Anonyme Anmeldung einschalten

Niemand muss sich mit E-Mail registrieren. Jedes Gerät bekommt automatisch eine unsichtbare Kennung.

1. Links **Build → Authentication** → **Jetzt starten**.
2. Reiter **Anmeldemethode** → **Anonym** → einschalten → **Speichern**.
3. Reiter **Einstellungen** → **Autorisierte Domains** → **Domain hinzufügen** → `offland2026.github.io`.

## 4. Datenbank anlegen

1. Links **Erstellen → Firestore Database** → **Datenbank erstellen**. Wichtig: **Firestore**, nicht „Realtime Database“. Die Realtime Database erwartet ein anderes Regel-Format und meldet sonst „Line 1: Parse error“.
2. Edition **Standard**, Standort **europe-west1 (Belgien)**. Der Standort lässt sich später nicht mehr ändern, und die EU ist für den Datenschutz am einfachsten.
3. **Sperrmodus** wählen (nicht Testmodus) → Erstellen.
4. Reiter **Regeln** → alles löschen → den kompletten Inhalt der Datei [`firestore.rules`](../firestore.rules) aus diesem Repository einfügen → **Veröffentlichen**.

## 5. Konfiguration eintragen

Entweder schickst du mir den `firebaseConfig`-Block aus Schritt 2 (die Werte sind **nicht geheim**: Sie stehen in jeder Web-App, geschützt wird alles über die Regeln aus Schritt 4), oder du trägst ihn selbst ein:

1. Im Repository die Datei `js/online-config.js` öffnen → Stift-Symbol (Bearbeiten).
2. Die Zeile `window.OFFLAND_FIREBASE = null;` ersetzen durch:

```js
window.OFFLAND_FIREBASE = {
  apiKey: "…",
  authDomain: "….firebaseapp.com",
  projectId: "…",
  storageBucket: "….appspot.com",
  messagingSenderId: "…",
  appId: "…"
};
```

3. **Commit changes** → direkt in `main`. Nach ein paar Minuten ist es online.

## Was gespeichert wird

Nur wenn jemand in der App zustimmt („Einverstanden, online gehen“):

| Was | Wer sieht es |
|---|---|
| Name und Avatar des Kontos, Code, Inselwelt | Freund:innen und alle, die den Code kennen |
| Bildschirmzeit der aktuellen Woche (Durchschnitt, gute Tage, Serie) | Freund:innen; zusätzlich alle, wenn „Rangliste für alle“ an ist |
| Freundschaften | nur die beiden Beteiligten |

Insel, Bewohner, einzelne Tage, App-Zeiten und alles andere bleiben auf dem Gerät.
In den Einstellungen lässt sich „Online sein“ ausschalten. Dabei werden alle Online-Daten des Kontos gelöscht. Beim Löschen des Kontos passiert das automatisch.

**Vor dem App-Store-Start** braucht OffLand eine Datenschutzerklärung, die Firebase (Google Ireland, Speicherort EU) als Dienstleister nennt. Die schreiben wir, wenn es so weit ist.

## Grenzen der Gratis-Version

- 50.000 Lesezugriffe und 20.000 Schreibzugriffe pro Tag. Das reicht für einige Hundert aktive Spieler:innen.
- Die Bildschirmzeit wird von den Spieler:innen selbst eingetragen, die Ranglisten beruhen also auf Ehrlichkeit.
- Die Rangliste für alle zeigt die besten 50. Den eigenen Platz („Platz 1.284 von 5.310“) zählt Firestore direkt aus, das kostet nur einen Lesezugriff pro 1.000 Einträge. Dabei sind nur Spieler:innen mit mindestens 3 eingetragenen Tagen in der laufenden Woche.
- Im Testmodus simulierte Tage liegen in der Zukunft und zählen nicht für die Ranglisten.
- Wer die App löscht oder die Browserdaten leert, bekommt beim nächsten Online-Gehen ein neues Online-Profil. Freundschaften müssen dann neu verbunden werden.

## Support-Meldungen lesen

In der App unter Profilbild → **Hilfe und Support** können Spieler:innen Fehler, Ideen oder Fragen schicken.

- Firebase-Konsole → **Firestore Database** → Reiter **Daten** → Ordner **support**.
- Jede Meldung enthält Art (`fehler`, `idee`, `frage`, `sonst`), Text, freiwillige E-Mail (`contact`), Name, Zeitpunkt (`at`, Millisekunden) und technische Infos (`info`: Web oder iPhone-App, Gerät, Bildschirm, Inselwelt, Tage).
- Das Feld `status` steht auf `neu`. Du kannst es in der Konsole z. B. auf `erledigt` setzen, um den Überblick zu behalten.
- **Antworten:** Meldung öffnen → **Feld hinzufügen** → Name `antwort`, Typ **string**, deinen Antworttext eintragen → Hinzufügen. Am besten auch `status` auf `beantwortet` setzen. Die App zeigt die Antwort beim nächsten Öffnen als „Post vom OffLand-Team“ und unter Hilfe und Support → Meine Anfragen. Die Person muss dafür nicht online gegangen sein.
- Spieler:innen können nur Meldungen senden und ihre eigenen Anfragen samt Antwort lesen. Fremde Meldungen kann niemand lesen, auflisten oder ändern.
- Nach dem Erweitern der Regeln (`firestore.rules`) müssen sie in der Konsole neu eingefügt und veröffentlicht werden.

## Online-Backup

In der App unter Profilbild → Einstellungen → **Online-Backup** lässt sich die Insel sichern.

- Beim Einschalten bekommt die Person einen **Wiederherstellungs-Code** (12 Zeichen, z. B. `WJA3-GCAH-2XMC`).
- Die Insel wird mit einem aus dem Code abgeleiteten Schlüssel **verschlüsselt** (AES-256) und unter einer ebenfalls aus dem Code abgeleiteten ID im Ordner **backups** gespeichert. Ohne Code kann niemand das Backup finden oder lesen, auch nicht in der Firebase-Konsole.
- Gesichert wird automatisch nach jedem eingetragenen Tag und beim Verlassen der App (höchstens alle 30 Minuten).
- Auf einem neuen Gerät: Startbildschirm → **Insel aus Backup holen** → Code eingeben.
- Ausschalten oder Konto löschen entfernt das Backup.
- Geht der Code verloren, lässt sich das Backup nicht wiederherstellen. Das ist der Preis für die Verschlüsselung.

## Familieninsel

Im Tab **Freunde** → „Familieninsel gründen“ oder mit einem Familien-Code beitreten (Link: `…/OffLand/?familie=CODE`).

- Jede Person behält ihre eigene Insel. Die gemeinsame Familieninsel zeigt alle Mitglieder als Figuren.
- **Familienprojekte** (Lagerfeuer, Familienbank, Gemüsegarten, Baumhaus, Bootssteg, Laternenweg, Festzelt) werden mit den guten Tagen aller freigeschaltet.
- **Gesparte Zeit:** Pro Person und zusammen, wie viel weniger am Handy seit dem Beitritt (gegenüber dem eigenen bisherigen Schnitt).
- **Geteilt wird** Name, Avatar, die gesparte Zeit insgesamt und pro Tag nur „im Budget ja/nein“ (letzte 14 Tage). Minuten nur, wenn die Person „Auch meine Minuten zeigen“ anhakt.
- In Firestore: `families/{id}` (Name, Code), `famcodes/{code}`, `families/{id}/uids/{uid}` (Mitgliedschaft pro Gerät) und `families/{id}/members/{id}`. Lesen dürfen nur Mitglieder.
- Bis zu 12 Personen pro Familieninsel. Verlassen geht in den Einstellungen, beim Löschen des Kontos passiert es automatisch.
