Here’s a **presentation-grade CSS system** for Molly’s demo that is designed to feel like a real product, not just slides.

It is optimized for:

* **high-end dark UI**
* **crisp information hierarchy**
* **animated state transitions**
* **professional scheduling/timeline components**
* **interactive-looking controls**
* **strong “review + observe + update” UX**

---

# Design intent

This system should make Molly feel like she is using:

* a **real scheduling workstation**
* a **constraint-aware assistant**
* a **live planning surface**
* a **tool that explains changes instead of hiding them**

The visual tone should be:

* calm
* trustworthy
* premium
* clear under pressure

---

# 1) Core presentation CSS system

Use this as the shared base across all scenes.

```css
:root {
  --bg: #07111f;
  --bg-2: #0b1728;
  --panel: rgba(255,255,255,0.045);
  --panel-2: rgba(255,255,255,0.065);
  --panel-3: rgba(255,255,255,0.085);
  --panel-strong: rgba(11, 23, 40, 0.92);

  --text: #edf4ff;
  --text-soft: #b8c7df;
  --text-dim: #70819a;
  --text-faint: #4d5f77;

  --line: rgba(255,255,255,0.08);
  --line-strong: rgba(255,255,255,0.14);

  --violet: #a78bfa;
  --violet-2: #8b5cf6;
  --indigo: #7c9cff;
  --cyan: #56d8ff;
  --green: #20c997;
  --amber: #f5b94c;
  --red: #ff6a6a;
  --rose: #ff7db8;

  --shadow-lg:
    0 20px 40px rgba(0,0,0,0.34),
    0 6px 14px rgba(0,0,0,0.24);

  --shadow-md:
    0 14px 28px rgba(0,0,0,0.26),
    0 4px 10px rgba(0,0,0,0.18);

  --radius-xl: 28px;
  --radius-lg: 22px;
  --radius-md: 16px;
  --radius-sm: 12px;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  background:
    radial-gradient(circle at top left, rgba(139,92,246,0.12), transparent 34%),
    radial-gradient(circle at bottom right, rgba(32,201,151,0.10), transparent 30%),
    linear-gradient(180deg, #081320 0%, #07111f 100%);
  color: var(--text);
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
  overflow: hidden;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.3));
  pointer-events: none;
}

.scene {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.shell-topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow-md);
}

.shell-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--violet);
  font-weight: 700;
}

.shell-spacer {
  flex: 1;
}

.shell-mode-badge,
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.05);
  color: var(--text-soft);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.badge--violet {
  color: var(--violet);
  border-color: rgba(167,139,250,0.28);
  background: rgba(167,139,250,0.10);
}

.badge--green {
  color: var(--green);
  border-color: rgba(32,201,151,0.28);
  background: rgba(32,201,151,0.10);
}

.badge--amber {
  color: var(--amber);
  border-color: rgba(245,185,76,0.28);
  background: rgba(245,185,76,0.10);
}

.badge--red {
  color: var(--red);
  border-color: rgba(255,106,106,0.28);
  background: rgba(255,106,106,0.10);
}

.layout-2col {
  display: grid;
  grid-template-columns: 1.05fr 1.25fr;
  gap: 18px;
  min-height: 0;
  flex: 1;
}

.layout-3col {
  display: grid;
  grid-template-columns: 0.95fr 1.4fr 0.95fr;
  gap: 18px;
  min-height: 0;
  flex: 1;
}

.panel {
  position: relative;
  min-height: 0;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.06), transparent 28%);
  pointer-events: none;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--line);
  background: rgba(255,255,255,0.03);
}

.panel-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 800;
  color: var(--text-soft);
}

.panel-subtitle {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-dim);
}

.panel-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
}

.eyebrow {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--violet);
  font-weight: 800;
}

.hero-title {
  font-size: clamp(34px, 5vw, 56px);
  line-height: 1.02;
  letter-spacing: -0.04em;
  font-weight: 800;
}

.hero-gradient {
  background: linear-gradient(135deg, #f6f8ff 0%, #b8a7ff 45%, #75dbff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-copy {
  max-width: 760px;
  font-size: 18px;
  line-height: 1.65;
  color: var(--text-soft);
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.kpi-card {
  border: 1px solid var(--line);
  border-radius: 20px;
  background: rgba(255,255,255,0.045);
  padding: 16px;
  box-shadow: var(--shadow-md);
  transition:
    transform 320ms var(--ease-out),
    border-color 320ms var(--ease-out),
    background 320ms var(--ease-out);
}

.kpi-card:hover {
  transform: translateY(-3px);
  border-color: var(--line-strong);
  background: rgba(255,255,255,0.065);
}

.kpi-label {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 10px;
}

.kpi-value {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.kpi-sub {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-soft);
}

.metric-trend {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.metric-trend--up {
  color: var(--green);
  background: rgba(32,201,151,0.10);
}

.metric-trend--down {
  color: var(--red);
  background: rgba(255,106,106,0.10);
}

.metric-trend--warn {
  color: var(--amber);
  background: rgba(245,185,76,0.10);
}

.card-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.card-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.info-card {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(255,255,255,0.04);
  padding: 16px;
  min-height: 140px;
}

.info-card-title {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
}

.info-card-copy {
  color: var(--text-soft);
  line-height: 1.6;
  font-size: 14px;
}

.student-list,
.constraint-list,
.step-list,
.delta-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.03);
}

.list-row:hover {
  background: rgba(255,255,255,0.06);
}

.row-leading-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot--green { background: var(--green); box-shadow: 0 0 12px rgba(32,201,151,0.5); }
.dot--amber { background: var(--amber); box-shadow: 0 0 12px rgba(245,185,76,0.5); }
.dot--red { background: var(--red); box-shadow: 0 0 12px rgba(255,106,106,0.5); }
.dot--violet { background: var(--violet); box-shadow: 0 0 12px rgba(167,139,250,0.5); }

.row-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.row-meta {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-dim);
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.04);
  color: var(--text-soft);
  font-size: 12px;
  font-weight: 600;
}

.chip--interactive {
  transition:
    background 220ms var(--ease-out),
    border-color 220ms var(--ease-out),
    transform 220ms var(--ease-out);
}

.chip--interactive:hover {
  background: rgba(167,139,250,0.10);
  border-color: rgba(167,139,250,0.26);
  transform: translateY(-2px);
}

.ai-panel {
  border: 1px solid rgba(167,139,250,0.24);
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(167,139,250,0.10), rgba(167,139,250,0.05));
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.ai-panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(167,139,250,0.18);
}

.ai-orb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle, #d5cbff 0%, var(--violet) 60%, transparent 70%);
  box-shadow: 0 0 16px rgba(167,139,250,0.65);
}

.ai-title {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--violet);
}

.ai-panel-body {
  padding: 16px;
  color: var(--text-soft);
  line-height: 1.7;
  font-size: 14px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  min-height: 40px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.05);
  color: var(--text);
  font-size: 13px;
  font-weight: 700;
  cursor: default;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: var(--shadow-md);
  transition:
    transform 260ms var(--ease-out),
    background 260ms var(--ease-out),
    border-color 260ms var(--ease-out);
}

.btn:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.075);
  border-color: var(--line-strong);
}

.btn--primary {
  background: linear-gradient(135deg, rgba(124,156,255,0.22), rgba(167,139,250,0.20));
  border-color: rgba(124,156,255,0.32);
}

.btn--success {
  background: linear-gradient(135deg, rgba(32,201,151,0.18), rgba(86,216,255,0.12));
  border-color: rgba(32,201,151,0.28);
}

.btn--danger {
  background: linear-gradient(135deg, rgba(255,106,106,0.18), rgba(255,125,184,0.10));
  border-color: rgba(255,106,106,0.28);
}

.progress-track {
  position: relative;
  height: 8px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--violet), var(--cyan));
  transition: width 900ms var(--ease-out);
}

.progress-fill--green {
  background: linear-gradient(90deg, #22c55e, #2dd4bf);
}

.progress-fill--amber {
  background: linear-gradient(90deg, #f59e0b, #facc15);
}

.progress-fill--red {
  background: linear-gradient(90deg, #fb7185, #ff6a6a);
}

.ring-gauge {
  --pct: 72;
  --size: 64px;
  --stroke: 8;
  --circumference: 213.63;
  position: relative;
  width: var(--size);
  height: var(--size);
}

.ring-gauge svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-gauge .track {
  fill: none;
  stroke: rgba(255,255,255,0.08);
  stroke-width: var(--stroke);
}

.ring-gauge .value {
  fill: none;
  stroke: var(--violet);
  stroke-width: var(--stroke);
  stroke-linecap: round;
  stroke-dasharray: calc(var(--circumference) * var(--pct) / 100) var(--circumference);
  filter: drop-shadow(0 0 10px rgba(167,139,250,0.35));
  transition: stroke-dasharray 900ms var(--ease-out);
}

.ring-gauge--green .value { stroke: var(--green); filter: drop-shadow(0 0 10px rgba(32,201,151,0.35)); }
.ring-gauge--amber .value { stroke: var(--amber); filter: drop-shadow(0 0 10px rgba(245,185,76,0.35)); }
.ring-gauge--red .value { stroke: var(--red); filter: drop-shadow(0 0 10px rgba(255,106,106,0.35)); }

.ring-label {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: 800;
  color: var(--text);
}

.fade-up {
  opacity: 0;
  transform: translateY(16px);
  animation: fade-up 700ms var(--ease-out) forwards;
}

.glow-pulse {
  animation: glow-pulse 2.4s ease-in-out infinite;
}

@keyframes fade-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 0 rgba(167,139,250,0);
  }
  50% {
    box-shadow: 0 0 28px rgba(167,139,250,0.18);
  }
}
```

