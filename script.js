const API_URL = 'http://localhost:3045';

const PROJECTS_DATA = [
  { id: 1, artist: "TURBOSPOT", album: "DOWNLOAD TRACK", category: "FEATURE", label: "MUSIC DOWNLOADER", year: "2024", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000" },
  { id: 2, artist: "TURBOSPOT", album: "DOWNLOAD PLAYLIST", category: "FEATURE", label: "MUSIC DOWNLOADER", year: "2024", image: "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1000" },
  { id: 3, artist: "TURBOSPOT", album: "SEARCH INFO", category: "FEATURE", label: "MUSIC DOWNLOADER", year: "2024", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1000" }
];

// Album art pool for random backgrounds
const ALBUM_ARTS = [
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000",
  "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1000",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1000",
  "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1000",
  "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=1000",
  "https://images.unsplash.com/photo-1501612780327-45045538702b?w=1000",
  "https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?w=1000",
  "https://images.unsplash.com/photo-1487537023671-8dce1a785863?w=1000",
  "https://images.unsplash.com/photo-1526218626217-dc65a29bb444?w=1000",
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1000",
  "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1000",
  "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=1000",
  "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1000",
  "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=1000",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1000",
  "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1000",
  "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1000",
  "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=1000",
  "https://images.unsplash.com/photo-1521406616074-efb8f0f9b803?w=1000",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1000"
];

let activeIndex = -1;
let bgRotateInterval = null;
let currentBgIndex = 0;

const backgroundRef = document.getElementById('backgroundImage');
const containerRef = document.getElementById('portfolioContainer');
const projectListRef = document.getElementById('projectList');

// Preload images silently
function preloadImages(urls) {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}
preloadImages(ALBUM_ARTS);

// Random background rotation when no item is hovered
function startBgRotation() {
  if (bgRotateInterval) return;
  bgRotateInterval = setInterval(() => {
    if (activeIndex !== -1) return;
    currentBgIndex = (currentBgIndex + 1) % ALBUM_ARTS.length;
    const nextImg = ALBUM_ARTS[currentBgIndex];
    gsap.set(backgroundRef, { backgroundImage: `url(${nextImg})` });
    gsap.to(backgroundRef, { opacity: 0.35, duration: 0.8, ease: "power2.inOut" });
  }, 3000);
}

function stopBgRotation() {
  if (bgRotateInterval) {
    clearInterval(bgRotateInterval);
    bgRotateInterval = null;
  }
}

// Init random background
currentBgIndex = Math.floor(Math.random() * ALBUM_ARTS.length);
gsap.set(backgroundRef, {
  backgroundImage: `url(${ALBUM_ARTS[currentBgIndex]})`,
  opacity: 0.2
});
startBgRotation();

// Render project items
PROJECTS_DATA.forEach((project, index) => {
  const li = document.createElement('li');
  li.className = 'project-item';
  li.innerHTML = `
    <span class="project-data artist">${project.artist}</span>
    <span class="project-data album">${project.album}</span>
    <span class="project-data category">${project.category}</span>
  `;

  li.addEventListener('mouseenter', () => {
    activeIndex = index;
    stopBgRotation();
    li.classList.add('active');

    gsap.killTweensOf(backgroundRef);
    gsap.set(backgroundRef, { backgroundImage: `url(${project.image})` });
    gsap.to(backgroundRef, { opacity: 1, duration: 0.6, ease: "power2.inOut" });
    gsap.to(backgroundRef, { transform: 'translate(-50%, -50%) scale(1)', duration: 0.8, ease: "power2.inOut" }, 0);
  });

  li.addEventListener('mouseleave', () => {
    activeIndex = -1;
    li.classList.remove('active');
    startBgRotation();
  });

  li.addEventListener('click', () => {
    if (index === 0) openModal('modalMusic');
    else if (index === 1) openModal('modalPlaylist');
    else if (index === 2) openModal('modalSearch');
  });

  projectListRef.appendChild(li);
});

containerRef.addEventListener('mouseleave', () => {
  activeIndex = -1;
  gsap.to(backgroundRef, { opacity: 0.2, duration: 0.4, ease: "power2.inOut" });
  startBgRotation();
});

// Modal management - stable, no flicker
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  document.querySelectorAll('.modal').forEach(m => {
    if (m.id !== id) closeModal(m.id);
  });
  modal.style.display = 'flex';
  gsap.fromTo(modal,
    { opacity: 0 },
    { opacity: 1, duration: 0.25, ease: "power2.out" }
  );
  gsap.fromTo(modal.querySelector('.modal-content'),
    { y: 30, scale: 0.97 },
    { y: 0, scale: 1, duration: 0.3, ease: "power3.out" }
  );
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal || modal.style.display === 'none') return;
  gsap.to(modal, {
    opacity: 0, duration: 0.2, ease: "power2.in",
    onComplete: () => { modal.style.display = 'none'; }
  });
}

