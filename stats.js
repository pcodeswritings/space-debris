document.addEventListener("DOMContentLoaded", () => {
  const numbers = document.querySelectorAll(".number");

  function animateNumber(el) {
    if (el.dataset.done === "1") return; // évite de relancer
    el.dataset.done = "1";

    const target = Number(el.dataset.target);
    let current = 0;

    const duration = 1200; // ms
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      current = Math.floor(target * progress);
      el.textContent = current;

      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          observer.unobserve(entry.target); // une seule fois
        }
      });
    },
    {
      threshold: 0.35, // lance quand ~35% visible
    }
  );

  numbers.forEach((el) => {
    el.textContent = "0"; // reset au chargement
    observer.observe(el);
  });
});
