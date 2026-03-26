# Storage Redesign Implementation Plan

## Objective
Implement runtime-shared persistence for deck-owned presentation behavior so changes are visible to client-facing link-only presentations without republishing.

The system must separate:
- Deck-owned runtime data (shared across browsers and users)
- Browser-owned authoring preferences (local-only)

## Scope
This plan covers:
- Persistence boundary redesign
- Precedence model
- Minimal Replit runtime architecture
- Frontend/backend implementation phases
- Acceptance criteria and test coverage

This plan does not include:
- Full multi-user authorization model
- Real-time collaboration
- Non-Replit deployment topologies

## Required Precedence Order
Apply values from lowest to highest precedence:

1. Code defaults
2. Contract baseline from `src/contracts/*.json`
3. Remote shared deck overrides (runtime persistent store)
4. Optional ephemeral URL/session overrides (non-persistent)
5. Local author prefs (UI-only; must never override deck-owned behavior)

Invariant: local author prefs are never part of effective deck computation.

### Link-Only Rule
For `#/present/:id`, effective deck composition is:

`effectiveDeck = merge(contractBaseline, remoteDeckOverrides)`

Local browser deck state must not influence link-only behavior.

### Link-Only Remote Failure Behavior
For `#/present/:id`:
- If remote override fetch succeeds: use `merge(contractBaseline, remoteDeckOverrides)`
- If remote override fetch fails: use `contractBaseline` only
- Never fall back to browser-local deck state for client-visible behavior

## Persistence Boundary

### Deck-Owned Runtime Data (Remote)
Persist remotely at runtime:
- `deck.settings.*` including `presentControlsPosition`
- `deck.theme.*`
- scene order
- scene title
- scene `editIntent`
- scene `advance`
- presenter blocks
- any value affecting client-facing playback

### Browser-Owned Authoring Prefs (Local)
Persist in localStorage only:
- selected scene index
- workspace layout mode
- panel expand/collapse state
- local search/filter state
- purely personal convenience toggles

Use a dedicated key for prefs, for example:
- `prs_author_prefs`

Do not use `prs_library` as source of truth for deck-owned behavior.

## Minimal Replit Runtime Path

### Deployment Requirement
Use a backend-capable Replit deployment (not static-only), since runtime API write/read is required.

### Runtime Persistent Store
Use Replit Database (Postgres via `DATABASE_URL`) for shared deck override persistence.

### Minimal API Surface
- `GET /api/decks/:deckId`
- `PUT /api/decks/:deckId`
- Optional: `GET /api/health`

### SQL Schema
```sql
create table if not exists presentation_decks (
  deck_id text primary key,
  version bigint not null default 0,
  contract_version text null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
```

Versioning model:
- `version` is a first-class column (deck-level version)
- optimistic update uses `where deck_id = $1 and version = $2`
- successful write increments `version = version + 1` atomically

### Stored Payload Shape
Store only a remote override document keyed by deck id (not a full merged deck):

```json
{
  "deckId": "msp-demo-deck",
  "version": 12,
  "updatedAt": "2026-03-25T22:30:00Z",
  "updatedBy": "author",
  "overrides": {
    "theme": {
      "accent": "violet"
    },
    "settings": {
      "presentControlsPosition": "bottom",
      "playbackMode": "interactive",
      "typingSpeedMs": 20
    },
    "sceneOrder": ["pd-01", "pd-03", "pd-02"],
    "scenes": {
      "pd-02": {
        "title": "The Problem",
        "editIntent": "Show the painful status quo...",
        "advance": { "type": "manual" },
        "actions": [],
        "presenter": {
          "blocks": []
        }
      }
    }
  }
}
```

Notes:
- `overrides.scenes` is keyed by `scene.id`
- `overrides.sceneOrder` is the sole remote source for explicit scene ordering
- Contracts remain immutable baseline seed content

### API Contract (Strict)
`GET /api/decks/:deckId` returns:

```json
{
  "deckId": "msp-demo-deck",
  "version": 12,
  "updatedAt": "2026-03-25T22:30:00Z",
  "overrides": {
    "settings": {},
    "theme": {},
    "sceneOrder": [],
    "scenes": {}
  }
}
```

`PUT /api/decks/:deckId` accepts:

```json
{
  "expectedVersion": 12,
  "patch": {
    "settings": {
      "presentControlsPosition": "bottom"
    }
  },
  "updatedBy": "author"
}
```

Server responsibilities:
- Read current override document
- Merge patch into `overrides`
- Increment deck-level `version` atomically
- Persist and return updated document

Deletion/reset semantics:
- `null` in patch deletes override key at that path (reverts to baseline behavior)
- empty object `{}` does not delete
- arrays still replace full value

## Merge Semantics
Use deterministic merge semantics:
- `theme`: shallow merge
- `settings`: shallow merge
- `sceneOrder`: replace full array when present
- `scenes`: merge by `scene.id`, not array index
- `actions`: replace full array
- `presenter.blocks`: replace full array

Rationale:
- Scene ids are stable identifiers and should be the patch anchor.
- Array patch semantics are deferred for simplicity.
- Scene order is represented explicitly via `overrides.sceneOrder`.

## Frontend Design Changes

### Repository Boundary
Introduce a persistence interface boundary:

