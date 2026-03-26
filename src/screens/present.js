import { createDeckRuntime } from "../core/deck-runtime.js";
import { createTransportController } from "../ui/transport-controller.js";

let _activeSession = null;
let _runtime = null;

function getDeckTotal(runtime) {
  return runtime.getDeck()?.scenes?.length ?? 0;
}

function getControlsPosition(presentation) {
  const raw = presentation?.settings?.presentControlsPosition;
  return raw === "top" ? "top" : "bottom";
}

function createNotFound(rootEl) {
  rootEl.innerHTML = `<div class="ps-not-found">Presentation not found.</div>`;
  return {
    destroy() {
      rootEl.innerHTML = "";
    },
  };
}

function createPresentSession({ id, store, rootEl, deck: deckOverride }) {
  // Use a pre-merged deck when provided (magic-link boot path); otherwise fall
  // back to the store so the workspace fullscreen path continues to work.
  const presentation = deckOverride ?? store.getById(id);
  if (!presentation) {
    return createNotFound(rootEl);
  }

  const controlsPosition = getControlsPosition(presentation);
  const positionClass = controlsPosition === "top"
    ? "ps-player--controls-top"
    : "ps-player--controls-bottom";

  rootEl.innerHTML = `
    <div class="ps-player ${positionClass}" id="ps-player">
      <div class="ps-header">
        <span class="ps-title" id="ps-title"></span>
        <span class="ps-counter" id="ps-counter">— / —</span>
      </div>
      <div class="ps-loading" id="ps-loading">Loading presentation...</div>
      <iframe
        id="ps-frame"
        class="ps-iframe"
        src="about:blank"
        allow="fullscreen"
        title="Presentation player"
      ></iframe>
      <div class="ps-controls" id="ps-controls">
        <button type="button" id="ps-first" title="First slide">«</button>
        <button type="button" id="ps-prev" title="Previous slide">‹</button>
        <span id="ps-label" class="ps-scene-label"></span>
        <button type="button" id="ps-next" title="Next slide">›</button>
        <button type="button" id="ps-last" title="Last slide">»</button>
      </div>
      <div class="ps-end-card is-hidden" id="ps-end-card">
        <p>Presentation complete</p>
        <button type="button" id="ps-replay">Watch again</button>
      </div>
    </div>
  `;

  const playerEl = rootEl.querySelector("#ps-player");
  const iframeEl = rootEl.querySelector("#ps-frame");
  const loadingEl = rootEl.querySelector("#ps-loading");
  const titleEl = rootEl.querySelector("#ps-title");
  const counterEl = rootEl.querySelector("#ps-counter");
  const labelEl = rootEl.querySelector("#ps-label");
  const endCardEl = rootEl.querySelector("#ps-end-card");
  const replayBtn = rootEl.querySelector("#ps-replay");
  const firstBtn = rootEl.querySelector("#ps-first");
  const prevBtn = rootEl.querySelector("#ps-prev");
  const nextBtn = rootEl.querySelector("#ps-next");
  const lastBtn = rootEl.querySelector("#ps-last");

  const runtime = _runtime || createDeckRuntime();
  _runtime = runtime;
  runtime.attachTo(iframeEl);

  let hideTimer = null;
  let transport = null;
  let unsubView = null;
  let destroyed = false;
  let contentSrcAssigned = false;
  let loadingCleared = false;

  function clearHideTimer() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  function showControls() {
    playerEl.classList.add("controls-visible");
    clearHideTimer();
    hideTimer = setTimeout(() => {
      playerEl.classList.remove("controls-visible");
    }, 3000);
  }

  function onFrameLoad() {
    if (!contentSrcAssigned || loadingCleared) return;
    loadingCleared = true;
    loadingEl.classList.add("is-hidden");
    iframeEl.removeEventListener("load", onFrameLoad);
  }

  function onPlaybackKeydown(e) {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      runtime.next();
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      runtime.previous();
    }
  }

  function onVisibilityKeydown() {
    showControls();
  }

  iframeEl.addEventListener("load", onFrameLoad);
  playerEl.addEventListener("pointermove", showControls);
  playerEl.addEventListener("pointerdown", showControls);
  document.addEventListener("keydown", onPlaybackKeydown);
  document.addEventListener("keydown", onVisibilityKeydown);

  replayBtn.addEventListener("click", () => {
    runtime.goTo(0);
    showControls();
  });

  transport = createTransportController(
    runtime,
    { firstBtn, prevBtn, nextBtn, lastBtn, counterEl },
    () => getDeckTotal(runtime)
  );

  unsubView = runtime.subscribe((state) => {
    const deck = runtime.getDeck();
    const scene = deck?.scenes?.[state.currentSceneIndex];

    titleEl.textContent = deck?.title || "Presentation";
    labelEl.textContent = scene ? scene.title : "";

    if (state.iframe?.route && state.iframe.route !== "about:blank") {
      contentSrcAssigned = true;
    }

    const complete = state.status === "complete";
    endCardEl.classList.toggle("is-hidden", !complete);
  });

  async function init() {
    await runtime.load(presentation);
    showControls();
    runtime.goTo(0);
  }

  init().catch(() => {
    if (!destroyed) {
      rootEl.innerHTML = `<div class="ps-not-found">Presentation not found.</div>`;
    }
  });

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;

      clearHideTimer();

      document.removeEventListener("keydown", onPlaybackKeydown);
      document.removeEventListener("keydown", onVisibilityKeydown);
      playerEl.removeEventListener("pointermove", showControls);
      playerEl.removeEventListener("pointerdown", showControls);
      iframeEl.removeEventListener("load", onFrameLoad);

      if (unsubView) unsubView();
      if (transport) transport.unbind();
      runtime.attachTo(null);

      rootEl.innerHTML = "";
    },
  };
}

export function mountPresent({ id, store, rootEl = document.getElementById("app"), deck, demoOverrides }) {
  if (!rootEl) {
    return { destroy() {} };
  }

  if (_activeSession?.destroy) {
    _activeSession.destroy();
  }

  _activeSession = createPresentSession({ id, store, rootEl, deck, demoOverrides });
  return _activeSession;
}
