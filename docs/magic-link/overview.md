Your current plan is solving **shared mutable runtime state**, but your actual use case is **send a client a link that opens with the right presentation behavior already baked in**. For that, storage is usually unnecessary. The remote-store design in the plan is aimed at making link-only presentations reflect later edits without republishing, which is a different problem. 

## Better model for this use case

For a client-facing magic link, use:

1. **contract baseline**
2. **URL-embedded presentation config**
3. **local author prefs for workspace only**

That means link-only mode becomes:

```text
effectiveDeck = merge(contractBaseline, urlOverrides)
```

instead of the storage-based version from the current plan. The current README says link-only mode is `#/present/:id` and the app today persists deck data in browser localStorage under `prs_library`, which is exactly the behavior you want to avoid for client-visible configuration. 

## Why this is the right move

### What you actually need

When you send:

```text
#/present/msp-demo-deck?...config...
```

the client should open that deck with the exact playback settings, control placement, theme tweaks, scene order, or scenario state you want.

### What you do **not** need

You do not need:

* a database
* deck versioning
* optimistic concurrency
* remote patch merge
* runtime GET/PUT endpoints

Those only matter when the same deck must keep changing centrally after the link has already been shared. That is the storage plan’s real purpose. 

## Recommended split

### Keep in the magic link

Anything that should travel with the shared presentation instance:

* `settings.presentControlsPosition`
* playback mode
* typing speed
* theme accent
* selected tenant / scenario / filters
* optional scene order
* any demo-state that should open exactly as sent

### Keep out of the magic link

Things that are purely author-side convenience:

* selected scene in workspace
* panel layout
* collapsed sections
* search filters
* anything in local author prefs

## Practical implementation

## Option A: Plain query params

Best when config is small.

```text
#/present/msp-demo-deck?controls=bottom&mode=interactive&tenant=beta
```

Good for:

* simple settings
* readable debugging
* easy manual editing

## Option B: Encoded config blob

Best when config is richer.

```text
#/present/msp-demo-deck?cfg=BASE64URL_ENCODED_JSON
```

Example decoded payload:

```json
{
  "settings": {
    "presentControlsPosition": "bottom",
    "playbackMode": "interactive",
    "typingSpeedMs": 20
  },
  "theme": {
    "accent": "violet"
  },
  "demo": {
    "tenant": "Beta Retail",
    "incidentId": "INV-2024-0312"
  }
}
```

This is probably your sweet spot.

## Option C: Compressed blob

Use this only if links get long.

```text
#/present/msp-demo-deck?cfgz=...
```

That is just Option B plus compression.

## New precedence rule

Replace the storage-oriented precedence from the redesign doc with this for link sharing:

1. code defaults
2. contract baseline
3. URL magic-link overrides
4. local author prefs for workspace-only UI

And keep this invariant:

> local browser state must never affect client-visible link-only playback

That invariant is still excellent from the current plan; it just points to URL overrides instead of remote storage for your real use case. 

## When storage is still worth it

Use storage only if you need one of these:

* you send one stable link and want its behavior to change later without generating a new link
* multiple people need to edit/share the same presentation state
* the config becomes too large or sensitive for a URL
* you need audit/version history

If none of that is true, the URL is the simpler and more correct design.

## Suggested minimal refactor

### Link-only load flow

```js
const contractDeck = await loadContract(deckId);
const urlOverrides = readMagicLinkConfig(location.hash || location.search);
const effectiveDeck = mergeDeck(contractDeck, urlOverrides);
runtime.load(effectiveDeck);
```

### Authoring flow

In workspace:

* edit the deck
* generate a magic link from the current effective shareable config
* send that link

No remote persistence required.

## Best next step

I would rewrite the current implementation plan into a much smaller **magic-link configuration plan**:

* parser for URL overrides
* safe merge utility
* share-link generator in workspace
* strict separation between author prefs and link-only config
* fallback to contract baseline if URL config is missing/invalid
