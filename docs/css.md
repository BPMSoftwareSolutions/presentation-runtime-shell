```css
:root {
  --bg: #0b1020;
  --panel: #121a30;
  --panel-2: #18213d;
  --panel-3: #0f1730;
  --text: #eef2ff;
  --muted: #a8b3cf;
  --border: rgba(255, 255, 255, 0.08);
  --accent: #8b5cf6;
  --accent-2: #a78bfa;
  --success: #34d399;
  --warning: #f59e0b;
  --danger: #f87171;
  --shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  --radius-lg: 20px;
  --radius-md: 14px;
  --radius-sm: 10px;
  --header-h: 72px;
  --bottom-h: 240px;
  --font: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
  background:
    radial-gradient(circle at top left, rgba(139, 92, 246, 0.16), transparent 28%),
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 24%),
    linear-gradient(180deg, #08101d 0%, #0b1020 100%);
  color: var(--text);
  font-family: var(--font);
}

body {
  min-height: 100vh;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

code,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-rows: var(--header-h) 1fr auto;
  gap: 16px;
  padding: 16px;
}

.shell-header,
.presenter-panel,
.experience-panel,
.shell-bottom-rail {
  background: rgba(18, 26, 48, 0.82);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.shell-header {
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.shell-header__brand,
.shell-header__meta,
.presenter-panel__header,
.experience-panel__header,
.experience-panel__footer,
.inspector-panel__header,
.timeline-panel__header,
.presenter-panel__footer,
.transport-controls {
  display: flex;
  align-items: center;
}

.shell-header__brand,
.presenter-identity {
  gap: 14px;
}

.shell-header__meta {
  gap: 20px;
}

.brand-mark,
.presenter-avatar {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: white;
  font-weight: 700;
  letter-spacing: 0.04em;
  box-shadow: 0 10px 24px rgba(139, 92, 246, 0.28);
}

.brand-eyebrow,
.panel-eyebrow,
.scene-meta__label,
.runtime-status__label,
.presenter-mode__label {
  margin: 0 0 4px;
  font-size: 11px;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--muted);
}

.deck-title,
.presenter-panel h2,
.experience-panel h2,
.timeline-panel h2,
.inspector-panel h2 {
  margin: 0;
  font-size: 20px;
  line-height: 1.2;
}

.shell-main {
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
  gap: 16px;
}

.presenter-panel,
.experience-panel {
  border-radius: var(--radius-lg);
  min-height: 0;
}

.presenter-panel {
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
}

.presenter-panel__header,
.presenter-panel__footer,
.experience-panel__header,
.experience-panel__footer {
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
}

.presenter-panel__footer,
.experience-panel__footer {
  border-bottom: 0;
  border-top: 1px solid var(--border);
  justify-content: space-between;
  gap: 16px;
}

.presenter-panel__body {
  padding: 20px;
  overflow: auto;
}

.scene-heading {
  margin-bottom: 18px;
}

.scene-heading h3 {
  margin: 4px 0 0;
  font-size: 28px;
  line-height: 1.15;
}

.presenter-transcript {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.presenter-block {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 16px 18px;
}

.presenter-block--active {
  border-color: rgba(139, 92, 246, 0.45);
  box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.12) inset;
}

.presenter-block p,
.presenter-block__text {
  margin: 0;
  font-size: 17px;
  line-height: 1.65;
  color: var(--text);
}

.presenter-cursor {
  display: inline-block;
  width: 10px;
  height: 1.15em;
  margin-left: 3px;
  vertical-align: text-bottom;
  background: var(--accent-2);
  border-radius: 3px;
  animation: blink 1s steps(1, end) infinite;
}

@keyframes blink {
  0%,
  45% {
    opacity: 1;
  }
  46%,
  100% {
    opacity: 0;
  }
}

.presenter-actions,
.scene-progress-dots,
.experience-panel__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.scene-progress-dots {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.scene-progress-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid var(--border);
}

.scene-progress-dot.is-active {
  background: var(--accent);
}

.scene-progress-dot.is-complete {
  background: var(--success);
}

.experience-panel {
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
}

.experience-frame-wrap {
  position: relative;
  min-height: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
}

.experience-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--muted);
  font-size: 14px;
  background: rgba(8, 12, 24, 0.45);
  z-index: 1;
  pointer-events: none;
}

.experience-frame {
  width: 100%;
  height: 100%;
  min-height: 420px;
  border: 0;
  display: block;
  background: white;
}

.shell-bottom-rail {
  border-radius: var(--radius-lg);
  min-height: var(--bottom-h);
  padding: 16px;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 360px;
  gap: 16px;
}

.transport-controls,
.timeline-panel,
.inspector-panel {
  min-width: 0;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.transport-controls {
  padding: 16px;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.timeline-panel,
.inspector-panel {
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.timeline-panel__header,
.inspector-panel__header {
  padding: 14px 16px;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

.timeline-list,
.event-log {
  list-style: none;
  padding: 0;
  margin: 0;
}

.timeline-list {
  padding: 12px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.timeline-item__button {
  width: 100%;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  color: inherit;
  border-radius: 14px;
  padding: 12px 14px;
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 12px;
  text-align: left;
}

.timeline-item.is-active .timeline-item__button {
  border-color: rgba(139, 92, 246, 0.5);
  background: rgba(139, 92, 246, 0.1);
}

.timeline-item__index {
  font-size: 12px;
  color: var(--muted);
  align-self: start;
  padding-top: 2px;
}

.timeline-item__title {
  display: block;
  font-size: 14px;
  line-height: 1.3;
  margin-bottom: 4px;
}

.timeline-item__meta {
  font-size: 12px;
  color: var(--muted);
}

.debug-panel {
  overflow: auto;
  padding: 12px 16px 16px;
  display: grid;
  gap: 14px;
}

.debug-group h3 {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--muted);
  font-weight: 600;
}

.debug-output,
.event-log {
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(5, 10, 20, 0.42);
  padding: 12px;
  font-size: 12px;
  line-height: 1.5;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.event-log {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn {
  appearance: none;
  border: 1px solid var(--border);
  color: var(--text);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 10px 14px;
  min-height: 42px;
  transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.18);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn--primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: white;
  border-color: transparent;
}

.btn--secondary {
  background: rgba(139, 92, 246, 0.12);
  border-color: rgba(139, 92, 246, 0.32);
}

.btn--ghost {
  background: rgba(255, 255, 255, 0.03);
}

.btn--small {
  min-height: 34px;
  padding: 7px 10px;
  font-size: 13px;
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 14px;
}

.toggle input {
  accent-color: var(--accent);
}

.is-hidden {
  display: none !important;
}

@media (max-width: 1200px) {
  .shell-main {
    grid-template-columns: 1fr;
  }

  .shell-bottom-rail {
    grid-template-columns: 1fr;
  }

  .experience-frame {
    min-height: 360px;
  }
}

@media (max-width: 720px) {
  .app-shell {
    padding: 12px;
    gap: 12px;
  }

  .shell-header {
    height: auto;
    padding: 14px;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .shell-header__meta {
    width: 100%;
    justify-content: space-between;
  }

  .scene-heading h3 {
    font-size: 22px;
  }

  .deck-title {
    font-size: 18px;
  }
}
```
