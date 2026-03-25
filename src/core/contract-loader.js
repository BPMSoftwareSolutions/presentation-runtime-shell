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
