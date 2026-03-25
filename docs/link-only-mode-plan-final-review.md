These updates are **materially better**. The plan is now much more disciplined, and it addresses the main architectural risk from the earlier version: duplicating runtime / control logic inside present mode. The new three-layer split is the strongest improvement in the doc. 

# What got better

## The architecture is sharper

The biggest win is this section:

```text
Runtime
  ↓
TransportController
  ↓
Present UI
```

That fixes the most important weakness from the earlier draft. `present.js` is no longer trying to become a second mini runtime shell; it is explicitly framed as a thin render layer, while shared transport behavior moves into `src/ui/transport-controller.js`. That is exactly the right direction if you want link-only mode without accidental complexity creep. 

## The boot flow is cleaner

The sequence now explicitly does:

```js
await seedIfEmpty(store);
const presentId = parsePresentId(location.hash);
if (presentId) {
  await bootPresentMode(presentId, store);
  return;
}
```

That is better than the previous wording because it closes the race condition around store availability before `getById`. Good correction. 

## The loading state is a good addition

The explicit `"Loading presentation…"` overlay is a small but high-value UX improvement. It prevents the black-frame ambiguity during attach / first-scene startup, which would otherwise make the shared-link experience feel fragile. 

## The scope is still disciplined

You kept the out-of-scope list tight and resisted feature spread. In particular, leaving `?scene=N`, analytics, revocation, and fullscreen/split refactoring for later helps preserve the simplicity of V1. 

# What is now strong enough to approve

## 1. Isolated boot path

Still the correct decision.

## 2. Auto-start

Still the right V1 choice.

## 3. “Not found” state

Now appropriately plain and low-cost.

## 4. Simplified auto-hide

Much better than a fancier interaction model. Keeping it to “show on interaction, hide after 3 seconds” is the right tradeoff. 

# Remaining risks

These are smaller now, but still worth tightening before implementation.

## 1. `TransportController` still knows a bit too much about presentation semantics

Right now it handles:

* button click wiring
* disabled-state logic
* play/pause/advance label behavior
* counter text

That is mostly fine, but the `playPauseBtn` logic is subtly opinionated:

```js
if (s.status === "presenting") runtime.pause();
else if (s.status === "paused") runtime.resume();
else runtime.next();
```

That is really a **runtime-state interpretation policy**, not just DOM binding. It is acceptable for now, but note that this controller is no longer purely mechanical; it has behavior assumptions baked in. If future modes diverge, this will be the pressure point. 

### Recommendation

Keep it for V1, but name it accordingly. `createTransportController` is okay, but mentally treat it as a shared transport behavior adapter, not a passive binder.

## 2. The loading-state trigger is underspecified

The plan says loading hides on the first `scene:willStart` event. That might be correct in your runtime, but it is the one part I would verify carefully before coding. If `scene:willStart` fires before the iframe visibly paints, you can still get a flash of blank black between loading removal and actual slide display. 

### Recommendation

Prefer hiding the loading overlay on the first runtime state that guarantees scene attachment is visibly underway, or after iframe `load` if that maps more reliably in your architecture.

## 3. Keyboard listener cleanup should be called out explicitly

The doc says `present.js` owns mounting and tearing down DOM, which implies cleanup, but the event listeners shown are global:

* `document.addEventListener("keydown", ...)`
* `document.addEventListener("keydown", showControls)`

That is fine only if teardown explicitly removes them. Since present mode is a distinct boot path, leaks may be rare, but they are still possible during internal reloads or future mode transitions. 

### Recommendation

Make cleanup explicit in the implementation notes:

* remove document listeners
* clear `hideTimer`
* call transport `unbind()`
* unsubscribe from runtime / bus hooks

## 4. The end-card trigger should be normalized

The plan says:

> subscribe to `runtime:complete` bus event

That is okay, but elsewhere the design leans on `runtime.subscribe(state)`. You now have two observation models in play:

* state subscription
* event bus subscription

That is not inherently wrong, but it slightly weakens the otherwise clean layering. 

### Recommendation

If possible, drive the end card from runtime state as well, unless `runtime:complete` is substantially more reliable. One observation path is cleaner than two.

# Small design nits

## Counter edge case

`counterEl.textContent = \`${idx + 1} / ${total}``assumes a valid scene index exists immediately. If runtime has an idle / preloaded state with`idx = -1`or similar, this can briefly render`0 / N`. Maybe that is fine, maybe not; just worth checking. 

## Copy-link helper duplication

The plan says no shared utility needed “at this scope.” Reasonable. I agree for V1. But if you are already touching three call sites, this is near the line where a tiny shared helper becomes justified. Not a blocker.

## Route parsing

You resolved encoding, but I would make sure `parsePresentId(hash)` also safely decodes and rejects malformed values rather than passing bad ids through unchanged.

# Overall verdict

## Status: **Approved with minor implementation cautions**

This revision is much better than the first one.

The plan is now:

* architecturally cleaner
* more explicit about responsibilities
* less likely to duplicate runtime logic
* still tightly scoped

The most important change is the introduction of the shared `TransportController`, which turns present mode into a genuinely thin UI layer instead of a parallel control system. That was the right fix. 

## The only things I’d tighten before coding

Add one short implementation note covering:

* teardown / listener cleanup
* exact loading-overlay hide trigger
* whether end card is driven by state or event bus, and why

Once those are clarified, this is in very good shape.
