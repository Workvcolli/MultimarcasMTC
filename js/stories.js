(function () {
  const rail = document.getElementById("storiesRail");
  const viewer = document.getElementById("storyViewer");
  const frame = viewer?.querySelector(".story-viewer__frame");
  const chips = Array.from(document.querySelectorAll(".story-chip"));

  if (!rail || !viewer || !frame || !chips.length) return;

  const els = {
    img: document.getElementById("storyViewerImg"),
    avatar: document.getElementById("storyViewerAvatar"),
    brand: document.getElementById("storyViewerBrand"),
    title: document.getElementById("storyViewerTitle"),
    cta: document.getElementById("storyViewerCta"),
    progress: document.getElementById("storyViewerProgress"),
  };

  const stories = chips.map((chip) => ({
    title: chip.dataset.title || chip.querySelector(".story-chip__label")?.textContent || "",
    brand: chip.dataset.brand || "MTC Motos",
    image: chip.dataset.image,
    alt: chip.dataset.alt || "",
    cta: chip.dataset.cta || "Consultar por WhatsApp",
    wa: chip.dataset.wa || "https://wa.me/543433023616",
  }));

  const DURATION = 6500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;
  let timer = null;
  let lastFocus = null;
  let closing = false;
  let pointerStartX = null;

  const markSeen = (i) => {
    chips[i]?.classList.add("is-seen");
  };

  const renderProgress = () => {
    els.progress.innerHTML = stories
      .map((_, i) => {
        const state = i < index ? "is-done" : i === index ? "is-active" : "";
        return `<span class="story-viewer__bar ${state}"><i class="story-viewer__bar-fill"></i></span>`;
      })
      .join("");
  };

  const showStory = (i) => {
    index = (i + stories.length) % stories.length;
    const story = stories[index];

    els.img.src = story.image;
    els.img.alt = story.alt;
    els.avatar.src = story.image;
    els.avatar.alt = "";
    els.brand.textContent = story.brand;
    els.title.textContent = story.title;
    els.cta.textContent = story.cta;
    els.cta.href = story.wa;

    markSeen(index);
    renderProgress();
    restartTimer();
  };

  const clearTimer = () => {
    if (timer) window.clearTimeout(timer);
    timer = null;
  };

  const restartTimer = () => {
    clearTimer();
    if (reduceMotion) return;
    timer = window.setTimeout(() => next(), DURATION);
  };

  const next = () => {
    if (index >= stories.length - 1) {
      closeViewer();
      return;
    }
    showStory(index + 1);
  };

  const prev = () => {
    if (index <= 0) {
      showStory(0);
      return;
    }
    showStory(index - 1);
  };

  const openViewer = (i) => {
    if (closing) return;

    lastFocus = document.activeElement;
    viewer.hidden = false;
    document.body.classList.add("story-open");
    showStory(i);

    requestAnimationFrame(() => {
      viewer.classList.add("is-open");
      frame.focus({ preventScroll: true });
    });
  };

  const closeViewer = () => {
    if (viewer.hidden || closing) return;

    closing = true;
    clearTimer();
    viewer.classList.remove("is-open", "is-paused");

    window.setTimeout(() => {
      viewer.hidden = true;
      document.body.classList.remove("story-open");
      closing = false;

      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus({ preventScroll: true });
      }
    }, 280);
  };

  const pause = () => {
    if (viewer.hidden) return;
    viewer.classList.add("is-paused");
    clearTimer();
  };

  const resume = () => {
    if (viewer.hidden || closing) return;
    viewer.classList.remove("is-paused");
    restartTimer();
  };

  chips.forEach((chip, i) => {
    chip.addEventListener("click", () => openViewer(i));
  });

  const requested = Number(new URLSearchParams(window.location.search).get("story"));
  if (!Number.isNaN(requested) && requested >= 0 && requested < stories.length) {
    window.setTimeout(() => openViewer(requested), 200);
  }

  viewer.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-story]")) closeViewer();
    else if (event.target.closest("[data-story-prev]")) prev();
    else if (event.target.closest("[data-story-next]")) next();
  });

  frame.addEventListener("pointerdown", (event) => {
    if (event.target.closest("[data-close-story], .story-viewer__cta")) return;
    pointerStartX = event.clientX;
    pause();
  });

  window.addEventListener("pointerup", (event) => {
    if (viewer.hidden) return;

    if (pointerStartX !== null) {
      const delta = event.clientX - pointerStartX;
      pointerStartX = null;

      if (Math.abs(delta) > 60) {
        delta < 0 ? next() : prev();
        return;
      }
    }

    resume();
  });

  window.addEventListener("keydown", (event) => {
    if (viewer.hidden) return;

    if (event.key === "Escape") closeViewer();
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") prev();
  });
})();
