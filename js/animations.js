(function () {
  const revealItems = document.querySelectorAll("[data-reveal]");
  const heroMedia = document.querySelector(".hero__video, .hero__img");
  const heroVideo = document.querySelector(".hero__video");
  const statementImg = document.querySelector(".statement__bg img");
  const glow = document.querySelector(".cursor-glow");

  // Video de portada en loop (respeta reduced motion)
  if (heroVideo) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      heroVideo.pause();
      heroVideo.removeAttribute("autoplay");
    } else {
      const play = () => {
        const p = heroVideo.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      };
      play();
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) heroVideo.pause();
        else play();
      });
    }
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  // Parallax suave en hero / statement
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const y = window.scrollY;

      if (heroMedia) {
        heroMedia.style.transform = `scale(1.08) translate3d(0, ${y * 0.18}px, 0)`;
      }

      if (statementImg) {
        const rect = statementImg.parentElement.getBoundingClientRect();
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const offset = (progress - 0.5) * 40;
        statementImg.style.transform = `scale(1.08) translate3d(0, ${offset}px, 0)`;
      }

      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Glow que sigue el cursor
  if (glow && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "pointermove",
      (event) => {
        glow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      },
      { passive: true }
    );
  }

  // Entrada inicial del hero
  window.requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
    document.querySelectorAll(".hero [data-reveal]").forEach((el) => {
      el.classList.add("is-visible");
    });
  });
})();
