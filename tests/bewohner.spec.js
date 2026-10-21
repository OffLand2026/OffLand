// Bewohnerliste: Suche, einklappbare Abschnitte, Raster für Menschen und Tiere mit Details
const { test, expect, newGame, dismiss } = require("./helpers");

test("Viele Bewohner: suchen, einklappen, Mensch und Tier antippen", async ({ page }) => {
  await newGame(page);
  await page.evaluate(() => { const S = T.S; S.allFeatures = true;
    for (let i = 0; i < 9; i++) S.residents.push({ id: "t" + i, name: "Tier" + i, kind: "tier", art: i % 2 ? "Hase" : "Ziege", status: "da", ret: 0, born: 0 });
    S.residents.push({ id: "m1", name: "Zora", kind: "mensch", art: "Mensch", status: "da", ret: 0, born: 0, job: "fischer", trait: "ruhig" });
    for (let i = 2; i < 9; i++) S.residents.push({ id: "m" + i, name: "Mensch" + i, kind: "mensch", art: "Mensch", status: "da", ret: 0, born: 0, job: "baecker" });
    S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.render(); });
  await page.click("[data-tab=bewohner]");
  await expect(page.locator("#resSearch")).toBeVisible();
  await expect(page.locator("details[data-fold=t] .ani-grid .ani-tile")).toHaveCount(await page.evaluate(() => T.S.residents.filter(r => r.kind === "tier" && r.status !== "verstorben" && r.status !== "umgezogen").length));
  await expect(page.locator("details[data-fold=m] .ani-grid .ani-tile")).toHaveCount(await page.evaluate(() => T.S.residents.filter(r => r.kind === "mensch" && r.status !== "verstorben").length));
  // Suche nach Name und Beruf
  await page.fill("#resSearch", "zora");
  await expect(page.locator("details[data-fold=m] [data-q]:not([hidden])")).toHaveCount(1);
  await page.fill("#resSearch", "fischer");
  await expect(page.locator("details[data-fold=m] [data-q]:not([hidden])")).toHaveCount(await page.evaluate(() => T.S.residents.filter(r => r.kind === "mensch" && r.status !== "verstorben" && r.job === "fischer").length));
  await page.fill("#resSearch", "zora");
  await expect(page.locator("details[data-fold=t]")).toBeHidden();
  await page.fill("#resSearch", "gibtsnicht");
  await expect(page.locator("#resNone")).toBeVisible();
  await page.fill("#resSearch", "");
  await expect(page.locator("details[data-fold=t]")).toBeVisible();
  // Tiere einklappen, Zustand bleibt nach dem Neuzeichnen
  await page.click("details[data-fold=t] > summary");
  expect(await page.evaluate(() => T.S.bwFold.t)).toBe(true);
  await page.evaluate(() => T.render());
  await expect(page.locator("details[data-fold=t]")).not.toHaveAttribute("open", "");
  await page.click("details[data-fold=t] > summary");
  // Tier antippen öffnet die Details mit Bearbeiten
  await page.locator("details[data-fold=t] .ani-tile").first().click();
  await expect(page.locator("#modalRoot [data-rename]")).toBeVisible();
  await page.click("#modalRoot [data-ok]");
  // Mensch antippen: Details mit Beruf und Bearbeiten
  await page.locator("details[data-fold=m] .ani-tile", { hasText: "Zora" }).click();
  await expect(page.locator("#modalRoot .label")).toHaveText("Fischer:in");
  await expect(page.locator("#modalRoot [data-rename]")).toBeVisible();
});

