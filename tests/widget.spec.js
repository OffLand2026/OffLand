// iPhone-App: Die Web-App aus www/ läuft in der Capacitor-Hülle. Die native Brücke liefert nur
// PluginHeaders und nativePromise, aber kein registerPlugin. Das kommt aus dem Capacitor-Kern
// (js/capacitor.js), den scripts/build-www.mjs in www/index.html einbindet.
// Hier wird die native Brücke genau so nachgestellt und mitgeschrieben, was bei den Plugins ankommt.
const { execSync } = require("child_process");
const { test, expect, dismiss } = require("./helpers");

// Alle Tests dieser Datei in einem Prozess nacheinander: Sonst bauen mehrere Prozesse gleichzeitig www/ neu
// (build-www löscht den Ordner zuerst) und stören sich gegenseitig.
test.describe.configure({ mode: "default" });
test.beforeAll(() => { execSync("node scripts/build-www.mjs", { stdio: "ignore" }); });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__native = [];
    window.webkit = { messageHandlers: { bridge: { postMessage() {} } } };   // so erkennt der Capacitor-Kern iOS
    const m = (...names) => names.map(name => ({ name, rtype: "promise" })).concat([{ name: "addListener", rtype: "callback" }, { name: "removeListener", rtype: "promise" }, { name: "removeAllListeners", rtype: "promise" }]);
    window.Capacitor = {   // wie native-bridge.js: kein registerPlugin
      PluginHeaders: [
        { name: "ScreenTime", methods: m("status", "authorize", "pickApps", "minutes", "stop", "showAverage", "widget", "shieldPick", "shieldSet", "shieldFocus", "shieldInfo", "shieldStats") },
        { name: "PlusStore", methods: m("products", "purchase", "status", "restore", "manage") },
        { name: "LiveIsland", methods: m("start", "end") },
        { name: "FocusAlarm", methods: m("schedule", "cancel") }
      ],
      nativePromise: (plugin, method, opts) => { window.__native.push({ plugin, method, opts }); return Promise.resolve(plugin === "ScreenTime" && method === "widget" ? { group: true, stored: opts.json.length, file: true, img: !!opts.png } : {}); },
      nativeCallback: () => "cb1",
      isNativePlatform: () => true,
      getPlatform: () => "ios"
    };
  });
});

async function newGameApp(page) {
  await page.goto("/www/index.html");
  await page.click("#newAcc");
  await page.fill("#accName", "Testi");
  await page.click("#accCreate");
  await page.click("#storySkip");
  await page.click("#startBtn");
  await dismiss(page);
}
const widgetCalls = (page) => page.evaluate(() => window.__native.filter(c => c.plugin === "ScreenTime" && c.method === "widget").map(c => JSON.parse(c.opts.json)));

test("iPhone-App: Capacitor-Kern ist eingebunden, das Widget bekommt die echten Inselwerte", async ({ page }) => {
  await newGameApp(page);
  expect(await page.evaluate(() => typeof window.Capacitor.registerPlugin)).toBe("function");
  const calls = await widgetCalls(page);
  expect(calls.length).toBeGreaterThan(0);
  const d = calls[calls.length - 1];
  const s = await page.evaluate(() => ({ g: Math.round(T.S.glueck), p: T.S.residents.filter(r => r.status === "da" && r.kind === "mensch").length }));
  expect(d.glueck).toBe(s.g);
  expect(d.people).toBe(s.p);
  expect(typeof d.name).toBe("string");
  // Woche (7 Werte, heute zuletzt), Tageszeit des Bildes und das Inselbild selbst
  expect(d.week.length).toBe(7);
  expect(["nacht", "morgen", "tag", "abend"]).toContain(d.imgPhase);
  const png = await page.evaluate(() => { const c = window.__native.filter(c => c.plugin === "ScreenTime" && c.method === "widget").pop(); return c.opts.png || ""; });
  expect(png.length).toBeGreaterThan(5000);
  expect(Buffer.from(png.slice(0, 12), "base64").slice(1, 4).toString()).toBe("PNG");
  // auch die anderen nativen Plugins sind erreichbar
  expect(await page.evaluate(() => window.__native.some(c => c.plugin === "PlusStore"))).toBe(true);
});

test("iPhone-App: Zurück in der App werden die Widget-Werte erneut geschickt", async ({ page }) => {
  await newGameApp(page);
  const before = (await widgetCalls(page)).length;
  await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  await expect.poll(async () => (await widgetCalls(page)).length).toBe(before + 1);
});

