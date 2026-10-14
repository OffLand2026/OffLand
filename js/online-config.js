/* Firebase-Konfiguration für Freunde und Ranglisten (Anleitung: docs/online.md).
   Steht hier null, bleibt OffLand komplett offline.
   Diese Werte sind nicht geheim: Sie stehen in jeder Web-App, geschützt wird über firestore.rules. */
window.OFFLAND_FIREBASE = {
  apiKey: "AIzaSyCKVGX1LYfoKPQE5mtTKlMxhALWlF42I2k",
  authDomain: "offland2026.firebaseapp.com",
  projectId: "offland2026",
  storageBucket: "offland2026.firebasestorage.app",
  messagingSenderId: "287186820099",
  appId: "1:287186820099:web:e420878c5eebf2cf894236"
};

// Kontakt-E-Mail für Abmeldungen von der Warteliste (warteliste/index.html), z. B. "hallo@offland.app".
window.OFFLAND_CONTACT = "support@offlandapp.com";

/* Schutz vor Missbrauch (Firebase App Check mit reCAPTCHA Enterprise, bei Google heute „Fraud Defense“).
   Anleitung: docs/online.md → „App Check“. Steht hier null, ist App Check aus. Der Schlüssel ist nicht geheim. */
window.OFFLAND_APPCHECK_KEY = "6LdtXO4tAAAAAO8gHgTYLdiCbjhTZkZRjw_-AKij";

// Wird von App, Statistik-Seite und Warteliste direkt nach initializeApp aufgerufen, vor dem ersten Firestore-Zugriff.
window.offlandAppCheck = async function (app, base) {
  if (!window.OFFLAND_APPCHECK_KEY) return;
  try {
    const C = await import(base + "firebase-app-check.js");
    C.initializeAppCheck(app, { provider: new C.ReCaptchaEnterpriseProvider(window.OFFLAND_APPCHECK_KEY), isTokenAutoRefreshEnabled: true });
  } catch (e) { console.warn("App Check:", e); }
};
