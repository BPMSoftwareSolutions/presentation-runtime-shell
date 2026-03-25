Below is a **runtime-friendly scene HTML structure** for the demo resume. It follows your shell’s pattern of **self-contained scene files with inline CSS/JS**  and the scene-authoring guidance for dark, animated, iframe-based slides 

---

## Shared scene structure

Use this as the base for every slide:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Scene Title</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #08101d;
      --surface: rgba(255,255,255,0.04);
      --surface-2: rgba(255,255,255,0.07);
      --border: rgba(255,255,255,0.1);
      --text: #eef2ff;
      --muted: #94a3b8;
      --dim: #64748b;
      --green: #10b981;
      --amber: #f59e0b;
      --red: #ef4444;
      --violet: #a78bfa;
      --indigo: #818cf8;
    }

    html, body {
      height: 100%;
      background: var(--bg);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      overflow: hidden;
    }

    body {
      position: relative;
    }

    .scene {
      position: relative;
      height: 100%;
      width: 100%;
      padding: 40px 48px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .grid-lines {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
    }

    .orb-1, .orb-2 {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      pointer-events: none;
    }

    .orb-1 {
      width: 420px;
      height: 420px;
      right: -100px;
      top: -100px;
      background: radial-gradient(circle, rgba(139,92,246,0.16), transparent 70%);
    }

    .orb-2 {
      width: 320px;
      height: 320px;
      left: -80px;
      bottom: -80px;
      background: radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%);
    }

    .topbar {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }

    .eyebrow {
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--violet);
    }

    .scene-title {
      font-size: 34px;
      font-weight: 700;
      letter-spacing: -0.03em;
    }

    .scene-subtitle {
      font-size: 15px;
      color: var(--muted);
      margin-top: 6px;
    }

    .badge {
      padding: 8px 12px;
      border: 1px solid rgba(167,139,250,0.28);
      border-radius: 999px;
      background: rgba(167,139,250,0.08);
      color: #ddd6fe;
      font-size: 12px;
      white-space: nowrap;
    }

    .content {
      position: relative;
      z-index: 1;
      flex: 1;
      display: grid;
      gap: 20px;
      min-height: 0;
    }

    .content.two-col {
      grid-template-columns: 1.1fr 0.9fr;
    }

    .content.three-col {
      grid-template-columns: repeat(3, 1fr);
    }

    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 20px;
      backdrop-filter: blur(8px);
      min-height: 0;
    }

    .panel-title {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--dim);
      margin-bottom: 14px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .kpi-card {
      padding: 16px;
      border-radius: 16px;
      background: var(--surface-2);
      border: 1px solid rgba(255,255,255,0.08);
    }

    .kpi-label {
      color: var(--muted);
      font-size: 12px;
      margin-bottom: 8px;
    }

    .kpi-value {
      font-size: 30px;
      font-weight: 700;
      letter-spacing: -0.03em;
    }

    .kpi-delta {
      margin-top: 6px;
      color: var(--green);
      font-size: 13px;
    }

    .list {
      display: grid;
      gap: 10px;
    }

    .list-item {
      padding: 12px 14px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      color: var(--text);
      font-size: 15px;
    }

    .terminal {
      background: #050b15;
      border: 1px solid rgba(129,140,248,0.2);
      border-radius: 18px;
      padding: 18px;
      min-height: 280px;
      display: grid;
      gap: 10px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 14px;
      color: #cbd5e1;
    }

    .terminal-line::before {
      content: ">";
      color: var(--violet);
      margin-right: 10px;
    }

    .arch {
      display: grid;
      gap: 14px;
      justify-items: center;
      align-content: center;
      height: 100%;
    }

    .arch-box {
      min-width: 220px;
      padding: 14px 18px;
      border-radius: 16px;
      text-align: center;
      background: rgba(129,140,248,0.08);
      border: 1px solid rgba(129,140,248,0.24);
      font-weight: 600;
    }

    .arch-row {
      display: flex;
      gap: 14px;
      justify-content: center;
      width: 100%;
    }

    .arrow {
      color: var(--dim);
      font-size: 18px;
      line-height: 1;
    }

    .footer-callout {
      position: relative;
      z-index: 1;
      padding: 14px 18px;
      border-radius: 16px;
      border: 1px solid rgba(16,185,129,0.22);
      background: rgba(16,185,129,0.06);
      color: #d1fae5;
      font-size: 15px;
    }

    @keyframes reveal-in {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }

    [data-reveal] {
      opacity: 0;
      animation: reveal-in 0.5s ease forwards;
    }
  </style>
