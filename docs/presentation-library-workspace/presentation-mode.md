This is a **critical UX moment** because it’s where the system shifts from:

> **authoring mode → playback mode**

If this transition is clunky or ambiguous, the whole product feels off.

---

# Core design principle

> **“Presenting” is not a different app — it’s a mode of the same presentation.**

So the user should never feel like they’re “leaving” — just **entering a focused state**.

---

# Where this lives in the UI

In the **Presentation Workspace (Screen 02)**, you already have:

```text
Top Bar (right side):
[Preview]   [Present]   [Share]
```

These should map to **three distinct modes**:

| Button                  | Mode           | Purpose                              |
| ----------------------- | -------------- | ------------------------------------ |
| Preview                 | Inline preview | Quick check inside workspace         |
| Present                 | Full playback  | Clean, distraction-free presentation |
| (Optional) Split toggle | Split mode     | Edit + present side-by-side          |

---

# The 3 presentation modes

## 1. Inline Preview (default / lightweight)

This is already happening inside the workspace:

```text
+--------------------------+------------------------------------------------------+
| Scenes                   | Active Scene                                         |
|--------------------------|------------------------------------------------------|
|                          | +--------------------------------------------------+ |
|                          | | LIVE SCENE PREVIEW (iframe)                     | |
|                          | +--------------------------------------------------+ |
```

### Characteristics

* Uses the same runtime
* Embedded in the editor
* Fast iteration
* No navigation chrome removed

### When used

* Editing content
* Tweaking prompts
* Checking one scene

---

## 2. Split Mode (edit + present)

Triggered by:

* `[Preview]` toggle OR
* `[Split View]` button

```text
SPLIT MODE — EDIT + PRESENT

+------------------------------------------------------------------------------------------------------+
| Q2 Board Review                                             [Exit Split] [Present Fullscreen]        |
+--------------------------+------------------------------------------+----------------------------------+
| Scenes                   | Scene Editor                             | Live Presentation               |
|--------------------------|------------------------------------------|----------------------------------|
| 01 Executive Summary     | Scene 06 — Margin Compression            | +----------------------------+   |
| 02 Market Context        |                                          | |                            |   |
| 03 Revenue Trend         | Prompt:                                 | |   FULL PRESENTATION FLOW   |   |
| 04 Cost Stack            | "Simplify chart..."                      | |   (with navigation)        |   |
| 05 Margin Walk           |                                          | |                            |   |
| >06 Margin Compression   | [Regenerate]                             | +----------------------------+   |
| 07 Ops Drivers           |                                          |   ◀ Prev    ▶ Next             |
|                          |                                          |   Scene 6 of 10                |
+--------------------------+------------------------------------------+----------------------------------+
```

### Key idea

* Left/middle = **authoring**
* Right = **actual presentation runtime**

### Important detail

This is not just previewing one scene — it’s the **real runtime progressing through scenes**.

---

## 3. Fullscreen Present Mode (clean delivery)

Triggered by:

* `[Present]` button
* keyboard shortcut (e.g. `Cmd/Ctrl + Enter`)
* from split mode → “Present Fullscreen”

```text
FULLSCREEN PRESENT MODE

+----------------------------------------------------------------------------------+
| (no editor UI, no panels)                                                        |
|                                                                                  |
|                     +----------------------------------+                         |
|                     |                                  |                         |
|                     |   PRESENTATION (iframe + UI)     |                         |
|                     |                                  |                         |
|                     +----------------------------------+                         |
|                                                                                  |
|   ◀ Prev                  Scene 6 — Margin Compression                  ▶ Next   |
|                                                                                  |
|   [Esc] Exit    [Space] Next    [← →] Navigate                                 |
+----------------------------------------------------------------------------------+
```

### Characteristics

* No workspace UI
* No distractions
* Presenter controls only
* Feels like Keynote / PowerPoint present mode

---

# Transition flows (important)

## Flow A — Workspace → Split

```text
User clicks [Preview] or [Split View]

→ UI animates:
   - canvas shrinks to right pane
   - editor stays visible
   - runtime becomes continuous (not single-scene)

→ runtime.sync(currentSceneIndex)
```

### UX requirement

* **No reload feeling**
* Same runtime instance if possible
* Smooth layout shift

---

## Flow B — Workspace → Fullscreen

```text
User clicks [Present]

→ route change OR overlay mount
→ runtime enters presentation mode
→ UI chrome disappears
```

### Implementation options

#### Option 1 (recommended)

Route-based:

```text
/presentation/:id → workspace
/presentation/:id/present → fullscreen
```

#### Option 2

Overlay-based:

* fullscreen container mounted over app

---

## Flow C — Split → Fullscreen

```text
User clicks [Present Fullscreen]

→ expand right panel to full screen
→ hide editor instantly (or animate)
→ keep runtime state (no restart)
```

This is the smoothest experience.

---

## Flow D — Fullscreen → Workspace

```text
User presses [Esc]

→ return to workspace
→ restore:
   - selected scene
   - scroll position
   - editor state
```

---

# Critical UX details

## 1. Preserve runtime state

Do NOT do this:

* reset to scene 1 every time
* reload everything on mode switch

Instead:

```js
runtime.getState()
// { sceneIndex: 5, paused: false }

→ reuse when switching modes
```

This aligns with your runtime API design. 

---

## 2. Keep “current scene” consistent

If user is editing Scene 06:

* split mode → presentation should start at Scene 06
* fullscreen → same

This creates a strong mental link:

> “I’m editing *this*, and now I’m seeing *this in context*”

---

## 3. Don’t duplicate runtimes unless necessary

Best:

* one runtime instance
* different render containers

Only create a second runtime if:

* you explicitly want independent playback

---

## 4. Keyboard-first control

Especially in fullscreen:

```text
Space / →     next
←             previous
Esc           exit
R             restart
S             skip typing
```

This matches the runtime control model you already have. 

---

## 5. Clear mode indicators

Always show where the user is:

* Workspace → full UI
* Split → visible divider + “Exit Split”
* Fullscreen → minimal overlay hint (“Esc to exit”)

---

# Minimal UI additions to support this

## In Top Bar

```text
[Preview ▾]   [Present]
```

Preview dropdown:

```text
Preview options:
- Inline (default)
- Split view
```

---

## In Split Mode header

```text
[Exit Split]   [Present Fullscreen]
```

---

## In Fullscreen overlay

```text
(hover or subtle)
"Press Esc to exit"
```

---

# Clean mental model for the user

You want the user to feel:

```text
I am editing a presentation
 → I can quickly preview it
 → I can see it side-by-side
 → I can present it cleanly
```

NOT:

```text
I am switching between 3 different systems
```

---

# Implementation sketch

```js
function enterSplitMode() {
  layout.setMode("split");
  runtime.attachTo(splitPaneElement);
}

function enterFullscreen() {
  layout.setMode("fullscreen");
  runtime.attachTo(fullscreenElement);
}

function exitPresentation() {
  layout.setMode("workspace");
  runtime.attachTo(workspacePreviewElement);
}
```

---

# One strong recommendation

> **Make “Present” feel instant and reliable.**

That means:

* no loading spinners
* no re-generation
* no UI flicker
* no lost state

Because this is the moment users judge whether the system is “real” or not.

---

# Final takeaway

The clean model is:

```text
Workspace (edit)
   ↓
Split (edit + run)
   ↓
Fullscreen (run only)
```

All powered by:

> **the same runtime instance, just rendered differently**

