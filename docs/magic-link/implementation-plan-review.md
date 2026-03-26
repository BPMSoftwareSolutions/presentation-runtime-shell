Overall: **the plan is directionally right**. It matches the simpler architecture you described and keeps the core invariant intact: **link-only playback should come only from the contract plus URL config, never from browser-local author state**. 

## What looks solid

### 1. The scope is tight

The five-step split is good. It keeps this from turning into another storage redesign and makes the work independently testable. That is exactly what this change needs. 

### 2. The precedence model is correct

The final precedence table is the right mental model:

* code defaults
* contract baseline
* URL overrides
* author prefs for workspace only

That cleanly separates **shared presentation behavior** from **local editing convenience**. 

### 3. Present-mode no longer depending on `prs_library` is the key fix

This is the most important architectural correction in the plan. Moving present mode to contract-first plus URL overrides directly solves the leakage problem. 

### 4. The parser and merge split is clean

Keeping `readMagicLinkConfig`, `mergeDeck`, and `buildMagicLink` together in one module is sensible. It centralizes the magic-link contract and makes round-trip testing easy. 

---

## What I would tighten before implementation

## 1. Base64 decoding is a little too optimistic

Right now the decode sketch uses `atob(raw.replace(...))`, but base64url strings often need padding restored first. Without it, some valid payloads will fail depending on length. The current plan says malformed input should safely fall back, which is good, but you still want correct valid decoding. 

### Recommended fix

Add a tiny helper:

```js
function decodeBase64Url(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
}
```

Then use that inside `readMagicLinkConfig`.

---

## 2. `demo` being pass-through is practical, but a little loose

The plan intentionally filters `settings` and `theme`, but allows `demo` through unchanged. That is fine if `demo` is purely runtime input, but it does create an unbounded surface area in the URL contract. 

### Why that matters

If different runtime areas begin depending on arbitrary `demo` keys, you can end up with:

* undocumented link behavior
* harder QA
* accidental coupling between runtime internals and shared URLs

### Better approach

Keep `demo` flexible, but formalize it slightly. For example:

```js
const ALLOWED_DEMO = new Set([
  "tenant",
  "incidentId",
  "scenario",
  "filters",
]);
```

Or, if you want flexibility, define a namespace rule like:

* only string, number, boolean
* no nested objects beyond one level
* hard size cap

That preserves agility without making `demo` a free-for-all.

---

## 3. `_demoOverrides` on the deck object is okay, but not ideal

The underscore field is clearly meant as runtime-only, but it slightly muddies the deck shape. 

### Cleaner alternative

Return a boot payload instead of overloading deck structure:

```js
{
  deck: mergedDeck,
  demoOverrides: urlOverrides.demo || null
}
```

Then present boot becomes:

```js
const { deck, demoOverrides } = mergeDeck(contractDeck, urlOverrides);
const runtime = createDeckRuntime(deck, { demoOverrides, ...deps });
```

That gives you:

* a cleaner deck model
* less risk of accidental persistence
* clearer runtime API boundaries

If you want minimum churn, `_demoOverrides` is acceptable for now. But I would mark it as a likely follow-up cleanup.

---

## 4. Backwards-compatibility fallback needs a sunset rule

The plan says present mode should fall back to `store.getById(id)` if the contract load fails, for rollout compatibility. That is reasonable short-term, but dangerous if it lingers. 

### Risk

The fallback reintroduces the very local-state dependency you are trying to eliminate.

### Recommendation

Be explicit in the plan:

* fallback is temporary
* guarded behind a feature flag or marked with a removal date
* only allowed for known legacy decks during rollout

I would add a note like:

> Remove local store fallback after contract coverage reaches 100%, or behind `ALLOW_PRESENT_LOCAL_FALLBACK = false` by default.

---

## 5. Query-string-in-hash parsing should be specified a bit more carefully

The plan says routing is hash-only and the format is `#/present/{deckId}?cfg=...`, which is fine. But `buildMagicLink(...).hash` in the round-trip test language is a little fuzzy, because the builder returns a full URL string, not a `URL` object. 

### Small cleanup

Be explicit about test inputs:

* either test against the full returned URL via `new URL(link).hash`
* or make `buildMagicLinkPath(deckId, deck)` return only the hash fragment

That makes the contract less ambiguous.

---

## 6. You should cap payload size

The plan says compression is out of scope unless links exceed about 2000 characters in practice. Good. But even before compression, I would add a size guard in the link generator. 

### Why

This avoids quietly generating brittle links.

### Suggested rule

* warn in workspace if generated URL exceeds a threshold
* maybe 1500–1800 chars as a warning
* keep compression out of scope until the warning actually fires in real use

---

## 7. Sanitization should also validate value shapes, not just keys

Right now unknown keys are dropped, but allowed keys are not obviously type-validated in the sketch. 

### Example

These should probably be rejected or ignored:

* `typingSpeedMs: "fast"`
* `autoAdvance: "yes"`
* `presentControlsPosition: "sideways"`

### Better sanitizer

Use per-field validators:

```js
const validators = {
  presentControlsPosition: (v) => ["top", "bottom"].includes(v),
  playbackMode: (v) => ["interactive", "auto"].includes(v),
  typingSpeedMs: (v) => Number.isFinite(v) && v >= 0,
  autoAdvance: (v) => typeof v === "boolean",
};
```

This is one of the highest-value hardening steps in the whole plan.

---

## My recommended implementation order

I would slightly reorder execution:

### Phase 1

* `magic-link.js`

  * decode helper
  * sanitize with value validation
  * merge
  * build

### Phase 2

* `main.js`

  * new `parsePresentId`
  * present boot from contract + URL only
  * temporary fallback behind explicit guard

### Phase 3

* `workspace.js`

  * generate magic link
  * optional URL length warning

### Phase 4

* present-mode verification

  * confirm no inspector/store coupling
  * confirm no accidental persistence path

That is almost the same as the plan, but it pushes validation hardness up earlier.

---

## What I would change in the document itself

I would revise these parts:

### In Step 1

Add:

* base64url padding restoration
* per-field type validation
* optional payload size guard note

### In Step 2

Prefer:

* returning `{ deck, demoOverrides }`
  instead of mutating deck shape with `_demoOverrides`

### In Step 3

Change:

* localStorage fallback is temporary and gated
* define removal plan

### In Step 4

Add:

* warning when generated link exceeds threshold
* explicitly state whether empty payload should omit `?cfg=` entirely

That last one matters. I would recommend:

* if payload is empty, return plain `#/present/{id}`
* only append `?cfg=` when there is at least one shareable override

---

## Bottom line

**I would approve this plan with a few edits.** The architecture is right. The main things missing are:

* proper base64url padding handling
* value validation, not just key filtering
* a tighter policy for `demo`
* a temporary, explicitly removable compatibility fallback
* optional link-length guardrails

With those changes, this becomes a very solid implementation plan. 
