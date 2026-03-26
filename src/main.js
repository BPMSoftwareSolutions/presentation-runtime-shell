import { createRouter }          from "./core/router.js";
import { createLibraryStore }    from "./core/library-store.js";
import { createSharedDeckStore } from "./core/shared-deck-store.js";
import { mountAppShell }         from "./ui/app-shell.js";
import { mountLibrary }          from "./screens/library.js";
import { mountWorkspace }        from "./screens/workspace.js";
import { mountImportScene }      from "./screens/import-scene.js";

function parsePresentId(hash) {
  const match = /^#\/present\/([^/?#]+)$/.exec(hash || "");
  if (!match) return null;

  try {
    const id = decodeURIComponent(match[1]);
    if (!id || id.includes("/")) return null;
    return id;
  } catch {
    return null;
  }
}

let _presentSession = null;

async function bootPresentMode(id, store, sharedDeckStore) {
  const appEl = document.getElementById("app");
  if (!appEl) return;

  if (_presentSession?.destroy) {
    _presentSession.destroy();
    _presentSession = null;
  }

  const { mountPresent } = await import("./screens/present.js");
  _presentSession = mountPresent({ id, store, sharedDeckStore, rootEl: appEl });
}

/**
 * Seed a single deck from a JSON contract path if it isn't already in the store.
 * Keyed by deck id so re-runs are idempotent and new decks are added without
 * clearing existing ones.
 */
async function seedDeck(store, path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return;
    const deck = await res.json();
    if (!store.getById(deck.id)) {
      store.create(deck);
    } else {
      // Sync editIntent from contract into existing scenes where it's missing
      const existing = store.getById(deck.id);
      (deck.scenes || []).forEach(contractScene => {
        if (!contractScene.editIntent) return;
        const stored = existing.scenes.find(s => s.id === contractScene.id);
        if (stored && !stored.editIntent) {
          store.updateScene(deck.id, stored.id, { editIntent: contractScene.editIntent });
        }
      });
    }
  } catch {
    // fetch failed — skip silently
  }
}

async function seedIfEmpty(store) {
  try {
    const res = await fetch("./src/contracts/manifest.json");
    if (res.ok) {
      const paths = await res.json();
      for (const path of paths) await seedDeck(store, path);
    }
  } catch {
    // manifest fetch failed — skip silently
  }
  // Fallback: if all fetches failed and store is still empty, add a blank deck
  if (store.getAll().length === 0) {
    store.create({ title: "Demo Presentation" });
  }
}

async function boot() {
  const store           = createLibraryStore();
  const sharedDeckStore = await createSharedDeckStore();
  await seedIfEmpty(store);

  const presentId = parsePresentId(location.hash);
  if (presentId) {
    await bootPresentMode(presentId, store, sharedDeckStore);
    return;
  }

  const router = createRouter();
  const shell  = mountAppShell({ store, router });

  router.on("#/library", () => {
    shell.setScreen(() => mountLibrary({ store, router, shell }));
  });

  router.on("#/presentation/:id", ({ id }) => {
    shell.setScreen(() => mountWorkspace({ id, store, sharedDeckStore, router, shell }));
  });

  router.on("#/presentation/:id/import", ({ id }) => {
    shell.setScreen(() => mountImportScene({ id, store, router, shell }));
  });

  router.start();
}

boot().catch(console.error);
