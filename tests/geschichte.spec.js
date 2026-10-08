// Intro, Kapitel und Mr. Bays Album
const { test, expect, dismiss, newGame } = require("./helpers");

test("Intro lässt sich durchblättern", async ({ page }) => {
  await page.goto("/");
  await page.click("#newAcc"); await page.fill("#accName", "Story"); await page.click("#accCreate");
  await expect(page.locator("#modalRoot .says.bay").first()).toBeVisible();
  for (let i = 0; i < 12; i++) {
    const t = await page.textContent("#storyNext");
    await page.click("#storyNext"); await page.waitForTimeout(450);
    if (/Los geht|Bin dabei/.test(t)) break;
  }
  expect(await page.evaluate(() => T.S.storySeen)).toBe(true);
});

test("Kapitel 1 wird geschafft und landet im Album", async ({ page }) => {
  await newGame(page);
  expect(await page.evaluate(() => T.CHAPTERS.length)).toBe(19);
  expect(await page.evaluate(() => T.S.chapter)).toBe(0);
  await page.evaluate(() => { T.S.freed = 1; T.S.residents.forEach(r => r.phone = false); T.chapterCheck(); T.showPending(); });
  await expect(page.locator("#modalRoot")).toContainText("Kapitel 1 geschafft");
  await expect(page.locator("#modalRoot .says.luc")).toHaveCount(1);
  await dismiss(page);
  expect(await page.evaluate(() => T.S.chapter)).toBeGreaterThanOrEqual(1);
  await page.evaluate(() => { T.S.allFeatures = true; T.render(); });
  await page.click("[data-tab=verlauf]");
  await page.click("#bayAlbum");
  await expect(page.locator("#modalRoot #wr .wr-s").first()).toContainText("Das stille Dorf");
});

test("Weltkapitel: Spieler auf der Fjordwelt landen im richtigen Kapitel", async ({ page }) => {
  await newGame(page);
  const ch = await page.evaluate(() => {
    const S = T.S; S.allFeatures = true; S.residents.forEach(r => r.phone = false); S.fests = 1; S.freed = 1;
    S.built = ["leuchtturm","bruecke","schiff","windmuehle","insel3","baumhaus","floss","festzelt","strandhaus","beachclub","t_bambus","t_haengebruecke","t_riff","t_wasserfall","t_vulkan","t_mango","f_stugor"];
    S.world = 2; for (let i = 0; i < 3; i++) S.residents.push({ id: "h" + i, name: "H" + i, kind: "mensch", status: "da", born: 0, job: "koch", trait: "gesellig" });
    T.chapterCheck(true); T.render(); return S.chapter;
  });
  expect(ch).toBe(11);
  for (const n of [7, 10, 18]) {
    await page.evaluate(n => T.chapterSheet(n, true), n);
    await expect(page.locator("#modalRoot figcaption").first()).toHaveText("Reisefoto");
    await page.click("#modalRoot [data-ok]");
  }
});
