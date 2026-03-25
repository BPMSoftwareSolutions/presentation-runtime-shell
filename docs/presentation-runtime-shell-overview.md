# Core concept

Build a **master shell** that owns two synchronized surfaces:

1. **AI Typing Presenter**

   * types narration, questions, transitions, and insight text
   * controls pacing and attention
   * feels like the system is “thinking”

2. **Experience Frame**

   * an `iframe` that renders generated content
   * updates scene-by-scene as the presenter advances
   * can show apps, charts, simulations, agents, dashboards, mini-sites, prototypes

That matches the “thinking mode / reveal mode / impact mode” presentation rhythm in your notes. 

---

# High-level wireframe

## Layout

```text
┌──────────────────────────────────────────────────────────────────┐
│ Master Shell                                                    │
│                                                                  │
│  ┌──────────────────────────┐   ┌──────────────────────────────┐ │
│  │ AI Typing Presenter      │   │ Experience Frame            │ │
│  │                          │   │                              │ │
│  │ “Why did margin drop?”   │   │  iframe src=/scenes/01      │ │
│  │                          │   │                              │ │
│  │ “Let’s test labor cost.” │   │  interactive generated app   │ │
│  │                          │   │                              │ │
│  │ [Continue] [Replay]      │   │                              │ │
│  └──────────────────────────┘   └──────────────────────────────┘ │
│                                                                  │
│  Timeline / Scene Navigator / Debug / Prompt Inspector           │
└──────────────────────────────────────────────────────────────────┘
```

## Main idea

The shell reads a **presentation JSON contract** and plays it like a script.

Each step in the script defines:

* what the presenter says
* how it says it
* which content route to load in the iframe
* whether to wait for the iframe to signal readiness
* optional actions to send into the iframe after load

---

# Recommended architecture

## 1. Master Shell

Responsible for:

* loading the presentation contract
* sequencing scenes
* typing presenter output
* changing iframe route
* sending messages into iframe
* receiving events back from iframe
* keeping global presentation state

## 2. AI Typing Presenter

A renderer for scripted narration.

Features:

* character-by-character typing
* pauses
* chunked lines
* emphasis styles
* “thinking”, “reveal”, and “impact” modes
* interrupt / skip / resume support

## 3. Scene Runtime

A small controller that advances through steps:

* `presenter.speak`
* `iframe.navigate`
* `iframe.waitForReady`
* `iframe.postMessage`
* `await user click`
* `advance`

## 4. Generated Experience Host

Each generated demo lives at a relative route, such as:

* `/generated/intro`
* `/generated/pricing-sim`
* `/generated/agent-flow`
* `/generated/future-ui`

These apps know how to receive commands from the master shell via `postMessage`.

## 5. Contract Loader

Validates JSON and turns it into runtime instructions.

---

# Best mental model

Think of it as:

## A **presentation orchestration engine**

not a slide renderer.

The unit is not a slide.

The unit is a **scene**:

* presenter text
* content route
* sync rules
* transitions
* optional interactions

That is exactly where your concept becomes powerful: the system can say, “Let’s test that,” then update the embedded experience and explain the result. 

---

# Proposed JSON contract

Here is a clean first-pass contract.

```json
{
  "id": "ai-demo-deck-001",
  "title": "AI-Driven Experience Demo",
  "theme": {
    "shell": "dark",
    "accent": "violet",
    "presenterPosition": "left"
  },
  "settings": {
    "typingSpeedMs": 24,
    "autoAdvance": false,
    "waitForIframeReadyTimeoutMs": 8000
  },
  "scenes": [
    {
      "id": "scene-01",
      "title": "Opening",
      "presenter": {
        "mode": "thinking",
        "blocks": [
          { "text": "This presentation is not pre-built.", "pauseMs": 900 },
          { "text": "It is being generated...", "pauseMs": 1200 },
          { "text": "as you watch it.", "pauseMs": 800 }
        ]
      },
      "content": {
        "route": "/generated/opening",
        "reloadOnEnter": true,
        "waitForReady": true
      },
      "actions": [
        {
          "type": "postMessage",
          "target": "iframe",
          "event": "scene:init",
          "payload": { "variant": "minimal" }
        }
      ],
      "advance": {
        "type": "manual"
      }
    },
    {
      "id": "scene-02",
      "title": "Question framing",
      "presenter": {
        "mode": "thinking",
        "blocks": [
          { "text": "Why did margin drop?", "pauseMs": 1000 },
          { "text": "What changed?", "pauseMs": 1000 },
          { "text": "Let's test labor cost first.", "pauseMs": 700 }
        ]
      },
      "content": {
        "route": "/generated/margin-lab",
        "waitForReady": true
      },
      "actions": [
        {
          "type": "postMessage",
          "target": "iframe",
          "event": "scenario:set",
          "payload": {
            "laborCostDeltaPct": 10
          }
        }
      ],
      "advance": {
        "type": "waitForEvent",
        "event": "scenario:complete"
      }
    },
    {
      "id": "scene-03",
      "title": "Conclusion",
      "presenter": {
        "mode": "impact",
        "blocks": [
          { "text": "Operating profit drops by 18%." },
          { "text": "Labor is the dominant driver." }
        ]
      },
      "content": {
        "route": "/generated/margin-lab"
      },
      "actions": [
        {
          "type": "postMessage",
          "target": "iframe",
          "event": "highlight:driver",
          "payload": { "driver": "labor" }
        }
      ],
      "advance": {
        "type": "manual"
      }
    }
  ]
}
```

