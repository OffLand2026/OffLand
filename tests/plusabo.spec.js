// OffLand Plus: Paywall, Abo (im Test simuliert wie auf dem iPhone), Plus-Looks, Goldene Lagune, eigene Zeitpläne
const { test, expect, newGame } = require("./helpers");

const ohnePlus = page => page.evaluate(() => { T.S.plus = null; T.S.plusSub = null; T.S.plusSubSim = null; T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.render(); });

test("Paywall: Pläne, Probezeit, Schließen und Kauf mit Probezeit", async ({ page }) => {
  await newGame(page, "Mia");
  await ohnePlus(page);
  await page.evaluate(() => T.settingsSheet());
  await expect(page.locator("#plusCard")).toContainText("Plus ansehen");
  await page.click("#plusMore");
  const pw = page.locator("#plusPw");
  await expect(pw).toBeVisible();
  await expect(pw.locator('[data-pwplan="year"]')).toHaveAttribute("aria-checked", "true");
  await expect(pw.locator("#pwBuy")).toHaveText("7 Tage gratis testen");
  await expect(pw.locator("#pwFine")).toContainText("29,99 € pro Jahr");
  await expect(pw.locator("#pwTl")).toContainText("Tag 5");
  await expect(pw.locator('[data-pwplan="year"] .pw-tag')).toContainText("4 MONATE GRATIS");
  await expect(pw.locator('a[href*="datenschutz"]')).toBeVisible();
  // Monatlich: keine Probezeit, Preis steht im Knopf
  await pw.locator('[data-pwplan="month"]').click();
  await expect(pw.locator("#pwBuy")).toHaveText("Plus holen · 3,99 € pro Monat");
  await expect(pw.locator("#pwTl")).toBeHidden();
  // Schließen
  await page.click("#pwClose");
  await expect(pw).toHaveCount(0);
  expect(await page.evaluate(() => T.plusActive())).toBe(false);
  // Kaufen: Jahresabo mit 7 Tagen Probezeit (ohne offenes Fenster kommt das Willkommen)
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.plusPaywall("test"); });
  await page.click("#pwBuy");
  await expect(page.locator("#modalRoot h2")).toHaveText("Lucifer trägt jetzt Krone.");
  const sub = await page.evaluate(() => T.S.plusSub);
  expect(sub.trial).toBe(true);
  expect(sub.id).toBe("offland.plus.jahr");
  expect(await page.evaluate(() => T.plusActive())).toBe(true);
  // Zweites Mal gibt es keine Probezeit mehr
  await page.evaluate(() => { T.S.plusSub = null; T.S.plusSubSim = null; document.getElementById("modalRoot").innerHTML = ""; T.plusPaywall("test"); });
  await expect(page.locator("#pwBuy")).toHaveText(/Plus holen/);
});

test("Plus-Looks und Goldene Lagune sind ohne Plus gesperrt, mit Plus nutzbar", async ({ page }) => {
  await newGame(page, "Mia");
  await ohnePlus(page);
  const id = await page.evaluate(() => { const r = T.S.residents.find(x => x.kind === "mensch"); T.nameSheet({ type: "rename", id: r.id }); return r.id; });
  await page.click('#lookEd [data-pane="extras"]');
  await expect(page.locator('#lookEd [data-look="acc"][data-v="8"] .uk-star')).toBeVisible();
  await page.click('#lookEd [data-look="acc"][data-v="8"]');
  await expect(page.locator("#plusPw")).toBeVisible();
  await page.click("#pwClose");
  // mit Plus: Krone lässt sich aufsetzen
  await page.evaluate(() => { T.S.plus = { until: T.addDays(T.today(), 3) }; });
  await page.click('#lookEd [data-look="acc"][data-v="8"]');
  await expect(page.locator("#plusPw")).toHaveCount(0);
  await page.click("#nameOk");
  expect(await page.evaluate(id => T.S.residents.find(x => x.id === id).look.acc, id)).toContain(8);
  // Tier: goldenes Fell
  const tid = await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; const r = T.S.residents.find(x => x.kind === "tier"); T.nameSheet({ type: "rename", id: r.id }); return r.id; });
  await page.click('#lookEd [data-pane="fell"]');
  await page.click('#lookEd [data-look="fur"][data-v="99"]');
  await page.click("#nameOk");
  expect(await page.evaluate(id => T.S.residents.find(x => x.id === id).fur, tid)).toBe(99);
  // Goldene Lagune in den Einstellungen
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.settingsSheet(); });
  await page.click('#plusCard [data-isle="lagune"]');
  expect(await page.evaluate(() => T.S.isleStyle)).toBe("lagune");
  expect(await page.evaluate(() => T.scene())).toContain("#FF8FB1");   // Flamingos
  // Plus läuft aus: Lagune schaltet zurück, die Krone bleibt
  await page.evaluate(() => { T.S.plus = { until: T.addDays(T.today(), -1) }; T.save(); });
  await page.reload(); const l = await page.$("[data-login]"); if (l) await l.click();
  await page.waitForFunction(() => window.T && T.S && T.S.setup);
  await expect.poll(() => page.evaluate(() => T.S.isleStyle)).toBe(null);
  expect(await page.evaluate(id => T.S.residents.find(x => x.id === id).look.acc, id)).toContain(8);
});

