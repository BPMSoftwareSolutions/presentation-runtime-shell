import { createRouter }       from "./core/router.js";
import { createLibraryStore } from "./core/library-store.js";
import { loadContract }       from "./core/contract-loader.js";
import { readMagicLinkConfig, mergeDeck } from "./core/magic-link.js";
import { mountAppShell }      from "./ui/app-shell.js";
import { mountLibrary }       from "./screens/library.js";
import { mountWorkspace }     from "./screens/workspace.js";
import { mountImportScene }   from "./screens/import-scene.js";

// ALLOW_PRESENT_LOCAL_FALLBACK defaults to false.
// Enable temporarily during rollout only if a specific deck has no contract
// file yet. Set back to false once contract coverage is complete, then delete
// this flag and the fallback branch entirely.
const ALLOW_PRESENT_LOCAL_FALLBACK = false;

function parsePresentId(hash) {
  // Accept an optional query string after the id segment (e.g. ?cfg=...)
  const match = /^#\/present\/([^/?#]+)/.exec(hash || "");
  if (!match) return null;

  try {
    const id = decodeURIComponent(match[1]);
    if (!id || id.includes("/")) return null;
    return { id, rawHash: hash };
  } catch {
    return null;
  }
}

let _presentSession = null;

async function bootPresentMode({ id, rawHash }, store) {
  const appEl = document.getElementById("app");
  if (!appEl) return;

  if (_presentSession?.destroy) {
    _presentSession.destroy();
    _presentSession = null;
  }

  const contractUrl = `./src/contracts/${encodeURIComponent(id)}.json`;
  let contractDeck;
  try {
    contractDeck = await loadContract(contractUrl);
  } catch {
    if (ALLOW_PRESENT_LOCAL_FALLBACK) {
      contractDeck = store.getById(id);
    }
  }

  if (!contractDeck) {
    appEl.innerHTML = `<div class="ps-not-found">Presentation not found.</div>`;
    return;
  }

  const urlOverrides = readMagicLinkConfig(rawHash);
  const { deck, demoOverrides } = mergeDeck(contractDeck, urlOverrides);

  const { mountPresent } = await import("./screens/present.js");
  _presentSession = mountPresent({ id, deck, demoOverrides, store, rootEl: appEl });
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
      // Sync contract scene metadata into existing decks when IDs align so
      // route refactors do not leave stale localStorage pointers.
      const existing = store.getById(deck.id);
      const existingIds = (existing.scenes || []).map((s) => s.id);
      const contractIds = (deck.scenes || []).map((s) => s.id);
      const sameSceneShape =
        existingIds.length === contractIds.length &&
        existingIds.every((id, idx) => id === contractIds[idx]);

      if (sameSceneShape) {
        (deck.scenes || []).forEach((contractScene) => {
          const stored = existing.scenes.find((s) => s.id === contractScene.id);
          if (!stored) return;

          const patch = {};
          if (stored.title !== contractScene.title) patch.title = contractScene.title;
          if (stored.type !== contractScene.type) patch.type = contractScene.type;

          const storedRoute = stored.content?.route || "";
          const contractRoute = contractScene.content?.route || "";
          if (storedRoute !== contractRoute) {
            patch.content = {
              ...(stored.content || {}),
              route: contractRoute,
              waitForReady: contractScene.content?.waitForReady ?? stored.content?.waitForReady ?? false,
              reloadOnEnter: contractScene.content?.reloadOnEnter ?? stored.content?.reloadOnEnter ?? false,
            };
          }

          if (Object.keys(patch).length) {
            store.updateScene(deck.id, stored.id, patch);
          }
        });
      }

      // Sync editIntent from contract into existing scenes where it's missing
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
  const store  = createLibraryStore();
  await seedIfEmpty(store);

  const presentTarget = parsePresentId(location.hash);
  if (presentTarget) {
    await bootPresentMode(presentTarget, store);
    return;
  }

  const router = createRouter();
  const shell  = mountAppShell({ store, router });

  router.on("#/library", () => {
    shell.setScreen(() => mountLibrary({ store, router, shell }));
  });

  router.on("#/presentation/:id", ({ id }) => {
    shell.setScreen(() => mountWorkspace({ id, store, router, shell }));
  });

  router.on("#/presentation/:id/import", ({ id }) => {
    shell.setScreen(() => mountImportScene({ id, store, router, shell }));
  });

  router.start();
}

boot().catch(console.error);
