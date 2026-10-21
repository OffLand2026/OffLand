// Plus-Erlebnisse: Saison-Inseln, Insel-Kurier, Mein Inseljahr (Story) und Live-Insel
const { test, expect, newGame } = require("./helpers");

const ohnePlus = page => page.evaluate(() => { T.S.plus = null; T.S.plusSub = null; T.S.plusSubSim = null; T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.render(); });
// Tage im Testmodus eintragen, ohne Fenster dazwischen
const tage = (page, mins) => page.evaluate(mins => { T.S.testmode = true; T.S.allFeatures = true; mins.forEach(m => T.closeDay(m, [], {})); T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.save(); T.render(); }, mins);

test("Saison-Insel mit Plus: Deko, Saison-Fenster, Saison-Look und Saisonstempel", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("offland-season", "halloween"));
  await newGame(page, "Mia");
  await tage(page, [60, 60]);
  expect(await page.evaluate(() => T.scene().includes("#F28C28"))).toBe(true);           // Kürbisse am Strand
  // Saison-Fenster kommt einmal pro Saison
  await page.evaluate(() => { T.S.seasonSeen = {}; T.seasonCheck(); T.showPending(); });   // beim Eintragen schon vorgemerkt, oben weggeräumt
  await expect(page.locator("#modalRoot h2")).toHaveText("Deine Insel hat sich verwandelt");
  await expect(page.locator("#modalRoot")).toContainText("Saison-Look: Hexenhut");
  await page.click("#modalRoot [data-ok]");
  expect(await page.evaluate(() => { T.seasonCheck(); return T.S.pending.filter(e => e.type === "season").length; })).toBe(0);
  // Hexenhut in der Umkleide, die Weihnachtsmütze erst im Advent
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; const r = T.S.residents.find(x => x.kind === "mensch"); T.nameSheet({ type: "rename", id: r.id }); });
  await page.click('#lookEd [data-pane="extras"]');
  await page.click('#lookEd [data-look="acc"][data-v="11"]');
  await expect(page.locator("#plusPw")).toHaveCount(0);
  await expect(page.locator('#lookEd [data-look="acc"][data-v="12"]')).toHaveCount(0);
  // 5 gute Tage in der Saison: Saisonstempel
  const r = await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; for (let i = 0; i < 3; i++) T.closeDay(60, [], {}); return { st: T.S.seasonStamps, p: T.S.pending.map(e => e.type), y: T.today().slice(0, 4) }; });
  expect(r.st).toEqual(["halloween-" + r.y]);
  expect(r.p).toContain("seasonStamp");
  await page.evaluate(() => { T.S.pending = []; T.seasonStampSheet("halloween"); });
  await expect(page.locator("#modalRoot h2")).toHaveText("5 gute Tage auf der Halloween-Insel");
  // Saison aus: keine Deko mehr, der Hexenhut bleibt gesammelt
  await page.evaluate(() => { localStorage.setItem("offland-season", "aus"); });
  expect(await page.evaluate(() => T.scene().includes("#F28C28"))).toBe(false);
  expect(await page.evaluate(() => T.S.seasonLooks)).toContain(11);
});

test("Saison-Insel ohne Plus: Vorschau, Weg zu Plus und keine Deko", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("offland-season", "advent"));
  await newGame(page, "Mia");
  await ohnePlus(page);
  expect(await page.evaluate(() => T.scene().includes("#2F7A4E"))).toBe(false);           // kein Tannenbaum
  await page.evaluate(() => T.seasonSheet("advent"));
  await expect(page.locator("#modalRoot h2")).toHaveText("Die Weihnachtsinsel ist da");
  expect(await page.locator("#modalRoot .ssn-pic").innerHTML()).toContain("#2F7A4E");     // die Vorschau zeigt die verwandelte Insel
  await page.click("#ssnPlus");
  await expect(page.locator("#plusPw")).toBeVisible();
});

test("Insel-Kurier: Ausgabe mit Schlagzeile aus der Woche, ohne Plus gesperrt", async ({ page }) => {
  await newGame(page, "Mia");
  await tage(page, [60, 90, 300, 45]);
  const names = await page.evaluate(() => { const r = T.S.residents.filter(x => x.kind === "mensch"); T.S.chronicle.push({ day: T.S.lastDay, ids: [r[0].id, r[1].id], text: "Hochzeit: " + r[0].name + " und " + r[1].name + "." }); T.render(); return [r[0].name, r[1].name]; });
  await page.click('[data-tab="zeit"]');
  await page.click("#kuBtn");
  const ku = page.locator("#modalRoot .ku");
  await expect(ku).toContainText("Der Insel-Kurier");
  await expect(ku.locator("h2")).toHaveText("Hochzeit auf OffLand!");
  await expect(ku).toContainText(names[0] + " und " + names[1] + " haben Ja gesagt.");
  await expect(ku).toContainText("Lucifers Ecke");
  await expect(ku.locator(".ku-ads p")).toHaveCount(3);
  // gleiche Woche, gleiche Ausgabe
  const first = await ku.innerText();
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.kurierSheet(T.isoWeek(T.S.lastDay)); });
  expect(await page.locator("#modalRoot .ku").innerText()).toBe(first);
  // ohne Plus: Paywall
  await ohnePlus(page);
  await page.click("#kuBtn");
  await expect(page.locator("#plusPw")).toBeVisible();
  await expect(page.locator("#modalRoot .ku")).toHaveCount(0);
});

