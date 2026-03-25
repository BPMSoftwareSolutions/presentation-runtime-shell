import { createEventBus } from "./event-bus.js";
import { createStore } from "./state-store.js";
import { createPresenterEngine } from "./presenter-engine.js";
import { createSceneRunner } from "./scene-runner.js";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const INITIAL_STATE = {
  status: "idle",
  playbackMode: "interactive",
  currentSceneIndex: 0,
  presenter: { mode: "thinking", text: "", isTyping: false },
  iframe: { route: "", isReady: false },
  controls: { canNext: false, canPrevious: false },
  countdown: null, // { remainingMs, totalMs } when a timer delay is active
};

/**
 * Rewrite a scene's advance rule based on the active playback mode.
 *
 * interactive — leave the scene's advance rule untouched (manual stays manual)
 * autoplay    — replace manual with betweenScenesMs delay; keep waitForEvent
 * capture     — replace all non-delay types with betweenScenesMs delay
 *               (fully deterministic, no user-input dependency)
 */
function getEffectiveAdvance(scene, mode, settings) {
  const advance = scene.advance || { type: "manual" };
  const betweenMs = settings?.betweenScenesMs ?? 600;

  if (mode === "interactive") return advance;
  if (advance.type === "delay") return advance;

  if (mode === "autoplay") {
    // Keep real iframe events in autoplay; only override manual
    if (advance.type === "waitForEvent") return advance;
    return { type: "delay", delayMs: betweenMs };
  }

  // capture — deterministic: replace everything with a fixed delay
  return { type: "delay", delayMs: betweenMs };
}

