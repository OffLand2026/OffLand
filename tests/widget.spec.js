// iPhone-App: Die Web-App aus www/ läuft in der Capacitor-Hülle. Die native Brücke liefert nur
// PluginHeaders und nativePromise, aber kein registerPlugin. Das kommt aus dem Capacitor-Kern
// (js/capacitor.js), den scripts/build-www.mjs in www/index.html einbindet.
// Hier wird die native Brücke genau so nachgestellt und mitgeschrieben, was bei den Plugins ankommt.
const { execSync } = require("child_process");
const { test, expect, dismiss } = require("./helpers");

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
      nativePromise: (plugin, method, opts) => { window.__native.push({ plugin, method, opts }); return Promise.resolve(plugin === "ScreenTime" && method === "widget" ? { group: true, stored: opts.json.length, file: true } : {}); },
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
  await expect(card).toContainText("Brücke ✓");
  await expect(card).toContainText("ScreenTime ✓");
  const before = (await widgetCalls(page)).length;
  await page.click("#diagSend");
  await expect.poll(async () => (await widgetCalls(page)).length).toBe(before + 1);
  await expect(card).toContainText("App-Gruppe ✓");
  await expect(card).toContainText("Datei ✓");
});

test("iPhone-App: Die Szene startet mit MainViewController, der die eigenen Plugins registriert", () => {
  const fs = require("fs");
  const scene = fs.readFileSync("ios/App/App/SceneDelegate.swift", "utf8");
  expect(scene).toMatch(/rootViewController\s*=\s*MainViewController\(\)/);
  expect(scene).not.toMatch(/rootViewController\s*=\s*CAPBridgeViewController\(\)/);
  const main = fs.readFileSync("ios/App/App/MainViewController.swift", "utf8");
  for (const p of ["ScreenTimePlugin", "FocusAlarmPlugin", "PlusStorePlugin", "LiveIslandPlugin"]) expect(main).toContain(`registerPluginInstance(${p}())`);
});
