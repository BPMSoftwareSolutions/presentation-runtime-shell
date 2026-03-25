# V1 Implementation Plan

**What we're proving:**
> Editing a scene while a persistent runtime previews it — then instantly shifting
> into split or fullscreen presentation — feels meaningfully better than slides.

Everything in this plan serves that proof. Nothing else ships in v1.

**Source documents:**
- `implementation-plan.md` — full architecture and roadmap (treat as v2+ reference)
- `v1-implementation-plan-review.md` — what's right and what's overbuilt
- `stripped-execution-plan.md` — the stripped scope this plan is built from

---

## Current state

The runtime shell already works. These files are stable and untouched by this plan:

| File | Status |
|---|---|
| `src/core/event-bus.js` | Stable |
| `src/core/state-store.js` | Stable |
| `src/core/presenter-engine.js` | Stable |
| `src/core/scene-runner.js` | Stable |
| `src/core/contract-loader.js` | Stable |
| `src/core/deck-runtime.js` | Two small additions only (see Phase 4) |
| `src/contracts/demo-deck.json` | Seeds the library on first run |
| `src/generated/opening/`, `lab/`, `summary/` | Unchanged |

`src/main.js` and `index.html` get replaced by the new app shell structure.
`styles/shell.css` gets a token upgrade before any new screens are written.

---

## V1 scope: 3 screens, 5 phases

```text
Phase 1 — Foundation       router, store, app shell, token upgrade
Phase 2 — Library          Screen 01: create / open / manage presentations
Phase 3 — Workspace        Screen 02: edit one presentation, one scene at a time
Phase 4 — Modes            workspace → split → fullscreen (same runtime instance)
Phase 5 — Import           Screen 03: copy a scene from this or another presentation
```

### Routes

```text
#/library
#/presentation/:id
#/presentation/:id/import
```

### Explicitly not in v1

- Scene Variants screen
- Shared Scene Library screen
- Change Review / before-after diff screen
- `versions[]` on Scene (data model stub only — no UI)
- `sharedScenes[]` (not added to data model yet)
- Adaptation modes (re-generate, apply style) on import
- Scene right-click context menu (overflow only)
- Tag editing, collection management

---

## Data model

```js
// LibraryStore (localStorage key: "prs_library")
{
  presentations: Presentation[]
}

// Presentation
{
  id: string,          // nanoid or crypto.randomUUID()
  title: string,
  status: "draft" | "ready" | "archived",
  tags: string[],
  collections: string[],
  updatedAt: string,   // ISO
  createdAt: string,
  settings: {
    typingSpeedMs: number,
    playbackMode: "interactive" | "autoplay" | "capture",
    betweenScenesMs: number,
    waitForIframeReadyTimeoutMs: number,
    startDelayMs: number,
    endCardDurationMs: number
  },
  theme: {
    shell: string,
    accent: string,
    presenterPosition: string
  },
  scenes: Scene[]
}

// Scene — matches existing deck contract exactly
{
  id: string,
  title: string,
  type: "narrative" | "chart" | "framework" | "timeline" | "closing" | "title",
  presenter: { mode: string, blocks: Block[] },
  content: { route: string, waitForReady: boolean, reloadOnEnter: boolean },
  actions: Action[],
  advance: { type: string, delayMs?: number, event?: string },
  editIntent?: string    // prompt / edit intent textarea value; persisted on save
  // versions[] deferred — add field here when Phase 5 of full roadmap begins
}
```

`LibraryStore` seeds itself from `src/contracts/demo-deck.json` on first run
(when localStorage is empty).

---

## File structure

