# Presentation Runtime Shell

A lightweight, zero-build presentation engine for creating and delivering high-fidelity demo presentations — the kind used in YouTube videos and live demos. Scenes are standalone HTML files; the shell orchestrates narration, playback, and navigation.

---

## Running the App

No build step. No server required.

```
Open index.html in a browser.
```

Or serve statically (recommended for iframe routing):

```bash
npx serve .
# or
python -m http.server 8080
```

The app boots, seeds any missing decks from `/src/contracts/`, and routes to `#/library`.

All data persists to **browser localStorage** under the key `prs_library`.

### Running tests

```bash
npm test
```

Tests use Node's built-in test runner (`node:test`). Node 18+ required, no dependencies to install.

---

## Core Concepts

### Presentation
A named collection of scenes with settings (playback mode, typing speed, theme). Persisted to localStorage. Created from a JSON contract or from scratch in the library.

### Scene
A single slide — one iframe-hosted HTML file paired with a presenter script (blocks of text typed character-by-character) and an advance rule. Scenes are fully self-contained HTML files with inline CSS and JS; no external dependencies.

### Deck Contract
A JSON file in `/src/contracts/` that defines a full presentation. The filename must match the deck's `id` field (e.g. `my-deck.json` must contain `"id": "my-deck"`). Seeded into the store on first load. See [`skills/deck-json-reference.md`](skills/deck-json-reference.md) for the full schema.

### Runtime
The engine that drives playback: loads the deck, navigates iframes, runs the presenter typewriter, and waits for advance conditions. Lives as a singleton across screen transitions.

### Edit Intent
A per-scene text field describing what the scene should accomplish. Used as context for AI-assisted scene regeneration.

---

## Magic Links

The **Copy Link** button in the workspace generates a self-contained URL that encodes the current presentation settings directly in the query string. No server or database required — opening the link anywhere reproduces the exact playback configuration, including any per-scene advance rules you configured in the inspector.

### URL format

```
https://your-host/#/present/{deckId}?cfg={BASE64URL_JSON}
```

The `cfg` parameter is a base64url-encoded JSON payload. If there are no overrides beyond the contract defaults, the `?cfg=` param is omitted entirely and a plain `#/present/{deckId}` link is generated.

### What travels in the link

| Included | Excluded |
|----------|----------|
| Playback mode | Selected scene in workspace |
| Typing speed | Panel layout |
| Controls position | Collapsed sections |
| Between-scenes delay | Search filters |
| Theme (shell, accent, presenter position) | Any local author prefs |
| Per-scene advance rules (type, delay, event) | |
| Demo state (tenant, scenario, etc.) | |

Per-scene advance rules are encoded automatically from the library store when you click **Copy Link**. You do not need to edit the JSON contract file to change how a scene advances for a specific client — configure it in the inspector, copy the link, and the client gets exactly what you set.

Only non-`manual` advances are encoded (manual is the default and adds no payload weight). A deck with five `waitForEvent` and `delay` scenes adds roughly 200–300 bytes to the link.

### Precedence when opening a magic link

1. Code defaults
2. Contract baseline (`/src/contracts/{id}.json`)
3. URL overrides (`?cfg=` param) — including per-scene advance rules
4. Author prefs apply in workspace only — never affect link-only playback

### Adding a new presentable deck

1. Create `/src/contracts/{id}.json` where the filename matches the `"id"` field inside the file.
2. Add the path to `/src/contracts/manifest.json`.
3. The deck will be seeded into the library on next load and will be accessible via `#/present/{id}`.

---

## Folder Structure

```
presentation-runtime-shell/
├── index.html                    # Entry point
├── package.json                  # type: module + npm test script
├── styles/
│   ├── shell.css                 # App shell, top bar, global tokens
│   └── screens/
│       ├── library.css
│       ├── workspace.css
│       └── import-scene.css
├── src/
│   ├── main.js                   # Bootstrap: store → router → shell → screens
│   ├── core/
│   │   ├── deck-runtime.js       # Top-level runtime API
│   │   ├── scene-runner.js       # Single-scene execution lifecycle
│   │   ├── presenter-engine.js   # Character-by-character typewriter
│   │   ├── library-store.js      # Presentation/scene CRUD + localStorage
│   │   ├── state-store.js        # Observable state container
│   │   ├── event-bus.js          # Simple pub/sub
│   │   ├── router.js             # Hash-based router
│   │   ├── runtime-singleton.js  # Keeps runtime alive across navigations
│   │   ├── contract-loader.js    # Normalizes raw deck JSON
│   │   └── magic-link.js         # URL config encode/decode, merge, link builder
│   ├── screens/
│   │   ├── library.js            # #/library — presentation grid
│   │   ├── workspace.js          # #/presentation/:id — editor + canvas
│   │   ├── present.js            # #/present/:id — fullscreen player
│   │   └── import-scene.js       # #/presentation/:id/import
│   ├── ui/
│   │   ├── app-shell.js          # Persistent frame: top bar + left nav
│   │   ├── layout-manager.js     # Workspace / split / fullscreen modes
│   │   ├── inspector-panel.js    # Right rail: scene metadata + settings
│   │   ├── scene-list.js         # Left rail: scene navigator
│   │   └── ...
│   ├── contracts/
│   │   ├── manifest.json         # Ordered list of contract paths to seed
│   │   ├── demo-deck.json        # 3-scene starter demo
│   │   ├── msp-demo-deck.json    # MSP Command Center demo
│   │   ├── mortgage-audit-demo.json  # Mortgage closing document audit demo
│   │   └── ...                   # filename must match deck id field
│   └── generated/
│       ├── msp/                  # MSP Command Center scene HTML files
│       └── mortgage-audit/       # Mortgage audit scene HTML files
│           ├── scene-00-import/  # File system import (waitForEvent)
│           ├── scene-01-intake/  # Loan file after import (delay)
│           ├── scene-02-classify/ # Classification animation (waitForEvent)
│           ├── scene-03-review/  # Reviewer confirmation (waitForEvent)
│           ├── scene-04-separate/ # Separation of record (waitForEvent)
│           └── scene-05-audit/   # Audit-ready proof (manual)
├── tests/
│   └── magic-link.test.js        # Parser, merge, builder, round-trip tests
├── skills/                       # Task-oriented how-to guides
└── docs/                         # Architecture and design docs
```

