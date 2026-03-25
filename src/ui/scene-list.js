/**
 * SceneList — left rail component in the Workspace screen.
 *
 * Usage:
 *   const list = createSceneList({ store, presentationId, callbacks });
 *   containerEl.appendChild(list.el);
 *   list.render(scenes, activeIndex);   // full re-render
 *   list.setActiveIndex(index);         // lightweight active-state update
 */

let _activeMenu = null;

function closeSceneMenu() {
  if (_activeMenu) { _activeMenu.remove(); _activeMenu = null; }
}

// One document listener for all scene menus
if (typeof document !== "undefined" && !createSceneList._listenerAdded) {
  createSceneList._listenerAdded = true;
  document.addEventListener("click", () => closeSceneMenu(), true);
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function createSceneList({
  store,
  presentationId,
  onSelectScene,
  onAddScene,
  onMoveUp,
  onMoveDown,
  onDuplicateScene,
  onDeleteScene,
}) {
  const outer = document.createElement("div");
  outer.className = "ws-scene-list-inner";

  let _scenes = [];
  let _activeIndex = 0;

  // ── Render ───────────────────────────────────────────────────────────────

  function render(scenes, activeIndex) {
    _scenes = scenes;
    _activeIndex = activeIndex;

    outer.innerHTML = `
      <div class="ws-scene-list-header">
        <button type="button" class="btn btn--primary btn--small ws-add-scene-btn">
          + New Scene
        </button>
      </div>
      <div class="ws-scene-list-body" id="ws-scene-body">
        ${scenes.length === 0
          ? `<p class="ws-scene-list-empty">No scenes yet.</p>`
          : scenes.map((scene, i) => renderSceneItem(scene, i, activeIndex)).join("")
        }
      </div>
    `;

    outer.querySelector(".ws-add-scene-btn").addEventListener("click", onAddScene);
    wireItemEvents();
  }

  function renderSceneItem(scene, index, activeIndex) {
    return `
      <div class="ws-scene-item ${index === activeIndex ? "is-active" : ""}"
           data-index="${index}" role="button" tabindex="0"
           aria-current="${index === activeIndex ? "true" : "false"}">
        <span class="ws-scene-item__num">${String(index + 1).padStart(2, "0")}</span>
        <span class="ws-scene-item__title">${esc(scene.title)}</span>
        <div class="ws-scene-item__actions">
          <button type="button" class="ws-scene-action-btn"
                  data-action="up" data-index="${index}"
                  title="Move up" ${index === 0 ? "disabled" : ""}>↑</button>
          <button type="button" class="ws-scene-action-btn"
                  data-action="down" data-index="${index}"
                  title="Move down" ${index === _scenes.length - 1 ? "disabled" : ""}>↓</button>
          <button type="button" class="ws-scene-action-btn"
                  data-action="menu" data-index="${index}"
                  aria-label="Scene options" aria-haspopup="menu">···</button>
        </div>
      </div>
    `;
  }

  function wireItemEvents() {
    const body = outer.querySelector("#ws-scene-body");
    if (!body) return;

    body.addEventListener("click", (e) => {
      const actionBtn = e.target.closest("[data-action]");
      if (actionBtn) {
        e.stopPropagation();
        const idx = parseInt(actionBtn.dataset.index, 10);
        switch (actionBtn.dataset.action) {
          case "up":   if (!actionBtn.disabled) onMoveUp(idx);   break;
          case "down": if (!actionBtn.disabled) onMoveDown(idx); break;
          case "menu": openSceneMenu(actionBtn, idx);            break;
        }
        return;
      }
      const item = e.target.closest(".ws-scene-item");
      if (item) onSelectScene(parseInt(item.dataset.index, 10));
    });

    // Keyboard support for scene items
    body.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const item = e.target.closest(".ws-scene-item");
        if (item) {
          e.preventDefault();
          onSelectScene(parseInt(item.dataset.index, 10));
        }
      }
    });
  }

  // ── Overflow menu ────────────────────────────────────────────────────────

  function openSceneMenu(triggerBtn, sceneIndex) {
    closeSceneMenu();

    const menu = document.createElement("div");
    menu.className = "ws-scene-menu";
    menu.setAttribute("role", "menu");
    menu.innerHTML = `
      <button class="ws-scene-menu__item" role="menuitem" data-action="duplicate">Duplicate</button>
      <button class="ws-scene-menu__item ws-scene-menu__item--danger"
              role="menuitem" data-action="delete">Delete</button>
    `;

    menu.addEventListener("click", (e) => {
      e.stopPropagation();
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      closeSceneMenu();
      if (btn.dataset.action === "duplicate") onDuplicateScene(sceneIndex);
      if (btn.dataset.action === "delete")    onDeleteScene(sceneIndex);
    });

    triggerBtn.closest(".ws-scene-item__actions").appendChild(menu);
    _activeMenu = menu;
  }

  // ── Lightweight active-index update (no full re-render) ──────────────────

  function setActiveIndex(index) {
    _activeIndex = index;
    outer.querySelectorAll(".ws-scene-item").forEach((el, i) => {
      const active = i === index;
      el.classList.toggle("is-active", active);
      el.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  return {
    el: outer,
    render,
    setActiveIndex,
    /** Re-render with fresh data from the store. */
    refresh() {
      const p = store.getById(presentationId);
      if (p) render(p.scenes, _activeIndex);
    },
  };
}