document.querySelectorAll('.close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal');
    closeModal(modal.id);
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal.id);
  });
});

// Clock
setInterval(() => {
  const now = new Date();
  document.getElementById('currentTime').textContent = now.toLocaleTimeString('pt-PT');
}, 1000);

// ─── Music Player ────────────────────────────────────────────────
const player = {
  audio: new Audio(),
  isPlaying: false,
  currentTrack: null,
  progress: 0,
  isDragging: false,

  load(trackData) {
    this.currentTrack = trackData;
    this.audio.src = trackData.src || '';
    this.updateUI();
    this.show();
  },

  togglePlay() {
    if (!this.currentTrack) return;
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play().catch(() => {});
      this.isPlaying = true;
    }
    this.updatePlayBtn();
  },

  updatePlayBtn() {
    const btn = document.getElementById('playerPlayBtn');
    if (!btn) return;
    btn.innerHTML = this.isPlaying
      ? `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
  },

  updateUI() {
    if (!this.currentTrack) return;
    const el = id => document.getElementById(id);
    if (el('playerTitle')) el('playerTitle').textContent = this.currentTrack.name || 'Unknown Track';
    if (el('playerArtist')) el('playerArtist').textContent = this.currentTrack.artist || 'Unknown Artist';
    if (el('playerCover')) {
      el('playerCover').style.backgroundImage = `url(${this.currentTrack.image || ALBUM_ARTS[0]})`;
    }
  },

  show() {
    const p = document.getElementById('musicPlayer');
    if (!p) return;
    p.classList.add('visible');
    gsap.fromTo(p,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  },

  hide() {
    const p = document.getElementById('musicPlayer');
    if (!p) return;
    gsap.to(p, {
      x: 120, opacity: 0, duration: 0.4, ease: "power3.in",
      onComplete: () => p.classList.remove('visible')
    });
  },

  formatTime(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }
};

// Audio events
player.audio.addEventListener('timeupdate', () => {
  if (player.isDragging) return;
  const pct = player.audio.duration ? (player.audio.currentTime / player.audio.duration) * 100 : 0;
  const bar = document.getElementById('playerProgressFill');
  const thumb = document.getElementById('playerThumb');
  const cur = document.getElementById('playerCurrentTime');
  if (bar) bar.style.width = pct + '%';
  if (thumb) thumb.style.left = pct + '%';
  if (cur) cur.textContent = player.formatTime(player.audio.currentTime);
});

player.audio.addEventListener('loadedmetadata', () => {
  const dur = document.getElementById('playerDuration');
  if (dur) dur.textContent = player.formatTime(player.audio.duration);
});

player.audio.addEventListener('ended', () => {
  player.isPlaying = false;
  player.updatePlayBtn();
  const bar = document.getElementById('playerProgressFill');
  const thumb = document.getElementById('playerThumb');
  if (bar) bar.style.width = '0%';
  if (thumb) thumb.style.left = '0%';
});

// Progress bar drag
function initProgressDrag() {
  const track = document.getElementById('playerProgressTrack');
  if (!track) return;

  const seek = (e) => {
    const rect = track.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const bar = document.getElementById('playerProgressFill');
    const thumb = document.getElementById('playerThumb');
    if (bar) bar.style.width = (pct * 100) + '%';
    if (thumb) thumb.style.left = (pct * 100) + '%';
    if (player.audio.duration) {
      player.audio.currentTime = pct * player.audio.duration;
    }
  };

  track.addEventListener('mousedown', (e) => {
    player.isDragging = true;
    seek(e);
    const up = () => { player.isDragging = false; window.removeEventListener('mouseup', up); window.removeEventListener('mousemove', seek); };
    window.addEventListener('mousemove', seek);
    window.addEventListener('mouseup', up);
  });

  track.addEventListener('touchstart', (e) => {
    player.isDragging = true;
    seek(e);
    const end = () => { player.isDragging = false; window.removeEventListener('touchend', end); window.removeEventListener('touchmove', seek); };
    window.addEventListener('touchmove', seek);
    window.addEventListener('touchend', end);
  });
}

// Volume control
function initVolume() {
  const vol = document.getElementById('playerVolume');
  if (vol) {
    vol.addEventListener('input', () => {
      player.audio.volume = vol.value / 100;
      const icon = document.getElementById('playerVolumeIcon');
      if (icon) {
        if (vol.value == 0) icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
        else icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initProgressDrag();
  initVolume();

  const closeBtn = document.getElementById('playerClose');
  if (closeBtn) closeBtn.addEventListener('click', () => player.hide());

  const playBtn = document.getElementById('playerPlayBtn');
  if (playBtn) playBtn.addEventListener('click', () => player.togglePlay());

  // Vinyl record spin animation
  const vinyl = document.getElementById('playerCover');
  if (vinyl) {
    let rotation = 0;
    let raf;
    const spin = () => {
      if (player.isPlaying) {
        rotation += 0.3;
        vinyl.style.transform = `rotate(${rotation}deg)`;
      }
      raf = requestAnimationFrame(spin);
    };
    raf = requestAnimationFrame(spin);
  }
});

// ─── TurboSpot API Functions ─────────────────────────────────────
async function searchTrack() {
  const trackLink = document.getElementById('trackLink').value.trim();
  if (!trackLink) return alert('Cole um link');

  const preview = document.getElementById('musicPreview');
  const btn = document.querySelector('#modalMusic button');

  try {
    preview.style.opacity = '0.5';
    if (btn) { btn.disabled = true; btn.textContent = 'A pesquisar...'; }

    const trackId = trackLink.includes('spotify.com')
      ? trackLink.match(/track\/([a-zA-Z0-9]+)/)[1]
      : trackLink;

    const res = await fetch(`${API_URL}/track/${trackId}/info`);
    const data = await res.json();

    preview.innerHTML = `
      <div class="track-preview-inner">
        <img src="${data.image}" style="width:100%;border-radius:8px;margin-bottom:12px;">
        <p class="track-name">${data.name}</p>
        <p class="track-artist">${data.artist}</p>
        <div class="preview-actions">
          <button class="btn-primary" onclick="window.location.href='${API_URL}/track/${trackId}'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Descarregar
          </button>
          <button class="btn-secondary" onclick="previewInPlayer('${data.name}','${data.artist}','${data.image}','')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polygon points="5,3 19,12 5,21"/></svg>
            Ouvir
          </button>
        </div>
      </div>
    `;
    preview.style.opacity = '1';
  } catch (err) {
    preview.style.opacity = '1';
    preview.innerHTML = `<p class="error-msg">Erro: ${err.message}</p>`;
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Pesquisar'; }
  }
}

function previewInPlayer(name, artist, image, src) {
  player.load({ name, artist, image, src });
  player.updatePlayBtn();
}

async function searchPlaylist() {
  const playlistLink = document.getElementById('playlistLink').value.trim();
  if (!playlistLink) return alert('Cole um link');

  const tracksDiv = document.getElementById('playlistTracks');
  const btn = document.querySelector('#modalPlaylist .btn-see');

  try {
    tracksDiv.style.opacity = '0.5';
    if (btn) { btn.disabled = true; btn.textContent = 'A carregar...'; }

    const playlistId = playlistLink.match(/playlist\/([a-zA-Z0-9]+)/)[1];
    const res = await fetch(`${API_URL}/playlist/${playlistId}`);
    const data = await res.json();

    tracksDiv.innerHTML = data.tracks
      .map((t, i) => `
        <div class="track-row">
          <span class="track-num">${i + 1}</span>
          <span class="track-info"><strong>${t.name}</strong> — ${t.artist}</span>
        </div>
      `).join('');

    tracksDiv.style.opacity = '1';
  } catch (err) {
    tracksDiv.style.opacity = '1';
    tracksDiv.innerHTML = `<p class="error-msg">Erro: ${err.message}</p>`;
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Ver conteúdo'; }
  }
}

async function downloadPlaylist() {
  const playlistLink = document.getElementById('playlistLink').value.trim();
  if (!playlistLink) return alert('Cole um link');

  const btn = document.querySelector('#modalPlaylist .btn-download');
  if (!btn) return;

  // Stable state change — no flicker
  btn.disabled = true;
  btn.classList.add('loading');
  const originalText = btn.innerHTML;
  btn.innerHTML = `<span class="spinner"></span> A descarregar...`;

  try {
    const res = await fetch(`${API_URL}/playlist/download-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: playlistLink })
    });
    const data = await res.json();

    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg> Descarregado!`;
    btn.classList.remove('loading');
    btn.classList.add('success');

    alert(`${data.downloaded}/${data.total} guardadas em downloads/${data.playlistName}/`);

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.classList.remove('success');
    }, 3000);
  } catch (err) {
    btn.innerHTML = originalText;
    btn.disabled = false;
    btn.classList.remove('loading');
    alert('Erro: ' + err.message);
  }
}