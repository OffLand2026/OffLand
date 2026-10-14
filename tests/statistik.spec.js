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
  // Nach dem ersten Tag steht die Frage in der Warteschlange und kommt beim nächsten Öffnen
  const queued = await page.evaluate(() => { T.closeDay(30, [], {}); return T.S.pending.some(e => e.type === "statsAsk"); });
  expect(queued).toBe(true);
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.S.pending = [{ type: "statsAsk" }]; T.showPending(); });
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
  expect(path).toMatch(/^stats\/\d{4}-\d{2}-\d{2}_s\d$/);   // auf 10 Teil-Dokumente pro Tag verteilt
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

test("Ab Tag 8: Veränderung zur ersten Woche nur als Stufe", async ({ page }) => {
  await start(page);
  await answer(page, "stYes");
  const q = await page.evaluate(() => {
    // Woche 1: 200 min am Tag (der erste Tag mit 30 min ist schon eingetragen)
    T.S.days = T.S.days.slice(0, 0); for (let i = 0; i < 7; i++) T.closeDay(200, [], {});
    const before = JSON.parse(localStorage.getItem("offland-stats")).q || {};
    T.closeDay(150, [], {});   // Tag 8: 25 % weniger → Woche 2, Stufe 15–30 %
    T.closeDay(260, [], {});   // Tag 9: 30 % mehr → Woche 2, Stufe „mehr als 15 % mehr“
    const d = JSON.parse(localStorage.getItem("offland-stats"));
    return { before, q: d.q || {} };
  });
  expect(Object.keys(q.before).some(k => k.startsWith("bz_"))).toBe(false);
  const all = Object.assign({}, q.q); for (const k in q.before) if (k.startsWith("bz_")) delete all[k];
  expect(all.bz_w2_m15).toBe(1);
  expect(all.bz_w2_pp).toBe(1);
  expect(Object.keys(all).filter(k => k.startsWith("bz_")).length).toBe(2);
});
