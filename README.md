# 🚀 Echofy (Frontend) — forked proxy UI

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/535de729-dd88-4b39-a575-ddd8fccf09e4" />

*Echofy* 

> Echofy is the graphical/automation piece (frontend + server-side automation) of a Spotidown-based downloader. This repository is a fork of the original Spotidown project — **this API is a fork**.

⚠️ **Warning:** Echofy automates web scraping and downloads MP3 files. Downloading copyrighted material may be illegal in your jurisdiction. Use responsibly and at your own risk.

---

## ✨ Credits (original authors first)

- Original Spotidown authors / upstream project (the code this repo was forked from)
- spotidown.app — original frontend that this project automates
- spotidown api proxy server - https://github.com/ferrymehdi

Libraries and projects used:
- Bun — https://bun.sh/
- Puppeteer — https://pptr.dev/
- (Optional) spotify-web-api-node — https://github.com/thelinmichael/spotify-web-api-node

---

## 🎯 What Echofy is

Echofy is a Bun/TypeScript-based proxy UI and automation layer that controls a headless Chromium instance (via Puppeteer) to drive the Spotidown frontend and resolve direct MP3 download URLs for Spotify tracks. It provides a small Express API for programmatic access and server-side playlist downloads.

This repository represents the graphical/automation portion (the UI + automation) and not the original upstream project.

---

## 🚀 Quick Start (Docker Hub - Recommended)

### CasaOS

1. Open CasaOS: `http://192.168.2.5:81`
2. **App Store** → **Add Custom App**
3. Copy this YAML:

```yaml
version: '3'
services:
  echofy:
    image: kwayorange/echofy:v0.2
    container_name: echofy
    restart: unless-stopped
    ports:
      - "3045:3045"
    volumes:
      - /DATA/AppData/echofy:/app
      - /DATA/Media/Music:/app/downloads
    environment:
      - NODE_ENV=production
      - PUPPETEER_ARGS=--no-sandbox,--disable-setuid-sandbox
    shm_size: '256mb'
```

4. Click **Install**
5. Open: `http://192.168.2.5:3045`

### Other Systems (Debian, Ubuntu, Linux)

```bash
git clone https://github.com/KawaiiOrange/Echofy.git
cd Echofy
docker-compose up -d
```

Open: **http://localhost:3045**

### Simple Command Line

```bash
docker run -d -p 3045:3045 \
  -v downloads:/app/downloads \
  kwayorange/echofy:latest
```

---

## 🧰 Prerequisites

Choose one:

### Option A: Docker (Easiest - Optional)
- Docker + Docker Compose

### Option B: Local (No Docker)
- Bun (v1.0+) or Node.js (v18+)
- Chromium/Chrome installed

Notes about Spotify integration:
- spotify-web-api-node is optional. Echofy runs without it.
- CLIENT_ID and CLIENT_SECRET are optional: when provided, Echofy will use Spotify's client credentials flow to fetch richer metadata (and enable ISRC lookup). When not provided, Echofy falls back to scraping Spotify embed pages for metadata and still performs downloads via the Spotidown scraping flow.

---

## ▶️ How to run

### 🐳 Option A: With Docker (Recommended - Works Everywhere)

```bash
git clone https://github.com/KawaiiOrange/Echofy.git
cd Echofy
docker-compose up -d
```

Open: **http://localhost:3045**

Downloads saved to: `./downloads/`

**Docker Commands:**
```bash
# View logs
docker-compose logs -f echofy

# Stop
docker-compose down

# Restart
docker-compose restart

# Clean everything
docker system prune -a --volumes -f
```

---

### 💻 Option B: Without Docker (Local)

#### 1. Install dependencies

```bash
git clone https://github.com/KawaiiOrange/Echofy.git
cd Echofy
bun install
```

#### 2. Start the server

```bash
bun run index.ts
```

#### 3. Open in browser

Navigate to: **http://localhost:3045**

---

## 🏠 Multiple Containers (Home + Other Systems)

Want to run Echofy on different machines with Docker? Use this `docker-compose.yml`:

```yaml
version: '3'
services:
  # Home PC
  echofy-home:
    image: kwayorange/echofy:v0.2
    container_name: echofy-home
    restart: unless-stopped
    ports:
      - "3045:3045"
    volumes:
      - /DATA/AppData/echofy:/app
      - /DATA/Media/Music:/app/downloads
    environment:
      - NODE_ENV=production
      - PUPPETEER_ARGS=--no-sandbox,--disable-setuid-sandbox
    shm_size: '256mb'

  # Other system
  echofy-other:
    image: kwayorange/echofy:latest
    container_name: echofy-other
    restart: unless-stopped
    ports:
      - "3046:3045"
    volumes:
      - ./downloads-other:/app/downloads
    environment:
      - NODE_ENV=production
      - PUPPETEER_ARGS=--no-sandbox,--disable-setuid-sandbox
    shm_size: '256mb'
```

