// Anonyme Nutzungsstatistik auslesen: node scripts/statistik.mjs [Tage]   (Standard: 14)
// Meldet sich wie die App anonym bei Firebase an und liest die Tageszähler aus stats/JJJJ-MM-TT.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const cfgSrc = readFileSync(root + "js/online-config.js", "utf8");
const apiKey = cfgSrc.match(/apiKey:\s*"([^"]+)"/)[1], project = cfgSrc.match(/projectId:\s*"([^"]+)"/)[1];
const TOKEN_FILE = root + ".statistik-token";
const days = Math.max(1, Math.min(90, +process.argv[2] || 14));

async function idToken() {
  // Gespeicherten anonymen Zugang wiederverwenden, damit nicht bei jedem Aufruf ein neuer Nutzer entsteht
  let refresh = null; try { refresh = readFileSync(TOKEN_FILE, "utf8").trim(); } catch {}
  if (refresh) {
    const r = await fetch(`https://securetoken.googleapis.com/v1/token?key=${apiKey}`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=refresh_token&refresh_token=" + encodeURIComponent(refresh) });
    if (r.ok) return (await r.json()).id_token;
  }
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ returnSecureToken: true }) });
  if (!r.ok) throw new Error("Anmeldung fehlgeschlagen: " + r.status + " " + await r.text());
  const j = await r.json(); writeFileSync(TOKEN_FILE, j.refreshToken); return j.idToken;
}

const iso = d => d.toLocaleDateString("sv-SE");   // JJJJ-MM-TT in Ortszeit, wie in der App
const tok = await idToken();
const rows = [];
for (let i = days - 1; i >= 0; i--) {
  const day = iso(new Date(Date.now() - i * 864e5));
  const r = await fetch(`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/stats/${day}`, { headers: { Authorization: "Bearer " + tok } });
  if (r.status === 404) { rows.push({ day, c: {} }); continue; }
  if (!r.ok) throw new Error(`stats/${day}: ${r.status} ${await r.text()}`);
  const f = (await r.json()).fields || {}, c = {};
  for (const k in f) c[k] = +(f[k].integerValue ?? f[k].doubleValue ?? 0);
  rows.push({ day, c });
}

const sum = k => rows.reduce((a, r) => a + (r.c[k] || 0), 0);
const pct = (a, b) => b ? Math.round(a / b * 100) + " %" : "–";
const pad = (v, n) => String(v).padStart(n);
console.log(`\nOffLand · anonyme Statistik der letzten ${days} Tage\n`);
console.log("Datum        aktiv  neu  Tage  gut   iOS  PWA  Web");
for (const { day, c } of rows) console.log(`${day} ${pad(c.aktiv || 0, 6)} ${pad(c.konto_neu || 0, 4)} ${pad(c.tag || 0, 5)} ${pad(c.tag_gut || 0, 4)} ${pad(c.aktiv_ios || 0, 5)} ${pad(c.aktiv_pwa || 0, 4)} ${pad(c.aktiv_web || 0, 4)}`);
console.log(`\nSumme: ${sum("aktiv")} aktive Gerätetage, ${sum("konto_neu")} neue Konten, ${sum("tag")} eingetragene Tage, davon ${pct(sum("tag_gut"), sum("tag"))} im Budget`);
console.log(`Intro: ${sum("intro_ende")} ganz angesehen, ${sum("intro_skip")} übersprungen · Insel gestartet: ${sum("insel_start")}`);
console.log(`Vorhaben: ${sum("vorhaben_gewaehlt")} gewählt, ${sum("vorhaben_ohne")} ohne, geschafft ${pct(sum("vorhaben_ok"), sum("vorhaben_ok") + sum("vorhaben_nein"))}`);
console.log(`Joker: ${sum("joker_ja")} ja / ${sum("joker_nein")} nein`);
console.log("\nWie lange nach dem ersten Start sind Geräte noch aktiv (aktive Gerätetage):");
for (const [k, n] of [["0", "Tag 0"], ["1", "Tag 1"], ["2_3", "Tag 2–3"], ["4_7", "Tag 4–7"], ["8_14", "Tag 8–14"], ["15_30", "Tag 15–30"], ["31", "ab Tag 31"]]) console.log(`  ${n.padEnd(10)} ${pad(sum("aktiv_t" + k), 5)}`);
const skip = /^(aktiv|konto_neu|tag|tag_gut|tag_schlecht|intro_|insel_start|vorhaben_|joker_)/;
const rest = {}; rows.forEach(({ c }) => { for (const k in c) if (!skip.test(k)) rest[k] = (rest[k] || 0) + c[k]; });
console.log("\nWeitere Zähler:");
Object.entries(rest).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k.padEnd(18)} ${pad(v, 5)}`));
console.log("");
