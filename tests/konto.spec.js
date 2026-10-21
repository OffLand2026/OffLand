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

  // Neues Konto mit PIN
  await page.click("#newAcc");
  await page.click("#accCreate");
  await expect(page.locator("#accErr")).toContainText("Namen");
  await page.fill("#accName", "Lina");
  await page.fill("#accPin", "12");
  await page.click("#accCreate");
  await expect(page.locator("#accErr")).toContainText("4 Ziffern");
  await page.fill("#accPin", "1234");
  await page.click("#accCreate");
  await page.click("#storySkip");
  await page.click("#startBtn");
  await dismiss(page);

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

test("Erster Start zeigt die Anleitung", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload();
  await expect(page.locator("#start")).toContainText("So funktioniert");
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
