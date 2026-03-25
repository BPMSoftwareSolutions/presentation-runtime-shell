/**
 * Binds transport button elements to a DeckRuntime instance.
 * Handles click wiring and state-driven button/counter updates.
 */
export function createTransportController(runtime, elements, getTotal) {
  const {
    firstBtn,
    prevBtn,
    nextBtn,
    lastBtn,
    playPauseBtn,
    counterEl,
  } = elements;

  const removers = [];

  function on(el, type, handler) {
    if (!el) return;
    el.addEventListener(type, handler);
    removers.push(() => el.removeEventListener(type, handler));
  }

  on(firstBtn, "click", () => runtime.goTo(0));
  on(prevBtn, "click", () => runtime.previous());
  on(nextBtn, "click", () => runtime.next());
  on(lastBtn, "click", () => {
    const total = getTotal();
    if (total > 0) runtime.goTo(total - 1);
  });

  if (playPauseBtn) {
    on(playPauseBtn, "click", () => {
      const s = runtime.getState();
      if (s.status === "presenting") runtime.pause();
      else if (s.status === "paused") runtime.resume();
      else runtime.next();
    });
  }

  const unsub = runtime.subscribe((state) => {
    const total = getTotal();
    const idx = state.currentSceneIndex;
    const isPresenting = state.status === "presenting";
    const isPaused = state.status === "paused";
    const validIdx = Number.isInteger(idx) && idx >= 0;

    if (firstBtn) firstBtn.disabled = !validIdx || idx <= 0;
    if (prevBtn) prevBtn.disabled = !validIdx || idx <= 0;
    if (nextBtn) nextBtn.disabled = !validIdx || idx >= total - 1;
    if (lastBtn) lastBtn.disabled = !validIdx || idx >= total - 1;
    if (counterEl) {
      counterEl.textContent = validIdx ? `${idx + 1} / ${total}` : `— / ${total}`;
    }

    if (playPauseBtn) {
      playPauseBtn.textContent = isPresenting ? "⏸" : "▶";
      playPauseBtn.title = isPresenting ? "Pause" : isPaused ? "Resume" : "Advance";
    }
  });

  let disposed = false;
  return {
    unbind() {
      if (disposed) return;
      disposed = true;
      unsub();
      removers.forEach((remove) => remove());
    },
  };
}
