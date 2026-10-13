// Heute im neuen Stil: Kacheln, Sprechblase auf der Insel, Eintragen mit Schieberegler
const { test, expect, dismiss, newGame } = require("./helpers");

test("Hauptkarte öffnet das Eintragen und schließt den Tag ab", async ({ page }) => {
  await newGame(page, "Mia");
  await expect(page.locator("#title")).toHaveText("Hallo Mia");
  await expect(page.locator(".scene-chips .cp")).toHaveCount(3);
  if (await page.$("#goalGo")) await page.click("#goalGo");
  await page.fill("#inH", "1"); await page.fill("#inM", "0");
  await page.click("#closeBtn");
  await dismiss(page);
  expect(await page.evaluate(() => T.S.days.length)).toBe(1);
  await expect(page.locator(".hmain .hm-title")).toContainText("unter dem Ziel");
});

test("Schieberegler und Zahlenfelder bleiben gleich", async ({ page }) => {
  await newGame(page);
  if (await page.$("#goalGo")) await page.click("#goalGo");
  await page.locator("#inR").evaluate(el => { el.value = 125; el.dispatchEvent(new Event("input", { bubbles: true })); });
  await expect(page.locator("#inH")).toHaveValue("2");
  await expect(page.locator("#inM")).toHaveValue("05");
  await page.fill("#inH", "5"); await page.fill("#inM", "0");
  await expect(page.locator("#liveTxt")).toContainText("über dem Ziel");
});

test("Bildschirmzeit automatisch (Simulation) füllt das Eintragen vor", async ({ page }) => {
  await newGame(page, "Mia");
  await page.evaluate(() => { T.S.testmode = true; T.render(); });
  await page.click("#stEntry");
  await page.click(".st-sim [data-st=ok]");   // Erlaubnis
  await page.click(".st-sim [data-st=ok]");   // Apps
  await expect(page.locator("#stNote")).toContainText("Automatisch gemessen (Simulation)");
  await expect(page.locator("#stEntry")).toHaveCount(0);
  const v = await page.evaluate(() => (+document.getElementById("inH").value) * 60 + (+document.getElementById("inM").value));
  expect(v % 15).toBe(0);
  expect(await page.evaluate(() => T.S.autoTime && T.S.stSim.monitoring)).toBe(true);
});
