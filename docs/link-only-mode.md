# Implementation Plan: Shareable Presentation Links ("Link-Only Mode")

## Overview

Add a **Link-Only mode** that lets a presenter copy a direct URL to any deck and share it with a client. When a client opens the link, the deck plays immediately in a stripped presentation player — no workspace chrome, no library navigation, no developer controls. The client can use transport controls (prev / next / first / last) but cannot reach any authoring screen.

---

## User Stories

| Role | Story |
|------|-------|
| Presenter | From the library or workspace, I click "Copy Link" and get a shareable URL on my clipboard. |
| Client | I open the link and the presentation starts playing immediately, full-canvas. |
| Client | I can navigate scenes with on-screen buttons or arrow keys. |
| Client | There is no way for me to reach the Library, Workspace, or any authoring view. |

---

## Route Design

Add a new route alongside the existing ones:

```
#/present/:id
```

This is the only route served in Link-Only mode. The existing routes are unchanged.

**Shareable URL shape:**
```
https://host/index.html#/present/finance-demo-2024
```

`id` matches the deck's `id` field from the contract JSON, same as the workspace route.

---

## Architecture

### Isolated Boot Path

The present screen must guarantee that no workspace chrome is reachable. **Branch in `main.js` before the app shell mounts** — if the initial hash matches `#/present/:id`, call a dedicated `bootPresentMode()` instead of the standard `mountAppShell()` path.

```
boot()
  ├─ hash matches #/present/:id?
  │     YES → seedIfEmpty(store) → bootPresentMode(id, store)
  │     NO  → mountAppShell() → register normal routes → router.start()
```

The full shell is never constructed for link-only sessions. There is no shared DOM state between modes.

### Layered Responsibilities

The review identified that naively wiring present mode risks duplicating control logic already expressed in the workspace and fullscreen modes. The correction is a strict three-layer model:

```
Runtime  (single source of truth — unchanged)
    ↓
TransportController  (new shared module — wires runtime ↔ DOM buttons)
    ↓
Present UI  (thin render layer — listen → render → forward input)
```

`present.js` must not derive state, interpret mode transitions, or contain playback rules. It only mounts DOM, hands elements to the TransportController, and reacts to the `subscribe` stream to update display strings.

---

## Files Changed

| File | Change |
|------|--------|
| `src/main.js` | Detect `#/present/:id` at boot; branch to `bootPresentMode` |
| `src/ui/transport-controller.js` | **New** — shared module binding runtime state to transport button elements |
| `src/screens/present.js` | **New** — thin link-only player; delegates all control logic to TransportController |
| `src/ui/presentation-card.js` | Add "Copy Link" to card overflow menu |
| `src/screens/library.js` | Add "Copy Link" button to right detail panel |
| `src/screens/workspace.js` | Add "Copy Link" button to top-bar actions |
| `styles/screens/present.css` | **New** — styles for the stripped player |
| `index.html` | Link `present.css` |

---

## Step-by-Step Implementation

### Step 1 — `src/main.js`: Branch on initial hash

Add a helper `parsePresentId(hash)` that returns the deck id if the hash matches `#/present/<id>`, or `null` otherwise. It must safely `decodeURIComponent` the extracted segment and return `null` for any value that is empty, contains `/`, or cannot be decoded (wrap in try/catch). Call it during `boot()` **after** `seedIfEmpty` resolves — the store must be populated before checking `getById`:

```js
await seedIfEmpty(store);

const presentId = parsePresentId(location.hash);
if (presentId) {
  await bootPresentMode(presentId, store);
  return;
}

// Normal authoring shell
const router = createRouter();
// ...
```

`bootPresentMode(id, store)` imports and mounts the present screen directly into `#app`. The router is never started and the app shell is never constructed for link-only sessions.

---

### Step 2 — `src/ui/transport-controller.js`: Shared transport binding

Extract the repeated pattern of wiring runtime state to a set of transport button elements. This module is consumed by present mode today and can replace the equivalent inline code in the fullscreen overlay in a follow-up.

