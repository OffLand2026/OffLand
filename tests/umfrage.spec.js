// Testphase-Umfragen: kommen nach Tag 2, 7 und 21 und landen als Support-Meldung
const { test, expect, dismiss } = require("./helpers");

async function start(page) {
  await page.addInitScript(() => {
    window.SETS = [];
    window.OFFLAND_FAKE_NET = { uid: "fake", get: async () => null, set: async (p, v) => { window.SETS.push([p, v]); }, del: async () => {},
      list: async () => [], count: async () => 0, inc: async () => {} };
    localStorage.setItem("offland-stats", JSON.stringify({ consent: false }));
  });
  await page.goto("/");
  await page.click("#newAcc"); await page.fill("#accName", "Uma"); await page.click("#accCreate");
  await page.click("#storySkip"); await page.click("#startBtn"); await dismiss(page);
}
const ask = (page, n) => page.evaluate(n => {
  document.getElementById("modalRoot").innerHTML = ""; T.S.pending = []; T.S.dayCount = n; T.umfrageCheck(); T.showPending();
  return T.S.pending.length;
}, n);

test("Start-Umfrage: Antworten werden mit Text und Werten gesendet", async ({ page }) => {
  await start(page);
  await ask(page, 2);
  await expect(page.locator("#modalRoot h2")).toHaveText("Kurze Frage zum Start");
  await page.click("#ufSend");
  await expect(page.locator("#ufErr")).toContainText("mindestens eine Frage");
  await page.click("text=2 bis 4 Std.");
  await page.fill("#uf_lieber", "Mehr lesen");
  await page.click("#ufSend");
  await expect(page.locator("#modalRoot h2")).toHaveText("Antworten sind angekommen");
  const [path, doc] = await page.evaluate(() => window.SETS.find(s => s[0].startsWith("support/")));
  expect(path).toMatch(/^support\//);
  expect(doc.cat).toBe("sonst");
  expect(doc.status).toBe("neu");
  expect(doc.info.umfrage).toBe("start");
  expect(doc.info.antworten).toEqual({ hz: "2_4", lieber: "Mehr lesen" });
  expect(doc.text).toContain("→ 2 bis 4 Std.");
  expect(await page.evaluate(() => T.S.umfrage.start)).toBe("ja");
  // gleiche Umfrage kommt nicht noch einmal
  expect(await ask(page, 3)).toBe(0);
});

test("Später fragt am nächsten Tag wieder, Nein danke nie wieder", async ({ page }) => {
  await start(page);
  await ask(page, 7);
  await expect(page.locator("#modalRoot h2")).toHaveText("Eine Woche OffLand");
  await page.click("#ufLater");
  expect(await ask(page, 7)).toBe(0);
  await page.evaluate(() => { T.S.umfrage.later = "2000-01-01"; });
  await ask(page, 8);
  await page.click("#ufNo");
  expect(await page.evaluate(() => T.S.umfrage)).toMatchObject({ start: "verpasst", t7: "nein" });
  expect(await ask(page, 12)).toBe(0);
  await ask(page, 21);
  await expect(page.locator("#modalRoot h2")).toHaveText("Drei Wochen OffLand");
  await page.click("text=Seltene Tiere"); await page.click("text=Fanpost"); await page.click("label:has-text('Sehr')");
  await page.click("#ufSend");
  await expect(page.locator("#modalRoot h2")).toHaveText("Antworten sind angekommen");
  const doc = await page.evaluate(() => window.SETS.find(s => s[0].startsWith("support/"))[1]);
  expect(doc.info.antworten).toEqual({ weg: "sehr", motiv: ["tiere", "fanpost"] });
});
