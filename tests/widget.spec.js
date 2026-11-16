// Homescreen-Widget: Die App schickt ihre Werte über das ScreenTime-Plugin an die iOS-Hülle.
// Hier wird die Hülle (Capacitor) im Browser nachgestellt und mitgeschrieben, was ankommt.
const { test, expect, newGame } = require("./helpers");

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__calls = [];
    window.Capacitor = {
      isNativePlatform: () => true,
      getPlatform: () => "ios",
      registerPlugin: (name) => new Proxy({}, {
        get: (t, m) => m === "then" ? undefined : (...a) => {
          window.__calls.push({ plugin: name, method: String(m), args: a });
          return Promise.resolve(name === "ScreenTime" && m === "widget" ? { group: true } : {});
        }
      })
    };
  });
});

const widgetCalls = (page) => page.evaluate(() => window.__calls.filter(c => c.plugin === "ScreenTime" && c.method === "widget").map(c => JSON.parse(c.args[0].json)));

test("Widget bekommt nach der Gründung die echten Inselwerte", async ({ page }) => {
  await newGame(page);
  const calls = await widgetCalls(page);
  expect(calls.length).toBeGreaterThan(0);
  const d = calls[calls.length - 1];
  const s = await page.evaluate(() => ({ g: Math.round(T.S.glueck), p: T.S.residents.filter(r => r.status === "da" && r.kind === "mensch").length }));
  expect(d.glueck).toBe(s.g);
  expect(d.people).toBe(s.p);
  expect(typeof d.name).toBe("string");
  expect(Number.isInteger(d.streak)).toBe(true);
});

test("Zurück in der App: Widget-Werte werden erneut geschickt", async ({ page }) => {
  await newGame(page);
  const before = (await widgetCalls(page)).length;
  await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  await expect.poll(async () => (await widgetCalls(page)).length).toBe(before + 1);
});
