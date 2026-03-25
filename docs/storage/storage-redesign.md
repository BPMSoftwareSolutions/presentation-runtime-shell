The current model is the wrong boundary.

Right now the app is explicitly documented as seeding decks from `/src/contracts/` and persisting all presentation data in browser `localStorage` under `prs_library`, while link-only mode loads a deck by `#/present/:id` and uses deck settings like `presentControlsPosition`. That means a setting change is effectively tied to one browser unless you republish or manually sync state.  

# Recommended redesign

## Split persistence into two classes

### 1. Deck-owned runtime data

This is shared across browsers and clients, and must live in an external store.

Examples:

* `settings.presentControlsPosition`
* playback defaults
* theme
* scene order
* scene titles
* presenter blocks
* `editIntent`
* scene `advance`
* any setting that should affect the client-facing `#/present/:id` player

### 2. Browser-owned authoring prefs

This stays in `localStorage`.

Examples:

* last selected scene
* split vs workspace layout
* inspector collapsed state
* local draft filters/search
* unsaved scratch UI state
* maybe local playback rehearsal prefs if they are explicitly personal and not deck-owned

That preserves the current fast UX benefits of local storage, but stops it from being the source of truth for shared presentation behavior.

---

# Exact precedence order

Use this order, from lowest to highest precedence:

1. **Code defaults**
   Hardcoded fallback values in the loader/runtime.

2. **Deck contract baseline**
   The JSON in `src/contracts/*.json` is the immutable baseline for a deck. Today those contracts define the initial `theme`, `settings`, and scenes. 

3. **Remote deck overrides**
   Shared runtime state from the external persistent store. This is where client-visible settings belong.
   This layer overrides contract values at runtime without requiring republish.

4. **Ephemeral URL/session overrides**
   Only if you intentionally support them later, such as query params for preview/testing.
   These should not be persisted.

5. **Local browser authoring prefs**
   Applied only to authoring chrome, never to deck-owned presentation behavior.
   This layer must not override deck settings like `presentControlsPosition`.

## Important rule

For **link-only mode** (`#/present/:id`), the effective deck must be:

`effectiveDeck = merge(contractBaseline, remoteDeckOverrides)`

and **must not merge browser localStorage deck settings** into client-visible output. That is the core fix. The shared player is supposed to respect deck settings like `presentControlsPosition`; today that intent exists, but local-only storage breaks the ownership model. 

---

# Data model

Keep this simple.

## Contract stays as baseline

Your existing contract files remain seed data and fallback content. They are still useful because the app already treats them as initial deck definitions. 

## Add a remote deck document/row per deck

