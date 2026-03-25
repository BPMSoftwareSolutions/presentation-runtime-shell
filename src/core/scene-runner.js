function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createSceneRunner({ bus, store, presenterEngine, getIframeEl }) {
  let cancelRequested = false;
  let advanceResolver = null;

  async function waitForIframeReady(timeoutMs = 8000) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        off();
        resolve({ timeout: true });
      }, timeoutMs);

      const off = bus.on("iframe:ready", () => {
        clearTimeout(timer);
        off();
        resolve({ ready: true });
      });
    });
  }

  async function waitForAdvance(advance) {
    const type = advance?.type || "manual";

    if (type === "auto") return;

    if (type === "delay") {
      const totalMs = advance.delayMs ?? 1000;
      const tickMs = 100;
      const startTime = Date.now();
      store.setState({ countdown: { remainingMs: totalMs, totalMs } });

      while (true) {
        await sleep(tickMs);
        if (cancelRequested) {
          store.setState({ countdown: null });
          return;
        }
        const elapsed = Date.now() - startTime;
        const remainingMs = Math.max(0, totalMs - elapsed);
        store.setState({ countdown: { remainingMs, totalMs } });
        if (remainingMs <= 0) break;
      }

      store.setState({ countdown: null });
      return;
    }

    store.setState({ controls: { canNext: true } });

    return new Promise((resolve) => {
      let done = false;

      function finish() {
        if (done) return;
        done = true;
        advanceResolver = null;
        offAdvance();
        if (offEvent) offEvent();
        store.setState({ controls: { canNext: false } });
        resolve();
      }

      advanceResolver = finish;
      const offAdvance = bus.on("runtime:advance", finish);

      let offEvent = null;
      if (type === "waitForEvent" && advance.event) {
        offEvent = bus.on(advance.event, finish);
      }
    });
  }

  async function runActions(actions) {
    for (const action of actions) {
      if (cancelRequested) return;

      // Pure delay — no inter-action sleep added
      if (action.type === "delay") {
        await sleep(action.ms ?? 200);
        continue;
      }

      const frameEl = typeof getIframeEl === "function"
        ? getIframeEl()
        : document.getElementById("experience-frame");

      if (action.type === "postMessage" && frameEl?.contentWindow) {
        frameEl.contentWindow.postMessage(
          { type: action.event, payload: action.payload },
          "*"
        );
      }

      if ((action.type === "reveal" || action.type === "revealGroup") && frameEl?.contentWindow) {
        frameEl.contentWindow.postMessage(
          { type: action.type, selector: action.selector },
          "*"
        );
      }

      await sleep(50); // brief yield after each iframe message
    }
  }

  async function run(scene) {
    cancelRequested = false;

    store.setState({ status: "loading-scene", iframe: { isReady: false } });
    bus.emit("scene:start", { sceneId: scene.id });

    // Set route in state — dom-renderer navigates the iframe
    store.setState({ iframe: { route: scene.content.route } });

    if (cancelRequested) return { cancelled: true };

    if (scene.content.waitForReady) {
      store.setState({ status: "waiting-iframe" });
      await waitForIframeReady(8000);
      if (cancelRequested) return { cancelled: true };
    }

    store.setState({ iframe: { isReady: true } });

    await runActions(scene.actions || []);
    if (cancelRequested) return { cancelled: true };

    store.setState({ status: "presenting" });
    await presenterEngine.play(scene.presenter);
    if (cancelRequested) return { cancelled: true };

    store.setState({ status: "waiting-advance" });
    await waitForAdvance(scene.advance);
    if (cancelRequested) return { cancelled: true };

    return { cancelled: false };
  }

  function advance() {
    bus.emit("runtime:advance");
  }

  function cancel() {
    cancelRequested = true;
    presenterEngine.cancel();
    const r = advanceResolver;
    advanceResolver = null;
    if (r) r();
  }

  return { run, advance, cancel };
}
