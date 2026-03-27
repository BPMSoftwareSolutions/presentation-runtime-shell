Here’s a **single CSS stylesheet** you can drop under the HTML scaffold from the last round. It’s tuned for a **dark, presentation-runtime-friendly demo UI** with strong hierarchy, polished cards, status treatments, and screen layouts that will read clearly in live demos and recorded walkthroughs. The structure is designed to support the 10-screen app flow we mapped from Thomas’s residential/commercial service concepts and the presentation-runtime scene approach.   

```css
:root {
  --bg: #08101d;
  --bg-elev: rgba(255, 255, 255, 0.035);
  --bg-elev-2: rgba(255, 255, 255, 0.055);
  --bg-elev-3: rgba(255, 255, 255, 0.08);

  --text: #eef2ff;
  --text-soft: #c7d2fe;
  --text-muted: #94a3b8;
  --text-dim: #64748b;

  --border: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.14);

  --green: #10b981;
  --amber: #f59e0b;
  --red: #ef4444;
  --violet: #a78bfa;
  --indigo: #818cf8;
  --cyan: #22d3ee;

  --shadow-lg:
    0 20px 60px rgba(0, 0, 0, 0.35),
    0 6px 18px rgba(0, 0, 0, 0.18);
  --shadow-md:
    0 12px 30px rgba(0, 0, 0, 0.22),
    0 4px 10px rgba(0, 0, 0, 0.14);

  --radius-xl: 24px;
  --radius-lg: 18px;
  --radius-md: 14px;
  --radius-sm: 10px;

  --content-max: 1440px;
  --gap-xl: 32px;
  --gap-lg: 24px;
  --gap-md: 16px;
  --gap-sm: 10px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.09), transparent 28%),
    radial-gradient(circle at bottom left, rgba(167, 139, 250, 0.14), transparent 32%),
    linear-gradient(180deg, #08101d 0%, #091321 100%);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  position: relative;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 85%);
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
  border: 1px solid rgba(167, 139, 250, 0.22);
  background: linear-gradient(180deg, rgba(167, 139, 250, 0.16), rgba(99, 102, 241, 0.08));
  color: var(--text);
  border-radius: 999px;
  padding: 10px 16px;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.14);
}

button:hover {
  transform: translateY(-1px);
  border-color: rgba(167, 139, 250, 0.42);
  background: linear-gradient(180deg, rgba(167, 139, 250, 0.24), rgba(99, 102, 241, 0.12));
}

button[aria-current="page"] {
  background: linear-gradient(180deg, rgba(16, 185, 129, 0.18), rgba(16, 185, 129, 0.09));
  border-color: rgba(16, 185, 129, 0.35);
}

input,
select,
textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.045);
  color: var(--text);
  padding: 12px 14px;
  outline: none;
  transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
}

input::placeholder,
textarea::placeholder {
  color: var(--text-dim);
}

input:focus,
select:focus,
textarea:focus {
  border-color: rgba(129, 140, 248, 0.55);
  box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.12);
  background: rgba(255, 255, 255, 0.065);
}

textarea {
  resize: vertical;
  min-height: 120px;
}

label,
legend {
  color: var(--text-soft);
  font-weight: 600;
  letter-spacing: 0.01em;
}

fieldset {
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.demo {
  width: min(100%, calc(var(--content-max) + 64px));
  margin: 0 auto;
  padding: 32px;
}

.screen {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: var(--gap-lg);
  padding: 32px 0 48px;
}

.screen::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 32px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.02), transparent 22%),
    radial-gradient(circle at 100% 0%, rgba(129, 140, 248, 0.08), transparent 28%);
  pointer-events: none;
  z-index: 0;
}

.screen > * {
  position: relative;
  z-index: 1;
}

.screen__header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 4px;
}

.screen__eyebrow {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--cyan);
  font-weight: 700;
}

.screen__title {
  margin: 0;
  font-size: clamp(34px, 4.2vw, 54px);
  line-height: 0.98;
  letter-spacing: -0.035em;
}

.screen__subtitle {
  margin: 0;
  max-width: 900px;
  color: var(--text-muted);
  font-size: 17px;
  line-height: 1.6;
}

.screen__toolbar,
.toolbar__actions,
.panel__header,
.form-actions,
.panel__footer,
.customer-profile__header,
.portal-header,
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.screen__toolbar,
.customer-profile,
.portal-shell,
.summary-strip,
.panel,
.status-card,
.decision-card {
  backdrop-filter: blur(16px);
}

.screen__toolbar {
  justify-content: space-between;
  padding: 16px 18px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
}

.toolbar__brand {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-soft);
}

.toolbar__search {
  flex: 1;
  max-width: 460px;
}

.summary-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--gap-md);
}

.summary-card,
.status-card,
.decision-card {
  padding: 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.025));
  box-shadow: var(--shadow-md);
}

.summary-card h2,
.status-card h3,
.decision-card h2 {
  margin: 0 0 8px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}

.summary-card p,
.status-card p,
.decision-card ul {
  margin: 0;
  font-size: 20px;
  line-height: 1.35;
  color: var(--text);
}

.screen__grid {
  display: grid;
  gap: var(--gap-lg);
}

.screen__grid--two-by-two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.screen__grid--two-column {
  grid-template-columns: 1.25fr 1fr;
}

.screen__grid--stack {
  grid-template-columns: 1fr;
}

.panel {
  padding: 22px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.024)),
    rgba(255,255,255,0.02);
  box-shadow: var(--shadow-lg);
}

.panel__header {
  justify-content: space-between;
  margin-bottom: 18px;
}

.panel__header h2,
.panel__header h3 {
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.02em;
}

.panel__footer,
.form-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-top: 18px;
}

.stats-list,
.detail-list,
.customer-profile__meta {
  display: grid;
  gap: 14px;
}

.stats-list div,
.detail-list div,
.customer-profile__meta div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255,255,255,0.05);
}

.stats-list dt,
.detail-list dt,
.customer-profile__meta dt {
  color: var(--text-muted);
  font-weight: 600;
}

.stats-list dd,
.detail-list dd,
.customer-profile__meta dd {
  margin: 0;
  color: var(--text);
  font-weight: 700;
  text-align: right;
}

.detail-list--inline {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.schedule-list,
.alert-list,
.timeline,
.document-actions,
.decision-card ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.schedule-list,
.alert-list,
.timeline,
.document-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-item,
.alert,
.timeline li,
.document-actions button {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.032);
}

.schedule-item {
  display: grid;
  grid-template-columns: 78px 1fr;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
}

.schedule-item time {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(129, 140, 248, 0.12);
  color: var(--text-soft);
  font-weight: 700;
  letter-spacing: 0.03em;
}

.schedule-item strong,
.alert strong {
  display: block;
  margin-bottom: 4px;
  font-size: 15px;
}

.schedule-item span,
.alert p,
.timeline li,
.report-preview ul,
.decision-card li {
  color: var(--text-muted);
  line-height: 1.5;
}

.alert {
  padding: 16px;
}

.alert--high {
  border-color: rgba(239, 68, 68, 0.28);
  background: linear-gradient(180deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04));
}

.alert--medium {
  border-color: rgba(245, 158, 11, 0.28);
  background: linear-gradient(180deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04));
}

.alert--low {
  border-color: rgba(16, 185, 129, 0.22);
  background: linear-gradient(180deg, rgba(16,185,129,0.1), rgba(16,185,129,0.035));
}

.customer-profile,
.portal-shell {
  display: flex;
  flex-direction: column;
  gap: var(--gap-lg);
  padding: 24px;
  border-radius: 30px;
  border: 1px solid var(--border-strong);
  background: rgba(255,255,255,0.03);
  box-shadow: var(--shadow-lg);
}

.customer-profile__header,
.portal-header {
  justify-content: space-between;
  align-items: flex-start;
}

.customer-profile__header h2,
.portal-header h2 {
  margin: 0 0 4px;
  font-size: 30px;
  letter-spacing: -0.03em;
}

.customer-profile__header p,
.portal-header p,
.portal-plan {
  margin: 0;
  color: var(--text-muted);
}

.tab-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tab-nav button {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
}

.app-form {
  display: flex;
  flex-direction: column;
  gap: var(--gap-lg);
}

.form-section {
  padding: 22px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.03);
  box-shadow: var(--shadow-md);
}

.form-section h2 {
  margin: 0 0 18px;
  font-size: 22px;
  letter-spacing: -0.02em;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-grid > label,
.textarea-field,
fieldset {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.checkbox-grid label,
.task-checklist label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.03);
  color: var(--text-soft);
  font-weight: 500;
}

input[type="checkbox"],
input[type="radio"] {
  width: 16px;
  height: 16px;
  accent-color: var(--violet);
  flex: 0 0 auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: 18px;
  background: rgba(255,255,255,0.02);
}

.data-table thead th {
  text-align: left;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  padding: 14px 16px;
  background: rgba(255,255,255,0.045);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.data-table tbody td {
  padding: 14px 16px;
  color: var(--text-soft);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.data-table tbody tr:hover {
  background: rgba(255,255,255,0.035);
}

.filter-bar {
  flex-wrap: wrap;
  gap: 10px;
}

.filter-bar button {
  padding-inline: 14px;
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.08);
}

.task-checklist {
  display: grid;
  gap: 10px;
  margin-top: 20px;
}

.task-checklist legend {
  margin-bottom: 12px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}

.report-preview {
  padding: 18px;
  border-radius: 18px;
  border: 1px solid rgba(16,185,129,0.18);
  background: linear-gradient(180deg, rgba(16,185,129,0.08), rgba(16,185,129,0.025));
}

.report-preview h3 {
  margin: 0 0 12px;
  font-size: 20px;
  letter-spacing: -0.02em;
}

.report-preview ul {
  margin: 0;
  padding-left: 18px;
}

.report-preview li + li {
  margin-top: 8px;
}

.decision-summary {
  display: grid;
  grid-template-columns: 1.2fr auto;
  gap: var(--gap-lg);
  align-items: end;
}

.decision-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;
}

.document-actions button {
  width: 100%;
  justify-content: flex-start;
  text-align: left;
  padding: 14px 16px;
  background: rgba(255,255,255,0.038);
  border-radius: 16px;
  border-color: rgba(255,255,255,0.07);
}

.portal-plan {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(16,185,129,0.1);
  border: 1px solid rgba(16,185,129,0.22);
  color: #d1fae5;
  font-weight: 700;
}

.status-card {
  border-color: rgba(245, 158, 11, 0.28);
  background: linear-gradient(180deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04));
}

.screen--dashboard .panel--alerts,
.screen--monitoring .panel--selected-alert,
.screen--compliance .panel:last-child,
.screen--annual-report .panel:last-child {
  border-color: rgba(129, 140, 248, 0.16);
}

.screen--customer-portal .panel,
.screen--monthly-report-generator .panel:last-child {
  background:
    linear-gradient(180deg, rgba(16,185,129,0.055), rgba(255,255,255,0.02)),
    rgba(255,255,255,0.02);
}

.screen--compliance .data-table tbody tr:nth-child(4) td {
  color: #fee2e2;
}

.screen--compliance .data-table tbody tr:nth-child(3) td {
  color: #fef3c7;
}

.screen--load-bank .data-table tbody tr td:nth-child(2):contains("No") {
  color: var(--red);
}

/* subtle entry polish */
.screen,
.panel,
.summary-card,
.customer-profile,
.portal-shell,
.form-section {
  animation: fadeUp 420ms ease both;
}

.panel:nth-of-type(2),
.form-section:nth-of-type(2) {
  animation-delay: 50ms;
}

.panel:nth-of-type(3),
.form-section:nth-of-type(3) {
  animation-delay: 100ms;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* responsive */
@media (max-width: 1200px) {
  .summary-strip,
  .screen__grid--two-by-two,
  .screen__grid--two-column,
  .decision-summary,
  .detail-list--inline {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .demo {
    padding: 20px;
  }

  .screen {
    padding: 20px 0 32px;
    min-height: auto;
  }

  .form-grid,
  .checkbox-grid {
    grid-template-columns: 1fr;
  }

  .screen__toolbar,
  .customer-profile__header,
  .portal-header {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar__search {
    max-width: none;
  }
}

@media (max-width: 640px) {
  .screen__title {
    font-size: 30px;
  }

  .panel,
  .form-section,
  .customer-profile,
  .portal-shell,
  .summary-card,
  .status-card,
  .decision-card {
    padding: 16px;
    border-radius: 18px;
  }

  .schedule-item {
    grid-template-columns: 1fr;
  }

  .schedule-item time {
    justify-self: start;
  }

  .data-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
```

## Recommended next move

I’d do one of these next:

1. **Convert this into 10 self-contained scene HTML files** for your presentation runtime.
2. **Add lightweight scene JS** so each screen animates in and can post `iframe:ready` / scene-complete events for autoplay.
