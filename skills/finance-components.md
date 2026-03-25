# Skill: Finance Scene Components

A component cookbook for building finance-themed demo scenes. These are direct translations of the MSP Command Center patterns into financial analytics language — same visual DNA, same animation rules, finance-native content.

---

## The Finance → MSP Mapping

| Finance Concept | MSP Equivalent |
|----------------|----------------|
| Variance / performance issue | Incident |
| Driver (price, volume, labor, mix) | Root cause |
| KPI health (margin, revenue, EBITDA) | Service health |
| Business unit / segment | Tenant |
| Action playbook (pricing, cost, mix) | Playbook |
| Time-to-insight | Time-to-resolution |

---

## Global Tokens

Same as MSP — no deviation:

```css
--bg:         #08101d;
--surface:    rgba(255,255,255,0.03);
--surface-2:  rgba(255,255,255,0.06);
--text:       #eef2ff;
--muted:      #94a3b8;
--dim:        #475569;
--green:      #10b981;   /* healthy, positive delta */
--amber:      #f59e0b;   /* at-risk, warning */
--red:        #ef4444;   /* negative, at-risk */
--indigo:     #818cf8;   /* metrics, comparison */
--violet:     #a78bfa;   /* AI analyst, headings */
--border:     rgba(255,255,255,0.08);
```

---

## A. TopBar

Sets context on every finance scene: which company, which segment, which mode.

```html
<div class="topbar">
  <div class="topbar-title">FINANCIAL COMMAND CENTER</div>
  <div class="topbar-context">Company: <strong>Acme Corp</strong></div>
  <div class="segment-tabs">
    <span class="tab tab--active">Retail</span>
    <span class="tab">Enterprise</span>
    <span class="tab">Online</span>
  </div>
  <div class="mode-badge">Analysis</div>
</div>
```

```css
.topbar {
  display: flex; align-items: center; gap: 12px; padding: 10px 16px;
  background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0; font-size: 11px;
}
.topbar-title { font-weight: 700; font-size: 12px; letter-spacing: 0.08em; color: #a78bfa; }
.topbar-context { color: #94a3b8; }
.topbar-context strong { color: #eef2ff; }
.segment-tabs { display: flex; gap: 6px; margin-left: 8px; }
.tab { font-size: 10px; padding: 3px 10px; border-radius: 99px; color: #475569; border: 1px solid transparent; cursor: default; }
.tab--active { color: #eef2ff; background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }
.mode-badge { margin-left: auto; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; padding: 3px 10px; border-radius: 99px; background: rgba(129,140,248,0.12); border: 1px solid rgba(129,140,248,0.3); color: #818cf8; }
```

**Variants:**
- Analysis mode → `#818cf8` (indigo)
- Variance active → `#ef4444` with `animation: pulse-badge 1.5s ease-in-out infinite`
- Recovery mode → `#10b981`

---

## B. KPI Strip

Four headline metrics. Count-up animations. Use `kpi-delta--pos` / `kpi-delta--neg`.

```html
<div class="kpi-strip">
  <div class="kpi-card">
    <div class="kpi-label">Revenue</div>
    <div class="kpi-value">$4.82M</div>
    <div class="kpi-delta kpi-delta--pos">+$270K vs LY (+5.9%)</div>
  </div>
  <div class="kpi-card">
    <div class="kpi-label">Gross Margin</div>
    <div class="kpi-value">33.8%</div>
    <div class="kpi-delta kpi-delta--neg">-2.1 pts vs LY</div>
  </div>
  <div class="kpi-card">
    <div class="kpi-label">Operating Profit</div>
    <div class="kpi-value">$0.81M</div>
    <div class="kpi-delta kpi-delta--neg">-$120K vs LY</div>
  </div>
  <div class="kpi-card">
    <div class="kpi-label">YoY Growth</div>
    <div class="kpi-value">+5.9%</div>
    <div class="kpi-delta kpi-delta--muted">vs prior year</div>
  </div>
</div>
```

```css
.kpi-strip {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1px; background: rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0;
}
.kpi-card { background: rgba(8,16,29,0.95); padding: 10px 14px; }
.kpi-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.16em; color: #475569; margin-bottom: 4px; }
.kpi-value { font-size: 18px; font-weight: 700; color: #eef2ff; letter-spacing: -0.02em; margin-bottom: 3px; }
.kpi-delta { font-size: 10px; }
.kpi-delta--pos   { color: #10b981; }
.kpi-delta--neg   { color: #ef4444; }
.kpi-delta--muted { color: #475569; }
```

---

## C. Segment Health Cards

Finance translation of MSP tenant cards. Three cards in a grid.

