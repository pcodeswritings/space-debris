const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endScreen = document.getElementById("endScreen");
const finalScoreEl = document.getElementById("finalScore");

const replayBtn = document.getElementById("replayBtn");
const backBtn = document.getElementById("backBtn");
const exitBtn = document.getElementById("exitBtn");

const videoGate = document.getElementById("videoGate");
const introVideo = document.getElementById("introVideo");
introVideo.playbackRate = 2.0;
const skipBtn = document.getElementById("skipBtn");
const videoHint = document.getElementById("videoHint");

const instructionsGate = document.getElementById("instructionsGate");
const startBtn = document.getElementById("startBtn");
const backFromInstructionsBtn = document.getElementById("backFromInstructionsBtn");

const bgMusic = document.getElementById("bgMusic");
const hudSub = document.getElementById("hudSub");

/* ----------------- REGLAGES TEMPS ----------------- */
/* Compteur: 1m08 -> 0 */
const GAME_TOTAL_SECONDS = 68;

// paliers: pas plus rapide, juste plus de débris
const MORE_DEBRIS_1_AT = 33;
const MORE_DEBRIS_2_AT = 55;

hudSub.textContent = `1:08. Petits: +30 / Grands: +5`;
timeEl.textContent = `${GAME_TOTAL_SECONDS.toFixed(1)}`;

/* ----------------- CANVAS ----------------- */
let DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
function resize() {
  DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = Math.floor(window.innerWidth * DPR);
  canvas.height = Math.floor(window.innerHeight * DPR);
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener("resize", resize);
resize();

function rand(min, max){ return min + Math.random() * (max - min); }

/* ----------------- JEU ----------------- */
let score = 0;
let debris = [];
let running = false;
let timeLeft = GAME_TOTAL_SECONDS;
let elapsed = 0;
let lastT = 0;

function spawnDebris() {
  const big = Math.random() < 0.18;
  const r = big ? rand(18, 30) : rand(7, 12);

  // vitesse inchangée (tu voulais juste + de débris)
  const v = big ? rand(120, 190) : rand(190, 320);

  debris.push({
    x: rand(40, window.innerWidth - 40),
    y: -40,
    r,
    v,
    big
  });
}

function drawBackgroundFX() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = 0; i < 24; i++) {
    const x = (i * 97) % window.innerWidth;
    const y = (i * 173) % window.innerHeight;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(x, y, 1, 1);
  }
}

function drawDebris(d) {
  ctx.beginPath();
  ctx.arc(d.x, d.y, d.r + 10, 0, Math.PI * 2);
  ctx.fillStyle = d.big ? "rgba(255,80,200,0.08)" : "rgba(120,240,255,0.08)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
  ctx.fillStyle = d.big ? "rgba(255,80,200,0.65)" : "rgba(120,240,255,0.65)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(d.x - d.r * 0.3, d.y - d.r * 0.3, d.r * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fill();
}

function hitTest(px, py, d) {
  const dx = px - d.x;
  const dy = py - d.y;
  return (dx*dx + dy*dy) <= d.r*d.r;
}

function update(dt) {
  elapsed = GAME_TOTAL_SECONDS - timeLeft;

  // Spawn rate (nombre de débris) augmente à 33s puis 55s
  // Tu peux ajuster ces chiffres si tu veux encore + dense.
  let spawnRate = rand(1.2, 2.2);      // base
  if (elapsed >= MORE_DEBRIS_1_AT) spawnRate = rand(4.0, 6.0);
  if (elapsed >= MORE_DEBRIS_2_AT) spawnRate = rand(9.0, 13.0);

  if (Math.random() < dt * spawnRate) spawnDebris();

  debris.forEach(d => d.y += d.v * dt);
  debris = debris.filter(d => d.y < window.innerHeight + 80);

  timeLeft -= dt;

  // fin à 0
  if (timeLeft <= 0) {
    timeLeft = 0;
    endGame();
  }
}

function render() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  drawBackgroundFX();
  for (const d of debris) drawDebris(d);
}

function loop(t) {
  if (!running) return;
  if (!lastT) lastT = t;

  const dt = Math.min(0.033, (t - lastT) / 1000);
  lastT = t;

  update(dt);
  render();

  timeEl.textContent = timeLeft.toFixed(1);
  scoreEl.textContent = score;

  requestAnimationFrame(loop);
}

function startGame() {
  score = 0;
  debris = [];
  timeLeft = GAME_TOTAL_SECONDS;
  elapsed = 0;
  lastT = 0;
  running = true;
  endScreen.classList.add("hidden");
  requestAnimationFrame(loop);
}

function endGame() {
  running = false;
  finalScoreEl.textContent = score;
  endScreen.classList.remove("hidden");

  // stop musique si tu veux
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

function pointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: (e.clientX - rect.left), y: (e.clientY - rect.top) };
}

canvas.addEventListener("pointerdown", (e) => {
  if (!running) return;
  const { x, y } = pointerPos(e);

  for (let i = debris.length - 1; i >= 0; i--) {
    const d = debris[i];
    if (hitTest(x, y, d)) {
      score += d.big ? 5 : 30;
      debris.splice(i, 1);
      break;
    }
  }
}, { passive: true });

replayBtn.addEventListener("click", () => {
  endScreen.classList.add("hidden");
  // relance musique après clic (gesture)
  bgMusic.currentTime = 0;
  bgMusic.play().catch(()=>{});
  startGame();
});

exitBtn.addEventListener("click", () => {
  const ret = sessionStorage.getItem("tm_return_url");
  location.href = ret || "home.html";
});

backBtn.addEventListener("click", () => {
  const ret = sessionStorage.getItem("tm_return_url");
  location.href = ret || "home.html";
});

backFromInstructionsBtn.addEventListener("click", () => {
  const ret = sessionStorage.getItem("tm_return_url");
  location.href = ret || "home.html";
});

/* ----------------- VIDEO -> INSTRUCTIONS -> GAME ----------------- */

async function tryPlayVideo() {
  try {
    await introVideo.play();
    videoHint.textContent = "Lecture… (tap pour unmute)";
  } catch {
    videoHint.textContent = "Tap/click sur la vidéo pour lancer";
  }
}

function openInstructions() {
  videoGate.classList.add("hidden");
  instructionsGate.classList.remove("hidden");
}

function goFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen().catch(()=>{});
}

skipBtn.addEventListener("click", () => {
  introVideo.pause();
  openInstructions();
});

introVideo.addEventListener("click", async () => {
  if (introVideo.paused) {
    goFullscreen();
    await tryPlayVideo();
  } else {
    introVideo.muted = !introVideo.muted;
    videoHint.textContent = introVideo.muted ? "Muted" : "Son activé";
  }
});

introVideo.addEventListener("ended", () => {
  openInstructions();
});

startBtn.addEventListener("click", () => {
  instructionsGate.classList.add("hidden");

  // plein écran (souvent mieux ici, car interaction)
  goFullscreen();

  // musique
  bgMusic.currentTime = 0;
  bgMusic.play().catch(()=>{});

  // start
  startGame();
});

// autoplay si arrivé via étoile filante
const params = new URLSearchParams(location.search);
if (params.get("autoplay") === "1") {
  tryPlayVideo();
} else {
  videoHint.textContent = "Tap/click pour lancer";
}
