const video = document.getElementById("bgVideo");

// Sur mobile : pas d'effet de scroll/zoom, juste la vidéo fixe
if (window.innerWidth <= 480) {
  // reset tout transform
  if (video) video.style.transform = "none";
  // pas de listener scroll
} else {
  // desktop : comportement original
  const maxShiftPx = 220;
  const maxZoom = 5;
  const scrollRange = 2000;

  let latestY = 0;
  let ticking = false;

  function apply() {
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

    const shift = p * maxShiftPx;
    const zoom = 1 + p * (maxZoom - 1);
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

  apply();
}
