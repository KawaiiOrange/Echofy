# Downtify (frontend) — forked proxy UI

![Downtify Preview](assets/preview.png)

> Downtify is the graphical/automation piece (frontend + server-side automation) of a Spotidown-based downloader. This repository is a fork of the original Spotidown API/UI and **this API is a fork** — see Credits and "Changes from the original".

WARNING: This project automates web scraping and downloads MP3 files. Downloading copyrighted material may be illegal in your jurisdiction. Use responsibly and at your own risk.

---

## Credits (original authors first)

- Original Spotidown authors / upstream project (the code this repo was forked from)
- spotidown.app — original frontend that this project automates

Libraries and projects used:
- Bun — https://bun.sh/
- Puppeteer — https://pptr.dev/
- (Optional) spotify-web-api-node — https://github.com/thelinmichael/spotify-web-api-node

If you want explicit credit lines for named contributors from the original repo, provide their names or a link and I can add them here.

---

## What Downtify is

Downtify is a Bun/TypeScript-based proxy UI and automation layer that controls a headless Chromium instance (via Puppeteer) to drive the Spotidown frontend and resolve direct MP3 download URLs for Spotify tracks. It provides a small Express API for programmatic access and server-side playlist downloads.

This repository represents the graphical/automation portion (the UI + automation) and not the original upstream project.

---

## Prerequisites

These are required to run Downtify:

- Bun (v1.0+) — recommended runtime (runs TypeScript directly and has built-in fetch)
- Node.js (v18+) — required only if running under Node instead of Bun, and for Puppeteer compatibility
- Puppeteer — headless Chromium automation used to interact with spotidown.app

Notes about spotify-web-api-node and credentials:
- spotify-web-api-node is optional. This fork can run without it.
- CLIENT_ID and CLIENT_SECRET are optional: when provided, Downtify will use Spotify's client credentials flow to fetch richer metadata (and enable ISRC lookup). When not provided, Downtify falls back to scraping Spotify embed pages for metadata and still performs downloads via the Spotidown scraping flow.

---

## Quick overview of endpoints

- GET / -> status and endpoints listing
- GET /track/:id -> returns MP3 (attachment) for Spotify track id
- POST /track/url -> body: { url } -> returns metadata + download endpoint
- GET /track/:id/info -> track metadata (Spotify API preferred, embed fallback)
- GET /isrc/:isrc -> search Spotify by ISRC and return download (requires Spotify credentials for best results; otherwise may be limited)
- GET /playlist/:id -> playlist metadata + list of tracks
- POST /playlist/download-all -> body: { url, jobId? } -> downloads tracks to `downloads/<playlist>/` on the server
- GET /playlist/zip/progress/:jobId -> SSE progress updates for playlist jobs

Important: Playlist downloads are saved to the repository's `downloads/` folder (e.g. `downloads/<sanitized-playlist-name>/`). The files are written to disk even if an individual client progress bar does not show every saved file — check the `downloads/` directory on the server for saved tracks.

---

## What changed from the original Spotidown (API changes in this fork)

- Project renamed to "Downtify" and reorganized as a Bun/TypeScript frontend + server automation piece.
- Exposed an Express HTTP API for programmatic use (endpoints listed above).
- Added server-side playlist downloading: when you POST to `/playlist/download-all`, tracks are saved to `downloads/<sanitized-playlist-name>/` on disk.
- Added Server-Sent Events (SSE) for progress reporting when a `jobId` is provided; note that not all file saves may be reflected item-by-item in a client UI — the server still writes every downloaded MP3 to disk.
- Made Spotify API integration optional: the server uses Spotify Web API if CLIENT_ID/CLIENT_SECRET are supplied, otherwise it falls back to scraping the Spotify embed pages for metadata. spotify-web-api-node is optional and not required to download tracks.
- Improved filename sanitization and duplicate filename handling for playlists.
- Periodic refresh of the Spotidown page (every 5 minutes) to try to keep the Puppeteer session alive.
- Kept some logging and user-facing messages in Portuguese from the original fork; these can be standardized on request.

---

## Current known issues and limitations

1. Spotify credentials missing or invalid
   - CLIENT_ID/CLIENT_SECRET are optional. If you don't provide them, metadata and ISRC search may be limited; downloads still work via Spotidown scraping.

2. Puppeteer / Chromium launch failures
   - Puppeteer may fail to launch if Chromium is missing, permissions are restricted, or sandbox flags are required. Provide `executablePath` or run with `--no-sandbox` in some environments.

3. grecaptcha / reCAPTCHA issues
   - The flow depends on grecaptcha being available on the Spotidown page. If grecaptcha changes or is blocked, download resolution can fail.

4. Spotidown or Spotify frontend changes
   - Scraping relies on the current HTML/JSON structure of Spotidown and Spotify embed pages. Upstream frontend changes can break parsing and require code updates.

5. MP3 fetch failures
   - Resolved MP3 URLs may expire or be blocked by the remote host, causing fetch errors.

6. Hard-coded port & language mixing
   - Server listens on port 3045 by default and some log/error messages are in Portuguese. Consider making the port configurable and standardizing messages.

7. SSE job cleanup
   - Jobs are removed shortly after completion; clients reconnecting late may not find job state.

8. package.json convenience
   - Add a `start` script and provide compiled JS for Node-based deployments if needed.

---

## Installation & running

1. Install dependencies (Bun recommended):

```bash
bun install
```

2. Create `.env` if you want to use Spotify API features (optional):

```bash
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
```

3. Run with Bun:

```bash
bun index.ts
```

Or run with Node (Node 18+, compile TypeScript first or run with a runner):

```bash
# after compiling to JS
node dist/index.js
```

---

## Example usage

- Download a track: `curl -L http://localhost:3045/track/<TRACK_ID> -o track.mp3`
- Get metadata from a track URL: `POST /track/url` with JSON `{ "url": "https://open.spotify.com/track/<TRACK_ID>" }`
- Download whole playlist server-side: `POST /playlist/download-all` with `{ "url": "https://open.spotify.com/playlist/<ID>", "jobId":"job-1234" }` — files will appear in `downloads/<playlist>/`.

---

## Make it prettier / contribution

If you want I can:
- Standardize all messages to English
- Add a configurable PORT environment variable
- Add a `scripts.start` to package.json
- Add the actual screenshot image file into `assets/preview.png` (you provided an image in chat). If you want me to upload that image into the repo, confirm and I will add it at `assets/preview.png` and keep the README image reference as shown above.

If you confirm, I will commit the changes (or push into a new branch if you prefer).