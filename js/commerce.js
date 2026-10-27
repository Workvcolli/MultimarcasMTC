(function () {
  const WA = "543433023616";
  const waLink = (text) =>
    `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

  // —— Simulador ——
  const simForm = document.getElementById("simForm");
  const simModel = document.getElementById("simModel");
  const simPrice = document.getElementById("simPrice");
  const simDown = document.getElementById("simDown");
  const simCuotas = document.getElementById("simCuotas");
  const simCuotaOut = document.getElementById("simCuotaOut");
  const simTotalOut = document.getElementById("simTotalOut");
  const simWa = document.getElementById("simWhatsapp");

  const catalogNames = Array.from(document.querySelectorAll(".bike[data-name]"))
    .map((el) => el.dataset.name)
    .filter(Boolean);

  const uniqueNames = [...new Set(catalogNames)].sort((a, b) =>
    a.localeCompare(b, "es")
  );

  if (simModel && uniqueNames.length) {
    uniqueNames.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      simModel.appendChild(opt);
    });
  }

  const formatARS = (n) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(n || 0);

  const calcSim = () => {
    if (!simPrice || !simDown || !simCuotas) return;

    const price = Math.max(0, Number(simPrice.value) || 0);
    const downPct = Math.min(90, Math.max(0, Number(simDown.value) || 0));
    const cuotas = Math.max(1, Number(simCuotas.value) || 12);
    const financed = price * (1 - downPct / 100);
    // Estimación orientativa (sin interés real del plan): solo guía visual
    const interestFactor = 1 + Math.min(cuotas, 48) * 0.018;
    const total = financed * interestFactor;
    const cuota = total / cuotas;

    if (simCuotaOut) simCuotaOut.textContent = price ? formatARS(cuota) : "—";
    if (simTotalOut) {
      simTotalOut.textContent = price
        ? `Financiado estimado ${formatARS(total)} · Anticipo ${formatARS(price * (downPct / 100))}`
        : "Ingresá un precio aproximado para estimar";
    }

    if (simWa) {
      const model = simModel?.value || "una moto";
      const msg = price
        ? `Hola MTC Motos, quiero financiar ${model}. Precio aprox ${formatARS(price)}, anticipo ${downPct}%, en ${cuotas} cuotas (estimado ${formatARS(cuota)} c/u). ¿Me pasan el plan real solo con DNI?`
        : `Hola MTC Motos, quiero consultar financiación solo con DNI para ${model} en ${cuotas} cuotas.`;
      simWa.href = waLink(msg);
    }
  };

  if (simForm) {
    ["input", "change"].forEach((evt) => {
      simForm.addEventListener(evt, calcSim);
    });
    calcSim();
  }

  // —— Lead form → WhatsApp ——
  const leadForm = document.getElementById("leadForm");
  if (leadForm) {
    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(leadForm);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const model = String(data.get("model") || "").trim();
      const interest = String(data.get("interest") || "financiación");

      if (!name || !phone) return;

      const msg = `Hola MTC Motos, soy ${name}. Tel: ${phone}. Me interesa ${interest}${model ? ` — ${model}` : ""}. ¿Me ayudan con la financiación solo con DNI?`;
      window.open(waLink(msg), "_blank", "noopener,noreferrer");
    });
  }

  // —— Salto al filtro Usadas del catálogo ——
  document.querySelectorAll("[data-jump-usadas]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const gridEl = document.getElementById("catalogGrid");
      event.preventDefault();
      if (typeof gridEl?.applyCatalogFilter === "function") {
        gridEl.applyCatalogFilter("usadas");
      } else {
        document.querySelector('.catalog .filter[data-filter="usadas"]')?.click();
      }
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
