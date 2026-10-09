// Volle Insel: eine neue Tierart kommt zu Besuch und zählt trotzdem für die Sammlung
const { test, expect, newGame } = require("./helpers");

test("Besuch bei voller Insel zählt für die Tierarten-Sammlung", async ({ page }) => {
  await newGame(page);
  const r = await page.evaluate(() => {
    const S = T.S;
    // Insel mit Menschen auffüllen, bis kein Platz mehr ist
    for (let i = 0; i < 20; i++) S.residents.push({ id: "f" + i, name: "F" + i, kind: "mensch", art: "Mensch", status: "da", ret: 0, born: 0, job: "fischer", trait: "ruhig" });
    S.pending = [];
    const before = S.residents.length;
    T.arrival();
    return { added: S.residents.length - before, seen: S.seenArts.slice(), ev: S.pending[0] };
  });
  expect(r.added).toBe(0);
  expect(r.seen.length).toBe(1);
  expect(r.ev.type).toBe("guest");
  await page.evaluate(() => T.showPending());
  await expect(page.locator("#modalRoot h2")).toContainText("schaut vorbei");
  await page.click("#modalRoot [data-ok]");
  // Im Bewohner-Tab ist die Art jetzt entdeckt
  await page.click("[data-tab=bewohner]");
  await expect(page.locator("text=Tierarten entdeckt").locator("..")).toContainText("2 / 15");
});
