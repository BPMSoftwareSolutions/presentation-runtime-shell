/**
 * Screen 02 — Presentation Workspace
 * Route: #/presentation/:id
 *
 * Layout (within screen slot):
 *   Scene List (left rail) | Canvas: iframe + prompt | Inspector (right rail)
 *
 * The runtime iframe uses id="experience-frame" so scene-runner's postMessage
 * actions work without modification. Phase 4 (attachTo) will remove this coupling.
 */

import { createDeckRuntime }    from "../core/deck-runtime.js";
import { getRuntime, setRuntime } from "../core/runtime-singleton.js";
import { createSceneList }      from "../ui/scene-list.js";
import { createInspectorPanel } from "../ui/inspector-panel.js";
import { createLayoutManager }  from "../ui/layout-manager.js";

// Session-level memory: restore scene position when re-opening a presentation
const _lastSceneIndex = {};

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function copyPresentLink(id) {
  const url = `${location.origin}${location.pathname}#/present/${encodeURIComponent(id)}`;
  navigator.clipboard.writeText(url).catch(() => {
    prompt("Copy this link:", url);
  });
}

// ── Top bar actions ────────────────────────────────────────────────────────

function createTopBarActions({ onPreview, onCopyLink, onPresent }) {
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;align-items:center;gap:8px;";

  const previewBtn = document.createElement("button");
  previewBtn.type = "button";
  previewBtn.className = "btn btn--ghost btn--small";
  previewBtn.id = "ws-preview-btn";
  previewBtn.textContent = "Preview ▾";
  previewBtn.setAttribute("aria-haspopup", "menu");
  previewBtn.addEventListener("click", onPreview);

  const copyLinkBtn = document.createElement("button");
  copyLinkBtn.type = "button";
  copyLinkBtn.className = "btn btn--ghost btn--small";
  copyLinkBtn.id = "ws-copy-link-btn";
  copyLinkBtn.textContent = "Copy Link";
  copyLinkBtn.addEventListener("click", onCopyLink);

  const presentBtn = document.createElement("button");
  presentBtn.type = "button";
  presentBtn.className = "btn btn--primary btn--small";
  presentBtn.id = "ws-present-btn";
  presentBtn.textContent = "Present";
  presentBtn.addEventListener("click", onPresent);

  wrap.appendChild(previewBtn);
  wrap.appendChild(copyLinkBtn);
  wrap.appendChild(presentBtn);
  return wrap;
}

// ── Preview dropdown ───────────────────────────────────────────────────────

let _previewMenu = null;

function closePreviewMenu() {
  if (_previewMenu) { _previewMenu.remove(); _previewMenu = null; }
}

function openPreviewMenu(anchorEl, layoutManager, { runtime, getActiveIndex }) {
  closePreviewMenu();

  const menu = document.createElement("div");
  menu.className = "ws-preview-menu";
  menu.setAttribute("role", "menu");
  menu.innerHTML = `
    <button class="ws-preview-menu__item" role="menuitem" data-mode="workspace">Workspace (inline)</button>
    <button class="ws-preview-menu__item" role="menuitem" data-mode="split">Split view</button>
  `;

  menu.addEventListener("click", (e) => {
    e.stopPropagation();
    const btn = e.target.closest("[data-mode]");
    if (!btn) return;
    closePreviewMenu();
    if (btn.dataset.mode !== "workspace") {
      runtime.sync(getActiveIndex());
    }
    layoutManager.setMode(btn.dataset.mode);
  });

  // Position below anchor
  const rect = anchorEl.getBoundingClientRect();
  menu.style.cssText = `
    position: fixed;
    top: ${rect.bottom + 4}px;
    left: ${rect.left}px;
    z-index: var(--z-overlay);
  `;

  document.body.appendChild(menu);
  _previewMenu = menu;

  // Close on next outside click
  setTimeout(() => {
    document.addEventListener("click", closePreviewMenu, { once: true, capture: true });
  }, 0);
}

// ── Screen ─────────────────────────────────────────────────────────────────

