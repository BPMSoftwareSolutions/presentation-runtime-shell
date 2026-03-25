```javascript
import { loadContract } from "./core/contract-loader.js";
import { createDeckRuntime } from "./core/deck-runtime.js";

/* ---------------------------------- */
/* DOM renderer                       */
/* ---------------------------------- */

function mountDomRenderer(runtime, doc = document) {
  const $ = (s) => doc.querySelector(s);

  const els = {
    deckTitle: $("#deck-title"),
    sceneTitle: $("#scene-title"),
    sceneIndex: $("#scene-index"),
    sceneCount: $("#scene-count"),
    runtimeStatus: $("#runtime-status-text"),
    presenterMode: $("#presenter-mode-text"),
    presenterText: $("#presenter-text"),
    iframeRoute: $("#iframe-route"),
    iframeReady: $("#iframe-ready-state"),
    frame: $("#experience-frame"),
    previousBtn: $("#previous-btn"),
    playPauseBtn: $("#play-pause-btn"),
    nextBtn: $("#next-btn"),
    skipTypingBtn: $("#skip-typing-btn"),
    timelineList: $("#timeline-list"),
    runtimeStateOutput: $("#runtime-state-output"),
  };

  function formatSceneNumber(index) {
    return String(index + 1).padStart(2, "0");
  }

  function renderTimeline(state) {
    const deck = runtime.getDeck();
    if (!deck || !els.timelineList) return;

    els.timelineList.innerHTML = "";

    deck.scenes.forEach((scene, index) => {
      const li = document.createElement("li");
      li.className = "timeline-item";

      if (index === state.currentSceneIndex) {
        li.classList.add("is-active");
      }

      const btn = document.createElement("button");
      btn.className = "timeline-item__button";

      btn.innerHTML = `
        <span class="timeline-item__index">${formatSceneNumber(index)}</span>
        <span class="timeline-item__content">
          <strong class="timeline-item__title">${scene.title}</strong>
          <span class="timeline-item__meta">${scene.presenter?.mode || "thinking"}</span>
        </span>
      `;

      btn.onclick = () => runtime.goTo(index);

      li.appendChild(btn);
      els.timelineList.appendChild(li);
    });
  }

  function render(state) {
    const deck = runtime.getDeck();
    const scene = deck?.scenes?.[state.currentSceneIndex];

    if (els.deckTitle) {
      els.deckTitle.textContent = deck?.title || "Untitled deck";
    }

    if (els.sceneTitle) {
      els.sceneTitle.textContent = scene?.title || "";
    }

    if (els.sceneIndex) {
      els.sceneIndex.textContent = String(state.currentSceneIndex + 1);
    }

    if (els.sceneCount) {
      els.sceneCount.textContent = String(deck?.scenes?.length || 0);
    }

    if (els.runtimeStatus) {
      els.runtimeStatus.textContent = state.status;
    }

    if (els.presenterMode) {
      els.presenterMode.textContent = state.presenter.mode;
    }

    if (els.presenterText) {
      els.presenterText.textContent = state.presenter.text;
    }

    if (els.iframeRoute) {
      els.iframeRoute.textContent = state.iframe.route;
    }

    if (els.iframeReady) {
      els.iframeReady.textContent = String(state.iframe.isReady);
    }

    if (els.frame && els.frame.src !== state.iframe.route) {
      els.frame.src = state.iframe.route || "about:blank";
    }

    if (els.previousBtn) {
      els.previousBtn.disabled = !state.controls.canPrevious;
    }

    if (els.nextBtn) {
      els.nextBtn.disabled = !state.controls.canNext;
    }

    if (els.playPauseBtn) {
      const running =
        state.status !== "idle" && state.status !== "paused";

      els.playPauseBtn.textContent = running ? "Pause" : "Start";
      els.playPauseBtn.setAttribute("aria-pressed", String(running));
    }

    if (els.runtimeStateOutput) {
      els.runtimeStateOutput.textContent = JSON.stringify(
        state,
        null,
        2
      );
    }

    renderTimeline(state);
  }

  runtime.subscribe(render);

  /* ----------------------------- */
  /* Controls wiring               */
  /* ----------------------------- */

  els.playPauseBtn?.addEventListener("click", () => {
    const state = runtime.getState();
    if (state.status === "paused") {
      runtime.resume();
    } else {
      runtime.pause();
    }
  });

  els.nextBtn?.addEventListener("click", () => {
    runtime.next();
  });

  els.previousBtn?.addEventListener("click", () => {
    runtime.previous();
  });

  els.skipTypingBtn?.addEventListener("click", () => {
    runtime.skipTyping();
  });
}

/* ---------------------------------- */
/* Boot                               */
/* ---------------------------------- */

async function boot() {
  try {
    const deck = await loadContract(
      "./src/contracts/demo-deck.json"
    );

    const runtime = createDeckRuntime();

    // expose for debugging
    window.runtime = runtime;

    mountDomRenderer(runtime, document);

    await runtime.load(deck);

    runtime.start();
  } catch (err) {
    console.error("Boot error:", err);
  }
}

boot();
```
