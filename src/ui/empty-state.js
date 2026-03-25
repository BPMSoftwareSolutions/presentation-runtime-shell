/**
 * Empty state component.
 * Returns a self-contained DOM element ready to append.
 */
export function createEmptyState({ message, actionLabel, onAction } = {}) {
  const el = document.createElement("div");
  el.className = "empty-state";

  const iconEl = document.createElement("div");
  iconEl.className = "empty-state__icon";
  iconEl.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
         stroke-linejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
      <path d="M7 8h10M7 12h6"/>
    </svg>
  `;

  const msgEl = document.createElement("p");
  msgEl.className = "empty-state__message";
  msgEl.textContent = message || "Nothing here yet.";

  el.appendChild(iconEl);
  el.appendChild(msgEl);

  if (actionLabel && typeof onAction === "function") {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--primary";
    btn.textContent = actionLabel;
    btn.addEventListener("click", onAction);
    el.appendChild(btn);
  }

  return el;
}
