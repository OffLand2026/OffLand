// Inselminute: Meeresrauschen bleibt an, auch wenn vorher Hintergrundmusik lief
const { test, expect, newGame } = require("./helpers");

test("Meeresrauschen nach laufender Musik", async ({ page }) => {
  await newGame(page);
  await page.click("body");   // Berührung gibt den Ton frei
  await page.evaluate(() => { T.S.sound = true; T.MUSIC.play("abend", { minutes: 3 }); });
  await page.waitForTimeout(1500);
  await page.evaluate(() => T.calmMinute());
  await page.waitForTimeout(3500);
  const lvl = await page.evaluate(() => T.MUSIC.waveLevel());
  await page.evaluate(() => T.calmEnd(false));
  expect(lvl).toBeGreaterThan(0.4);   // Ziel: 0,5 × 1,5 = 0,75
});
