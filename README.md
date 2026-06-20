# ♡ KawaiiBooru

A glowing kawaii-cyberpunk desktop gallery viewer for Danbooru art.

## Run it
1. Install **Node.js** (https://nodejs.org).
2. Double-click **`start.bat`**.
   - First launch installs Electron + a small build tool, then compiles and opens.
   - After that it just opens.

## Make a shareable installer (.exe)
Run **`build-exe.bat`**. It compiles the app and packages it into a real Windows
installer at `dist\KawaiiBooru Setup 1.0.0.exe`. Hand that to anyone — they
double-click to install it like a normal app (no Node.js, no terminal needed).
First run installs the packaging tool (~1–2 min); after that it's quick.

## Logging in — get your Danbooru API key
KawaiiBooru logs in with your Danbooru **username** and a **Danbooru API key**
(not your password). You make the key once on Danbooru's website, then paste it
into KawaiiBooru. Here's how:

1. **Sign in** to your account at https://danbooru.donmai.us.
2. Click the **My Account** tab (top right, under your username).
3. **Scroll down** to the **API Key** row.
4. Click **View**, and **enter your password** if you're prompted.
5. Click the **Add** button to make a new key.
6. **Type a name** for the key so you remember what it's for (e.g. `KawaiiBooru`).
7. Set the **permissions** for the key — leave them unrestricted, or limit them —
   then hit **Create**.
8. **Copy** the key that appears.
9. Back **in KawaiiBooru**, press **Log in**, **paste your key** into the API key
   field, and **type your username**, then log in.

Tick **"remember me"** if you want the app to keep you signed in next time. Your
key is stored **only on your own PC** (in `auth.json`), **encrypted at rest**
using your operating system's keychain/DPAPI where available, and is sent **only
to Danbooru** — never to anyone else. You can revoke a key any time from the same
Danbooru API Key page.

## Fully readable source — nothing hidden
This app is meant to be auditable. Every file is plain, readable source:

- `main.js` — the backend: window, Danbooru API calls, login, downloads
- `preload.js` / `renderer/wv-preload.js` — the safe bridges between parts
- `renderer/app.jsx` — **the actual app code you can read**
- `renderer/styles.css` — all the styling
- `start.bat` — the launcher

When you run `start.bat`, it compiles `renderer/app.jsx` into `renderer/app.js`
**on your own machine** (using esbuild). So the code that runs is built from the
source you can read — nothing is pre-compiled by anyone else. (`renderer/app.js`
is included only as a fallback; it gets rebuilt on launch.)

The files in `renderer/vendor/` are the official React library (minified) — you
can verify them against React's official releases.

## What it talks to
- Danbooru's public API (`safebooru.donmai.us` when logged out, `danbooru.donmai.us`
  when logged in) — for images and tags.
- A local file `auth.json` in your user-data folder — only if you tick "remember me".
  The API key inside it is encrypted with your OS keychain/DPAPI where available.
  Nothing is sent anywhere except Danbooru.

## Features
- Frameless neon window, animated background, sparkle cursor trail, click ripples
- Live tag autocomplete, HD thumbnails, lightbox with full Danbooru post options
- Login with your Danbooru API key, favorites, NSFW toggle, tier display
- Danbooru tabs that open in an in-app browser pane (no external browser)
- Always filters out sexualized-minor content; safe-only when logged out

Made with 💜 for Feris.

## Privacy & Terms
- **[`PRIVACY.md`](PRIVACY.md)** — KawaiiBooru collects nothing about you. Feris
  has no server and no access to your data; the only place your activity goes is
  Danbooru, under Danbooru's own policies.
- **[`TERMS.md`](TERMS.md)** — the terms of use, including the forking rules and
  the legal disclaimers.

## License
You're free to use, modify, fork, and share KawaiiBooru — the one rule is that
the in-app **mez.ink/ferisooo** credit (and credit to Claude's work on the
implementation) must stay visible. See [`TERMS.md`](TERMS.md) for the full terms.