```text
presentation-runtime-shell/
├── index.html                          (app entry — mounts app shell, no screen content)
├── styles/
│   ├── shell.css                       (tokens + base — upgraded before any screens built)
│   └── screens/
│       ├── library.css
│       ├── workspace.css
│       └── import-scene.css
└── src/
    ├── main.js                         (boot: init store, router, app shell → #/library)
    ├── core/
    │   ├── event-bus.js                (no change)
    │   ├── state-store.js              (no change)
    │   ├── presenter-engine.js         (no change)
    │   ├── scene-runner.js             (no change)
    │   ├── deck-runtime.js             (add attachTo + sync)
    │   ├── contract-loader.js          (no change)
    │   ├── router.js                   (NEW)
    │   ├── library-store.js            (NEW)
    │   └── runtime-singleton.js        (NEW — getRuntime / setRuntime / clearRuntime)
    ├── screens/
    │   ├── library.js                  (Screen 01)
    │   ├── workspace.js                (Screen 02)
    │   └── import-scene.js             (Screen 03)
    ├── ui/
    │   ├── app-shell.js                (persistent top bar + left nav frame)
    │   ├── presentation-card.js        (card used in library)
    │   ├── scene-list.js               (left rail in workspace)
    │   ├── inspector-panel.js          (right panel in workspace)
    │   ├── modal.js                    (generic modal — used by import)
    │   └── empty-state.js
    ├── contracts/
    │   └── demo-deck.json
    └── generated/
        ├── opening/index.html
        ├── lab/index.html
        └── summary/index.html
```

---

## Phase 1 — Foundation

**Goal:** the app shell exists, navigation works, library data persists.
No screen content yet — just the frame everything else mounts into.

### 1A — CSS token upgrade (`styles/shell.css`)

Extend the existing token block. Do not rename existing tokens (backward compat).
Add the new scale entries alongside them.

```css
:root {
  /* existing tokens kept as-is */

  /* New additions */
  --color-bg:         #0b1020;
  --color-surface:    #121a30;
  --color-surface-2:  #18213d;
  --color-text:       #eef2ff;
  --color-muted:      #a8b3cf;
  --color-dim:        #64748b;
  --color-border:     rgba(255, 255, 255, 0.08);
  --color-border-2:   rgba(255, 255, 255, 0.14);
  --color-accent:     #8b5cf6;
  --color-accent-2:   #a78bfa;
  --color-accent-dim: rgba(139, 92, 246, 0.12);
  --color-success:    #34d399;
  --color-warning:    #f59e0b;
  --color-danger:     #f87171;

  --space-1: 4px;   --space-2: 8px;  --space-3: 12px;
  --space-4: 16px;  --space-5: 24px; --space-6: 32px;
  --space-7: 48px;

  --radius-sm: 10px; --radius-md: 14px;
  --radius-lg: 20px; --radius-xl: 28px;

  --shadow-1: 0 8px 20px rgba(0, 0, 0, 0.18);
  --shadow-2: 0 20px 50px rgba(0, 0, 0, 0.35);

  --z-base: 0; --z-panel: 10; --z-overlay: 100;
  --z-modal: 200; --z-fullscreen: 250; --z-toast: 300;

  --left-nav-w:    240px;
  --right-panel-w: 280px;
  --top-bar-h:     60px;

  --transition-fast: 120ms ease;
  --transition-mid:  220ms ease;
}
```

**CSS rules all new files must follow:**
- Grid for page layout; flex for row/column alignment within components
- Token references only — no raw hex/rgba in screen or component CSS
- No inline styles except dynamically computed runtime values
- Max 2–3 surface levels visible at once
- Accent color signals selection / primary CTA only — nothing else
- Focus: `outline: 2px solid var(--color-accent); outline-offset: 2px`
- Hover: subtle `translateY(-1px)` + `border-color` change only

---

### 1B — Router (`src/core/router.js`)

Hash-based. Reads `location.hash`, parses params, calls registered handlers.

```js
// Public API
export function createRouter() {
  return {
    on(pattern, handler),   // pattern: "#/library", "#/presentation/:id"
    navigate(hash),         // sets location.hash, triggers handlers
    getParams(),            // { id, sceneId, ... } from current hash
    start()                 // bind hashchange + fire initial route
  }
}
```

- Pattern matching supports `:param` segments
- `navigate()` does not reload the page
- `start()` fires the matching handler for the current hash on page load

---

### 1C — Library store (`src/core/library-store.js`)

