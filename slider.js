const strip = document.getElementById("strip");

/**
 * Sur trackpad / molette:
 * - wheel vers le bas -> scroll vers la droite
 * - wheel vers le haut -> scroll vers la gauche
 */
strip.addEventListener(
  "wheel",
  (e) => {
    // Si l'utilisateur scroll déjà horizontalement (shift / trackpad), on laisse faire
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    e.preventDefault();
    strip.scrollLeft += e.deltaY;
  },
  { passive: false }
);