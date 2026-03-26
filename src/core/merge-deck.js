/**
 * mergeDeck — deterministic merge of a contract baseline with a remote override document.
 *
 * Merge semantics:
 *   theme:            shallow merge (null value on key deletes it)
 *   settings:         shallow merge (null value on key deletes it)
 *   sceneOrder:       replace full array when present
 *   scenes:           merge by scene.id
 *   actions:          replace full array
 *   presenter.blocks: replace full array
 *
 * Deletion semantics: null at a key path deletes that override and reverts to baseline.
 * Empty object does not delete. Arrays are always fully replaced.
 */
export function mergeDeck(contractDeck, overrides) {
  if (!overrides || Object.keys(overrides).length === 0) return contractDeck;

  const result = { ...contractDeck };

  // theme: shallow merge
  if (overrides.theme != null) {
    result.theme = { ...contractDeck.theme };
    for (const [k, v] of Object.entries(overrides.theme)) {
      if (v === null) delete result.theme[k];
      else result.theme[k] = v;
    }
  }

  // settings: shallow merge
  if (overrides.settings != null) {
    result.settings = { ...contractDeck.settings };
    for (const [k, v] of Object.entries(overrides.settings)) {
      if (v === null) delete result.settings[k];
      else result.settings[k] = v;
    }
  }

  // Start with contract scene order
  let scenes = [...contractDeck.scenes];

  // sceneOrder: replace full array
  if (Array.isArray(overrides.sceneOrder) && overrides.sceneOrder.length > 0) {
    const map = Object.fromEntries(scenes.map((s) => [s.id, s]));
    const ordered = new Set(overrides.sceneOrder);
    scenes = overrides.sceneOrder.map((id) => map[id]).filter(Boolean);
    // Append any scenes not explicitly listed (safety net)
    for (const s of contractDeck.scenes) {
      if (!ordered.has(s.id)) scenes.push(s);
    }
  }

  // scenes: merge by scene.id
  if (overrides.scenes && typeof overrides.scenes === "object") {
    scenes = scenes.map((scene) => {
      const patch = overrides.scenes[scene.id];
      if (!patch) return scene;

      const next = { ...scene };
      if (patch.title != null)      next.title = patch.title;
      if (patch.editIntent != null) next.editIntent = patch.editIntent;
      if (patch.advance != null)    next.advance = patch.advance;
      if (patch.actions != null)    next.actions = patch.actions; // replace full array
      if (patch.presenter != null) {
        next.presenter = { ...scene.presenter, ...patch.presenter };
        if (patch.presenter.blocks != null) {
          next.presenter.blocks = patch.presenter.blocks; // replace full array
        }
      }
      return next;
    });
  }

  result.scenes = scenes;
  return result;
}
