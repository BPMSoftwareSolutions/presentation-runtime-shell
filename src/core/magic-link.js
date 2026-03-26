// ── UTF-8-safe base64url encode / decode ────────────────────────────────────

function encodePayload(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodePayload(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

// ── Per-field value validators ───────────────────────────────────────────────

const SETTINGS_VALIDATORS = {
  presentControlsPosition:     (v) => ["top", "bottom"].includes(v),
  playbackMode:                (v) => ["interactive", "autoplay", "capture"].includes(v),
  typingSpeedMs:               (v) => Number.isFinite(v) && v >= 0,
  betweenScenesMs:             (v) => Number.isFinite(v) && v >= 0,
  autoAdvance:                 (v) => typeof v === "boolean",
  startDelayMs:                (v) => Number.isFinite(v) && v >= 0,
  endCardDurationMs:           (v) => Number.isFinite(v) && v >= 0,
  waitForIframeReadyTimeoutMs: (v) => Number.isFinite(v) && v > 0,
};

const THEME_VALIDATORS = {
  accent:            (v) => typeof v === "string" && v.length > 0,
  shell:             (v) => ["dark", "light"].includes(v),
  presenterPosition: (v) => ["left", "right"].includes(v),
};

// filterPreset is a scalar string token. Introduce a new key if structured
// filter state is ever needed rather than changing this type.
const DEMO_VALIDATORS = {
  tenant:       (v) => typeof v === "string" && v.length > 0,
  incidentId:   (v) => typeof v === "string" && v.length > 0,
  scenario:     (v) => typeof v === "string" && v.length > 0,
  filterPreset: (v) => typeof v === "string" && v.length > 0,
};

// ── Sanitizer ────────────────────────────────────────────────────────────────
// Valid keys are kept; unknown keys and keys whose values fail validation are
// silently dropped. The function never returns a partial error — it returns a
// (possibly empty) config object or, if called from the parser, null on decode
// failure.

function sanitize(parsed) {
  const out = {};

  if (parsed.settings && typeof parsed.settings === "object") {
    const entries = Object.entries(parsed.settings)
      .filter(([k, v]) => k in SETTINGS_VALIDATORS && SETTINGS_VALIDATORS[k](v));
    if (entries.length) out.settings = Object.fromEntries(entries);
  }

  if (parsed.theme && typeof parsed.theme === "object") {
    const entries = Object.entries(parsed.theme)
      .filter(([k, v]) => k in THEME_VALIDATORS && THEME_VALIDATORS[k](v));
    if (entries.length) out.theme = Object.fromEntries(entries);
  }

  if (parsed.demo && typeof parsed.demo === "object") {
    const entries = Object.entries(parsed.demo)
      .filter(([k, v]) => k in DEMO_VALIDATORS && DEMO_VALIDATORS[k](v));
    if (entries.length) out.demo = Object.fromEntries(entries);
  }

  return out;
}

// ── Parser ───────────────────────────────────────────────────────────────────

export function readMagicLinkConfig(hash) {
  const qIndex = (hash || "").indexOf("?");
  if (qIndex === -1) return null;

  const params = new URLSearchParams(hash.slice(qIndex + 1));
  const raw = params.get("cfg");
  if (!raw) return null;

  try {
    const parsed = decodePayload(raw);
    return sanitize(parsed);
  } catch {
    return null; // malformed — caller falls back to contract baseline
  }
}

// ── Merge ────────────────────────────────────────────────────────────────────
// Always returns a fresh object so downstream code cannot accidentally mutate
// the original contractDeck in place.

export function mergeDeck(contractDeck, urlOverrides) {
  if (!urlOverrides) {
    return {
      deck: {
        ...contractDeck,
        settings: { ...(contractDeck.settings || {}) },
        theme:    { ...(contractDeck.theme    || {}) },
      },
      demoOverrides: null,
    };
  }

  return {
    deck: {
      ...contractDeck,
      settings: {
        ...contractDeck.settings,
        ...(urlOverrides.settings || {}),
      },
      theme: {
        ...contractDeck.theme,
        ...(urlOverrides.theme || {}),
      },
    },
    demoOverrides: urlOverrides.demo || null,
  };
}

// ── Builder ──────────────────────────────────────────────────────────────────

const SHAREABLE_SETTINGS = new Set([
  "presentControlsPosition", "playbackMode", "typingSpeedMs",
  "betweenScenesMs", "autoAdvance", "startDelayMs", "endCardDurationMs",
]);

const SHAREABLE_THEME = new Set(["accent", "shell", "presenterPosition"]);

const MAGIC_LINK_WARN_LENGTH = 1800;

/**
 * Build a magic link URL.
 *
 * @param {string} baseUrl          - e.g. `${location.origin}${location.pathname}`
 * @param {string} deckId
 * @param {{ settings?: object, theme?: object, demoOverrides?: object|null }} [shareableConfig]
 * @returns {string} Full URL. Omits `?cfg=` entirely when there are no shareable overrides.
 */
export function buildMagicLink(baseUrl, deckId, shareableConfig = {}) {
  const { settings = {}, theme = {}, demoOverrides = null } = shareableConfig;
  const payload = {};

  const filteredSettings = Object.fromEntries(
    Object.entries(settings).filter(([k]) => SHAREABLE_SETTINGS.has(k))
  );
  if (Object.keys(filteredSettings).length) payload.settings = filteredSettings;

  const filteredTheme = Object.fromEntries(
    Object.entries(theme).filter(([k]) => SHAREABLE_THEME.has(k))
  );
  if (Object.keys(filteredTheme).length) payload.theme = filteredTheme;

  if (demoOverrides && Object.keys(demoOverrides).length) {
    payload.demo = demoOverrides;
  }

  const base = `${baseUrl}#/present/${encodeURIComponent(deckId)}`;

  if (!Object.keys(payload).length) return base;

  const link = `${base}?cfg=${encodePayload(payload)}`;

  if (link.length > MAGIC_LINK_WARN_LENGTH) {
    console.warn(
      `Magic link for "${deckId}" is ${link.length} chars (threshold: ${MAGIC_LINK_WARN_LENGTH}). ` +
      "Consider enabling compressed links (Option C) or reducing payload."
    );
  }

  return link;
}
