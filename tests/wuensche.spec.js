// Wünsche der Bewohner
const { test, expect, newGame } = require("./helpers");

test("Gegenstände machen etwa jeden dritten Wunsch aus", async ({ page }) => {
  await newGame(page);
  const r = await page.evaluate(() => {
    const S = T.S; S.allFeatures = true; S.dayCount = 10; S.glueck = 60;
    S.residents.forEach(x => { if (x.kind === "mensch") { x.job = x.job || "koch"; x.born = 0; } });
    const c = {}; let n = 0;
    for (let i = 0; i < 3000; i++) { S.wish = null; T.makeWish(); if (S.wish) { c[S.wish.type] = (c[S.wish.type] || 0) + 1; n++; } }
    return { c, n };
  });
  expect(r.c.quests).toBeUndefined();
  expect(r.c.plan).toBeGreaterThan(0);
  const share = r.c.item / r.n;
  expect(share).toBeGreaterThan(0.25);
  expect(share).toBeLessThan(0.45);
});

test("Vorhaben-Wunsch wird mit dem Vorhaben erfüllt", async ({ page }) => {
  await newGame(page);
  const r = await page.evaluate(() => {
    const S = T.S, rid = S.residents.find(x => x.kind === "mensch").id;
    S.wish = { rid, type: "plan", plan: "lesen", start: S.dayCount, until: S.dayCount + 4, pts: 30, gl: 4 };
    const p0 = S.points; T.planResult(true, "lesen", T.today());
    return { wish: S.wish, gained: S.points - p0 };
  });
  expect(r.wish).toBeNull();
  expect(r.gained).toBeGreaterThanOrEqual(50);
});

test("Alte Quest-Wünsche verfallen still", async ({ page }) => {
  await newGame(page);
  const w = await page.evaluate(() => {
    const S = T.S, rid = S.residents.find(x => x.kind === "mensch").id;
    S.wish = { rid, type: "quests", need: 2, start: S.dayCount, until: S.dayCount + 5 };
    T.wishCheck(); return S.wish;
  });
  expect(w).toBeNull();
});