Use one record per deck:

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
    "scenes": {
      "pd-02": {
        "title": "The Problem",
        "editIntent": "Show the painful status quo...",
        "advance": { "type": "manual" }
      }
    }
  }
}
```

## Keep local author prefs separate

```json
{
  "authorPrefs": {
    "lastSceneByDeck": {
      "msp-demo-deck": 3
    },
    "workspaceLayout": "split",
    "inspectorCollapsed": false
  }
}
```

Use a different key, for example:

* `prs_author_prefs`
* not `prs_library`

---

# Minimal implementation path on Replit

The shortest clean path is:

## Use Replit Database for shared deck data

Replit’s current built-in database is a managed SQL database exposed through `DATABASE_URL`, and Replit says it is the recommended production-ready persistent store inside the app workspace. ([Replit Docs][1])

## Do not use Replit App Storage for this

App Storage is for files and objects, not mutable deck settings. ([Replit Docs][2])

## If your deployment is static-only, switch

Replit Static Deployments are for static files; for an app that needs runtime save/load APIs, you want a backend-capable deployment rather than a pure static deployment. ([Replit Docs][3])

---

# Minimal server shape

Add a tiny API layer in the same Replit app.

## Endpoints

```text
GET  /api/decks/:deckId
PUT  /api/decks/:deckId
```

Optional:

```text
GET  /api/health
```

## SQL table

```sql
create table if not exists presentation_decks (
  deck_id text primary key,
  contract_version text null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
```

## Payload

Store the merged remote deck override document, or store only `overrides`.
For minimum change, I would store only `overrides` plus metadata.

---

# Frontend changes

## 1. Introduce a repository boundary

Right now `library-store.js` is tied to localStorage. The README describes it as presentation/scene CRUD + localStorage. Replace that direct dependency with an interface. 

```js
class DeckRepository {
  async getEffectiveDeck(deckId) {}
  async saveDeckOverrides(deckId, patch) {}
  async listDecks() {}
}
```

Then create:

* `LocalAuthorPrefsStore`
* `RemoteDeckRepository`

## 2. Load flow

On app open:

```js
const contractDeck = await loadContract(deckId);
const remoteOverrides = await remoteRepo.getDeckOverrides(deckId);
const effectiveDeck = mergeDeck(contractDeck, remoteOverrides);
runtime.load(effectiveDeck);
```

## 3. Save flow from inspector/editor

When a deck-owned setting changes:

```js
await remoteRepo.saveDeckOverrides(deckId, patch);
updateRuntimeWithMergedDeck();
```

When a browser-only authoring pref changes:

```js
localAuthorPrefs.set(...)
```

## 4. Link-only mode

For `#/present/:id`, skip local author prefs entirely except maybe inert UI prefs like muted tutorial banners. The player should only use:

```js
contract + remote overrides
```

That is the exact place where your client-facing settings become shared and immediate.

---

# Merge rules

Use deterministic merge behavior:

## Top-level

* `theme`: shallow merge
* `settings`: shallow merge
* `scenes`: merge by `scene.id`, not by array index
* `actions`, `presenter.blocks`: replace whole array unless you truly need patch semantics

## Why merge scenes by ID

Your contract already treats scene ids as stable identifiers. That makes them the correct unit for remote overrides. 

---

# What should move out of localStorage immediately

Move these first:

* `settings.presentControlsPosition`
* any field under `deck.settings`
* any field under `deck.theme`
* scene metadata edited in workspace
* presenter text blocks
* scene order / deck title

Keep these local:

* selected scene index in workspace
* expanded/collapsed rails
* last chosen preview mode
* purely personal convenience toggles

---

# Minimal code path

## Phase 1: smallest possible change

* Keep contract files exactly as they are
* Add Replit DB table
* Add `GET/PUT /api/decks/:id`
* Change load path to merge contract + remote
* Change save path for deck-owned fields to remote
* Leave author prefs in localStorage

This gets you runtime-shared persistence with minimal churn.

## Phase 2: stop storing full deck library in `prs_library`

Once phase 1 works, reduce `prs_library` to:

* cached deck list
* author prefs only
* maybe offline fallback cache

At that point localStorage becomes a convenience cache, not the truth source.

---

# Suggested folder additions

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

---

# Concrete behavior after redesign

## Today

You change `ps-controls` / `presentControlsPosition` in your browser.
Your browser sees it.
Your client’s `#/present/:id` may not, because the setting lives in your local storage. 

## After redesign

You change it in workspace.
App writes remote overrides.
Client reloads `#/present/:id`.
Link-only player loads contract baseline + remote overrides and immediately gets the new control position, with no republish. 

---

# One implementation detail to avoid

Do **not** make the remote store replace the contract wholesale on first pass.

That creates unnecessary migration pain.

Use:

* contract as baseline
* remote as override

That mirrors the same clean separation already implied elsewhere in your system: baseline data, then calculated/runtime state layered on top. 

---

# Bottom line

## The redesign

* **Contracts** = baseline
* **Remote DB** = shared deck-owned runtime persistence
* **localStorage** = browser-only authoring preferences

## Exact precedence

1. code defaults
2. contract baseline
3. remote shared overrides
4. optional URL/session overrides
5. local author prefs, but only for non-deck UI state

## Minimal Replit path

* add Replit Database
* add two API endpoints
* merge contract + remote on load
* save deck-owned settings remotely
* keep author prefs local only
