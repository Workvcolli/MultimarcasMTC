(function () {
  const filters = document.querySelectorAll(".filter");
  const grid = document.getElementById("catalogGrid");
  const bikes = Array.from(document.querySelectorAll(".bike"));

  if (!filters.length || !bikes.length || !grid) return;

  const EXIT_MS = 280;
  const STAGGER_MS = 70;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let animating = false;
  let pendingFilter = null;

  const matches = (bike, value) => value === "all" || bike.dataset.category === value;

  const clearAnimClasses = (bike) => {
    bike.classList.remove("is-exiting", "is-entering");
    bike.style.removeProperty("--enter-delay");
  };

  const applyFilter = (value) => {
    if (animating) {
      pendingFilter = value;
      return;
    }

    const toHide = [];
    const toShow = [];
    const staying = [];

    bikes.forEach((bike) => {
      const shouldShow = matches(bike, value);
      const isHidden = bike.classList.contains("is-hidden");

      if (shouldShow && isHidden) toShow.push(bike);
      else if (!shouldShow && !isHidden) toHide.push(bike);
      else if (shouldShow && !isHidden) staying.push(bike);
    });

    // Nada que animar
    if (!toHide.length && !toShow.length) return;

    if (reduceMotion) {
      bikes.forEach((bike) => {
        clearAnimClasses(bike);
        bike.classList.toggle("is-hidden", !matches(bike, value));
      });
      return;
    }

    animating = true;
    grid.classList.add("is-filtering");

    // 1) Salida suave de las que no entran
    toHide.forEach((bike) => {
      clearAnimClasses(bike);
      bike.classList.add("is-exiting");
    });

    // Las que se quedan, sin re-animación
    staying.forEach(clearAnimClasses);

    window.setTimeout(() => {
      toHide.forEach((bike) => {
        bike.classList.add("is-hidden");
        clearAnimClasses(bike);
      });

      // 2) Entrada escalonada de las nuevas
      toShow.forEach((bike, index) => {
        clearAnimClasses(bike);
        bike.classList.remove("is-hidden");
        bike.style.setProperty("--enter-delay", `${index * STAGGER_MS}ms`);

        // Forzar reflow para que la animación arranque limpia
        void bike.offsetWidth;
        bike.classList.add("is-entering");

        const onEnd = (event) => {
          if (event.animationName !== "bikeEnter") return;
          bike.classList.remove("is-entering");
          bike.style.removeProperty("--enter-delay");
          bike.removeEventListener("animationend", onEnd);
        };

        bike.addEventListener("animationend", onEnd);
      });

      const enterTotal = toShow.length
        ? EXIT_MS + (toShow.length - 1) * STAGGER_MS + 520
        : EXIT_MS;

      window.setTimeout(() => {
        grid.classList.remove("is-filtering");
        animating = false;

        if (pendingFilter !== null) {
          const next = pendingFilter;
          pendingFilter = null;
          applyFilter(next);
        }
      }, Math.max(enterTotal - EXIT_MS, 320));
    }, EXIT_MS);
  };

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.filter;

      filters.forEach((item) => {
        const active = item === btn;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });

      applyFilter(value);
    });
  });
})();