test("Tier-Umkleide: Look, Halsband und Brille werden gespeichert", async ({ page }) => {
  await newGame(page, "Mia");
  const id = await page.evaluate(() => { const r = T.S.residents.find(x => x.kind === "tier"); T.nameSheet({ type: "rename", id: r.id }); return r.id; });
  await expect(page.locator("#lookEd .uk-rail [data-pane=brille]")).toBeVisible();
  await page.click('#lookEd [data-lookset="2"]');
  await page.click('#lookEd [data-pane="brille"]');
  await page.click('#lookEd [data-look="specs"][data-v="1"]');
  await page.click("#nameOk");
  const g = await page.evaluate(id => T.S.residents.find(x => x.id === id).gear, id);
  expect(g.specs).toBe(1);
  await page.evaluate(() => T.render());
  expect(await page.evaluate(() => document.body.innerHTML.includes('fill="#14151F" stroke="#3A3D58" stroke-width=".3"'))).toBe(true);
});

test("Tab Zeit: Kalender, Tag antippen und Sammelkarten", async ({ page }) => {
  await newGame(page, "Mia");
  await page.evaluate(() => { T.S.testmode = true; T.S.baseline = 300; T.S.budget = 180; });
  for (let i = 0; i < 8; i++) { await page.evaluate(i => T.closeDay([60, 200, 120, 90, 150, 30, 240, 100][i], [], {}), i); await dismiss(page); }
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; });
  await page.click("#tabs [data-tab=zeit]");
  await expect(page.locator("#ztCal [data-zday]")).toHaveCount(8);
  const d = await page.locator("#ztCal [data-zday]").first().getAttribute("data-zday");
  await page.locator("#ztCal [data-zday]").first().dispatchEvent("click");
  await expect(page.locator(".zt-day")).toContainText("1 h");
  expect(await page.locator(".zt-card").count()).toBeGreaterThan(1);
  await expect(page.locator(".zt-chips").nth(1)).toContainText("Bester Monat");
  expect(d).toBeTruthy();
});

// Aussehen aus Foto: Erkennung wird durch ein Ersatz-Modell simuliert, das zum gezeichneten Testbild passt
const FAKE_MP = `export const FilesetResolver={forVisionTasks:async()=>({})};
export const ImageSegmenter={createFromOptions:async(fs,o)=>{const tier=o.baseOptions.modelAssetPath.includes("deeplab");
  return {segment(cv){const w=cv.width,h=cv.height,a=new Uint8Array(w*h),in_=(x,y,cx,cy,rx,ry)=>((x-cx)/rx)**2+((y-cy)/ry)**2<=1;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const X=x*200/w,Y=y*260/h;let c=0;
      if(tier){if(in_(X,Y,100,140,70,80))c=8}
      else if(in_(X,Y,100,100,40,50))c=3; else if(in_(X,Y,100,85,52,62)&&Y<120)c=1; else if(Y>=170&&X>40&&X<160)c=4;
      a[y*w+x]=c}
    return {categoryMask:{width:w,height:h,getAsUint8Array:()=>a},close(){}}}}}};`;
