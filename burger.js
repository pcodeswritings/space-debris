/* burger.js — hamburger menu pour mobile
   À inclure dans toutes les pages HTML via <script src="burger.js"></script>
   Ne fait rien sur desktop (>480px) */

(function () {
  function initBurger() {
    // Seulement sur mobile
    if (window.innerWidth > 480) return;

    const ul = document.querySelector("ul");
    if (!ul || document.querySelector(".burger-btn")) return;

    // Créer le bouton burger
    const btn = document.createElement("button");
    btn.className = "burger-btn";
    btn.setAttribute("aria-label", "Menu");
    btn.innerHTML = "☰";
    btn.setAttribute("aria-expanded", "false");

    // Insérer le bouton avant le <ul>
    ul.parentNode.insertBefore(btn, ul);

    // Toggle menu
    btn.addEventListener("click", function () {
      const open = ul.classList.toggle("nav-open");
      btn.innerHTML = open ? "✕" : "☰";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Fermer le menu quand on clique sur un lien
    ul.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        ul.classList.remove("nav-open");
        btn.innerHTML = "☰";
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBurger);
  } else {
    initBurger();
  }
})();
