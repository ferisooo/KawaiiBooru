# ♡ KawaiiBooru

A glowing **kawaii-cyberpunk** desktop gallery for [Danbooru](https://danbooru.donmai.us) art — a real app for your computer, not a website.

> 💡 **Feris's idea & design** · 🛠️ **built by Claude (Anthropic)** — see [Credits](#-credits) and [`TERMS.md`](TERMS.md).

## ✨ Highlights

- **Gorgeous UI** — frameless neon window, particle background, cursor sparkle trail, click ripples.
- **HD gallery + lightbox** — crisp thumbnails, smooth grid, zoom to original in one click.
- **Live tag autocomplete** — instant, color-coded suggestions with post counts.
- **Full Danbooru actions from the lightbox** — favorite, find similar, download, edit, flag, pools, notes.
- **Built-in Danbooru browser** — account, comments, wiki, forum, pools open *inside* the app.
- **Popular & Hot feeds, favorites, one-tap NSFW toggle** (when logged in).
- **Private by design** — no accounts, analytics, ads, or telemetry. Talks only to Danbooru; fonts bundled.
- **Safe by default** — sexualized-minor content is **always hard-blocked**; safe-only when logged out. Your API key is **encrypted at rest** and only ever sent to Danbooru.

## 🚀 Quick start (Windows, no coding needed)

1. Install **Node.js** from <https://nodejs.org> (the green **LTS** button). One-time.
2. Double-click **`start.bat`** — first run builds the app (~1 min), then just launches it.

Want a real installer? Double-click **`build-exe.bat`** → produces `dist\KawaiiBooru Setup 1.0.0.exe` (no Node.js needed to run it).

## 🔑 Logging in

Log in with your Danbooru **username** + an **API key** (not your password):

1. Sign in at <https://danbooru.donmai.us> → **My Account** → **API Key** → **View**.
2. **Add** a key (name it `KawaiiBooru`, keep default permissions) → **Create** → **Copy**.
3. In KawaiiBooru: **Log in**, paste the key, enter your username.

Your key is stored **only on your PC** (`auth.json`), encrypted via your OS keychain/DPAPI, and sent **only to Danbooru**. Revoke it anytime on that same Danbooru page.

## 🛡️ Trust & security

KawaiiBooru is **fully readable source, compiled on your machine** — nothing hidden or pre-compiled by us. Key files to check: [`main.js`](main.js) (all network/file/login logic), [`preload.js`](preload.js), [`renderer/app.jsx`](renderer/app.jsx), [`renderer/index.html`](renderer/index.html) (strict CSP blocks remote code). It talks to **one place only: Danbooru** (`*.donmai.us`). The only large pre-made files are the official React library, matchable byte-for-byte against React's releases.

## 📜 Forking

Fork, modify, and build your own version (personal / non-commercial) on **one condition**: **keep the credit** to Feris (idea & design, **mez.ink/ferisooo**) and Claude (implementation) — in-app and in your README. Full terms: [`TERMS.md`](TERMS.md).

## 🔒 Privacy & terms

- **[`PRIVACY.md`](PRIVACY.md)** — Feris collects nothing; everything stays on your computer.
- **[`TERMS.md`](TERMS.md)** — forking-with-credit rule, age requirement, disclaimers.

## 💜 Credits

- **Idea, concept & design — Feris** → **[mez.ink/ferisooo](https://mez.ink/ferisooo)**
- **Implementation — Claude (Anthropic)**

Made with 💜 for Feris.