**Usage:**
```bash
docker-compose up -d

# Home: http://localhost:3045
# Other: http://localhost:3046
```

---

## 📁 File Structure

```
Echofy/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── index.ts
├── index.html
├── styles.css
├── script.js
├── package.json
├── bun.lockb
├── tsconfig.json
├── .env.example
├── .gitignore
└── downloads/  (created automatically)
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | UI (index.html) |
| GET | `/track/:id` | Download MP3 by track ID |
| POST | `/track/url` | Get metadata from Spotify URL |
| GET | `/track/:id/info` | Get track info (Spotify API or embed) |
| GET | `/isrc/:isrc` | Search by ISRC code |
| GET | `/playlist/:id` | Get playlist tracks |
| POST | `/playlist/download-all` | Download entire playlist |
| GET | `/playlist/zip/progress/:jobId` | SSE progress updates |

> Important: When you download a playlist via `/playlist/download-all`, all MP3 files are saved to the project's `downloads/<sanitized-playlist-name>/` folder on disk. Always check the `downloads/` directory for the saved files.

---

## 🔁 What changed from the original Spotidown (API changes in this fork)

- Project renamed to **Echofy** and reorganized as a Bun/TypeScript frontend + server automation piece.
- Exposed an Express HTTP API to allow programmatic downloads and integrations.
- Added server-side playlist downloading that saves MP3 files to `downloads/<sanitized-playlist-name>/`.
- Added optional Server-Sent Events (SSE) progress reporting for playlist downloads.
- Spotify Web API integration is optional: falls back to scraping Spotify embed pages.
- Implemented ISRC lookup endpoint.
- Improved filename sanitization and duplicate-filename collision handling.
- Periodic refresh of the Spotidown page (every 15 minutes).
- **Docker support** — optional, run with `docker-compose up -d` or without Docker locally.
- **Published on Docker Hub** — `kwayorange/echofy:latest` for easy deployment!

---

## ⚠️ Known issues & limitations

1. **Spotify credentials are optional** — without them metadata and ISRC search may be limited, but downloads still work.
2. **Puppeteer / Chromium launch failures** — install Chromium locally or use Docker.
3. **grecaptcha / reCAPTCHA issues** — if blocked, downloads may fail.
4. **Spotidown / Spotify frontend changes** — scraping logic depends on HTML/JSON structures.
5. **MP3 fetch failures** — resolved URLs may expire or be blocked.
6. **SSE job cleanup** — jobs are removed shortly after completion.

---

## 🛠 Example usage

**Download a single track:**
```bash
curl -L http://localhost:3045/track/<TRACK_ID> -o track.mp3
```

**Get track metadata:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"url":"https://open.spotify.com/track/<TRACK_ID>"}' \
  http://localhost:3045/track/url
```

**Download entire playlist:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"url":"https://open.spotify.com/playlist/<ID>", "jobId":"job-1234"}' \
  http://localhost:3045/playlist/download-all
```

---

## 🎨 Using the Graphical UI

### Start the server

**With Docker:**
```bash
docker-compose up -d
```

**Without Docker:**
```bash
bun run index.ts
```

### Open in your browser

Navigate to: http://localhost:3045

**Important:** the server does NOT open the browser automatically.

### Download Music

1. Choose action: **Download Track** or **Download Playlist**
2. Paste Spotify URL or track ID
3. Click button to start download

### Playlist downloads location

Playlist MP3 files are saved to:
```
downloads/<sanitized-playlist-name>/
```

### Optional Spotify credentials

Add to `.env`:
```
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
```

If not provided, Echofy falls back to embed scraping.

---

## 🔧 Troubleshooting

- **Downloads failing?** Check server logs for errors (grecaptcha, Spotidown changes, etc)
- **Chromium not found?** Install it: `sudo apt-get install chromium` (Linux) or use Docker
- **Docker issues?** Make sure Docker daemon is running
- **reCAPTCHA blocked?** Try restarting the server
- **Using Node?** Requires Node 18+ (Bun recommended)

---

## 🎨 Tech Stack

- **Backend**: TypeScript + Express + Bun
- **Frontend**: HTML + CSS + Vanilla JS + GSAP
- **Automation**: Puppeteer + Spotidown
- **Containerization**: Docker + Docker Compose (Optional)
- **Docker Registry**: Docker Hub (`kwayorange/echofy:latest`)

---

## 📝 License

MIT

---

**Made with ❤️ for music lovers**
