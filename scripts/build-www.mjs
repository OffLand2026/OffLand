// Kopiert die Web-App in den Ordner www/, aus dem Capacitor die iOS-App baut.
import { cpSync, rmSync, mkdirSync } from "node:fs";

const files = ["index.html", "manifest.webmanifest", "sw.js", "css", "js", "icons"];
rmSync("www", { recursive: true, force: true });
mkdirSync("www");
for (const f of files) cpSync(f, `www/${f}`, { recursive: true });
console.log("www/ erstellt");