```html
<div class="segments">
  <div class="segment segment--warn">
    <div class="segment-header">
      <span class="segment-name">Retail</span>
      <span class="segment-badge badge--warn">At Risk</span>
    </div>
    <div class="segment-metrics">
      <div class="metric-row"><span class="metric-key">Revenue</span><span class="metric-val">$1.92M</span></div>
      <div class="metric-row"><span class="metric-key">Margin</span><span class="metric-val metric-val--red">28.4%</span></div>
      <div class="metric-row"><span class="metric-key">vs LY</span><span class="metric-val metric-val--muted">-3.2 pts</span></div>
      <div class="metric-row"><span class="metric-key">YoY</span><span class="metric-val metric-val--green">+1.8%</span></div>
    </div>
  </div>
</div>
```

```css
.segments { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.segment { border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); overflow: hidden; }
.segment--healthy { border-color: rgba(16,185,129,0.2); }
.segment--warn    { border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.02); }
.segment--stable  { border-color: rgba(129,140,248,0.2); }
.segment-header   { padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); }
.segment-name     { font-size: 12px; font-weight: 700; color: #eef2ff; }
.segment-badge    { font-size: 9px; padding: 2px 8px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; }
.badge--healthy { background: rgba(16,185,129,0.12); color: #10b981; border: 1px solid rgba(16,185,129,0.25); }
.badge--warn    { background: rgba(245,158,11,0.12); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); }
.badge--stable  { background: rgba(129,140,248,0.12); color: #818cf8; border: 1px solid rgba(129,140,248,0.25); }
.segment-metrics  { padding: 8px 12px; display: flex; flex-direction: column; gap: 5px; }
.metric-row { display: flex; justify-content: space-between; align-items: center; }
.metric-key { font-size: 10px; color: #475569; }
.metric-val { font-size: 11px; font-weight: 600; color: #94a3b8; }
.metric-val--green { color: #10b981; }
.metric-val--red   { color: #ef4444; }
.metric-val--muted { color: #475569; }
```

---

## D. Variance Driver Table

The finance equivalent of the incident list — rows are financial drivers.

```html
<table class="driver-table">
  <thead>
    <tr>
      <th>Driver</th><th>Last Year</th><th>Current</th><th>Delta</th><th>Impact</th>
    </tr>
  </thead>
  <tbody>
    <tr data-reveal>
      <td class="driver-name">Price</td>
      <td class="driver-num">$4.55M</td>
      <td class="driver-num">$4.82M</td>
      <td class="driver-num driver-pos">+$270K</td>
      <td><span class="impact-pill impact-pos">positive</span></td>
    </tr>
    <tr data-reveal>
      <td class="driver-name">Labor Cost</td>
      <td class="driver-num">$3.05M</td>
      <td class="driver-num">$3.19M</td>
      <td class="driver-num driver-neg">-$140K</td>
      <td><span class="impact-pill impact-neg">negative</span></td>
    </tr>
  </tbody>
</table>
```

```css
.driver-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.driver-table th { font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; color: #475569; padding: 4px 8px; border-bottom: 1px solid rgba(255,255,255,0.08); text-align: left; }
.driver-table td { padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); }
.driver-name { color: #94a3b8; }
.driver-num  { font-family: monospace; color: #eef2ff; }
.driver-pos  { color: #10b981; }
.driver-neg  { color: #ef4444; }
.impact-pill { font-size: 9px; padding: 2px 8px; border-radius: 99px; font-weight: 600; }
.impact-pos  { background: rgba(16,185,129,0.12); color: #10b981; }
.impact-neg  { background: rgba(239,68,68,0.12); color: #ef4444; }
.impact-neut { background: rgba(255,255,255,0.06); color: #94a3b8; }
```

---

## E. YoY Bridge (Waterfall)

Shows the profit walk from last year to current year.

```html
<div class="bridge">
  <div class="bridge-row bridge-row--base" data-reveal>
    <span class="bridge-label">Last Year Profit</span>
    <span class="bridge-value">+$0.93M</span>
    <div class="bridge-bar-wrap"><div class="bridge-bar bridge-bar--base" data-target="93"></div></div>
  </div>
  <div class="bridge-row bridge-row--pos" data-reveal>
    <span class="bridge-label">+ Price Impact</span>
    <span class="bridge-value bridge-pos">+$0.14M</span>
    <div class="bridge-bar-wrap"><div class="bridge-bar bridge-bar--pos" data-target="14"></div></div>
  </div>
  <div class="bridge-row bridge-row--neg" data-reveal>
    <span class="bridge-label">− Labor Cost</span>
    <span class="bridge-value bridge-neg">-$0.14M</span>
    <div class="bridge-bar-wrap"><div class="bridge-bar bridge-bar--neg" data-target="14"></div></div>
  </div>
</div>
```

