Your existing architecture already points in the right direction: keep the **runtime/core stable and DOM-free**, and treat the UI as a replaceable adapter. That makes it much easier to enforce a clean visual system without contaminating orchestration logic.  

## The core UX stance

The authoring UI should feel like this:

* **calm**
* **obvious**
* **progressive**
* **low-noise**
* **focused on the current task**

The main risk is accidental complexity: once you add presentations, scenes, variants, imports, swaps, libraries, and cross-deck reuse, the interface can start making the user manage the system instead of the presentation. That is exactly the failure mode described in the accidental-complexity notes. 

So the design rule should be:

> **Expose power progressively; keep the default surface area small.**

---

# Product-level UI principles

## 1. One primary action per region

Every screen should have a clear “center of gravity.”

Examples:

* **Library view** → primary action is `Open` or `New Presentation`
* **Presentation workspace** → primary action is `Edit current scene`
* **Scene detail** → primary action is `Regenerate` or `Apply variant`
* **Import modal** → primary action is `Import Scene`

If every panel has five bright buttons, the UI will feel noisy immediately.

---

## 2. Keep the dominant layout stable

Use a consistent frame:

```text
top bar
left navigation / list
main work area
optional right inspector
optional transient modal
```

Do not keep re-inventing layouts per screen. Repeated structure lowers cognitive load.

A good rule:

* **left = where am I**
* **center = what am I working on**
* **right = details/options**
* **modal = rare focused decisions**

---

## 3. Progressive disclosure, not permanent exposure

Do **not** permanently show all of these at once:

* scene metadata
* prompt history
* event logs
* version diffs
* swap tools
* import tools
* shared-library tools
* debug state

Those should appear only when relevant.

The current runtime already has debug-oriented rendering and control wiring, but that belongs behind debug/dev toggles rather than living in the main authoring path. 

---

## 4. Separate “browse” mode from “edit” mode

This is very important.

### Browse mode

User is:

* scanning presentations
* scanning scenes
* comparing candidates
* choosing what to open

### Edit mode

User is:

* changing one scene
* reordering scenes
* importing one scene
* reviewing one diff

If both modes are mixed together, the UI feels mentally expensive.

---

## 5. The presenter/iframe coupling should guide the authoring UX too

The runtime overview makes a strong point: the presenter and iframe should feel **coupled, not parallel**. 

That same principle should shape the editor:

* when user selects a scene, they should see **one coherent unit**
* not “text editor over here, unrelated visual over there, controls somewhere else”

The authoring view should make each scene feel like one synchronized story object.

---

# CSS and visual-system guidance for the coding assistant

The AI writing code should follow a **design-system-first** approach, not ad hoc styling.

## 1. Use design tokens from day one

No random per-component values.

Use variables for:

* colors
* spacing
* radius
* shadows
* typography
* z-index layers
* panel widths
* animation durations

You already have the beginnings of this in `shell.css` with tokens like `--bg`, `--panel`, `--text`, `--muted`, `--radius-*`, and `--shadow`. That’s the right direction. 

A stronger version would look like:

```css
:root {
  --color-bg: #0b1020;
  --color-surface: #121a30;
  --color-surface-2: #18213d;
  --color-text: #eef2ff;
  --color-text-muted: #a8b3cf;
  --color-border: rgba(255,255,255,0.08);
  --color-accent: #8b5cf6;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;

  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;

  --shadow-1: 0 8px 20px rgba(0,0,0,0.18);
  --shadow-2: 0 20px 50px rgba(0,0,0,0.35);

  --font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
}
```

That gives the assistant guardrails.

---

## 2. Limit the number of visual layers

A common UI failure is too many nested cards:

* app background
* card
* inner card
* inner highlighted card
* bordered subsection
* pill
* outlined pill inside card

That becomes cluttered.

Rule of thumb:

* page background
* primary surface
* secondary surface
* accent state

That is usually enough.

---

## 3. Prefer spacing over borders

To keep the UI clean:

* use whitespace first
* use subtle contrast second
* use borders sparingly
* use shadows even more sparingly

Too many borders make the product feel like enterprise software from 2014.

---

## 4. Typography should carry hierarchy, not decoration

Use a very small type scale.

For example:

* page title
* section title
* body
* secondary/meta
* label/caption

Do not create ten font sizes and six weights.

A good interface feels orderly because the type system is predictable.

---

## 5. One accent color, used intentionally

Accent color should mean something:

* selected
* primary action
* active tab
* focused field
* current scene

It should **not** also mean:

* warning
* random decoration
* backgrounds everywhere
* all icons
* all pills

