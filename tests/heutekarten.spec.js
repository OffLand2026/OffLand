// Heute: Mission des Tages und zurückgewonnene Zeit, Album: Lucifers Witze
const { test, expect, newGame } = require("./helpers");

async function oneDay(page, min = 120) {
  await newGame(page);
  await page.evaluate(m => {
    document.getElementById("modalRoot").innerHTML = ""; T.S.pending = [];
    T.S.allFeatures = true; T.S.baseline = 240; T.closeDay(m, [], {});
    T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.render();
  }, min);
}

test("Mission des Tages: mitmachen und schaffen bringt Punkte und Glück", async ({ page }) => {
  await oneDay(page);
  await expect(page.locator(".ms")).toBeVisible();
  const before = await page.evaluate(() => ({ p: T.S.points, g: T.S.glueck }));
  await page.click("#msGo");
  await expect(page.locator(".ms.on")).toBeVisible();
  await expect(page.locator(".ms-who")).toContainText("macht mit");
  await page.click("#msDone");
  await expect(page.locator(".ms.done")).toContainText("Mission geschafft");
  const after = await page.evaluate(() => ({ p: T.S.points, g: T.S.glueck, st: T.S.mission.st, feed: T.S.feed[0].text }));
  expect(after.p).toBe(before.p + 20);
  expect(after.g).toBeGreaterThanOrEqual(before.g);
  expect(after.st).toBe("ok");
  expect(after.feed).toContain("Mission geschafft");
  await expect(page.locator("#msDone")).toHaveCount(0);
});

test("Mission: einmal tauschen, ablehnen blendet sie für heute aus, morgen kommt eine neue", async ({ page }) => {
  await oneDay(page);
  const first = await page.evaluate(() => T.S.mission.id);
  await page.click("#msSwap");
  const second = await page.evaluate(() => T.S.mission.id);
  expect(second).not.toBe(first);
  await expect(page.locator("#msSwap")).toBeDisabled();
  await page.click("#msGo"); await page.click("#msNo");
  await expect(page.locator(".ms")).toHaveCount(0);
  await page.evaluate(() => { T.S.mission.day = T.addDays(T.today(), -1); T.render(); });
  await expect(page.locator("#msGo")).toBeVisible();
  expect(await page.evaluate(() => T.S.mission.day === T.today() && T.S.mission.st === "")).toBe(true);
});

test("Mission kommt erst nach dem ersten eingetragenen Tag", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => { T.S.allFeatures = true; T.render(); });
  await expect(page.locator(".ms")).toHaveCount(0);
});

test("Zurückgewonnene Zeit: Summe der Woche gegenüber dem alten Schnitt", async ({ page }) => {
  await oneDay(page, 120);
  await expect(page.locator(".zc-big")).toHaveText("2 h");
  await expect(page.locator(".zc .label")).toContainText("Diese Woche zurückgewonnen");
  expect(await page.locator(".zc-eq > div").count()).toBeGreaterThan(0);
  await page.click("#zcMore");
  expect(await page.evaluate(() => document.querySelector("#tabs button[aria-current=page]").dataset.tab)).toBe("zeit");
});

test("Album: Lucifers Witze sammeln sich und lassen sich nochmal ansehen", async ({ page }) => {
  await oneDay(page);
  const punch = await page.evaluate(() => { T.lucStage().day = null; T.standupSheet(); const p = document.querySelector(".lu-punch").textContent.replace(/\s+/g, " ").trim(); document.querySelector("#luOk").click(); return p; });
  await page.evaluate(() => T.lucJokesSheet());
  await expect(page.locator("#modalRoot .lj")).toHaveCount(1);
  await expect(page.locator("#modalRoot .lj-p")).toHaveText(punch);
  await page.click("#modalRoot .lj");
  await expect(page.locator(".lu-punch")).toHaveText(new RegExp(punch.split(" ")[0]));
  await expect(page.locator(".lu-no")).toHaveText(/Witz Nr\. 1/);
});