```js
/**
 * Binds a set of transport button elements to a DeckRuntime instance.
 * Handles disabled states, play/pause label, and click wiring.
 * Returns an `unbind()` function to clean up the subscription.
 *
 * @param {object} runtime  — DeckRuntime instance
 * @param {object} elements — { firstBtn, prevBtn, nextBtn, lastBtn,
 *                              playPauseBtn?, counterEl?, labelEl? }
 * @param {function} getTotal — () => number of scenes in the active deck
 */
export function createTransportController(runtime, elements, getTotal) {
  const { firstBtn, prevBtn, nextBtn, lastBtn, playPauseBtn, counterEl, labelEl } = elements;

  if (firstBtn) firstBtn.addEventListener("click", () => runtime.goTo(0));
  if (prevBtn)  prevBtn.addEventListener("click",  () => runtime.previous());
  if (nextBtn)  nextBtn.addEventListener("click",  () => runtime.next());
  if (lastBtn)  lastBtn.addEventListener("click",  () => {
    const total = getTotal();
    if (total > 0) runtime.goTo(total - 1);
  });
  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      const s = runtime.getState();
      if (s.status === "presenting") runtime.pause();
      else if (s.status === "paused") runtime.resume();
      else runtime.next();
    });
  }

  const unsub = runtime.subscribe((state) => {
    const total = getTotal();
    const idx   = state.currentSceneIndex;
    const isPresenting = state.status === "presenting";
    const isPaused     = state.status === "paused";
    const validIdx     = idx >= 0;

    if (firstBtn)    firstBtn.disabled    = !validIdx || idx <= 0;
    if (prevBtn)     prevBtn.disabled     = !validIdx || idx <= 0;
    if (nextBtn)     nextBtn.disabled     = !validIdx || idx >= total - 1;
    if (lastBtn)     lastBtn.disabled     = !validIdx || idx >= total - 1;
    if (counterEl)   counterEl.textContent = validIdx ? `${idx + 1} / ${total}` : `— / ${total}`;
    if (playPauseBtn) {
      playPauseBtn.textContent = isPresenting ? "⏸" : "▶";
      playPauseBtn.title = isPresenting ? "Pause" : isPaused ? "Resume" : "Advance";
    }
    // labelEl update is left to the caller — it requires store access for scene title
  });

  return { unbind: unsub };
}

> **Implementation note — behavior adapter vs. passive binder:** The `playPauseBtn` click handler contains a runtime-state interpretation policy (pause vs. resume vs. advance). This is intentional for V1 but means `TransportController` is a *shared transport behavior adapter*, not a purely mechanical DOM binder. If future modes need divergent play/pause semantics, this is the file to extend.
```

---

### Step 3 — `src/screens/present.js`: The link-only player

`present.js` is a **thin render layer**. It owns:

- Mounting and tearing down DOM
- Delegating transport wiring to `createTransportController`
- Updating the scene title label and counter header text from the runtime subscribe stream
- Managing the end card visibility
- Showing a brief loading state while the iframe attaches
- Attaching keyboard shortcuts (no `Escape` handler)
- Auto-hiding controls after 3 s of inactivity

It does **not** own:
- Button disabled-state logic (TransportController)
- Playback decisions
- Any reference to workspace or library routes

**DOM structure:**
```html
<div class="ps-player" id="ps-player">
  <div class="ps-header">
    <span class="ps-title" id="ps-title"><!-- deck title --></span>
    <span class="ps-counter" id="ps-counter"><!-- 1 / 8 --></span>
  </div>
  <div class="ps-loading" id="ps-loading">Loading presentation…</div>
  <iframe id="ps-frame" class="ps-iframe" src="about:blank" allow="fullscreen"></iframe>
  <div class="ps-controls" id="ps-controls">
    <button id="ps-first" title="First slide">«</button>
    <button id="ps-prev"  title="Previous slide">‹</button>
    <span   id="ps-label" class="ps-scene-label"><!-- scene title --></span>
    <button id="ps-next"  title="Next slide">›</button>
    <button id="ps-last"  title="Last slide">»</button>
  </div>
  <div class="ps-end-card is-hidden" id="ps-end-card">
    <p>Presentation complete</p>
    <button id="ps-replay">Watch again</button>
  </div>
</div>
```

