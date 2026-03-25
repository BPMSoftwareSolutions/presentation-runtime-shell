Below is a **canonical set of 6 named wireframes** using one consistent layout system:

* **Top bar**
* **Left navigation**
* **Center work area**
* **Optional right inspector**
* **Modal/task overlays only when needed**

The goal is to make the product feel like **one calm workspace**, not six unrelated screens.

---

# Canonical layout system

```text
+------------------------------------------------------------------------------------------------------+
| Top Bar                                                                                              |
+--------------------------+------------------------------------------------------+--------------------+
| Left Nav / Context       | Main Work Area                                       | Right Inspector    |
|                          |                                                      | (optional)         |
|                          |                                                      |                    |
+--------------------------+------------------------------------------------------+--------------------+
```

---

# 1. Screen: Presentation Library

**Purpose:** browse, search, sort, open, and create presentations.

```text
SCREEN 01 — PRESENTATION LIBRARY

+------------------------------------------------------------------------------------------------------+
| AI Presentation System                                 [Search presentations........]   [New +]      |
+--------------------------+------------------------------------------------------+--------------------+
| Workspace                | Presentations                                        | Details            |
|--------------------------|------------------------------------------------------|--------------------|
| > All                    | Recent                                               | Selected:          |
| > Drafts                 |                                                      | Q2 Board Review    |
| > Ready                  |  +--------------------+  +--------------------+     |                    |
| > Archived               |  | Q2 Board Review    |  | Product Launch     |     | 14 scenes          |
|                          |  | 14 scenes          |  | 10 scenes          |     | draft              |
| Collections              |  | updated 2h ago     |  | updated 1d ago     |     | updated 2h ago     |
| > Finance                |  | [Open]   [•••]     |  | [Open]   [•••]     |     |                    |
| > Demos                  |  +--------------------+  +--------------------+     | [Open]             |
| > Templates              |                                                      | [Duplicate]        |
|                          | All Presentations                                    | [Rename]           |
| Sort                     |                                                      | [Archive]          |
| [Recently updated v]     |  > Q2 Board Review                14 scenes  draft   |                    |
|                          |  > Product Launch Narrative       10 scenes  ready   |                    |
| Tags                     |  > Investor Update                18 scenes  draft   |                    |
| [finance] [sales] [ops] |  > Renewal Pipeline Review         9 scenes  ready   |                    |
+--------------------------+------------------------------------------------------+--------------------+
```

## Why it is canonical

* Stable browse-first view
* No scene-level clutter
* Details stay lightweight
* One obvious CTA: **New**

---

# 2. Screen: Presentation Workspace

**Purpose:** work inside one presentation, with one selected scene in focus.

```text
SCREEN 02 — PRESENTATION WORKSPACE

+------------------------------------------------------------------------------------------------------+
| Presentations / Q2 Board Review                                   [Preview] [Present] [Share]       |
+--------------------------+------------------------------------------------------+--------------------+
| Scenes                   | Active Scene                                         | Scene Inspector    |
|--------------------------|------------------------------------------------------|--------------------|
| [+ New Scene]            | Scene 06 — Margin Compression                        | Title              |
|                          |                                                      | Margin Compression |
|  01  Executive Summary   | +--------------------------------------------------+ |                    |
|  02  Market Context      | |                                                  | | Type              |
|  03  Revenue Trend       | |          LIVE SCENE PREVIEW / CANVAS             | | Narrative + Chart |
|  04  Cost Stack          | |                                                  | |                    |
|  05  Margin Walk         | +--------------------------------------------------+ | Status             |
| >06  Margin Compression  |                                                      | Draft              |
|  07  Operational Drivers | Prompt / Edit Intent                                 |                    |
|  08  Scenario Model      | ---------------------------------------------------- | Actions            |
|  09  Recommendation      | "Simplify the story and reduce chart clutter."      | [Regenerate]       |
|  10  Closing             |                                                      | [Create Variant]   |
|                          | [Edit Text] [Swap Scene] [Import Scene]             | [Duplicate]        |
|                          |                                                      | [Delete]           |
+--------------------------+------------------------------------------------------+--------------------+
```

## Why it is canonical

* Left = sequence
* Center = current work
* Right = focused controls
* Only one scene is emphasized at a time

---

# 3. Screen: Scene Variants

**Purpose:** compare alternate versions of one scene and choose one.

