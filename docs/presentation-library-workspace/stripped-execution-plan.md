Here’s the **stripped Phase 1–3 execution plan** I’d recommend: keep your architecture, keep the strong runtime ideas, but narrow the build so you validate the core experience fast. It stays faithful to your current plan’s strongest decisions—hash routing, one persistent runtime, a stable app shell, and the workspace-centered product model.  

# Stripped v1 goal

Prove this specific product truth first:

> **Editing a scene while a persistent runtime previews it—and then instantly shifting into split/fullscreen presentation—feels meaningfully better than slides.**

That is the heart of the system described in your runtime docs: a stable sequencer, DOM-free core, and a UI shell that stays replaceable. 

---

# What stays from your original plan

Keep these exactly:

* **Vanilla JS**
* **Core runtime remains DOM-free**
* **Hash router**
* **LibraryStore with localStorage**
* **Single runtime instance per session**
* **`runtime.attachTo()` for mode switching**
* **App shell with stable top/left frame**
* **Three presentation modes inside Workspace**
* **Token-first CSS cleanup first**

Those are the best parts of the plan and align with your earlier architecture and presentation-mode guidance.    

---

# What gets cut from v1

Defer these entirely:

* **Screen 03: Scene Variants**
* **Screen 05: Shared Scene Library**
* **Screen 06: Change Review**
* Full cross-presentation reuse system
* Adaptation modes like “apply this presentation’s style” or “re-generate using as reference”
* Detailed diff summaries
* Reusable shared-scene metadata model beyond a stub

These are good ideas, but they are product-expansion features, not first-proof features.

---

# New v1 scope

## Only 3 deliverables

### 1. Foundation

Router, store, shell, tokens.

### 2. Presentation Library

Create/open/manage presentations.

### 3. Presentation Workspace

Edit one presentation, one scene at a time, with:

* inline preview
* split mode
* fullscreen present mode
* simple scene import from another presentation

That’s it.

---

# Revised routes

Reduce routes to:

```text
#/library
#/presentation/:id
#/presentation/:id/import
```

You can also keep import as a modal within `#/presentation/:id`, but if you want routing clarity, a lightweight import route is fine.

### Remove for now

```text
#/presentation/:id/scene/:sceneId/variants
#/library/shared-scenes
#/presentation/:id/review
```

---

# Revised phase plan

## Phase 1 — Foundation

### Goal

Make the shell real, but keep it quiet.

### Build

* `styles/shell.css` token upgrade
* `src/core/router.js`
* `src/core/library-store.js`
* `src/ui/app-shell.js`
* `src/main.js`

### Must-have behavior

* Seed from existing `demo-deck.json`
* Boot into `#/library`
* App shell persists across navigation
* Left rail + top bar are stable
* Center content swaps by route

### Keep from original plan

This phase is already right as written. 

---

## Phase 2 — Presentation Library

### Route

`#/library`

### Goal

Treat presentations as first-class objects.

### Build

* `src/screens/library.js`
* `styles/screens/library.css`
* `src/ui/presentation-card.js`
* `src/ui/empty-state.js`

### Keep these interactions

* New presentation
* Open presentation
* Duplicate
* Rename
* Archive
* Search
* Filter by status/tag

### Simplify

Do not overinvest in the right panel yet.

The right side should show only:

* title
* status
* scene count
* updated at
* `[Open]`
* `[Duplicate]`
* `[Archive]`

No deep inspector behavior yet.

Your original library screen is strong; just keep it lightweight. 

---

## Phase 3 — Presentation Workspace

### Route

`#/presentation/:id`

### Goal

Prove the core loop.

### Build

* `src/screens/workspace.js`
* `styles/screens/workspace.css`
* `src/ui/scene-list.js`
* `src/ui/inspector-panel.js`
* `src/ui/layout-manager.js`

### Core layout

* **Left:** scene list
* **Center:** active scene preview + prompt/edit area
* **Right:** minimal scene inspector

This matches your canonical workspace and should remain the main product surface.  

---

# The v1 workspace loop

This is the loop you want users to feel immediately:

1. Open a presentation
2. Click a scene
3. See it in live preview
4. Edit prompt/intent
5. Regenerate or update
6. Click Preview → Split
7. Click Present → Fullscreen
8. Return to editing without losing state

If that feels great, the product is real.

---

# Workspace feature set for v1

## Keep

### Scene list

* select scene
* add scene
* reorder scenes
* duplicate scene
* delete scene

### Active scene center

* live runtime preview
* prompt / edit intent textarea
* `[Edit Text]`
* `[Import Scene]`
* `[Regenerate]`

### Right inspector

* editable title
* type dropdown
* status
* `[Duplicate]`
* `[Delete]`

### Top bar

* breadcrumb
* `[Preview ▾]`
* `[Present]`
* `[Share]` optional stub

---

## Cut or downgrade

### Remove