</head>
<body>
  <div class="scene">
    <div class="grid-lines"></div>
    <div class="orb-1"></div>
    <div class="orb-2"></div>

    <header class="topbar" data-reveal>
      <div>
        <div class="eyebrow">Demo Resume</div>
        <div class="scene-title">Scene Title</div>
        <div class="scene-subtitle">Optional subtitle or role context</div>
      </div>
      <div class="badge">Role / Company / Years</div>
    </header>

    <main class="content two-col">
      <section class="panel" data-reveal>
        <div class="panel-title">Left Panel</div>
      </section>

      <section class="panel" data-reveal>
        <div class="panel-title">Right Panel</div>
      </section>
    </main>

    <footer class="footer-callout" data-reveal>
      A single takeaway sentence for the scene.
    </footer>
  </div>

  <script>
    document.querySelectorAll("[data-reveal]").forEach((el, i) => {
      el.style.animationDelay = `${0.12 + i * 0.12}s`;
    });

    window.parent.postMessage({ type: "iframe:ready" }, "*");
  </script>
</body>
</html>
```

---

# Slide-by-slide HTML structure

## 1) Title scene

```html
<main class="content">
  <section class="panel" data-reveal style="display:grid;place-items:center;text-align:center;">
    <div>
      <div class="eyebrow">Architecture • Automation • AI Systems</div>
      <h1 class="scene-title" style="font-size:56px;margin-top:14px;">Systems I Have Built</h1>
      <p class="scene-subtitle" style="font-size:18px;max-width:760px;margin:16px auto 0;">
        A demo-driven resume where each role is presented as a working system,
        not a static bullet list.
      </p>
    </div>
  </section>
</main>
```

---

## 2) Career system map

```html
<main class="content two-col">
  <section class="panel" data-reveal>
    <div class="panel-title">System Map</div>
    <div class="arch">
      <div class="arch-row">
        <div class="arch-box">Platform Modernization</div>
        <div class="arch-box">Financial Automation</div>
      </div>
      <div class="arrow">↓</div>
      <div class="arch-row">
        <div class="arch-box">AI Orchestration</div>
        <div class="arch-box">Analytics + Decision Support</div>
      </div>
      <div class="arrow">↓</div>
      <div class="arch-box">Embedded Diagnostics Foundation</div>
    </div>
  </section>

  <section class="panel" data-reveal>
    <div class="panel-title">Interpretation</div>
    <div class="list">
      <div class="list-item">Not jobs → systems</div>
      <div class="list-item">Not tasks → architectures</div>
      <div class="list-item">Not claims → runnable proofs</div>
    </div>
  </section>
</main>
```

---

## 3) Edward Jones problem scene

```html
<main class="content two-col">
  <section class="panel" data-reveal>
    <div class="panel-title">Problem State</div>
    <div class="list">
      <div class="list-item">Monolithic platform with tight coupling</div>
      <div class="list-item">Cross-team dependencies across web, mobile, API, mainframe</div>
      <div class="list-item">Slow releases and high coordination cost</div>
      <div class="list-item">Scaling delivery required structural change</div>
    </div>
  </section>

  <section class="panel" data-reveal>
    <div class="panel-title">Delivery Context</div>
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Agile Teams</div>
        <div class="kpi-value">13</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Domains</div>
        <div class="kpi-value">4</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Release Friction</div>
        <div class="kpi-value">High</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Risk</div>
        <div class="kpi-value">Elevated</div>
      </div>
    </div>
  </section>
</main>
```

This structure reflects the modernization and multi-team delivery points in your experience data 

---

## 4) Architecture transformation scene

```html
<main class="content two-col">
  <section class="panel" data-reveal>
    <div class="panel-title">Target Architecture</div>
    <div class="arch">
      <div class="arch-box">Micro Frontends</div>
      <div class="arrow">↓</div>
      <div class="arch-box">API Gateway</div>
      <div class="arrow">↓</div>
      <div class="arch-row">
        <div class="arch-box">Account Service</div>
        <div class="arch-box">Trading Service</div>
        <div class="arch-box">Auth Service</div>
      </div>
      <div class="arrow">↓</div>
      <div class="arch-box">AWS + CI/CD</div>
    </div>
  </section>

  <section class="panel" data-reveal>
    <div class="panel-title">New Capabilities</div>
    <div class="list">
      <div class="list-item">Independent deployments</div>
      <div class="list-item">Improved observability and governance</div>
      <div class="list-item">Reduced coordination overhead</div>
      <div class="list-item">Faster, safer delivery</div>
    </div>
  </section>
</main>
```

---

## 5) Live system / command center scene

This one borrows the proven command-center layout style from your MSP sketches 

```html
<main class="content two-col">
  <section class="panel" data-reveal>
    <div class="panel-title">Services</div>
    <div class="list">
      <div class="list-item">account-service <strong style="color:#10b981;">OK</strong></div>
      <div class="list-item">trading-service <strong style="color:#f59e0b;">DEGRADED</strong></div>
      <div class="list-item">auth-service <strong style="color:#10b981;">OK</strong></div>
      <div class="list-item">portfolio-service <strong style="color:#10b981;">OK</strong></div>
    </div>
  </section>

  <section class="panel" data-reveal>
    <div class="panel-title">AI Operator Terminal</div>
    <div class="terminal">
      <div class="terminal-line">incident detected: trading-service latency spike</div>
      <div class="terminal-line">root cause: downstream dependency timeout</div>
      <div class="terminal-line">impact: order processing delayed</div>
      <div class="terminal-line">recommended action: reroute to fallback path</div>
    </div>
  </section>