---

# 2) Professional schedule / timeline CSS

This is the most important piece for Molly.

The goal is for the time grid to feel like a **real planning surface**, not a table.

```css
.schedule-shell {
  display: grid;
  grid-template-rows: auto 1fr;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: rgba(255,255,255,0.04);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  min-height: 0;
}

.schedule-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--line);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
}

.schedule-toolbar .view-pill {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.04);
  color: var(--text-soft);
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
}

.schedule-toolbar .view-pill--active {
  background: rgba(124,156,255,0.16);
  color: var(--text);
  border-color: rgba(124,156,255,0.28);
}

.schedule-grid {
  display: grid;
  grid-template-columns: 92px repeat(5, 1fr);
  grid-template-rows: 58px repeat(8, minmax(72px, 1fr));
  min-height: 0;
  position: relative;
  isolation: isolate;
}

.schedule-grid::before {
  content: "";
  position: absolute;
  inset: 58px 0 0 92px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.03), transparent 16%),
    linear-gradient(90deg, rgba(124,156,255,0.05), transparent 22%, transparent 78%, rgba(124,156,255,0.04));
  pointer-events: none;
  z-index: 0;
}

.schedule-corner,
.schedule-day,
.schedule-time {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 0 14px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: rgba(255,255,255,0.03);
}

.schedule-corner {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text-dim);
  font-weight: 800;
}

.schedule-day {
  justify-content: center;
  flex-direction: column;
  gap: 4px;
}

.schedule-day-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--text);
}

.schedule-day-sub {
  font-size: 10px;
  color: var(--text-dim);
}

.schedule-time {
  justify-content: flex-end;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-dim);
  background: rgba(255,255,255,0.02);
}

.schedule-cell {
  position: relative;
  border-right: 1px solid rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.015);
  z-index: 1;
}

.schedule-cell:hover {
  background: rgba(124,156,255,0.045);
}

.schedule-cell--focus {
  background: rgba(167,139,250,0.08);
  box-shadow: inset 0 0 0 1px rgba(167,139,250,0.14);
}

.time-block {
  position: absolute;
  left: 8px;
  right: 8px;
  top: 6px;
  bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.08);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.13), rgba(255,255,255,0.06));
  box-shadow:
    0 8px 16px rgba(0,0,0,0.18),
    inset 0 1px 0 rgba(255,255,255,0.10);
  overflow: hidden;
  transition:
    transform 240ms var(--ease-out),
    box-shadow 240ms var(--ease-out),
    border-color 240ms var(--ease-out);
}

.time-block:hover {
  transform: translateY(-2px);
  box-shadow:
    0 16px 24px rgba(0,0,0,0.24),
    inset 0 1px 0 rgba(255,255,255,0.12);
}

.time-block::after {
  content: "";
  position: absolute;
  inset: auto 0 0 0;
  height: 3px;
  background: currentColor;
  opacity: 0.9;
}

.time-block--group-a {
  color: #70d6ff;
  background:
    linear-gradient(180deg, rgba(86,216,255,0.18), rgba(86,216,255,0.08));
  border-color: rgba(86,216,255,0.22);
}

.time-block--group-b {
  color: #9f8cff;
  background:
    linear-gradient(180deg, rgba(167,139,250,0.18), rgba(167,139,250,0.08));
  border-color: rgba(167,139,250,0.24);
}

.time-block--oneonone {
  color: #34d399;
  background:
    linear-gradient(180deg, rgba(32,201,151,0.18), rgba(32,201,151,0.08));
  border-color: rgba(32,201,151,0.24);
}

.time-block--conflict {
  color: #ff8a8a;
  background:
    linear-gradient(180deg, rgba(255,106,106,0.20), rgba(255,106,106,0.08));
  border-color: rgba(255,106,106,0.28);
  animation: conflict-pulse 1.9s ease-in-out infinite;
}

.time-block--candidate {
  border-style: dashed;
  opacity: 0.92;
}

.block-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.block-title {
  font-size: 12px;
  font-weight: 800;
  color: #f4f8ff;
}

.block-duration {
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.7);
}

.block-meta {
  font-size: 11px;
  color: rgba(255,255,255,0.78);
  line-height: 1.5;
}

.block-students {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.student-pill {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.08);
  font-size: 10px;
  font-weight: 700;
  color: white;
  display: inline-flex;
  align-items: center;
}

.timeline-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--line);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-soft);
}

.legend-swatch {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.legend-swatch--a { background: #70d6ff; }
.legend-swatch--b { background: #9f8cff; }
.legend-swatch--1 { background: #34d399; }
.legend-swatch--c { background: #ff8a8a; }

.schedule-sidepanel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-detail-card {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(255,255,255,0.04);
  padding: 14px;
}

.schedule-detail-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text-dim);
  margin-bottom: 10px;
}

.schedule-detail-main {
  font-size: 18px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 8px;
}

.schedule-detail-copy {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-soft);
}

.delta-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.delta-chip--added {
  color: var(--green);
  background: rgba(32,201,151,0.10);
}

.delta-chip--moved {
  color: var(--violet);
  background: rgba(167,139,250,0.10);
}

.delta-chip--risk {
  color: var(--amber);
  background: rgba(245,185,76,0.10);
}

@keyframes conflict-pulse {
  0%, 100% {
    box-shadow: 0 0 0 rgba(255,106,106,0);
  }
  50% {
    box-shadow: 0 0 24px rgba(255,106,106,0.22);
  }
}
```

