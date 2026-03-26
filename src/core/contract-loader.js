function normalizeScene(scene) {
  return {
    id: scene.id || `scene-${Math.random().toString(36).slice(2)}`,
    title: scene.title || "Untitled Scene",
    presenter: {
      mode: scene.presenter?.mode || "thinking",
      blocks: scene.presenter?.blocks || [],
    },
    content: {
      route: scene.content?.route || "about:blank",
      waitForReady: scene.content?.waitForReady ?? false,
      reloadOnEnter: scene.content?.reloadOnEnter ?? false,
    },
    actions: scene.actions || [],
    advance: scene.advance || { type: "manual" },
    editIntent: scene.editIntent || "",
  };
}

function normalizeContract(deck) {
  return {
    id: deck.id || "untitled-deck",
    title: deck.title || "Untitled Deck",
    theme: {
      shell: "dark",
      accent: "violet",
      presenterPosition: "left",
      ...deck.theme,
    },
    settings: {
      typingSpeedMs: 24,
      autoAdvance: false,
      waitForIframeReadyTimeoutMs: 8000,
      ...deck.settings,
    },
    scenes: (deck.scenes || []).map(normalizeScene),
  };
}

/**
 * Scan the manifest and return the normalized contract whose id matches.
 * Returns null if not found or on any fetch error.
 */
export async function loadContractById(id) {
  try {
    const manifestRes = await fetch("./src/contracts/manifest.json");
    if (!manifestRes.ok) return null;
    const paths = await manifestRes.json();
    for (const path of paths) {
      try {
        const contract = await loadContract(path);
        if (contract.id === id) return contract;
      } catch {
        // skip failed contract paths
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function loadContract(url, fallback = null) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return normalizeContract(data);
  } catch (err) {
    if (fallback) return normalizeContract(fallback);
    throw err;
  }
}
