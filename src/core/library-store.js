/**
 * LibraryStore — all presentation data, persisted to localStorage.
 *
 * Every write round-trips through JSON.parse/stringify to prevent
 * shared-reference bugs between callers and internal state.
 */

const STORAGE_KEY = "prs_library";

const DEFAULT_SETTINGS = {
  typingSpeedMs: 24,
  playbackMode: "interactive",
  betweenScenesMs: 1800,
  waitForIframeReadyTimeoutMs: 8000,
  presentControlsPosition: "bottom",
  startDelayMs: 0,
  endCardDurationMs: 0,
};

const DEFAULT_THEME = {
  shell: "dark",
  accent: "violet",
  presenterPosition: "left",
};

const DEFAULT_SCENE_SHAPE = {
  type: "narrative",
  presenter: { mode: "thinking", blocks: [] },
  content: { route: "", waitForReady: false, reloadOnEnter: false },
  actions: [],
  advance: { type: "manual" },
  editIntent: "",
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { presentations: [] };
  } catch {
    return { presentations: [] };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

export function createLibraryStore() {
  let state = loadState();

  // ── Read ─────────────────────────────────────────────────────────────────

  /** All presentations sorted by updatedAt descending. */
  function getAll() {
    return clone(state.presentations).sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }

  /** Single presentation by id, or null. */
  function getById(id) {
    const p = state.presentations.find((p) => p.id === id);
    return p ? clone(p) : null;
  }

  /** Filter by title and tags (case-insensitive). */
  function search(query) {
    if (!query || !query.trim()) return getAll();
    const q = query.toLowerCase();
    return getAll().filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }

  // ── Write helpers ─────────────────────────────────────────────────────────

  function persist(presentations) {
    state = { ...state, presentations };
    saveState(state);
  }

  function updateById(id, partial) {
    persist(
      state.presentations.map((p) =>
        p.id === id
          ? { ...p, ...partial, updatedAt: new Date().toISOString() }
          : p
      )
    );
  }

  // ── Presentation CRUD ─────────────────────────────────────────────────────

  /**
   * Create a new presentation.
   * Pass overrides to seed from an existing contract (e.g. demo-deck.json).
   * Returns the new presentation.
   */
  function create(overrides = {}) {
    const now = new Date().toISOString();
    const presentation = {
      id: overrides.id || crypto.randomUUID(),
      title: overrides.title || "Untitled Presentation",
      status: overrides.status || "draft",
      tags: overrides.tags || [],
      collections: overrides.collections || [],
      createdAt: overrides.createdAt || now,
      updatedAt: overrides.updatedAt || now,
      settings: { ...DEFAULT_SETTINGS, ...(overrides.settings || {}) },
      theme: { ...DEFAULT_THEME, ...(overrides.theme || {}) },
      scenes: clone(overrides.scenes || []),
    };
    persist([...state.presentations, presentation]);
    return clone(presentation);
  }

  /** Merge partial into a presentation and bump updatedAt. */
  function update(id, partial) {
    updateById(id, partial);
  }

  /** Deep copy with a new id; title gets " (copy)" suffix. */
  function duplicate(id) {
    const original = getById(id);
    if (!original) return null;
    const now = new Date().toISOString();
    return create({
      ...original,
      id: crypto.randomUUID(),
      title: `${original.title} (copy)`,
      createdAt: now,
      updatedAt: now,
    });
  }

  /** Set status to "archived". */
  function archive(id) {
    updateById(id, { status: "archived" });
  }

  /** Permanently remove a presentation. */
  function remove(id) {
    persist(state.presentations.filter((p) => p.id !== id));
  }

  // ── Scene operations ──────────────────────────────────────────────────────

  /**
   * Internal helper: apply a transform to a presentation's scenes array
   * and persist. Also bumps updatedAt on the presentation.
   */
  function mutateScenes(presentationId, transform) {
    const p = state.presentations.find((p) => p.id === presentationId);
    if (!p) return;
    const scenes = transform(clone(p.scenes));
    updateById(presentationId, { scenes });
  }

  /** Append a new scene. Returns the new scene. */
  function addScene(presentationId, overrides = {}) {
    const scene = {
      ...DEFAULT_SCENE_SHAPE,
      id: crypto.randomUUID(),
      title: "New Scene",
      ...overrides,
    };
    mutateScenes(presentationId, (scenes) => [...scenes, scene]);
    return clone(scene);
  }

  /** Merge partial into a scene. */
  function updateScene(presentationId, sceneId, partial) {
    mutateScenes(presentationId, (scenes) =>
      scenes.map((s) => (s.id === sceneId ? { ...s, ...partial } : s))
    );
  }

  /** Remove a scene by id. */
  function removeScene(presentationId, sceneId) {
    mutateScenes(presentationId, (scenes) =>
      scenes.filter((s) => s.id !== sceneId)
    );
  }

  /**
   * Reorder scenes to match the provided id array.
   * Any ids not in orderedIds are dropped; any missing are ignored.
   */
  function reorderScenes(presentationId, orderedIds) {
    mutateScenes(presentationId, (scenes) => {
      const map = Object.fromEntries(scenes.map((s) => [s.id, s]));
      return orderedIds.map((id) => map[id]).filter(Boolean);
    });
  }

  /**
   * Duplicate a scene, inserting the copy immediately after the original.
   * Returns the new scene.
   */
  function duplicateScene(presentationId, sceneId) {
    const p = getById(presentationId);
    if (!p) return null;
    const original = p.scenes.find((s) => s.id === sceneId);
    if (!original) return null;
    const copy = {
      ...clone(original),
      id: crypto.randomUUID(),
      title: `${original.title} (copy)`,
    };
    mutateScenes(presentationId, (scenes) => {
      const idx = scenes.findIndex((s) => s.id === sceneId);
      const next = [...scenes];
      next.splice(idx + 1, 0, copy);
      return next;
    });
    return clone(copy);
  }

  /**
   * Import (copy) a scene into a target presentation.
   *
   * placement: { mode: "after" | "replace", targetSceneId?: string }
   *   "after"   — insert after targetSceneId, or append if not provided
   *   "replace" — swap out targetSceneId with the copy
   *
   * Always deep-copies the scene and assigns a new id.
   * Returns the imported copy.
   */
  function importScene(targetPresentationId, scene, placement) {
    const copy = { ...clone(scene), id: crypto.randomUUID() };
    const { mode, targetSceneId } = placement || {};

    if (mode === "replace" && targetSceneId) {
      mutateScenes(targetPresentationId, (scenes) =>
        scenes.map((s) => (s.id === targetSceneId ? copy : s))
      );
    } else {
      mutateScenes(targetPresentationId, (scenes) => {
        if (targetSceneId) {
          const idx = scenes.findIndex((s) => s.id === targetSceneId);
          if (idx >= 0) {
            const next = [...scenes];
            next.splice(idx + 1, 0, copy);
            return next;
          }
        }
        return [...scenes, copy];
      });
    }

    return clone(copy);
  }

  return {
    // Presentations
    getAll,
    getById,
    search,
    create,
    update,
    duplicate,
    archive,
    delete: remove,
    // Scenes
    addScene,
    updateScene,
    removeScene,
    reorderScenes,
    duplicateScene,
    importScene,
  };
}
