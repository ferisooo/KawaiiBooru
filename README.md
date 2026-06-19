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
  Nothing is sent anywhere except Danbooru.

## Features
- Frameless neon window, animated background, sparkle cursor trail, click ripples
- Live tag autocomplete, HD thumbnails, lightbox with full Danbooru post options
- Login with your Danbooru API key, favorites, NSFW toggle, tier display
- Danbooru tabs that open in an in-app browser pane (no external browser)
- Always filters out sexualized-minor content; safe-only when logged out

Made with 💜 for Feris.

## License
See `LICENSE`. You're free to use, modify, and share KawaiiBooru — the one
rule is the in-app **mez.ink/ferisooo** credit must stay visible.