test("Insel-Schutz Pro: eigene Zeitpläne nur mit Plus", async ({ page }) => {
  await newGame(page, "Mia");
  await ohnePlus(page);
  await page.evaluate(() => T.settingsSheet());
  await page.click("#shAllow");
  await page.click(".st-sim [data-st=ok]");
  await page.click(".st-sim [data-st=ok]");
  await page.click('#shieldCard [data-shmode="plan"]');
  await expect(page.locator("#plusPw")).toBeVisible();
  await page.click("#pwBuy");                                    // Probezeit starten (Simulation)
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.settingsSheet(); });
  await page.click('#shieldCard [data-shmode="plan"]');
  await expect(page.locator("#shieldCard .sh-win")).toHaveCount(2);
  expect(await page.evaluate(() => T.S.shield.wins)).toEqual([[360, 540], [1260, 1440]]);
  await page.click('#shieldCard [data-shadd="1"]');              // + Arbeit 09:00–17:00
  await expect(page.locator("#shieldCard .sh-win")).toHaveCount(3);
  await page.selectOption('#shieldCard [data-shw="0"][data-k="1"]', "600");
  expect(await page.evaluate(() => T.S.shield.wins[0])).toEqual([360, 600]);
  await page.click('#shieldCard [data-shdel="2"]');
  expect(await page.evaluate(() => T.S.shield.wins.length)).toBe(2);
});

test("Weltreise und Zeit-Statistik gehören zu Plus", async ({ page }) => {
  await newGame(page, "Mia");
  await ohnePlus(page);
  // Neue Insel entdeckt: Aufbrechen führt zur Paywall
  await page.evaluate(() => { T.S.found = 1; T.S.pending = [{ type: "discovery", world: 1 }]; T.showPending(); });
  await expect(page.locator("#modalRoot")).toContainText("Die Weltreise gehört zu OffLand Plus");
  await page.click("#discGo");
  await expect(page.locator("#plusPw")).toBeVisible();
  await page.click("#pwClose");
  expect(await page.evaluate(() => T.S.world || 0)).toBe(0);
  // Zeit-Tab: Inseljahr nur als Vorschau
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.S.allFeatures = true; T.render(); });
  await page.click('[data-tab="zeit"]');
  await expect(page.locator(".plus-lock")).toBeVisible();
  await expect(page.locator("#view")).not.toContainText("Hochgerechnet aufs Jahr");
  await page.click('.plus-lock [data-pluspw="zeit"]');
  await expect(page.locator("#plusPw")).toBeVisible();
  await page.click("#pwBuy");                                    // Probezeit (Simulation)
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.render(); });
  await expect(page.locator(".plus-lock")).toHaveCount(0);
  await expect(page.locator("#view")).toContainText("Hochgerechnet aufs Jahr");
  // mit Plus geht die Reise los
  await page.evaluate(() => { T.S.pending = [{ type: "discovery", world: 1 }]; T.showPending(); });
  await page.click("#discGo");
  await expect.poll(() => page.evaluate(() => T.S.world)).toBe(1);
});

test("Ende der geschenkten Plus-Woche: einmal Bescheid, dann Paywall", async ({ page }) => {
  await newGame(page, "Mia");
  await page.evaluate(() => { T.S.plusTrial = T.addDays(T.today(), -8); T.S.plus = { until: T.addDays(T.today(), -1) }; T.S.plusSub = null; T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.save(); });
  await page.reload(); const l = await page.$("[data-login]"); if (l) await l.click();
  await expect(page.locator("#modalRoot h2")).toHaveText("Deine Plus-Woche ist vorbei");
  await page.click("#peMore");
  await expect(page.locator("#plusPw")).toBeVisible();
  expect(await page.evaluate(() => !!T.S.plusEndSeen)).toBe(true);
});