async function photoFile(page, kind) {
  const b64 = await page.evaluate(kind => { const c = document.createElement("canvas"); c.width = 200; c.height = 260; const x = c.getContext("2d");
    const el = (cx, cy, rx, ry, f) => { x.fillStyle = f; x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, 7); x.fill(); };
    if (kind === "tier") { x.fillStyle = "#E8E4DA"; x.fillRect(0, 0, 200, 260); el(100, 140, 70, 80, "#1E1E24"); el(100, 170, 22, 30, "#F5F5F5"); }
    else { x.fillStyle = "#808890"; x.fillRect(0, 0, 200, 260); x.save(); x.beginPath(); x.rect(0, 0, 200, 120); x.clip(); el(100, 85, 52, 62, "#E0B867"); x.restore();
      el(100, 100, 40, 50, "#F0CDB0"); x.fillStyle = "#5B8CD6"; x.fillRect(40, 170, 120, 90); }
    return c.toDataURL("image/png").split(",")[1]; }, kind);
  return { name: "foto.png", mimeType: "image/png", buffer: Buffer.from(b64, "base64") };
}
test("Aussehen aus Foto: Mensch und Tier, mit Rückgängig", async ({ page }) => {
  await page.route("https://cdn.jsdelivr.net/npm/@mediapipe/**", r => r.request().url().endsWith("vision_bundle.mjs")
    ? r.fulfill({ body: FAKE_MP, contentType: "text/javascript", headers: { "access-control-allow-origin": "*" } }) : r.abort());
  await newGame(page, "Mia");
  await page.evaluate(() => { const S = T.S;
    S.residents.push({ id: "fm", name: "Zora", kind: "mensch", art: "Mensch", status: "da", ret: 0, born: 0, job: "fischer", trait: "ruhig", look: { skin: 5, hair: 0, style: 1, shirt: 8, pat: 0, beard: 0, acc: [] } });
    S.residents.push({ id: "fk", name: "Lucifer", kind: "tier", art: "Katze", status: "da", ret: 0, born: 0, fur: 0 });
    S.pending = []; document.getElementById("modalRoot").innerHTML = ""; T.nameSheet({ type: "rename", id: "fm" }); });
  // Mensch
  let [fc] = await Promise.all([page.waitForEvent("filechooser"), page.click("#lookEd [data-photo]")]);
  await fc.setFiles(await photoFile(page, "mensch"));
  await expect(page.locator("#lookEd .photo-res")).toContainText("Haarfarbe");
  await expect(page.locator("#lookEd .photo-res")).toContainText("Kurz");
  await expect(page.locator("#lookEd .photo-alt button")).toHaveCount(4);
  // Rückgängig stellt den alten Look wieder her, danach erneut übernehmen und speichern
  await page.click("#lookEd [data-photo-undo]");
  await expect(page.locator("#lookEd .photo-res")).toHaveCount(0);
  [fc] = await Promise.all([page.waitForEvent("filechooser"), page.click("#lookEd [data-photo]")]);
  await fc.setFiles(await photoFile(page, "mensch"));
  await expect(page.locator("#lookEd .photo-res")).toBeVisible();
  await page.click("#nameOk");
  const look = await page.evaluate(() => T.S.residents.find(x => x.id === "fm").look);
  expect(look).toMatchObject({ skin: 0, hair: 4, style: 0, shirt: 3, beard: 0 });
  // Tier: dunkle Katze
  await page.evaluate(() => { document.getElementById("modalRoot").innerHTML = ""; T.nameSheet({ type: "rename", id: "fk" }); });
  [fc] = await Promise.all([page.waitForEvent("filechooser"), page.click("#lookEd [data-photo]")]);
  await fc.setFiles(await photoFile(page, "tier"));
  await expect(page.locator("#lookEd .photo-res")).toContainText("Fellfarbe");
  await page.click("#nameOk");
  expect(await page.evaluate(() => T.S.residents.find(x => x.id === "fk").fur)).toBe(2);
});

test("Umkleide-Vorschau: große Tiere (Wal, Elch, Kamel, Eisbär) passen ganz hinein", async ({ page }) => {
  await newGame(page, "Mia");
  for (const art of ["Wal", "Elch", "Kamel", "Eisbär", "Delfin"]) {
    const box = await page.evaluate(a => {
      document.getElementById("modalRoot").innerHTML = "";
      T.S.residents.push({ id: "big" + a, name: "Bruno", kind: "tier", art: a, pair: null, status: "da", ret: 0, born: T.S.dayCount });
      T.nameSheet({ type: "rename", id: "big" + a });
      const s = document.querySelector("#lookPrev svg"), [x, y, w, h] = s.getAttribute("viewBox").split(" ").map(Number), b = s.getBBox();
      return { vb: [x, y, x + w, y + h], bb: [b.x, b.y, b.x + b.width, b.y + b.height] };
    }, art);
    expect(box.bb[0], art).toBeGreaterThanOrEqual(box.vb[0] - .5);
    expect(box.bb[1], art).toBeGreaterThanOrEqual(box.vb[1] - .5);
    expect(box.bb[2], art).toBeLessThanOrEqual(box.vb[2] + .5);
    expect(box.bb[3], art).toBeLessThanOrEqual(box.vb[3] + .5);
  }
});
