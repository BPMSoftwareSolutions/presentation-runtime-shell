This is a **strong plan**. It fixes the real architectural issue: the app currently treats browser storage as the source of truth for behavior that is actually **deck-owned** and should be shared at runtime. The plan correctly redefines that boundary and makes link-only playback depend on **contract baseline + remote overrides**, not browser-local state. 

# What is already solid

## 1. The boundary is correct

The split between:

* **deck-owned runtime data** in a remote store, and
* **browser-owned authoring prefs** in `localStorage`

is exactly the right design. That is the most important decision in the document. 

## 2. The precedence order is correct

The required order is sensible and deterministic:

1. code defaults
2. contract baseline
3. remote shared overrides
4. optional ephemeral URL/session overrides
5. local author prefs, UI-only

The explicit rule that local prefs must never override deck-owned behavior is the key safeguard. 

## 3. Link-only mode is defined clearly

The plan’s strongest statement is the link-only rule:

`effectiveDeck = merge(contractBaseline, remoteDeckOverrides)`

That closes the exact hole you described. 

## 4. It is scoped well

It stays focused on:

* persistence redesign
* minimal Replit architecture
* phased migration
* test coverage

and avoids overreaching into collaboration, roles, or full auth. That restraint is good. 

## 5. The migration path is practical

The phased rollout is realistic:

* guardrails/flag
* read path
* write path
* link-only hardening
* local narrowing

That is a low-risk sequence. 

---

# What I would tighten before implementation

## 1. Clarify what `PUT /api/decks/:deckId` stores

Right now the plan says “store a remote override document” and shows a payload with metadata plus `overrides`. That is good, but the API contract should be made explicit:

### Recommendation

Make the server store **only remote override docs**, not full merged decks.

That means:

* contracts remain immutable baseline
* DB stores only mutable override state
* merge always happens in one place

### Why

If you ever store merged decks remotely, you blur the source-of-truth boundary again and make contract evolution harder.

## 2. Define merge semantics more precisely for scenes

“Scenes merge by `scene.id`” is right, but there is an ambiguity:

* Are scenes still represented remotely as an object keyed by scene id?
* How is scene order represented?

The plan says “scene order” is remote, but does not define its shape. 

### Recommendation

Use this model:

```json
{
  "overrides": {
    "settings": {},
    "theme": {},
    "sceneOrder": ["pd-01", "pd-03", "pd-02"],
    "scenes": {
      "pd-02": {
        "title": "The Problem"
      }
    }
  }
}
```

That is cleaner than trying to infer order from object keys or patching arrays.

## 3. Separate authoring state from playback state at the type level

The plan does this conceptually, but I would make it explicit in code contracts too. Otherwise it is easy for a future change to accidentally write a deck-owned field into local prefs.

### Recommendation

Define two distinct stores and schemas:

* `DeckOverrides`
* `AuthorPrefs`

with no shared write helper for both.

That prevents “just save everything” regressions.

## 4. Versioning needs one more sentence

The optimistic concurrency section is good, but it needs one design choice clarified:

### Question the code should answer

What is the version attached to?

* the entire deck override doc, or
* a field-level patch stream?

For the minimal path, it should be **deck-level versioning only**.

### Recommendation

Keep it simple:

* read returns `{ version, overrides }`
* write requires `expectedVersion`
* update increments version atomically

Do not add patch logs yet.

## 5. Define failure behavior for public presentations

The plan says load contract + remote overrides, but not what happens if remote is unavailable.

### Recommendation

Explicitly define:

For `#/present/:id`:

* if remote fetch succeeds: use merged deck
* if remote fetch fails: use contract baseline and surface a lightweight diagnostic in logs
* do not fall back to browser-local deck state

That last part matters most.

---

# The two biggest risks

## Risk 1: `library-store.js` continues to “help”

This is the most likely regression. Even after introducing a repository boundary, old code paths may still read from `prs_library` or write merged deck state back into it.

### Recommendation

During migration, add a hard rule:

* `library-store.js` may not provide effective deck settings to `present.js`
* only `LocalAuthorPrefsStore` can read browser-local prefs

That is worth enforcing with a test and maybe a temporary runtime assertion. 

## Risk 2: link-only and workspace drift into separate merge logic

If workspace computes deck state one way and present mode computes it another way, you will get subtle bugs.

### Recommendation

There should be exactly one merge function:

* `mergeDeck(contractBaseline, remoteOverrides, ephemeralOverrides?)`

used by both workspace and present mode.

---

# Minimal implementation path I would actually use

## Step 1

Add the backend and DB table exactly as planned. Keep the schema small. 

## Step 2

Implement a single server contract:

### GET

Returns:

```json
{
  "deckId": "msp-demo-deck",
  "version": 12,
  "overrides": { ... },
  "updatedAt": "..."
}
```

### PUT

Accepts:

```json
{
  "expectedVersion": 12,
  "patch": {
    "settings": {
      "presentControlsPosition": "bottom"
    }
  }
}
```

Server then:

* reads current override doc
* merges patch into overrides
* bumps version
* writes updated doc

This is better than asking the client to send the full override doc every time.

## Step 3

Move only these fields first:

* `deck.settings.*`
* `deck.theme.*`
* scene title
* `editIntent`
* `advance`
* presenter blocks

That gives you the important client-visible behavior first.

## Step 4

Lock down link-only mode so it never consults local deck storage.

## Step 5

Only after that, reduce `prs_library`.

That sequencing keeps the blast radius down.

---

# Suggested edits to the plan document

I would make these changes before coding:

## Add a “Remote Failure Behavior” section

Something like:

> If remote override fetch fails, the app falls back to contract baseline only. Local browser deck state must never be used as fallback for link-only presentation behavior.

## Add an explicit “Override Shape” section

Define:

* `sceneOrder`
* `scenes` keyed by scene id
* `settings`
* `theme`

## Tighten the API contract

Replace generic `PUT /api/decks/:deckId` wording with:

* **server stores override docs**
* **client sends patch + expectedVersion**
* **server merges and increments version**

## Add a migration invariant

Something like:

> During migration, `prs_library` is treated as legacy/cache only and must not be the authoritative source for deck-owned fields.

---

# My verdict

## Approve with a few small refinements

The plan is directionally right and implementation-ready. The only things I would tighten are:

* define remote payload shape more strictly
* define scene ordering explicitly
* define failure behavior explicitly
* make the server own patch merge + version bump
* prevent legacy local deck reads from surviving the migration

With those refinements, this becomes a very clean minimal redesign. The uploaded plan is a solid foundation. 
