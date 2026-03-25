export function createEventBus() {
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