All presentation data lives here. Persists to `localStorage`.

```js
export function createLibraryStore() {
  return {
    // Read
    getAll(),                    // Presentation[] sorted by updatedAt desc
    getById(id),                 // Presentation | null
    search(query),               // filter by title + tags

    // Write
    create(overrides?),          // new blank Presentation, returns it
    update(id, partial),         // merge partial into presentation; update updatedAt
    duplicate(id),               // deep copy with new id; title += " (copy)"
    archive(id),                 // set status: "archived"
    delete(id),

    // Scenes (operate on a presentation's scenes array)
    addScene(presentationId, overrides?),
    updateScene(presentationId, sceneId, partial),
    removeScene(presentationId, sceneId),
    reorderScenes(presentationId, orderedIds),
    duplicateScene(presentationId, sceneId),
    importScene(targetPresentationId, scene, placement)  // placement: "after" | "replace"
  }
}
```

Seeds from `demo-deck.json` on first run. Wraps every write with a
`JSON.parse/stringify` round-trip to avoid shared reference bugs.

---

### 1D — App shell (`src/ui/app-shell.js`)

The persistent frame. Mounts once. Never unmounts.

```text
+------------------------------------------------------------------------------------------------------+
| Top Bar (60px)                                                                                       |
+--------------------------+---------------------------------------------------------------------------+
| Left Nav (240px)         | Screen slot (fills remaining width + height)                            |
|                          |                                                                          |
+--------------------------+---------------------------------------------------------------------------+
```

**Top bar** renders:
- Brand mark + "AI Presentation System" label (left)
- Breadcrumb (center, updated by each screen on mount)
- Screen-specific action buttons injected per route (right)

**Left nav** renders:
- Library link (active when `#/library`)
- Status filters: All, Drafts, Ready, Archived
- Collections list (read from store) — hidden when store has none
- Tags list (read from store) — hidden when store has none
- Sort control

Left nav is purely navigational — it does not trigger data mutations.

**Screen slot:** a `<div id="screen-root">` that each screen mounts into and
clears on unmount.

---

### 1E — Boot (`src/main.js`)

```js
import { createRouter } from "./core/router.js";
import { createLibraryStore } from "./core/library-store.js";
import { mountAppShell } from "./ui/app-shell.js";
import { mountLibrary } from "./screens/library.js";
import { mountWorkspace } from "./screens/workspace.js";
import { mountImportScene } from "./screens/import-scene.js";

const store = createLibraryStore();
const router = createRouter();
const shell = mountAppShell({ store, router });

router.on("#/library", () => {
  shell.setScreen(() => mountLibrary({ store, router, shell }));
});

router.on("#/presentation/:id", ({ id }) => {
  shell.setScreen(() => mountWorkspace({ id, store, router, shell }));
});

router.on("#/presentation/:id/import", ({ id }) => {
  shell.setScreen(() => mountImportScene({ id, store, router, shell }));
});

router.start();
```

`shell.setScreen(mountFn)` unmounts the current screen (calls its returned
`unmount()` function), then mounts the new one into `#screen-root`.

---

## Phase 2 — Presentation Library

**Route:** `#/library`
**Files:** `src/screens/library.js`, `styles/screens/library.css`,
`src/ui/presentation-card.js`, `src/ui/empty-state.js`

### Layout

```text
Left Nav    | Center: recent cards grid + all-presentations list    | Right: selected detail
```

The left nav is already rendered by the app shell. Library only owns the center
and right panels.

### Center panel

**Recent section (top):** card grid of the 6 most recently updated presentations.
Uses `PresentationCard` component.

**All presentations (below recent):** flat list. Each row: title, scene count,
status badge, updated-at, `[Open]` button.

**Search:** debounced input in the top bar (injected by library on mount).
Filters both sections by title and tags.

### PresentationCard component

```text
+--------------------+
| Q2 Board Review    |
| 14 scenes          |
| updated 2h ago     |
| [Open]   [···]     |
+--------------------+
```

`[···]` overflow menu items: Duplicate, Rename, Archive.
Clicking the card title or `[Open]` navigates to `#/presentation/:id`.