---

# Minimal schema

A tighter schema could be:

## Presentation

* `id`
* `title`
* `theme`
* `settings`
* `scenes[]`

## Scene

* `id`
* `title`
* `presenter`
* `content`
* `actions[]`
* `advance`

## Presenter

* `mode`: `thinking | reveal | impact`
* `blocks[]`

## Presenter block

* `text`
* `pauseMs`
* `typingSpeedMs?`
* `emphasis?`

## Content

* `route`
* `waitForReady`
* `reloadOnEnter`
* `fallback?`

## Action

* `type`
* `event`
* `payload`

## Advance

* `type`: `manual | auto | waitForEvent | delay`
* `event?`
* `delayMs?`

---

# Runtime flow

## Scene lifecycle

```text
load scene
→ navigate iframe to route
→ optionally wait for iframe ready
→ run init actions
→ type presenter blocks
→ run post-present actions
→ wait for advance condition
→ next scene
```

## More explicit event flow

```text
Master Shell
  loads contract
  sets currentScene = 0

Scene Runtime
  navigates iframe to /generated/opening
  waits for message { type: "iframe:ready", sceneId: "scene-01" }

AI Typing Presenter
  types block 1
  pauses
  types block 2
  pauses
  types block 3

Master Shell
  enables “Next”
  or auto-advances
```

---

# Communication pattern with iframe

Use `window.postMessage`.

## Shell → iframe

Examples:

```ts
{
  type: "scene:init",
  sceneId: "scene-02",
  payload: {...}
}
```

```ts
{
  type: "scenario:set",
  payload: {
    laborCostDeltaPct: 10
  }
}
```

```ts
{
  type: "highlight:driver",
  payload: {
    driver: "labor"
  }
}
```

## iframe → shell

Examples:

```ts
{
  type: "iframe:ready",
  sceneId: "scene-02"
}
```

```ts
{
  type: "scenario:complete",
  result: {
    operatingProfitDeltaPct: -18
  }
}
```

```ts
{
  type: "interaction:requestedAdvance"
}
```

---

# The key UX rule

The presenter and the iframe should feel **coupled, not parallel**.

Bad:

* presenter types a paragraph while the iframe changes unrelated things

Good:

* presenter says one thing
* iframe visually proves it
* presenter lands the takeaway

That aligns with your note about syncing typing with visual animation for maximum effect. 

---

# Suggested scene types

You can standardize a few scene templates.

## 1. Intro scene

* big typed statement
* minimal visual
* sets tone

## 2. Framing scene

* presenter asks a question
* iframe shows the problem space

## 3. Experiment scene

* presenter says “Let’s test that”
* iframe changes controls / parameters
* result is computed live

## 4. Insight scene

* presenter lands a conclusion
* iframe highlights one chart / node / metric

## 5. Comparison scene

* before vs after
* presenter narrates the delta

## 6. Open exploration scene

* user can interact
* presenter reacts or offers next prompts

---

# Product modes this could support

## Scripted demo mode

For keynote-style storytelling.

## Guided interactive mode

The audience can choose branches, but the shell keeps narrative control.

## Live generation mode

A generator creates each iframe route or content bundle on demand.

## Agent mode

The presenter is literally driven by an LLM that interprets results from the embedded app.

That’s the “not slides, but a thinking system” direction in your notes. 

---

# Technical stack suggestion

## Shell

* Plain HTML, CSS, and JavaScript (no framework)
* Lightweight scene runtime (async/await + event handling)
* Simple state machine for sequencing scenes

