const video = document.getElementById("bgVideo");

// réglages
const maxShiftPx = 220;    // combien ça descend au max
const maxZoom = 5;      // zoom max
const scrollRange = 2000;   // sur combien de px de scroll l'effet se fait

let latestY = 0;
let ticking = false;

function apply() {
  // progression 0 → 1
  const p = Math.min(1, latestY / scrollRange);
  const button = document.querySelector(".home-btn");

  if (button) {
    if (p > 0.15) {
      button.style.opacity = 1;
      button.style.pointerEvents = "auto";
    } else {
      button.style.opacity = 0;
      button.style.pointerEvents = "none";
    }
  }



  const shift = p * maxShiftPx;              // descend
  const zoom = 1 + p * (maxZoom - 1);        // zoom

  video.style.transform = `translate3d(0, ${shift}px, 0) scale(${zoom})`;
  ticking = false;
}

window.addEventListener("scroll", () => {
  latestY = window.scrollY || 0;
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(apply);
  }
});

// au chargement
apply();

