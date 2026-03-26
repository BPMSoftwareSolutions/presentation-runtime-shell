# Magic-Link Configuration — Implementation Plan

This plan targets the URL-embedded config approach from `overview.md` (Option B: encoded config blob).
No remote storage, no new endpoints. The invariant is strict: **local browser state must never
affect client-visible link-only playback**.

---

## Scope

Five discrete pieces, each independently testable:

1. URL config parser (`readMagicLinkConfig`)
2. Safe merge utility (`mergeDeck`)
3. Updated present-mode boot flow
4. Share-link generator in Workspace
5. Strict isolation of author prefs from link config

---

## Current state baseline

| Concern | Where it lives today |
|---|---|
| Routing | `src/core/router.js` — hash-only, no query string handling |
| Present-mode entry | `src/main.js:8-19` — `parsePresentId()` extracts only the `:id` segment |
| Present-mode boot | `src/main.js:21-60` — `bootPresentMode(id, store)` loads from `prs_library` localStorage |
| Deck defaults | `src/core/library-store.js:10-24` — `DEFAULT_SETTINGS`, `DEFAULT_THEME` |
| Contract loading | `src/core/contract-loader.js:40-50` — `loadContract(url)` + `normalizeContract` |
| Settings merge | `src/ui/inspector-panel.js:262-266` — shallow merge into store |
| Share-link build | `src/screens/workspace.js:30`, `src/screens/library.js:23` — bare `#/present/:id` |

---

## Execution order

The phases below push hardening work earlier so correctness is established before the boot
flow or workspace UI depends on it.

| Phase | Work |
|---|---|
| 1 | `magic-link.js` — UTF-8 encode/decode helpers, sanitizer with full value validation, merge, builder |
| 2 | `main.js` — new `parsePresentId`, contract-first boot, gated fallback |
| 3 | `workspace.js` — magic link generation, URL length warning |
| 4 | Verification — confirm present mode has no inspector/store coupling |

---

## Step 1 — URL config parser

**New file:** `src/core/magic-link.js`

### What it does

Reads the query string portion of the hash fragment (e.g. `#/present/msp-demo-deck?cfg=...`)
and decodes it into a plain config object.

### URL format

```
#/present/{deckId}?cfg={BASE64URL_JSON}
```

The `cfg` value is the UTF-8 JSON payload encoded as base64url: `+` → `-`, `/` → `_`,
trailing `=` stripped. Padding is restored on decode.

### Payload schema

```json
{
  "settings": {
    "presentControlsPosition": "bottom",
    "playbackMode": "interactive",
    "typingSpeedMs": 20,
    "betweenScenesMs": 1800,
    "autoAdvance": false,
    "startDelayMs": 0,
    "endCardDurationMs": 0
  },
  "theme": {
    "accent": "violet",
    "shell": "dark",
    "presenterPosition": "left"
  },
  "demo": {
    "tenant": "Beta Retail",
    "incidentId": "INV-2024-0312",
    "scenario": "outage-response",
    "filterPreset": "tier-1"
  }
}
```

All top-level keys are optional. Unknown keys are dropped. Invalid values for known
keys are also dropped. **If a payload contains both valid and invalid keys, the valid
subset is kept and the rest is silently dropped. The parser never returns a partial
error — it either returns a sanitized config object or `null`.**

### Encoding helpers

`btoa` / `atob` operate on binary strings and fail for multi-byte Unicode characters.
All encode/decode operations use `TextEncoder` / `TextDecoder` to be safe for non-ASCII
values such as Unicode tenant names.

```js
// src/core/magic-link.js

function encodePayload(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodePayload(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}
```

### Allowed keys and value validators

```js
// --- Settings ---------------------------------------------------------------

const SETTINGS_VALIDATORS = {
  presentControlsPosition: (v) => ["top", "bottom"].includes(v),
  playbackMode:            (v) => ["interactive", "autoplay", "capture"].includes(v),
  typingSpeedMs:           (v) => Number.isFinite(v) && v >= 0,
  betweenScenesMs:         (v) => Number.isFinite(v) && v >= 0,
  autoAdvance:             (v) => typeof v === "boolean",
  startDelayMs:            (v) => Number.isFinite(v) && v >= 0,
  endCardDurationMs:       (v) => Number.isFinite(v) && v >= 0,
  waitForIframeReadyTimeoutMs: (v) => Number.isFinite(v) && v > 0,
};

// --- Theme ------------------------------------------------------------------

const THEME_VALIDATORS = {
  accent:            (v) => typeof v === "string" && v.length > 0,
  shell:             (v) => ["dark", "light"].includes(v),
  presenterPosition: (v) => ["left", "right"].includes(v),
};

// --- Demo -------------------------------------------------------------------
// `filterPreset` is a scalar string token. If filter state needs structure
// in the future, introduce a new key rather than changing this type.

const DEMO_VALIDATORS = {
  tenant:       (v) => typeof v === "string" && v.length > 0,
  incidentId:   (v) => typeof v === "string" && v.length > 0,
  scenario:     (v) => typeof v === "string" && v.length > 0,
  filterPreset: (v) => typeof v === "string" && v.length > 0,
};
```

