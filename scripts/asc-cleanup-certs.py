#!/usr/bin/env python3
"""Räumt verwaiste Entwickler-Zertifikate aus früheren CI-Läufen auf.

Jeder TestFlight-Lauf archiviert auf einem frischen Mac. Xcode legt dort mit dem
App-Store-Connect-Schlüssel jedes Mal ein neues „Apple Development“-Zertifikat an
(Name „Created via API“). Der private Schlüssel dazu verschwindet mit dem Runner,
das Zertifikat ist danach für niemanden mehr nutzbar, zählt aber weiter zu Apples
Höchstzahl. Ist die erreicht, bricht das Archivieren ab („Your account has reached
the maximum number of certificates“).

Widerrufen werden nur Entwickler-Zertifikate mit „Created via API“ im Namen.
Verteiler-Zertifikate und selbst in Xcode angelegte Zertifikate bleiben unberührt.
Bereits hochgeladene Builds sind nicht betroffen (die sind mit dem Verteiler-Zertifikat signiert).

Umgebung: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH (Pfad zur .p8-Datei).
Mit --dry-run wird nur aufgelistet.
"""
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

import jwt

API = "https://api.appstoreconnect.apple.com/v1"
DEV_TYPES = "DEVELOPMENT,IOS_DEVELOPMENT"
MARK = "Created via API"


def token():
    with open(os.environ["ASC_KEY_PATH"]) as f:
        key = f.read()
    now = int(time.time())
    return jwt.encode(
        {"iss": os.environ["ASC_ISSUER_ID"], "iat": now, "exp": now + 600, "aud": "appstoreconnect-v1"},
        key,
        algorithm="ES256",
        headers={"kid": os.environ["ASC_KEY_ID"], "typ": "JWT"},
    )


def call(method, url, tok):
    req = urllib.request.Request(url, method=method, headers={"Authorization": f"Bearer {tok}"})
    with urllib.request.urlopen(req, timeout=30) as r:
        body = r.read()
    return json.loads(body) if body else {}


def is_ci_cert(attr):
    return MARK in (attr.get("name") or "") or MARK in (attr.get("displayName") or "")


def main():
    dry = "--dry-run" in sys.argv
    tok = token()
    query = urllib.parse.urlencode({"filter[certificateType]": DEV_TYPES, "limit": "200"})
    certs = call("GET", f"{API}/certificates?{query}", tok).get("data", [])
    print(f"{len(certs)} Entwickler-Zertifikat(e) im Konto")
    revoked = 0
    for c in certs:
        a = c.get("attributes", {})
        label = f"{a.get('certificateType')} · {a.get('displayName') or a.get('name')} · bis {(a.get('expirationDate') or '')[:10]}"
        if not is_ci_cert(a):
            print(f"  bleibt:      {label}")
            continue
        if dry:
            print(f"  würde weg:   {label}")
            continue
        try:
            call("DELETE", f"{API}/certificates/{c['id']}", tok)
            revoked += 1
            print(f"  widerrufen:  {label}")
        except urllib.error.HTTPError as e:
            print(f"  Fehler {e.code} beim Widerrufen: {label}")
    print(f"{revoked} verwaiste CI-Zertifikat(e) widerrufen")


if __name__ == "__main__":
    main()