</main>
```

---

## 6) Impact scene

```html
<main class="content two-col">
  <section class="panel" data-reveal>
    <div class="panel-title">Delivery Metrics</div>
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Release Time</div>
        <div class="kpi-value">↓ 50%</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Deployment Risk</div>
        <div class="kpi-value">↓</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Team Independence</div>
        <div class="kpi-value">↑</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Developer Velocity</div>
        <div class="kpi-value">↑</div>
      </div>
    </div>
  </section>

  <section class="panel" data-reveal>
    <div class="panel-title">Organizational Effect</div>
    <div class="list">
      <div class="list-item">13 teams enabled to deliver more independently</div>
      <div class="list-item">Governance and quality became systematic</div>
      <div class="list-item">Architecture reduced friction instead of adding ceremony</div>
    </div>
  </section>
</main>
```

The release-time reduction is grounded in your experience record 

---

## 7) Financial automation scene

This maps well to the analytical/functional automation demo family you already outlined 

```html
<main class="content two-col">
  <section class="panel" data-reveal>
    <div class="panel-title">Workflow</div>
    <div class="arch">
      <div class="arch-box">PDF / ERP / Payroll Inputs</div>
      <div class="arrow">↓</div>
      <div class="arch-box">Extraction + Normalization</div>
      <div class="arrow">↓</div>
      <div class="arch-box">ETL / RPA / AI Automation</div>
      <div class="arrow">↓</div>
      <div class="arch-box">Reporting + Executive Output</div>
    </div>
  </section>

  <section class="panel" data-reveal>
    <div class="panel-title">Examples</div>
    <div class="list">
      <div class="list-item">Financial reporting automation</div>
      <div class="list-item">ERP and payroll system integrations</div>
      <div class="list-item">Executive dashboards and BI workflows</div>
      <div class="list-item">AI-assisted processing and orchestration</div>
    </div>
  </section>
</main>
```

---

## 8) AI orchestration / RenderX scene

```html
<main class="content two-col">
  <section class="panel" data-reveal>
    <div class="panel-title">Core Model</div>
    <div class="arch">
      <div class="arch-box">Domain</div>
      <div class="arrow">↓</div>
      <div class="arch-box">System</div>
      <div class="arrow">↓</div>
      <div class="arch-box">Subsystem</div>
      <div class="arrow">↓</div>
      <div class="arch-box">Meta-System</div>
    </div>
  </section>

  <section class="panel" data-reveal>
    <div class="panel-title">Orchestration Insight</div>
    <div class="list">
      <div class="list-item">Plugin-driven extensibility</div>
      <div class="list-item">Event → handler → orchestration → output</div>
      <div class="list-item">Architect for clarity, not for layer accumulation</div>
      <div class="list-item">Reduce accidental complexity wherever structure drifts from reality</div>
    </div>
  </section>
</main>
```

That “accidental complexity” framing comes straight from your uploaded notes 

---

## 9) Embedded diagnostics scene

```html
<main class="content two-col">
  <section class="panel" data-reveal>
    <div class="panel-title">Protocol Foundation</div>
    <div class="list">
      <div class="list-item">J1850</div>
      <div class="list-item">J1939</div>
      <div class="list-item">CAN</div>
      <div class="list-item">ISO standards</div>
    </div>
  </section>

  <section class="panel" data-reveal>
    <div class="panel-title">System Structure</div>
    <div class="arch">
      <div class="arch-box">Diagnostic Tool</div>
      <div class="arrow">↓</div>
      <div class="arch-box">Protocol Adapter</div>
      <div class="arrow">↓</div>
      <div class="arch-box">Vehicle Network</div>
    </div>
  </section>
</main>
```

This matches the embedded diagnostics and adaptive protocol work in your experience set 

---

## 10) Closing / meta scene

```html
<main class="content">
  <section class="panel" data-reveal style="display:grid;place-items:center;text-align:center;">
    <div style="max-width:900px;">
      <div class="eyebrow">What this resume becomes</div>
      <h2 class="scene-title" style="margin-top:12px;">A Resume That Runs</h2>
      <div class="list" style="margin-top:24px;">
        <div class="list-item">Each role becomes a system</div>
        <div class="list-item">Each system becomes a demo</div>
        <div class="list-item">Each demo becomes proof</div>
      </div>
    </div>
  </section>
</main>
```

---

## Recommended file layout

This matches the shell’s scene organization pattern 

```text
src/generated/demo-resume/
├── scene-01-title/index.html
├── scene-02-system-map/index.html
├── scene-03-edward-jones-problem/index.html
├── scene-04-architecture/index.html
├── scene-05-command-center/index.html
├── scene-06-impact/index.html
├── scene-07-financial-automation/index.html
├── scene-08-ai-orchestration/index.html
├── scene-09-embedded-systems/index.html
└── scene-10-closing/index.html
```

## Suggested deck routes

```json
{
  "content": {
    "route": "./src/generated/demo-resume/scene-01-title/index.html"
  }
}
```

That route pattern is consistent with the presentation contract format you already have 

