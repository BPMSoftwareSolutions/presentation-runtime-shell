This is a *strong plan*. Structurally clean, minimal surface area, and very aligned with your runtime architecture. I’ll walk through it at three levels:

1. **What’s working really well**
2. **Where risk / accidental complexity could creep in**
3. **Concrete improvements (high leverage)**

---

# ✅ 1. What’s Already Excellent

## 🔹 A. The “Isolated Boot Path” is the right call

This is the most important decision in the whole doc—and you nailed it.

> Branching before the app shell mounts = zero contamination

This directly avoids the classic trap described in :

> systems slowly accumulating layers between *intent → execution*

Instead of:

```text
App Shell → Router → Guard → Present Mode
```

You went:

```text
boot → detect → present mode ONLY
```

That’s **clean separation of concerns** and prevents:

* UI leakage
* hidden navigation paths
* shared state bugs

💯 This is the right architectural spine.

---

## 🔹 B. The route design is perfectly minimal

```text
#/present/:id
```

No params explosion. No mode flags. No reuse of existing routes.

This keeps:

* mental model simple
* links stable
* implementation predictable

---

## 🔹 C. The feature is scoped correctly

You *didn’t* add:

* auth
* analytics
* permissions
* deep navigation

That restraint is what keeps this shippable.

You stayed aligned with:

> “presentation playback, not product expansion”

---

## 🔹 D. UI spec is tight and intentional

The player:

* has exactly the right controls
* mirrors video player expectations
* avoids all authoring affordances

The **auto-hide controls** + **end card** are especially good touches.

---

## 🔹 E. Integration points are clean

“Copy Link” added in:

* library card
* detail panel
* workspace

All using one helper:

```js
copyPresentLink(id)
```

That’s the right level of duplication vs abstraction.

---

# ⚠️ 2. Where Accidental Complexity Could Creep In

This is where I’m going to push a bit.

## ⚠️ A. You are re-implementing a “mini runtime shell”

In `present.js`, you're planning to:

* mount DOM
* manage controls
* handle keyboard
* sync runtime state
* manage end card
* manage auto-hide timers

That’s a **second UI system** parallel to your existing one.

This is the biggest risk.

---

### Why this matters

From your runtime design :

> Runtime is already a singleton that drives playback, state, and navigation

But your plan creates:

```text
Workspace UI → uses runtime
Present UI   → re-wraps runtime differently
```

That’s duplication of:

* control logic
* state interpretation
* UI sync behavior

👉 This is exactly how accidental complexity starts scaling.

---

## ⚠️ B. “No router” is clean—but removes extensibility

You intentionally said:

> router is not started in present mode

That’s clean for now.

But it means:

* no deep linking to scenes later
* no future extensions (e.g. `#/present/:id?scene=3`)
* no internal navigation model

Not a blocker—but something to be aware of.

---

## ⚠️ C. Control logic duplication

You now have:

* Workspace controls
* Fullscreen controls
* Present mode controls

All doing similar things:

```js
runtime.next()
runtime.previous()
runtime.goTo()
```

But implemented separately.

👉 This is a subtle duplication vector.

---

## ⚠️ D. Auto-hide system = hidden complexity

This seems simple:

> hide after 3s, show on activity

But introduces:

* timers
* event listeners (mousemove, keydown, focus)
* edge cases (hover over controls, iframe focus, etc.)

This is one of those “small UX features” that can balloon.

---

# 🔧 3. High-Leverage Improvements

These will make this **much stronger without adding weight**.

---

## 🔥 Improvement 1 — Reuse Runtime, Not Reinterpret It

Right now:

> present.js subscribes and manually syncs UI

Instead:

### ✅ Treat runtime as the **single source of truth UI driver**

You already have:

```js
runtime.subscribe(state => { ... })
```

Lean into that HARD.

---

### Recommendation

Create a **thin adapter layer**:

```js
function bindRuntimeToPresentUI(runtime, ui) {
  runtime.subscribe((state) => {
    ui.setCounter(state.currentSceneIndex, total);
    ui.setButtons(state);
    ui.setLabel(...);
    ui.setStatus(state.status);
  });
}
```

Now:

* no logic duplication
* no interpretation drift
* consistent behavior with workspace

---

## 🔥 Improvement 2 — Extract Shared Transport Logic

Right now controls are being rebuilt.

Instead:

### Extract a tiny module:

```js
createTransportController(runtime, elements)
```

Used by:

* workspace
* fullscreen
* present mode

This prevents:

* 3 slightly different implementations
* future bugs when behavior changes

---

## 🔥 Improvement 3 — Keep Present Mode “Dumb”

This is key.

> Present mode should be a **render layer**, not a logic layer

Avoid:

* decision logic
* state derivation
* duplicated rules

It should only:

```text
listen → render → forward input to runtime
```

---

## 🔥 Improvement 4 — Simplify Auto-hide (seriously)

Right now:

> timer + multiple triggers + class toggling

Start simpler:

```js
onInteraction → show controls + reset timer
timer → hide controls
```

Avoid:

* hover edge cases
* focus edge cases
* iframe coordination

You can refine later.

---

## 🔥 Improvement 5 — Add ONE safety check at boot

Edge case:

```js
store.getById(id)
```

If store isn’t seeded yet → fail

You already mention:

```js
seedIfEmpty(store)
```

But make it explicit:

```js
await seedIfEmpty(store);
const deck = store.getById(id);
```

Prevents race conditions.

---

## 🔥 Improvement 6 — Tiny UX upgrade (high impact)

When loading:

Add a **1-frame loading state**:

```text
Loading presentation…
```

Because:

* iframe + runtime attach isn’t instant
* avoids blank black screen confusion

---

# 🧠 Architectural Summary

## What you did right

You chose:

> **Isolation over reuse**

At the *shell level* (correct decision)

---

## What to watch

Avoid:

> **Duplication at the interaction layer**

That’s where complexity will creep in.

---

## The ideal end state

```text
Runtime (single source of truth)
        ↓
Transport Controller (shared)
        ↓
Present UI (thin render layer)
```

---

# 💬 Direct Answers to Your Open Questions

### 1. Auto-start vs click-to-start

👉 **Auto-start for V1**

* matches expectation of “shared link”
* feels magical
* aligns with demo/video use case

Later: add optional splash if needed.

---

### 2. Controls auto-hide (3s)

👉 Keep 3s

* standard mental model
* feels like video player

But keep implementation SIMPLE.

---

### 3. “Not found” state

👉 Keep it dead simple:

```text
Presentation not found
```

No branding yet. No navigation.

---

### 4. URL encoding

👉 You’re correct:

```js
encodeURIComponent(id)
```

Just ensure:

* IDs never contain `/`
* or normalize them at creation time

---

# 🧭 Final Verdict

## This is:

✅ Clean
✅ Focused
✅ Shippable
✅ Architecturally sound

---

## The ONLY real risk:

> duplicating runtime/UI logic in present mode

If you fix that, this becomes:

> **a foundational feature you won’t have to revisit**