### Right panel

Shows when a presentation is selected (click in the list — not the Open button):

```text
Q2 Board Review
14 scenes · draft · updated 2h ago

[Open]
[Duplicate]
[Rename]
[Archive]
```

No deep inspector. No prompt history. No debug.

### Empty state

When `store.getAll()` returns `[]`:

```text
No presentations yet.
[Create your first presentation]
```

### Interactions

| Trigger | Action |
|---|---|
| `[New +]` in top bar | `store.create()` → navigate to `#/presentation/:newId` |
| Card `[Open]` or title click | `router.navigate("#/presentation/:id")` |
| `[···]` → Duplicate | `store.duplicate(id)` → re-render |
| `[···]` → Rename | Inline edit field on the card title |
| `[···]` → Archive | `store.archive(id)` → re-render |
| Status filter click | Filter center panel in memory — no route change |
| Search input | `store.search(query)` → re-render center panel |

---

## Phase 3 — Presentation Workspace

**Route:** `#/presentation/:id`
**Files:** `src/screens/workspace.js`, `styles/screens/workspace.css`,
`src/ui/scene-list.js`, `src/ui/inspector-panel.js`

### Layout

```text
Left Nav  | Scene List (left rail) | Active Scene Canvas | Scene Inspector (right)
```

Left nav: still the app shell nav. Scene list is a separate left rail
*within* the workspace screen, giving a nested two-column left area.

Full layout:

```text
Top Bar: [Presentations / Q2 Board Review]            [Preview ▾] [Present]

Left: scene list    | Center: scene canvas + prompt    | Right: inspector
                    |                                  |
[+ New Scene]       | Scene 06 — Margin Compression    | Title (editable)
                    |                                  | Type (dropdown)
01 Exec Summary     | +------------------------------+ | Status
02 Market Context   | |                              | |
03 Revenue Trend    | |   RUNTIME IFRAME             | | [Regenerate]
04 Cost Stack       | |                              | | [Duplicate]
05 Margin Walk      | +------------------------------+ | [Delete]
>06 Margin Compress |                                  |
07 Ops Drivers      | Prompt / Edit Intent             |
08 Scenario         | ──────────────────────────────── |
09 Recommendation   | [textarea]                       |
10 Closing          |                                  |
                    | [Edit Text]  [Import Scene]       |
```

### Scene list component (`src/ui/scene-list.js`)

- Renders ordered list of scenes from `store.getById(id).scenes`
- Active scene highlighted with accent border
- Click a scene: set it active → `runtime.sync(index)`
- Drag to reorder: updates `store.reorderScenes()` — if drag introduces instability, ship Move Up / Move Down buttons first and defer drag to a follow-up patch
- `[+ New Scene]` creates a blank scene via `store.addScene()`
- Right-click / overflow per scene: Duplicate, Delete (only these two in v1)

### Active scene canvas

Runtime iframe renders the current scene.
Below the iframe:
- Textarea for prompt / edit intent (stored on the scene as `scene.editIntent`)
- `[Edit Text]` — opens the scene presenter blocks for editing (inline expand)
- `[Import Scene]` — navigates to `#/presentation/:id/import`

The canvas shows a loading overlay (`is-hidden` toggle) during `loading-scene`
status, mirroring the existing behavior.

### Scene inspector component (`src/ui/inspector-panel.js`)

Right panel. Shows:
- Title: inline-editable `<input>` — saves to `store.updateScene()` on blur
- Type: `<select>` dropdown
- Status: read from `presentation.status`
- `[Regenerate]` — stub button (no backend yet; clears prompt textarea)
- `[Duplicate]` — `store.duplicateScene()` → set new scene active
- `[Delete]` — confirm then `store.removeScene()`

### Runtime integration

When workspace mounts:
1. Load presentation from store
2. Get or create a `DeckRuntime` instance via `getRuntime()` / `setRuntime()` singleton
   (defined in `src/core/runtime-singleton.js` — exports `getRuntime`, `setRuntime`, `clearRuntime`)
