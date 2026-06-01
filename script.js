// Sur mobile: rien du tout, le CSS gère la vidéo
if (window.innerWidth > 480) {
  const video = document.getElementById("bgVideo");
  if (!video);

  const maxShiftPx = 220;
  const maxZoom = 5;
  const scrollRange = 2000;

  let latestY = 0;
  let ticking = false;

  function apply() {
    const p = Math.min(1, latestY / scrollRange);
    const button = document.querySelector(".home-btn");
    if (button) {
      button.style.opacity = p > 0.15 ? 1 : 0;
      button.style.pointerEvents = p > 0.15 ? "auto" : "none";
    }
    const shift = p * maxShiftPx;
    const zoom = 1 + p * (maxZoom - 1);
    video.style.transform = `translate3d(0, ${shift}px, 0) scale(${zoom})`;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    latestY = window.scrollY || 0;
    if (!ticking) { ticking = true; requestAnimationFrame(apply); }
  });

  apply();
  window.addEventListener("scroll", () => {
    latestY = window.scrollY || 0;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(apply);
    }
  });

  apply();
}
