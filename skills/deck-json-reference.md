# Skill: Deck JSON Reference

Complete reference for the presentation contract JSON format. Files live in `src/contracts/` and are seeded into the store on first load.

---

## Top-Level Structure

```json
{
  "id": "my-deck",
  "title": "My Presentation",
  "status": "draft",
  "theme": { ... },
  "settings": { ... },
  "scenes": [ ... ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique identifier. Used as the localStorage key. Use a stable slug — changing it creates a duplicate. |
| `title` | string | ✓ | Display name shown in library and workspace. |
| `status` | `"draft"` \| `"ready"` \| `"archived"` | — | Default: `"draft"`. `"ready"` shows a green badge in the library. |
| `theme` | object | — | Visual theme settings (see below). |
| `settings` | object | — | Playback defaults (see below). |
| `scenes` | array | ✓ | Ordered list of scene objects (see below). |

---

## `theme`

```json
"theme": {
  "shell": "dark",
  "accent": "violet",
  "presenterPosition": "left"
}
```

| Field | Options | Default | Description |
|-------|---------|---------|-------------|
| `shell` | `"dark"` \| `"light"` | `"dark"` | Shell chrome colour scheme. |
| `accent` | string | `"violet"` | Accent colour name (reserved for future theming). |
| `presenterPosition` | `"left"` \| `"right"` | `"left"` | Side the narrator panel appears on (reserved). |

---

## `settings`

```json
"settings": {
  "typingSpeedMs": 22,
  "playbackMode": "interactive",
  "betweenScenesMs": 1800,
  "waitForIframeReadyTimeoutMs": 8000,
  "startDelayMs": 0,
  "endCardDurationMs": 0
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `typingSpeedMs` | number | `24` | Milliseconds per character. Lower = faster. `16–22` for video, `22–28` for live. |
| `playbackMode` | `"interactive"` \| `"autoplay"` \| `"capture"` | `"interactive"` | Default playback mode. Can be overridden at runtime in the inspector. |
| `betweenScenesMs` | number | `1800` | Auto-advance delay used in `autoplay` and `capture` modes, and for scenes with `advance.type: "auto"`. |
| `waitForIframeReadyTimeoutMs` | number | `8000` | How long to wait for an `iframe:ready` event before giving up and continuing. |
| `startDelayMs` | number | `0` | Pause before the first scene. Useful when recording — gives time to position the recorder. |
| `endCardDurationMs` | number | `0` | Hold the last scene for N ms before the runtime marks itself complete. |

---

## Scene Object

```json
{
  "id": "scene-unique-id",
  "title": "Scene Title",
  "type": "narrative",
  "editIntent": "What this scene should accomplish.",
  "presenter": { ... },
  "content": { ... },
  "actions": [ ... ],
  "advance": { ... }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique across all decks. Namespace with deck prefix: `my-deck-01`. |
| `title` | string | ✓ | Shown in scene list and workspace header. |
| `type` | string | — | Metadata label. `"narrative"` \| `"chart"` \| `"framework"` \| `"timeline"` \| `"closing"` \| `"title"`. |
| `editIntent` | string | — | AI regeneration prompt. Describe what the scene should show and why. |
| `presenter` | object | — | Narrator script (see below). |
| `content` | object | — | iframe route and loading behaviour (see below). |
| `actions` | array | — | Commands to send to the iframe before narration starts (see below). |
| `advance` | object | — | Condition that ends the scene (see below). Default: `{ "type": "manual" }`. |

---

## `presenter`

```json
"presenter": {
  "mode": "thinking",
  "blocks": [
    { "text": "First sentence.", "pauseMs": 700 },
    { "text": " Second sentence.", "pauseMs": 0 }
  ]
}
```

| Field | Options | Description |
|-------|---------|-------------|
| `mode` | `"thinking"` \| `"reveal"` \| `"impact"` | Semantic mode. `thinking` = exploratory. `reveal` = building to insight. `impact` = landing the point. |
| `blocks` | array | Ordered list of text segments typed in sequence. |

**Block fields:**

| Field | Type | Description |
|-------|------|-------------|
| `text` | string | Text to type. Include a leading space if this continues from the previous block. |
| `pauseMs` | number | Milliseconds to wait **after** this block finishes typing before starting the next. |

---

## `content`

```json
"content": {
  "route": "./src/generated/my-deck/scene-01/index.html",
  "waitForReady": false,
  "reloadOnEnter": false
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `route` | string | `""` | Path to the scene HTML file. Relative to `index.html`. |
| `waitForReady` | boolean | `false` | If `true`, the runtime waits for the iframe to post `{ type: "iframe:ready" }` before starting narration. Use when the scene has a heavy initialisation step. |
| `reloadOnEnter` | boolean | `false` | If `true`, the iframe is force-reloaded each time the scene is entered. Useful for scenes with non-resettable animations. |

---

## `actions`

Actions run **before** narrator typing starts. Use them to pass data into the scene.

```json
"actions": [
  {
    "type": "postMessage",
    "event": "scenario:set",
    "payload": { "mode": "high-risk", "value": 42 }
  },
  {
    "type": "delay",
    "ms": 300
  }
]
```

| `type` | Fields | Description |
|--------|--------|-------------|
| `postMessage` | `event`, `payload` | Posts `{ type: event, ...payload }` to the iframe via `window.postMessage`. |
| `delay` | `ms` | Waits N milliseconds before running the next action. |

The scene receives postMessage actions like this:
```js
window.addEventListener("message", (e) => {
  if (e.data?.type === "scenario:set") {
    applyScenario(e.data.payload);
  }
});
```

---

## `advance`

```json
"advance": { "type": "manual" }
```

| Type | Fields | Description |
|------|--------|-------------|
| `manual` | — | Waits for the presenter to click `›`, press Space, or press `→`. Default. |
| `auto` | — | Advances immediately after narration finishes. |
| `delay` | `delayMs` | Waits N milliseconds after narration finishes, then advances automatically. |
| `waitForEvent` | `event` | Waits for the iframe to post `{ type: "event-name" }` via postMessage. |

**WaitForEvent example:**
```json
"advance": {
  "type": "waitForEvent",
  "event": "chart:animated"
}
```
```js
// In the scene iframe, after the chart finishes animating:
window.parent.postMessage({ type: "chart:animated" }, "*");
```

---

## Complete Example

```json
{
  "id": "product-demo",
  "title": "Product Demo",
  "status": "ready",
  "theme": { "shell": "dark", "accent": "violet", "presenterPosition": "left" },
  "settings": {
    "typingSpeedMs": 20,
    "playbackMode": "interactive",
    "betweenScenesMs": 1800,
    "startDelayMs": 0,
    "endCardDurationMs": 0
  },
  "scenes": [
    {
      "id": "pd-01",
      "title": "Opening",
      "type": "title",
      "editIntent": "Title card. One-line premise. Create curiosity before the problem is revealed.",
      "presenter": {
        "mode": "thinking",
        "blocks": [
          { "text": "This is how it works today.", "pauseMs": 800 },
          { "text": " It doesn't have to.", "pauseMs": 0 }
        ]
      },
      "content": {
        "route": "./src/generated/product-demo/scene-01-title/index.html"
      },
      "advance": { "type": "manual" }
    },
    {
      "id": "pd-02",
      "title": "The Problem",
      "type": "narrative",
      "editIntent": "Show the painful status quo. Three metrics, all red. This is what we're replacing.",
      "presenter": {
        "mode": "impact",
        "blocks": [
          { "text": "Five tools.", "pauseMs": 600 },
          { "text": " Forty-five minutes.", "pauseMs": 600 },
          { "text": " Every single time.", "pauseMs": 0 }
        ]
      },
      "content": {
        "route": "./src/generated/product-demo/scene-02-problem/index.html",
        "waitForReady": false,
        "reloadOnEnter": true
      },
      "advance": { "type": "manual" }
    },
    {
      "id": "pd-03",
      "title": "The Answer",
      "type": "chart",
      "editIntent": "The after state. Same problem, solved in seconds. Let the chart animate before advancing.",
      "presenter": {
        "mode": "reveal",
        "blocks": [
          { "text": "2.1 seconds.", "pauseMs": 700 },
          { "text": " That's the whole story.", "pauseMs": 0 }
        ]
      },
      "content": {
        "route": "./src/generated/product-demo/scene-03-answer/index.html",
        "waitForReady": true
      },
      "actions": [
        { "type": "postMessage", "event": "chart:show", "payload": {} }
      ],
      "advance": {
        "type": "waitForEvent",
        "event": "chart:animated"
      }
    }
  ]
}
```

---

## Seeding Into the App

Add your contract to `src/main.js`:

```js
async function seedIfEmpty(store) {
  await seedDeck(store, "./src/contracts/demo-deck.json");
  await seedDeck(store, "./src/contracts/msp-demo-deck.json");
  await seedDeck(store, "./src/contracts/product-demo.json");  // ← your deck
  ...
}
```

`seedDeck` is idempotent — it only creates the deck if the `id` doesn't already exist in localStorage. To reset a deck during development, either change its `id` or clear localStorage in DevTools (`Application → Local Storage → Clear All`).

---

## Intent Field Best Practices

The `editIntent` field is surfaced in the workspace's **Edit Intent** textarea and used as context for AI-assisted scene regeneration. Write it as a brief brief to a designer:

```
Good:  "Incident command center at rest. Three tenant cards — Acme (healthy/green),
        Beta (at-risk/amber), Gamma (stable). Baseline before the incident fires.
        Sets up the contrast for scene 03."

Bad:   "Shows tenants"
```

Include:
- What the scene shows visually
- The emotional/narrative purpose
- Any specific metrics or data that must appear
- How it connects to the scenes before and after
