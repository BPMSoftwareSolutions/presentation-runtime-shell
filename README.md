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

---

## Core Concepts

### Presentation
A named collection of scenes with settings (playback mode, typing speed, theme). Persisted to localStorage. Created from a JSON contract or from scratch in the library.

### Scene
A single slide — one iframe-hosted HTML file paired with a presenter script (blocks of text typed character-by-character) and an advance rule. Scenes are fully self-contained HTML files with inline CSS and JS; no external dependencies.

### Deck Contract
A JSON file in `/src/contracts/` that defines a full presentation. Seeded into the store on first load. See [`skills/deck-json-reference.md`](skills/deck-json-reference.md) for the full schema.

### Runtime
The engine that drives playback: loads the deck, navigates iframes, runs the presenter typewriter, and waits for advance conditions. Lives as a singleton across screen transitions.

### Edit Intent
A per-scene text field describing what the scene should accomplish. Used as context for AI-assisted scene regeneration.

---

## Folder Structure

```
presentation-runtime-shell/
├── index.html                    # Entry point
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
│   │   └── contract-loader.js    # Normalizes raw deck JSON
│   ├── screens/
│   │   ├── library.js            # #/library — presentation grid
│   │   ├── workspace.js          # #/presentation/:id — editor + canvas
│   │   └── import-scene.js       # #/presentation/:id/import
│   ├── ui/
│   │   ├── app-shell.js          # Persistent frame: top bar + left nav
│   │   ├── layout-manager.js     # Workspace / split / fullscreen modes
│   │   ├── inspector-panel.js    # Right rail: scene metadata + settings
│   │   ├── scene-list.js         # Left rail: scene navigator
│   │   └── ...
│   ├── contracts/
│   │   ├── demo-deck.json        # 3-scene starter demo
│   │   └── msp-demo-deck.json    # 8-scene MSP Command Center demo
│   └── generated/
│       └── msp/                  # Self-contained scene HTML files
│           ├── scene-01-title/
│           ├── scene-02-tenants/
│           └── ... (8 total)
├── skills/                       # Task-oriented how-to guides
└── docs/                         # Architecture and design docs
```

---

## Screens

### Library (`#/library`)
- Browse, search, and filter presentations
- Create, duplicate, archive, or delete decks
- Open any deck into the workspace

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
| `waitForEvent` | Wait for the iframe to post a named event (e.g., `"chart:animated"`) |

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
