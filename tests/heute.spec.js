// Heute im neuen Stil: Chips, Hauptkarte, Eintragen, Inselgeflüster
const { test, expect, dismiss, newGame } = require("./helpers");

test("Hauptkarte öffnet das Eintragen und schließt den Tag ab", async ({ page }) => {
  await newGame(page, "Mia");
  await expect(page.locator("#title")).toHaveText("Hallo Mia");
  await expect(page.locator(".scene-chips .cp")).toHaveCount(3);
  if (await page.$("#goalGo")) await page.click("#goalGo");
  await page.fill("#inH", "1"); await page.fill("#inM", "0");
  await page.click("#closeBtn");
  await dismiss(page);
  expect(await page.evaluate(() => T.S.days.length)).toBe(1);
  await expect(page.locator(".hmain .hm-title")).toContainText("unter dem Ziel");
});

test("Inselgeflüster zeigt mehr im Fenster", async ({ page }) => {
  await newGame(page);
  await expect(page.locator(".whisper").first()).toContainText("Lucifer");
  const more = page.locator("#whMore");
  if (await more.count()) { await more.click(); await expect(page.locator("#modalRoot .whisper .row")).not.toHaveCount(0); }
});
