// Konten: alter Spielstand, Anlegen mit PIN, Abmelden, Umbenennen, Löschen
const { test, expect, dismiss } = require("./helpers");
const alt = require("./fixtures/altspielstand.json");

const profiles = page => page.evaluate(() => JSON.parse(localStorage.getItem("offline-insel-profile") || "[]"));

test("Kontoverwaltung von Anfang bis Ende", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(s => { localStorage.clear(); sessionStorage.clear(); localStorage.setItem("offline-insel-v1", JSON.stringify(s)); }, alt);
  await page.reload();
  await expect(page.locator("#start")).toContainText("Meine Insel");
  await expect(page.locator("#start")).toContainText("9 Tage");

  // Neues Konto: nur Name und Avatar, die PIN kommt danach übers Profilbild
  await page.click("#newAcc");
  await expect(page.locator("#start")).toContainText("Dein Avatar");
  await expect(page.locator("#accPin")).toHaveCount(0);
  await page.click("#accCreate");
  await expect(page.locator("#accErr")).toContainText("Namen");
  await page.fill("#accName", "Lina");
  await page.click("#accCreate");
  await page.click("#storySkip");
  await page.click("#startBtn");
  await dismiss(page);
  await page.click("#accBtn"); await page.click("#accPinBtn");
  await page.fill("#pinNew", "12"); await page.fill("#pinRep", "12"); await page.click("#pinSave");
  await expect(page.locator("#pinErr")).toContainText("4 Ziffern");
  await page.fill("#pinNew", "1234"); await page.fill("#pinRep", "1234"); await page.click("#pinSave");
  expect((await profiles(page)).find(p => p.name === "Lina").pin).not.toBeNull();

  // Bleibt nach Neuladen angemeldet
  await page.reload();
  await expect(page.locator("body")).not.toHaveClass(/start/);

  // Abmelden, falsche und richtige PIN
  await page.click("#accBtn"); await page.click("#accOut");
  await expect(page.locator("body")).toHaveClass(/start/);
  await page.locator("[data-login]").filter({ hasText: "Lina" }).click();
  await page.fill("#pinIn", "9999"); await page.click("#pinOk");
  await expect(page.locator("#pinErr")).toContainText("Falsche");
  await page.fill("#pinIn", "1234"); await page.click("#pinOk");
  await expect(page.locator("body")).not.toHaveClass(/start/);

  // Umbenennen, PIN entfernen
  await page.click("#accBtn"); await page.click("#accEdit");
  await page.fill("#accName", "Lina M."); await page.click("#edOk");
  expect((await profiles(page)).some(p => p.name === "Lina M.")).toBe(true);
  await page.click("#accBtn"); await page.click("#accPinBtn");
  await page.fill("#pinOld", "1234"); await page.click("#pinDel");
  expect((await profiles(page)).find(p => p.name === "Lina M.").pin).toBeNull();

  // Löschen erst nach Bestätigung
  await page.click("#accBtn"); await page.click("#accDel");
  await expect(page.locator("#delYes")).toBeDisabled();
  await page.click('#modalRoot [data-why="neustart"]');
  await page.check("#delSure"); await page.click("#delYes");
  expect((await profiles(page)).map(p => p.name)).toEqual(["Meine Insel"]);
  // Statistik zählt das gelöschte Konto samt freiwilligem Grund (ohne Firebase bleibt es lokal in der Warteschlange)
  const q = await page.evaluate(k => (JSON.parse(localStorage.getItem(k)) || {}).q || {}, "offland-stats");
  expect(q.konto_geloescht).toBe(1); expect(q.konto_grund_neustart).toBe(1);
  await expect(page.locator("body")).toHaveClass(/start/);

  // Altes Konto öffnet mit seinen Daten
  await page.locator("[data-login]").first().click();
  await dismiss(page);
  await expect(page.locator("#view")).toContainText("77 %");
});

test("Erster Start: Zeit-Rechner, und sein Wert wird der bisherige Schnitt", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload();
  await expect(page.locator("#start")).toContainText("Wie lange bist du am Tag am Handy?");
  await expect(page.locator("#calcDays")).toHaveText("61 Tage");
  await page.locator("#calcH").fill("6");
  await expect(page.locator("#calcOut")).toHaveText("6 h");
  await expect(page.locator("#calcDays")).toHaveText("91 Tage");
  await page.click("#newAcc"); await page.fill("#accName", "Rechner"); await page.click("#accCreate");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("offline-insel-profile")).length)).toBe(1);
  await page.click("#storySkip");
  await expect(page.locator("#setBaseOut")).toHaveText("6 h");
});

test("Umzug: Inseln werden eingepackt und auf der neuen Adresse ausgepackt", async ({ page }) => {
  await page.goto("/");
  // Zwei Inseln anlegen, dann einpacken
  const pkg = await page.evaluate(async () => {
    localStorage.setItem("offline-insel-profile", JSON.stringify([{ id: "a1", name: "Emily" }, { id: "b2", name: "Franzi" }]));
    localStorage.setItem("offline-insel-v1:a1", JSON.stringify({ glueck: 77 })); localStorage.setItem("offline-insel-v1:b2", JSON.stringify({ glueck: 55 }));
    return await T.umzugPack();
  });
  // „Neue Domain“: alles leer, eine eigene Insel schon da
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem("offline-insel-profile", JSON.stringify([{ id: "c3", name: "Neu" }])); });
  await page.goto("/?neu=1#umzug=" + pkg);
  await expect(page.locator("#toast, .toast").first()).toContainText("umgezogen");
  const r = await page.evaluate(() => ({ names: JSON.parse(localStorage.getItem("offline-insel-profile")).map(p => p.name), g: JSON.parse(localStorage.getItem("offline-insel-v1:a1")).glueck, hash: location.hash }));
  expect(r.names.sort()).toEqual(["Emily", "Franzi", "Neu"]); expect(r.g).toBe(77); expect(r.hash).toBe("");
});
