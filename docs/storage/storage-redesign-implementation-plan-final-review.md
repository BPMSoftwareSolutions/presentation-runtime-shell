These updates are **much tighter**. The plan now closes nearly all of the gaps from the earlier review, and it reads like something you could hand directly to implementation. The biggest improvements are the stricter API contract, the explicit remote failure behavior for link-only mode, the formalized override shape, and the migration invariant around `prs_library`. 

# What improved materially

## 1. The precedence model is now explicit enough to implement

The plan now states the required order clearly and adds the invariant that local author prefs are **never part of effective deck computation**, which is the key boundary. That is exactly the protection this redesign needed. 

## 2. Link-only failure behavior is now correct

This is one of the best additions:

* success: `merge(contractBaseline, remoteDeckOverrides)`
* failure: `contractBaseline` only
* never browser-local deck state

That removes ambiguity and prevents the most dangerous fallback path. 

## 3. The override payload shape is much better defined

The addition of:

* `overrides.settings`
* `overrides.theme`
* `overrides.sceneOrder`
* `overrides.scenes` keyed by `scene.id`

is a real upgrade. It resolves the earlier uncertainty around scene ordering and gives the merge layer a clean contract. 

## 4. The server contract is now stronger

The plan now says the server stores only override docs, clients send `patch + expectedVersion`, and the server owns:

* merge
* atomic version increment
* persistence

That is the right split of responsibility for a minimal but durable system. 

## 5. The migration safeguards are better

Two additions stand out:

* `PERSISTENCE_MODE=local|remote_hybrid`
* the invariant that `prs_library` is legacy/cache only and must not be authoritative for deck-owned fields

That is exactly the kind of operational guardrail that prevents accidental regressions during rollout. 

## 6. The repository and schema split is now clear

The document now explicitly distinguishes:

* `DeckOverrides` as remote-only
* `AuthorPrefs` as local-only
* no shared write helper across both domains

That is an excellent refinement because it reduces the chance of the old “save everything together” pattern creeping back in. 

---

# What is now especially strong

## The plan is implementation-shaped

It is no longer just architectural guidance. It now has:

* endpoint contracts
* payload examples
* merge semantics
* migration phases
* file-level change targets
* acceptance criteria
* test plan
* execution checklist

That makes it materially better as a working implementation document. 

## The risky areas are addressed directly

The previous weak spots were:

* unclear remote payload shape
* unclear scene order handling
* unclear failure behavior
* potential ambiguity around who merges patches
* risk of lingering `prs_library` truth ownership

Those are now all addressed explicitly. 

---

# Remaining issues I would still tighten

These are no longer blockers, but they are worth refining before coding.

## 1. The SQL schema does not yet reflect versioning explicitly

The payload example includes `version`, and the API contract depends on optimistic concurrency, but the SQL schema shown is still:

```sql
create table if not exists presentation_decks (
  deck_id text primary key,
  contract_version text null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
```

That works, but it leaves versioning buried inside `payload`, unless that is the intent. 

### Recommendation

Pick one of these and state it plainly:

**Option A — version inside payload**

* simplest document model
* less queryable

**Option B — version as first-class column**

```sql
version bigint not null default 0
```

For the implementation path you want, I would prefer **version as a first-class column**. It makes conflict handling and atomic update SQL cleaner.

## 2. The patch merge rules need one more sentence for deletion semantics

The merge behavior is defined for replacement and shallow merge, but not for removing values.

Example:

* How do you clear a title override and return to contract baseline?
* How do you remove a scene override entry?

Right now that is unspecified. 

### Recommendation

Define one minimal deletion rule now, such as:

* `null` in patch means “delete this override key”
* empty object does not delete
* arrays still replace fully

Without this, reverting to baseline may become awkward.

## 3. `actions` and `presenter.blocks` appear in merge semantics, but not in the stored payload example

The plan says:

* `actions`: replace full array
* `presenter.blocks`: replace full array

but the canonical payload example does not show where those live structurally. 

### Recommendation

Add them to the shape section explicitly, for example:

```json
"scenes": {
  "pd-02": {
    "title": "...",
    "advance": { "type": "manual" },
    "actions": [],
    "presenter": {
      "blocks": []
    }
  }
}
```

That avoids implementation drift.

## 4. `listDecks()` may not belong in the minimal repository boundary yet

The repository interface includes:

```js
class DeckRepository {
  async getEffectiveDeck(deckId) {}
  async saveDeckOverrides(deckId, patch) {}
  async listDecks() {}
}
```

But the rest of the plan does not actually define a remote list endpoint or deck discovery model. 

### Recommendation

Either:

* remove `listDecks()` from the minimal interface for now, or
* define whether it reads contracts, DB rows, or both

As written, it slightly overpromises scope.

## 5. Conflict resolution is fine, but the UX consequence is still vague

The plan says:

1. refetch latest
2. reapply patch
3. retry once
4. surface non-blocking warning if retry fails

That is reasonable. But one extra sentence would help:

* does the workspace keep the local unsaved intent visible?
* or does it snap to latest remote state?

### Recommendation

Specify that on failed retry:

* remote state remains authoritative
* unsaved local change is preserved in editor state until user retries or refreshes

That will matter during implementation.

---

# My current verdict

## This is now very close to implementation-ready

Compared to the previous version, this one is **significantly better**. It now has the right amount of precision in the places that matter most:

* runtime/shared ownership boundary
* precedence order
* link-only correctness
* override document shape
* server/client responsibilities
* migration guardrails

Those were the essential missing pieces, and they are now present. 

## What I would call “done enough to build”

I would approve this plan for implementation with only a few small clarifications:

* make `version` storage explicit in the DB design
* define deletion/reset semantics
* make `actions` / `presenter.blocks` explicit in the payload shape
* either trim or define `listDecks()`
* add one sentence on failed-conflict UX behavior

None of those change the architecture. They just reduce implementation ambiguity.

# Bottom line

This revision is **substantially stronger** than the last one. It has gone from “good direction” to “practical build plan.” The core design now looks sound. 

