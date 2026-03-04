document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("sxSlider");
  const track = document.getElementById("sxTrack");
  const halo = document.getElementById("sxHalo");
  const dotsWrap = document.getElementById("sxDots");

  if (!slider || !track) return;

  const slides = Array.from(track.querySelectorAll(".sx-slide"));
  const prevBtn = slider.querySelector(".sx-prev");
  const nextBtn = slider.querySelector(".sx-next");

  let index = 0;

  // Dots
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "sx-dot" + (i === 0 ? " is-active" : "");
    b.setAttribute("aria-label", `Aller au slide ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function setHalo(i){
    const c = slides[i].dataset.halo || "rgba(74,163,255,0.35)";
    halo.style.background = `radial-gradient(520px 420px at 55% 35%, ${c}, transparent 60%)`;
  }

  function slideWidth(){
    // largeur exacte d'une slide (stable même si le viewport change)
    return slides[0].getBoundingClientRect().width;
  }

  function update(){
    const w = slideWidth();
    track.style.transform = `translate3d(${-index * w}px, 0, 0)`;

    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    setHalo(index);
  }

  function goTo(i){
    index = (i + slides.length) % slides.length;
    update();
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  window.addEventListener("resize", () => {
    // recalc propre après resize
    update();
  });

  // init
  update();
});
