/**
 * App shell — the persistent frame for the whole application.
 *
 * Renders once into #app and never unmounts. Every route swap
 * replaces only the content inside #screen-root.
 *
 * Returns a shell controller used by screens and main.js:
 *   setScreen(mountFn)          — swap screen content
 *   setBreadcrumb(parts)        — update top-bar breadcrumb
 *   setTopBarActions(el)        — replace top-bar action buttons
 *   onNavFilter(handler)        — subscribe to left-nav filter clicks
 *   getNavState()               — current { filter, sort } values
 *   refreshNav()                — re-render left nav (call after store writes)
 */
export function mountAppShell({ store, router }) {
  const app = document.getElementById("app");

  // ── Build DOM ─────────────────────────────────────────────────────────────
  app.innerHTML = `
    <div class="prs-shell">
      <header class="prs-top-bar">
        <div class="prs-top-bar__brand">
          <div class="prs-brand-mark">APS</div>
          <span class="prs-brand-label">AI Presentation System</span>
        </div>
        <nav class="prs-top-bar__breadcrumb" id="prs-breadcrumb" aria-label="Breadcrumb"></nav>
        <div class="prs-top-bar__actions" id="prs-top-actions"></div>
      </header>
      <div class="prs-body">
        <nav class="prs-left-nav" id="prs-left-nav" aria-label="Library navigation"></nav>
        <main class="prs-screen-slot" id="screen-root"></main>
      </div>
    </div>
  `;

  const leftNavEl   = document.getElementById("prs-left-nav");
  const breadcrumbEl = document.getElementById("prs-breadcrumb");
  const topActionsEl = document.getElementById("prs-top-actions");
  const screenRoot   = document.getElementById("screen-root");

  // ── State ─────────────────────────────────────────────────────────────────
  let activeFilter = "all";
  let activeSort   = "updated";
  let currentUnmount = null;
  const filterListeners = [];

  // ── Left nav renderer ─────────────────────────────────────────────────────
  function renderLeftNav() {
    const hash = location.hash || "#/library";
    const onLibrary = hash.startsWith("#/library") || hash === "#/" || hash === "#";

    // Collect tags and collections from store for conditional sections
    const all = store.getAll();
    const tags        = [...new Set(all.flatMap((p) => p.tags || []))].sort();
    const collections = [...new Set(all.flatMap((p) => p.collections || []))].sort();

    const filterItems = [
      { key: "all",      label: "All" },
      { key: "draft",    label: "Drafts" },
      { key: "ready",    label: "Ready" },
      { key: "archived", label: "Archived" },
    ];

    leftNavEl.innerHTML = `
      <div class="prs-nav-section">
        <button
          class="prs-nav-item ${onLibrary && activeFilter === "all" ? "is-active" : ""}"
          data-action="nav-library"
          aria-current="${onLibrary && activeFilter === "all" ? "page" : "false"}"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <rect x="1" y="2" width="14" height="2.5" rx="1"/>
            <rect x="1" y="6.5" width="9" height="2.5" rx="1"/>
            <rect x="1" y="11" width="11" height="2.5" rx="1"/>
          </svg>
          Library
        </button>
      </div>

      <div class="prs-nav-divider"></div>

      <div class="prs-nav-section">
        <div class="prs-nav-section-label">Status</div>
        ${filterItems
          .map(
            ({ key, label }) => `
          <button
            class="prs-nav-item ${onLibrary && activeFilter === key && key !== "all" ? "is-active" : ""}"
            data-action="filter"
            data-filter="${key}"
          >${label}</button>
        `
          )
          .join("")}
      </div>

      ${
        collections.length > 0
          ? `
        <div class="prs-nav-divider"></div>
        <div class="prs-nav-section">
          <div class="prs-nav-section-label">Collections</div>
          ${collections
            .map(
              (c) => `
            <button class="prs-nav-item" data-action="collection" data-value="${c}">${c}</button>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      ${
        tags.length > 0
          ? `
        <div class="prs-nav-divider"></div>
        <div class="prs-nav-section">
          <div class="prs-nav-section-label">Tags</div>
          ${tags
            .map(
              (t) => `
            <button class="prs-nav-item" data-action="tag" data-value="${t}">${t}</button>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }
    `;
  }

  // ── Nav click delegation ──────────────────────────────────────────────────
  leftNavEl.addEventListener("click", (e) => {
    const item = e.target.closest("[data-action]");
    if (!item) return;

    const action = item.dataset.action;

    if (action === "nav-library") {
      activeFilter = "all";
      router.navigate("#/library");
      return;
    }

    if (action === "filter") {
      activeFilter = item.dataset.filter;
      renderLeftNav();
      filterListeners.forEach((fn) => fn({ filter: activeFilter, sort: activeSort }));
      // If not already on library, navigate there
      if (!location.hash.startsWith("#/library")) {
        router.navigate("#/library");
      }
      return;
    }

    if (action === "collection" || action === "tag") {
      // Navigate to library — the screen handles filtering by collection/tag
      router.navigate("#/library");
    }
  });

  // Re-render nav on every route change
  window.addEventListener("hashchange", renderLeftNav);
  renderLeftNav();

  // ── Shell controller ──────────────────────────────────────────────────────
  return {
    /**
     * Swap the active screen.
     * mountFn is called with no arguments and must return { unmount() }.
     * Any previously mounted screen's unmount() is called first.
     */
    setScreen(mountFn) {
      if (currentUnmount) {
        currentUnmount();
        currentUnmount = null;
      }
      screenRoot.innerHTML = "";
      const result = mountFn();
      if (result && typeof result.unmount === "function") {
        currentUnmount = result.unmount;
      }
      renderLeftNav();
    },

    /**
     * Update the breadcrumb in the top bar.
     * parts: Array of { label: string, href?: string }
     * The last part is rendered as the current page (no link).
     */
    setBreadcrumb(parts) {
      if (!parts || parts.length === 0) {
        breadcrumbEl.innerHTML = "";
        return;
      }
      breadcrumbEl.innerHTML = parts
        .map((part, i) => {
          const isLast = i === parts.length - 1;
          if (isLast) {
            return `<span class="prs-breadcrumb-current">${part.label}</span>`;
          }
          return `
            <a class="prs-breadcrumb-link" href="${part.href || "#/library"}"
               onclick="event.preventDefault(); location.hash='${part.href || "#/library"}'">
              ${part.label}
            </a>
            <span class="prs-breadcrumb-sep" aria-hidden="true">/</span>
          `;
        })
        .join("");
    },

    /**
     * Replace the top-bar action button area.
     * Pass an Element (or null to clear).
     */
    setTopBarActions(el) {
      topActionsEl.innerHTML = "";
      if (el instanceof Element) topActionsEl.appendChild(el);
    },

    /**
     * Subscribe to left-nav filter/sort changes.
     * handler({ filter, sort }) is called whenever the active filter changes.
     * Returns an unsubscribe function.
     */
    onNavFilter(handler) {
      filterListeners.push(handler);
      return () => {
        const idx = filterListeners.indexOf(handler);
        if (idx >= 0) filterListeners.splice(idx, 1);
      };
    },

    /** Current left-nav filter and sort state. */
    getNavState() {
      return { filter: activeFilter, sort: activeSort };
    },

    /**
     * Force a left-nav re-render.
     * Call after store writes that add/remove tags or collections.
     */
    refreshNav() {
      renderLeftNav();
    },
  };
}