### Sanitizer

```js
function sanitize(parsed) {
  const out = {};

  if (parsed.settings && typeof parsed.settings === "object") {
    const entries = Object.entries(parsed.settings)
      .filter(([k, v]) => k in SETTINGS_VALIDATORS && SETTINGS_VALIDATORS[k](v));
    if (entries.length) out.settings = Object.fromEntries(entries);
  }

  if (parsed.theme && typeof parsed.theme === "object") {
    const entries = Object.entries(parsed.theme)
      .filter(([k, v]) => k in THEME_VALIDATORS && THEME_VALIDATORS[k](v));
    if (entries.length) out.theme = Object.fromEntries(entries);
  }

  if (parsed.demo && typeof parsed.demo === "object") {
    const entries = Object.entries(parsed.demo)
      .filter(([k, v]) => k in DEMO_VALIDATORS && DEMO_VALIDATORS[k](v));
    if (entries.length) out.demo = Object.fromEntries(entries);
  }

  return out;
}
```

### Parser

```js
export function readMagicLinkConfig(hash) {
  // hash is the full window.location.hash, e.g. "#/present/foo?cfg=..."
  const qIndex = hash.indexOf("?");
  if (qIndex === -1) return null;

  const params = new URLSearchParams(hash.slice(qIndex + 1));
  const raw = params.get("cfg");
  if (!raw) return null;

  try {
    const parsed = decodePayload(raw);
    return sanitize(parsed);
  } catch {
    return null;   // malformed — fall back to contract baseline
  }
}
```

**Tests to write:**
- Returns `null` when no `?cfg=` param is present
- Returns `null` on malformed base64
- Returns `null` on valid base64 but invalid JSON
- Handles base64 strings that require padding restoration (payload lengths of 1, 2, 3 mod 4)
- Drops unknown settings keys; keeps known valid ones (partial payload test)
- Drops settings keys with wrong value types (`typingSpeedMs: "fast"` → dropped)
- Drops settings keys with out-of-range enum values (`playbackMode: "sideways"` → dropped)
- Keeps settings keys with valid values
- Drops unknown theme keys
- Drops theme values that fail validation (`shell: "banana"` → dropped)
- Keeps theme keys with valid values
- Drops unknown demo keys
- Drops demo keys with non-string values
- Keeps known demo keys with valid string values
- Unicode values in `demo.tenant` round-trip correctly through encode/decode
- Handles hash with no query string
- `parsePresentId("#/present/foo?cfg=...")` returns `id === "foo"`
- `parsePresentId("#/present/foo/bar")` returns `null`

---

## Step 2 — Safe merge utility

**Add to:** `src/core/magic-link.js`

### What it does

Merges the contract baseline with URL overrides using the precedence from `overview.md`:

```
effectiveDeck = merge(contractBaseline, urlOverrides)
```

Contract baseline is the normalized output of `loadContract` / `normalizeContract`
(already merges code defaults → contract JSON).

`demoOverrides` is returned separately from the deck so the deck shape stays clean
and there is no risk of accidental persistence.

**`mergeDeck` always returns a fresh object** — even when there are no URL overrides —
so downstream code cannot accidentally mutate the original contract deck in-place.

```js
// src/core/magic-link.js (continued)

export function mergeDeck(contractDeck, urlOverrides) {
  if (!urlOverrides) {
    return {
      deck: {
        ...contractDeck,
        settings: { ...(contractDeck.settings || {}) },
        theme:    { ...(contractDeck.theme    || {}) },
      },
      demoOverrides: null,
    };
  }

  return {
    deck: {
      ...contractDeck,
      settings: {
        ...contractDeck.settings,
        ...(urlOverrides.settings || {}),
      },
      theme: {
        ...contractDeck.theme,
        ...(urlOverrides.theme || {}),
      },
    },
    demoOverrides: urlOverrides.demo || null,
  };
}
```

The caller destructures the result:

```js
const { deck, demoOverrides } = mergeDeck(contractDeck, urlOverrides);
const runtime = createDeckRuntime(deck, { demoOverrides, ...otherDeps });
```

