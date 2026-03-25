function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

import { createVoiceOverEngine } from "./voice-over.js";

export function createPresenterEngine({ bus, store, getTypingSpeed }) {
  let cancelRequested = false;
  let skipRequested = false;
  let pauseRequested = false;
  let playToken = 0;
  let _resumeResolve = null;
  const voice = createVoiceOverEngine();

  function resetFlags() {
    cancelRequested = false;
    skipRequested = false;
    pauseRequested = false;
    _resumeResolve = null;
  }

  async function waitWhilePaused() {
    if (!pauseRequested) return;
    await new Promise(resolve => { _resumeResolve = resolve; });
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

      await waitWhilePaused();
      if (cancelRequested) return { cancelled: true };

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
    const blockTexts = blocks.map((b) => b?.text || "");

    store.setState({
      presenter: {
        mode,
        text: "",
        isTyping: false,
      },
    });

    bus.emit("presenter:start", { mode });
    voice.prime(blockTexts);

    for (let index = 0; index < blocks.length; index += 1) {
      if (cancelRequested || token !== playToken) {
        return { cancelled: true };
      }

      const block = blocks[index];
      const text = block?.text || "";

      bus.emit("presenter:blockStart", { index, text, mode });
      void voice.speak(text);

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
    pauseRequested = false;
    if (_resumeResolve) { _resumeResolve(); _resumeResolve = null; }
    voice.stop();
    store.setState({ presenter: { isTyping: false } });
    bus.emit("presenter:skip");
  }

  function cancel() {
    cancelRequested = true;
    pauseRequested = false;
    if (_resumeResolve) { _resumeResolve(); _resumeResolve = null; }
    playToken += 1;
    voice.stop();
    store.setState({ presenter: { isTyping: false } });
    bus.emit("presenter:cancel");
  }

  function pause() {
    pauseRequested = true;
    voice.pause();
    bus.emit("presenter:pause");
  }

  function resume() {
    pauseRequested = false;
    if (_resumeResolve) { _resumeResolve(); _resumeResolve = null; }
    voice.resume();
    bus.emit("presenter:resume");
  }

  return {
    play,
    skip,
    cancel,
    pause,
    resume,
    setVoiceEnabled: voice.setEnabled,
    toggleVoiceEnabled: voice.toggleEnabled,
    getVoiceState: voice.getState,
  };
}