```js
class DeckRepository {
  async getEffectiveDeck(deckId) {}
  async saveDeckOverrides(deckId, patch) {}
}
```

Data model separation is strict:
- `DeckOverrides` schema: remote-only deck-owned runtime state
- `AuthorPrefs` schema: local-only browser preferences
- No shared write helper should write both domains

Implement:
- `RemoteDeckRepository` for runtime shared deck data
- `LocalAuthorPrefsStore` for browser-only author prefs
- `mergeDeck` utility for deterministic merge

### Load Flow
On app load:
1. Load contract baseline
2. Fetch remote overrides
3. Merge baseline + remote overrides
4. Load effective deck into runtime

Pseudo-flow:
```js
const contractDeck = await loadContract(deckId);
const remoteOverrides = await remoteRepo.getDeckOverrides(deckId);
const effectiveDeck = mergeDeck(contractDeck, remoteOverrides);
runtime.load(effectiveDeck);
```

### Save Flow
When deck-owned fields change in workspace/inspector:
1. Emit override patch
2. Persist patch via remote API
3. Recompute effective deck state
4. Update runtime/UI

When browser-owned prefs change:
- Write only to `LocalAuthorPrefsStore`

Server owns patch merge and version increment; clients submit patches only.

### Link-Only Mode
For `#/present/:id`:
- Ignore local author prefs except inert UI niceties
- Use only contract baseline + remote overrides

## Minimal Migration Plan

### Phase 0: Guardrails and Flag
- Add feature flag: `PERSISTENCE_MODE=local|remote_hybrid`
- Add runtime logging around deck load/save source

### Phase 1: Read Path Migration
- Introduce merge utility and remote repository
- Load contract + remote overrides for effective deck
- Keep existing local behavior as fallback for authoring UI only

Migration invariant:
- `prs_library` is legacy/cache and must not be authoritative for deck-owned fields

### Phase 2: Write Path Migration
- Route deck-owned writes to remote `PUT /api/decks/:id`
- Restrict localStorage writes to author prefs

### Phase 3: Link-Only Hardening
- Enforce no local deck override usage in link-only player
- Add regression checks for `presentControlsPosition`
- Add runtime assertion/logging if link-only load path attempts local deck merge

### Phase 4: Local Storage Narrowing
- Reduce `prs_library` to cache/prefs/offline fallback only
- Move authoring-only values to `prs_author_prefs`

## Suggested File Additions

```text
src/
  core/
    deck-repository.js
    remote-deck-repository.js
    local-author-prefs.js
    merge-deck.js
server/
  index.js
  routes/
    decks.js
  db/
    schema.sql
```

## Suggested Existing File Changes
- `src/main.js`: load contract + remote merge path
- `src/core/library-store.js`: remove deck truth ownership
- `src/screens/present.js`: enforce contract+remote only
- `src/screens/workspace.js`: deck-owned saves to remote
- `src/ui/inspector-panel.js`: emit deck-owned patches
- `README.md`: update persistence architecture docs

## Conflict Handling
Use optimistic concurrency:
- Include `expectedVersion` in `PUT`
- Versioning is deck-level (single integer per override document)
- On conflict:
  1. Refetch latest remote doc
  2. Reapply patch
  3. Retry once
  4. Surface non-blocking warning if retry fails

UX behavior when retry fails:
- remote state remains authoritative
- preserve unsaved local editor intent in UI state
- present a non-blocking warning with explicit retry action
- do not silently overwrite in-editor values

## Security and Operations (Minimal)
- Protect write endpoint with basic token/header for initial rollout
- Store `updatedBy` metadata when available
- Add `GET /api/health` for deployment checks
- Log deck read/write outcomes and response times

## Acceptance Criteria
1. Updating `presentControlsPosition` in workspace persists remotely at runtime.
2. Client reloading public `#/present/:id` sees updated controls position without republish.
3. Clearing browser localStorage does not change client-facing link-only behavior.
4. Two separate browsers resolve the same deck-owned settings.
5. Authoring prefs remain per-browser and do not leak into client playback.
6. Remote outage in link-only mode falls back to contract baseline only and never browser-local deck state.

## Test Plan

### Unit
- Merge precedence order correctness
- Scene merge-by-id behavior
- Array replacement semantics

### Integration
- `GET /api/decks/:id` happy path
- `PUT /api/decks/:id` happy path
- version conflict path

### End-to-End
- Author updates deck setting -> client link reflects on reload
- Link-only mode ignores local deck storage
- Local author prefs remain local across browsers

## Risks and Mitigations
- Risk: static deployment cannot host runtime API
  - Mitigation: move to backend-capable Replit deployment
- Risk: local deck values accidentally override shared deck in link-only mode
  - Mitigation: explicit link-only guard + tests
- Risk: scene merge drift
  - Mitigation: centralized merge utility + unit tests

## Execution Checklist
- [ ] Add backend service skeleton and DB schema
- [ ] Implement `GET/PUT /api/decks/:deckId`
- [ ] Implement `remote-deck-repository` and `merge-deck`
- [ ] Refactor load path in `main.js`
- [ ] Refactor save path in workspace/inspector
- [ ] Add `LocalAuthorPrefsStore`
- [ ] Harden link-only mode merge source
- [ ] Update docs and operational runbook
- [ ] Validate acceptance criteria in Replit public deployment
