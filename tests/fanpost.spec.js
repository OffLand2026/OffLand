// Fanpost: nach guten Tagen schreiben Verwandte und Nachbarinseln Positives
const { test, expect, newGame, dismiss } = require("./helpers");

test("Fanpost kommt nach guten Tagen, landet im Album und gibt Glück", async ({ page }) => {
  await newGame(page);
  const before = 60;
  await page.evaluate(() => { T.S.glueck = 60; T.S.pending = [{ type: "fanpost" }]; T.showPending(); });
  await expect(page.locator("#modalRoot .label").first()).toContainText("Fanpost");
  const r = await page.evaluate(() => ({ g: T.S.glueck, n: T.S.postcards.length, fan: T.S.postcards[0].fan, text: T.S.postcards[0].text }));
  expect(r.g).toBe(before + 2);
  expect(r.n).toBe(1);
  expect(r.fan).toBe(true);
  expect(r.text.length).toBeGreaterThan(20);
  await dismiss(page);
});

test("Fanpost kommt von selbst nach einigen guten Tagen", async ({ page }) => {
  await newGame(page);
  const n = await page.evaluate(() => {
    const S = T.S; let fan = 0;
    for (let i = 0; i < 20; i++) { T.closeDay(Math.round(S.budget * 0.5), [], {}); fan += S.pending.filter(e => e.type === "fanpost").length; S.pending = []; }
    return fan;
  });
  expect(n).toBeGreaterThanOrEqual(1);
});