`demoOverrides` is a plain object (or `null`). It is never merged onto the deck and
never touches the store or localStorage.

**Tests to write:**
- Returns a fresh deck object even when `urlOverrides` is `null` (not the same reference)
- `mergeDeck` does not mutate `contractDeck`
- `demoOverrides` is `null` when `urlOverrides` is `null`
- Settings from URL override matching contract settings
- Settings absent from URL keep contract value
- Theme from URL overrides matching contract theme
- `demoOverrides` is populated when `demo` key is present
- `demoOverrides` is `null` when `demo` key is absent
- Returned `deck` object has no extra properties beyond the contract shape

---

## Step 3 — Updated present-mode boot flow

**File:** `src/main.js`

### Current flow (`bootPresentMode`, lines 21-60)

1. Parse `:id` from hash
2. Look up deck in localStorage (`prs_library`)
3. If not found, load contract from `./src/contracts/{id}.json`
4. Load into runtime

### New flow

```
parsePresentId(hash)                  → { id, rawHash }
readMagicLinkConfig(rawHash)          → urlOverrides | null
loadContract(contractUrl)             → contractDeck
mergeDeck(contractDeck, urlOverrides) → { deck, demoOverrides }
createDeckRuntime(deck, { demoOverrides })
runtime.start()
```

localStorage is **not consulted** in present mode. The effective deck is
assembled entirely from the contract file plus URL overrides.

### Changes to `parsePresentId` (main.js:8-19)

The current regex `^#\/present\/([^/?#]+)$` rejects hashes that include a query
string. Update it to accept an optional query string and return the full raw hash:

```js
function parsePresentId(hash) {
  // Accept optional query string after the id segment
  const m = hash.match(/^#\/present\/([^/?#]+)/);
  if (!m) return null;
  const id = decodeURIComponent(m[1]);
  if (!id || id.includes("/")) return null;
  return { id, rawHash: hash };
}
```

### Changes to `bootPresentMode` (main.js:21-60)

```js
// ALLOW_PRESENT_LOCAL_FALLBACK defaults to false.
// Enable only temporarily during rollout if a contract file is missing for a known deck.
// Remove this flag and its branch once contract coverage is complete.
const ALLOW_PRESENT_LOCAL_FALLBACK = false;

async function bootPresentMode({ id, rawHash }, store) {
  const contractUrl = `./src/contracts/${encodeURIComponent(id)}.json`;
  let contractDeck;
  try {
    contractDeck = await loadContract(contractUrl);
  } catch {
    if (ALLOW_PRESENT_LOCAL_FALLBACK) {
      contractDeck = store.getById(id);
    }
  }

  if (!contractDeck) {
    // render not-found state
    return;
  }

  const urlOverrides = readMagicLinkConfig(rawHash);
  const { deck, demoOverrides } = mergeDeck(contractDeck, urlOverrides);

  const runtime = createDeckRuntime(deck, { demoOverrides, /* ...other deps */ });
  await runtime.start();
}
```

> **Fallback usage:** set `ALLOW_PRESENT_LOCAL_FALLBACK = true` only if a specific deck
> has no contract file yet and must remain presentable during rollout. Turn it back to
> `false` once all decks have contracts. Delete the flag and fallback branch at that point.

**Call-site change** (main.js:84):

```js
// Before
const presentId = parsePresentId(location.hash);
if (presentId) {
  await bootPresentMode(presentId, store);
}

// After
const presentTarget = parsePresentId(location.hash);
if (presentTarget) {
  await bootPresentMode(presentTarget, store);
}
```

---

## Step 4 — Share-link generator in Workspace

**File:** `src/screens/workspace.js`

### What it does

Replaces the bare `#/present/:id` link with one that encodes the current shareable
settings into `?cfg=`. If no shareable overrides exist, returns a plain `#/present/:id`
link with no `?cfg=` param.

### API

`buildMagicLink` takes explicit shareable inputs rather than the whole deck object.
This keeps the shareable surface explicit and prevents accidental coupling to
unrelated deck fields in the future.