```css
.bridge { display: flex; flex-direction: column; gap: 5px; }
.bridge-row { display: flex; align-items: center; gap: 10px; font-size: 11px; }
.bridge-label { width: 140px; flex-shrink: 0; color: #94a3b8; }
.bridge-value { width: 72px; text-align: right; font-family: monospace; flex-shrink: 0; color: #eef2ff; }
.bridge-pos { color: #10b981; }
.bridge-neg { color: #ef4444; }
.bridge-bar-wrap { flex: 1; }
.bridge-bar { height: 4px; border-radius: 2px; width: 0; }
.bridge-bar--base { background: #818cf8; }
.bridge-bar--pos  { background: #10b981; }
.bridge-bar--neg  { background: #ef4444; }
```

Animate bars with the standard bar-fill pattern (setTimeout + transition).

---

## F. Driver Tree

Finance causality graph — equivalent of MSP trace path.

```html
<div class="driver-tree">
  <div class="tree-root" data-reveal>Revenue</div>
  <div class="tree-branch" data-reveal>
    <span class="tree-connector">├─</span>
    <span class="tree-label">Price</span>
    <span class="tree-delta tree-pos">+$140K</span>
  </div>
  <div class="tree-branch" data-reveal>
    <span class="tree-connector">├─</span>
    <span class="tree-label">Volume</span>
    <span class="tree-delta tree-pos">+$170K</span>
  </div>
  <div class="tree-branch" data-reveal>
    <span class="tree-connector">└─</span>
    <span class="tree-label">Mix</span>
    <span class="tree-delta tree-neg">-$60K</span>
  </div>
  <div class="tree-child" data-reveal>
    <span class="tree-connector tree-child-conn">&nbsp;&nbsp;&nbsp;└─</span>
    <span class="tree-label tree-dim">Low-margin share ↑</span>
  </div>
</div>
```

```css
.driver-tree { font-family: monospace; font-size: 12px; line-height: 2; }
.tree-root { color: #a78bfa; font-weight: 700; margin-bottom: 2px; }
.tree-branch, .tree-child { display: flex; align-items: center; gap: 8px; }
.tree-connector { color: #334155; }
.tree-label { color: #94a3b8; flex: 1; }
.tree-dim { color: #475569; }
.tree-delta { font-size: 11px; }
.tree-pos { color: #10b981; }
.tree-neg { color: #ef4444; }
```

---

## G. AI Analyst Terminal

The finance operator terminal. This is what makes the system feel like an operator, not a dashboard.

```html
<div class="terminal">
  <div class="t-line t-line--dim"   data-reveal><span class="t-prompt">&gt; </span>loading financial context...</div>
  <div class="t-line t-line--dim"   data-reveal><span class="t-prompt">&gt; </span>segment selected: Retail</div>
  <div class="t-line t-line--alert" data-reveal><span class="t-prompt">&gt; </span>variance detected: gross margin decline</div>
  <div class="t-line"               data-reveal><span class="t-prompt">&gt; </span>primary drivers: labor + mix + discounting</div>
  <div class="t-line t-line--ok"    data-reveal><span class="t-prompt">&gt; </span>recommendation: margin-recovery playbook</div>
</div>
```

```css
.terminal { font-family: monospace; font-size: 11px; line-height: 1.8; }
.t-line       { color: #a8b3cf; }
.t-line--dim  { color: #475569; }
.t-line--alert { color: #f59e0b; }
.t-line--ok   { color: #10b981; }
.t-prompt     { color: #4b5563; }
```

---

## H. Mix Shift Panel

Category composition comparison table.

```html
<div class="mix-table">
  <div class="mix-header" data-reveal>
    <span class="mix-col-label">Category</span>
    <span class="mix-col-num">Last Period</span>
    <span class="mix-col-num">Current</span>
    <span class="mix-col-quality">Quality</span>
  </div>
  <div class="mix-row" data-reveal>
    <span class="mix-name">Staffing Services</span>
    <span class="mix-num">42%</span>
    <span class="mix-num mix-down">39%</span>
    <span class="mix-quality mix-quality--low">Low</span>
  </div>
  <div class="mix-row" data-reveal>
    <span class="mix-name">Consulting</span>
    <span class="mix-num">28%</span>
    <span class="mix-num mix-up">31%</span>
    <span class="mix-quality mix-quality--high">High</span>
  </div>
</div>
```

