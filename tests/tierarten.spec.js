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

test("Besuch darf bleiben, dafür zieht ein anderes Tier um", async ({ page }) => {
  await newGame(page);
  const art = await page.evaluate(() => {
    const S = T.S;
    for (let i = 0; i < 20; i++) S.residents.push({ id: "f" + i, name: "F" + i, kind: "mensch", art: "Mensch", status: "da", ret: 0, born: 0, job: "fischer", trait: "ruhig" });
    S.pending = []; T.arrival(); const a = S.pending[0].art; T.showPending(); return a;
  });
  await expect(page.locator("#modalRoot [data-swap]").first()).toBeVisible();
  const oldId = await page.getAttribute("#modalRoot [data-swap]", "data-swap");
  await page.click("#modalRoot [data-swap]");
  // erst Rückfrage: Zurück führt wieder zur Auswahl
  await expect(page.locator("#modalRoot")).toContainText("Wirklich tauschen?");
  await page.click("#swapNo");
  await expect(page.locator("#modalRoot [data-swap]").first()).toBeVisible();
  await page.click("#modalRoot [data-swap]");
  await page.click("#swapYes");
  await expect(page.locator("#modalRoot #nameOk")).toBeVisible();
  const r = await page.evaluate(([art, oldId]) => ({
    old: T.S.residents.find(x => x.id === oldId).status,
    neu: T.S.residents.filter(x => x.art === art && x.status === "da").length
  }), [art, oldId]);
  expect(r.old).toBe("umgezogen");
  expect(r.neu).toBe(1);
});

test("Fanpost wiederholt sich nicht ständig", async ({ page }) => {
  await newGame(page);
  const texts = [];
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => { T.S.pending = [{ type: "fanpost" }]; T.showPending(); });
    texts.push(await page.evaluate(() => T.S.postcards[T.S.postcards.length - 1].text));
    await page.click("#modalRoot [data-ok]");
  }
  expect(new Set(texts).size).toBe(8);
  expect(texts.filter(t => t.includes("warm ums Herz")).length).toBeLessThanOrEqual(1);
});
