// Vorhaben für morgen
const { test, expect, newGame } = require("./helpers");

test("Alle Vorhaben plus spontan, gewünschtes ist markiert", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => {
    const S = T.S; T.closeDay(30, [], {}); S.pending = [];
    S.wish = { rid: S.residents.find(x => x.kind === "mensch").id, type: "plan", plan: "sport", start: S.dayCount, until: S.dayCount + 4 };
    T.planAskSheet({ day: S.lastDay, good: true });
  });
  await expect(page.locator("#modalRoot [data-plan]")).toHaveCount(14);
  await expect(page.locator("#modalRoot [data-plan=sport] .plan-wish")).toHaveCount(1);
  await expect(page.locator("#planGo")).toHaveText("Weiter");
  await page.click("#modalRoot [data-plan=sport]");
  await expect(page.locator("#planGo")).toHaveText("Vormerken");
  await page.click("#planGo");
  expect(await page.evaluate(() => T.S.plan && T.S.plan.id)).toBe("sport");
});
