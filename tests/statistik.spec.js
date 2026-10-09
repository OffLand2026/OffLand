// Anonyme Statistik: erst nach Zustimmung senden, nur Zähler
const { test, expect, dismiss } = require("./helpers");

async function start(page) {
  await page.addInitScript(() => {
    window.INCS = [];
    window.OFFLAND_FAKE_NET = { uid: "fake", get: async () => null, set: async () => {}, del: async () => {}, list: async () => [], count: async () => 0,
      inc: async (p, o) => { window.INCS.push([p, o]); } };
  });
  await page.goto("/");
  await page.click("#newAcc"); await page.fill("#accName", "Stat"); await page.click("#accCreate");
  await page.click("#storySkip"); await page.click("#startBtn"); await dismiss(page);
  await page.evaluate(() => { T.closeDay(30, [], {}); T.showPending(); });
}
async function answer(page, id) {
  for (let i = 0; i < 12 && !(await page.$("#" + id)); i++) {
    const ok = await page.$("#modalRoot [data-c=egal], #modalRoot #boatYes, #modalRoot [data-ok], #modalRoot #nameOk"); if (!ok) break; await ok.click(); await page.waitForTimeout(60);
  }
  await page.click("#" + id);
}

test("Mit Zustimmung werden nur Tageszähler gesendet", async ({ page }) => {
  await start(page);
  await answer(page, "stYes");
  await page.waitForFunction(() => window.INCS.length > 0, null, { timeout: 8000 });
  const [path, data] = await page.evaluate(() => window.INCS[0]);
  expect(path).toMatch(/^stats\/\d{4}-\d{2}-\d{2}$/);
  expect(data).toMatchObject({ aktiv: 1, konto_neu: 1, insel_start: 1, intro_skip: 1, tag: 1, tag_gut: 1 });
  for (const v of Object.values(data)) expect(typeof v).toBe("number");
  expect(JSON.stringify(data)).not.toContain("Stat");
});

test("Ohne Zustimmung wird nichts gesendet", async ({ page }) => {
  await start(page);
  await answer(page, "stNo");
  await page.evaluate(() => { T.closeDay(30, [], {}); });
  await page.waitForTimeout(4500);
  expect(await page.evaluate(() => window.INCS.length)).toBe(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("offland-stats")).consent)).toBe(false);
});
