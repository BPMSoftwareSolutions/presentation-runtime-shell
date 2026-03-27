# Skill: Creating a Presentation

This guide walks you through building a new presentation end-to-end — from the JSON deck contract to working scene HTML files.

---

## Step 1 — Plan your scenes

Before writing any code, map out your story:

```
Scene 01 — Title card          (type: title)
Scene 02 — Setup / context     (type: narrative)
Scene 03 — The problem         (type: narrative)
Scene 04 — The reveal          (type: chart)
Scene 05 — Closing argument    (type: closing)
```

Each scene needs:
- A **title** (shown in the workspace scene list)
- A **presenter script** (what the AI narrator types)
- An **HTML file** (the visual content in the iframe)
- An **advance rule** (how the scene ends)
- An **editIntent** (what this scene is trying to accomplish — used for AI regeneration)

---

## Step 2 — Create the HTML scene files

Create a folder per scene under `src/generated/<deck-name>/`:

```
src/generated/my-deck/
├── scene-01-title/index.html
├── scene-02-setup/index.html
...
```

This repo's required scaffold convention is **one folder per scene with `index.html` inside**. Do not place scene files directly under `src/generated/<deck-name>/`.

Each scene is a **self-contained HTML file** — inline CSS, inline JS, no external dependencies. See [`scene-authoring.md`](scene-authoring.md) for the full scene HTML pattern.

Minimal scene template:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Scene Title</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      height: 100%;
      background: #08101d;
      color: #eef2ff;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      overflow: hidden;
    }
    .scene {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
    }
  </style>
</head>
<body>
  <div class="scene">
    <!-- Your content here -->
  </div>
</body>
</html>
```

---

## Step 3 — Write the deck JSON contract

Create `src/contracts/my-deck.json`:

```json
{
  "id": "my-deck",
  "title": "My Presentation",
  "status": "ready",
  "theme": {
    "shell": "dark",
    "accent": "violet",
    "presenterPosition": "left"
  },
  "settings": {
    "typingSpeedMs": 22,
    "playbackMode": "interactive",
    "betweenScenesMs": 1800,
    "startDelayMs": 0,
    "endCardDurationMs": 0
  },
  "scenes": [
    {
      "id": "my-01",
      "title": "Opening",
      "type": "title",
      "editIntent": "Title card. Establish the topic and create curiosity before the demo begins.",
      "presenter": {
        "mode": "thinking",
        "blocks": [
          { "text": "Here is the problem.", "pauseMs": 700 },
          { "text": " This is why it matters.", "pauseMs": 500 }
        ]
      },
      "content": {
        "route": "./src/generated/my-deck/scene-01-title/index.html"
      },
      "advance": { "type": "manual" }
    }
  ]
}
```

See [`deck-json-reference.md`](deck-json-reference.md) for the complete schema.

---

## Step 4 — Seed the deck into the app

Open `src/main.js` and add your deck to the seed list:

```js
async function seedIfEmpty(store) {
  await seedDeck(store, "./src/contracts/demo-deck.json");
  await seedDeck(store, "./src/contracts/msp-demo-deck.json");
  await seedDeck(store, "./src/contracts/my-deck.json");   // ← add this
  ...
}
```

> **Note:** `seedDeck` only creates the deck if it doesn't already exist in localStorage. To force a fresh load, either change the deck `id` or clear localStorage in DevTools (`Application → Local Storage → Clear`).

---

## Step 5 — Open and verify

1. Open `index.html` (or refresh the page)
2. Your deck appears in the library
3. Click to open the workspace
4. Select each scene — the iframe should load and the narrator should type

---

## Step 6 — Refine

In the workspace:

- **Edit Intent** — fill in the textarea for each scene to capture its purpose
- **Edit Text** — click to open the blocks editor and tweak narrator copy inline
- **Inspector** — adjust advance rules, scene type, playback settings
- **Skip / Replay** — test narration timing

---

## Tips

**Consistent visual language across scenes:**
All scenes in a deck should share the same background (`#08101d`), color palette, and font. Define a base CSS block at the top of every scene HTML.

**Scene IDs must be unique:**
Across all decks in the store. Use a namespace prefix: `my-deck-01`, `my-deck-02`, etc.

**Test each advance rule:**
- `manual` — click `›` or press Space
- `delay` — set `"delayMs": 3000` and watch it auto-advance
- `waitForEvent` — the iframe must call `window.parent.postMessage({ type: "your-event" }, "*")` to trigger advance

**Route paths are relative to `index.html`:**
Use `./src/generated/...` — not an absolute path.
