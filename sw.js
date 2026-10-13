/* Service Worker: macht OffLand auch ohne Internet spielbar. */
const CACHE = "offland-v146";
const MOVE = "offland-umzug";   // merkt sich die neue Domain, wenn die alte Adresse umleitet (siehe Umzug in app.js)
const ASSETS = [
  "./",
  "index.html",
  "css/style.css",
  "css/fonts.css",
  "js/app.js",
  "js/online-config.js",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== MOVE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Netzwerk zuerst (damit Updates ankommen), bei Offline aus dem Cache.
   Eigene Dateien immer beim Server nachfragen, statt den HTTP-Cache zu nutzen. */
/* Umzug: leitet die eigene Adresse auf eine andere Domain um, wird das Ziel gemerkt und die App
   noch einmal aus dem Speicher geladen, damit sie die Spielstände dieser Adresse mitnehmen kann. */
const awayTo = res => res.type === "opaqueredirect" || res.type === "opaque" || (res.redirected && new URL(res.url).origin !== location.origin);
async function remember(url) {
  try {
    const probe = await fetch(url, { mode: "cors", redirect: "follow", cache: "no-store", credentials: "omit" });
    const dest = new URL("./", probe.url);
    if (dest.origin === location.origin) return false;
    await (await caches.open(MOVE)).put("offland-umzug-ziel", new Response(dest.href));
    return true;
  } catch (e) { return false; }
}
async function moved(req, res) {
  if (req.mode === "navigate" && !(await remember(req.url))) return res;
  return (await caches.match(req, { cacheName: CACHE })) || (req.mode === "navigate" && (await caches.match("index.html", { cacheName: CACHE }))) || res;
}

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const own = new URL(e.request.url).origin === location.origin;
  e.respondWith(
    fetch(e.request, own ? { cache: "no-cache" } : undefined)
      .then(res => {
        if (own && awayTo(res)) return moved(e.request, res);
        if (res.ok && (res.type === "basic" || res.type === "cors")) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      // Ersatzseite nur beim Seitenaufruf, nie für Skripte (sonst bekommt z. B. Firebase HTML statt Code)
      .catch(() => caches.match(e.request).then(r => r || (e.request.mode === "navigate" ? caches.match("index.html") : Response.error())))
  );
});
