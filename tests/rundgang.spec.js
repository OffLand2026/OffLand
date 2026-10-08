// Alle Tabs in allen Welten öffnen, ohne dass etwas abstürzt
const { test, expect, dismiss, newGame } = require("./helpers");

for (const world of [0, 1, 2, 3, 4]) {
  test(`Alle Tabs in Welt ${world}`, async ({ page }) => {
    await newGame(page);
    await page.evaluate(w => {
      const S = T.S; S.allFeatures = true; S.testmode = true; S.world = w;
      for (let i = 0; i < 9; i++) { T.closeDay(Math.round(S.budget * 0.6), [], {}); S.pending = []; }
      T.render();
    }, world);
    await dismiss(page);
    for (const tab of ["heute", "bewohner", "zeit", "projekt", "freunde", "verlauf"]) {
      await page.click(`[data-tab=${tab}]`);
      await dismiss(page);
      await expect(page.locator("#view")).not.toBeEmpty();
    }
  });
}

test("Wochenrückblick öffnet sich", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => { const S = T.S; for (let i = 0; i < 7; i++) { T.closeDay(60, [], {}); S.pending = []; } T.weekSheet(T.isoWeek(S.lastDay)); });
  await expect(page.locator("#modalRoot .wr-s").first()).toBeVisible();
});
