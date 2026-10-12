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

test("Sprechblase auf der Insel: aufploppen, durchblättern, einklappen", async ({ page }) => {
  await newGame(page);
  await expect(page.locator("#talk .tk-open")).toContainText("Lucifer");
  const n = await page.evaluate(() => document.querySelectorAll("#talk .tk-n").length ? +document.querySelector("#talk .tk-n").textContent.split("/")[1].trim().split(" ")[0] : 1);
  for (let i = 0; i < n; i++) await page.click("#tkOpen");
  await expect(page.locator("#tkMini")).toBeVisible();
  await page.click("#tkMini");
  await expect(page.locator("#talk .tk-open")).toContainText("Lucifer");
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