---

## Screens

### Library (`#/library`)
- Browse, search, and filter presentations
- Create, duplicate, archive, or delete decks
- Open any deck into the workspace

### Present (`#/present/:id`)
Fullscreen client-facing player. Loaded directly from the contract file — localStorage is never consulted. Accepts an optional `?cfg=` magic link parameter to override playback settings, theme, and per-scene advance rules. Use **Copy Link** in the workspace to generate a shareable URL.

### Workspace (`#/presentation/:id`)
The main authoring and presenting environment. Three columns:

| Left rail | Center canvas | Right rail |
|-----------|--------------|------------|
| Scene list | Live iframe preview | Inspector |
| Add / reorder / delete scenes | Narrator status | Scene title + type |
| | Transport controls | Advance rule |
| | Edit Intent textarea | Presentation settings |
| | Edit Text / Import Scene | Actions |

### Layout Modes
Switch via the **Preview ▾** dropdown or **Present** button:

| Mode | How to enter | Description |
|------|-------------|-------------|
| **Workspace** | Default | iframe embedded in the canvas column |
| **Split** | Preview → Split view | Left: scene list. Right: fullscreen iframe |
| **Fullscreen** | Present button | Full viewport iframe + hover-reveal HUD |

---

## Playback & Transport

### Transport Controls
Available in both the workspace canvas and the fullscreen HUD:

| Button | Action |
|--------|--------|
| `«` | Jump to first scene |
| `‹` | Previous scene |
| `▶ / ⏸` | **Play/Pause** — pauses the typewriter mid-narration; resumes from exactly where it stopped. Also acts as "advance" when waiting between scenes. |
| `›` | Next scene |
| `»` | Jump to last scene |

### Keyboard Shortcuts
Active in **Split** and **Fullscreen** modes:

| Key | Action |
|-----|--------|
| `Space` / `→` | Advance (next scene or skip typing) |
| `←` | Previous scene |
| `r` | Replay current scene |
| `s` | Skip typing (flush narration instantly) |
| `Esc` | Exit split / fullscreen → workspace |

### Playback Modes

| Mode | Behaviour |
|------|-----------|
| **Interactive** | Manual advance only; respects each scene's advance rule |
| **Autoplay** | Manual → replaced by `betweenScenesMs` delay; iframe events still respected |
| **Capture** | Fully deterministic; all waits become fixed delays (for recording) |

---

## Scene Advance Rules

| Type | When to use |
|------|-------------|
| `manual` | Presenter clicks next (default) |
| `auto` | Immediately advance after typing finishes |
| `delay` | Wait `delayMs` milliseconds, then advance |
| `waitForEvent` | Wait for the iframe to post a named event (e.g., `"chart:animated"`) — the inspector shows a datalist of events already used in the deck |

---

## Creating Content

See the skills folder for step-by-step guides:

- [`skills/creating-a-presentation.md`](skills/creating-a-presentation.md) — build a deck from scratch (JSON + scene HTML)
- [`skills/scene-authoring.md`](skills/scene-authoring.md) — write high-quality scene HTML with animations and narration
- [`skills/presenting-live.md`](skills/presenting-live.md) — run a polished presentation using workspace + fullscreen
- [`skills/deck-json-reference.md`](skills/deck-json-reference.md) — complete JSON schema reference

---

## Runtime State Reference

The runtime emits state on every change. Key fields:

```js
{
  status:            "idle" | "starting" | "loading-scene" | "waiting-iframe"
                   | "presenting" | "paused" | "waiting-advance"
                   | "end-card" | "complete",
  playbackMode:      "interactive" | "autoplay" | "capture",
  currentSceneIndex: number,
  presenter: {
    mode:      "thinking" | "reveal" | "impact",
    text:      string,   // text visible so far
    isTyping:  boolean
  },
  iframe: {
    route:    string,
    isReady:  boolean
  }
}
```

---

## Runtime API

```js
runtime.load(deckData)          // Load a presentation
runtime.next()                  // Advance
runtime.previous()              // Go back one scene
runtime.goTo(index)             // Jump to scene by index
runtime.pause()                 // Pause typewriter mid-narration
runtime.resume()                // Resume from pause
runtime.skipTyping()            // Flush narration instantly
runtime.replayLine()            // Restart current scene
runtime.setPlaybackMode(mode)   // "interactive" | "autoplay" | "capture"
runtime.subscribe(fn)           // Subscribe to state changes → returns unsubscribe fn
runtime.attachTo(iframeEl)      // Re-point runtime at a different iframe
```
