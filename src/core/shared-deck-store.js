const SHARED_OVERRIDES_PATH = "./src/contracts/shared-overrides.json";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeState(state) {
  if (!state || typeof state !== "object") {
    return { presentations: {} };
  }

  const presentations = state.presentations;
  if (!presentations || typeof presentations !== "object" || Array.isArray(presentations)) {
    return { presentations: {} };
  }

  return { presentations: clone(presentations) };
}

/**
 * Merge a patch into an existing override document.
 * Handles the override document shape:
 *   settings:   shallow merge
 *   theme:      shallow merge
 *   sceneOrder: replace full array
 *   scenes:     keyed by scene.id; shallow merge per scene entry
 */
function applyPatch(current, patch) {
  if (!patch || typeof patch !== "object") return clone(current);

  const next = clone(current);

  if (patch.settings) {
    next.settings = { ...(current.settings || {}), ...patch.settings };
  }
  if (patch.theme) {
    next.theme = { ...(current.theme || {}), ...patch.theme };
  }
  if (patch.sceneOrder !== undefined) {
    next.sceneOrder = patch.sceneOrder;
  }
  if (patch.scenes) {
    const currentScenes = current.scenes || {};
    const nextScenes = { ...currentScenes };
    for (const [sceneId, scenePatch] of Object.entries(patch.scenes)) {
      const currentScene = currentScenes[sceneId] || {};
      const mergedScene = { ...currentScene, ...scenePatch };
      // presenter.blocks: merge presenter object, preserve blocks replace semantics
      if (scenePatch.presenter) {
        mergedScene.presenter = {
          ...(currentScene.presenter || {}),
          ...scenePatch.presenter,
        };
      }
      nextScenes[sceneId] = mergedScene;
    }
    next.scenes = nextScenes;
  }

  return next;
}

export async function createSharedDeckStore() {
  let state = { presentations: {} };

  try {
    const response = await fetch(SHARED_OVERRIDES_PATH, { cache: "no-store" });
    if (response.ok) {
      state = normalizeState(await response.json());
    }
  } catch {
    state = { presentations: {} };
  }

  function getPresentationOverrides(id) {
    const entry = state.presentations[id];
    return entry ? clone(entry) : {};
  }

  function getSettings(id) {
    const settings = state.presentations[id]?.settings;
    return settings ? clone(settings) : {};
  }

  function updatePresentation(id, patch) {
    const current = state.presentations[id] || {};
    const next = applyPatch(current, patch);

    state = {
      ...state,
      presentations: {
        ...state.presentations,
        [id]: next,
      },
    };

    return clone(next);
  }

  function importState(nextState) {
    state = normalizeState(nextState);
    return clone(state);
  }

  function exportState() {
    return clone(state);
  }

  return {
    exportState,
    getPresentationOverrides,
    getSettings,
    importState,
    updatePresentation,
  };
}