test("iPhone-App: Diagnose in den Einstellungen zeigt Brücke, Plugins und Widget-Status", async ({ page }) => {
  await newGameApp(page);
  await page.evaluate(() => T.settingsSheet());
  const card = page.locator("#diagCard");
  await expect(card).toBeVisible();
  await card.locator("summary").click();
  await expect(card).toContainText("Brücke ✓");
  await expect(card).toContainText("ScreenTime ✓");
  const before = (await widgetCalls(page)).length;
  await page.click("#diagSend");
  await expect.poll(async () => (await widgetCalls(page)).length).toBe(before + 1);
  await expect(card).toContainText("App-Gruppe ✓");
  await expect(card).toContainText("Datei ✓");
  await expect(card).toContainText("Bild ✓");
});

test("iPhone-App: Entwickler-Bereich nur per Schalter, obwohl die App unter „localhost“ läuft", async ({ page }) => {
  await newGameApp(page);
  expect(await page.evaluate(() => location.hostname)).toBe("localhost");
  await page.evaluate(() => T.settingsSheet());
  await expect(page.locator("#verLine")).toBeVisible();
  await expect(page.locator(".set-dev")).toHaveCount(0);
  await expect(page.locator("#devPlusOn")).toHaveCount(0);
  for (let i = 0; i < 7; i++) await page.click("#verLine");   // 7× auf „Version“
  await expect(page.locator("#devPlus")).toBeVisible();
  await expect(page.locator("#devSsn")).toBeVisible();
});

// Capacitor liefert für Pfade ohne Dateiendung (z. B. „impressum/“) die Startseite aus. Darum müssen alle
// eigenen Links auf eine Datei zeigen, sonst landet man auf einer kaputten Startseite ohne Styles.
test("iPhone-App: Impressum und Datenschutz verlinken auf echte Dateien", async ({ page }) => {
  const fs = require("fs");
  await newGameApp(page);
  await page.evaluate(() => T.settingsSheet());
  const hrefs = await page.locator("#modalRoot a[href]").evaluateAll(as => as.map(a => a.getAttribute("href")));
  expect(hrefs).toContain("impressum/index.html");
  expect(hrefs).toContain("datenschutz/index.html");
  const own = h => !/^(https?:|mailto:|#|\$\{)/.test(h);
  for (const h of hrefs.filter(own)) expect(h, h).toMatch(/\.html$/);
  for (const f of ["www/impressum/index.html", "www/datenschutz/index.html"]) {
    const links = [...fs.readFileSync(f, "utf8").matchAll(/href="([^"]+)"/g)].map(m => m[1]).filter(own);
    for (const h of links) expect(h === "../" || /\.(html|png|css)$/.test(h), `${f}: ${h}`).toBe(true);
  }
  await page.click('#modalRoot a[href="impressum/index.html"]');
  await expect(page.locator("h1")).toHaveText("Impressum");
});

test("iPhone-App: Online testen zeigt Anmeldung und Lesen Schritt für Schritt", async ({ page }) => {
  await page.addInitScript(() => {
    window.OFFLAND_FAKE_NET = { uid: "fake123", get: async () => null, set: async () => {}, del: async () => {}, list: async () => [], count: async () => 0, inc: async () => {} };
  });
  await newGameApp(page);
  await page.evaluate(() => T.settingsSheet());
  await page.locator("#diagCard summary").click();
  await page.click("#diagNet");
  await expect(page.locator("#diagOut")).toContainText("✓ Verbindung und Anmeldung");
  await expect(page.locator("#diagOut")).toContainText("✓ Online-Speicher lesen");
});

// Bildschirmzeit gemessen: 95 min an jedem Tag; die Messung läuft
const withMeasure = page => page.addInitScript(() => {
  const C = window.Capacitor, orig = C.nativePromise;
  C.nativePromise = (plugin, method, opts) => {
    if (plugin === "ScreenTime" && method === "status") return Promise.resolve({ available: true, status: "approved", monitoring: true, step: 5 });
    if (plugin === "ScreenTime" && method === "minutes") return Promise.resolve({ day: opts.day, has: true, minutes: 95 });
    return orig(plugin, method, opts);
  };
});

test("iPhone-App: Mit Bildschirmzeit werden vergangene Tage automatisch eingetragen, heute nicht von Hand", async ({ page }) => {
  await withMeasure(page);
  await newGameApp(page);
  await page.evaluate(() => { T.S.autoTime = true; T.S.setup = true; T.S.lastDay = T.addDays(T.today(), -3); T.S.pending = []; T.save(); T.autoTick(); });
  await expect.poll(() => page.evaluate(() => T.S.lastDay)).toBe(await page.evaluate(() => T.addDays(T.today(), -1)));
  expect(await page.evaluate(() => T.S.days.slice(-2).map(d => d.min))).toEqual([95, 95]);
  await page.evaluate(() => { T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.render(); });
  await expect(page.locator("#autoNote")).toContainText("Wird um Mitternacht automatisch eingetragen.");
  // Die Karte zeigt heute bis jetzt (95 min von 3 h), gestern nur als kleine Zeile
  await expect(page.locator(".hmain .hm-head .label")).toHaveText("Heute bis jetzt");
  await expect(page.locator(".hmain .hm-title")).toContainText("1 h 25 min");
  await expect(page.locator(".hmain .hm-title")).toContainText("noch frei");
  await expect(page.locator(".hmain .hm-prev")).toContainText("1 h 35 min · im Ziel");
  await expect(page.locator("#closeBtn, #goalGo")).toHaveCount(0);
  // Tag des Einrichtens bleibt zum Eintragen von Hand (dort fehlt evtl. die Zeit davor)
  await page.evaluate(() => { T.S.lastDay = T.addDays(T.today(), -2); T.S.stSince = { day: T.addDays(T.today(), -1), at: "14:20" }; T.save(); T.autoTick(); });
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => T.S.lastDay)).toBe(await page.evaluate(() => T.addDays(T.today(), -2)));
});

