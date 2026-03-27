# Skill: Scene Authoring

A scene is a self-contained HTML file. It lives inside an iframe and is responsible for its own visual content. The shell handles narration, navigation, and timing — the scene just needs to look great.

Location convention in this repo: place each scene at `src/generated/<deck-id>/<scene-folder>/index.html` (one folder per scene), not as flat HTML files under the deck root.

---

## The Golden Rules

1. **No external dependencies.** All CSS and JS must be inline. No CDN links, no imports.
2. **`overflow: hidden` on `html, body`.** The iframe has a fixed size; scrollbars break the illusion.
3. **`height: 100%` on the scene root.** The iframe fills its container; the scene should fill the iframe.
4. **Animations on entry.** Every element should animate in — static slides look dead on camera.
5. **Dark background by default.** Use `#08101d` to match the shell chrome.

---

## Base Template

Every scene starts from this foundation:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Scene Name</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      height: 100%;
      background: #08101d;
      color: #eef2ff;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      overflow: hidden;
    }

    .scene {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 32px;
      position: relative;
    }

    /* Subtle grid background */
    .grid-lines {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    /* Stagger reveal animation */
    @keyframes reveal-in {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
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

    <!-- Content here — add data-reveal to anything that should animate in -->

  </div>
  <script>
    // Stagger reveal delays
    document.querySelectorAll("[data-reveal]").forEach((el, i) => {
      el.style.animationDelay = `${0.15 + i * 0.25}s`;
    });
  </script>
</body>
</html>
```

---

## The AI Narration Panel

Add this to scenes where the AI narrator's text should appear on-screen (typewriter effect in the scene itself, separate from the shell):

```html
<!-- In HTML -->
<div class="narration">
  <div class="narration-eyebrow">AI Operator</div>
  <div class="narration-text"><span id="narr"></span><span class="cursor"></span></div>
</div>
```

```css
/* In CSS */
.narration {
  position: relative; z-index: 1;
  width: 100%; max-width: 520px;
  padding: 14px 20px;
  border: 1px solid rgba(139,92,246,0.18);
  border-radius: 10px;
  background: rgba(139,92,246,0.04);
  opacity: 0;
  animation: reveal-in 0.5s 0.1s ease forwards;
}
.narration-eyebrow {
  font-size: 9px; text-transform: uppercase;
  letter-spacing: 0.18em; color: #6d28d9; margin-bottom: 8px;
}
.narration-text { font-size: 13px; line-height: 1.7; color: #94a3b8; }
.cursor {
  display: inline-block; width: 2px; height: 0.85em;
  background: #a78bfa; margin-left: 1px; vertical-align: text-bottom;
  animation: blink-cursor 0.75s step-end infinite;
}
@keyframes blink-cursor { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
```

```js
// In script — typewriter effect
(async function() {
  const el = document.getElementById('narr');
  const lines = [
    { text: "First sentence.", pauseMs: 700 },
    { text: " Second sentence.", pauseMs: 0 }
  ];
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(400);
  for (const { text, pauseMs } of lines) {
    for (const ch of text) { el.textContent += ch; await sleep(22); }
    if (pauseMs) await sleep(pauseMs);
  }
})();
```

---

## SVG Arc Gauges

Display percentages and confidence scores as animated arcs.

The trick: `r="15.9"` makes circumference ≈ 100, so `stroke-dasharray="X 100"` maps directly to percentage.

```html
<svg viewBox="0 0 36 36" style="width:28px;height:28px">
  <circle cx="18" cy="18" r="15.9" fill="none"
          stroke="rgba(255,255,255,0.06)" stroke-width="3.2"/>
  <circle class="arc-fill" cx="18" cy="18" r="15.9" fill="none"
          stroke="#10b981" stroke-width="3.2"
          stroke-dasharray="0 100" stroke-linecap="butt"
          transform="rotate(-90 18 18)"
          data-pct="98.4"/>
</svg>
```

```js
// Animate arc from 0 to target percentage
function animateArc(el) {
  const pct = parseFloat(el.dataset.pct);
  const revealEl = el.closest('[data-reveal]') || el;
  const revealDelay = parseFloat(revealEl.style.animationDelay || '0.2');
  const start = performance.now() + (revealDelay + 0.35) * 1000;
  const duration = 1000;
  (function tick(now) {
    if (now < start) { requestAnimationFrame(tick); return; }
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.setAttribute('stroke-dasharray', `${(pct * eased).toFixed(2)} 100`);
    if (t < 1) requestAnimationFrame(tick);
    else el.setAttribute('stroke-dasharray', `${pct} 100`);
  })(performance.now());
}
document.querySelectorAll('.arc-fill[data-pct]').forEach(animateArc);
```

---

## Horizontal Progress Bars

```html
<div class="bar-track">
  <div class="bar-fill bar-fill--green" data-target="72"></div>
</div>
```

```css
.bar-track {
  height: 4px; background: rgba(255,255,255,0.06);
  border-radius: 2px; overflow: hidden; width: 80px;
}
.bar-fill { height: 100%; border-radius: 2px; width: 0; }
.bar-fill--green { background: #10b981; }
.bar-fill--amber { background: #f59e0b; }
.bar-fill--red   { background: #ef4444; }
```

```js
document.querySelectorAll('.bar-fill[data-target]').forEach(el => {
  const target = parseFloat(el.dataset.target);
  if (target === 0) return;
  const revealEl = el.closest('[data-reveal]') || el;
  const delay = parseFloat(revealEl.style.animationDelay || '0.2') + 0.3;
  setTimeout(() => {
    el.style.transition = 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.width = target + '%';
  }, delay * 1000);
});
```

---

## Count-Up Number Animation

Animates any numeric text node from 0 to its final value. Works even when a `<span>` (e.g., trend arrow) is a sibling inside the element — it targets only the text node.

```js
document.querySelectorAll(".metric-value").forEach(el => {
  const textNode = [...el.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
  if (!textNode) return;
  const raw = textNode.textContent.trim();
  // Matches: optional prefix ($, +, −) + number + optional suffix (%, s, k/min, etc.)
  const match = raw.match(/^([+\u2212\-$]?)(\d+\.?\d*)(.*)$/);
  if (!match) return;
  const prefix = match[1], endVal = parseFloat(match[2]), suffix = match[3];
  const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0;
  if (isNaN(endVal)) return;
  const revealEl = el.closest('[data-reveal]') || el;
  const revealDelay = parseFloat(revealEl.style.animationDelay || '0.2');
  const countStart = performance.now() + (revealDelay + 0.25) * 1000;
  const duration = 1000;
  textNode.textContent = prefix + (0).toFixed(decimals) + suffix;
  (function tick(now) {
    if (now < countStart) { requestAnimationFrame(tick); return; }
    const t = Math.min((now - countStart) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    textNode.textContent = prefix + (endVal * eased).toFixed(decimals) + suffix;
    if (t < 1) requestAnimationFrame(tick);
    else textNode.textContent = prefix + endVal.toFixed(decimals) + suffix;
  })(performance.now());
});
```

---

## Standard Color Palette

```css
/* Backgrounds */
--bg:         #08101d;   /* page background */
--surface:    rgba(255,255,255,0.03);
--surface-2:  rgba(255,255,255,0.06);

/* Text */
--text:       #eef2ff;   /* primary */
--muted:      #94a3b8;   /* body */
--dim:        #475569;   /* labels, timestamps */

/* Accents */
--green:      #10b981;   /* success, healthy, recovered */
--amber:      #f59e0b;   /* warning, degraded */
--red:        #ef4444;   /* error, down, alert */
--indigo:     #818cf8;   /* metrics, detection */
--violet:     #a78bfa;   /* AI operator, diagnosis */

/* Borders */
--border:     rgba(255,255,255,0.08);
--border-green: rgba(16,185,129,0.25);
--border-amber: rgba(245,158,11,0.3);
--border-red:   rgba(239,68,68,0.3);
```

---

## Ambient Background Effects

These add depth without distracting from content:

```html
<!-- Soft radial glow orbs -->
<div class="orb-1"></div>
<div class="orb-2"></div>
```

```css
.orb-1 {
  position: absolute; width: 500px; height: 500px; border-radius: 50%;
  filter: blur(100px);
  background: radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%);
  top: -100px; right: -100px;
}
.orb-2 {
  position: absolute; width: 360px; height: 360px; border-radius: 50%;
  filter: blur(80px);
  background: radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%);
  bottom: -80px; left: -80px;
}
```

---

## Communicating with the Shell

### Signal that the scene is ready (optional)
If the deck sets `"waitForReady": true`, the scene must fire this once its content is loaded:

```js
window.parent.postMessage({ type: "iframe:ready" }, "*");
```

### Trigger advance programmatically
If the advance rule is `"waitForEvent"` with `"event": "animation:complete"`:

```js
// After your animation finishes:
window.parent.postMessage({ type: "animation:complete" }, "*");
```

### Receive actions from the shell
The deck can define `actions` that post messages to the iframe before narration starts:

```js
window.addEventListener("message", (e) => {
  if (e.data?.type === "scenario:set") {
    applyScenario(e.data.payload);
  }
});
```
