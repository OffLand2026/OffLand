// Tagesabschluss: Glück, Punkte, Reparatur, keine Quests mehr
const { test, expect, dismiss, newGame } = require("./helpers");

test("Guter Tag über das Formular", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => { T.S.testmode = true; T.render(); });
  await expect(page.locator("[id^=q_]")).toHaveCount(0);
  const before = await page.evaluate(() => ({ g: T.S.glueck, p: T.S.points, b: T.S.budget }));
  await page.fill("#inH", "0"); await page.fill("#inM", "30");
  await page.click("#closeBtn");
  await dismiss(page);
  const after = await page.evaluate(() => ({ g: T.S.glueck, p: T.S.points, n: T.S.days.length }));
  expect(after.n).toBe(1);
  expect(after.g).toBeGreaterThanOrEqual(Math.min(100, before.g));
  expect(after.p).toBeGreaterThan(before.p);
});

test("Schlechter Tag lässt sich am nächsten guten Tag reparieren", async ({ page }) => {
  await newGame(page);
  const r = await page.evaluate(() => {
    const S = T.S;
    T.closeDay(S.budget + 180, [], {}); S.pending = [];
    const repair = S.repair && S.repair.amount, low = S.glueck;
    T.closeDay(Math.max(0, S.budget - 60), [], {}); S.pending = [];
    return { repair, low, high: S.glueck, left: S.repair, fed: S.feed.slice(0, 8).map(f => f.text).join(" ") };
  });
  expect(r.repair).toBeGreaterThan(0);
  expect(r.high).toBeGreaterThan(r.low);
  expect(r.left).toBeNull();
  expect(r.fed).toMatch(/Reparatur/);
});

test("Viele simulierte Tage laufen ohne Fehler", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => {
    const S = T.S;
    for (let i = 0; i < 40; i++) { T.closeDay(Math.round(S.budget * (i % 4 === 3 ? 1.6 : 0.6)), [], {}); S.pending = []; }
    T.render();
  });
  expect(await page.evaluate(() => T.S.days.length)).toBe(40);
});
