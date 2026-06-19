# ♡ KawaiiBooru — Updates

## 2026-06-19 — Security fixes

- **Login key leak** — the app could send your Danbooru API key to a non-Danbooru
  site when loading or downloading an image. Fixed: the key is now only ever sent
  to Danbooru.
- **In-app browser wandering off** — clicking an external link (or a popup) in the
  built-in browser could load a random website inside the app. Fixed: only
  Danbooru loads in-app; everything else opens in your real browser.
- **Phoning home for fonts** — the app loaded fonts from Google. Fixed: fonts are
  now bundled locally, so the app talks to nothing but Danbooru.