3. `runtime.load(presentation)` — converts presentation to deck contract shape
4. `runtime.goTo(lastActiveSceneIndex)` — restore position
5. Set `lastActiveSceneIndex` via `runtime.subscribe()` listener

When workspace unmounts:
- Store `currentSceneIndex` in session (not localStorage)
- Do NOT destroy runtime — keep it alive for re-entry and mode switching

### Presentation bridging

`store.getById(id)` returns the full `Presentation` object. `DeckRuntime.load()`
already accepts the deck contract shape. The `Presentation` object IS a valid
deck contract (same `settings`, `scenes`, `theme` structure). No transform needed.

---

## Phase 4 — Presentation Modes

**Files:** `src/ui/layout-manager.js` (new), additions to `src/core/deck-runtime.js`

### Runtime additions (`deck-runtime.js`)

Two new methods. No changes to existing methods.

**`runtime.attachTo(iframeEl)`**

Replaces the iframe element the scene runner navigates and posts messages into.
Runtime state and playback position are fully preserved — no restart.

```js
attachTo(iframeEl) {
  this._iframeEl = iframeEl;
  const { route } = this.getState().iframe;
  if (route) iframeEl.src = route;
}
```

The workspace screen's `render()` function must re-bind its iframe reference
after calling `attachTo`.

**`runtime.sync(sceneIndex)`**

Alias for `goTo` — semantic name used by split mode when the user
clicks a scene in the editor list.

```js
sync(index) {
  this.goTo(index);
}
```

### Layout manager (`src/ui/layout-manager.js`)

Controls which layout the workspace renders into.

```js
export function createLayoutManager({ runtime, workspaceEl }) {
  return {
    setMode(mode)   // "workspace" | "split" | "fullscreen"
    getMode()
  }
}
```

**Mode: `workspace`** (default)

```text
Scene List | Canvas (iframe ~55% height) + prompt area | Inspector
```

Runtime iframe is embedded in the center canvas container.

**Mode: `split`**

```text
Scene List | Prompt + Editor | Full Runtime (right 50%)
                               ◀ Prev   Scene N of N   ▶ Next
           [Exit Split]        [Present Fullscreen]
```

`runtime.attachTo(splitPaneIframe)` — runtime plays continuously through scenes.
Clicking a scene in the left list calls `runtime.sync(index)`.

Top bar action buttons change to `[Exit Split]` + `[Present Fullscreen]`.

**Mode: `fullscreen`**

A `position: fixed; inset: 0; z-index: var(--z-fullscreen)` div mounts over the
entire app. `--z-fullscreen` must be defined above `--z-modal` in the token scale
so it always wins over any open modal or popover state.

```text
(blank dark background — no editor chrome)

           RUNTIME IFRAME (full area)

◀ Prev            Scene 6 — Margin Compression           ▶ Next

[Esc] exit    [Space] next    [← →] navigate    [R] replay    [S] skip
```

`runtime.attachTo(fullscreenIframe)`.

`Esc` → `layoutManager.setMode("workspace")` + `runtime.attachTo(workspaceIframe)`.

**Keyboard bindings (active in split + fullscreen):**

| Key | Action |
|---|---|
| `Space` or `→` or `ArrowRight` | `runtime.next()` |
| `←` or `ArrowLeft` | `runtime.previous()` |
| `Esc` | Exit to workspace mode |
| `R` | `runtime.replayLine()` |
| `S` | `runtime.skipTyping()` |

Keyboard handler is attached to `document` when split/fullscreen is entered and
removed when workspace mode is restored.

### Top bar actions per mode

| Mode | Left | Right |
|---|---|---|
| workspace | breadcrumb | `[Preview ▾]` `[Present]` |
| split | breadcrumb | `[Exit Split]` `[Present Fullscreen]` |
| fullscreen | — | minimal hover hint `"Esc to exit"` |

`[Preview ▾]` dropdown:
```text
Preview options:
- Inline (default) — checked
- Split view
```

---

## Phase 5 — Import Scene

