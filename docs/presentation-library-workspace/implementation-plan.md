# Presentation Library & Workspace — Implementation Plan

**Scope:** Expand the current single-deck runtime shell into a multi-presentation
authoring workspace with six canonical screens, three presentation modes, and a
shared scene library.

**Constraint:** Vanilla JS, no framework. Runtime core stays DOM-free and
framework-agnostic throughout. UI layer is the only thing that grows.

---

## 0. What already exists

| File | Status |
|---|---|
| `index.html` + `styles/shell.css` | Shell for one deck — becomes the Workspace screen |
| `src/core/deck-runtime.js` | Stable. Keep as-is, extend lightly |
| `src/core/scene-runner.js` | Stable. No changes needed |
| `src/core/presenter-engine.js` | Stable. No changes needed |
| `src/core/contract-loader.js` | Extend to handle multiple deck sources |
| `src/core/event-bus.js` | Stable |
| `src/core/state-store.js` | Stable |
| `src/main.js` | Becomes workspace entry. Split into screen-specific entry points |
| `src/contracts/demo-deck.json` | Becomes one deck in the library |

---

## 1. Architecture decisions

### 1.1 Routing

Use **hash-based routing** (`location.hash`) so the app works from file:// and
any static server without server-side routing config.

```text
#/library                                     → Screen 01
#/presentation/:id                            → Screen 02
#/presentation/:id/scene/:sceneId/variants    → Screen 03
#/presentation/:id/scene/:sceneId/import      → Screen 04
#/library/shared-scenes                       → Screen 05
#/presentation/:id/review                     → Screen 06
```

A thin router (`src/core/router.js`) reads `location.hash`, parses params, and
calls `app.navigate(route, params)`. All navigation goes through it.

### 1.2 Data layer

**v1: localStorage + embedded JSON**

- `LibraryStore` (new) keeps all presentations in `localStorage` as a JSON array
- Each presentation is a full deck contract object plus metadata
- On first load, seed with the existing `demo-deck.json`
- No backend, no fetch for library data

This means:
- `loadContract()` is used only for loading a deck's generated scene content (the iframes)
- The library and deck metadata live entirely in `LibraryStore`

### 1.3 Runtime instantiation

**One runtime instance per workspace session.** When presentation mode changes
(workspace → split → fullscreen), the runtime is not recreated — only the
container element it renders into changes.

```js
// Attach the runtime's iframe to a different DOM container
runtime.attachTo(containerEl)
```

`attachTo(el)` is a new method on `deck-runtime` that replaces the internal
iframe element reference. The runtime state is preserved; only the render target
changes.

### 1.4 Screen mounting

Each screen is a module that exports `mount(container, params)` and `unmount()`.
The router calls these. Screens share the top bar and left nav shell; only the
center + right panels swap.

### 1.5 CSS token upgrade

Before building new screens, upgrade the token system in `shell.css` to the
full scale described in `ui-principles.md`. All new screens consume only tokens —
no raw color/spacing values in component CSS.

---

## 2. Data model

```js
// Workspace — top-level container (in LibraryStore)
{
  presentations: Presentation[]
  sharedScenes: SharedScene[]
}

// Presentation
{
  id: string,              // uuid
  title: string,
  status: "draft" | "ready" | "archived",
  tags: string[],
  collections: string[],
  updatedAt: string,       // ISO timestamp
  createdAt: string,
  settings: DeckSettings,  // typingSpeedMs, playbackMode, betweenScenesMs, etc.
  theme: DeckTheme,
  scenes: Scene[]
}

// Scene
{
  id: string,
  title: string,
  type: "narrative" | "chart" | "framework" | "timeline" | "closing" | "title",
  presenter: PresenterScript,
  content: ContentConfig,   // route, waitForReady, reloadOnEnter
  actions: Action[],
  advance: AdvanceConfig,
  currentVersionId: string,
  versions: SceneVersion[]
}

// SceneVersion
{
  id: string,
  prompt: string,           // prompt that produced this version
  createdAt: string,
  basedOnVersionId: string | null,
  // content snapshot — in v1 this is just the route (iframe content is external)
  // in later versions this would be a serialized artifact
}

// SharedScene
{
  id: string,
  title: string,
  type: string,
  tags: string[],
  tone: string[],
  sourcePresentationId: string,
  sourceSceneId: string,
  usedInPresentationIds: string[],
  savedAt: string
}
```

