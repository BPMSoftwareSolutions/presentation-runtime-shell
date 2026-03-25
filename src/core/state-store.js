export function createStore(initialState) {
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
