# Vanilla JS v1 architecture

## Design principle

Split the system into two layers:

1. **Core runtime**

   * plain JS
   * owns sequencing, timing, messaging, contract execution
   * no DOM-framework assumptions

2. **UI adapters**

   * presenter panel
   * controls
   * scene inspector
   * all replaceable later by React

That way, React can wrap the runtime later instead of replacing it.

---

# Suggested file structure

```text
/index.html
/styles/
  shell.css
/src/
  core/
    deck-runtime.js
    scene-runner.js
    event-bus.js
    contract-loader.js
    iframe-bridge.js
    presenter-engine.js
    state-store.js
  ui/
    presenter-panel.js
    controls.js
    timeline.js
    dom-renderer.js
  contracts/
    demo-deck.json
  generated/
    opening/index.html
    lab/index.html
    summary/index.html
  main.js
```

---

# Responsibility split

## `core/`

Pure logic. Minimal DOM knowledge.

### `deck-runtime.js`

Top-level orchestrator.

Responsibilities:

* load contract
* manage current scene index
* start / pause / resume / next / previous
* expose runtime API

### `scene-runner.js`

Executes one scene.

Responsibilities:

* navigate iframe
* wait for ready event
* run actions
* play presenter script
* resolve advance conditions

### `presenter-engine.js`

Handles typing logic only.

Responsibilities:

* type blocks
* pause
* skip
* replay
* emit events like `presenter:blockStart`, `presenter:done`

This should not directly touch DOM if possible.

### `iframe-bridge.js`

Owns `iframe` communication.

Responsibilities:

* set route
* send `postMessage`
* listen for iframe events
* wait for `iframe:ready`
* normalize message payloads

### `contract-loader.js`

Loads and validates contract.

Responsibilities:

* fetch JSON
* normalize defaults
* perform lightweight validation
* return canonical structure

### `event-bus.js`

Simple pub/sub.

Responsibilities:

* decouple core and UI
* allow later React integration

### `state-store.js`

Tiny observable store.

Responsibilities:

* keep runtime state
* notify UI on updates

---

# UI layer in v1

## `ui/dom-renderer.js`

Bridges runtime state to DOM.

Responsibilities:

* update presenter text
* reflect scene title / progress
* update play/pause buttons
* render debug info

This is the part React can later replace.

## `ui/presenter-panel.js`

DOM-specific presenter rendering.

Responsibilities:

* display typed text
* animate cursor
* render presenter mode (`thinking`, `reveal`, `impact`)

## `ui/controls.js`

Wires buttons to runtime API.

Responsibilities:

* next
* previous
* play/pause
* skip typing

## `ui/timeline.js`

Optional scene list / progress UI.

---

# Data flow

```text
JSON Contract
   ↓
contract-loader
   ↓
deck-runtime
   ↓
scene-runner
   ├─ presenter-engine
   ├─ iframe-bridge
   └─ state-store
            ↓
        DOM renderer
```

---

# Runtime API shape

Keep this stable so React can adopt it later.

```js
runtime.load(deck)
runtime.start()
runtime.pause()
runtime.resume()
runtime.next()
runtime.previous()
runtime.skipTyping()
runtime.getState()
runtime.subscribe(listener)
```

If React comes later, components can subscribe to this same API.

---

# State shape

Use one plain object.

```js
{
  status: "idle",
  currentSceneIndex: 0,
  presenter: {
    mode: "thinking",
    text: "",
    isTyping: false
  },
  iframe: {
    route: "",
    isReady: false
  },
  controls: {
    canNext: false,
    canPrevious: false
  }
}
```

Keep it serializable and framework-neutral.

---

# Scene execution flow

```js
async function runScene(scene) {
  state.update({ status: "loading-scene" })

  await iframeBridge.navigate(scene.content.route)

  if (scene.content.waitForReady) {
    await iframeBridge.waitForReady(scene.id)
  }

  await runActions(scene.actions || [])

  state.update({ status: "presenting" })
  await presenterEngine.play(scene.presenter)

  state.update({ status: "waiting-advance" })
  await waitForAdvance(scene.advance)
}
```

This logic should live outside the UI.

---

# Example event bus

```js
bus.emit("scene:start", { sceneId })
bus.emit("presenter:update", { text })
bus.emit("presenter:done", { sceneId })
bus.emit("iframe:ready", { sceneId })
bus.emit("runtime:state", state)
```

React later can listen to these same events.

---

# Why this keeps the door open to React

Because React would only replace:

* `dom-renderer.js`
* `presenter-panel.js`
* `controls.js`
* `timeline.js`

It would **not** replace:

* contract format
* runtime API
* scene execution
* iframe messaging
* presenter engine
* state model

So migration becomes:

## v1

Vanilla JS UI + vanilla JS runtime

## v2

React UI + same runtime

## v3

Optional full React shell, still using the same core modules

---

# Migration path to React later

## Step 1

Keep core modules DOM-free.

Bad:

```js
document.querySelector("#presenter").innerHTML = text
```

Better:

```js
bus.emit("presenter:update", { text })
```

## Step 2

Expose runtime as an object.

```js
const runtime = createDeckRuntime(...)
window.runtime = runtime
```

Later React can consume it directly.

## Step 3

Treat the UI as an adapter, not the app itself.

The runtime is the app.
The DOM or React tree is just a view over it.

---

# Strong v1 implementation rule

**Do not mix orchestration logic into click handlers or DOM components.**

Bad:

* button click directly mutates scene logic
* presenter typing code directly navigates iframe
* iframe messages directly manipulate DOM

Good:

* UI calls runtime API
* runtime updates store / emits events
* UI re-renders from state

That separation is what preserves the upgrade path.

---

# Minimal boot sequence

```js
import { loadContract } from "./core/contract-loader.js";
import { createDeckRuntime } from "./core/deck-runtime.js";
import { mountDomRenderer } from "./ui/dom-renderer.js";

const deck = await loadContract("/src/contracts/demo-deck.json");
const runtime = createDeckRuntime();
mountDomRenderer(runtime, document);
await runtime.load(deck);
runtime.start();
```

---

# Best v1 boundary

## Core = stable

* contract
* runtime
* messaging
* sequencing

## UI = disposable

* HTML structure
* CSS
* controls
* layout
* presenter visuals

That is the cleanest way to prototype fast without locking yourself out of React later.