## Presenter

* Custom typed-text module
* Deterministic timing driven by JSON contract
* Optional streaming mode later

## Embedded experiences

* Each scene is a standalone web page (any stack)
* Communicates with shell via `postMessage`

## Validation

* Lightweight JSON schema (optional early, stricter later)

## Storage

* Local JSON files for prototyping
* Later generated via authoring tools or LLM pipelines

---

# State machine sketch

```text
IDLE
  ↓
LOAD_SCENE
  ↓
NAVIGATE_IFRAME
  ↓
WAIT_FOR_IFRAME_READY
  ↓
RUN_SCENE_ACTIONS
  ↓
TYPE_PRESENTER
  ↓
WAIT_FOR_ADVANCE
  ↓
NEXT_SCENE
  ↓
COMPLETE
```

Optional branches:

* `ERROR`
* `SKIPPED`
* `REPLAYING`
* `PAUSED`

---

# Wireframe v1

## Left panel: Presenter

* avatar or “AI Presenter” label
* typed lines
* scene title
* progress dots
* replay current line
* skip typing

## Right panel: Experience Frame

* iframe
* subtle loading state
* “waiting for scene”
* full-screen toggle
* optional device chrome off/on

## Bottom rail

* previous / next
* autoplay
* scrub through scenes
* debug toggle
* contract inspector

---

# Authoring model

Later, you could create a simple authoring format like this:

```json
{
  "prompt": "Create a cinematic AI demo about margin decline.",
  "inputs": {
    "topic": "margin decline",
    "audience": "executives",
    "tone": "confident",
    "generatedRoutes": [
      "/generated/opening",
      "/generated/margin-lab",
      "/generated/summary"
    ]
  }
}
```

And the system would generate:

* scene contract JSON
* presenter script
* route apps
* animations
* interaction bindings

---

# Important design decisions

## 1. Deterministic first, generative second

Start with scripted JSON, not live LLM narration.

That gives you:

* predictable pacing
* repeatable demos
* easier debugging

## 2. Route-based iframe scenes

Use relative routes rather than raw HTML blobs at first.

That gives you:

* easier dev workflow
* reusable scene apps
* consistent message passing

## 3. Message contract between shell and iframe

Treat shell and iframe as separate runtimes.

That prevents coupling and makes the system extensible.

## 4. Scene granularity

A scene should communicate **one idea**.

This follows your note about one focal point at a time. 

---

# Risks to watch

## Timing drift

Typing finishes before iframe is ready, or vice versa.

Fix:

* explicit wait states
* iframe ready handshake
* action completion events

## Over-typing

Too much typed text becomes tiring.

Fix:

* use typed text only for tension, transitions, and key insights
* use reveal/impact modes elsewhere, as your notes recommend. 

## iframe isolation issues

Cross-origin pages are harder to control.

Fix:

* keep generated scenes same-origin in v1

## Contract bloat

Too many fields make authoring painful.

Fix:

* start with 6–8 core fields
* grow only when repetition proves necessary

---

# Strong v1 scope

A very solid first prototype would include:

## Features

* shell with left/right split
* JSON-driven scenes
* typed presenter blocks
* iframe route switching
* ready handshake
* postMessage actions
* manual next/previous
* autoplay toggle

## Three demo scenes

* opening statement
* experiment scene
* conclusion scene

That is enough to prove the concept.

---

# My recommendation for v1 structure

## Files

```text
/app
  /present/[deckId]/page.tsx
  /generated/opening/page.tsx
  /generated/margin-lab/page.tsx
  /generated/summary/page.tsx

/components
  MasterShell.tsx
  PresenterPanel.tsx
  ExperienceFrame.tsx
  SceneRuntime.ts
  TypedPresenter.tsx

/contracts
  demo-deck.json
  schema.ts
```

---

# Example shell pseudocode

```ts
for (const scene of contract.scenes) {
  await frame.navigate(scene.content.route);

  if (scene.content.waitForReady) {
    await frame.waitFor("iframe:ready");
  }

  for (const action of scene.actions ?? []) {
    await frame.dispatch(action);
  }

  await presenter.play(scene.presenter);

  await runtime.waitForAdvance(scene.advance);
}
```

---

# Best expression of the idea

This is not “slides with AI.”

It is a **narrative shell for generated experiences**.

The presenter is the story engine.
The iframe is the evidence surface.
The JSON contract is the score.

---

# A clean one-sentence product definition

**A presentation shell that orchestrates typed AI narration and live embedded experiences through a scene-based JSON contract.**
