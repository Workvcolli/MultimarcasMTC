(function () {
  const filters = document.querySelectorAll(".catalog .filter");
  const grid = document.getElementById("catalogGrid");
  const empty = document.getElementById("catalogEmpty");
  const bikes = grid ? Array.from(grid.querySelectorAll(".bike")) : [];

  if (!filters.length || !bikes.length || !grid) return;

  let activeFilter = null;

  const matches = (bike, value) => {
    if (!value) return false;
    return value === "all" || bike.dataset.category === value;
  };

  const updateEmpty = (value) => {
    const showEmpty = !value;
    if (empty) empty.hidden = !showEmpty;
    grid.classList.toggle("is-empty", showEmpty);
  };

  const applyFilter = (value) => {
    activeFilter = value;
    updateEmpty(value);

    // Instantáneo: sin delays ni animaciones de entrada/salida
    bikes.forEach((bike) => {
      const show = matches(bike, value);
      bike.classList.remove("is-exiting", "is-entering");
      bike.style.removeProperty("--enter-delay");
      bike.classList.toggle("is-hidden", !show);
      if (show) bike.classList.add("is-visible");
    });
  };

  const setActiveButton = (btn) => {
    filters.forEach((item) => {
      const active = btn != null && item === btn;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
  };

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.filter;

      if (btn.classList.contains("is-active")) {
        setActiveButton(null);
        applyFilter(null);
        return;
      }

      setActiveButton(btn);
      applyFilter(value);
    });
  });

  // Estado inicial: sin filtro, sin fichas
  setActiveButton(null);
  applyFilter(null);

  grid.applyCatalogFilter = (value) => {
    const btn = Array.from(filters).find((item) => item.dataset.filter === value) || null;
    if (!btn) {
      setActiveButton(null);
      applyFilter(null);
      return;
    }
    setActiveButton(btn);
    applyFilter(value);
  };
})();