**Loading state:** `.ps-loading` is visible by default; hidden on the iframe's `load` event for the first non-blank src assignment. Using `scene:willStart` (bus event) is unreliable here because it fires before the iframe has actually painted — the iframe `load` event is the earliest guarantee that visible content is present. Implementation: listen to `iframeEl.addEventListener("load", hideLoadingOnce, { once: true })` where `hideLoadingOnce` removes `.ps-loading`.

**Auto-hide (simplified):**
```js
let hideTimer;
function showControls() {
  playerEl.classList.add("controls-visible");
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => playerEl.classList.remove("controls-visible"), 3000);
}
// Trigger on any pointer or keyboard activity
playerEl.addEventListener("pointermove", showControls);
playerEl.addEventListener("pointerdown", showControls);
document.addEventListener("keydown", showControls);
showControls(); // start visible
```

No hover-on-controls exception, no iframe coordination — keep it simple and refine if needed.

**Keyboard handler (no Escape):**
```js
document.addEventListener("keydown", (e) => {
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); runtime.next(); }
  if (e.key === "ArrowLeft")                   { e.preventDefault(); runtime.previous(); }
});
```

**End card:** drive visibility from the existing `runtime.subscribe(state)` stream — show `#ps-end-card` when `state.status === "complete"`, hide it otherwise. This keeps a single observation model (state subscription) rather than mixing in a second bus event listener. The `runtime:complete` bus event is *not* used here; runtime state is the authoritative signal. "Watch again" calls `runtime.goTo(0)`, which transitions runtime status away from `"complete"`, causing the subscriber to hide the end card automatically.

**"Not found" state:** if `store.getById(id)` returns nothing after `seedIfEmpty`, replace `#app` contents with:
```html
<div class="ps-not-found">Presentation not found.</div>
```
No navigation links. No branding overhead for V1.

**Teardown / cleanup:** `present.js` must export (or internally maintain) a `destroy()` function called if the module is ever re-initialized. It must:
- Remove all `document.addEventListener` listeners (keydown handler + `showControls` keydown listener)
- `clearTimeout(hideTimer)`
- Call `transport.unbind()` to unsubscribe TransportController from runtime
- Call the `runtime.subscribe` unsubscribe function returned when subscribing for label/end-card updates
- Remove the `iframeEl.load` listener if it hasn't fired yet

Even though present mode is a distinct boot path where leaks are unlikely in practice, explicit cleanup prevents issues during any future internal reload or test harness.

---

### Step 4 — `styles/screens/present.css`: Stylesheet

The player fills the full viewport. Header and controls are slim overlay bars. The iframe is always 100 % of the viewport — bars float on top of it.

Key classes:
- `.ps-player` — `position: fixed; inset: 0; background: #000`
- `.ps-iframe` — `position: absolute; inset: 0; width: 100%; height: 100%; border: none`
- `.ps-loading` — absolute centered text overlay; hidden once first scene starts
- `.ps-header` — fixed top overlay, semi-transparent dark bg
- `.ps-controls` — fixed bottom overlay; opacity `0` by default, `1` when `.ps-player.controls-visible` — CSS transition for smooth fade
- `.ps-end-card` — absolute centered overlay on top of iframe; `z-index` above controls
- `.is-hidden` — `display: none`
- `.controls-visible .ps-controls` — `opacity: 1; pointer-events: auto`

Link the stylesheet in `index.html`:
```html
<link rel="stylesheet" href="./styles/screens/present.css" />
```

---

### Step 5 — "Copy Link" button: Three entry points

All three entry points share the same helper (defined locally per file — no shared utility needed at this scope):

