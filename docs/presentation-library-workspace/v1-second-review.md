This is **materially better**. The plan now feels like a real v1 instead of a compressed v2 roadmap. It’s focused, internally consistent, and much more likely to get finished without losing the product signal. 

# Overall verdict

## Strong yes

You fixed the biggest problem in the earlier plan:

* too many screens
* too many advanced workflows
* too much UI before validating the core experience

Now the center of gravity is clear:

> persistent runtime + scene editing + instant mode switching

That is exactly the right thing to prove first. 

---

# What improved the most

## 1. The scope is finally disciplined

The new phase breakdown is much healthier:

* Foundation
* Library
* Workspace
* Modes
* Import

That’s a coherent v1 arc. Before, the plan mixed proof-of-concept work with product-expansion work. Now it doesn’t. 

## 2. The core architecture still stays clean

You preserved the best original architectural decisions:

* stable DOM-free runtime
* shell/UI expansion only
* hash routing
* localStorage store
* one runtime instance
* `attachTo()` for mode switching

That stays aligned with the original runtime boundary, which was the right foundation from the beginning.  

## 3. The workspace is now the real product

That’s the biggest win.

The old plan had too many secondary surfaces competing for attention. This one says:

* open presentation
* select scene
* preview it live
* edit intent
* move into split/fullscreen
* come back without losing state

That’s the actual product loop. Good call. 

## 4. You resisted accidental complexity in the right places

The deferrals are smart:

* no variants screen
* no shared scene library
* no change review
* no adaptation modes
* no heavy metadata editing

That matches the “expose power progressively” principle in your UI docs and avoids building system-management before presentation-authoring is proven.  

---

# What I think is especially solid

## `Presentation` as deck contract shape

This is a very good simplification:

> the store object is already acceptable to the runtime, so no transform layer is needed

That removes a whole class of glue code and keeps the mental model simple. Nice. 

## `attachTo()` + `sync()`

Still one of the highest-value parts of the system.

This is what makes the mode story feel like:

* one presentation
* one runtime
* different viewing states

instead of three loosely connected experiences. That matches the presentation-mode guidance very well.  

## Import reduced to copy-as-is

Excellent choice.

That cuts out a fake-smart layer that would have created UI complexity without proving real value. For v1, scene reuse should be boring and reliable. 

## Acceptance criteria are concrete

This is much stronger than the prior version. The checklist is implementation-ready and product-relevant. It gives a real stop point.

---

# The few places I’d still tighten

These are not major issues. More like “last 10% polish.”

## 1. `editIntent` is used but not in the data model

In Phase 3, the textarea persists to `scene.editIntent`, but the declared `Scene` model does not include that field. 

I would add it explicitly now:

```js
editIntent?: string
```

That avoids silent schema drift.

## 2. Library left nav may still be slightly over-ambitious for v1

You say the app shell left nav renders:

* status filters
* collections
* tags
* sort

But you also explicitly defer:

* tag editing
* collection management

That’s fine, but I’d keep this lightweight in the initial pass. Showing empty collections/tags sections too early may make the app feel more “system-ish” than necessary. 

My preference:

* keep status filters now
* hide collections/tags sections if empty

## 3. Reordering scenes in vanilla JS can eat time

Drag-to-reorder is reasonable, but it’s also one of those features that can quietly consume disproportionate effort.

I would protect the schedule by defining a fallback:

* v1a: move up / move down buttons
* v1b: drag reorder only if it’s fast and stable

Not because drag is bad—just because it’s a classic time sink in raw JS.

## 4. `window._runtime` works, but make it intentional

Caching runtime on `window._runtime` is okay for a prototype, but I’d wrap it in a tiny singleton helper instead of using a loose global directly.

Example shape:

```js
getRuntime()
setRuntime(runtime)
clearRuntime()
```

Same practical outcome, less “prototype leakage.”

## 5. Fullscreen overlay z-index

You specify fullscreen overlay as `z-index: var(--z-overlay)`. That may be enough, but since this becomes the dominant mode, I’d consider giving fullscreen its own top layer or ensuring it always sits above any modal/popover states. Small detail, but worth locking down.

---

# My only real caution

## Do not let Phase 5 delay user testing

Import is useful, but it is not more important than validating:

* workspace mode
* split mode
* fullscreen mode
* persistent runtime continuity

So if schedule gets tight, I would still test after Phase 4.

That’s where the product truth lives.

---

# Suggested tiny edits to the document

I’d make just three changes.

## Add `editIntent` to `Scene`

```js
{
  id,
  title,
  type,
  presenter,
  content,
  actions,
  advance,
  editIntent: string
}
```

## Add a fallback note for reorder

Under scene list:

> If drag reorder introduces instability, ship Move Up / Move Down first and defer drag interaction to a follow-up patch.

## Clarify nav visibility

Under App shell left nav:

> Collections and tags render only when present in store data.

That keeps the shell visually quiet.

---

# Final assessment

## I’d rate this version **9.3/10**

Why it works:

* focused proof target
* strong architectural continuity
* much lower accidental complexity
* realistic phase structure
* clear acceptance criteria
* preserves the most distinctive part of the product: persistent runtime across modes

This now feels like something a team could actually build and learn from, instead of a document that’s “smart” but too broad.
