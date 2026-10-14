// Prüft, ob alle sichtbaren deutschen Texte aus js/app.js und index.html im englischen Wörterbuch stehen.
// Aufruf: node scripts/i18n-check.mjs   (Ausgabe: fehlende Texte als JSON-Liste zum Übersetzen)
// Neue Übersetzungen kommen in js/i18n-en.js, Platzhalter {0},{1} stehen für eingesetzte Werte, {0l} = klein geschrieben.
import fs from "node:fs"; import vm from "node:vm";
import * as acorn from "acorn"; import * as walk from "acorn-walk";

const PH = "\u0001", out = new Set();
const GER = /[äöüßÄÖÜ]|\b(der|die|das|den|dem|des|und|ist|sind|du|dir|dich|dein|deine|nicht|mit|auf|für|ein|eine|einen|heute|noch|wird|hat|haben|zum|zur|bei|von|vom|aus|nach|jetzt|schon|mehr|weniger|wenn|auch|oder|aber|Tag|Tage|Woche|Insel|Bewohner|Punkte|Glück|Ziel|Handy|Minuten|Stunden)\b/;
function add(s) {
  s = s.replace(/\s+/g, " ").trim(); if (!s) return;
  let k = 0; const norm = s.replace(new RegExp(PH, "g"), () => "{" + (k++) + "}");
  if (norm.replace(/\{\d+\}/g, "").replace(/[^A-Za-zÄÖÜäöüß]/g, "").length < 2) return;
  if (!GER.test(norm) && !/^[A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]+[.!:]?$/.test(norm) && !/ /.test(norm)) return;
  if (/^[a-z][a-zA-Z0-9_-]*$/.test(norm) || /^(#|rgba?\(|var\(|M[\d.-]|https?:|\.\/|[a-z-]+:)/.test(norm)) return;
  out.add(norm);
}
const ATTR = /\b(aria-label|title|placeholder|alt)="([^"]*)"/g;
function htmlRuns(s) { for (const m of s.matchAll(ATTR)) add(m[2]); for (const r of s.replace(/<[^>]*>/g, "\u0002").split("\u0002")) add(r); }
const plus = n => n.type === "BinaryExpression" && n.operator === "+" ? [...plus(n.left), ...plus(n.right)] : [n];
const parts = n => n.type === "Literal" && typeof n.value === "string" ? n.value
  : n.type === "TemplateLiteral" ? n.quasis.map((q, i) => q.value.cooked + (i < n.expressions.length ? PH : "")).join("") : PH;

const src = fs.readFileSync("js/app.js", "utf8"), ast = acorn.parse(src, { ecmaVersion: "latest" }), seen = new Set();
walk.fullAncestor(ast, (n, anc) => {
  if (n.type !== "BinaryExpression" || n.operator !== "+") return;
  const par = anc[anc.length - 2]; if (par && par.type === "BinaryExpression" && par.operator === "+") return;
  const ps = plus(n); if (!ps.some(p => p.type === "TemplateLiteral" || (p.type === "Literal" && typeof p.value === "string"))) return;
  ps.forEach(p => seen.add(p)); htmlRuns(ps.map(parts).join(""));
});
walk.full(ast, n => { if (!seen.has(n) && (n.type === "TemplateLiteral" || (n.type === "Literal" && typeof n.value === "string"))) htmlRuns(parts(n)); });
const html = fs.readFileSync("index.html", "utf8").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, "");
htmlRuns(html);

const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync("js/i18n-en.js", "utf8"), ctx);
const D = ctx.window.OFFLAND_EN;
// Namen und Wörter, die auf Englisch gleich bleiben, stehen absichtlich nicht im Wörterbuch
const KEEP = /^(Mr\. Bay|Lucifer|OffLand|TikTok|YouTube|Instagram|WhatsApp|Netflix|Spotify|DJ|OK|PIN|Bob|Surfer|Hipster|Undercut|Spikes|Twists|Krümel|Möhre|Pünktchen|Ö-ö-ö!)$/;
const missing = [...out].filter(s => !(s in D) && !KEEP.test(s) && GER.test(s));
console.log(JSON.stringify(missing, null, 1));
console.error(`${out.size} Texte gefunden, ${Object.keys(D).length} im Wörterbuch, ${missing.length} fehlen (mit typisch deutschen Wörtern).`);