---

# 3) Slide-by-slide CSS components and UX behavior

## Slide 1 — Title / promise

### Components

* `.hero-title`
* `.hero-copy`
* `.badge-row`
* `.badge--violet`, `.badge--green`
* subtle animated background glow

### What it should do

This slide should feel like a **premium product launch screen**.
The headline should land with weight, then the capability badges should reveal in staggered sequence.

### UX effect

Molly should immediately feel:

> “This is serious. This was designed for my problem.”

### Extra CSS for this slide

```css
.title-stage {
  flex: 1;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 20px;
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.title-divider {
  width: 72px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--violet), var(--cyan));
  box-shadow: 0 0 24px rgba(124,156,255,0.24);
}
```

---

## Slide 2 — Problem / overload

### Components

* `.kpi-row`
* `.kpi-card`
* `.info-card`
* `.metric-trend--warn`
* warning badges / disruption chips

### What it should do

This slide should show **structured overload**:
not chaos visually, but visible complexity.

Use cards that highlight:

* number of students
* grade levels
* different need types
* change frequency

### UX effect

She sees:

> “Yes, this is exactly the pressure I’m under.”

---

## Slide 3 — Manual workflow pain

### Components

* vertical step rail
* failure markers
* broken-loop animation
* pain summary card

### Add this CSS

