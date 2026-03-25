Below is a **framework-neutral HTML shell** for the AI presentation system, designed around a **stable runtime + replaceable UI adapter** architecture, with a **master shell** containing a typing presenter, an experience iframe, controls, timeline, and debug/inspector areas. That matches the structure described in your architecture and runtime notes.  

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>AI Presentation System</title>
    <meta
      name="description"
      content="Narrative shell for generated experiences"
    />

    <!-- Shell styles -->
    <link rel="stylesheet" href="./styles/shell.css" />
  </head>
  <body>
    <div id="app" class="app-shell" data-status="idle" data-theme="dark">
      <!-- Top bar -->
      <header class="shell-header" role="banner">
        <div class="shell-header__brand">
          <div class="brand-mark" aria-hidden="true"></div>
          <div class="brand-copy">
            <p class="brand-eyebrow">AI Presentation System</p>
            <h1 id="deck-title" class="deck-title">Loading deck…</h1>
          </div>
        </div>

        <div class="shell-header__meta">
          <div class="scene-meta">
            <span class="scene-meta__label">Scene</span>
            <strong id="scene-index">0</strong>
            <span aria-hidden="true">/</span>
            <span id="scene-count">0</span>
          </div>

          <div class="runtime-status" aria-live="polite">
            <span class="runtime-status__label">Status</span>
            <strong id="runtime-status-text">Idle</strong>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main class="shell-main" role="main">
        <!-- Presenter panel -->
        <aside
          class="presenter-panel"
          id="presenter-panel"
          aria-labelledby="presenter-panel-title"
          data-mode="thinking"
        >
          <div class="presenter-panel__header">
            <div class="presenter-identity">
              <div class="presenter-avatar" aria-hidden="true">AI</div>
              <div>
                <p class="panel-eyebrow">Narration</p>
                <h2 id="presenter-panel-title">AI Typing Presenter</h2>
              </div>
            </div>

            <div class="presenter-mode">
              <span class="presenter-mode__label">Mode</span>
              <strong id="presenter-mode-text">thinking</strong>
            </div>
          </div>

          <section class="presenter-panel__body">
            <div class="scene-heading">
              <p class="panel-eyebrow">Current Scene</p>
              <h3 id="scene-title">Waiting to start…</h3>
            </div>

            <div
              id="presenter-transcript"
              class="presenter-transcript"
              aria-live="polite"
              aria-atomic="false"
            >
              <div class="presenter-block presenter-block--active">
                <p id="presenter-text">
                  The presenter script will appear here.
                </p>
                <span
                  id="presenter-cursor"
                  class="presenter-cursor"
                  aria-hidden="true"
                ></span>
              </div>
            </div>
          </section>

          <footer class="presenter-panel__footer">
            <div class="presenter-actions">
              <button
                type="button"
                id="skip-typing-btn"
                class="btn btn--secondary"
              >
                Skip typing
              </button>
              <button
                type="button"
                id="replay-line-btn"
                class="btn btn--ghost"
              >
                Replay line
              </button>
            </div>

            <div class="presenter-progress">
              <span class="panel-eyebrow">Progress</span>
              <div
                id="scene-progress-dots"
                class="scene-progress-dots"
                aria-label="Scene progress"
              ></div>
            </div>
          </footer>
        </aside>

        <!-- Experience frame -->
        <section
          class="experience-panel"
          aria-labelledby="experience-panel-title"
        >
          <div class="experience-panel__header">
            <div>
              <p class="panel-eyebrow">Evidence Surface</p>
              <h2 id="experience-panel-title">Experience Frame</h2>
            </div>

            <div class="experience-panel__actions">
              <button
                type="button"
                id="reload-scene-btn"
                class="btn btn--ghost"
              >
                Reload scene
              </button>
              <button
                type="button"
                id="fullscreen-btn"
                class="btn btn--secondary"
              >
                Full screen
              </button>
            </div>
          </div>

          <div class="experience-frame-wrap">
            <div
              id="experience-loading"
              class="experience-loading"
              aria-live="polite"
            >
              Waiting for scene…
            </div>

            <iframe
              id="experience-frame"
              class="experience-frame"
              title="Generated experience frame"
              src="about:blank"
              loading="eager"
              allow="fullscreen"
            ></iframe>
          </div>

          <div class="experience-panel__footer">
            <div class="iframe-status">
              <span class="panel-eyebrow">Route</span>
              <code id="iframe-route">about:blank</code>
            </div>

            <div class="iframe-ready">
              <span class="panel-eyebrow">Ready</span>
              <strong id="iframe-ready-state">false</strong>
            </div>
          </div>
        </section>
      </main>

      <!-- Bottom rail -->
      <section
        class="shell-bottom-rail"
        aria-label="Presentation controls and navigation"
      >
        <!-- Transport controls -->
        <div class="transport-controls" role="group" aria-label="Playback controls">
          <button
            type="button"
            id="previous-btn"
            class="btn btn--ghost"
            disabled
          >
            Previous
          </button>

          <button
            type="button"
            id="play-pause-btn"
            class="btn btn--primary"
            aria-pressed="false"
          >
            Start
          </button>

          <button
            type="button"
            id="next-btn"
            class="btn btn--ghost"
            disabled
          >
            Next
          </button>

          <label class="toggle">
            <input type="checkbox" id="autoplay-toggle" />
            <span>Autoplay</span>
          </label>
        </div>

        <!-- Timeline -->
        <nav class="timeline-panel" aria-labelledby="timeline-title">
          <div class="timeline-panel__header">
            <h2 id="timeline-title">Scene Navigator</h2>
          </div>

          <ol id="timeline-list" class="timeline-list">
            <!-- Runtime injects scene items here -->
            <li class="timeline-item is-active">
              <button type="button" class="timeline-item__button">
                <span class="timeline-item__index">01</span>
                <span class="timeline-item__content">
                  <strong class="timeline-item__title">Opening</strong>
                  <span class="timeline-item__meta">thinking</span>
                </span>
              </button>
            </li>
          </ol>
        </nav>

        <!-- Inspector / debug -->
        <aside class="inspector-panel" aria-labelledby="inspector-title">
          <div class="inspector-panel__header">
            <h2 id="inspector-title">Inspector</h2>
            <button
              type="button"
              id="debug-toggle-btn"
              class="btn btn--ghost btn--small"
              aria-expanded="true"
              aria-controls="debug-panel"
            >
              Toggle
            </button>
          </div>

          <div id="debug-panel" class="debug-panel">
            <section class="debug-group" aria-labelledby="debug-runtime-title">
              <h3 id="debug-runtime-title">Runtime State</h3>
              <pre id="runtime-state-output" class="debug-output">
{
  "status": "idle",
  "currentSceneIndex": 0
}
              </pre>
            </section>

            <section class="debug-group" aria-labelledby="debug-events-title">
              <h3 id="debug-events-title">Event Log</h3>
              <ul id="event-log" class="event-log">
                <li>runtime:initialized</li>
              </ul>
            </section>

            <section class="debug-group" aria-labelledby="debug-contract-title">
              <h3 id="debug-contract-title">Contract Inspector</h3>
              <pre id="contract-output" class="debug-output">