export function createDeckRuntime() {
  const bus = createEventBus();
  const store = createStore(INITIAL_STATE);

  let deck = null;
  let runToken = 0;
  let _attachedIframe = null;
  let _attachedRoute = "";

  function getTypingSpeed() {
    return deck?.settings?.typingSpeedMs ?? 24;
  }

  function getPlaybackMode() {
    return store.getState().playbackMode;
  }

  const presenterEngine = createPresenterEngine({ bus, store, getTypingSpeed });
  const sceneRunner = createSceneRunner({
    bus,
    store,
    presenterEngine,
    getIframeEl: () => _attachedIframe || document.getElementById("experience-frame"),
  });

  // Forward iframe postMessages to the event bus
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (data && typeof data === "object" && data.type) {
      bus.emit(data.type, data);
    }
  });

  // Allow scenes to request a full-deck restart without hard-coded URL routing.
  bus.on("deck:restart", () => {
    sceneRunner.cancel();
    ++runToken;
    setTimeout(() => runFromScene(0), 50);
  });

  // Keep the attached iframe in sync with route changes
  store.subscribe((state) => {
    if (_attachedIframe && state.iframe.route !== _attachedRoute) {
      _attachedRoute = state.iframe.route;
      _attachedIframe.src = state.iframe.route || "about:blank";
    }
  });

  async function runFromScene(index) {
    const token = ++runToken;
    let current = index;

    // startDelayMs — pause before the first scene in autoplay/capture
    if (current === 0) {
      const startDelay = deck?.settings?.startDelayMs ?? 0;
      const mode = getPlaybackMode();
      if (startDelay > 0 && mode !== "interactive") {
        store.setState({ status: "starting" });
        await sleep(startDelay);
        if (token !== runToken) return;
      }
    }

    while (deck && current < deck.scenes.length) {
      if (token !== runToken) return;

      const scene = deck.scenes[current];
      const mode = getPlaybackMode();

      store.setState({
        currentSceneIndex: current,
        controls: {
          canNext: false,
          canPrevious: current > 0,
        },
        presenter: {
          mode: scene.presenter?.mode || "thinking",
          text: "",
          isTyping: false,
        },
      });

      bus.emit("scene:willStart", { sceneId: scene.id, index: current });

      // Rewrite advance based on current playback mode
      const effectiveScene = {
        ...scene,
        advance: getEffectiveAdvance(scene, mode, deck.settings),
      };

      const result = await sceneRunner.run(effectiveScene);

      if (token !== runToken || result?.cancelled) return;

      const isLast = current >= deck.scenes.length - 1;
      if (isLast) {
        // endCardDurationMs — hold the last frame before completing
        const endCardMs = deck?.settings?.endCardDurationMs ?? 0;
        if (endCardMs > 0 && mode !== "interactive") {
          store.setState({ status: "end-card" });
          await sleep(endCardMs);
          if (token !== runToken) return;
        }

        store.setState({ status: "complete", controls: { canNext: false } });
        bus.emit("runtime:complete");
        return;
      }

      current += 1;
    }
  }

  return {
    async load(deckData) {
      deck = deckData;

      // Apply playbackMode from contract settings if present
      const contractMode = deckData?.settings?.playbackMode;
      const validModes = ["interactive", "autoplay", "capture"];
      const resolvedMode = validModes.includes(contractMode) ? contractMode : "interactive";

      store.setState({
        status: "idle",
        playbackMode: resolvedMode,
        currentSceneIndex: 0,
        controls: { canNext: false, canPrevious: false },
        iframe: { route: "", isReady: false },
        presenter: { mode: "thinking", text: "", isTyping: false },
      });

      bus.emit("runtime:loaded", { deck });
    },

    start() {
      runFromScene(store.getState().currentSceneIndex);
    },

    next() {
      sceneRunner.advance();
    },

    previous() {
      const idx = store.getState().currentSceneIndex;
      if (idx <= 0) return;
      sceneRunner.cancel();
      ++runToken;
      setTimeout(() => runFromScene(idx - 1), 50);
    },

    goTo(index) {
      if (!deck || index < 0 || index >= deck.scenes.length) return;
      sceneRunner.cancel();
      ++runToken;
      setTimeout(() => runFromScene(index), 50);
    },

    setPlaybackMode(mode) {
      const validModes = ["interactive", "autoplay", "capture"];
      if (!validModes.includes(mode)) return;
      store.setState({ playbackMode: mode });
      bus.emit("runtime:playbackModeChanged", { mode });
    },

    skipTyping() {
      presenterEngine.skip();
    },

    pause() {
      presenterEngine.pause();
      store.setState({ status: "paused" });
    },

    resume() {
      presenterEngine.resume();
      store.setState({ status: "presenting" });
    },

    replayLine() {
      const idx = store.getState().currentSceneIndex;
      sceneRunner.cancel();
      ++runToken;
      setTimeout(() => runFromScene(idx), 50);
    },

    setVoiceEnabled(enabled) {
      presenterEngine.setVoiceEnabled(!!enabled);
      bus.emit("runtime:voiceChanged", presenterEngine.getVoiceState());
    },

    toggleVoiceEnabled() {
      const enabled = presenterEngine.toggleVoiceEnabled();
      bus.emit("runtime:voiceChanged", presenterEngine.getVoiceState());
      return enabled;
    },

    getVoiceState() {
      return presenterEngine.getVoiceState();
    },

    getState() {
      return store.getState();
    },

    getDeck() {
      return deck;
    },

    subscribe(listener) {
      return store.subscribe(listener);
    },

    getBus() {
      return bus;
    },

    /**
     * Re-point the runtime at a different iframe element without resetting
     * playback state. If the new iframe is already navigated (src matches the
     * current route) there is nothing further to do; otherwise we set its src.
     */
    attachTo(iframeEl) {
      _attachedIframe = iframeEl;
      _attachedRoute = "";  // reset so subscriber navigates the new iframe
      const { route } = store.getState().iframe;
      if (iframeEl && route) {
        _attachedRoute = route;
        iframeEl.src = route;
      }
    },

    /**
     * Semantic alias for goTo — used by split/fullscreen modes to signal
     * "sync the view to this scene index" without implying a hard navigation.
     */
    sync(index) {
      this.goTo(index);
    },
  };
}
