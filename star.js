(() => {
  // Évite de relancer si déjà sur game.html
  if (location.pathname.toLowerCase().includes("game.html")) return;

  // Délai aléatoire entre 10s et 20s
  const delayMs = (10 + Math.random() * 10) * 1000;

  // Injecte le CSS neon/glow une seule fois
  if (!document.getElementById("shooting-star-style")) {
    const style = document.createElement("style");
    style.id = "shooting-star-style";
    style.textContent = `
      .shooting-star-wrap{
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 999999;
      }

      .shooting-star{
        position: absolute;
        width: 220px;
        height: 6px;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(255,255,255,0), rgba(120,240,255,1), rgba(255,255,255,1));
        filter: drop-shadow(0 0 10px rgba(120,240,255,.9)) drop-shadow(0 0 22px rgba(255,80,200,.25));
        opacity: 0;
        transform-origin: left center;
      }

      .shooting-star::after{
        content:"";
        position:absolute;
        right:-10px;
        top:50%;
        width: 14px;
        height: 14px;
        transform: translateY(-50%);
        border-radius: 50%;
        background: rgba(255,255,255,.95);
        box-shadow: 0 0 14px rgba(120,240,255,.9), 0 0 30px rgba(120,240,255,.55);
      }

      /* Zone cliquable */
      .shooting-star-hit{
        position:absolute;
        inset:-28px; /* grossit la zone tactile */
        border-radius: 999px;
        pointer-events: auto;
        cursor: pointer;
        background: rgba(0,0,0,0);
      }

      @keyframes starFly {
        0%   { opacity: 0; transform: translate3d(var(--x0), var(--y0), 0) rotate(var(--rot)) scale(0.9); }
        8%   { opacity: 1; }
        92%  { opacity: 1; }
        100% { opacity: 0; transform: translate3d(var(--x1), var(--y1), 0) rotate(var(--rot)) scale(1.05); }
      }
    `;
    document.head.appendChild(style);
  }

  function spawnStar() {
    const wrap = document.createElement("div");
    wrap.className = "shooting-star-wrap";

    const star = document.createElement("div");
    star.className = "shooting-star";

    // Trajectoire random (départ hors écran -> fin hors écran)
    const w = window.innerWidth;
    const h = window.innerHeight;

    const fromLeft = Math.random() < 0.5;
    const y0 = Math.random() * (h * 0.7) + h * 0.05; // évite bas complet
    const y1 = y0 + (Math.random() * 0.35 + 0.15) * h;

    const x0 = fromLeft ? -260 : w + 260;
    const x1 = fromLeft ? w + 260 : -260;

    const rot = fromLeft ? (12 + Math.random() * 18) : (180 - (12 + Math.random() * 18));

    star.style.setProperty("--x0", `${x0}px`);
    star.style.setProperty("--y0", `${y0}px`);
    star.style.setProperty("--x1", `${x1}px`);
    star.style.setProperty("--y1", `${y1}px`);
    star.style.setProperty("--rot", `${rot}deg`);

    // Durée ~7s (un peu random)
    const dur = 6.5 + Math.random() * 1.2;
    star.style.animation = `starFly ${dur}s ease-in-out forwards`;

    // hitbox tactile/click
    const hit = document.createElement("div");
    hit.className = "shooting-star-hit";

    // Au clic → ouvre le jeu (avec autoplay vidéo)
    const goGame = (e) => {
      e.preventDefault();
      e.stopPropagation();
      // optionnel: mémoriser d'où tu viens
      sessionStorage.setItem("tm_return_url", location.href);
      location.href = "game.html?autoplay=1";
    };

    hit.addEventListener("pointerdown", goGame, { passive: false });

    star.appendChild(hit);
    wrap.appendChild(star);
    document.body.appendChild(wrap);

    // Nettoyage après animation
    setTimeout(() => {
      wrap.remove();
    }, (dur + 0.3) * 1000);
  }

  // Lance une seule étoile filante par chargement
  setTimeout(spawnStar, delayMs);
})();
