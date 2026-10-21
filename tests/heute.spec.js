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

test("Link zum automatischen Messen verschwindet nach dem Ablehnen", async ({ page }) => {
  await newGame(page, "Mia");
  await page.evaluate(() => { T.S.testmode = true; T.render(); });
  await page.click("#stEntry");
  await page.click(".st-sim [data-st=no]");
  await expect(page.locator("#stEntry")).toHaveCount(0);
  await expect(page.locator("#closeBtn")).toBeVisible();
  expect(await page.evaluate(() => !!T.S.autoTime)).toBe(false);
});

test("Start: bisherigen Schnitt automatisch messen, nach 7 Tagen übernommen", async ({ page }) => {
  await page.goto("/");
  await page.click("#newAcc"); await page.fill("#accName", "Mia"); await page.click("#accCreate"); await page.click("#storySkip");
  await page.click('[data-basemode="auto"]');
  await expect(page.locator("label[for=setBase]")).toContainText("Vorläufige Schätzung");
  await page.click("#startBtn");
  await page.click(".st-sim [data-st=ok]");   // Erlaubnis
  await page.click(".st-sim [data-st=ok]");   // Apps
  await dismiss(page);
  expect(await page.evaluate(() => [T.S.autoTime, !!T.S.baseMeasure, T.S.setup])).toEqual([true, true, true]);
  await page.evaluate(() => { T.S.testmode = true; });
  await page.evaluate(() => { T.S.budget = 240; T.S.music = false; });   // Musik-Frage würde sich sonst dazwischenschieben
  for (const m of [120, 150, 180, 180, 120, 150, 150]) {
    await page.evaluate(m => T.closeDay(m, [], {}), m);
    for (let i = 0; i < 30; i++) {   // Fenster wegklicken, bis die Messung erscheint (auch zufällige Ereignisse mit anderen Knöpfen)
      if (await page.locator("#modalRoot", { hasText: "Dein Schnitt" }).count()) break;
      const ok = await page.$("#modalRoot [data-ok], #modalRoot #nameOk, #modalRoot [data-c=egal], #modalRoot #boatYes, #modalRoot .sheet .btn");
      if (!ok) break; await ok.click(); await page.waitForTimeout(60);
    }
  }
  await expect(page.locator("#modalRoot")).toContainText("Dein Schnitt: 2 h 30 min");
  expect(await page.evaluate(() => T.S.baseline)).toBe(150);
});