```css
.workflow-rail {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 420px;
}

.workflow-step {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.04);
}

.workflow-step--error {
  border-color: rgba(255,106,106,0.22);
  background: rgba(255,106,106,0.08);
}

.workflow-index {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 800;
  background: rgba(255,255,255,0.10);
}

.loop-warning {
  border: 1px dashed rgba(255,106,106,0.26);
  background: rgba(255,106,106,0.06);
  color: var(--red);
  border-radius: 16px;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 700;
}
```

### What it should do

The sequence should feel repetitive and draining.
The red loop marker makes the “break something else → repeat” moment obvious.

---

## Slide 4 — The shift

### Components

* side-by-side comparison cards
* transformation arrows
* glow emphasis on “dynamic rebalancing”

### Add this CSS

```css
.shift-compare {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 18px;
  align-items: stretch;
}

.shift-card {
  border: 1px solid var(--line);
  border-radius: 24px;
  background: rgba(255,255,255,0.04);
  padding: 18px;
}

.shift-card--to {
  border-color: rgba(32,201,151,0.22);
  background: rgba(32,201,151,0.07);
}

.shift-arrow {
  width: 72px;
  display: grid;
  place-items: center;
  font-size: 28px;
  color: var(--violet);
}
```

### What it should do

This slide must create the **mental reframing**:
not scheduling, but system operation.

