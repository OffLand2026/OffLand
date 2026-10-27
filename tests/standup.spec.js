// Lucifer live: beim ersten Öffnen am Tag ein Stand-up-Witz
const { test, expect, newGame } = require("./helpers");

async function ready(page) {
  await newGame(page);
  await yesterday(page);
}
async function yesterday(page) {
  // ein eingetragener Tag von gestern: ab dem zweiten Tag tritt Lucifer auf
  await page.evaluate(() => {
    document.getElementById("modalRoot").innerHTML = ""; T.S.pending = []; T.closeDay(30, [], {});
    const S = T.S, y = T.addDays(T.today(), -1); S.days[0].day = y; S.lastDay = y; S.storySeen = true; S.pending = [];
    document.getElementById("modalRoot").innerHTML = ""; T.save();
  });
}

test("Witz kommt einmal am Tag zuerst und lässt sich wegklicken", async ({ page }) => {
  await ready(page);
  await page.evaluate(() => { T.S.pending.push({ type: "musicAsk" }); T.standupCheck(); T.standupCheck(); });
  expect(await page.evaluate(() => T.S.pending.filter(e => e.type === "standup").length)).toBe(1);
  expect(await page.evaluate(() => T.S.pending[0].type)).toBe("standup");
  await page.evaluate(() => T.showPending());
  await expect(page.locator(".lu")).toBeVisible();
  await expect(page.locator(".lu-no")).toHaveText(/Witz Nr\. 1/);
  expect((await page.locator(".lu-setup").innerText()).length).toBeGreaterThan(5);
  expect((await page.locator(".lu-punch").innerText()).length).toBeGreaterThan(3);
  await page.click("#luOk");
  await expect(page.locator(".lu")).toHaveCount(0);
  // am selben Tag nicht nochmal
  await page.evaluate(() => T.standupCheck());
  expect(await page.evaluate(() => T.S.pending.some(e => e.type === "standup"))).toBe(false);
});

test("Ausgeschaltet oder am ersten Tag kommt kein Witz", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.S.pending = []; T.closeDay(30, [], {}); T.S.pending = []; T.standupCheck(); });
  expect(await page.evaluate(() => T.S.pending.some(e => e.type === "standup"))).toBe(false);   // erster Tag
  await yesterday(page);
  await page.evaluate(() => { T.S.lucHumor = "aus"; T.standupCheck(); });
  expect(await page.evaluate(() => T.S.pending.some(e => e.type === "standup"))).toBe(false);
});

test("Kein Witz doppelt, bis alle dran waren, und die Stufe wählt die Sammlung", async ({ page }) => {
  await ready(page);
  const r = await page.evaluate(() => {
    const seen = [], st = T.lucStage(), n = T.LUC_DARK.length;
    for (let i = 0; i < n; i++) { st.day = null; T.standupSheet(); seen.push(document.querySelector(".lu-punch").textContent); document.querySelector("#luOk").click(); }
    const uniq = new Set(seen).size;
    st.day = null; T.standupSheet(); const again = document.querySelector(".lu-punch").textContent; document.querySelector("#luOk").click();
    T.S.lucHumor = "lieb"; st.day = null; T.standupSheet(); const soft = document.querySelector(".lu-punch").textContent.replace(/\s+/g, " ").trim(); document.querySelector("#luOk").click();
    return { n, uniq, againOk: seen.includes(again), softOk: T.LUC_SOFT.some(j => j[1] === soft), num: st.n };
  });
  expect(r.uniq).toBe(r.n);
  expect(r.againOk).toBe(true);
  expect(r.softOk).toBe(true);
  expect(r.num).toBe(r.n + 2);
});

test("Reaktion wird gemerkt und Lucifer antwortet", async ({ page }) => {
  await ready(page);
  await page.evaluate(() => { T.standupCheck(); T.showPending(); });
  await page.click(".lu-r[data-r=boese]");
  await expect(page.locator("#luResp")).toHaveText("Danke. Ich geb mir Mühe.");
  await expect(page.locator(".lu-r[data-r=boese]")).toHaveClass(/on/);
  expect(await page.evaluate(() => Object.values(T.lucStage().react))).toEqual(["boese"]);
});

test("Alle Witze haben eine englische Übersetzung", async ({ page }) => {
  await ready(page);
  const missing = await page.evaluate(() => [...T.LUC_DARK, ...T.LUC_SOFT].flat().filter(t => !window.OFFLAND_EN[t]));
  expect(missing).toEqual([]);
});

test("Einstellung: Humor-Stufe umschalten", async ({ page }) => {
  await ready(page);
  await page.evaluate(() => T.settingsSheet());
  await page.selectOption("#humorSel", "lieb");
  expect(await page.evaluate(() => T.S.lucHumor)).toBe("lieb");
});
