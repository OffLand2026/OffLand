// Gemeinsame Helfer: legt den inneren Spielzustand als window.T offen und sammelt JS-Fehler.
const { test: base, expect } = require("@playwright/test");

// Wird vor das letzte "})();" von app.js gesetzt, also noch innerhalb der App
const EXPOSE = `window.T={get S(){return S},render,save,showPending,closeDay,makeWish,wishCheck,planAskSheet,planResult,
  chapterSheet,chapterCheck,CHAPTERS,feedSheet,bayLine,lucLine,arrival,weekSheet,bayAlbumSheet,isoWeek,today,addDays,umfrageCheck,travel,travelSheet,SHOP,price,hereItems};\n`;

const test = base.extend({
  errors: async ({}, use) => { await use([]); },
  page: async ({ page, errors }, use) => {
    page.on("pageerror", e => errors.push(e.message));
    await page.route("**/js/app.js", async route => {
      const res = await route.fetch(); let t = await res.text();
      const i = t.lastIndexOf("})();");
      route.fulfill({ response: res, body: t.slice(0, i) + EXPOSE + t.slice(i) });
    });
    await use(page);
    expect(errors, "JavaScript-Fehler auf der Seite").toEqual([]);
  }
});

// Alle offenen Fenster wegklicken (Begrüßung, Ankünfte, Tagesbilanz …)
async function dismiss(page, max = 25) {
  for (let i = 0; i < max; i++) {
    const ok = await page.$("#modalRoot [data-ok], #modalRoot #nameOk, #modalRoot [data-c=egal], #modalRoot #boatYes");
    if (!ok) return;
    await ok.click(); await page.waitForTimeout(60);
  }
}

// Neues Konto anlegen, Intro überspringen, Insel starten
async function newGame(page, name = "Testi") {
  await page.goto("/");
  await page.click("#newAcc");
  await page.fill("#accName", name);
  await page.click("#accCreate");
  await page.click("#storySkip");
  await page.click("#startBtn");
  await dismiss(page);
}

module.exports = { test, expect, dismiss, newGame };
