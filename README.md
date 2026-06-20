# ♡ KawaiiBooru

A glowing **kawaii-cyberpunk** desktop gallery for [Danbooru](https://danbooru.donmai.us) art —
a real app for your computer, not a website. Neon, sparkles, and a proper
gallery, wrapped around Danbooru's huge library.

> 💡 **Feris's idea & design** · 🛠️ **built by Claude (Anthropic)** — see
> [Credits](#-credits) and [`TERMS.md`](TERMS.md).

---

## ✨ Why you'll want it ("ok, I need this")

- **It's gorgeous.** A frameless neon window with an animated particle
  background, a **sparkle trail that follows your cursor** (even over the
  built-in browser), and a click ripple on every tap. It feels alive.
- **HD gallery, done right.** Big crisp thumbnails (it pulls the large sample,
  not the tiny preview), a smooth grid, and a full-screen **lightbox** you can
  zoom to the original in one click.
- **Live tag autocomplete.** Start typing and get instant suggestions —
  color-coded by category (artist / character / copyright / meta) with post
  counts, so you actually find what you want.
- **Everything you'd do on Danbooru, from the lightbox.** Favorite, find
  similar, download the original, edit, flag, add to a pool, add notes or
  commentary — without leaving the app.
- **A built-in Danbooru browser.** Your account, comments, wiki, forum, pools,
  uploads… open *inside* KawaiiBooru in a neon pane (the sparkle trail even
  follows you in there) instead of throwing you out to a plain browser.
- **Popular & Hot feeds, favorites, and a one-tap NSFW toggle** (only once
  you're logged in).
- **Private by design.** No accounts run by us, no analytics, no ads, no
  telemetry. Fonts are bundled, so the app talks to **nothing but Danbooru**.
- **Safe by default.** Sexualized-minor content is **always hard-blocked** (it
  can't be turned off), and you only see safe content when logged out.

## 🌸 How it's different from other booru viewers

Most Danbooru front-ends are either a website, a browser extension, or a
bare-bones list. KawaiiBooru is different on purpose:

| | Typical booru viewer | **KawaiiBooru** |
|---|---|---|
| Form | website / extension | **native desktop app** (Windows installer or one click) |
| Look | functional | **kawaii-cyberpunk** UI, particles, cursor sparkles, ripples |
| Privacy | analytics/ads common | **zero tracking**, fonts bundled, talks only to Danbooru |
| Your API key | often plain text | **encrypted at rest** (OS keychain/DPAPI) and only ever sent to Danbooru |
| Safety filter | optional / none | **non-removable** minor-content block, safe-only when logged out |
| Trust | minified blobs | **fully readable source**, compiled on *your* machine |
| Danbooru pages | open externally | open **inside the app** in a styled pane |

In short: it's the polished, private, good-looking desktop client that booru
browsing never had.

## 🚀 Set it up (no coding knowledge needed)

You don't need to understand any code. Just two steps on Windows:

1. **Install Node.js.** Go to <https://nodejs.org>, download the big green
   "LTS" button, and install it (click Next → Next → Finish). This is a
   one-time thing.
2. **Double-click `start.bat`.**
   - The **first** time, it quietly installs what it needs and builds the app
     (about a minute).
   - After that, double-clicking `start.bat` just opens KawaiiBooru.

That's it — you're in. 🎉

### Want a normal installer instead?

Double-click **`build-exe.bat`**. It packages everything into a real Windows
installer at `dist\KawaiiBooru Setup 1.0.0.exe`. Hand that file to anyone and
they install it like any other app — **no Node.js, no terminal needed**.

### Logging in — get your Danbooru API key

KawaiiBooru logs in with your Danbooru **username** and a **Danbooru API key**
(*not* your password). You make the key once on Danbooru's site, then paste it
in:

1. **Sign in** at <https://danbooru.donmai.us>.
2. Click the **My Account** tab (top right).
3. **Scroll** to the **API Key** row → click **View** (enter your password if
   asked).
4. Click **Add**, give the key a name (e.g. `KawaiiBooru`), leave permissions
   as-is, and hit **Create**.
5. **Copy** the key.
6. In KawaiiBooru, press **Log in**, paste the key, type your username, log in.

Tick **"remember me"** to stay signed in next time. Your key is stored **only on
your own PC** (in `auth.json`), **encrypted** with your operating system's
keychain/DPAPI where available, and is sent **only to Danbooru** — never to
anyone else. You can revoke a key any time from that same Danbooru page.

## 🛡️ Worried about viruses? Read these files

Totally fair — never run something you can't check. KawaiiBooru is built to be
**read in an afternoon**. Nothing is hidden, obfuscated, or pre-compiled by us.
If you're suspicious, open these (any plain text editor works):

- **[`main.js`](main.js)** — the heart of the app. **Everything** it does to the
  network, your files, and your login is here. If it talked to a sketchy server
  or touched files it shouldn't, you'd see it in this one file.
- **[`preload.js`](preload.js)** and **[`renderer/wv-preload.js`](renderer/wv-preload.js)**
  — the tiny, safe bridges between the parts of the app. Just a few lines each.
- **[`renderer/app.jsx`](renderer/app.jsx)** — the actual app you see and click.
- **[`renderer/index.html`](renderer/index.html)** — note the strict
  Content-Security-Policy line: it forbids loading any remote code.
- **[`start.bat`](start.bat)** — exactly what double-clicking the launcher runs.
- **[`package.json`](package.json)** — the full list of building blocks
  (Electron + esbuild — both mainstream, popular tools).

Three things that should put you at ease:

1. **It talks to one place: Danbooru** (`*.donmai.us`). You can confirm this in
   `main.js` — every network call points there — and even watch it with your
   firewall. No tracking, no telemetry, no "phone home."
2. **You build it from the source you can read.** `start.bat` compiles
   `renderer/app.jsx` into `renderer/app.js` **on your machine** with esbuild, so
   the code that runs is the code you just read. (`renderer/app.js` is only a
   fallback and gets rebuilt on launch.)
3. **The only big pre-made files are the official React library**
   (`renderer/vendor/react.js`, `react-dom.js`). You can match them byte-for-byte
   against React's official public releases.

## 📜 Forking & modifying — yes, please

**You're welcome to fork, modify, and build your own version** of KawaiiBooru,
for personal or non-commercial use, on one simple condition:

> Keep the credit. You must clearly credit **Feris's imagination** (the original
> idea & design, linked via **mez.ink/ferisooo**) **and Claude's work** (the
> implementation) — keep the in-app `mez.ink/ferisooo` credit visible and keep
> this attribution in your project's README/about screen.

That's the only rule. The full terms are in [`TERMS.md`](TERMS.md).

## 🔒 Privacy & terms

- **[`PRIVACY.md`](PRIVACY.md)** — **Feris collects nothing.** No server, no
  analytics, no tracking. Everything stays on your computer; the only place your
  activity goes is Danbooru, under Danbooru's own policies.
- **[`TERMS.md`](TERMS.md)** — the terms of use: the forking-with-credit rule,
  the age requirement, and the legal disclaimers.

## 🗂️ What's in the box

- `main.js` — backend: window, Danbooru API calls, login, downloads, security
- `preload.js` / `renderer/wv-preload.js` — the safe bridges between parts
- `renderer/app.jsx` — the app UI (readable source)
- `renderer/styles.css` — all the styling
- `renderer/fonts/` — bundled fonts (so the app never contacts Google)
- `renderer/vendor/` — the official minified React library
- `start.bat` — the launcher · `build-exe.bat` — the installer builder

## 💜 Credits

- **Idea, concept & design — Feris.** The whole vibe, the kawaii-cyberpunk
  direction, and what the app should be. → **[mez.ink/ferisooo](https://mez.ink/ferisooo)**
- **Implementation — Claude (Anthropic).** The code that makes it real.

Made with 💜 for Feris.
