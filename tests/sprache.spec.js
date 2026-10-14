// Sprache: auf englischen Geräten erscheint die App auf Englisch, in den Einstellungen lässt sich umschalten
const { test, expect, newGame } = require("./helpers");
test.use({ locale: "en-US" });

test("Englisch: Oberfläche übersetzt, Umschalten auf Deutsch", async ({ page }) => {
  await newGame(page, "Mia");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('[data-tab="heute"]')).toContainText("Today");
  await expect(page.locator('[data-tab="bewohner"]')).toContainText("Islanders");
  // Nichts Sichtbares mehr wörtlich aus dem deutschen Wörterbuch (Namen ausgenommen)
  const left = await page.evaluate(() => { const D = window.OFFLAND_EN, o = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const s = n.nodeValue.trim(); if (s && D[s] && !n.parentElement.closest("[data-noi18n]") && n.parentElement.offsetParent !== null) o.push(s); } return o; });
  expect(left).toEqual([]);
  // Daten bleiben deutsch, nur die Anzeige ist übersetzt
  expect(await page.evaluate(() => T.S.residents.some(r => r.kind === "tier" && /^[A-ZÄÖÜ]/.test(r.art)))).toBe(true);
  // Umschalten
  await page.evaluate(() => { localStorage.setItem("offland-lang", "de"); });
  await page.reload(); const l = await page.$("[data-login]"); if (l) await l.click();
  await expect(page.locator('[data-tab="heute"]')).toContainText("Heute");
  await page.evaluate(() => localStorage.removeItem("offland-lang"));
});
