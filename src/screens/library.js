/**
 * Screen 01 — Presentation Library
 * Route: #/library
 *
 * Layout:
 *   Left Nav (shell) | Center: recent grid + all list | Right: detail panel
 */

import { createPresentationCard } from "../ui/presentation-card.js";
import { createEmptyState }       from "../ui/empty-state.js";

// ── Helpers ───────────────────────────────────────────────────────────────

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

// ── Top bar actions (search + new) ────────────────────────────────────────

function createTopBarActions({ onCreate, onSearch }) {
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;align-items:center;gap:8px;";

  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.className = "lib-search-input";
  searchInput.placeholder = "Search presentations…";
  searchInput.setAttribute("aria-label", "Search presentations");

  let searchTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => onSearch(searchInput.value.trim()), 300);
  });

  const newBtn = document.createElement("button");
  newBtn.type = "button";
  newBtn.className = "btn btn--primary btn--small";
  newBtn.textContent = "New +";
  newBtn.addEventListener("click", onCreate);

  wrap.appendChild(searchInput);
  wrap.appendChild(newBtn);
  return wrap;
}

// ── Screen ────────────────────────────────────────────────────────────────

export function mountLibrary({ store, router, shell }) {
  shell.setBreadcrumb([{ label: "Library" }]);

  // ── State ───────────────────────────────────────────────────────────────
  const state = {
    filter:      shell.getNavState().filter || "all",
    searchQuery: "",
    selectedId:  null,
  };

  // ── Top bar ─────────────────────────────────────────────────────────────
  const topBar = createTopBarActions({
    onCreate() {
      const p = store.create();
      router.navigate(`#/presentation/${p.id}`);
    },
    onSearch(query) {
      state.searchQuery = query;
      renderCenter();
    },
  });
  shell.setTopBarActions(topBar);

  // ── DOM structure ────────────────────────────────────────────────────────
  const root = document.getElementById("screen-root");
  root.innerHTML = `
    <div class="lib-screen">
      <div class="lib-center" id="lib-center"></div>
      <aside class="lib-detail" id="lib-detail" aria-label="Presentation detail"></aside>
    </div>
  `;

  const centerEl = document.getElementById("lib-center");
  const detailEl = document.getElementById("lib-detail");

  // ── Data helpers ─────────────────────────────────────────────────────────

  function getFiltered() {
    let list = state.searchQuery
      ? store.search(state.searchQuery)
      : store.getAll();
    if (state.filter && state.filter !== "all") {
      list = list.filter((p) => p.status === state.filter);
    }
    return list;
  }

  // ── Center panel ─────────────────────────────────────────────────────────

  function renderCenter() {
    centerEl.innerHTML = "";
    const all = getFiltered();

    if (all.length === 0) {
      const msg = state.searchQuery
        ? `No presentations match "${state.searchQuery}"`
        : "No presentations yet.";
      centerEl.appendChild(
        createEmptyState({
          message: msg,
          actionLabel: state.searchQuery ? undefined : "Create your first presentation",
          onAction: () => {
            const p = store.create();
            router.navigate(`#/presentation/${p.id}`);
          },
        })
      );
      return;
    }

    const recent = all.slice(0, 6);

    // ── Recent section ──────────────────────────────────────────────────
    const recentSection = document.createElement("section");
    recentSection.className = "lib-section";
    recentSection.innerHTML = `
      <div class="lib-section-header">
        <h2 class="lib-section-title">Recent</h2>
      </div>
      <div class="lib-card-grid" id="lib-card-grid"></div>
    `;
    centerEl.appendChild(recentSection);

    const gridEl = recentSection.querySelector("#lib-card-grid");
    recent.forEach((p) => {
      const card = createPresentationCard({
        presentation: p,
        isSelected: p.id === state.selectedId,
        onOpen()       { router.navigate(`#/presentation/${p.id}`); },
        onSelect()     { selectPresentation(p.id); },
        onCopyLink()   { copyPresentLink(p.id); },
        onRename(title) {
          store.update(p.id, { title });
          renderCenter();
          if (state.selectedId === p.id) renderDetail();
          shell.refreshNav();
        },
        onDuplicate() {
          store.duplicate(p.id);
          renderCenter();
        },
        onArchive() {
          if (state.selectedId === p.id) state.selectedId = null;
          store.archive(p.id);
          renderCenter();
          renderDetail();
          shell.refreshNav();
        },
        onDelete() {
          if (state.selectedId === p.id) state.selectedId = null;
          store.delete(p.id);
          renderCenter();
          renderDetail();
          shell.refreshNav();
        },
      });
      gridEl.appendChild(card);
    });

    // ── All presentations section ───────────────────────────────────────
    const allSection = document.createElement("section");
    allSection.className = "lib-section";
    allSection.innerHTML = `
      <div class="lib-section-header">
        <h2 class="lib-section-title">All Presentations</h2>
      </div>
      <div class="lib-list" id="lib-list" role="list"></div>
    `;
    centerEl.appendChild(allSection);

    renderList(allSection.querySelector("#lib-list"), all);
  }

  // ── All presentations flat list ───────────────────────────────────────

  function renderList(listEl, presentations) {
    // Header
    listEl.innerHTML = `
      <div class="lib-list-row lib-list-header" aria-hidden="true">
        <span>Name</span>
        <span>Scenes</span>
        <span>Status</span>
        <span>Updated</span>
        <span></span>
      </div>
    `;

    presentations.forEach((p) => {
      const row = document.createElement("div");
      row.className = `lib-list-row${p.id === state.selectedId ? " is-selected" : ""}`;
      row.setAttribute("role", "listitem");
      row.dataset.id = p.id;
      row.innerHTML = `
        <span class="lib-list-row__title" title="${esc(p.title)}">${esc(p.title)}</span>
        <span class="lib-list-row__cell">${p.scenes.length}</span>
        <span class="lib-list-row__cell">
          <span class="lib-status-badge lib-status-badge--${p.status}">${p.status}</span>
        </span>
        <span class="lib-list-row__cell">${relativeTime(p.updatedAt)}</span>
        <span class="lib-list-row__cell">
          <button type="button" class="btn btn--ghost btn--small" data-open="${esc(p.id)}">Open</button>
        </span>
      `;

      // Row click → select; Open button → navigate
      row.addEventListener("click", (e) => {
        if (e.target.closest("[data-open]")) return;
        selectPresentation(p.id);
      });

      listEl.appendChild(row);
    });

    // Open button delegation
    listEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open]");
      if (btn) {
        e.stopPropagation();
        router.navigate(`#/presentation/${btn.dataset.open}`);
      }
    });
  }

  // ── Selection ─────────────────────────────────────────────────────────

  function selectPresentation(id) {
    const prev = state.selectedId;
    state.selectedId = id;

    // Update card + row selected classes in place (no full re-render)
    if (prev) {
      document.querySelector(`.lib-card[data-id="${prev}"]`)?.classList.remove("is-selected");
      document.querySelector(`.lib-list-row[data-id="${prev}"]`)?.classList.remove("is-selected");
    }
    if (id) {
      document.querySelector(`.lib-card[data-id="${id}"]`)?.classList.add("is-selected");
      document.querySelector(`.lib-list-row[data-id="${id}"]`)?.classList.add("is-selected");
    }

    renderDetail();
  }

  // ── Right detail panel ────────────────────────────────────────────────

  function renderDetail() {
    detailEl.innerHTML = "";

    if (!state.selectedId) {
      detailEl.innerHTML = `
        <div class="lib-detail__empty">
          <p>Select a presentation<br>to see details</p>
        </div>
      `;
      return;
    }

    const p = store.getById(state.selectedId);
    if (!p) {
      state.selectedId = null;
      renderDetail();
      return;
    }

    detailEl.innerHTML = `
      <h2 class="lib-detail__title" id="detail-title">${esc(p.title)}</h2>
      <div class="lib-detail__meta">
        ${p.scenes.length} scene${p.scenes.length !== 1 ? "s" : ""}<br>
        <span class="lib-status-badge lib-status-badge--${p.status}">${p.status}</span><br>
        Updated ${relativeTime(p.updatedAt)}
      </div>
      <div class="lib-detail__actions">
        <button type="button" class="btn btn--primary"       id="detail-open">Open</button>
        <button type="button" class="btn btn--ghost btn--small" id="detail-copy-link">Copy Link</button>
        <div class="lib-detail__divider"></div>
        <button type="button" class="btn btn--ghost btn--small" id="detail-duplicate">Duplicate</button>
        <button type="button" class="btn btn--ghost btn--small" id="detail-rename">Rename</button>
        <button type="button" class="btn btn--ghost btn--small" id="detail-archive"
                style="color: var(--color-danger);">Archive</button>
        ${p.status === "archived" ? `
        <button type="button" class="btn btn--ghost btn--small" id="detail-delete"
                style="color: var(--color-danger); font-weight: 600;">Delete permanently</button>
        ` : ""}
      </div>
    `;

    detailEl.querySelector("#detail-open").addEventListener("click", () => {
      router.navigate(`#/presentation/${p.id}`);
    });

    detailEl.querySelector("#detail-copy-link").addEventListener("click", (e) => {
      copyPresentLink(p.id);
      const btn = e.currentTarget;
      const original = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => {
        btn.textContent = original || "Copy Link";
      }, 1500);
    });

    detailEl.querySelector("#detail-duplicate").addEventListener("click", () => {
      store.duplicate(p.id);
      renderCenter();
    });

    detailEl.querySelector("#detail-rename").addEventListener("click", () => {
      startDetailRename(p);
    });

    detailEl.querySelector("#detail-archive").addEventListener("click", () => {
      state.selectedId = null;
      store.archive(p.id);
      renderCenter();
      renderDetail();
      shell.refreshNav();
    });

    detailEl.querySelector("#detail-delete")?.addEventListener("click", () => {
      if (confirm(`Delete "${p.title}" permanently? This cannot be undone.`)) {
        state.selectedId = null;
        store.delete(p.id);
        renderCenter();
        renderDetail();
        shell.refreshNav();
      }
    });
  }

  function startDetailRename(p) {
    const titleEl = detailEl.querySelector("#detail-title");
    if (!titleEl) return;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "lib-detail__title-input";
    input.value = p.title;
    input.setAttribute("aria-label", "Rename presentation");

    let confirmed = false;

    function confirm() {
      if (confirmed) return;
      confirmed = true;
      const newTitle = input.value.trim() || p.title;
      store.update(p.id, { title: newTitle });
      renderCenter();
      renderDetail();
      shell.refreshNav();
    }

    input.addEventListener("blur", confirm);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter")  { e.preventDefault(); confirm(); }
      if (e.key === "Escape") { confirmed = true; renderDetail(); }
    });

    titleEl.replaceWith(input);
    input.focus();
    input.select();
  }

  // ── Nav filter subscription ───────────────────────────────────────────

  const unsubFilter = shell.onNavFilter(({ filter }) => {
    state.filter = filter;
    renderCenter();
  });

  // ── Initial render ────────────────────────────────────────────────────

  renderCenter();
  renderDetail();

  // ── Unmount ───────────────────────────────────────────────────────────

  return {
    unmount() {
      unsubFilter();
      shell.setTopBarActions(null);
      root.innerHTML = "";
    },
  };
}
