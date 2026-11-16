// Kopiert die Web-App in den Ordner www/, aus dem Capacitor die iOS-App baut.
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";

const files = ["index.html", "manifest.webmanifest", "sw.js", "css", "js", "icons", "impressum", "datenschutz"];
rmSync("www", { recursive: true, force: true });
mkdirSync("www");
for (const f of files) cpSync(f, `www/${f}`, { recursive: true });

// Capacitor-Kern (registerPlugin) für die iOS-App. Die native Brücke allein liefert ihn nicht mit:
// Ohne diese Datei erreicht die Web-App keine nativen Plugins (Widget, Bildschirmzeit, Plus-Käufe,
// Live-Insel, Fokus-Wecker). Nur in www/, die Web-Version auf GitHub Pages braucht ihn nicht.
const core = "node_modules/@capacitor/core/dist/capacitor.js";
if (!existsSync(core)) throw new Error(`${core} fehlt. Erst „npm ci“ ausführen.`);
cpSync(core, "www/js/capacitor.js");
const html = readFileSync("www/index.html", "utf8");
const hook = '<script src="js/i18n-en.js"></script>';
if (!html.includes(hook)) throw new Error(`index.html: ${hook} nicht gefunden, Capacitor-Kern kann nicht eingebunden werden`);
writeFileSync("www/index.html", html.replace(hook, '<script src="js/capacitor.js"></script>\n' + hook));

console.log("www/ erstellt (mit Capacitor-Kern)");