test("Mein Inseljahr: Monatsstory mit Plus, ohne Plus nach zwei Seiten gesperrt", async ({ page }) => {
  await newGame(page, "Mia");
  await tage(page, [60, 90, 300, 45, 60, 70, 80, 200, 50]);
  const per = await page.evaluate(() => T.wrapPeriods());
  expect(per.length).toBeGreaterThan(0);
  const m = per.find(p => p.length === 7);
  await page.evaluate(m => T.wrapSheet(m), m);
  const wp = page.locator("#modalRoot .wp");
  await expect(wp.locator(".wp-s:not([hidden])")).toContainText("Dein Monatsrückblick");
  const n = await wp.locator(".wp-s").count();
  expect(n).toBeGreaterThanOrEqual(7);
  await expect(wp.locator(".wp-s").nth(n - 2)).toContainText("Deine Inselpersönlichkeit");
  await page.click(".wp-nav.next");
  await expect(wp.locator(".wp-s:not([hidden])")).toContainText("Zurückgeholt");
  await page.keyboard.press("ArrowRight");
  await expect(wp.locator(".wp-s:not([hidden])")).toContainText("Im Ziel");
  await expect(wp.locator(".wp-s").last().locator("#wpShare")).toHaveCount(1);
  await page.click(".wp-x");
  await expect(page.locator("#modalRoot .wp")).toHaveCount(0);
  // ohne Plus: zwei Seiten, dann der Weg zu Plus
  await ohnePlus(page);
  await page.evaluate(m => T.wrapSheet(m), m);
  await expect(page.locator("#modalRoot .wp-s")).toHaveCount(3);
  await expect(page.locator("#modalRoot #wpShare")).toHaveCount(0);
  await page.evaluate(() => { const s = [...document.querySelectorAll("#modalRoot .wp-s")]; s.forEach((x, i) => x.hidden = i !== 2); });
  await page.click("#wpPlus");
  await expect(page.locator("#plusPw")).toBeVisible();
});

test("Mein Inseljahr: Plus bekommt den Monatsrückblick zum Monatswechsel als Story", async ({ page }) => {
  await newGame(page, "Mia");
  const ok = await page.evaluate(() => {
    T.S.testmode = true; T.S.allFeatures = true;
    // Tage so eintragen, dass ein Monatswechsel dabei ist
    for (let i = 0; i < 45 && !T.S.pending.some(e => e.type === "kapsel"); i++) { T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.closeDay(60, [], {}); }
    const ev = T.S.pending.find(e => e.type === "kapsel"); T.S.pending = ev ? [ev] : []; document.getElementById("modalRoot").innerHTML = ""; return !!ev;
  });
  expect(ok).toBe(true);
  await page.evaluate(() => T.showPending());
  await expect(page.locator("#modalRoot .wp")).toBeVisible();
  await page.click(".wp-x");
  await expect(page.locator("#modalRoot .wp")).toHaveCount(0);
});

test("Live-Insel: startet mit der Bootsfahrt und endet mit ihr (iPhone-App)", async ({ page }) => {
  await page.addInitScript(() => {
    window.__live = [];
    const live = { start: o => { window.__live.push(["start", o]); return Promise.resolve({ started: true }); }, end: o => { window.__live.push(["end", o]); return Promise.resolve(); } };
    window.Capacitor = { isNativePlatform: () => true, getPlatform: () => "ios", registerPlugin: n => n === "LiveIsland" ? live : null };
  });
  await newGame(page, "Mia");
  await page.evaluate(() => { T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.startBoat(25, "lernen", "Mathe"); });
  const st = await page.evaluate(() => window.__live[0]);
  expect(st[0]).toBe("start");
  expect(st[1].task).toBe("Mathe");
  expect(st[1].end - st[1].start).toBe(25 * 60000);
  expect(st[1].watch).toBe("Lucifer passt auf");
  await page.evaluate(() => T.finishBoat());
  expect(await page.evaluate(() => window.__live[1])).toEqual(["end", { done: true }]);
  // in der Plus-Karte abschaltbar
  await page.evaluate(() => { T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.settingsSheet(); });
  await page.uncheck("#liveTgl");
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; window.__live = []; T.startBoat(25, "lernen", ""); });
  expect(await page.evaluate(() => window.__live.filter(x => x[0] === "start").length)).toBe(0);
  // ohne Plus keine Live-Insel
  await page.evaluate(() => { T.finishBoat(); T.S.liveIsland = true; T.S.plus = null; T.S.plusSub = null; T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; window.__live = []; T.startBoat(25, "lernen", ""); });
  expect(await page.evaluate(() => window.__live.filter(x => x[0] === "start").length)).toBe(0);
});

test("Live-Insel: Vorschau im Browser", async ({ page }) => {
  await newGame(page, "Mia");
  await page.evaluate(() => { T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.settingsSheet(); });
  await page.click("#livePrev");
  await expect(page.locator("#modalRoot h2")).toHaveText("Deine Bootsfahrt auf dem Sperrbildschirm");
  await expect(page.locator("#modalRoot .li-card")).toContainText("Lucifer passt auf");
});

test("Plus-Erlebnisse stehen auf der Paywall und in der Plus-Woche", async ({ page }) => {
  await newGame(page, "Mia");
  await ohnePlus(page);
  await page.evaluate(() => T.plusPaywall("test"));
  const pw = page.locator("#plusPw");
  for (const t of ["Saison-Inseln", "Mein Inseljahr", "Live-Insel", "Der Insel-Kurier"]) await expect(pw.locator(".pw-feats")).toContainText(t);
  await expect(pw.locator(".pw-cmp")).toContainText("Mein Inseljahr als Story");
});