```css
.mix-table { display: flex; flex-direction: column; gap: 4px; }
.mix-header { display: flex; gap: 8px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; color: #475569; padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.mix-row { display: flex; align-items: center; gap: 8px; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 11px; }
.mix-col-label, .mix-name { flex: 1; color: #94a3b8; }
.mix-col-num, .mix-num { width: 60px; text-align: right; font-family: monospace; color: #eef2ff; }
.mix-col-quality, .mix-quality { width: 50px; text-align: right; font-size: 10px; }
.mix-up   { color: #10b981; }
.mix-down { color: #ef4444; }
.mix-quality--high   { color: #10b981; }
.mix-quality--medium { color: #f59e0b; }
.mix-quality--low    { color: #ef4444; }
```

---

## I. Action Playbook Card

Finance equivalent of playbook execution.

```html
<div class="playbook-card">
  <div class="playbook-header">
    <span class="playbook-label">PLAYBOOK</span>
    <span class="playbook-name">margin-recovery</span>
  </div>
  <div class="playbook-steps">
    <div class="playbook-step" data-reveal>
      <span class="step-num">1</span>
      <span class="step-text">Reduce discounting by 2%</span>
    </div>
    <div class="playbook-step" data-reveal>
      <span class="step-num">2</span>
      <span class="step-text">Shift mix toward high-margin services</span>
    </div>
  </div>
</div>
```

```css
.playbook-card { border: 1px solid rgba(129,140,248,0.2); border-radius: 8px; background: rgba(129,140,248,0.04); overflow: hidden; }
.playbook-header { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid rgba(129,140,248,0.12); }
.playbook-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.16em; color: #475569; }
.playbook-name { font-size: 12px; font-weight: 600; color: #818cf8; font-family: monospace; }
.playbook-steps { padding: 10px 14px; display: flex; flex-direction: column; gap: 8px; }
.playbook-step { display: flex; align-items: flex-start; gap: 10px; font-size: 12px; color: #94a3b8; }
.step-num { width: 18px; height: 18px; border-radius: 50%; background: rgba(129,140,248,0.15); border: 1px solid rgba(129,140,248,0.25); color: #818cf8; font-size: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
```

---

## Standard Scene Layout Patterns

### Command Center (hero scene)
```
topbar
kpi-strip
narration-bar
grid (3 columns: segments | variance | ai-terminal)
footer-takeaway
```

### Analysis Scene (variant/drilldown)
```
topbar
narration-bar
two-column: driver-table | root-cause-card
```

### Closing Scene
```
scene (centered)
before-after columns
tagline
```

---

## Animation Rules

Keep the same rules as MSP scenes — no deviation:

- All structural elements get `data-reveal` and stagger with `0.15 + i * 0.18s`
- KPI values count-up using the text-node count-up pattern
- Bar fills use `setTimeout + transition: width`
- Arc gauges animate via `requestAnimationFrame`
- AI terminal lines stagger in
- Narration panel has `opacity: 0; animation: reveal-in 0.5s 0.1s ease forwards`

---

## Complete Shared Script Block

Drop this at the bottom of every finance scene that uses bars, count-up, and arcs:

```js
// Stagger reveals
document.querySelectorAll("[data-reveal]").forEach((el, i) => {
  el.style.animationDelay = `${0.2 + i * 0.1}s`;
});

// Bar fills
document.querySelectorAll('[data-target]').forEach(el => {
  const target = parseFloat(el.dataset.target);
  if (!target) return;
  const revealEl = el.closest('[data-reveal]') || el;
  const delay = parseFloat(revealEl.style.animationDelay || '0.2') + 0.3;
  setTimeout(() => {
    el.style.transition = 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.width = target + '%';
  }, delay * 1000);
});

// Count-up
document.querySelectorAll(".count-up").forEach(el => {
  const textNode = [...el.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
  if (!textNode) return;
  const raw = textNode.textContent.trim();
  const match = raw.match(/^([+\u2212\-$]?)(\d+\.?\d*)(.*)$/);
  if (!match) return;
  const [, prefix, num, suffix] = match;
  const endVal = parseFloat(num);
  const decimals = num.includes('.') ? num.split('.')[1].length : 0;
  if (isNaN(endVal)) return;
  const revealEl = el.closest('[data-reveal]') || el;
  const revealDelay = parseFloat(revealEl.style.animationDelay || '0.2');
  const start = performance.now() + (revealDelay + 0.25) * 1000;
  textNode.textContent = prefix + (0).toFixed(decimals) + suffix;
  (function tick(now) {
    if (now < start) { requestAnimationFrame(tick); return; }
    const t = Math.min((now - start) / 900, 1);
    const e = 1 - Math.pow(1 - t, 3);
    textNode.textContent = prefix + (endVal * e).toFixed(decimals) + suffix;
    if (t < 1) requestAnimationFrame(tick);
    else textNode.textContent = prefix + endVal.toFixed(decimals) + suffix;
  })(performance.now());
});
```