test("iPhone-App: Morgens eine Zusammenfassung statt Tagesbilanz und vieler Fenster", async ({ page }) => {
  await withMeasure(page);
  await newGameApp(page);
  await page.evaluate(() => { T.S.autoTime = true; T.S.lastDay = T.addDays(T.today(), -3); T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.save(); T.autoTick(); });
  await expect(page.locator("#modalRoot")).toContainText("Über Nacht auf deiner Insel");
  await expect(page.locator("#modalRoot")).toContainText("Gestern am Handy");
  await expect(page.locator("#modalRoot")).toContainText("Auch eingetragen:");                 // der vorletzte Tag nur als Zeile
  expect(await page.evaluate(() => T.S.pending.filter(e => e.type === "day").length)).toBe(0);   // keine zweite Tagesbilanz
  await page.click("#msOk");
});

test("iPhone-App: Fokus-Bootsfahrt ohne Vollbild (sonst meldet iOS „localhost ist im Vollbildmodus“)", async ({ page }) => {
  await newGameApp(page);
  const n = await page.evaluate(() => { let c = 0; document.documentElement.requestFullscreen = () => { c++; return Promise.resolve(); }; T.S.pending = []; T.startBoat(25, "lernen", ""); return c; });
  expect(n).toBe(0);
  await expect(page.locator(".focus")).toBeVisible();
});

test("iPhone-App: Ab Tag 2 stellt Lucifer einmal den Insel-Schutz vor", async ({ page }) => {
  await newGameApp(page);
  expect(await page.evaluate(() => T.shieldIntroDue())).toBe(false);          // Tag 0
  await page.evaluate(() => { T.S.dayCount = 2; });
  expect(await page.evaluate(() => T.shieldIntroDue())).toBe(true);
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.shieldIntroSheet(); });
  await expect(page.locator("#modalRoot")).toContainText("Lucifer hat da was für dich");
  await expect(page.locator("#modalRoot .shi-phone")).toContainText("App schließen");
  await page.click("#shiNo");
  expect(await page.evaluate(() => [T.S.shieldIntro, T.shieldIntroDue()])).toEqual([true, false]);   // nur einmal
});

test("iPhone-App: Die Szene startet mit MainViewController, der die eigenen Plugins registriert", () => {
  const fs = require("fs");
  const scene = fs.readFileSync("ios/App/App/SceneDelegate.swift", "utf8");
  expect(scene).toMatch(/rootViewController\s*=\s*MainViewController\(\)/);
  expect(scene).not.toMatch(/rootViewController\s*=\s*CAPBridgeViewController\(\)/);
  const main = fs.readFileSync("ios/App/App/MainViewController.swift", "utf8");
  for (const p of ["ScreenTimePlugin", "FocusAlarmPlugin", "PlusStorePlugin", "LiveIslandPlugin"]) expect(main).toContain(`registerPluginInstance(${p}())`);
});