---

## 3. Target file structure

```text
presentation-runtime-shell/
├── index.html                        (becomes the app shell, routes into screens)
├── styles/
│   ├── shell.css                     (tokens + base; extended, not replaced)
│   └── screens/
│       ├── library.css
│       ├── workspace.css
│       ├── variants.css
│       ├── import-scene.css
│       ├── shared-library.css
│       └── change-review.css
├── src/
│   ├── main.js                       (boot: init router, mount app shell, seed library)
│   ├── core/
│   │   ├── event-bus.js              (no change)
│   │   ├── state-store.js            (no change)
│   │   ├── presenter-engine.js       (no change)
│   │   ├── scene-runner.js           (no change)
│   │   ├── deck-runtime.js           (add attachTo method)
│   │   ├── contract-loader.js        (no change)
│   │   ├── router.js                 (NEW — hash router)
│   │   └── library-store.js          (NEW — localStorage persistence)
│   ├── screens/
│   │   ├── library.js                (Screen 01)
│   │   ├── workspace.js              (Screen 02)
│   │   ├── variants.js               (Screen 03)
│   │   ├── import-scene.js           (Screen 04)
│   │   ├── shared-library.js         (Screen 05)
│   │   └── change-review.js          (Screen 06)
│   ├── ui/
│   │   ├── app-shell.js              (top bar + left nav persistent frame)
│   │   ├── top-bar.js                (breadcrumb + global actions)
│   │   ├── presentation-card.js      (card used in library)
│   │   ├── scene-list.js             (left rail scene list used in workspace + others)
│   │   ├── scene-card.js             (card used in variants + import screens)
│   │   ├── inspector-panel.js        (right panel — reused across screens)
│   │   ├── modal.js                  (generic modal wrapper)
│   │   └── empty-state.js
│   ├── contracts/
│   │   └── demo-deck.json
│   └── generated/
│       ├── opening/index.html
│       ├── lab/index.html
│       └── summary/index.html
```

---

## 4. Design token upgrade

**Do this first, before any new screens.** Extend `:root` in `shell.css` to the
full scale. Existing token names are preserved for backward compatibility; new
tokens are added alongside them.

```css
:root {
  /* Surface layers (max 3 active at once) */
  --color-bg:         #0b1020;
  --color-surface:    #121a30;
  --color-surface-2:  #18213d;
  --color-surface-3:  #0f1730;

  /* Text */
  --color-text:       #eef2ff;
  --color-muted:      #a8b3cf;
  --color-dim:        #64748b;

  /* Borders */
  --color-border:     rgba(255, 255, 255, 0.08);
  --color-border-2:   rgba(255, 255, 255, 0.14);

  /* Accent (one color, used intentionally) */
  --color-accent:     #8b5cf6;
  --color-accent-2:   #a78bfa;
  --color-accent-dim: rgba(139, 92, 246, 0.12);

  /* Semantic status colors */
  --color-success:    #34d399;
  --color-warning:    #f59e0b;
  --color-danger:     #f87171;

  /* Spacing scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;

  /* Radius */
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;

  /* Shadows — almost everything flat */
  --shadow-1: 0 8px 20px rgba(0, 0, 0, 0.18);
  --shadow-2: 0 20px 50px rgba(0, 0, 0, 0.35);

  /* Z-index layers */
  --z-base:    0;
  --z-panel:   10;
  --z-overlay: 100;
  --z-modal:   200;
  --z-toast:   300;

  /* Layout */
  --left-nav-w:      240px;
  --right-panel-w:   280px;
  --top-bar-h:       60px;
  --transition-fast: 120ms ease;
  --transition-mid:  220ms ease;
}
```

