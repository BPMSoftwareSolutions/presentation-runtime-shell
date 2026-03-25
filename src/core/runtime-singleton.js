/**
 * Runtime singleton.
 *
 * Keeps a single DeckRuntime instance alive across screen transitions
 * and mode switches. Use get/set/clear instead of window._runtime to
 * keep the global access intentional and easy to trace.
 */

let _runtime = null;

export function getRuntime() {
  return _runtime;
}

export function setRuntime(runtime) {
  _runtime = runtime;
}

export function clearRuntime() {
  _runtime = null;
}
