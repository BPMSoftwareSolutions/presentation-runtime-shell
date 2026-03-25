Right now the shell persists presentation data in **browser localStorage** under `prs_library`, and seeded decks are only created if they do not already exist. That means changes to presentation settings are effectively tied to the specific browser profile unless you explicitly export or sync them some other way.  

## What’s happening

For things like **ps-controls** in **link-only mode**, you’re updating runtime or deck settings in a store that is local to the browser session. In practice, that gives you:

* no cross-browser persistence
* no shareable canonical config
* no environment-level defaults
* no reliable “this presentation always opens with these settings” behavior

So your complaint is exactly right: **presentation behavior is being treated like a local preference instead of deck-level persisted state**. 

## Better persistence model

The cleanest fix is to split persistence into **three layers**:

### 1. Deck contract defaults

These live with the deck itself and travel with the presentation.

Examples:

* `playbackMode`
* `presentControlsPosition`
* `linkOnlyDefaults`
* `psControls`
* `startDelayMs`
* `endCardDurationMs`

This makes link-only behavior part of the presentation’s identity, not the viewer’s browser.

### 2. User authoring preferences

These stay in localStorage.

Examples:

* split view vs workspace
* inspector collapsed state
* last opened deck
* preferred typing speed while editing

These are truly personal and browser-local.

### 3. Shared persisted deck state

This should live outside localStorage if you want real persistence across machines.

Options:

* JSON file checked into the project
* saved deck export/import
* backend API
* Google Drive / file-based storage
* synced document store

## Recommended direction

For your use case, I’d treat **link-only presentation settings as deck metadata**.

Something like:

```json
{
  "id": "my-deck",
  "title": "My Presentation",
  "settings": {
    "typingSpeedMs": 22,
    "playbackMode": "interactive",
    "betweenScenesMs": 1800
  },
  "present": {
    "controlsPosition": "bottom",
    "controlsMode": "minimal",
    "psControls": {
      "showFirstLast": true,
      "showPrevNext": true,
      "showSceneTitle": true,
      "autoHideMs": 3000
    }
  }
}
```

That way:

* opening `#/present/:id` always uses the same deck-defined behavior
* the presentation link becomes predictable
* settings are no longer trapped in one browser

## Minimal implementation path

A good incremental fix would be:

1. **Add deck-level link-only settings** to the contract/schema.
2. **Load them into the runtime** when `#/present/:id` opens.
3. Keep localStorage only as a fallback override for personal editor preferences.
4. Add **Export / Save Deck** so changes can be persisted somewhere shareable.

## Architectural rule of thumb

Use this distinction:

* **“How I like to work”** → localStorage
* **“How this deck should present”** → deck persistence
* **“How this deck is shared across devices/users”** → external/shared storage

That keeps the model clean and avoids accidental complexity around “why did this presentation look different on another machine.” 

## Bottom line

You’re hitting a design boundary in the current shell: it was built around **browser-local persistence**, but link-only mode settings really need to become **deck-owned persisted configuration**, not local session state. 
