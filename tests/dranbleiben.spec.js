// Gegen das Nachlassen: Monatsfest mit Stempel, Insel-Jubiläum, Comeback nach einer Pause
const { test, expect, newGame } = require("./helpers");

test.beforeEach(async ({ page }) => { await page.clock.install({ time: new Date("2026-10-20T12:00:00") }); });

async function ready(page) {
  await newGame(page);
  await page.evaluate(() => { T.S.allFeatures = true; T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.render(); });
}

test("Monatsfest: Ziel erreichen gibt Fest und Stempel im Album", async ({ page }) => {
  await ready(page);
  await expect(page.locator(".fy", { hasText: "Oktober: Kürbisfest" })).toBeVisible();
  const r = await page.evaluate(() => {
    const S = T.S; S.days = []; S.lastDay = T.addDays(T.today(), -4); S.mfest = { m: "2026-10", need: 3, done: false };
    for (let i = 0; i < 3; i++) T.closeDay(Math.round(S.budget * 0.5), [], {});
    return { stamps: S.stamps, mfest: S.pending.some(e => e.type === "mfest") };
  });
  expect(r.stamps).toEqual(["2026-10"]);
  expect(r.mfest).toBe(true);
  // nur einmal pro Monat
  expect(await page.evaluate(() => { T.closeDay(10, [], {}); return T.S.stamps.length; })).toBe(1);
  await page.evaluate(() => { T.S.pending = [{ type: "mfest", m: "2026-10" }]; document.getElementById("modalRoot").innerHTML = ""; T.showPending(); });
  await expect(page.locator("#modalRoot h2")).toHaveText("Kürbisfest");
  await page.click("#modalRoot [data-ok]");
  await page.click("[data-tab=verlauf]");
  await expect(page.locator(".alb-st.ok")).toHaveCount(1);
  await expect(page.locator(".alb-st")).toHaveCount(12);
});

test("Spät im Monat gestartet: kleineres Ziel", async ({ page }) => {
  await page.clock.setSystemTime(new Date("2026-10-27T12:00:00"));
  await ready(page);
  expect(await page.evaluate(() => { T.S.mfest = null; return T.festGoal().need; })).toBe(3);
});

test("Jubiläum nach 30 Tagen", async ({ page }) => {
  await ready(page);
  const has = await page.evaluate(() => { const S = T.S; S.days = []; S.lastDay = null;
    for (let i = 0; i < 30; i++) { if (i < 29) S.pending = []; T.closeDay(Math.round(S.budget * 0.6), [], {}); }
    return S.pending.some(e => e.type === "jubi" && e.n === 30); });
  expect(has).toBe(true);
  await page.evaluate(() => { T.S.pending = [{ type: "jubi", n: 30 }]; document.getElementById("modalRoot").innerHTML = ""; T.showPending(); });
  await expect(page.locator("#modalRoot h2")).toHaveText("30 Tage OffLand");
  await expect(page.locator("#modalRoot .jubi-grid b").first()).toHaveText("30");
});

test("Comeback: nach Pause abhaken statt nachtragen", async ({ page }) => {
  await ready(page);
  const y = await page.evaluate(() => { const S = T.S; S.testmode = false; S.lastDay = T.addDays(T.today(), -6); S.sun = 0; T.comebackCheck(); T.showPending(); return T.addDays(T.today(), -1); });
  await expect(page.locator("#cbSkip")).toBeVisible();
  await expect(page.locator("#modalRoot")).toContainText("5 Tage fehlen");
  await page.click("#cbSkip");
  expect(await page.evaluate(() => [T.S.lastDay, T.S.sun])).toEqual([y, 1]);
  // kein zweites Mal für dieselbe Pause
  expect(await page.evaluate(() => { T.comebackCheck(); return T.S.pending.some(e => e.type === "comeback"); })).toBe(false);
});

test("Kurze Pause: kein Comeback-Fenster", async ({ page }) => {
  await ready(page);
  expect(await page.evaluate(() => { const S = T.S; S.testmode = false; S.lastDay = T.addDays(T.today(), -3); T.comebackCheck(); return S.pending.some(e => e.type === "comeback"); })).toBe(false);
});
