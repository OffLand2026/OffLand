// Insel-Schutz: in der Web-Version simuliert (Erlaubnis, Apps wählen, Modus, Vorschau mit Zähler und Punkten)
const { test, expect, newGame } = require("./helpers");

test("Insel-Schutz einrichten, Modus wählen, Vorschau und Widerstehen zählt", async ({ page }) => {
  await newGame(page, "Mia");
  await page.evaluate(() => { T.S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.render(); T.settingsSheet(); });
  await expect(page.locator("#shieldCard")).toBeVisible();
  await page.click("#shAllow");
  await page.click(".st-sim [data-st=ok]");            // Bildschirmzeit erlauben (Simulation)
  await page.click(".st-sim [data-st=ok]");            // Apps wählen: Instagram, TikTok, YouTube vorausgewählt
  await expect(page.locator("#shieldCard")).toContainText("3 Apps gewählt");
  await expect(page.locator('#shieldCard [data-shmode="always"]')).toHaveClass(/on/);
  // Eigener Zeitraum (für alle, ohne Plus): Standard 21:00–24:00, frei einstellbar, auch über Mitternacht
  await page.click('#shieldCard [data-shmode="range"]');
  await expect(page.locator('#shieldCard [data-shmode="range"]')).toHaveClass(/on/);
  expect(await page.evaluate(() => T.S.shield.mode)).toBe("range");
  await expect(page.locator('#shieldCard [data-shr="0"]')).toHaveValue("1260");
  await page.selectOption('#shieldCard [data-shr="0"]', "1320");   // 22:00
  await page.selectOption('#shieldCard [data-shr="1"]', "420");    // bis 07:00
  expect(await page.evaluate(() => T.S.shield.range)).toEqual([1320, 420]);
  await expect(page.locator("#plusPw")).toHaveCount(0);
  await page.click('#shieldCard [data-shunlock="15"]');
  expect(await page.evaluate(() => T.S.shield.unlock)).toBe(15);
  // Vorschau: so sieht der Schutz beim Öffnen von Instagram aus
  const pts = await page.evaluate(() => T.S.points);
  await page.click("#shPrev");
  await expect(page.locator(".shield-prev")).toBeVisible();
  await expect(page.locator(".shield-prev")).toContainText("Trotzdem öffnen · 15 Min.");
  // Es spricht immer Lucifer oder Mr. Bay, mit Bild und Namen
  await expect(page.locator(".shield-prev p").nth(1)).toHaveText(/^(Lucifer|Mr\. Bay) · leg dein Handy lieber weg$/);
  await expect(page.locator(".shield-prev h2")).toHaveText(/^„.+“$/);
  await expect(page.locator(".shield-prev svg")).toHaveCount(1);
  await expect(page.locator(".shield-prev [data-sh=res]")).toHaveText("App schließen");
  await page.click(".shield-prev [data-sh=res]");
  await expect(page.locator(".shield-prev")).toHaveCount(0);
  await expect(page.locator("#shieldCard")).toContainText("1× widerstanden");
  expect(await page.evaluate(() => T.S.points)).toBe(pts + 1);
  // Ausschalten
  await page.click('#shieldCard [data-shmode="off"]');
  expect(await page.evaluate(() => T.S.shield.mode)).toBe("off");
});

// Das iPhone bekommt den Zeitraum als Zeitplan mit genau einem Fenster; der frühere Abendmodus erscheint als 21:00–24:00
test("Insel-Schutz: Zeitraum geht als ein Zeitfenster ans iPhone, alter Abendmodus wird zum Zeitraum", async ({ page }) => {
  await newGame(page, "Mia");
  await page.evaluate(() => {
    window.__sent = []; const orig = T.ST_SIM.shieldSet; T.ST_SIM.shieldSet = async o => { window.__sent.push(o); return orig(o); };
    T.S.pending = []; document.getElementById("modalRoot").innerHTML = "";
    T.S.stSim = { status: "approved" };                 // Bildschirmzeit erlaubt (Simulation)
    T.S.shield = { mode: "evening", sim: ["insta"], unlock: 5 };
    T.settingsSheet();
  });
  await expect(page.locator('#shieldCard [data-shmode="range"]')).toHaveClass(/on/);
  await expect(page.locator('#shieldCard [data-shr="0"]')).toHaveValue("1260");
  await expect(page.locator('#shieldCard [data-shr="1"]')).toHaveValue("1440");
  await page.selectOption('#shieldCard [data-shr="0"]', "1200");   // 20:00
  await expect.poll(() => page.evaluate(() => window.__sent.length)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.__sent.pop())).toEqual({ mode: "plan", unlock: 5, wins: [[1200, 1440]] });
  expect(await page.evaluate(() => [T.S.shield.mode, T.S.shield.range])).toEqual(["range", [1200, 1440]]);
  // Läuft Plus aus, wird aus den eigenen Zeitplänen der erste als Zeitraum
  await page.evaluate(() => { T.S.shield.mode = "plan"; T.S.shield.range = null; T.S.shield.wins = [[360, 540], [1260, 1440]]; window.__sent = []; T.plusLapse(); });
  expect(await page.evaluate(() => [T.S.shield.mode, T.S.shield.range])).toEqual(["range", [360, 540]]);
  await expect.poll(() => page.evaluate(() => window.__sent.length)).toBe(1);
  expect(await page.evaluate(() => window.__sent[0])).toEqual({ mode: "plan", unlock: 5, wins: [[360, 540]] });
});

test("Insel-Schutz: Lucifer und Mr. Bay wechseln sich ab, der Dank kommt von einem der beiden", async ({ page }) => {
  await newGame(page, "Mia");
  const r = await page.evaluate(() => {
    const out = [];
    for (let i = 0; i < 4; i++) { const m = T.shieldMsg(i, 0); out.push([m.who, m.title, m.sub]); }
    return { out, thanks: [1, 2].map(n => T.shieldThanks(n)) };
  });
  expect(new Set(r.out.map(x => x[0]))).toEqual(new Set(["luc", "bay"]));
  for (let i = 1; i < 4; i++) expect(r.out[i][0]).not.toBe(r.out[i - 1][0]);   // immer abwechselnd
  for (const [who, title, sub] of r.out) {
    expect(sub.startsWith(who === "luc" ? "Lucifer · " : "Mr. Bay · ")).toBe(true);
    expect(title).toMatch(/^„.+“$/);
  }
  for (const t of r.thanks) expect(t).toMatch(/^(Mr\. Bay|Lucifer): /);
});