```js
// src/core/magic-link.js (continued)

const SHAREABLE_SETTINGS = new Set([
  "presentControlsPosition", "playbackMode", "typingSpeedMs",
  "betweenScenesMs", "autoAdvance", "startDelayMs", "endCardDurationMs",
]);

const SHAREABLE_THEME = new Set(["accent", "shell", "presenterPosition"]);

const MAGIC_LINK_WARN_LENGTH = 1800;

/**
 * @param {string} baseUrl  - e.g. `${location.origin}${location.pathname}`
 * @param {string} deckId
 * @param {{ settings?: object, theme?: object, demoOverrides?: object | null }} shareableConfig
 */
export function buildMagicLink(baseUrl, deckId, shareableConfig = {}) {
  const { settings = {}, theme = {}, demoOverrides = null } = shareableConfig;
  const payload = {};

  const filteredSettings = Object.fromEntries(
    Object.entries(settings).filter(([k]) => SHAREABLE_SETTINGS.has(k))
  );
  if (Object.keys(filteredSettings).length) payload.settings = filteredSettings;

  const filteredTheme = Object.fromEntries(
    Object.entries(theme).filter(([k]) => SHAREABLE_THEME.has(k))
  );
  if (Object.keys(filteredTheme).length) payload.theme = filteredTheme;

  if (demoOverrides && Object.keys(demoOverrides).length) {
    payload.demo = demoOverrides;
  }

  const base = `${baseUrl}#/present/${encodeURIComponent(deckId)}`;

  // Return a plain link when there are no shareable overrides
  if (!Object.keys(payload).length) return base;

  const link = `${base}?cfg=${encodePayload(payload)}`;

  if (link.length > MAGIC_LINK_WARN_LENGTH) {
    console.warn(
      `Magic link for "${deckId}" is ${link.length} chars (threshold: ${MAGIC_LINK_WARN_LENGTH}). ` +
      "Consider enabling compressed links (Option C) or reducing payload."
    );
  }

  return link;
}
```

### Workspace integration

Current share-link button (workspace.js:30):

```js
`${location.origin}${location.pathname}#/present/${encodeURIComponent(id)}`
```

Replace with:

```js
import { buildMagicLink } from "../core/magic-link.js";

const deck = store.getById(id);
const base = `${location.origin}${location.pathname}`;
const link = buildMagicLink(base, id, {
  settings: deck.settings,
  theme: deck.theme,
  // demoOverrides: pass if demo state should be included in the link
});
```

**Tests to write:**
- Round-trip: `readMagicLinkConfig(new URL(buildMagicLink(...)).hash)` returns the same settings
- Author-only keys are not present in the generated link
- Empty `shareableConfig` returns plain `#/present/:id` with no `?cfg=` param
- Payload with only settings omits `theme` key from encoded JSON
- `console.warn` fires when generated URL exceeds `MAGIC_LINK_WARN_LENGTH`
- `buildMagicLink` output omits `cfg` when every settings/theme value is filtered out
- Unicode tenant name in `demoOverrides` round-trips correctly

---

## Step 5 — Author pref isolation

No new code beyond the enforcement in steps 1–4. The following points must be
verified before marking this step done.

### 5a. `bootPresentMode` must not read `prs_library` as the primary path

Covered in step 3. The new flow only reaches `store.getById` through the explicitly
gated fallback, which defaults to `false`.

### 5b. Inspector panel must not affect link-only playback

The inspector panel (`src/ui/inspector-panel.js:262-266`) writes partial settings
back to the store and `prs_library`. This is correct for workspace use. Present mode
must not mount the inspector panel or subscribe to the store for settings.

Verify that `src/screens/present.js` does not import `inspector-panel.js` and does
not call `store.getById` at any point during playback. It should use only the `deck`
object built at boot time.

### 5c. `voice-over.js` localStorage keys are out of scope

`aps.voice.enabled` and `openai-voice-over-key` are device-level author prefs that
live outside `prs_library` and are not part of the magic link payload. No change needed.

---

## Precedence table (final)

| Layer | Source | Scope |
|---|---|---|
| 1. Code defaults | `DEFAULT_SETTINGS`, `DEFAULT_THEME` in `library-store.js` | always |
| 2. Contract baseline | `src/contracts/{id}.json` | deck-specific |
| 3. URL overrides | `?cfg=` param | link-only playback |
| 4. Author prefs | inspector-panel → localStorage | workspace only, never leaks to link |

---

## File change summary

| File | Change |
|---|---|
| `src/core/magic-link.js` | **New** — UTF-8 encode/decode helpers, parser, sanitizer, merge, builder |
| `src/main.js` | Update `parsePresentId` regex; contract-first boot with off-by-default fallback |
| `src/screens/workspace.js` | Replace bare present link with `buildMagicLink(...)` |
| `src/core/contract-loader.js` | No change |
| `src/core/library-store.js` | No change |
| `src/core/router.js` | No change |

---

## Out of scope

- Compressed blob (Option C) — add only if `MAGIC_LINK_WARN_LENGTH` warning fires in real use
- Remote storage — not needed per `overview.md`
- Wiring `demoOverrides` keys into runtime tenant/scenario selection — that is a runtime
  concern beyond this plan; `demoOverrides` is the defined hook point