The accent should guide attention, not flood the screen.

---

## 6. Motion should clarify, not entertain

Use motion for:

* panel open/close
* drag/reorder feedback
* scene selection change
* import/swap confirmation
* preview transitions

Avoid:

* excessive hover animations
* bouncing cards
* floating gradients everywhere
* delayed interactions

Because your runtime is already timing-sensitive and sequencer-like, the UI should stay crisp and deterministic rather than ornamental.  

---

# Clean component rules

The coding assistant should be told to build **small, boring, composable UI pieces**.

## Good primitives

* `AppShell`
* `TopBar`
* `Sidebar`
* `List`
* `Card`
* `SectionHeader`
* `Button`
* `IconButton`
* `Input`
* `Tabs`
* `Modal`
* `InspectorPanel`
* `EmptyState`

## Avoid early explosion into hyper-specific components

Bad too early:

* `PresentationTransferSceneVariantComparisonDock`
* `SmartPromptOptimizationPanel`
* `AdaptiveSceneAssetRelationshipToolbar`

That is how accidental complexity sneaks in at the naming level too. 

---

# Screen-by-screen cleanliness rules

## Library screen

Should feel like:

* quiet
* browseable
* easy to scan

Needs:

* search
* sort
* recent
* presentation list/cards
* one clear create button

Should not show:

* scene-level controls
* diff tools
* prompt history
* technical metadata by default

---

## Presentation workspace

Should feel like:

* one deck
* one selected scene
* one clear next action

Best layout:

* left: scene list
* center: active scene preview/editor
* right: optional inspector

Do not show all scene operations inline at all times.
Use a contextual action bar or menu for secondary actions.

---

## Import/swap flows

These should almost certainly be **modal/task flows**, not permanent panels.

Why:

* they are episodic actions
* they require focused comparison
* they are not the main steady-state activity

---

## Shared scene library

This should feel like an asset browser, not another presentation editor.

That means:

* search-heavy
* thumbnail/list-first
* metadata-light
* preview on demand

---

# Specific coding constraints for the AI assistant

Here’s the kind of implementation brief I’d give it.

## CSS rules

* Use **one token file** or one shared `:root` token block.
* Use a **consistent spacing scale** only.
* Use **CSS grid for page layout**, flex for local alignment.
* Keep **max 2–3 surface levels** visible at once.
* Avoid hard-coded colors inside components unless they reference tokens.
* Avoid inline styles except for truly dynamic runtime values.
* Use `clamp()` for responsive typography/panel sizes where helpful.
* Keep hover/focus states subtle and consistent.
* Ensure keyboard focus styling is visible and elegant.
* Ensure panel widths and breakpoints are deliberate, not improvised.

## DOM/component rules

* Components should render from state; they should not own orchestration.
* Runtime/scene logic should stay outside click handlers and DOM code, which matches the current architecture guidance. 
* Keep view components “dumb” where possible.
* Use a small shared button/input/card system.
* Avoid one-off class naming for every tiny variation.

## Naming rules

* Prefer semantic names: `presentation-list`, `scene-item`, `inspector-panel`
* Avoid visual-only names like `purple-box-left`
* Avoid temporary names surviving into product code

---

# A practical visual grammar

This would keep the interface feeling polished.

## Color semantics

* **Background**: deep neutral
* **Surface**: slightly elevated neutral
* **Muted text**: metadata only
* **Accent**: selection / primary CTA
* **Warning**: destructive or risky actions only
* **Success**: save/import/apply confirmation only

## Shape semantics

* larger radius for major containers
* medium radius for cards and inputs
* small radius for chips/tags

## Elevation semantics

* almost everything flat
* one level of shadow for popover/modal
* slightly stronger shadow for active preview surface only

---

# The biggest UX trap to avoid

The trap is building a UI that constantly reminds the user of every capability the system has.

Instead, the UI should mostly say:

* here are your presentations
* here is your current deck
* here is your selected scene
* here is the next best action

Everything else should be tucked behind:

* context menus
* inspector panels
* modals
* secondary tabs

That is the real difference between **powerful** and **clunky**.

---

# A good north-star sentence for the coding assistant

Use this as a standing instruction:

> Build the workspace so that the default screen always emphasizes one thing at a time, uses a restrained visual system, and reveals advanced actions only when the user has clearly entered a task that needs them.

---

# Recommended implementation posture

Given your current docs, I’d frame it like this:

* keep the **runtime tiny and framework-light** while it remains primarily a sequencer 
* let the **UI layer evolve independently** as the authoring environment grows 
* be extremely aggressive about eliminating UI-layer accidental complexity before it hardens into the product 

