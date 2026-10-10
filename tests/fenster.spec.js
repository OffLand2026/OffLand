// Fenster nach dem Eintragen: Tagesbilanz zuerst, höchstens 3 am Stück
const { test, expect, newGame } = require("./helpers");

test("Tagesbilanz kommt zuerst, danach höchstens zwei weitere Fenster", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => {
    document.getElementById("modalRoot").innerHTML = "";
    T.S.pending = [{ type: "unlock", ids: ["laden"] }, { type: "fanpost" }, { type: "fanpost" }, { type: "fanpost" }];
    T.closeDay(30, [], {});
  });
  await expect(page.locator("#modalRoot .label").first()).toContainText("Tagesbilanz");
  let shown = 1;
  for (let i = 0; i < 10; i++) {
    const b = await page.$("#modalRoot [data-ok], #modalRoot #planSkip, #modalRoot #nameOk");
    if (!b) break;
    await b.click(); await page.waitForTimeout(80);
    if (await page.$("#modalRoot .modal")) shown++;
  }
  expect(shown).toBeLessThanOrEqual(3);
  expect(await page.evaluate(() => T.S.pending.length)).toBeGreaterThan(0);   // der Rest wartet
});

test("Beim nächsten Öffnen kommen Inselladen-Freischaltung und Statistik-Frage", async ({ page }) => {
  await page.addInitScript(() => {
    window.OFFLAND_FAKE_NET = { uid: "fake", get: async () => null, set: async () => {}, del: async () => {}, list: async () => [], count: async () => 0, inc: async () => {} };
  });
  await newGame(page);
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.S.pending = []; T.closeDay(30, [], {}); });
  // die ersten drei Fenster wegklicken
  for (let i = 0; i < 3; i++) { const b = await page.$("#modalRoot [data-ok]"); if (!b) break; await b.click(); await page.waitForTimeout(80); }
  const rest = await page.evaluate(() => T.S.pending.map(e => e.type));
  expect(rest).toContain("unlock");
  expect(rest[rest.length - 1]).toBe("statsAsk");
  // zufällige Ereignisse (Streit, Besuch …) für den Test herausnehmen
  await page.evaluate(() => { T.S.pending = T.S.pending.filter(e => e.type === "unlock" || e.type === "statsAsk"); T.S.conflict = null; document.getElementById("modalRoot").innerHTML = ""; });
  // App kommt aus dem Hintergrund zurück
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { value: false, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect(page.locator("#modalRoot .label").first()).toContainText("Neu freigeschaltet");
  await page.click("#modalRoot [data-ok]");
  await expect(page.locator("#modalRoot")).toContainText("OffLand besser zu machen");
});