**Route:** `#/presentation/:id/import`
**Files:** `src/screens/import-scene.js`, `styles/screens/import-scene.css`,
`src/ui/modal.js` (if used as modal variant)

This can be implemented as either a full screen (using the route) or a modal
mounted over the workspace. Both are valid in v1. Start with the full screen
route for simplicity; optionally convert to modal later.

### Layout

```text
Left: source selector            | Center: scene results         | Right: import settings
──────────────────────────────── | ─────────────────────────────  | ───────────────────────
(•) This Presentation            | [ search scenes... ]           | Placement
( ) Another Presentation         |                                | (•) Insert after current
                                 | +─────────+  +─────────+      | ( ) Replace current
  Presentation selector          | | Scene A |  | Scene B |      |
  (shown when "Another"          | | [Select]|  | [Select]|      | ─────────────────────
   is selected)                  | +─────────+  +─────────+      | [Cancel]  [Apply]
```

### Behavior

**Source: This Presentation** — show all scenes in current presentation except
the one being replaced (if replace mode selected).

**Source: Another Presentation** — show a `<select>` dropdown populated from
`store.getAll()`. On selection, render that presentation's scenes.

**Scene cards** show title, mode badge, and a `[Select]` button. Clicking
`[Select]` marks it chosen and enables `[Apply]`.

**Placement options (only these two):**
```text
(•) Insert after current scene
( ) Replace current scene
```

**Copy mode:** always "Copy as-is" — no adaptation options in v1.

**On Apply:**
```js
store.importScene(
  currentPresentationId,
  selectedScene,       // deep copy
  placement            // "after" | "replace"
)
router.navigate(`#/presentation/${id}`)
```

### What's cut from the full plan

- Shared Library source (not in v1)
- Adaptation modes: "apply style", "re-generate" (not in v1)
- "Insert at position N" granularity (not in v1)

---

## Acceptance criteria

V1 is complete when all four areas pass:

### Library

- [ ] Create a new blank presentation → navigate to workspace
- [ ] Open an existing presentation
- [ ] Duplicate a presentation
- [ ] Archive a presentation
- [ ] Search presentations by title
- [ ] Filter by status (Draft, Ready, Archived)
- [ ] Empty state shown when no presentations exist

### Workspace

- [ ] Scene list shows all scenes; active scene is highlighted
- [ ] Clicking a scene updates the runtime iframe
- [ ] Add, duplicate, delete, reorder scenes
- [ ] Edit scene title and type in inspector
- [ ] Edit prompt / intent textarea — value persists in store
- [ ] Runtime preview stays live as the user navigates scenes

### Presentation modes

- [ ] `[Preview ▾]` → Split view: editor + runtime visible side by side
- [ ] `[Present]` → Fullscreen: all editor chrome hidden
- [ ] Runtime state preserved across all mode switches (no restart)
- [ ] Keyboard controls work in split and fullscreen
- [ ] `Esc` returns to workspace without state loss
- [ ] Scene selection in split mode syncs runtime to that scene

### Import

- [ ] `[Import Scene]` in workspace navigates to import screen
- [ ] Can browse scenes from the current presentation
- [ ] Can browse scenes from another presentation via dropdown
- [ ] Select a scene → choose placement → Apply → scene appears in workspace
- [ ] Cancel → returns to workspace unchanged

---

## What this explicitly defers

These are good ideas. Build them after v1 acceptance criteria pass.

| Feature | Why deferred |
|---|---|
| Scene Variants screen | No user feedback yet on whether variants are needed |
| Change Review / before-after diff | Premature without knowing regeneration frequency |
| Shared Scene Library | Requires metadata stability not yet established |
| Adaptation modes on import | Mini operating system — validate copy-as-is first |
| Scene right-click context menu | Secondary once basic CRUD works |
| Tag and collection editing | Browser-level CRUD over the library data |
| Backend / server persistence | localStorage is sufficient to prove the loop |

The full architecture for all of these exists in `implementation-plan.md`.
That document is the v2+ roadmap. This plan is the v1 build target.