```text
SCREEN 03 — SCENE VARIANTS

+------------------------------------------------------------------------------------------------------+
| Q2 Board Review / Scene 06 / Variants                                   [Back to Workspace]         |
+--------------------------+------------------------------------------------------+--------------------+
| Scene List               | Variant Gallery                                      | Variant Details    |
|--------------------------|------------------------------------------------------|--------------------|
|  01 Executive Summary    | Current Variants                                     | Selected Variant   |
|  02 Market Context       |                                                      | Version B          |
|  03 Revenue Trend        | +----------------------+  +----------------------+   |                    |
|  04 Cost Stack           | | Version A            |  | Version B            |   | Tone: Executive    |
|  05 Margin Walk          | | Dense analytical     |  | Cleaner narrative    |   |                    |
| >06 Margin Compression   | | [Thumbnail]          |  | [Thumbnail]          |   | Based on prompt:   |
|  07 Ops Drivers          | | [Preview] [Apply]    |  | [Preview] [Applied]  |   | "reduce clutter"   |
|  08 Scenario Model       | +----------------------+  +----------------------+   |                    |
|  09 Recommendation       |                                                      | Changes            |
|                          | +----------------------+                             | - shorter title    |
|                          | | Version C            |                             | - less text        |
|                          | | Dramatic framing     |                             | - new chart style  |
|                          | | [Thumbnail]          |                             |                    |
|                          | | [Preview] [Apply]    |                             | [Apply]            |
|                          | +----------------------+                             | [Keep as Draft]    |
+--------------------------+------------------------------------------------------+--------------------+
```

## Why it is canonical

* One problem, one screen
* Comparison is central
* Selection state is obvious
* No cross-presentation noise here

---

# 4. Screen: Import / Swap Scene

**Purpose:** pull a scene from the same presentation, another presentation, or a shared library.

```text
SCREEN 04 — IMPORT / SWAP SCENE

+------------------------------------------------------------------------------------------------------+
| Import / Swap Scene for: Q2 Board Review / Scene 06                                                  |
+--------------------------+------------------------------------------------------+--------------------+
| Source                   | Search & Results                                     | Import Settings    |
|--------------------------|------------------------------------------------------|--------------------|
| (•) This Presentation    | Search: [ pricing / waterfall / recommendation ... ] | Mode               |
| ( ) Another Presentation |                                                      | (•) Import         |
| ( ) Shared Scene Library | Results                                              | ( ) Replace        |
|                          |                                                      | ( ) Insert After   |
| Presentation             | +--------------------+  +--------------------+      |                    |
| [Product Launch v]       | | 04 Pricing Story   |  | 07 Rollout Plan    |      | Adaptation         |
|                          | | concise structure  |  | timeline-based     |      | (•) Copy as-is     |
| Filters                  | | [Preview] [Select] |  | [Preview] [Select] |      | ( ) Apply style    |
| [Narrative] [Chart]      | +--------------------+  +--------------------+      | ( ) Re-generate    |
| [Executive] [Technical]  |                                                      |                    |
|                          | +--------------------+                               | Destination        |
|                          | | Shared: Revenue    |                               | Scene 06           |
|                          | | Waterfall          |                               |                    |
|                          | | [Preview] [Select] |                               | [Cancel] [Apply]   |
|                          | +--------------------+                               |                    |
+--------------------------+------------------------------------------------------+--------------------+
```

## Why it is canonical

* A single dedicated transfer screen
* Same layout as other screens
* Advanced action, but still calm
* Right panel handles final decision-making

---

# 5. Screen: Shared Scene Library

**Purpose:** browse reusable scenes across presentations and templates.

