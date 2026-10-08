// Sprüche von Mr. Bay und Lucifer
const { test, expect, newGame } = require("./helpers");

test("Mr. Bay wiederholt sich bei Ankünften nicht ständig", async ({ page }) => {
  await newGame(page);
  const r = await page.evaluate(() => {
    const S = T.S, h = S.residents.find(x => x.kind === "mensch"), a = S.residents.find(x => x.kind === "tier");
    h.phone = false;
    const hs = Array.from({ length: 8 }, () => T.bayLine({ type: "arrival", id: h.id }));
    const as = a ? Array.from({ length: 4 }, () => T.bayLine({ type: "arrival", id: a.id })) : ["x"];
    return { hs: new Set(hs).size, as: as.every(Boolean), luc: T.lucLine() };
  });
  expect(r.hs).toBe(8);
  expect(r.as).toBe(true);
  expect(typeof r.luc).toBe("string");
});

test("Beim Einzug geht keine Tastatur auf", async ({ page }) => {
  await newGame(page);
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => { T.arrival(); T.showPending(); });
    if (await page.$("#modalRoot #nameOk")) break;
  }
  if (await page.$("#modalRoot #nameOk"))
    expect(await page.evaluate(() => document.activeElement && document.activeElement.tagName)).not.toBe("INPUT");
});