```js
function copyPresentLink(id) {
  const url = `${location.origin}${location.pathname}#/present/${encodeURIComponent(id)}`;
  navigator.clipboard.writeText(url).catch(() => {
    prompt("Copy this link:", url);
  });
}
```

#### 5a — Library card overflow menu (`src/ui/presentation-card.js`)

Add a "Copy Link" item in the overflow menu HTML, before the destructive items:

```html
<button class="lib-overflow-menu__item" role="menuitem" data-action="copy-link">Copy Link</button>
```

Wire in the `switch` handler:
```js
case "copy-link": onCopyLink(); break;
```

`onCopyLink` is a new callback passed into `createPresentationCard`. Each call site in `library.js` passes `onCopyLink: () => copyPresentLink(p.id)`.

#### 5b — Library detail panel (`src/screens/library.js`)

Add a "Copy Link" button below the "Open" button in `renderDetail()`:

```html
<button type="button" class="btn btn--ghost btn--small" id="detail-copy-link">Copy Link</button>
```

Wire with visual feedback:
```js
detailEl.querySelector("#detail-copy-link").addEventListener("click", (e) => {
  copyPresentLink(p.id);
  const btn = e.currentTarget;
  btn.textContent = "Copied!";
  setTimeout(() => { btn.textContent = "Copy Link"; }, 1500);
});
```

#### 5c — Workspace top bar (`src/screens/workspace.js`)

Add a "Copy Link" button to `createTopBarActions`, placed between the existing "Preview ▾" and "Present" buttons:

```js
const copyLinkBtn = document.createElement("button");
copyLinkBtn.type = "button";
copyLinkBtn.className = "btn btn--ghost btn--small";
copyLinkBtn.textContent = "Copy Link";
copyLinkBtn.addEventListener("click", () => {
  copyPresentLink(id);
  copyLinkBtn.textContent = "Copied!";
  setTimeout(() => { copyLinkBtn.textContent = "Copy Link"; }, 1500);
});
```

---

## Behaviour Spec

| Scenario | Expected behaviour |
|----------|--------------------|
| Client opens a valid `#/present/:id` URL | Brief "Loading presentation…" overlay → deck starts playing immediately from scene 1 |
| Client opens a `#/present/:id` URL for a non-existent deck | "Presentation not found." occupies the full viewport — no navigation links |
| Client presses Escape | Nothing happens |
| Client presses Arrow keys | Previous / next scene; controls become visible |
| Client moves pointer | Controls fade in; auto-hide timer resets |
| Controls idle for 3 s | Controls fade out |
| Deck reaches the last scene | End card ("Presentation complete" + "Watch again") appears |
| Client clicks "Watch again" | Deck restarts from scene 1; end card hides |
| Presenter clicks "Copy Link" from any entry point | URL is written to clipboard; button briefly shows "Copied!" |
| Clipboard write fails (non-secure context) | URL is shown in a `prompt()` dialog for manual copy |
| Presenter is in the workspace and clicks "Present" | Existing fullscreen mode launches (unchanged) |

---

## Out of Scope

- Server-side auth or link expiry (links are public and permanent for this iteration)
- Password-protected links
- Link management / revocation UI
- Analytics / view tracking
- Autoplay-only mode for clients (clients use interactive navigation)
- Custom start-scene (`?scene=N`) parameter in the URL
- Refactoring existing fullscreen/split controls to use `TransportController` (follow-up)

---

## Resolved Design Decisions

| Question | Decision |
|----------|----------|
| Auto-start vs. click-to-start | **Auto-start** — matches "shared link" expectation; feels immediate; add optional splash only if mobile audio issues arise |
| Controls auto-hide threshold | **3 s** — standard video player convention; keep implementation simple |
| "Not found" copy | **"Presentation not found."** — plain text, no branding, no navigation links for V1 |
| URL encoding | Use `encodeURIComponent(id)`; confirm no ids contain `/` or `#` at authoring time |
