/**
 * InspectorPanel — right-rail component in the Workspace screen.
 *
 * Usage:
 *   const inspector = createInspectorPanel({ store, presentationId, callbacks });
 *   containerEl.appendChild(inspector.el);
 *   inspector.update(scene, presentation);  // call whenever active scene changes
 */

const SCENE_TYPES = [
  "narrative",
  "chart",
  "framework",
  "timeline",
  "closing",
  "title",
];

const ADVANCE_TYPES = [
  { value: "manual",       label: "Manual (Space / →)" },
  { value: "auto",         label: "Auto (immediately)" },
  { value: "delay",        label: "Timer (ms delay)" },
  { value: "waitForEvent", label: "Wait for iframe event" },
];

const PLAYBACK_MODES = [
  { value: "interactive", label: "Interactive" },
  { value: "autoplay",    label: "Autoplay" },
  { value: "capture",     label: "Capture (deterministic)" },
];

const PRESENT_CONTROLS_POSITIONS = [
  { value: "bottom", label: "Bottom" },
  { value: "top",    label: "Top" },
];

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function createInspectorPanel({
  store,
  presentationId,
  onDuplicateScene,
  onDeleteScene,
  onRegenerate,
  onSettingsChange,
}) {
  const el = document.createElement("div");
  el.className = "ws-inspector-inner";

  let _scene = null;
  let _presentation = null;

  // ── Render ───────────────────────────────────────────────────────────────

  function update(scene, presentation) {
    _scene = scene;
    _presentation = presentation;
    render();
  }

  function render() {
    el.innerHTML = "";

    if (!_scene) {
      el.innerHTML = `<p class="ws-inspector-empty">Select a scene to inspect.</p>`;
      return;
    }

    const s = _scene;
    const p = _presentation;
    const advance = s.advance || { type: "manual" };
    const settings = p.settings || {};

    el.innerHTML = `
      <div class="ws-inspector-section">
        <label class="ws-inspector-label" for="ws-insp-title">Title</label>
        <input
          id="ws-insp-title"
          class="ws-inspector-input"
          type="text"
          value="${esc(s.title)}"
          aria-label="Scene title"
        />
      </div>

      <div class="ws-inspector-section">
        <label class="ws-inspector-label" for="ws-insp-type">Type</label>
        <select id="ws-insp-type" class="ws-inspector-select" aria-label="Scene type">
          ${SCENE_TYPES.map(
            (t) => `<option value="${t}" ${s.type === t ? "selected" : ""}>${t}</option>`
          ).join("")}
        </select>
      </div>

      <div class="ws-inspector-divider"></div>

      <div class="ws-inspector-section">
        <label class="ws-inspector-label" for="ws-insp-advance">Advance</label>
        <select id="ws-insp-advance" class="ws-inspector-select" aria-label="Advance type">
          ${ADVANCE_TYPES.map(
            ({ value, label }) =>
              `<option value="${value}" ${advance.type === value ? "selected" : ""}>${label}</option>`
          ).join("")}
        </select>
      </div>

      <div class="ws-inspector-section ${advance.type === "delay" ? "" : "is-hidden"}"
           id="ws-insp-delay-row">
        <label class="ws-inspector-label" for="ws-insp-delay">Delay (ms)</label>
        <input
          id="ws-insp-delay"
          class="ws-inspector-input"
          type="number"
          min="0"
          step="100"
          value="${advance.delayMs ?? 2000}"
          aria-label="Delay in milliseconds"
        />
      </div>

      <div class="ws-inspector-section ${advance.type === "waitForEvent" ? "" : "is-hidden"}"
           id="ws-insp-event-row">
        <label class="ws-inspector-label" for="ws-insp-event">Event name</label>
        <input
          id="ws-insp-event"
          class="ws-inspector-input"
          type="text"
          value="${esc(advance.event || "")}"
          placeholder="e.g. chart:animated"
          aria-label="iframe event name"
        />
      </div>

      <div class="ws-inspector-divider"></div>

      <div class="ws-inspector-section">
        <span class="ws-inspector-label">Presentation settings</span>
      </div>

      <div class="ws-inspector-section">
        <label class="ws-inspector-label" for="ws-insp-playback">Playback mode</label>
        <select id="ws-insp-playback" class="ws-inspector-select" aria-label="Playback mode">
          ${PLAYBACK_MODES.map(
            ({ value, label }) =>
              `<option value="${value}" ${(settings.playbackMode || "interactive") === value ? "selected" : ""}>${label}</option>`
          ).join("")}
        </select>
      </div>

      <div class="ws-inspector-section">
        <label class="ws-inspector-label" for="ws-insp-between">Between scenes (ms)</label>
        <input
          id="ws-insp-between"
          class="ws-inspector-input"
          type="number"
          min="0"
          step="100"
          value="${settings.betweenScenesMs ?? 1800}"
          aria-label="Delay between scenes in milliseconds"
        />
      </div>

      <div class="ws-inspector-section">
        <label class="ws-inspector-label" for="ws-insp-typing">Typing speed (ms/char)</label>
        <input
          id="ws-insp-typing"
          class="ws-inspector-input"
          type="number"
          min="0"
          step="1"
          value="${settings.typingSpeedMs ?? 24}"
          aria-label="Typing speed in milliseconds per character"
        />
      </div>

      <div class="ws-inspector-section">
        <label class="ws-inspector-label" for="ws-insp-present-controls">Link-only controls position</label>
        <select id="ws-insp-present-controls" class="ws-inspector-select" aria-label="Link-only controls position">
          ${PRESENT_CONTROLS_POSITIONS.map(
            ({ value, label }) =>
              `<option value="${value}" ${(settings.presentControlsPosition || "bottom") === value ? "selected" : ""}>${label}</option>`
          ).join("")}
        </select>
      </div>

      <div class="ws-inspector-divider"></div>

      <div class="ws-inspector-section">
        <span class="ws-inspector-label">Presentation status</span>
        <span class="lib-status-badge lib-status-badge--${p.status}">${p.status}</span>
      </div>

      <div class="ws-inspector-divider"></div>

      <div class="ws-inspector-actions">
        <button type="button" class="btn btn--ghost btn--small ws-insp-btn"
                id="ws-insp-regenerate">Regenerate</button>
        <button type="button" class="btn btn--ghost btn--small ws-insp-btn"
                id="ws-insp-duplicate">Duplicate</button>
        <button type="button" class="btn btn--ghost btn--small ws-insp-btn ws-insp-btn--danger"
                id="ws-insp-delete">Delete</button>
      </div>
    `;

    // ── Scene title ───────────────────────────────────────────────────────

    const titleInput = el.querySelector("#ws-insp-title");
    titleInput.addEventListener("blur", () => {
      const newTitle = titleInput.value.trim() || s.title;
      if (newTitle !== s.title) {
        store.updateScene(presentationId, s.id, { title: newTitle });
      }
    });
    titleInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); titleInput.blur(); }
      if (e.key === "Escape") { titleInput.value = s.title; titleInput.blur(); }
    });

    // ── Scene type ────────────────────────────────────────────────────────

    el.querySelector("#ws-insp-type").addEventListener("change", (e) => {
      store.updateScene(presentationId, s.id, { type: e.target.value });
    });

    // ── Advance type + conditional inputs ─────────────────────────────────

    const advanceSelect = el.querySelector("#ws-insp-advance");
    const delayRow      = el.querySelector("#ws-insp-delay-row");
    const eventRow      = el.querySelector("#ws-insp-event-row");
    const delayInput    = el.querySelector("#ws-insp-delay");
    const eventInput    = el.querySelector("#ws-insp-event");

    function saveAdvance() {
      const type = advanceSelect.value;
      const next = { type };
      if (type === "delay")        next.delayMs = Math.max(0, parseInt(delayInput.value, 10) || 0);
      if (type === "waitForEvent") next.event   = eventInput.value.trim();
      store.updateScene(presentationId, s.id, { advance: next });
    }

    advanceSelect.addEventListener("change", () => {
      const type = advanceSelect.value;
      delayRow.classList.toggle("is-hidden", type !== "delay");
      eventRow.classList.toggle("is-hidden", type !== "waitForEvent");
      saveAdvance();
    });

    delayInput.addEventListener("blur", saveAdvance);
    delayInput.addEventListener("keydown", (e) => { if (e.key === "Enter") delayInput.blur(); });

    eventInput.addEventListener("blur", saveAdvance);
    eventInput.addEventListener("keydown", (e) => { if (e.key === "Enter") eventInput.blur(); });

    // ── Presentation settings ─────────────────────────────────────────────

    function saveSettings(partial) {
      const fresh = store.getById(presentationId);
      const merged = { ...((fresh || {}).settings || {}), ...partial };
      store.update(presentationId, { settings: merged });
      if (typeof onSettingsChange === "function") onSettingsChange(partial);
    }

    el.querySelector("#ws-insp-playback").addEventListener("change", (e) => {
      saveSettings({ playbackMode: e.target.value });
    });

    const betweenInput = el.querySelector("#ws-insp-between");
    betweenInput.addEventListener("blur", () => {
      saveSettings({ betweenScenesMs: Math.max(0, parseInt(betweenInput.value, 10) || 0) });
    });
    betweenInput.addEventListener("keydown", (e) => { if (e.key === "Enter") betweenInput.blur(); });

    const typingInput = el.querySelector("#ws-insp-typing");
    typingInput.addEventListener("blur", () => {
      saveSettings({ typingSpeedMs: Math.max(0, parseInt(typingInput.value, 10) || 0) });
    });
    typingInput.addEventListener("keydown", (e) => { if (e.key === "Enter") typingInput.blur(); });

    el.querySelector("#ws-insp-present-controls").addEventListener("change", (e) => {
      const value = e.target.value === "top" ? "top" : "bottom";
      saveSettings({ presentControlsPosition: value });
    });

    // ── Actions ───────────────────────────────────────────────────────────

    el.querySelector("#ws-insp-regenerate").addEventListener("click", () => {
      if (typeof onRegenerate === "function") onRegenerate(s);
    });
    el.querySelector("#ws-insp-duplicate").addEventListener("click", () => {
      onDuplicateScene(s.id);
    });
    el.querySelector("#ws-insp-delete").addEventListener("click", () => {
      onDeleteScene(s.id);
    });
  }

  return { el, update };
}
