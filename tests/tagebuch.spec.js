// Inseltagebuch: im Album als Zeile mit dem neuesten Eintrag, alles im Fenster mit Filter
const { test, expect, dismiss, newGame } = require("./helpers");

test("Tagebuch zeigt den neuesten Eintrag und öffnet die ganze Liste", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => { const S = T.S; for (let i = 0; i < 10; i++) { T.closeDay(Math.round(S.budget * (i % 3 ? 0.5 : 1.5)), [], {}); S.pending = []; } T.render(); });
  await dismiss(page);
  await page.click("[data-tab=verlauf]");
  const row = page.locator("[data-feed=feed]");
  await expect(row).toContainText("Inseltagebuch");
  await expect(row).toContainText("Einträge");
  await row.click();
  await expect(page.locator("#feedBody .feed-day").first()).toBeVisible();
  const all = await page.locator("#feedBody li").count();
  await page.click("[data-ff=good]");
  const good = await page.locator("#feedBody li").count();
  expect(good).toBeLessThan(all);
  expect(good).toBeGreaterThan(0);
});
