# 🚀 Downtify (Frontend) — forked proxy UI

*Downtify* <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7cd717e7-bfd8-4b98-b8be-9c04d4e0b490" />



> Downtify is the graphical/automation piece (frontend + server-side automation) of a Spotidown-based downloader. This repository is a fork of the original Spotidown project — **this API is a fork**.

⚠️ **Warning:** Downtify automates web scraping and downloads MP3 files. Downloading copyrighted material may be illegal in your jurisdiction. Use responsibly and at your own risk.

---

## ✨ Credits (original authors first)

- Original Spotidown authors / upstream project (the code this repo was forked from)
- spotidown.app — original frontend that this project automates

Libraries and projects used:
- Bun — https://bun.sh/
- Puppeteer — https://pptr.dev/
- (Optional) spotify-web-api-node — https://github.com/thelinmichael/spotify-web-api-node

---

## 🎯 What Downtify is

Downtify is a Bun/TypeScript-based proxy UI and automation layer that controls a headless Chromium instance (via Puppeteer) to drive the Spotidown frontend and resolve direct MP3 download URLs for Spotify tracks. It provides a small Express API for programmatic access and server-side playlist downloads.

This repository represents the graphical/automation portion (the UI + automation) and not the original upstream project.

---

## 🧰 Prerequisites

You need the following installed / available:

- Bun (v1.0+) — recommended runtime (runs TypeScript directly and includes fetch)
- Node.js (v18+) — required only if running under Node instead of Bun, and for Puppeteer compatibility
- Puppeteer — headless Chromium automation used to interact with spotidown.app

Notes about Spotify integration:
- spotify-web-api-node is optional. Downtify runs without it.
- CLIENT_ID and CLIENT_SECRET are optional: when provided, Downtify will use Spotify's client credentials flow to fetch richer metadata (and enable ISRC lookup). When not provided, Downtify falls back to scraping Spotify embed pages for metadata and still performs downloads via the Spotidown scraping flow.

---

## 🔌 Quick overview of endpoints

- `GET /` -> status and endpoints listing
- `GET /track/:id` -> returns MP3 (attachment) for Spotify track id
- `POST /track/url` -> body: `{ url }` -> returns metadata + download endpoint
- `GET /track/:id/info` -> track metadata (Spotify API preferred, embed fallback)
- `GET /isrc/:isrc` -> search Spotify by ISRC and return download (best with credentials; otherwise limited)
- `GET /playlist/:id` -> playlist metadata + list of tracks
- `POST /playlist/download-all` -> body: `{ url, jobId? }` -> downloads tracks to `downloads/<playlist>/` on the server
- `GET /playlist/zip/progress/:jobId` -> SSE progress updates for playlist jobs

> Important: When you download a playlist via `/playlist/download-all`, all MP3 files are saved to the project's `downloads/<sanitized-playlist-name>/` folder on disk — even if the client progress bar does not show each file save. Always check the `downloads/` directory for the saved files.

---

## 🔁 What changed from the original Spotidown (API changes in this fork)

- Project renamed to **Downtify** and reorganized as a Bun/TypeScript frontend + server automation piece.
- Exposed an Express HTTP API to allow programmatic downloads and integrations (endpoints listed above).
- Added server-side playlist downloading that saves MP3 files to `downloads/<sanitized-playlist-name>/`.
- Added optional Server-Sent Events (SSE) progress reporting for playlist downloads using an optional `jobId` (clients can listen on `/playlist/zip/progress/:jobId`).
- Spotify Web API integration is optional: the server uses Spotify Web API if `CLIENT_ID`/`CLIENT_SECRET` are supplied; otherwise it falls back to scraping Spotify embed pages.
- Implemented ISRC lookup endpoint which uses the Spotify API when available.
- Improved filename sanitization and duplicate-filename collision handling.
- Periodic refresh of the Spotidown page (every 5 minutes) to help keep the Puppeteer session alive.
- Preserved some Portuguese messages from the forked code (can be standardized on request).

---

## ⚠️ Known issues & limitations

