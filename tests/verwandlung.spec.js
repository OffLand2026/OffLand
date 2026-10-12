// Verwandlung Smombie → Mensch: Stufen, Regeln beim Tagesabschluss, Editor in voller Farbe
const { test, expect, newGame, dismiss } = require("./helpers");

test("Bewohner werden mit guten Tagen wieder bunt und mit schlechten dunkler", async ({ page }) => {
  await newGame(page);
  const r = await page.evaluate(() => {
    const S = T.S, M = S.residents.filter(x => x.kind === "mensch");
    const a = M[0], b = M[1];
    a.phone = false; a.lv = 1; b.phone = false; b.lv = 4;
    T.closeDay(Math.round(S.budget * .5), [], 0);        // guter Tag
    const up = a.lv;
    T.closeDay(S.budget * 3, [], 0);                       // schlechter Tag
    return { up, down: a.lv, b: b.lv };
  });
  expect(r.up).toBe(2);
  expect(r.down).toBe(1);
  expect(r.b).toBeLessThan(4);
});

test("Stufen sieht man auf der Insel, der Editor zeigt die volle Farbe", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => {
    const M = T.S.residents.filter(x => x.kind === "mensch");
    M[0].phone = false; M[0].lv = 1; M[1].phone = false; M[1].lv = 3; T.render();
  });
  await expect(page.locator('#app [filter="url(#lv1)"]').first()).toBeAttached();
  await expect(page.locator('#app [filter="url(#lv3)"]').first()).toBeAttached();
  await page.evaluate(() => T.nameSheet({ type: "edit", id: T.S.residents.find(x => x.kind === "mensch").id }));
  await expect(page.locator("#modalRoot .lv-hint")).toContainText("Schatten");
  await expect(page.locator('#lookPrev [filter^="url(#lv"]')).toHaveCount(0);
});
