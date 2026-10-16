// Insel-Schutz: in der Web-Version simuliert (Erlaubnis, Apps wählen, Modus, Vorschau mit Zähler und Punkten)
const { test, expect, newGame } = require("./helpers");

test("Insel-Schutz einrichten, Modus wählen, Vorschau und Widerstehen zählt", async ({ page }) => {
  await newGame(page, "Mia");
  await page.evaluate(() => { T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.render(); T.settingsSheet(); });
  await expect(page.locator("#shieldCard")).toBeVisible();
  await page.click("#shAllow");
  await page.click(".st-sim [data-st=ok]");            // Bildschirmzeit erlauben (Simulation)
  await page.click(".st-sim [data-st=ok]");            // Apps wählen: Instagram, TikTok, YouTube vorausgewählt
  await expect(page.locator("#shieldCard")).toContainText("3 Apps gewählt");
  await expect(page.locator('#shieldCard [data-shmode="always"]')).toHaveClass(/on/);
  await page.click('#shieldCard [data-shmode="evening"]');
  await expect(page.locator('#shieldCard [data-shmode="evening"]')).toHaveClass(/on/);
  expect(await page.evaluate(() => T.S.shield.mode)).toBe("evening");
  await page.click('#shieldCard [data-shunlock="15"]');
  expect(await page.evaluate(() => T.S.shield.unlock)).toBe(15);
  // Vorschau: so sieht der Schutz beim Öffnen von Instagram aus
  const pts = await page.evaluate(() => T.S.points);
  await page.click("#shPrev");
  await expect(page.locator(".shield-prev")).toBeVisible();
  await expect(page.locator(".shield-prev")).toContainText("Trotzdem öffnen · 15 Min.");
  await page.click(".shield-prev [data-sh=res]");
  await expect(page.locator(".shield-prev")).toHaveCount(0);
  await expect(page.locator("#shieldCard")).toContainText("1× widerstanden");
  expect(await page.evaluate(() => T.S.points)).toBe(pts + 1);
  // Ausschalten
  await page.click('#shieldCard [data-shmode="off"]');
  expect(await page.evaluate(() => T.S.shield.mode)).toBe("off");
});