**Rules for all new CSS:**

- Grid for page-level layout; flex for row/column alignment within components
- No raw hex/rgba values in screen CSS — only token references
- No inline styles except for truly dynamic runtime values
- Max 2–3 surface levels visible at once on any screen
- One accent color signals selection / primary CTA only
- Hover states: subtle `translateY(-1px)` + border-color change (already established)
- Focus states: `outline: 2px solid var(--color-accent); outline-offset: 2px`

---

## 5. Phase build order

### Phase 1 — Foundation (prerequisites for everything else)

**Goal:** router, library store, app shell, and CSS tokens. Nothing visual yet
beyond the existing shell.

| Task | File | Notes |
|---|---|---|
| Token upgrade | `styles/shell.css` | Add full token scale; keep existing names |
| Hash router | `src/core/router.js` | `navigate(hash)`, `onRoute(pattern, handler)`, param parsing |
| Library store | `src/core/library-store.js` | CRUD for presentations + shared scenes in localStorage; seed from demo-deck.json on first run |
| App shell mount | `src/ui/app-shell.js` | Persistent top bar + left nav; center slot swaps per screen |
| Update `main.js` | `src/main.js` | Boot: init store, init router, mount app shell, navigate to `#/library` |

**App shell layout:**

```text
+------------------------------------------------------------------------------------------------------+
| Top Bar                                                        [global actions per screen]           |
+--------------------------+------------------------------------------------------+--------------------+
| Left Nav                 | Screen Content Area (swaps)                          | Right Panel (opt)  |
|                          |                                                      |                    |
+--------------------------+------------------------------------------------------+--------------------+
```

The left nav shows: workspace sections (All, Drafts, Ready, Archived), Collections,
and Tags. It collapses on narrow viewports.

---

### Phase 2 — Screen 01: Presentation Library

**Route:** `#/library`
**File:** `src/screens/library.js`, `styles/screens/library.css`

**Layout:**

```text
Left Nav: status filters, collections, tags, sort control
Center:   recent card grid (top) + all-presentations list (bottom)
Right:    selected presentation details + actions
```

**Components needed:**

- `PresentationCard` — shows title, scene count, status badge, updated-at,
  `[Open]` and `[···]` overflow menu
- `StatusBadge` — `draft | ready | archived` pill using semantic color tokens
- `OverflowMenu` — Duplicate, Rename, Archive, Delete

**Interactions:**

| Trigger | Result |
|---|---|
| Click `[New +]` | Create new blank presentation in LibraryStore; navigate to `#/presentation/:newId` |
| Click card `[Open]` or card title | Navigate to `#/presentation/:id` |
| Click `[···]` menu item | Duplicate/Rename/Archive inline in LibraryStore; re-render |
| Click status filter (Drafts, Ready…) | Filter center panel; no navigation |
| Click collection or tag | Filter center panel |
| Search input | Filter by title, tag; debounced |

**Right panel:** when a presentation is selected in the list, show:
scene count, status, last updated, and action buttons: `[Open]`, `[Duplicate]`,
`[Rename]`, `[Archive]`.

**Empty state:** `EmptyState` component with "No presentations yet" message
and a `[Create your first presentation]` button.

---

### Phase 3 — Screen 02: Presentation Workspace

**Route:** `#/presentation/:id`
**File:** `src/screens/workspace.js`, `styles/screens/workspace.css`

**Layout:**

```text
Left Nav:    scene list for this presentation (reuses SceneList component)
Center:      active scene canvas (live runtime iframe) + prompt/edit area
Right:       scene inspector with title, type, status, and action buttons
Top Bar:     breadcrumb + [Preview ▾] [Present] [Share]
```