1. **Spotify credentials are optional** — `CLIENT_ID`/`CLIENT_SECRET` are optional; without them metadata and ISRC search may be limited, but downloads still work via Spotidown scraping.
2. **Puppeteer / Chromium launch failures** — provide `executablePath` or run with `--no-sandbox` in containerized environments.
3. **grecaptcha / reCAPTCHA issues** — if grecaptcha is blocked or page changes, the recaptcha execution can fail and downloads will not resolve.
4. **Spotidown / Spotify frontend changes** — scraping logic depends on current HTML/JSON structures; upstream changes can break parsing.
5. **MP3 fetch failures** — resolved MP3 URLs may expire or be blocked.
6. **Default port & language mixing** — server listens on port `3045` by default and some messages are in Portuguese; consider configuring `PORT` and standardizing messages.
7. **SSE job cleanup** — jobs are removed shortly after completion; clients reconnecting late may not find job state.
8. **No `start` script by default** — consider adding `scripts.start` to `package.json` for easier deployment.

---

## ▶️ How to run (super simple)

1. Install dependencies (Bun recommended):

```bash
bun install
```

2. Start the API server:

```bash
bun run index.ts
```

3. After the server is running, open the HTML UI in your browser manually (it does NOT open the browser for you — yes, really, you have to open it yourself 👀). Example:

- Open the UI file in your browser or visit `http://localhost:3045` (depending on how your UI is served).

Why it doesn't open the browser automatically? Because it keeps things simple, predictable, and friendly for server environments (and because you asked — "porque sim -_-" 😅).

---

## 🛠 Example usage

- Download a single track:

```bash
curl -L http://localhost:3045/track/<TRACK_ID> -o track.mp3
```

- Inspect track metadata from a Spotify URL:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://open.spotify.com/track/<TRACK_ID>"}' http://localhost:3045/track/url
```

- Download an entire playlist server-side (files saved to `downloads/`):

```bash
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://open.spotify.com/playlist/<ID>", "jobId":"job-1234"}' http://localhost:3045/playlist/download-all
# then check downloads/<sanitized-playlist-name>/ for mp3 files
```
## Using the Graphical UI

### Start the API server

```bash
bun run index.ts
```

### Open the UI in your browser (manually)

Open the `index.html` file in your browser or navigate to the UI URL.

**Important:** the server does NOT open the browser automatically — you must open the UI yourself.

### Use the interface

In the UI choose one of the actions:
- Download Track
- Download Playlist
- Search Info

Enter the Spotify URL or ID, then click the corresponding button to start the action. The UI calls the API; the server performs the scraping and downloads.

### Playlist downloads location

Playlist MP3 files are saved on the server under:

```
downloads/<sanitized-playlist-name>/
```

Check that folder on the server for the MP3 files even if the UI progress bar does not list every saved file item-by-item.

### Optional Spotify credentials & progress tracking

Spotify credentials (`CLIENT_ID` / `CLIENT_SECRET`) are optional. If provided, the server will use the Spotify API for richer metadata and ISRC lookup; otherwise it falls back to embed scraping. Downloads still work without credentials.

If you provide a `jobId` for a playlist download, you can receive SSE progress at:

```
GET /playlist/zip/progress/<jobId>
```

**Note:** SSE reports overall job status and counts but may not show every individual file save.

## Tips & troubleshooting

- Run the server in a terminal you can monitor for logs (Puppeteer, grecaptcha, or Spotidown parsing errors appear there).
- If downloads fail, check console output for errors — common causes: grecaptcha not available, Spotidown frontend changed, or Puppeteer/Chromium launch issues.
- If running under Node, use Node 18+ (or Bun) so `fetch` is available; otherwise add a fetch polyfill.
---

## 🎨 Little effects  — README styling & UX

- Added emoji headers and horizontal separators for better scanning.
- Included an image preview placeholder at `assets/preview.png` to give a visual impression of the UI.
- Code blocks and inline badges make important commands stand out.

If you want more visual polish I can add:
- Shields/badges (version, license, bun support)
- A real hero image/banner and smaller screenshots gallery
- A table of endpoints with icons

---
