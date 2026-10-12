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
  await expect(page.locator('#lookPrev > svg [filter^="url(#lv"]')).toHaveCount(0);
});

test("Editor: Leuchtaugen, Muster und Bart wählen", async ({ page }) => {
  await newGame(page);
  const id = await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; const r = T.S.residents.find(x => x.kind === "mensch" && x.job); T.nameSheet({ type: "rename", id: r.id }); return r.id; });
  await expect(page.locator('#modalRoot [data-look="eye"]')).toHaveCount(5);
  await expect(page.locator("#lookPrev .look-shadow")).toBeVisible();
  await page.click('#modalRoot [data-look="eye"][data-v="3"]');
  await expect(page.locator('#lookPrev .look-shadow [fill="#FF8FB1"]').first()).toBeAttached();
  await page.click('#modalRoot [data-pane="kleidung"]');
  await page.click('#modalRoot [data-look="pat"][data-v="1"]');
  await page.click('#modalRoot [data-look="shirt"][data-v="2"]');           // Farbwechsel baut die Muster-Knöpfe neu
  await page.click('#modalRoot [data-pane="gesicht"]');
  await page.click('#modalRoot [data-look="beard"][data-v="4"]');
  await page.click('#modalRoot [data-pane="haare"]');
  await page.click('#modalRoot [data-look="style"][data-v="13"]');
  await page.click("#nameOk");
  const look = await page.evaluate(id => T.S.residents.find(x => x.id === id).look, id);
  expect([look.eye, look.pat, look.shirt, look.beard, look.style]).toEqual([3, 1, 2, 4, 13]);
});

test("Ganz Mensch erst ab 80 % Glück", async ({ page }) => {
  await newGame(page);
  const r = await page.evaluate(() => {
    const M = T.S.residents.filter(x => x.kind === "mensch"); M[0].phone = false; M[0].lv = 4;
    T.S.glueck = 58; const a = T.lvOf(M[0]);
    T.S.glueck = 70; const b = T.lvOf(M[0]);
    T.S.glueck = 85; const c = T.lvOf(M[0]);
    return [a, b, c];
  });
  expect(r).toEqual([2, 3, 4]);
});

test("Arme hoch nur bei 100 % Glück", async ({ page }) => {
  await newGame(page);
  const n = await page.evaluate(() => {
    const M = T.S.residents.filter(x => x.kind === "mensch"); M.forEach(m => { m.phone = false; m.lv = 4; });
    T.S.glueck = 95; T.render(); const a = document.querySelectorAll('#scene path[d^="M-5.6 -10l-4.4-6"]').length;
    T.S.glueck = 100; T.render(); const b = document.querySelectorAll('#scene path[d^="M-5.6 -10l-4.4-6"]').length;
    return [a, b];
  });
  expect(n[0]).toBe(0);
  expect(n[1]).toBeGreaterThan(0);
});

test("Testleiste: simulierte Tage zeigen, was passiert", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => { T.S.testmode = true; T.render(); });
  await expect(page.locator("#devBar")).toBeVisible();
  await page.click('#devBar [data-dev="good"]');
  await expect(page.locator("#devBar .dev-res")).toContainText("Glück");
  await dismiss(page);
  await page.click('#devBar [data-dev="off"]');
  await expect(page.locator("#devBar")).toHaveCount(0);
});