**Three presentation modes live here** (see Section 6 below).

**SceneList component behavior:**

- Click a scene item → set it as active; runtime navigates to that scene
- Drag to reorder scenes in LibraryStore
- `[+ New Scene]` button at top → create blank scene, add to LibraryStore, activate it
- Active scene marked with accent indicator

**Active scene canvas:**

```text
+--------------------------------------------------+
|          LIVE SCENE PREVIEW                      |
|          (runtime iframe)                        |
+--------------------------------------------------+
Prompt / Edit Intent
----------------------------------------------
[text area for prompt / notes]

[Edit Text]   [Swap Scene]   [Import Scene]
```

**Scene Inspector (right panel):**
- Title (editable inline)
- Type (dropdown)
- Status
- Actions: `[Regenerate]`, `[Create Variant]`, `[Duplicate]`, `[Delete]`

Clicking `[Create Variant]` navigates to `#/presentation/:id/scene/:sceneId/variants`.
Clicking `[Swap Scene]` or `[Import Scene]` navigates to `#/presentation/:id/scene/:sceneId/import`.

**Runtime integration:**

When the workspace mounts:
1. Load presentation from LibraryStore
2. Create (or reuse) `DeckRuntime` instance
3. `runtime.load(deck)` then `runtime.goTo(lastActiveSceneIndex)`
4. `runtime.attachTo(canvasIframeEl)` — new method, see Section 7

When workspace unmounts: pause runtime, cache state for re-entry.

---

### Phase 4 — Screen 03: Scene Variants

**Route:** `#/presentation/:id/scene/:sceneId/variants`
**File:** `src/screens/variants.js`, `styles/screens/variants.css`

**Layout:**

```text
Left Nav:   scene list (same as workspace, for context)
Center:     variant card gallery
Right:      selected variant details + [Apply] / [Keep as Draft]
Top Bar:    breadcrumb + [Back to Workspace]
```

**Variant gallery:**

Grid of `SceneCard` components, each showing:
- Version label (Version A, B, C…)
- Brief description (from the prompt that generated it)
- Thumbnail area (iframe thumbnail if available, or placeholder)
- `[Preview]` → loads this version into a small preview iframe
- `[Apply]` → sets `scene.currentVersionId`, navigates back to workspace

**Right panel:** selected variant details:
- Tone/style note
- Source prompt
- Diff summary (bullet list of changes vs. previous version — stored in `SceneVersion`)
- `[Apply]` and `[Keep as Draft]` buttons

**New variant button:** `[+ Generate New Variant]` — adds a blank `SceneVersion`
and opens prompt input.

---

### Phase 5 — Screen 04: Import / Swap Scene

**Route:** `#/presentation/:id/scene/:sceneId/import`
**File:** `src/screens/import-scene.js`, `styles/screens/import-scene.css`

**Layout:**

```text
Left Nav:   source selector (This Presentation / Another / Shared Library)
            + presentation picker when "Another" is selected
            + type/tone filters
Center:     search input + scene card results grid
Right:      import settings (mode, adaptation, destination) + [Cancel] [Apply]
```

**Source modes:**

| Source | Left nav content |
|---|---|
| This Presentation | List of other scenes in current deck |
| Another Presentation | Presentation dropdown; shows that deck's scenes |
| Shared Scene Library | Filter tabs (All, Saved, Team, Recently Reused) |

**Import settings (right panel):**

```text
Mode
  (•) Import into position
  ( ) Replace current scene
  ( ) Insert after current scene

Adaptation
  (•) Copy as-is
  ( ) Apply this presentation's style
  ( ) Re-generate using as reference

Destination: Scene 06 (current)

[Cancel]   [Apply]
```

**On Apply:** create a new `SceneVersion` in the target scene based on the
selected source. Update `scene.currentVersionId`. Navigate back to workspace.

---

### Phase 6 — Screen 05: Shared Scene Library

