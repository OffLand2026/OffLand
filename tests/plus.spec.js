// Plus-Woche zum Start: Willkommens-Fenster zuerst, Abzeichen zählt die Tage herunter
const { test, expect, dismiss } = require("./helpers");

test("Neue Insel startet mit 7 Tagen Plus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1080 });
  await page.goto("/");
  await page.click("#newAcc"); await page.fill("#accName", "Pia"); await page.click("#accCreate");
  await page.click("#storySkip"); await page.click("#startBtn");
  await expect(page.locator("#modalRoot h2")).toHaveText("Deine erste Woche geht aufs Haus");
  await expect(page.locator(".ps-feat > div").first()).toContainText("Weltreise");
  await expect(page.locator(".ps-feat > div").nth(1)).toContainText("Familieninsel");
  if (process.env.SHOTS) await page.screenshot({ path: process.env.SHOTS + "/plusstart.png" });
  await page.click("text=Los geht's");
  await dismiss(page);
  await expect(page.locator("#streakChip")).toHaveText("★ Plus · noch 7 Tage");
  // nach 6 Tagen ist der letzte Tag, danach ist das Abzeichen weg
  await page.evaluate(() => { T.S.plus.until = T.today(); T.render(); });
  await expect(page.locator("#streakChip")).toHaveText("★ Plus · letzter Tag");
  await page.evaluate(() => { T.S.plus.until = T.addDays(T.today(), -1); T.render(); });
  await expect(page.locator("#streakChip")).not.toContainText("Plus");
  // kommt nur einmal
  expect(await page.evaluate(() => !!T.S.plusTrial)).toBe(true);
});