---

## Slide 5 — Student input / constraints

### Components

* searchable student list
* editable detail drawer
* constraint chips
* weekly-minutes ring gauge
* “groupable” toggle

### Add this CSS

```css
.student-shell {
  display: grid;
  grid-template-columns: 0.95fr 1.2fr;
  gap: 16px;
  min-height: 0;
}

.student-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.04);
}

.student-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  background: linear-gradient(135deg, rgba(124,156,255,0.25), rgba(167,139,250,0.22));
  color: white;
}

.student-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-stat {
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 12px;
  background: rgba(255,255,255,0.03);
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle {
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: rgba(255,255,255,0.10);
  position: relative;
  border: 1px solid var(--line);
}

.toggle::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  transition: transform 240ms var(--ease-out);
}

.toggle--on {
  background: rgba(32,201,151,0.28);
}

.toggle--on::after {
  transform: translateX(18px);
}
```

### What it should do

This must feel editable and safe.
Molly should feel like she can **review one student deeply without losing the whole schedule context**.

---

## Slide 6 — AI structures the problem

### Components

* AI reasoning panel
* grouped cards
* detected constraints list
* confidence gauge

### What it should do

Show that the system is not just storing data — it is **understanding relationships**.

### UX effect

> “It sees the same complexity I see, but faster and more clearly.”

Use:

* `.ai-panel`
* `.ring-gauge`
* `.delta-list`
* `.chip-row`

---

## Slide 7 — Grouping suggestion

### Components

* group cards
* draggable-looking student chips
* rationale panel
* grouping confidence bar

### Add this CSS

```css
.group-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.group-card {
  border: 1px solid var(--line);
  border-radius: 22px;
  background: rgba(255,255,255,0.04);
  padding: 16px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-card--highlight {
  border-color: rgba(124,156,255,0.26);
  background: rgba(124,156,255,0.08);
}

.group-student-pill {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.10);
  color: var(--text);
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  margin: 4px 6px 0 0;
}
```

### What it should do

This is the first strong “assistant intelligence” moment.
The grouping layout should feel like a **recommendation workspace**.

---

## Slide 8 — Initial schedule draft

### Components

* `schedule-shell`
* `schedule-grid`
* `time-block`
* `timeline-legend`
* side review panel

### What it should do

This slide must feel like a **real operational planning tool**.

The time grid should make it easy to:

* scan days quickly
* see group vs 1:1 balance
* understand time density
* notice conflicts instantly

### UX effect

> “I can actually review this without getting lost.”

### Important visual rules

* Time labels must stay visually quiet.
* Blocks must be color-coded but elegant.
* Content inside each block must prioritize:

  1. session name
  2. duration
  3. students
  4. notes

---

## Slide 9 — New student added

### Components

* alert card
* incoming student detail card
* impact summary strip
* “rebalancing required” pulse state

### Add this CSS

```css
.change-alert {
  border: 1px solid rgba(245,185,76,0.28);
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(245,185,76,0.14), rgba(245,185,76,0.07));
  padding: 18px;
  box-shadow: 0 0 28px rgba(245,185,76,0.10);
}

.change-alert-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--amber);
  font-weight: 800;
  margin-bottom: 10px;
}

.rebalance-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  color: var(--amber);
  background: rgba(245,185,76,0.12);
  border: 1px solid rgba(245,185,76,0.24);
  font-size: 11px;
  font-weight: 800;
  animation: glow-pulse 1.8s ease-in-out infinite;
}
```

### What it should do

This is the “change event” and should create tension, but not panic.

---

## Slide 10 — Auto rebalancing

### Components

* before/after schedule delta state
* moved block highlights
* added student markers
* preserved schedule indicators
* AI explanation drawer

### Add this CSS