* `[Create Variant]`
* `[Swap Scene]` as a separate advanced concept
* overflow complexity
* “Save as Shared Scene”

### Replace with

* one simple action: **Import Scene**

Import handles the only reuse case you need in v1.

---

# Presentation modes: keep almost exactly as-is

This part of your plan is excellent and should survive nearly unchanged.

## Workspace mode

Inline scene preview inside the editor.

## Split mode

Editor remains visible; runtime moves to the larger right pane.

## Fullscreen mode

Same runtime instance, fullscreen overlay, keyboard controls.

This matches your presentation-mode doc well, and it’s likely the most impressive part of the whole system if implemented smoothly.  

### Keep these runtime APIs

* `runtime.attachTo(iframeEl)`
* `runtime.sync(sceneIndex)` as alias to `goTo`

Those are exactly the right semantic additions for mode switching. 

---

# Simplified import flow for v1

## Route or modal

`#/presentation/:id/import`

## Purpose

Copy a scene from:

* this presentation
* another presentation

## Cut

Do not include:

* shared library source
* adaptation modes
* replace/insert/import matrix explosion

## v1 behavior

User selects a source scene and chooses one of only two outcomes:

```text
(•) Insert after current scene
( ) Replace current scene
```

And one copy mode only:

```text
Copy as-is
```

That’s enough to validate reuse without creating a mini operating system.

---

# Revised data model for v1

You can simplify your model without breaking the future.

## Keep

```js
{
  presentations: Presentation[]
}
```

```js
{
  id,
  title,
  status,
  tags,
  collections,
  updatedAt,
  createdAt,
  settings,
  theme,
  scenes
}
```

```js
{
  id,
  title,
  type,
  presenter,
  content,
  actions,
  advance
}
```

## Defer

* `currentVersionId`
* `versions[]`
* `sharedScenes[]`

### Optional compromise

If you want future-proofing without UI cost, you can keep `versions[]` in the data model but do not build dedicated screens or review flows yet.

That gives you room to grow without paying product complexity now.

---

# File structure for stripped v1

```text
presentation-runtime-shell/
├── index.html
├── styles/
│   ├── shell.css
│   └── screens/
│       ├── library.css
│       ├── workspace.css
│       └── import-scene.css
├── src/
│   ├── main.js
│   ├── core/
│   │   ├── event-bus.js
│   │   ├── state-store.js
│   │   ├── presenter-engine.js
│   │   ├── scene-runner.js
│   │   ├── deck-runtime.js
│   │   ├── contract-loader.js
│   │   ├── router.js
│   │   └── library-store.js
│   ├── screens/
│   │   ├── library.js
│   │   ├── workspace.js
│   │   └── import-scene.js
│   ├── ui/
│   │   ├── app-shell.js
│   │   ├── top-bar.js
│   │   ├── presentation-card.js
│   │   ├── scene-list.js
│   │   ├── inspector-panel.js
│   │   ├── modal.js
│   │   └── empty-state.js
│   ├── contracts/
│   │   └── demo-deck.json
│   └── generated/
```

This preserves your architecture while cutting the nonessential surfaces. 

---

# Revised implementation order

## 1. Foundation

Router, LibraryStore, AppShell, tokens.

## 2. Library

Create/open/manage presentations.

## 3. Workspace

Scene editing + runtime preview.

## 4. Presentation modes

Split + fullscreen, using same runtime instance.

## 5. Simple import

Copy a scene from this or another presentation.

Then stop and test.

Do **not** move to variants/shared library/review until users clearly want them.

---

# Revised acceptance criteria

## v1 is successful if:

### Library

* I can create and open multiple presentations.

### Workspace

* I can select, add, reorder, duplicate, and delete scenes.
* I can preview the active scene live.
* I can edit prompt/intent and see the runtime stay in sync.

### Presentation modes

* I can move instantly between workspace, split, and fullscreen.
* Runtime state is preserved across mode changes.
* Keyboard controls work in fullscreen.

### Reuse

* I can import a scene from another presentation with minimal friction.

If those four things feel good, then you’ve validated the product.

---

# What this buys you

## 1. Faster proof

You test the actual magic sooner.

## 2. Lower accidental complexity

You avoid building management surfaces before content workflows stabilize, which fits your accidental-complexity warning directly. 

## 3. Better design discipline

The UI stays aligned with your “one thing at a time” principle instead of announcing every future capability at once. 

## 4. Cleaner path to v2

Later, you can add:

* variants
* review
* shared scene library

without undoing the architecture.

---

# My blunt recommendation

Treat your original plan as the **full roadmap**, not the first implementation target.

Treat this stripped plan as the **real v1**.

That gives you:

* the right architecture,
* the right product feel,
* and a much better chance of finishing something that teaches you the truth.

Your original plan is here for reference: [implementation-plan.md](sandbox:/mnt/data/implementation-plan.md) 