```text
SCREEN 05 — SHARED SCENE LIBRARY

+------------------------------------------------------------------------------------------------------+
| Shared Scene Library                                     [Search reusable scenes........]            |
+--------------------------+------------------------------------------------------+--------------------+
| Filters                  | Library                                              | Selected Asset     |
|--------------------------|------------------------------------------------------|--------------------|
| Type                     | Tabs: [All] [Saved] [Team] [Recently Reused]         | Revenue Waterfall  |
| [x] Narrative            |                                                      |                    |
| [x] Chart                | +--------------------------------------------------+ | Type: Chart        |
| [ ] Timeline             | | Name                     Type        Used In      | | Used in: 8 decks  |
| [ ] Closing              | |--------------------------------------------------| |                    |
|                          | | Executive Summary       Narrative   12 decks     | | Tags              |
| Tone                     | | Revenue Waterfall       Chart       8 decks      | | [finance] [exec]  |
| [x] Executive            | | 2x2 Positioning         Framework   5 decks      | |                    |
| [ ] Analytical           | | Roadmap Timeline        Timeline    9 decks      | | Actions           |
|                          | | Recommendation Close    Narrative   17 decks     | | [Preview]         |
| Tags                     | +--------------------------------------------------+ | [Insert]          |
| [finance] [board] [ops] |                                                      | [Fork]             |
|                          | Preview strip / thumbnails                           | [Open Source Deck] |
+--------------------------+------------------------------------------------------+--------------------+
```

## Why it is canonical

* Feels like an asset browser, not a deck editor
* Search and filters are primary
* Details stay secondary
* Reuse is the main job

---

# 6. Screen: Change Review

**Purpose:** safely review AI-generated changes before accepting them.

```text
SCREEN 06 — CHANGE REVIEW

+------------------------------------------------------------------------------------------------------+
| Review Changes / Q2 Board Review / Scene 06                                                          |
+--------------------------+------------------------------------------------------+--------------------+
| Change List              | Before / After                                       | Decision           |
|--------------------------|------------------------------------------------------|--------------------|
| > Scene 06 updated       | +--------------------------+  +--------------------+ | Change Summary     |
|  Scene 04 updated        | | BEFORE                   |  | AFTER              | |                    |
|  Scene 09 new variant    | | Margin Compression       |  | Why Margins Fell   | | - title rewritten  |
|                          | |                          |  |                    | | - text reduced     |
| Filters                  | | [old preview]            |  | [new preview]      | | - layout cleaned   |
| [All] [Pending] [New]    | |                          |  |                    | | - chart replaced   |
|                          | +--------------------------+  +--------------------+ |                    |
|                          |                                                      | Keep Result        |
|                          | Diff Notes                                            | [Accept Changes]   |
|                          | ---------------------------------------------------- | [Reject]           |
|                          | - shorter title                                       | [Keep Both]        |
|                          | - clearer narrative hierarchy                         |                    |
|                          | - old chart replaced with waterfall                   | Next               |
|                          |                                                      | [Previous Change]  |
|                          |                                                      | [Next Change]      |
+--------------------------+------------------------------------------------------+--------------------+
```

## Why it is canonical

* Trust-building screen
* Before/after is visually central
* Decision area is focused and quiet
* Great fit for AI-assisted editing

---

# The 6 canonical screens together

| # | Screen Name                | Main Job                                             |
| - | -------------------------- | ---------------------------------------------------- |
| 1 | **Presentation Library**   | Browse and manage all presentations                  |
| 2 | **Presentation Workspace** | Edit one presentation and one selected scene         |
| 3 | **Scene Variants**         | Compare and apply alternate versions of a scene      |
| 4 | **Import / Swap Scene**    | Reuse scenes from same deck, other decks, or library |
| 5 | **Shared Scene Library**   | Browse reusable scene assets                         |
| 6 | **Change Review**          | Approve or reject AI-generated edits                 |

---

# Consistency rules across all 6

## Shared structural rules

* **Top bar** always shows location and global action
* **Left panel** always handles navigation or filtering
* **Center panel** is always the main task surface
* **Right panel** is always details, actions, or confirmation

## Shared visual rules

* calm dark or neutral shell
* one accent color for active/selected states
* restrained use of cards
* minimal button emphasis
* no more than one primary CTA per screen

## Shared UX rules

* only one active task per screen
* advanced actions live in focused screens, not everywhere
* the selected object is always obvious
* the next action is always obvious

---

# A good build order

If the coding assistant is implementing these, I would build them in this order:

1. **Presentation Library**
2. **Presentation Workspace**
3. **Import / Swap Scene**
4. **Scene Variants**
5. **Change Review**
6. **Shared Scene Library**

That gives you the most useful product early without overbuilding.

---

# One naming convention recommendation

Use these exact route/screen names in the app:

```text
/library
/presentation/:id
/presentation/:id/scene/:sceneId/variants
/presentation/:id/scene/:sceneId/import
/library/shared-scenes
/presentation/:id/review
```

That keeps product language clean and consistent.