test.describe("Englisch", () => {
  test.use({ locale: "en-US" });
  test("Paywall und Plus-Karte sind übersetzt", async ({ page }) => {
    await newGame(page, "Mia");
    await page.evaluate(() => { T.S.plus = null; T.S.plusSub = null; T.S.pending = []; document.getElementById("modalRoot").innerHTML = "";
      const t = T.today(); for (let i = 0; i < 6; i++) T.S.days.push({ day: T.addDays(t, -6 + i), min: 120 }); T.S.baseline = 300; T.render(); T.plusPaywall("test"); });
    const pw = page.locator("#plusPw");
    await expect(pw.locator("#pwBuy")).toHaveText("Try 7 days free");
    await expect(pw.locator("#pwFine")).toContainText("Today €0. Then");
    await expect(pw).toContainText("won back in just 6 days");
    await expect(pw).toContainText("How your free trial works");
    const left = await page.evaluate(() => { const D = window.OFFLAND_EN, o = []; const w = document.createTreeWalker(document.getElementById("plusPw"), NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) { const s = n.nodeValue.trim(); if (s && (D[s] || /[äöüß]|\b(und|der|die|das|Tage|pro|Jahr|Monat|gratis)\b/.test(s))) o.push(s); } return o; });
    expect(left).toEqual([]);
    await page.click("#pwBuy");
    await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.settingsSheet(); });
    await expect(page.locator("#plusCard")).toContainText("Free trial until");
    await expect(page.locator("#plusCard")).toContainText("Golden Lagoon");
  });
});

test.describe("Ohne App Store (Webseite heute)", () => {
  test.beforeEach(async ({ page }) => { await page.addInitScript(() => { Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false }); localStorage.setItem("offland-intro", "1"); }); });
  test("Plus bleibt unsichtbar: keine Plus-Woche, keine Paywall, keine Plus-Teile", async ({ page }) => {
    await newGame(page, "Mia");
    expect(await page.evaluate(() => T.S.plus)).toBe(null);
    expect(await page.evaluate(() => T.S.pending.some(e => e.type === "plusStart"))).toBe(false);
    await page.evaluate(() => { T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.settingsSheet(); });
    await expect(page.locator("#plusCard")).toHaveCount(0);
    await page.click("#shAllow"); await page.click(".st-sim [data-st=ok]"); await page.click(".st-sim [data-st=ok]");
    await expect(page.locator('#shieldCard [data-shmode="plan"]')).toHaveCount(0);
    await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.plusPaywall("test"); });
    await expect(page.locator("#plusPw")).toHaveCount(0);
    await page.evaluate(() => { const r = T.S.residents.find(x => x.kind === "mensch"); T.nameSheet({ type: "rename", id: r.id }); });
    await page.click('#lookEd [data-pane="extras"]');
    await expect(page.locator('#lookEd [data-look="acc"][data-v="8"]')).toHaveCount(0);
    await expect(page.locator("#lookEd .uk-star")).toHaveCount(0);
    // vor dem Start der Abos bleibt alles frei: Zeit-Statistik und Weltreise
    await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.S.allFeatures = true; T.render(); });
    await page.click('[data-tab="zeit"]');
    await expect(page.locator(".plus-lock")).toHaveCount(0);
    await page.evaluate(() => { T.S.found = 1; T.S.pending = [{ type: "discovery", world: 1 }]; T.showPending(); });
    await expect(page.locator("#discGo")).toHaveText("Jetzt aufbrechen");
  });
  test("Entwickler: Plus anzeigen, freischalten und entfernen", async ({ page }) => {
    await newGame(page, "Mia");
    await page.evaluate(() => { T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.settingsSheet(); });
    await expect(page.locator("#plusCard")).toHaveCount(0);
    await expect(page.locator("#devPlus")).toContainText("kein Plus");
    // Plus anzeigen: Simulation an, Paywall und Plus-Karte sind da
    await page.check("#devPlusSim");
    await expect(page.locator("#plusCard")).toContainText("Plus ansehen");
    await page.click("#plusMore");
    await expect(page.locator("#plusPw")).toBeVisible();
    await page.click("#pwClose");
    // freischalten und entfernen
    await page.click("#devPlusOn");
    await expect(page.locator("#devPlus")).toContainText("aktiv bis");
    expect(await page.evaluate(() => T.plusActive())).toBe(true);
    await page.click("#devPlusOff");
    await expect(page.locator("#devPlus")).toContainText("kein Plus");
    await page.uncheck("#devPlusSim");
    await expect(page.locator("#plusCard")).toHaveCount(0);
  });
});
