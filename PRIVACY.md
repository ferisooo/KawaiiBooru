# ♡ KawaiiBooru — Privacy Policy

_Last updated: 2026-06-19_

KawaiiBooru is a small, open-source desktop app that lets you browse art from
[Danbooru](https://danbooru.donmai.us). This document explains, in plain words,
what the app does and does not do with your information.

## The short version

**Feris does not collect, store, transmit, sell, or have access to anything
about you.** There is no KawaiiBooru server, no account system run by Feris, no
analytics, no telemetry, no tracking, and no ads. The app runs entirely on your
own computer.

The only place your activity goes is **Danbooru**, because KawaiiBooru is just a
viewer that talks to Danbooru's public API on your behalf — exactly the same as
if you visited Danbooru in a web browser.

## What stays on your computer

Everything KawaiiBooru "remembers" stays local to your machine and is never sent
to Feris or anyone else:

- **Danbooru login (optional).** If — and only if — you tick **"remember me"**
  when logging in, your Danbooru username and API key are saved to a local file
  named `auth.json` in your user-data folder on your own device. If you don't
  tick it, nothing is written to disk. You can clear it any time by logging out.
- **Downloaded images.** When you save an image, it is written to the location
  you choose, on your own computer.
- **App settings** (such as the NSFW toggle) live only in the running app.

KawaiiBooru never uploads, syncs, or backs up any of this. Deleting the app (and
its user-data folder) removes it.

## What is sent to Danbooru

KawaiiBooru is a front-end for Danbooru's public API. To show you art, it makes
the same kinds of requests a normal Danbooru user's browser makes, including:

- Searches, tag autocomplete, and image/thumbnail requests.
- If you log in, your Danbooru username and API key are sent **directly to
  Danbooru** to authenticate you (for favorites, NSFW content, your account
  pages, etc.).
- A descriptive `User-Agent` string identifying the app, as Danbooru asks API
  clients to provide.

**Your use of Danbooru is governed by Danbooru's own Terms of Service and
Privacy Policy, not by KawaiiBooru or Feris.** Any data Danbooru collects, logs,
or stores about your requests (such as your IP address) is handled by Danbooru
under their policies. Please review them at:

- https://danbooru.donmai.us/terms_of_service
- https://danbooru.donmai.us/privacy_policy

When you are logged out, KawaiiBooru talks to `safebooru.donmai.us` (general,
safe-only content). When you are logged in, it talks to `danbooru.donmai.us`.

## Content safety

KawaiiBooru always filters out sexualized-minor content (tags such as `loli`,
`shota`, and related terms are hard-blocked and cannot be turned off), and shows
safe-only content when you are logged out. This filtering happens locally in the
app. Beyond that, the art shown comes from Danbooru and is subject to Danbooru's
own moderation, ratings, and policies.

## Children's privacy

KawaiiBooru is not directed at children. Danbooru hosts adult content and has its
own age requirements. Do not use this app if you are not old enough to view the
content under the laws of your jurisdiction and under Danbooru's terms.

## Third parties

- **Danbooru** — the image source and API (see links above).
- **React** — the bundled UI library (`renderer/vendor/`) runs locally and sends
  nothing anywhere.
- **Electron / Node.js** — the local runtime the app is built on.

KawaiiBooru does not integrate any third-party analytics, advertising, crash
reporting, or tracking SDKs.

## Changes to this policy

This policy may be updated as the app changes. The "Last updated" date above
reflects the current version. Because the project is open source, the full
history of changes is visible in the repository.

## No warranty

This document is provided for transparency and is **not legal advice**.
KawaiiBooru is provided "as is," without warranty of any kind. See `TERMS.md`
for the full terms of use and disclaimers.

## Contact

KawaiiBooru is a personal, non-commercial project. There is no support
organization and no personal data held by Feris to request, correct, or delete —
because none is collected in the first place. Questions about the project can be
directed to the maintainer via **mez.ink/ferisooo**.

---

Made with 💜 for Feris.
