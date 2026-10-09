// Erste Tage: Zeit-Bilanz nach 5 Tagen und Rückblick nach 7 Tagen kommen genau einmal
const { test, expect, dismiss } = require("./helpers");

async function play(page, mins) {
  return page.evaluate(mins => { const S = T.S, got = [];
    for (const m of mins) { T.closeDay(m, [], {}); got.push(...S.pending.filter(e => e.type === "bilanz").map(e => e.n)); S.pending = []; }
    return got; }, mins);
}
async function show(page, n) {
  await page.evaluate(n => { document.getElementById("modalRoot").innerHTML = ""; T.S.pending = [{ type: "bilanz", n, day: T.addDays(T.S.lastDay, n - 9) }]; T.showPending(); }, n);
}

test("Bilanz nach 5 und Rückblick nach 7 Tagen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  await page.click("#newAcc"); await page.fill("#accName", "Bea"); await page.click("#accCreate");
  await page.click("#storySkip"); await page.click("#startBtn"); await dismiss(page);
  await page.evaluate(() => { T.S.baseline = 250; T.S.budget = 200; });
  const got = await play(page, [190, 150, 260, 140, 175, 120, 160, 150, 150]);
  expect(got).toEqual([5, 7]);
  await show(page, 5);
  await expect(page.locator("#modalRoot h2")).toHaveText("Schau mal, was du dir zurückgeholt hast");
  await expect(page.locator(".bz-hero")).toHaveText("5 h 45 min");          // 60+100+0+110+75 Minuten unter dem alten Schnitt
  await expect(page.locator(".bz-delta")).toContainText("4 h 10 min");
  await expect(page.locator(".bz-cmp > div")).toHaveCount(4);
  await expect(page.locator(".bz-year")).toContainText("17 ganze Tage");
  if (process.env.SHOTS) await page.screenshot({ path: process.env.SHOTS + "/bz5.png" });
  await page.click("#modalRoot [data-ok]");
  await expect(page.locator("#modalRoot .modal")).toHaveCount(0);
  await show(page, 7);
  await expect(page.locator("#modalRoot h2")).toHaveText("Was für eine Woche!");
  await expect(page.locator(".bz-bars > div")).toHaveCount(7);
  await expect(page.locator(".bz-bars i.over")).toHaveCount(1);
  await expect(page.locator(".bz-tiles")).toContainText("6/7");
  if (process.env.SHOTS) await page.screenshot({ path: process.env.SHOTS + "/bz7.png" });
});
