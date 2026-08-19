(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const fab = document.querySelector(".fab-wa");
  const hero = document.getElementById("inicio");

  if (!fab || !hero) return;

  const updateFab = () => {
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    const pastHero = window.scrollY + 40 >= heroBottom;
    fab.classList.toggle("is-visible", pastHero);
  };

  window.addEventListener("scroll", updateFab, { passive: true });
  window.addEventListener("resize", updateFab);
  updateFab();
})();
