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
