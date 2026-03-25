```javascript
const DEFAULT_DECK = {
  id: "demo-deck",
  title: "AI Presentation System Demo",
  theme: {
    shell: "dark",
    accent: "violet",
    presenterPosition: "left",
  },
  settings: {
    typingSpeedMs: 24,
    autoAdvance: false,
    waitForIframeReadyTimeoutMs: 8000,
  },
  scenes: [
    {
      id: "scene-01",
      title: "Opening",
      presenter: {
        mode: "thinking",
        blocks: [
          { text: "This presentation is not pre-built.", pauseMs: 700 },
          { text: "It is being generated...", pauseMs: 900 },
          { text: "as you watch it.", pauseMs: 600 },
        ],
      },
      content: {
        route: "./src/generated/opening/index.html",
        reloadOnEnter: true,
        waitForReady: false,
      },
      advance: { type: "manual" },
    },
    {
      id: "scene-02",
      title: "Question framing",
      presenter: {
        mode: "thinking",
        blocks: [
          { text: "Why did margin drop?", pauseMs: 800 },
          { text: "What changed?", pauseMs: 700 },
          { text: "Let's test labor cost first.", pauseMs: 500 },
        ],
      },
      content: {
        route: "./src/generated/lab/index.html",
        reloadOnEnter: true,
        waitForReady: false,
      },
      advance: { type: "manual" },
    },
    {
      id: "scene-03",
      title: "Conclusion",
      presenter: {
        mode: "impact",
        blocks: [
          { text: "Operating profit drops by 18%.", pauseMs: 700 },
          { text: "Labor is the dominant driver.", pauseMs: 400 },
        ],
      },
      content: {
        route: "./src/generated/summary/index.html",
        reloadOnEnter: true,
        waitForReady: false,
      },
      advance: { type: "manual" },
    },
  ],
};

/* ---------------------------------- */
/* utilities                          */
/* ---------------------------------- */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/* ---------------------------------- */
/* event bus                          */
/* ---------------------------------- */

function createEventBus() {
  const listeners = new Map();

  return {
    on(eventName, handler) {
      const set = listeners.get(eventName) || new Set();
      set.add(handler);
      listeners.set(eventName, set);
      return () => set.delete(handler);
    },

    emit(eventName, payload = {}) {
      const set = listeners.get(eventName);
      if (!set) return;
      for (const handler of set) {
        handler(payload);
      }
    },
  };
}

/* ---------------------------------- */
/* state store                        */
/* ---------------------------------- */

function createStore(initialState) {
  let state = structuredClone(initialState);
  const subscribers = new Set();

  function getState() {
    return state;
  }

  function setState(updater) {
    const nextPartial =
      typeof updater === "function" ? updater(state) : updater;

    state = {
      ...state,
      ...nextPartial,
      presenter: {
        ...state.presenter,
        ...(nextPartial.presenter || {}),
      },
      iframe: {
        ...state.iframe,
        ...(nextPartial.iframe || {}),
      },
      controls: {
        ...state.controls,
        ...(nextPartial.controls || {}),
      },
    };

    for (const subscriber of subscribers) {
      subscriber(state);
    }
  }

  function subscribe(listener) {
    subscribers.add(listener);
    listener(state);
    return () => subscribers.delete(listener);
  }

  return {
    getState,
    setState,
    subscribe,
  };
}

/* ---------------------------------- */
/* presenter engine                   */
/* ---------------------------------- */

function createPresenterEngine({ bus, store, getTypingSpeed }) {
  let cancelRequested = false;
  let skipRequested = false;
  let playToken = 0;

  function resetFlags() {
    cancelRequested = false;
    skipRequested = false;
  }

  async function typeText(text) {
    let visible = "";

    for (const char of text) {
      if (cancelRequested) return { cancelled: true };

      if (skipRequested) {
        visible = text;
        store.setState({
          presenter: {
            text: visible,
            isTyping: false,
          },
        });
        bus.emit("presenter:update", { text: visible });
        return { cancelled: false };
      }

      visible += char;
      store.setState({
        presenter: {
          text: visible,
          isTyping: true,
        },
      });
      bus.emit("presenter:update", { text: visible });
      await sleep(getTypingSpeed());
    }

    store.setState({
      presenter: {
        text,
        isTyping: false,
      },
    });

    return { cancelled: false };
  }

  async function play(presenter) {
    const token = ++playToken;
    resetFlags();

    const mode = presenter?.mode || "thinking";
    const blocks = presenter?.blocks || [];

    store.setState({
      presenter: {
        mode,
        text: "",
        isTyping: false,
      },
    });

    bus.emit("presenter:start", { mode });

    for (let index = 0; index < blocks.length; index += 1) {
      if (cancelRequested || token !== playToken) {
        return { cancelled: true };
      }

      const block = blocks[index];
      const text = block?.text || "";

      bus.emit("presenter:blockStart", { index, text, mode });

      const typed = await typeText(text);
      if (typed.cancelled || token !== playToken) {
        return { cancelled: true };
      }

      bus.emit("presenter:blockDone", { index, text, mode });

      const pauseMs = block?.pauseMs ?? 500;
      await sleep(skipRequested ? 0 : pauseMs);
    }

    bus.emit("presenter:done", { mode });
    return { cancelled: false };
  }

  function skip() {
    skipRequested = true;
    store.setState({
      presenter: {
        isTyping: false,
      },
    });
    bus.emit("presenter:skip");
  }

  function cancel() {
    cancelRequested = true;
    playToken += 1;
    store.setState({
      presenter: {
        isTyping: false,
      },
    });
    bus.emit("presenter:cancel");
  }

  return {
    play,
    skip,
    cancel,
  };
}

/* ---------------------------------- */
/* dom renderer                       */
/* ---------------------------------- */

function mountDomRenderer(runtime, doc = document) {
  const $ = (selector) => doc.querySelector(selector);

  const els = {
    app: $("#app"),
    deckTitle: $("#deck-title"),
    sceneTitle: $("#scene-title"),
    sceneIndex: $("#scene-index"),
    sceneCount: $("#scene-count"),
    runtimeStatus: $("#runtime-status-text"),
    presenterPanel: $("#presenter-panel"),
    presenterMode: $("#presenter-mode-text"),
    presenterText: $("#presenter-text"),
    iframeRoute: $("#iframe-route"),
    iframeReady: $("#iframe-ready-state"),
    experienceLoading: $("#experience-loading"),
    frame: $("#experience-frame"),
    previousBtn: $("#previous-btn"),
    playPauseBtn: $("#play-pause-btn"),
    nextBtn: $("#next-btn"),
    skipTypingBtn: $("#skip-typing-btn"),
    replayLineBtn: $("#replay-line-btn"),
    autoplayToggle: $("#autoplay-toggle"),
    timelineList: $("#timeline-list"),
    progressDots: $("#scene-progress-dots"),
    runtimeStateOutput: $("#runtime-state-output"),
    eventLog: $("#event-log"),
    contractOutput: $("#contract-output"),
    debugToggleBtn: $("#debug-toggle-btn"),
    debugPanel: $("#debug-panel"),
    reloadSceneBtn: $("#reload-scene-btn"),
  };

  function formatSceneNumber(index) {
    return String(index + 1).padStart(2, "0");
  }

  function renderTimeline(state) {
    const deck = runtime.getDeck();
    if (!els.timelineList || !deck) return;

    els.timelineList.innerHTML = "";

    deck.scenes.forEach((scene, index) => {
      const li = document.createElement("li");
      li.className = "timeline-item";

      if (index === state.currentSceneIndex) {
        li.classList.add("is-active");
      }

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "timeline-item__button";
      btn.innerHTML = `
        <span class="timeline-item__index">${formatSceneNumber(index)}</span>
        <span class="timeline-item__content">
          <strong class="timeline-item__title">${scene.title}</strong>
          <span class="timeline-item__meta">${scene.presenter?.mode || "thinking"}</span>
        </span>
      `;

      btn.addEventListener("click", () => runtime.goTo(index));
      li.appendChild(btn);
      els.timelineList.appendChild(li);
    });
  }

  function renderProgressDots(state) {
    const deck = runtime.getDeck();
    if (!els.progressDots || !deck) return;

    els.progressDots.innerHTML = "";
    deck.scenes.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.className = "scene-progress-dot";

      if (index < state.currentSceneIndex) {
        dot.classList.add("is-complete");
      } else if (index === state.currentSceneIndex) {
        dot.classList.add("is-active");
      }

      els.progressDots.appendChild(dot);
    });
  }

  function render(state) {
    const deck = runtime.getDeck();
    const scene = deck?.scenes?.[state.currentSceneIndex];

    if (els.deckTitle) {
      els.deckTitle.textContent = deck?.title || "Untitled deck";
    }

    if (els.sceneTitle) {
      els.sceneTitle.textContent = scene?.title || "Waiting to start…";
    }

    if (els.sceneIndex) {
      els.sceneIndex.textContent = String((state.currentSceneIndex ?? 0) + 1);
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
      els.presenterText.textContent = state.presenter.text || "";
    }

    if (els.iframeRoute) {
      els.iframeRoute.textContent = state.iframe.route || "about:blank";
    }

    if (els.iframeReady) {
      els.iframeReady.textContent = String(Boolean(state.iframe.isReady));
    }

    if (els.experienceLoading) {
      els.experienceLoading.classList.toggle(
        "is-hidden",
        state.status !== "loading-scene"
      );
    }

    if (els.previousBtn) {
      els.previousBtn.disabled = !state.controls.canPrevious;
    }

    if (els.nextBtn) {
      els.nextBtn.disabled = !state.controls.canNext;
    }

    if (els.playPauseBtn) {
      const isRunning = state.status !== "idle" && state.status !== "paused";
      els.playPauseBtn.textContent = isRunning ? "Pause" : "Start";
      els.playPauseBtn.setAttribute("aria-pressed", String(isRunning));
```
