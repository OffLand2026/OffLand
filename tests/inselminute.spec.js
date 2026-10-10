// Inselminute: Bildschirm wird dunkel, nach einer Minute gibt es +1 % Glück (einmal am Tag); Musik ist abschaltbar
const { test, expect, newGame } = require("./helpers");

test("Inselminute läuft eine Minute und gibt einmal am Tag Glück", async ({ page }) => {
  await page.clock.install();
  await newGame(page);
  const before = await page.evaluate(() => T.S.glueck);
  await page.click("#calmBtn");
  await expect(page.locator(".calm h2")).toHaveText("Kurz runterkommen von der ganzen Bildschirmzeit");
  await expect(page.locator(".calm")).toContainText("schließe die Augen");
  await page.clock.runFor(2000);
  if (process.env.SHOTS) await page.screenshot({ path: process.env.SHOTS + "/calm.png" });
  await page.clock.runFor(60000);
  await expect(page.locator(".calm h2")).toHaveText("Schön, dass du da warst");
  expect(await page.evaluate(() => T.S.glueck)).toBe(Math.min(100, before + 1));
  // Angebot für die Musik beim Öffnen
  await page.check("#calmMusic");
  await page.click("#calmOk");
  await page.clock.runFor(1000);
  await expect(page.locator(".calm")).toHaveCount(0);
  expect(await page.evaluate(() => T.S.music)).toBe(true);
  await expect(page.locator(".calm-fy")).toContainText("heute schon geschafft");
  // zweites Mal am selben Tag: kein weiteres Glück, Abbrechen schließt sofort
  await page.click("#calmBtn");
  await page.click("#calmStop");
  await page.clock.runFor(1000);
  await expect(page.locator(".calm")).toHaveCount(0);
  expect(await page.evaluate(() => T.S.glueck)).toBe(Math.min(100, before + 1));
});

test("Musik-Frage kommt nach dem ersten Tag, mit Hörprobe", async ({ page }) => {
  await newGame(page);
  const queued = await page.evaluate(() => { T.closeDay(60, [], {}); return T.S.pending.some(e => e.type === "musicAsk"); });
  expect(queued).toBe(true);
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.S.pending = [{ type: "musicAsk" }]; T.showPending(); });
  await expect(page.locator("#modalRoot h2")).toHaveText("Magst du leise Inselmusik?");
  if (process.env.SHOTS) await page.screenshot({ path: process.env.SHOTS + "/musikfrage.png" });
  await page.click("#muTry");
  await expect(page.locator("#muTry")).toContainText("Anhalten");
  await page.click("#muYes");
  expect(await page.evaluate(() => T.S.music)).toBe(true);
  // kommt danach nicht wieder
  expect(await page.evaluate(() => { T.closeDay(60, [], {}); return T.S.pending.some(e => e.type === "musicAsk"); })).toBe(false);
});
