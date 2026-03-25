/**
 * PresentationCard — grid card used in the library screen.
 *
 * Manages its own overflow menu and inline rename input.
 * Calls callbacks for data mutations; callers handle store writes + re-render.
 *
 * Usage:
 *   const card = createPresentationCard({
 *     presentation, isSelected,
 *     onOpen, onSelect, onRename, onDuplicate, onArchive
 *   });
 *   gridEl.appendChild(card);
 */

// Module-level: one overflow menu open at a time across all cards.
let _activeMenu = null;

function ensureGlobalMenuListener() {
  if (ensureGlobalMenuListener._added) return;
  ensureGlobalMenuListener._added = true;
  document.addEventListener(
    "click",
    () => {
      if (_activeMenu) {
        _activeMenu.remove();
        _activeMenu = null;
      }
    },
    true // capture — fires before card's own click handlers
  );
}

function closeActiveMenu() {
  if (_activeMenu) {
    _activeMenu.remove();
    _activeMenu = null;
  }
}

function relativeTime(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function createPresentationCard({
  presentation,
  isSelected,
  onOpen,
  onSelect,
  onCopyLink,
  onRename,
  onDuplicate,
  onArchive,
  onDelete,
}) {
  ensureGlobalMenuListener();

  const card = document.createElement("div");
  card.className = `lib-card${isSelected ? " is-selected" : ""}`;
  card.dataset.id = presentation.id;

  function renderCard() {
    card.innerHTML = `
      <div class="lib-card__title">${esc(presentation.title)}</div>
      <div class="lib-card__meta">
        ${presentation.scenes.length} scene${presentation.scenes.length !== 1 ? "s" : ""}
        &nbsp;·&nbsp; updated ${relativeTime(presentation.updatedAt)}
      </div>
      <div class="lib-card__footer">
        <span class="lib-status-badge lib-status-badge--${presentation.status}">
          ${presentation.status}
        </span>
        <div class="lib-card__overflow">
          <button
            type="button"
            class="btn btn--ghost btn--small lib-card__overflow-btn"
            aria-label="More options for ${esc(presentation.title)}"
            aria-haspopup="menu"
          >···</button>
        </div>
      </div>
    `;

    // Card body click → select (but not when clicking Open or overflow)
    card.addEventListener("click", (e) => {
      if (e.target.closest(".lib-card__overflow-btn")) return;
      onSelect();
    });

    // Overflow button → open menu
    card.querySelector(".lib-card__overflow-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openOverflowMenu(e.currentTarget);
    });
  }

  function openOverflowMenu(triggerEl) {
    closeActiveMenu();

    const menu = document.createElement("div");
    menu.className = "lib-overflow-menu";
    menu.setAttribute("role", "menu");
    const deleteItem = presentation.status === "archived"
      ? `<button class="lib-overflow-menu__item lib-overflow-menu__item--danger"
                 role="menuitem" data-action="delete">Delete permanently</button>`
      : "";

    menu.innerHTML = `
      <button class="lib-overflow-menu__item" role="menuitem" data-action="duplicate">Duplicate</button>
      <button class="lib-overflow-menu__item" role="menuitem" data-action="rename">Rename</button>
      <button class="lib-overflow-menu__item" role="menuitem" data-action="copy-link">Copy Link</button>
      <button class="lib-overflow-menu__item lib-overflow-menu__item--danger"
              role="menuitem" data-action="archive">Archive</button>
      ${deleteItem}
    `;

    menu.addEventListener("click", (e) => {
      e.stopPropagation();
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      closeActiveMenu();
      switch (btn.dataset.action) {
        case "duplicate": onDuplicate(); break;
        case "rename":    startRename(); break;
        case "copy-link": if (onCopyLink) onCopyLink(); break;
        case "archive":   onArchive();   break;
        case "delete":
          if (confirm(`Delete "${presentation.title}" permanently? This cannot be undone.`)) {
            onDelete();
          }
          break;
      }
    });

    triggerEl.closest(".lib-card__overflow").appendChild(menu);
    _activeMenu = menu;
  }

  function startRename() {
    const titleEl = card.querySelector(".lib-card__title");
    if (!titleEl) return;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "lib-card__title-input";
    input.value = presentation.title;
    input.setAttribute("aria-label", "Rename presentation");

    let confirmed = false;

    function confirm() {
      if (confirmed) return;
      confirmed = true;
      const newTitle = input.value.trim() || presentation.title;
      if (newTitle !== presentation.title) {
        onRename(newTitle);
      } else {
        // No change — just restore the title element
        renderCard();
      }
    }

    input.addEventListener("blur", confirm);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); confirm(); }
      if (e.key === "Escape") { confirmed = true; renderCard(); }
    });

    titleEl.replaceWith(input);
    input.focus();
    input.select();
  }

  renderCard();
  return card;
}