```css
.schedule-delta-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.delta-outline {
  position: absolute;
  border-radius: 18px;
  border: 2px dashed rgba(167,139,250,0.8);
  box-shadow: 0 0 18px rgba(167,139,250,0.18);
}

.delta-outline--new {
  border-color: rgba(32,201,151,0.86);
  box-shadow: 0 0 18px rgba(32,201,151,0.18);
}

.delta-tag {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.delta-tag--new {
  color: var(--green);
  background: rgba(32,201,151,0.12);
}

.delta-tag--moved {
  color: var(--violet);
  background: rgba(167,139,250,0.12);
}

.delta-tag--preserved {
  color: var(--cyan);
  background: rgba(86,216,255,0.12);
}
```

### What it should do

This is the magic moment.
The interface should communicate:

* what changed
* what stayed stable
* why the new state is acceptable

The **most important UX principle** here is **trust through explicit change visibility**.

---

## Slide 11 — Before vs after

### Components

* two-column comparison
* crisp diff rows
* large time-saved callout
* quality badges

### Add this CSS

```css
.compare-shell {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.compare-col {
  border: 1px solid var(--line);
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255,255,255,0.04);
}

.compare-col--after {
  border-color: rgba(32,201,151,0.24);
  background: rgba(32,201,151,0.06);
}

.compare-header {
  padding: 16px 18px;
  border-bottom: 1px solid var(--line);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 800;
}

.compare-body {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.compare-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255,255,255,0.04);
}
```

### What it should do

Clear, undeniable contrast.
No ambiguity.
This slide should answer:

> “Why is this better?”

---

## Slide 12 — Final impact

### Components

* hero metric card
* trust metrics
* outcome chips
* closing line

### What it should do

Leave her with:

* emotional relief
* practical value
* belief that the system helps her think, not just record data

---

# 4) High-value interaction patterns to simulate in the demo

These will make the UX feel powerful even in a presentation.

## A. Hover-lift on schedule blocks

When a block is focused:

* it rises slightly
* border strengthens
* student chips become clearer
* duration brightens

This communicates:

> “This can be reviewed precisely.”

## B. Constraint-aware highlight

When showing conflicts:

* related time blocks softly glow amber/red
* associated student chips highlight
* AI panel explains why

This communicates:

> “The system understands consequences.”

## C. Rebalance preview state

Before finalizing a rebalance:

* new placements appear dashed
* moved sessions show violet outline
* preserved sessions show calm cyan tags

This communicates:

> “You can review changes before committing them.”

## D. Confidence + reasoning together

Never show a confidence gauge alone. Pair it with:

* explanation text
* surfaced tradeoffs
* visible constraints considered

This communicates:

> “The system is accountable.”

## E. Side review drawer

For the schedule slide, always include a right-side review panel showing:

* selected session
* students
* required minutes
* tradeoffs
* why this slot was chosen

This is critical for Molly because her real work is not just seeing the grid — it is **understanding why the grid is acceptable**.

---

# 5) Best component choices for Molly specifically

These are the most important components in the whole demo.

## The timeline grid

This is the hero component.
It should feel:

* calm
* dense but not cluttered
* easy to scan by day
* easy to read by student grouping

## Group cards

These reduce the hardest cognitive step.
They should feel like:

* recommendations
* editable suggestions
* practical group containers

## Constraint chips

These should appear everywhere:

* student details
* AI reasoning
* time block review
* change event panels

They visually encode the invisible complexity.

## Rebalance delta markers

This is what makes the demo powerful.
Without them, “AI rebalanced the schedule” feels vague.
With them, it becomes:

> “Here are the exact minimal changes made.”

---

# 6) Recommended scene-to-scene motion language

Use the same motion system throughout:

* cards: `fade-up` with 80–120ms stagger
* schedule blocks: rise + sharpen on reveal
* gauges: animate 0 → target in 900–1100ms
* progress bars: animate width after panel reveal
* AI panel: slight glow pulse when “thinking”
* change-event alerts: amber pulse, never red panic unless showing hard conflict

The motion should feel:

* intentional
* premium
* not flashy

---

# 7) Strong UX rule for the time grid

For Molly, the schedule is not “a calendar.”

It is a **decision surface**.

So the grid must support:

* **scanability** — understand the whole week fast
* **explainability** — understand why a slot exists
* **editability** — feel like it can be adjusted
* **stability awareness** — see what changed vs what stayed

That is why the block system, side detail drawer, and delta markers matter so much.

---

# 8) Best next build order

Build the CSS in this order:

1. shared shell + panels
2. KPI cards + badges
3. AI reasoning panel
4. group cards
5. schedule grid + time blocks
6. delta/rebalance states
7. before/after comparison scene

That gets you to the strongest visual payoff fastest.

