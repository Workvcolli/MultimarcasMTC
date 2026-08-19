(function () {
  const modal = document.getElementById("bikeModal");
  const dialog = modal?.querySelector(".bike-modal__dialog");
  const bikes = document.querySelectorAll(".bike");

  if (!modal || !dialog || !bikes.length) return;

  const els = {
    img: document.getElementById("bikeModalImg"),
    tag: document.getElementById("bikeModalTag"),
    meta: document.getElementById("bikeModalMeta"),
    title: document.getElementById("bikeModalTitle"),
    desc: document.getElementById("bikeModalDesc"),
    specs: document.getElementById("bikeModalSpecs"),
    whatsapp: document.getElementById("bikeModalWhatsapp"),
  };

  const specLabels = [
    ["engine", "Motor"],
    ["power", "Potencia"],
    ["torque", "Torque"],
    ["transmission", "Transmisión"],
    ["fuel", "Alimentación"],
    ["brake", "Frenos"],
    ["weight", "Peso"],
    ["tank", "Tanque"],
  ];

  let lastFocus = null;
  let closing = false;

  const fillModal = (bike) => {
    const img = bike.querySelector("img");
    const name = bike.dataset.name || "";

    els.img.src = img?.currentSrc || img?.src || "";
    els.img.alt = img?.alt || name;
    els.tag.textContent = bike.dataset.tag || "";
    els.meta.textContent = bike.dataset.meta || "";
    els.title.textContent = name;
    els.desc.textContent = bike.dataset.desc || "";

    els.specs.innerHTML = "";
    specLabels.forEach(([key, label]) => {
      const value = bike.dataset[key];
      if (!value) return;

      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      els.specs.appendChild(row);
    });

    const msg = encodeURIComponent(`Hola MTC Motos, quiero consultar por ${name}`);
    els.whatsapp.href = `https://wa.me/543433023616?text=${msg}`;
  };

  const openModal = (bike) => {
    if (closing) return;

    lastFocus = document.activeElement;
    fillModal(bike);

    modal.hidden = false;
    document.body.classList.add("modal-open");

    requestAnimationFrame(() => {
      modal.classList.add("is-open");
      dialog.focus({ preventScroll: true });
    });
  };

  const closeModal = () => {
    if (modal.hidden || closing) return;

    closing = true;
    modal.classList.remove("is-open");

    window.setTimeout(() => {
      modal.hidden = true;
      document.body.classList.remove("modal-open");
      closing = false;

      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus({ preventScroll: true });
      }
    }, 320);
  };

  bikes.forEach((bike) => {
    bike.addEventListener("click", () => openModal(bike));

    bike.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(bike);
      }
    });
  });

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-modal]")) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
})();
