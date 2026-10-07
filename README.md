# Offline-Insel 🏝️

Ein kleines Handy-Spiel gegen zu viel Bildschirmzeit: Du trägst jeden Abend ein, wie lange du am Handy warst. Bleibst du im Budget, wird deine Insel glücklicher – es ziehen neue Bewohner ein, es gibt Nachwuchs, Großprojekte wie Leuchtturm und Windmühle entstehen. Zu viel Handy bringt Wolken, Streit und App-Monster.

## Funktionen

- **Startbildschirm und Konten:** mehrere Profile pro Gerät mit Name, Avatar und freiwilliger PIN; Konto bearbeiten, abmelden und löschen
- **Heute:** Bildschirmzeit eintragen, Quests, echte Aktivitäten, Fokus-Bootsfahrt, Gute-Nacht-Ritual, Urlaubsmodus
- **Bewohner:** Menschen mit Berufen und Eigenschaften, Tiere, Beziehungen, Streit, Liebe, Stammbaum, Chronik
- **Zeit:** zurückgewonnene Zeit, Hochrechnung aufs Jahr, App-Monster-Statistik
- **Bauen:** Inselladen, Händlerschiff, Großprojekte
- **Album:** Postkarten, Strandgut, Zeitkapseln, Tagebuch, Einstellungen, Sicherung

## Starten

Es gibt keinen Build-Schritt – reines HTML, CSS und JavaScript.

- **Lokal:** `index.html` im Browser öffnen, oder für die Offline-Funktion einen kleinen Server starten:
  ```bash
  python3 -m http.server 8000
  ```
  und dann <http://localhost:8000> öffnen.
- **Online:** Bei jedem Push auf `main` veröffentlicht der Workflow `.github/workflows/pages.yml` die App auf GitHub Pages. Einmalig in den Repo-Einstellungen unter **Settings → Pages → Source** „GitHub Actions“ auswählen.

Auf dem Handy kann die Seite über „Zum Home-Bildschirm“ wie eine App installiert werden und läuft danach auch ohne Internet.

## Speicherung

Konten und Spielstände liegen im `localStorage` des Browsers, jedes Konto mit eigenem Spielstand. Die PIN wird nur als Hash gespeichert und ist eine Kindersicherung, kein Schutz gegen Zugriff auf das Gerät selbst. Über **Album → Sicherung** lässt er sich als JSON-Datei herunterladen und auf einem anderen Gerät wieder laden.

Freund:innen-Inseln, Geschenke und die Familieninsel brauchen einen Online-Speicher und sind in dieser statischen Version deaktiviert.

## Aufbau

```
index.html            Seitengerüst und Tab-Leiste
css/style.css         Gestaltung und Animationen
js/app.js             Spiellogik, Insel-Szene, Ansichten, Dialoge
sw.js                 Service Worker für den Offline-Betrieb
manifest.webmanifest  Installierbare Web-App
icons/                App-Icons
```
