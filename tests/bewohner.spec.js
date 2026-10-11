// Bewohnerliste: Suche, einklappbare Abschnitte, Tier-Raster mit Details
const { test, expect, newGame } = require("./helpers");

test("Viele Bewohner: suchen, einklappen, Tier antippen", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => { const S = T.S; S.allFeatures = true;
    for (let i = 0; i < 9; i++) S.residents.push({ id: "t" + i, name: "Tier" + i, kind: "tier", art: i % 2 ? "Hase" : "Ziege", status: "da", ret: 0, born: 0 });
    S.residents.push({ id: "m1", name: "Zora", kind: "mensch", art: "Mensch", status: "da", ret: 0, born: 0, job: "fischer", trait: "ruhig" });
    S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.render(); });
  await page.click("[data-tab=bewohner]");
  await expect(page.locator("#resSearch")).toBeVisible();
  await expect(page.locator(".ani-grid .ani-tile")).toHaveCount(await page.evaluate(() => T.S.residents.filter(r => r.kind === "tier" && r.status !== "verstorben" && r.status !== "umgezogen").length));
  // Suche nach Name
  await page.fill("#resSearch", "zora");
  await expect(page.locator("details[data-fold=m] .res:not([hidden])")).toHaveCount(1);
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
  await page.locator(".ani-tile").first().click();
  await expect(page.locator("#modalRoot [data-rename]")).toBeVisible();
});
