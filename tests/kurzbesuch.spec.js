// Kurz rein, kurz raus: Kurzbesuche bringen Punkte (bis 3 Minuten, höchstens 5 am Tag), nach 5 Minuten fragt Lucifer
const { test, expect, newGame } = require("./helpers");

test("Kurzbesuch: bis 3 Minuten +2 Punkte, höchstens 5 am Tag, Mr. Bay sagt es beim nächsten Öffnen", async ({ page }) => {
  await newGame(page, "Mia");
  const r = await page.evaluate(() => {
    T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.S.testmode = false;
    const p0 = T.S.points, real = Date.now;
    for (let i = 0; i < 7; i++) { T.visitStart(); Date.now = () => real() + 60000; T.visitEnd(); Date.now = real; }   // 7 Besuche à 1 Minute
    T.visitStart(); Date.now = () => real() + 4 * 60000; T.visitEnd(); Date.now = real;                                  // 4 Minuten: kein Kurzbesuch
    return { pts: T.S.points - p0, n: T.S.kurz.n, neu: T.S.kurzNew };
  });
  expect(r).toEqual({ pts: 10, n: 5, neu: { n: 5, pts: 10 } });
  await page.evaluate(() => T.visitStart());
  await expect(page.locator("#kurzCard")).toContainText("Kurzbesuch · +10 Punkte");
  await expect(page.locator("#kurzCard")).toContainText("Zuletzt warst du 5× nur kurz da.");
  await page.click("#kbOk");
  await expect(page.locator("#kurzCard")).toHaveCount(0);
});

test("Nach 5 Minuten fragt Lucifer, ob du nicht gehen willst", async ({ page }) => {
  await newGame(page, "Mia");
  await page.evaluate(() => { T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.lucAsk(); });
  await expect(page.locator("#lucGo")).toContainText("Du bist jetzt fünf Minuten hier.");
  await page.click("#lucMore");
  await expect(page.locator("#lucGo")).toHaveCount(0);
  await page.evaluate(() => T.lucAsk());
  await expect(page.locator("#lucGo")).toContainText("Die Minute ist um.");
  await page.click("#lucOk");
  await expect(page.locator("#lucGo")).toHaveCount(0);
});

test("Entwickler-Vorschau zeigt die Morgen-Zusammenfassung mit Beispielwerten", async ({ page }) => {
  await newGame(page, "Mia");
  await page.evaluate(() => { T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.settingsSheet(); });
  const pts = await page.evaluate(() => T.S.points);
  await page.click("#devMorn");
  await expect(page.locator("#modalRoot")).toContainText("Über Nacht auf deiner Insel");
  await expect(page.locator("#modalRoot")).toContainText("Auch eingetragen:");
  await expect(page.locator("#msOk")).toHaveText("Danke für die schnelle Übersicht");
  await page.click("#msOk");
  expect(await page.evaluate(() => T.S.points)).toBe(pts);   // nur Vorschau
});

test("App-Monster sind ausgeschaltet: kein Eintragen pro App, keine Limits, alte Monster verschwinden", async ({ page }) => {
  await newGame(page, "Mia");
  await page.evaluate(() => { T.S.allFeatures = true; T.S.testmode = true; T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.render(); });
  if (await page.locator("#goalGo").count()) await page.click("#goalGo");
  await expect(page.locator("text=oder pro App eintragen")).toHaveCount(0);
  await page.evaluate(() => T.settingsSheet());
  await expect(page.locator("#modalRoot")).not.toContainText("App-Limits für die Monster");
  // Ein alter Spielstand mit Monstern: nach dem nächsten Anmelden sind sie weg
  await page.evaluate(() => { T.S.monsters = [T.S.apps[0].id]; T.save(); });
  await page.reload();   // gleiche Sitzung: meldet automatisch wieder an
  await expect.poll(() => page.evaluate(() => (window.T && T.S.monsters || ["?"]).length)).toBe(0);
});

test("Konto löschen: Hinweis, dass ein Plus-Abo über Apple weiterläuft", async ({ page }) => {
  await newGame(page, "Mia");
  await page.evaluate(() => { T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.save(); });
  await page.click("#accBtn"); await page.click("#accDel");
  await expect(page.locator("#delSub")).toHaveCount(0);                 // ohne Abo kein Hinweis
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.S.plusSub = { until: T.addDays(T.today(), 300), trial: false }; T.save(); });
  await page.click("#accBtn"); await page.click("#accDel");
  await expect(page.locator(".del-sub")).toContainText("Das Löschen kündigt es nicht.");
  await expect(page.locator("#delSub")).toHaveText("Abo bei Apple verwalten");
});
