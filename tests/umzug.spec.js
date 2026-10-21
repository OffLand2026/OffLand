// Neue Inseln: größere Läden, sanft steigende Preise, Umzugskiste für bis zu zwei Lieblingsstücke
const { test, expect, newGame } = require("./helpers");

test("Umzugskiste nimmt Lieblingsstücke mit auf die neue Insel", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => { const S = T.S; S.residents.forEach(r => { if (r.job) r.job = "fischer"; }); S.items.push("teich", "palme", "zwerg"); S.points = 500; S.found = 1; T.render(); });
  await page.evaluate(() => T.travelSheet());
  await expect(page.locator(".kiste-it")).toHaveCount(3);
  await page.click("label[for=kb_teich]"); await page.click("label[for=kb_palme]");
  await expect(page.locator("#kb_zwerg")).toBeDisabled();            // höchstens zwei
  await expect(page.locator("#kisteSum")).toContainText("235 Punkte");  // 160 + 75
  if (process.env.SHOTS) await page.screenshot({ path: process.env.SHOTS + "/kiste.png" });
  await page.click("#trYes");
  const r = await page.evaluate(() => ({ w: T.S.world, here: T.hereItems(), pts: T.S.points }));
  expect(r.w).toBe(1);
  expect(r.here.sort()).toEqual(["palme", "teich"]);
  expect(r.pts).toBe(500 - 235 + 100);                                   // + Umzugsgeld
});

test("Neue Inseln haben 14 Sachen und etwas höhere Preise", async ({ page }) => {
  await newGame(page);
  const r = await page.evaluate(() => {
    T.S.residents.forEach(r => { if (r.job) r.job = "fischer"; });   // ohne Tischler-Rabatt
    const n = w => T.SHOP.filter(it => it.world === w && it.cat !== "vorrat").length;
    const p = id => T.price(T.SHOP.find(x => x.id === id));
    return { tropen: n("tropen"), fjord: n("fjord"), oase: n("oase"), alaska: n("alaska"), kanu: p("t_kanu"), eis: p("a_huskys"), tee: p("tee") };
  });
  expect([r.tropen, r.fjord, r.oase, r.alaska]).toEqual([14, 14, 14, 14]);
  expect(r.kanu).toBe(240);   // 220 × 1,1
  expect(r.eis).toBe(1010);   // 720 × 1,4
  expect(r.tee).toBe(60);     // Vorräte bleiben gleich
});
