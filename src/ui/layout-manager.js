/**
 * LayoutManager — controls the three presentation modes for a workspace:
 *
 *   "workspace"   — default; runtime runs inside the workspace canvas iframe
 *   "split"       — slide-over overlay: left editor + right runtime iframe
 *   "fullscreen"  — full-viewport overlay on document.body; keyboard-only
 *
 * Usage:
 *   const lm = createLayoutManager({ runtime, shell, store, presentationId, wsIframeEl });
 *   lm.setMode("split");       // or "fullscreen" | "workspace"
 *   lm.getMode();              // current mode string
 *   lm.destroy();              // clean up on screen unmount
 */

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const KEYBOARD_MODES = new Set(["split", "fullscreen"]);

export function createLayoutManager({
  runtime,
  shell,
  store,
  presentationId,
  wsIframeEl,           // the workspace canvas iframe (always exists)
}) {
  let _mode = "workspace";
  let _overlayEl = null;
  let _overlayIframe = null;
  let _overlayUnsub = null;
  let _keyHandler = null;

  // ── Keyboard handler (active in split + fullscreen) ──────────────────────

  function _makeKeyHandler() {
    return function onKey(e) {
      // Ignore when focus is inside a text input
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case " ":
        case "ArrowRight":
          e.preventDefault();
          runtime.next();
          break;
        case "ArrowLeft":
          e.preventDefault();
          runtime.previous();
          break;
        case "r":
        case "R":
          runtime.replayLine();
          break;
        case "s":
        case "S":
          runtime.skipTyping();
          break;
        case "Escape":
          setMode("workspace");
          break;
      }
    };
  }

  function _attachKeyboard() {
    if (_keyHandler) return;
    _keyHandler = _makeKeyHandler();
    document.addEventListener("keydown", _keyHandler);
  }

  function _detachKeyboard() {
    if (!_keyHandler) return;
    document.removeEventListener("keydown", _keyHandler);
    _keyHandler = null;
  }

  // ── Mode exit helpers ─────────────────────────────────────────────────────

  function _exitWorkspace() {
    // Nothing special — wsIframeEl stays in place
  }

  function _exitSplit() {
    _detachKeyboard();
    if (_overlayUnsub) { _overlayUnsub(); _overlayUnsub = null; }
    if (_overlayEl) { _overlayEl.remove(); _overlayEl = null; _overlayIframe = null; }
    // Return runtime to the workspace iframe
    runtime.attachTo(wsIframeEl);
  }

  function _exitFullscreen() {
    _detachKeyboard();
    if (_overlayUnsub) { _overlayUnsub(); _overlayUnsub = null; }
    if (_overlayEl) { _overlayEl.remove(); _overlayEl = null; _overlayIframe = null; }
    runtime.attachTo(wsIframeEl);
  }

  // ── Mode enter helpers ────────────────────────────────────────────────────

  function _enterWorkspace() {
    // wsIframeEl is already attached — just make sure runtime knows
    runtime.attachTo(wsIframeEl);
  }

  function _enterSplit() {
    const p = store.getById(presentationId);
    const scenes = p?.scenes || [];
    const state = runtime.getState();
    const activeIdx = state.currentSceneIndex;

    // Build overlay
    const overlay = document.createElement("div");
    overlay.className = "lm-split-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Split presentation mode");

    overlay.innerHTML = `
      <div class="lm-split-left">
        <div class="lm-split-header">
          <span class="lm-split-title">${esc(p?.title || "Presentation")}</span>
          <button type="button" class="btn btn--ghost btn--small lm-close-btn"
                  aria-label="Exit split mode">✕</button>
        </div>
        <div class="lm-split-scene-list" id="lm-scene-list">
          ${scenes.map((s, i) => `
            <div class="lm-split-scene-item ${i === activeIdx ? "is-active" : ""}"
                 data-index="${i}" role="button" tabindex="0">
              <span class="lm-split-scene-num">${String(i + 1).padStart(2, "0")}</span>
              <span class="lm-split-scene-title">${esc(s.title)}</span>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="lm-split-right">
        <div class="lm-split-iframe-wrap">
          <iframe
            id="lm-split-frame"
            class="lm-split-iframe"
            src="about:blank"
            title="Presentation preview"
            allow="fullscreen"
          ></iframe>
        </div>
        <div class="lm-split-controls">
          <button type="button" class="btn btn--ghost btn--small" id="lm-prev-btn">← Prev</button>
          <span class="lm-split-scene-label" id="lm-scene-label"></span>
          <button type="button" class="btn btn--ghost btn--small" id="lm-next-btn">Next →</button>
        </div>
      </div>
    `;

    document.getElementById("screen-root").appendChild(overlay);
    _overlayEl = overlay;
    _overlayIframe = overlay.querySelector("#lm-split-frame");

    runtime.attachTo(_overlayIframe);

    // Wire close button
    overlay.querySelector(".lm-close-btn").addEventListener("click", () => setMode("workspace"));

    // Wire scene list clicks
    overlay.querySelector("#lm-scene-list").addEventListener("click", (e) => {
      const item = e.target.closest("[data-index]");
      if (item) runtime.sync(parseInt(item.dataset.index, 10));
    });
    overlay.querySelector("#lm-scene-list").addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const item = e.target.closest("[data-index]");
        if (item) { e.preventDefault(); runtime.sync(parseInt(item.dataset.index, 10)); }
      }
    });

    // Wire prev/next
    overlay.querySelector("#lm-prev-btn").addEventListener("click", () => runtime.previous());
    overlay.querySelector("#lm-next-btn").addEventListener("click", () => runtime.next());

    // Subscribe to runtime state for label + active highlight
    _overlayUnsub = runtime.subscribe((state) => {
      const labelEl = overlay.querySelector("#lm-scene-label");
      const fresh = store.getById(presentationId);
      const scene = fresh?.scenes?.[state.currentSceneIndex];
      if (labelEl && scene) {
        labelEl.textContent = `Scene ${state.currentSceneIndex + 1} — ${scene.title}`;
      }
      // Update active highlight
      overlay.querySelectorAll(".lm-split-scene-item").forEach((el, i) => {
        el.classList.toggle("is-active", i === state.currentSceneIndex);
      });
    });

    _attachKeyboard();
  }

  function _enterFullscreen() {
    const p = store.getById(presentationId);
    const state = runtime.getState();
    const activeIdx = state.currentSceneIndex;
    const scene = p?.scenes?.[activeIdx];

    const overlay = document.createElement("div");
    overlay.className = "lm-fullscreen-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Fullscreen presentation");

    const totalScenes = p?.scenes?.length ?? 0;

    overlay.innerHTML = `
      <iframe
        id="lm-fullscreen-frame"
        class="lm-fullscreen-iframe"
        src="about:blank"
        title="Fullscreen presentation"
        allow="fullscreen"
      ></iframe>
      <div class="lm-fs-trigger-zone"></div>
      <div class="lm-fullscreen-hud" id="lm-fullscreen-hud">
        <span class="lm-fullscreen-label" id="lm-fullscreen-label">${
          scene ? esc(`${activeIdx + 1} / ${totalScenes} — ${scene.title}`) : ""
        }</span>
        <div class="lm-fullscreen-hud-actions">
          <button type="button" class="lm-transport-btn" id="lm-first-btn"    title="First slide">«</button>
          <button type="button" class="lm-transport-btn" id="lm-prev-btn"     title="Previous slide">‹</button>
          <button type="button" class="lm-transport-btn" id="lm-playpause-btn" title="Advance">▶</button>
          <span class="lm-transport-counter" id="lm-transport-counter">${activeIdx + 1} / ${totalScenes}</span>
          <button type="button" class="lm-transport-btn" id="lm-next-btn"     title="Next slide">›</button>
          <button type="button" class="lm-transport-btn" id="lm-last-btn"     title="Last slide">»</button>
          <button type="button" class="lm-transport-btn lm-close-btn"
                  aria-label="Exit fullscreen">✕ Esc</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    _overlayEl = overlay;
    _overlayIframe = overlay.querySelector("#lm-fullscreen-frame");

    runtime.attachTo(_overlayIframe);

    overlay.querySelector(".lm-close-btn").addEventListener("click", () => setMode("workspace"));

    // Wire transport buttons
    overlay.querySelector("#lm-first-btn").addEventListener("click", () => runtime.goTo(0));
    overlay.querySelector("#lm-prev-btn").addEventListener("click",  () => runtime.previous());
    overlay.querySelector("#lm-next-btn").addEventListener("click",  () => runtime.next());
    overlay.querySelector("#lm-last-btn").addEventListener("click",  () => {
      const fresh = store.getById(presentationId);
      if (fresh?.scenes?.length) runtime.goTo(fresh.scenes.length - 1);
    });
    overlay.querySelector("#lm-playpause-btn").addEventListener("click", () => {
      const s = runtime.getState();
      if (s.status === "presenting") runtime.pause();
      else if (s.status === "paused") runtime.resume();
      else runtime.next();
    });

    // Subscribe to runtime state for label + counter + disabled states
    _overlayUnsub = runtime.subscribe((state) => {
      const fresh = store.getById(presentationId);
      const total = fresh?.scenes?.length ?? 0;
      const idx = state.currentSceneIndex;
      const s = fresh?.scenes?.[idx];
      const isPresenting = state.status === "presenting";
      const isPaused     = state.status === "paused";

      const labelEl      = overlay.querySelector("#lm-fullscreen-label");
      const counterEl    = overlay.querySelector("#lm-transport-counter");
      const playPauseBtn = overlay.querySelector("#lm-playpause-btn");
      const firstBtn     = overlay.querySelector("#lm-first-btn");
      const prevBtn      = overlay.querySelector("#lm-prev-btn");
      const lastBtn      = overlay.querySelector("#lm-last-btn");

      if (labelEl && s)  labelEl.textContent = `${idx + 1} / ${total} — ${s.title}`;
      if (counterEl)     counterEl.textContent = `${idx + 1} / ${total}`;
      if (playPauseBtn) {
        playPauseBtn.textContent = isPresenting ? "⏸" : "▶";
        playPauseBtn.title = isPresenting ? "Pause narration" : isPaused ? "Resume narration" : "Advance";
      }
      if (firstBtn) firstBtn.disabled = idx <= 0;
      if (prevBtn)  prevBtn.disabled  = idx <= 0;
      if (lastBtn)  lastBtn.disabled  = idx >= total - 1;
    });

    _attachKeyboard();

    // Focus the overlay so keyboard events work immediately, and reclaim focus
    // each time the iframe loads a new scene (iframes steal focus on load).
    overlay.setAttribute("tabindex", "-1");
    overlay.focus();
    _overlayIframe.addEventListener("load", () => overlay.focus());
  }

  // ── Public API ────────────────────────────────────────────────────────────

  function setMode(newMode) {
    if (newMode === _mode) return;
    const prev = _mode;

    // Exit current mode
    if (prev === "workspace")  _exitWorkspace();
    if (prev === "split")      _exitSplit();
    if (prev === "fullscreen") _exitFullscreen();

    _mode = newMode;

    // Enter new mode
    if (newMode === "workspace")  _enterWorkspace();
    if (newMode === "split")      _enterSplit();
    if (newMode === "fullscreen") _enterFullscreen();
  }

  function getMode() {
    return _mode;
  }

  function destroy() {
    // Force exit to workspace to clean up overlays and listeners
    const prev = _mode;
    if (prev === "split")      _exitSplit();
    if (prev === "fullscreen") _exitFullscreen();
    _mode = "workspace";
  }

  return { setMode, getMode, destroy };
}
