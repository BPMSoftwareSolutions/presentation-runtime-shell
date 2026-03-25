/**
 * Hash-based router.
 * Patterns support :param segments, e.g. "#/presentation/:id/import".
 * Segment count must match exactly — no ambiguous overlaps.
 */
export function createRouter() {
  const routes = [];
  let currentParams = {};

  /** Split a hash string into clean path segments, ignoring leading #/. */
  function segments(hash) {
    return (hash || "").replace(/^#\/?/, "").split("/").filter(Boolean);
  }

  /**
   * Match a pattern against a hash string.
   * Returns a params object on match, null on miss.
   */
  function match(pattern, hash) {
    const pp = segments(pattern);
    const hp = segments(hash);
    if (pp.length !== hp.length) return null;
    const params = {};
    for (let i = 0; i < pp.length; i++) {
      if (pp[i].startsWith(":")) {
        params[pp[i].slice(1)] = decodeURIComponent(hp[i]);
      } else if (pp[i] !== hp[i]) {
        return null;
      }
    }
    return params;
  }

  function dispatch() {
    const hash = location.hash || "#/library";
    for (const { pattern, handler } of routes) {
      const params = match(pattern, hash);
      if (params !== null) {
        currentParams = params;
        handler(params);
        return;
      }
    }
  }

  return {
    /**
     * Register a route handler.
     * @param {string} pattern  e.g. "#/library" or "#/presentation/:id"
     * @param {function} handler  called with params object on match
     */
    on(pattern, handler) {
      routes.push({ pattern, handler });
    },

    /**
     * Navigate to a hash.
     * If the hash is already current, forces a re-dispatch (same-route navigation).
     */
    navigate(hash) {
      if (location.hash === hash) {
        dispatch();
      } else {
        location.hash = hash;
      }
    },

    /** Returns a copy of the params parsed from the current hash. */
    getParams() {
      return { ...currentParams };
    },

    /** Bind hashchange listener and fire the initial route. */
    start() {
      window.addEventListener("hashchange", dispatch);
      dispatch();
    },
  };
}