Deck contract preview
              </pre>
            </section>
          </div>
        </aside>
      </section>
    </div>

    <!-- Optional templates for JS rendering -->
    <template id="timeline-item-template">
      <li class="timeline-item">
        <button type="button" class="timeline-item__button">
          <span class="timeline-item__index"></span>
          <span class="timeline-item__content">
            <strong class="timeline-item__title"></strong>
            <span class="timeline-item__meta"></span>
          </span>
        </button>
      </li>
    </template>

    <template id="presenter-block-template">
      <div class="presenter-block">
        <p class="presenter-block__text"></p>
      </div>
    </template>

    <template id="event-log-item-template">
      <li class="event-log__item"></li>
    </template>

    <!-- App entry -->
    <script type="module" src="./src/main.js"></script>
  </body>
</html>
```

## Why this structure fits

This HTML is shaped to support:

* a **core runtime** that owns sequencing, scene execution, iframe messaging, and state
* a **DOM renderer/UI adapter** that only updates the visible shell
* a **left/right master shell** with synchronized presenter + experience frame
* a **timeline / controls / inspector** layer for navigation and debugging

That separation is directly in line with the uploaded architecture notes. 

## Key IDs for your JS modules

These are the main hooks your vanilla JS runtime/UI layer would bind to:

* `#deck-title`
* `#scene-title`
* `#scene-index`
* `#scene-count`
* `#runtime-status-text`
* `#presenter-panel`
* `#presenter-mode-text`
* `#presenter-transcript`
* `#presenter-text`
* `#presenter-cursor`
* `#experience-frame`
* `#experience-loading`
* `#iframe-route`
* `#iframe-ready-state`
* `#previous-btn`
* `#play-pause-btn`
* `#next-btn`
* `#skip-typing-btn`
* `#timeline-list`
* `#runtime-state-output`
* `#event-log`
* `#contract-output`

## Suggested next file split

A good v1 pairing for this HTML would be:

```text
/index.html
/styles/shell.css
/src/main.js
/src/core/deck-runtime.js
/src/core/scene-runner.js
/src/core/presenter-engine.js
/src/core/iframe-bridge.js
/src/core/state-store.js
/src/ui/dom-renderer.js
/src/ui/controls.js
/src/ui/timeline.js
/src/ui/presenter-panel.js
```

That matches the “stable core, disposable UI” direction from the architecture doc. 

