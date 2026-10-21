/* Sprache: Die App ist auf Deutsch geschrieben. Für Englisch wird beim Anzeigen übersetzt
   (Textknoten, Beschriftungen, Dialoge, Teilen, Canvas), die Daten im Spiel bleiben deutsch.
   Wörterbuch: js/i18n-en.js (window.OFFLAND_EN), Platzhalter {0},{1} stehen für eingesetzte Werte. */
(function () {
  let pref = null;
  try { pref = localStorage.getItem("offland-lang"); } catch (e) {}
  const auto = /^de\b/i.test(navigator.language || "de") ? "de" : "en";
  const lang = pref === "de" || pref === "en" ? pref : auto;
  window.OFFLAND_LANG = lang;
  window.OFFLAND_LOCALE = lang === "en" ? "en-US" : "de-DE";
  document.documentElement.lang = lang;
  const D = window.OFFLAND_EN;
  if (lang !== "en" || !D) { window.OFFLAND_T = s => s; return; }

  // Muster mit Platzhaltern, nach Schlüsselwort sortiert, damit nicht alle Muster geprüft werden müssen
  const exact = new Map(), byWord = new Map();
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const k in D) {
    if (!/\{\d+\}/.test(k)) { exact.set(k, D[k]); continue; }
    const words = k.replace(/\{\d+\}/g, " ").match(/[A-Za-zÄÖÜäöüß]{3,}/g);
    if (!words) continue;
    const order = [];
    const re = new RegExp("^" + esc(k).replace(/\\\{(\d+)\\\}/g, (_, n) => { order.push(+n); return "([\\s\\S]*?)"; }) + "$");
    const lit = k.replace(/\{\d+\}/g, "").length;
    const p = { re, order, out: D[k], len: lit, lit };
    const w = words.sort((a, b) => b.length - a.length)[0];
    if (!byWord.has(w)) byWord.set(w, []);
    byWord.get(w).push(p);
  }
  for (const l of byWord.values()) l.sort((a, b) => b.len - a.len);

  const cache = new Map();
  const GER = /[äöüßÄÖÜ]|[A-Za-z]{2}/;
  const FUNC = /\b(der|die|das|den|dem|des|und|ist|ein|eine|einen|nicht|mit|auf|für|zu|zum|zur|im|vom|von|bei|noch|schon|wird|hat|sind|dein|deine|wir|euch|eure|uns)\b/;
  const german = x => (x.match(/[äöüßÄÖÜ]/g) || []).length + (x.match(new RegExp(FUNC.source, "g")) || []).length;
  function viaPattern(s) {
    const words = new Set(s.match(/[A-Za-zÄÖÜäöüß]{3,}/g) || []), cands = [];
    for (const w of words) { const l = byWord.get(w); if (l) cands.push(...l); }
    cands.sort((a, b) => b.len - a.len);
    let first = null;
    for (const p of cands) {
      const m = s.match(p.re); if (!m) continue;
      const caps = m.slice(1).map(tr);
      const out = p.out.replace(/\{(\d+)(l?)\}/g, (_, n, lo) => { const i = p.order.indexOf(+n), v = i < 0 ? "" : caps[i]; return lo ? v.charAt(0).toLowerCase() + v.slice(1) : v; });
      // unübersetzte kleingeschriebene Wörter im Platzhalter („ein“, „zusammen“) sprechen gegen dieses Muster
      const susp = caps.some((c, i) => c === m[i + 1] && /^[a-zäöüß]{2,}$/.test(c.trim())) || m.slice(1).some(c => /[.!?]\s+\S/.test(c));   // Platzhalter über mehrere Sätze: falsches Muster
      if (!susp && !german(out)) return out;
      if (first == null && !susp) first = out;
    }
    return first;
  }
  const NOUN = (t, src) => /^[A-ZÄÖÜ]/.test(src) && /^[A-Z][a-z]/.test(t) ? t[0].toLowerCase() + t.slice(1) : t;
  function core(s) {
    if (exact.has(s)) return exact.get(s);
    let m = s.match(/^([\s\S]*?[^\d\s×])(\s*×\s*\d+|\s+\d+)$/);   // „Farbe der Extras 3“, „Muschel ×4“
    if (m && exact.has(m[1])) return exact.get(m[1]) + m[2];
    m = s.match(/^([+−\-]?[\d.,]+[×x]?\s*)(\S[\s\S]*)$/);  // „3 Tage“, „+40 Punkte“
    if (m && exact.has(m[2])) return m[1] + NOUN(exact.get(m[2]), m[2]);
    m = s.match(/^([\s\S]+?)([!?.:…]+)$/);
    if (m && exact.has(m[1])) return exact.get(m[1]) + m[2];
    m = s.match(/^([·\-–,:;\s]*)([\s\S]*?)([\s·\-–,:;]*)$/);   // Trenner am Rand
    if (m && (m[1] || m[3]) && m[2] && exact.has(m[2])) return m[1] + exact.get(m[2]) + m[3];
    m = s.match(/^([^A-Za-zÄÖÜäöüß0-9+−\-„“"(]+)(\S[\s\S]*)$/u);   // Emoji vorne
    if (m) { const t = tr(m[2]); if (t !== m[2]) return m[1] + t; }
    const found = [];
    const p = viaPattern(s); if (p != null) { if (!german(p)) return p; found.push(p); }
    // Zusammengesetztes: „Name (am Handy)“, mehrere Sätze, „Smilla, Gärtner:in“, „A · B“
    m = s.match(/^([\s\S]*?)\s*\(([^()]+)\)$/);
    if (m) { const a = m[1] ? tr(m[1]) : "", w = "(" + m[2] + ")", bw = exact.get(w), b = bw ? bw.replace(/^\(|\)$/g, "") : tr(m[2]); if (a !== m[1] || b !== m[2]) found.push((m[1] ? a + " " : "") + "(" + b + ")"); }
    const sent = s.split(/(?<=[.!?…])\s+(?=\S)/);
    if (sent.length > 1) {   // längste bekannte Satzfolge zuerst („Ein Fischer hat … erzählt. So entspannte … meinte er.“)
      const t = [];
      for (let i = 0; i < sent.length;) {
        let j = sent.length - 1;
        let r = null;
        for (; j > i; j--) { const c = sent.slice(i, j + 1).join(" "); r = exact.has(c) ? exact.get(c) : viaPattern(c); if (r != null && !german(r)) break; r = null; }
        t.push(r != null ? r : tr(sent[i])); i = j + 1;
      }
      const out = t.join(" "); if (out !== s) found.push(out);
    }
    for (const sep of [" · ", ", ", ": ", " – "]) if (s.includes(sep)) {
      const parts = s.split(sep), t = parts.map(tr); if (t.some((x, i) => x !== parts[i])) { found.push(t.join(sep)); break; }
    }
    if (!found.length) return null;
    return found.sort((a, b) => german(a) - german(b))[0];
  }
  function tr(s) {
    if (typeof s !== "string" || !s || !GER.test(s)) return s;
    if (cache.has(s)) return cache.get(s);
    const m = s.match(/^(\s*)([\s\S]*?)(\s*)$/), body = m[2].replace(/\s+/g, " ");
    let t = core(body);
    t = t == null ? s : m[1] + t + m[3];
    t = t.replace(/\b1 ((?:[a-z]+ ){0,2})(days|hours|points|islanders|minutes|weeks|times|postcards|stamps|fish)\b/g, (x, a, w) => "1 " + a + w.replace(/s$/, ""))
         .replace(/\b(a|an|A|An) (Chicken|Goat|Sheep|Donkey|Cat|Dog|Guinea pig|Rabbit|Seal|Dolphin|Whale|Parrot|Moose|Camel|Polar bear)\b/g, (x, a, w) => a + " " + w.toLowerCase());
    if (cache.size > 5000) cache.clear();
    cache.set(s, t);
    return t;
  }
  window.OFFLAND_T = tr;

  // DOM übersetzen: neue Knoten und geänderte Texte gleich nach dem Einfügen (vor dem Zeichnen)
  const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "CODE", "PRE"]);   // Eingabefelder: nur Platzhalter/Beschriftung, nie den Inhalt
  const ATTRS = ["aria-label", "title", "placeholder", "alt"];
  const skipEl = el => !el || SKIP.has(el.nodeName) || (el.closest && el.closest("[data-noi18n],[contenteditable]"));
  function text(n) { const v = n.nodeValue, t = tr(v); if (t !== v) n.nodeValue = t; }
  function attrs(el) { for (const a of ATTRS) { const v = el.getAttribute(a); if (v) { const t = tr(v); if (t !== v) el.setAttribute(a, t); } } }
  function walk(root) {
    if (root.nodeType === 3) { if (!skipEl(root.parentElement)) text(root); return; }
    if (root.nodeType !== 1 || skipEl(root)) return;
    attrs(root);
    const it = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n;
    while ((n = it.nextNode())) {
      if (n.nodeType === 3) { if (!skipEl(n.parentElement)) text(n); }
      else if (!skipEl(n)) attrs(n);
    }
  }
  const mo = new MutationObserver(list => {
    for (const r of list) {
      if (r.type === "childList") r.addedNodes.forEach(walk);
      else if (r.type === "characterData") { if (!skipEl(r.target.parentElement)) text(r.target); }
      else if (r.type === "attributes" && !skipEl(r.target)) attrs(r.target);
    }
  });
  const start = () => { walk(document.documentElement); document.title = tr(document.title); mo.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS }); };
  if (document.documentElement) start();
  document.addEventListener("DOMContentLoaded", () => walk(document.body));

  // Dialoge, Teilen und Text in Bildern (Canvas)
  for (const f of ["alert", "confirm", "prompt"]) { const o = window[f]; if (o) window[f] = (m, ...r) => o.call(window, tr(m), ...r); }
  if (navigator.share) { const o = navigator.share.bind(navigator); navigator.share = d => o(Object.assign({}, d, d && d.text ? { text: tr(d.text) } : {}, d && d.title ? { title: tr(d.title) } : {})); }
  const C = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
  if (C) for (const f of ["fillText", "strokeText", "measureText"]) { const o = C[f]; C[f] = function (s, ...r) { return o.call(this, tr(String(s)), ...r); }; }
})();