**Route:** `#/library/shared-scenes`
**File:** `src/screens/shared-library.js`, `styles/screens/shared-library.css`

**Layout:**

```text
Left Nav:   type filters, tone filters, tag filters
Center:     tabs (All / Saved / Team / Recently Reused) + scene table + thumbnail strip
Right:      selected scene details + [Preview] [Insert] [Fork] [Open Source Deck]
```

**"Save as shared scene"** is available from the workspace scene inspector's
overflow menu and the scene timeline context menu. It copies scene data into
`LibraryStore.sharedScenes[]`.

**Fork:** creates a new `SceneVersion` in the current presentation based on the
shared scene, then navigates to workspace.

This screen is lower priority than 01–04. Build after those are stable.

---

### Phase 7 — Screen 06: Change Review

**Route:** `#/presentation/:id/review`
**File:** `src/screens/change-review.js`, `styles/screens/change-review.css`

**Layout:**

```text
Left Nav:   change list (affected scenes)
Center:     before/after side-by-side preview iframes
Right:      change summary bullets + [Accept Changes] [Reject] [Keep Both]
            + [Previous Change] [Next Change] navigation
```

**When this screen is used:**
- After any "Regenerate" or "Apply Variant" operation that modifies an
  already-applied scene version
- Can be skipped if user clicks "Accept All" directly from workspace

**Before/after:** two small iframes — `beforeIframe` loads the old version's
route, `afterIframe` loads the new version's route.

**Decision outcomes:**

| Button | Result |
|---|---|
| Accept Changes | `scene.currentVersionId = newVersion.id` |
| Reject | Discard new version, keep old |
| Keep Both | Save both, leave currentVersionId unchanged, new version added to `scene.versions[]` |

---

## 6. Presentation mode implementation

The three modes live within Screen 02 (Workspace). Mode is set via `layout.setMode()`.

### Layout manager (`src/ui/layout-manager.js`)

```js
const LayoutManager = {
  setMode(mode)  // "workspace" | "split" | "fullscreen"
  attachRuntime(runtime, containerEl)
}
```

### Mode: Workspace (default)

```text
Left Nav | [Scene Canvas — small]  | Right Inspector
         | Prompt area             |
```

Runtime iframe is embedded in the center canvas area at ~60% height.

### Mode: Split

Triggered by `[Preview ▾]` → "Split view".

```text
Left Nav | Scene Editor + Prompt | [FULL PRESENTATION RUNTIME]
                                   ◀ Prev  Scene N  ▶ Next
         [Exit Split]              [Present Fullscreen]
```

`runtime.attachTo(splitPaneIframeEl)` — runtime state preserved, no restart.
The runtime in split pane runs continuously through scenes (not just the active
one). `runtime.sync(currentSceneIndex)` aligns it to the currently selected
scene in the editor.

### Mode: Fullscreen

Triggered by `[Present]` button or `Cmd/Ctrl+Enter`.

A fullscreen overlay div mounts over the app. The runtime iframe fills it.
`runtime.attachTo(fullscreenIframeEl)`.

```text
(no editor UI)
         PRESENTATION FULLSCREEN
         ◀ Prev   Scene 6 — Title   ▶ Next
         [Esc] exit   [Space] next   [← →] navigate
         [R] restart  [S] skip typing
```

`Esc` calls `layout.setMode("workspace")` and restores state.

### Keyboard bindings (fullscreen + split)

| Key | Action |
|---|---|
| `Space` or `→` | `runtime.next()` |
| `←` | `runtime.previous()` |
| `Esc` | Exit to workspace |
| `R` | `runtime.replayLine()` |
| `S` | `runtime.skipTyping()` |

---

## 7. Runtime changes needed

Only one new method is required on `deck-runtime.js`.

### `runtime.attachTo(iframeEl)`

Replaces the internal iframe reference used by the scene runner for navigation
and postMessage dispatch. Runtime state and playback position are preserved.

