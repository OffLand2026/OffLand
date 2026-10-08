// Inseltagebuch: kompakt, alles im Fenster mit Filter
const { test, expect, dismiss, newGame } = require("./helpers");

test("Tagebuch zeigt drei Einträge und öffnet die ganze Liste", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => { const S = T.S; for (let i = 0; i < 10; i++) { T.closeDay(Math.round(S.budget * (i % 3 ? 0.5 : 1.5)), [], {}); S.pending = []; } T.render(); });
  await dismiss(page);
  await page.click("[data-tab=verlauf]");
  const card = page.locator(".card.feed", { hasText: "Inseltagebuch" });
  await expect(card.locator("li")).toHaveCount(3);
  await card.locator("[data-feed=feed]").click();
  await expect(page.locator("#feedBody .feed-day").first()).toBeVisible();
  const all = await page.locator("#feedBody li").count();
  await page.click("[data-ff=good]");
  const good = await page.locator("#feedBody li").count();
  expect(good).toBeLessThan(all);
  expect(good).toBeGreaterThan(0);
});
