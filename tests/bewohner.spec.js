// Bewohnerliste: Suche, einklappbare Abschnitte, Raster für Menschen und Tiere mit Details
const { test, expect, newGame } = require("./helpers");

test("Viele Bewohner: suchen, einklappen, Mensch und Tier antippen", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => { const S = T.S; S.allFeatures = true;
    for (let i = 0; i < 9; i++) S.residents.push({ id: "t" + i, name: "Tier" + i, kind: "tier", art: i % 2 ? "Hase" : "Ziege", status: "da", ret: 0, born: 0 });
    S.residents.push({ id: "m1", name: "Zora", kind: "mensch", art: "Mensch", status: "da", ret: 0, born: 0, job: "fischer", trait: "ruhig" });
    for (let i = 2; i < 9; i++) S.residents.push({ id: "m" + i, name: "Mensch" + i, kind: "mensch", art: "Mensch", status: "da", ret: 0, born: 0, job: "baecker" });
    S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.render(); });
  await page.click("[data-tab=bewohner]");
  await expect(page.locator("#resSearch")).toBeVisible();
  await expect(page.locator("details[data-fold=t] .ani-grid .ani-tile")).toHaveCount(await page.evaluate(() => T.S.residents.filter(r => r.kind === "tier" && r.status !== "verstorben" && r.status !== "umgezogen").length));
  await expect(page.locator("details[data-fold=m] .ani-grid .ani-tile")).toHaveCount(await page.evaluate(() => T.S.residents.filter(r => r.kind === "mensch" && r.status !== "verstorben").length));
  // Suche nach Name und Beruf
  await page.fill("#resSearch", "zora");
  await expect(page.locator("details[data-fold=m] [data-q]:not([hidden])")).toHaveCount(1);
  await page.fill("#resSearch", "fischer");
  await expect(page.locator("details[data-fold=m] [data-q]:not([hidden])")).toHaveCount(await page.evaluate(() => T.S.residents.filter(r => r.kind === "mensch" && r.status !== "verstorben" && r.job === "fischer").length));
  await page.fill("#resSearch", "zora");
  await expect(page.locator("details[data-fold=t]")).toBeHidden();
  await page.fill("#resSearch", "gibtsnicht");
  await expect(page.locator("#resNone")).toBeVisible();
  await page.fill("#resSearch", "");
  await expect(page.locator("details[data-fold=t]")).toBeVisible();
  // Tiere einklappen, Zustand bleibt nach dem Neuzeichnen
  await page.click("details[data-fold=t] > summary");
  expect(await page.evaluate(() => T.S.bwFold.t)).toBe(true);
  await page.evaluate(() => T.render());
  await expect(page.locator("details[data-fold=t]")).not.toHaveAttribute("open", "");
  await page.click("details[data-fold=t] > summary");
  // Tier antippen öffnet die Details mit Bearbeiten
  await page.locator("details[data-fold=t] .ani-tile").first().click();
  await expect(page.locator("#modalRoot [data-rename]")).toBeVisible();
  await page.click("#modalRoot [data-ok]");
  // Mensch antippen: Details mit Beruf und Bearbeiten
  await page.locator("details[data-fold=m] .ani-tile", { hasText: "Zora" }).click();
  await expect(page.locator("#modalRoot .label")).toHaveText("Fischer:in");
  await expect(page.locator("#modalRoot [data-rename]")).toBeVisible();
});