export function mountWorkspace({ id, store, sharedDeckStore, router, shell }) {
  const root = document.getElementById("screen-root");

  // Guard: presentation must exist
  const presentation = store.getById(id);
  if (!presentation) {
    router.navigate("#/library");
    return { unmount() {} };
  }

  // ── Breadcrumb + top bar ─────────────────────────────────────────────────
  shell.setBreadcrumb([
    { label: "Library", href: "#/library" },
    { label: presentation.title },
  ]);

  // Top bar buttons — wired to layoutManager after runtime is created below
  let _layoutManager = null;
  const topBarEl = createTopBarActions({
    onPreview(e) {
      if (_layoutManager) openPreviewMenu(e.currentTarget, _layoutManager, {
        runtime,
        getActiveIndex: () => activeSceneIndex,
      });
    },
    onPresent() {
      if (_layoutManager) {
        runtime.sync(activeSceneIndex);
        _layoutManager.setMode("fullscreen");
      }
    },
    onCopyLink(e) {
      copyPresentLink(id);
      const btn = e.currentTarget;
      const original = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => {
        btn.textContent = original || "Copy Link";
      }, 1500);
    },
  });
  shell.setTopBarActions(topBarEl);

  // ── DOM skeleton ─────────────────────────────────────────────────────────
  root.innerHTML = `
    <div class="ws-screen" id="ws-screen">
      <div class="ws-scene-list"  id="ws-scene-list-slot"></div>
      <div class="ws-canvas"      id="ws-canvas">
        <div class="ws-canvas-frame">
          <div class="ws-canvas-loading is-hidden" id="ws-loading">Loading scene…</div>
          <iframe
            id="experience-frame"
            class="ws-canvas-iframe"
            src="about:blank"
            title="Scene preview"
            allow="fullscreen"
          ></iframe>
        </div>
        <div class="ws-canvas-meta">
          <span class="ws-narrator-status" id="ws-narrator-status" data-status="idle">idle</span>
          <span class="ws-scene-label"     id="ws-scene-label"></span>
          <div class="ws-countdown" id="ws-countdown" hidden>
            <span class="ws-countdown-label" id="ws-countdown-label">0.0s</span>
            <div class="ws-countdown-track">
              <div class="ws-countdown-fill" id="ws-countdown-fill"></div>
            </div>
          </div>
          <button type="button" class="btn btn--ghost btn--small ws-narrator-skip-btn"
                  id="ws-skip-btn">Skip</button>
            <button type="button" class="btn btn--ghost btn--small ws-narrator-skip-btn"
              id="ws-voice-btn">Voice: On</button>
        </div>
        <div class="ws-transport" id="ws-transport">
          <button type="button" class="btn btn--ghost btn--small ws-transport-btn" id="ws-first-btn"  title="First slide">«</button>
          <button type="button" class="btn btn--ghost btn--small ws-transport-btn" id="ws-prev-btn"   title="Previous slide">‹</button>
          <button type="button" class="btn btn--ghost btn--small ws-transport-btn ws-transport-btn--play" id="ws-playpause-btn" title="Play / Pause">▶</button>
          <span class="ws-transport-counter" id="ws-transport-counter">— / —</span>
          <button type="button" class="btn btn--ghost btn--small ws-transport-btn" id="ws-next-btn"   title="Next slide">›</button>
          <button type="button" class="btn btn--ghost btn--small ws-transport-btn" id="ws-last-btn"   title="Last slide">»</button>
        </div>
        <div class="ws-canvas-prompt" id="ws-canvas-prompt">
          <p class="ws-prompt-label">Edit Intent</p>
          <textarea
            id="ws-edit-intent"
            class="ws-edit-intent"
            placeholder="Describe the goal or context of this scene…"
          ></textarea>
          <div class="ws-canvas-actions">
            <button type="button" class="btn btn--ghost btn--small" id="ws-edit-text-btn">
              Edit Text
            </button>
            <button type="button" class="btn btn--ghost btn--small" id="ws-import-scene-btn">
              Import Scene
            </button>
          </div>
        </div>
        <div id="ws-blocks-editor" class="ws-blocks-editor is-hidden"></div>
      </div>
      <aside class="ws-inspector" id="ws-inspector-slot" aria-label="Scene inspector"></aside>
    </div>
  `;

  const iframeEl        = document.getElementById("experience-frame");
  const loadingEl       = document.getElementById("ws-loading");
  const narratorEl      = document.getElementById("ws-narrator-status");
  const sceneLabelEl    = document.getElementById("ws-scene-label");
  const countdownEl     = document.getElementById("ws-countdown");
  const countdownLabel  = document.getElementById("ws-countdown-label");
  const countdownFill   = document.getElementById("ws-countdown-fill");
  const editIntentEl    = document.getElementById("ws-edit-intent");
  const blocksEditor    = document.getElementById("ws-blocks-editor");
  const skipBtn         = document.getElementById("ws-skip-btn");
  const voiceBtn        = document.getElementById("ws-voice-btn");
  const firstBtn         = document.getElementById("ws-first-btn");
  const prevBtn          = document.getElementById("ws-prev-btn");
  const playPauseBtn     = document.getElementById("ws-playpause-btn");
  const nextBtn          = document.getElementById("ws-next-btn");
  const lastBtn          = document.getElementById("ws-last-btn");
  const transportCounter = document.getElementById("ws-transport-counter");

  // ── Scene list component ─────────────────────────────────────────────────
  const sceneListSlot = document.getElementById("ws-scene-list-slot");
  const sceneList = createSceneList({
    store,
    presentationId: id,
    onSelectScene(index)    { selectScene(index); },
    onAddScene()            { addScene(); },
    onMoveUp(index)         { moveScene(index, -1); },
    onMoveDown(index)       { moveScene(index, 1); },
    onDuplicateScene(index) { duplicateSceneAt(index); },
    onDeleteScene(index)    { deleteSceneAt(index); },
  });
  sceneListSlot.appendChild(sceneList.el);

  // ── Inspector component ──────────────────────────────────────────────────
  const inspectorSlot = document.getElementById("ws-inspector-slot");
  const inspector = createInspectorPanel({
    store,
    presentationId: id,
    onDuplicateScene(sceneId) { duplicateSceneById(sceneId); },
    onDeleteScene(sceneId)    { deleteSceneById(sceneId); },
    onRegenerate(scene)       {
      editIntentEl.value = "";
      store.updateScene(id, scene.id, { editIntent: "" });
      if (sharedDeckStore) {
        sharedDeckStore.updatePresentation(id, { scenes: { [scene.id]: { editIntent: "" } } });
      }
    },
    onSettingsChange(partial) {
      // Sync playback mode to the live runtime immediately
      if (partial.playbackMode !== undefined) {
        runtime.setPlaybackMode(partial.playbackMode);
      }
    },
    onDeckPatch(patch) {
      if (sharedDeckStore) sharedDeckStore.updatePresentation(id, patch);
    },
  });
  inspectorSlot.appendChild(inspector.el);

  // ── Runtime ──────────────────────────────────────────────────────────────
  let runtime = getRuntime();
  if (!runtime) {
    runtime = createDeckRuntime();
    setRuntime(runtime);
  }

  // ── Layout manager ───────────────────────────────────────────────────────
  _layoutManager = createLayoutManager({
    runtime,
    shell,
    store,
    presentationId: id,
    wsIframeEl: iframeEl,
  });

  let lastRoute = "";
  let unsubRuntime = null;
  let activeSceneIndex = _lastSceneIndex[id] || 0;
  let blocksVisible = false;

  // Runtime state subscriber: iframe nav + UI sync
  function onRuntimeState(state) {
    // Iframe navigation (synchronous subscribers fire before next tick)
    if (state.iframe.route !== lastRoute) {
      lastRoute = state.iframe.route;
      iframeEl.src = state.iframe.route || "about:blank";
    }

    // Loading overlay
    const isLoading = state.status === "loading-scene" || state.status === "waiting-iframe";
    loadingEl.classList.toggle("is-hidden", !isLoading);

    // Narrator status badge
    narratorEl.textContent = state.status;
    narratorEl.dataset.status = state.status;

    // Countdown timer display
    if (state.countdown) {
      const { remainingMs, totalMs } = state.countdown;
      const secs = (remainingMs / 1000).toFixed(1);
      const pct = totalMs > 0 ? Math.max(0, remainingMs / totalMs) * 100 : 0;
      countdownLabel.textContent = `${secs}s`;
      countdownFill.style.width = `${pct}%`;
      countdownEl.hidden = false;
    } else {
      countdownEl.hidden = true;
    }

    // Scene label
    const p = store.getById(id);
    const scene = p?.scenes?.[state.currentSceneIndex];
    if (scene) {
      sceneLabelEl.textContent = `Scene ${state.currentSceneIndex + 1} — ${scene.title}`;
    }

    // Transport counter always stays in sync
    updateTransport(state.currentSceneIndex);

    // Scene list active highlight (lightweight update)
    if (state.currentSceneIndex !== activeSceneIndex) {
      activeSceneIndex = state.currentSceneIndex;
      _lastSceneIndex[id] = activeSceneIndex;
      sceneList.setActiveIndex(activeSceneIndex);
      updatePromptArea();
      updateInspector();
    }
  }

  function updateVoiceButton() {
    if (!voiceBtn || !runtime?.getVoiceState) return;
    const voiceState = runtime.getVoiceState();
    const status = voiceState.enabled ? "On" : "Off";
    const mode = voiceState.mode === "openai" ? "OpenAI" : "Browser";
    voiceBtn.textContent = `Voice: ${status} (${mode})`;
    voiceBtn.setAttribute("aria-pressed", voiceState.enabled ? "true" : "false");
  }

  // ── Async init ───────────────────────────────────────────────────────────
  async function init() {
    const p = store.getById(id);
    if (!p) return;

    await runtime.load(p);
    unsubRuntime = runtime.subscribe(onRuntimeState);

    // Render scene list + initial scene state
    sceneList.render(p.scenes, activeSceneIndex);
    updatePromptArea();
    updateInspector();
    updateTransport(activeSceneIndex);

    // Navigate to saved scene
    const savedIndex = Math.min(activeSceneIndex, p.scenes.length - 1);
    if (p.scenes.length > 0) {
      runtime.goTo(savedIndex);
    }

    updateVoiceButton();
  }

  init().catch(console.error);

  // ── Prompt area ───────────────────────────────────────────────────────────

  function updatePromptArea() {
    const p = store.getById(id);
    const scene = p?.scenes?.[activeSceneIndex];
    if (!scene) { editIntentEl.value = ""; return; }
    editIntentEl.value = scene.editIntent || "";
    if (blocksVisible) renderBlocksEditor(scene);
  }

  editIntentEl.addEventListener("blur", () => {
    const p = store.getById(id);
    const scene = p?.scenes?.[activeSceneIndex];
    if (!scene) return;
    const val = editIntentEl.value;
    if (val !== (scene.editIntent || "")) {
      store.updateScene(id, scene.id, { editIntent: val });
      if (sharedDeckStore) {
        sharedDeckStore.updatePresentation(id, { scenes: { [scene.id]: { editIntent: val } } });
      }
    }
  });

  if (voiceBtn) {
    voiceBtn.addEventListener("click", () => {
      runtime.toggleVoiceEnabled();
      updateVoiceButton();
    });
  }

  // ── Inspector ─────────────────────────────────────────────────────────────

  function updateInspector() {
    const p = store.getById(id);
    const scene = p?.scenes?.[activeSceneIndex];
    inspector.update(scene || null, p);
  }

  // ── Blocks editor (Edit Text) ─────────────────────────────────────────────

  document.getElementById("ws-edit-text-btn").addEventListener("click", () => {
    blocksVisible = !blocksVisible;
    blocksEditor.classList.toggle("is-hidden", !blocksVisible);
    document.getElementById("ws-edit-text-btn").textContent =
      blocksVisible ? "Hide Text" : "Edit Text";
    if (blocksVisible) {
      const p = store.getById(id);
      const scene = p?.scenes?.[activeSceneIndex];
      if (scene) renderBlocksEditor(scene);
    }
  });

  function renderBlocksEditor(scene) {
    const blocks = scene.presenter?.blocks || [];
    blocksEditor.innerHTML = `
      <div class="ws-blocks-header">
        <span class="ws-blocks-label">Presenter Blocks</span>
        <button type="button" class="btn btn--ghost btn--small" id="ws-add-block-btn">
          + Add block
        </button>
      </div>
      ${blocks.map((block, i) => `
        <div class="ws-block-item" data-block-index="${i}">
          <span class="ws-block-num">Block ${i + 1}</span>
          <textarea
            class="ws-block-textarea"
            data-block-index="${i}"
            aria-label="Block ${i + 1} text"
          >${esc(block.text || "")}</textarea>
        </div>
      `).join("")}
    `;

    // Save block text on blur
    blocksEditor.querySelectorAll(".ws-block-textarea").forEach((ta, i) => {
      ta.addEventListener("blur", () => {
        const p = store.getById(id);
        const s = p?.scenes?.[activeSceneIndex];
        if (!s) return;
        const updatedBlocks = (s.presenter?.blocks || []).map((b, j) =>
          j === i ? { ...b, text: ta.value } : b
        );
        store.updateScene(id, s.id, {
          presenter: { ...(s.presenter || {}), blocks: updatedBlocks },
        });
      });
    });

    // Add block
    document.getElementById("ws-add-block-btn").addEventListener("click", () => {
      const p = store.getById(id);
      const s = p?.scenes?.[activeSceneIndex];
      if (!s) return;
      const blocks = [...(s.presenter?.blocks || []), { text: "", pauseMs: 400 }];
      store.updateScene(id, s.id, {
        presenter: { ...(s.presenter || {}), blocks },
      });
      renderBlocksEditor(store.getById(id).scenes[activeSceneIndex]);
    });
  }

  // ── Scene navigation ──────────────────────────────────────────────────────

  function selectScene(index) {
    activeSceneIndex = index;
    _lastSceneIndex[id] = index;
    runtime.goTo(index);
  }

  // ── Scene mutations ───────────────────────────────────────────────────────

  function addScene() {
    const scene = store.addScene(id, { title: "New Scene" });
    const p = store.getById(id);
    const newIndex = p.scenes.findIndex((s) => s.id === scene.id);
    sceneList.render(p.scenes, newIndex);
    selectScene(newIndex);
    updateInspector();
  }

  function moveScene(index, direction) {
    const p = store.getById(id);
    const scenes = p.scenes;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= scenes.length) return;

    const ids = scenes.map((s) => s.id);
    [ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]];
    store.reorderScenes(id, ids);
    if (sharedDeckStore) {
      sharedDeckStore.updatePresentation(id, { sceneOrder: ids });
    }

    const newActive = ids.indexOf(scenes[activeSceneIndex]?.id);
    activeSceneIndex = newActive >= 0 ? newActive : 0;
    _lastSceneIndex[id] = activeSceneIndex;

    const fresh = store.getById(id);
    sceneList.render(fresh.scenes, activeSceneIndex);
    updateInspector();
  }

  function duplicateSceneAt(index) {
    const p = store.getById(id);
    const scene = p.scenes[index];
    if (!scene) return;
    duplicateSceneById(scene.id);
  }

  function duplicateSceneById(sceneId) {
    const copy = store.duplicateScene(id, sceneId);
    if (!copy) return;
    const p = store.getById(id);
    const newIndex = p.scenes.findIndex((s) => s.id === copy.id);
    sceneList.render(p.scenes, newIndex);
    selectScene(newIndex);
    updateInspector();
  }

  function deleteSceneAt(index) {
    const p = store.getById(id);
    const scene = p.scenes[index];
    if (!scene) return;
    deleteSceneById(scene.id);
  }

  function deleteSceneById(sceneId) {
    const p = store.getById(id);
    if (p.scenes.length <= 1) {
      // Don't delete the last scene — prompt instead
      const confirmed = confirm("This is the last scene. Delete it anyway?");
      if (!confirmed) return;
    }

    const deletedIndex = p.scenes.findIndex((s) => s.id === sceneId);
    store.removeScene(id, sceneId);

    const fresh = store.getById(id);
    if (!fresh || fresh.scenes.length === 0) {
      sceneList.render([], 0);
      inspector.update(null, fresh);
      iframeEl.src = "about:blank";
      return;
    }

    const newActive = Math.min(deletedIndex, fresh.scenes.length - 1);
    activeSceneIndex = newActive;
    _lastSceneIndex[id] = newActive;
    sceneList.render(fresh.scenes, newActive);
    selectScene(newActive);
    updateInspector();
  }

  // ── Import Scene ──────────────────────────────────────────────────────────

  document.getElementById("ws-import-scene-btn").addEventListener("click", () => {
    router.navigate(`#/presentation/${id}/import`);
  });

  // ── Skip narrator ─────────────────────────────────────────────────────────

  skipBtn.addEventListener("click", () => runtime.skipTyping());

  // ── Transport controls ────────────────────────────────────────────────────

  firstBtn.addEventListener("click", () => runtime.goTo(0));
  prevBtn.addEventListener("click",  () => runtime.previous());
  nextBtn.addEventListener("click",  () => runtime.next());
  lastBtn.addEventListener("click",  () => {
    const p = store.getById(id);
    if (p?.scenes?.length) runtime.goTo(p.scenes.length - 1);
  });
  playPauseBtn.addEventListener("click", () => {
    const s = runtime.getState();
    if (s.status === "presenting") runtime.pause();
    else if (s.status === "paused") runtime.resume();
    else runtime.next();
  });

  function updateTransport(sceneIndex) {
    const p = store.getById(id);
    const total = p?.scenes?.length ?? 0;
    const idx = sceneIndex ?? runtime.getState().currentSceneIndex;
    const s = runtime.getState();
    const isPaused     = s.status === "paused";
    const isPresenting = s.status === "presenting";

    transportCounter.textContent = total ? `${idx + 1} / ${total}` : "— / —";
    playPauseBtn.textContent = isPresenting ? "⏸" : "▶";
    playPauseBtn.title = isPresenting ? "Pause narration" : isPaused ? "Resume narration" : "Advance";

    firstBtn.disabled = idx <= 0;
    prevBtn.disabled  = idx <= 0;
    lastBtn.disabled  = idx >= total - 1;
    nextBtn.disabled  = false;
  }

  // ── Unmount ───────────────────────────────────────────────────────────────

  return {
    unmount() {
      if (_layoutManager) _layoutManager.destroy();
      closePreviewMenu();
      if (unsubRuntime) unsubRuntime();
      shell.setTopBarActions(null);
      root.innerHTML = "";
    },
  };
}
