// Tab Freunde: Regatta, Inselpost, Anfeuern (mit simuliertem Online-Speicher)
const { test, expect, newGame, dismiss } = require("./helpers");

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const st = {}; window.ST = st;
    const d = new Date(), t = new Date(d); t.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const y = t.getFullYear(), w1 = new Date(y, 0, 4);
    const wk = y + "-W" + String(1 + Math.round(((t - w1) / 864e5 - 3 + (w1.getDay() + 6) % 7) / 7)).padStart(2, "0");
    const p2 = n => String(n).padStart(2, "0"), td = d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate());
    [["LENA00000000001", "Lena", "Katze", 90, { k: "serie", n: 7, d: td }], ["BEN000000000001", "Ben", "Hund", 400, null]].forEach(([id, n, a, avg, ev]) => {
      st["players/ME0000000000001/friends/" + id] = { since: 1 };
      st["players/" + id] = { name: n, avatar: a };
      st["weeks/" + wk + "/ranks/" + id] = { name: n, avatar: a, avg, days: 3, good: 2, streak: 4, world: "Heimatinseln", ev: ev ? [ev] : [], ch: [] };
    });
    window.OFFLAND_FAKE_NET = { uid: "fake", get: async k => st[k] ? JSON.parse(JSON.stringify(st[k])) : null,
      set: async (k, v) => { st[k] = Object.assign(st[k] || {}, JSON.parse(JSON.stringify(v))); }, del: async k => { delete st[k]; },
      list: async pre => Object.keys(st).filter(k => k.startsWith(pre + "/") && !k.slice(pre.length + 1).includes("/")).map(k => Object.assign({ id: k.slice(pre.length + 1) }, st[k])),
      count: async () => 0, inc: async () => {} };
  });
});

test("Regatta zeigt alle, Inselpost zeigt Meilensteine, Anfeuern wird gespeichert", async ({ page }) => {
  await newGame(page, "Mia");
  await page.evaluate(() => { T.S.online = { on: true, pub: false, pid: "ME0000000000001" }; T.S.allFeatures = true; T.S.budgetStreak = 5; document.getElementById("modalRoot").innerHTML = ""; T.render(); });
  await page.click("#tabs [data-tab=freunde]");
  await expect(page.locator("#frStories .fr-st")).toHaveCount(4);          // Du, Lena, Ben, Einladen
  await expect(page.locator("#frHero")).toContainText("Lena");
  await expect(page.locator("#postBox")).toContainText("Lena hat 7 Tage Serie geschafft");
  await page.click('#postBox [data-e="👏"]');
  await expect.poll(() => page.evaluate(() => { const k = Object.keys(window.ST).find(k => k.includes("/ranks/ME")); return k && JSON.stringify(window.ST[k].ch); })).toContain("serie7");
  expect(await page.evaluate(() => { const k = Object.keys(window.ST).find(k => k.includes("/ranks/ME")); return window.ST[k].ev[0].k; })).toBe("serie");
  await page.click('#frStories [data-story="LENA00000000001"]');
  await expect(page.locator("#modalRoot")).toContainText("Lena");
});
