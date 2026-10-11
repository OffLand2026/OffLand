// Fehlerberichte: nur mit Zustimmung, gleiche Fehler werden zusammengefasst, nur technische Angaben
const { test, expect } = require("./helpers");

async function start(page, consent) {
  await page.addInitScript(consent => {
    window.INCS = []; window.SETS = [];
    window.OFFLAND_FAKE_NET = { uid: "fake", get: async () => null, set: async (p, v) => { window.SETS.push([p, v]); }, del: async () => {}, list: async () => [], count: async () => 0,
      inc: async (p, o) => { window.INCS.push([p, o]); } };
    localStorage.setItem("offland-stats", JSON.stringify({ consent }));
  }, consent);
  await page.goto("/");
  await page.click("#newAcc"); await page.fill("#accName", "Fehla"); await page.click("#accCreate");
}
const boom = page => page.evaluate(() => { for (let i = 0; i < 2; i++) window.dispatchEvent(new ErrorEvent("error", { message: "TypeError: kaputt", filename: location.origin + "/js/app.js", lineno: 12, colno: 3, error: new Error("kaputt") })); });

test("Fehler werden mit Zustimmung gesammelt und zusammengefasst gesendet", async ({ page }) => {
  await start(page, true);
  await boom(page);
  await page.waitForFunction(() => window.SETS.some(s => s[0].startsWith("errors/")), null, { timeout: 8000 });
  const r = await page.evaluate(() => ({ sets: window.SETS.filter(s => s[0].startsWith("errors/")), incs: window.INCS.filter(s => s[0].startsWith("errors/")) }));
  expect(r.sets).toHaveLength(1);
  const [path, doc] = r.sets[0];
  expect(path).toMatch(/^errors\/e[0-9a-z]+$/);
  expect(doc.msg).toBe("TypeError: kaputt");
  expect(doc.src).toBe("/js/app.js:12:3");                    // ohne Adresse der Seite
  expect(Object.keys(doc).sort()).toEqual(["last", "msg", "src", "stack", "v"]);
  expect(r.incs[0][1]).toEqual({ n: 2, p_web: 2 });
});

test("Ohne Zustimmung wird nichts gesendet und nichts aufgehoben", async ({ page }) => {
  await start(page, false);
  await boom(page);
  await page.waitForTimeout(4500);
  expect(await page.evaluate(() => window.SETS.filter(s => s[0].startsWith("errors/")).length)).toBe(0);
  expect(await page.evaluate(() => localStorage.getItem("offland-errors"))).toBeNull();
});