```js
attachTo(iframeEl) {
  // update internal reference used in scene-runner and postMessage dispatch
  this._iframeEl = iframeEl;
  // re-sync current route to new iframe
  const { route } = this.getState().iframe;
  if (route) iframeEl.src = route;
}
```

The dom-renderer in `main.js` / workspace screen must also re-point its `els.frame`
reference to the new container when `attachTo` is called.

### `runtime.sync(sceneIndex)`

Navigates to a specific scene index without full restart (used by split mode
when user clicks a scene in the editor list).

```js
sync(index) {
  this.goTo(index);
}
```

This already exists as `goTo` — expose `sync` as an alias for semantic clarity.

---

## 8. Component catalogue

These primitives are used across all six screens. Build each once; reuse everywhere.

| Component | File | Used in |
|---|---|---|
| `TopBar` | `src/ui/top-bar.js` | All screens |
| `LeftNav` | `src/ui/app-shell.js` | All screens |
| `PresentationCard` | `src/ui/presentation-card.js` | Screen 01 |
| `SceneList` | `src/ui/scene-list.js` | Screens 02, 03, 04 |
| `SceneCard` | `src/ui/scene-card.js` | Screens 03, 04, 05 |
| `InspectorPanel` | `src/ui/inspector-panel.js` | Screens 01, 02, 03, 04, 05 |
| `StatusBadge` | inline / CSS | Screens 01, 02 |
| `OverflowMenu` | `src/ui/modal.js` helper | Screens 01, 02 |
| `Modal` | `src/ui/modal.js` | Screens 04, context menus |
| `EmptyState` | `src/ui/empty-state.js` | Screens 01, 05 |
| `BeforeAfterPane` | `src/ui/before-after.js` | Screen 06 |

**CSS rules for all components:**
- Styles scoped via BEM-lite: `.scene-card`, `.scene-card__title`, `.scene-card--active`
- No component owns its own token block — all reference `:root` tokens
- No component contains orchestration logic — UI calls runtime API only

---

## 9. Context menu system

The right-click / overflow menu on a scene should expose power without cluttering
the main surface:

```text
Right-click scene in SceneList →
  Duplicate
  ─────────────
  Create Variant
  Swap with...
  Import from...
  ─────────────
  Save as Shared Scene
  Copy to Presentation...
  ─────────────
  Move Up / Move Down
  ─────────────
  Delete
```

Implemented as a generic `ContextMenu` component (portaled to `document.body`,
z-index: `var(--z-modal)`) that accepts an items array and a target position.

---

## 10. Implementation sequence

Build in strict order. Each phase must be stable before the next begins.

| Phase | Deliverable | Unlocks |
|---|---|---|
| **1** | Router, LibraryStore, AppShell, token upgrade | All screens |
| **2** | Screen 01: Presentation Library | Navigate to/from workspace |
| **3** | Screen 02: Presentation Workspace + 3 modes | Core editing loop |
| **4** | Screen 04: Import / Swap Scene | Scene reuse |
| **5** | Screen 03: Scene Variants | Version comparison |
| **6** | Screen 06: Change Review | Safe AI editing |
| **7** | Screen 05: Shared Scene Library | Cross-deck reuse |

Start v1 demo at the end of Phase 3. Screens 01–02 plus the 3 presentation modes
are sufficient to prove the product concept.

---

## 11. What not to build yet

These are explicitly deferred to avoid overbuilding:

- Backend / persistence beyond localStorage
- Real thumbnail generation for scene variants (use placeholders)
- Side-by-side multi-presentation transfer view (wireframe 7)
- "Compose from structure/content/style" workflow (wireframe 10)
- Real-time collaboration
- Asset management beyond scenes

---

## 12. North-star sentence (from ui-principles.md)

> Build the workspace so that the default screen always emphasizes one thing
> at a time, uses a restrained visual system, and reveals advanced actions
> only when the user has clearly entered a task that needs them.

This is the acceptance criterion for every screen's visual design.
