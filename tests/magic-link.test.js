import { test } from "node:test";
import assert from "node:assert/strict";

import {
  readMagicLinkConfig,
  mergeDeck,
  buildMagicLink,
} from "../src/core/magic-link.js";

// ── Helpers ──────────────────────────────────────────────────────────────────

function encodePayload(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function hashOf(url) {
  return new URL(url).hash;
}

// ── readMagicLinkConfig ───────────────────────────────────────────────────────

test("readMagicLinkConfig: returns null when hash has no query string", () => {
  assert.equal(readMagicLinkConfig("#/present/foo"), null);
});

test("readMagicLinkConfig: returns null when hash has query string but no cfg param", () => {
  assert.equal(readMagicLinkConfig("#/present/foo?other=val"), null);
});

test("readMagicLinkConfig: returns null on malformed base64", () => {
  assert.equal(readMagicLinkConfig("#/present/foo?cfg=!!!notbase64!!!"), null);
});

test("readMagicLinkConfig: returns null on valid base64 but invalid JSON", () => {
  const bad = btoa("not json").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  assert.equal(readMagicLinkConfig(`#/present/foo?cfg=${bad}`), null);
});

test("readMagicLinkConfig: decodes a valid settings payload", () => {
  const cfg = encodePayload({ settings: { playbackMode: "autoplay", typingSpeedMs: 10 } });
  const result = readMagicLinkConfig(`#/present/foo?cfg=${cfg}`);
  assert.deepEqual(result?.settings, { playbackMode: "autoplay", typingSpeedMs: 10 });
});

test("readMagicLinkConfig: drops unknown settings keys, keeps valid ones", () => {
  const cfg = encodePayload({ settings: { playbackMode: "interactive", unknownKey: "yes" } });
  const result = readMagicLinkConfig(`#/present/foo?cfg=${cfg}`);
  assert.deepEqual(result?.settings, { playbackMode: "interactive" });
  assert.equal("unknownKey" in (result?.settings ?? {}), false);
});

test("readMagicLinkConfig: drops settings key with wrong value type (typingSpeedMs: string)", () => {
  const cfg = encodePayload({ settings: { typingSpeedMs: "fast", autoAdvance: true } });
  const result = readMagicLinkConfig(`#/present/foo?cfg=${cfg}`);
  assert.equal("typingSpeedMs" in (result?.settings ?? {}), false);
  assert.equal(result?.settings?.autoAdvance, true);
});

test("readMagicLinkConfig: drops settings key with invalid enum value", () => {
  const cfg = encodePayload({ settings: { playbackMode: "sideways" } });
  const result = readMagicLinkConfig(`#/present/foo?cfg=${cfg}`);
  assert.equal("playbackMode" in (result?.settings ?? {}), false);
});

test("readMagicLinkConfig: drops theme key with invalid enum value (shell: banana)", () => {
  const cfg = encodePayload({ theme: { shell: "banana", presenterPosition: "left" } });
  const result = readMagicLinkConfig(`#/present/foo?cfg=${cfg}`);
  assert.equal("shell" in (result?.theme ?? {}), false);
  assert.equal(result?.theme?.presenterPosition, "left");
});

test("readMagicLinkConfig: keeps valid theme values", () => {
  const cfg = encodePayload({ theme: { shell: "dark", presenterPosition: "right", accent: "violet" } });
  const result = readMagicLinkConfig(`#/present/foo?cfg=${cfg}`);
  assert.deepEqual(result?.theme, { shell: "dark", presenterPosition: "right", accent: "violet" });
});

test("readMagicLinkConfig: keeps known demo keys with valid string values", () => {
  const cfg = encodePayload({ demo: { tenant: "Acme Corp", incidentId: "INC-001" } });
  const result = readMagicLinkConfig(`#/present/foo?cfg=${cfg}`);
  assert.deepEqual(result?.demo, { tenant: "Acme Corp", incidentId: "INC-001" });
});

test("readMagicLinkConfig: drops unknown demo keys", () => {
  const cfg = encodePayload({ demo: { tenant: "Acme", mystery: "yes" } });
  const result = readMagicLinkConfig(`#/present/foo?cfg=${cfg}`);
  assert.equal("mystery" in (result?.demo ?? {}), false);
  assert.equal(result?.demo?.tenant, "Acme");
});

test("readMagicLinkConfig: Unicode tenant name round-trips correctly", () => {
  const cfg = encodePayload({ demo: { tenant: "東京テナント" } });
  const result = readMagicLinkConfig(`#/present/foo?cfg=${cfg}`);
  assert.equal(result?.demo?.tenant, "東京テナント");
});

test("readMagicLinkConfig: handles base64 that requires padding restoration (length % 4 == 1)", () => {
  // Payload designed so that the stripped base64url string needs padding added back.
  // We trust encodePayload strips it; decoding must restore it correctly.
  const payload = { settings: { autoAdvance: false } };
  const cfg = encodePayload(payload);
  const result = readMagicLinkConfig(`#/present/foo?cfg=${cfg}`);
  assert.equal(result?.settings?.autoAdvance, false);
});

// ── parsePresentId (tested via hash parsing, inlined here for isolation) ─────
// The real parsePresentId lives in main.js and is not exported, so we verify
// its contract by confirming readMagicLinkConfig correctly parses hashes that
// include a query string — which is the only new contract main.js adds.

test("readMagicLinkConfig: parses hash produced by #/present/foo?cfg=... format", () => {
  const cfg = encodePayload({ settings: { playbackMode: "interactive" } });
  const hash = `#/present/msp-demo-deck?cfg=${cfg}`;
  const result = readMagicLinkConfig(hash);
  assert.equal(result?.settings?.playbackMode, "interactive");
});

// ── mergeDeck ────────────────────────────────────────────────────────────────

const BASE_DECK = {
  id: "test-deck",
  title: "Test",
  settings: { typingSpeedMs: 24, playbackMode: "interactive", autoAdvance: false },
  theme:    { shell: "dark", accent: "violet", presenterPosition: "left" },
  scenes:   [],
};

test("mergeDeck: returns a fresh deck object even when urlOverrides is null", () => {
  const { deck } = mergeDeck(BASE_DECK, null);
  assert.notEqual(deck, BASE_DECK);
  assert.notEqual(deck.settings, BASE_DECK.settings);
  assert.notEqual(deck.theme, BASE_DECK.theme);
});

test("mergeDeck: does not mutate contractDeck", () => {
  const original = JSON.stringify(BASE_DECK);
  mergeDeck(BASE_DECK, { settings: { typingSpeedMs: 99 } });
  assert.equal(JSON.stringify(BASE_DECK), original);
});

test("mergeDeck: demoOverrides is null when urlOverrides is null", () => {
  const { demoOverrides } = mergeDeck(BASE_DECK, null);
  assert.equal(demoOverrides, null);
});

test("mergeDeck: URL settings override matching contract settings", () => {
  const { deck } = mergeDeck(BASE_DECK, { settings: { typingSpeedMs: 50 } });
  assert.equal(deck.settings.typingSpeedMs, 50);
});

test("mergeDeck: settings absent from URL keep contract value", () => {
  const { deck } = mergeDeck(BASE_DECK, { settings: { typingSpeedMs: 50 } });
  assert.equal(deck.settings.playbackMode, "interactive");
  assert.equal(deck.settings.autoAdvance, false);
});

test("mergeDeck: URL theme overrides matching contract theme", () => {
  const { deck } = mergeDeck(BASE_DECK, { theme: { shell: "light" } });
  assert.equal(deck.theme.shell, "light");
  assert.equal(deck.theme.accent, "violet"); // unchanged
});

test("mergeDeck: demoOverrides populated when demo key present", () => {
  const { demoOverrides } = mergeDeck(BASE_DECK, { demo: { tenant: "Acme" } });
  assert.deepEqual(demoOverrides, { tenant: "Acme" });
});

test("mergeDeck: demoOverrides is null when demo key absent", () => {
  const { demoOverrides } = mergeDeck(BASE_DECK, { settings: { typingSpeedMs: 10 } });
  assert.equal(demoOverrides, null);
});

test("mergeDeck: returned deck has no demoOverrides property", () => {
  const { deck } = mergeDeck(BASE_DECK, { demo: { tenant: "Acme" } });
  assert.equal("demoOverrides" in deck, false);
  assert.equal("_demoOverrides" in deck, false);
});

// ── buildMagicLink ────────────────────────────────────────────────────────────

const BASE = "https://example.com/app";
const DECK_ID = "msp-demo-deck";

test("buildMagicLink: returns plain hash link when shareableConfig is empty", () => {
  const link = buildMagicLink(BASE, DECK_ID, {});
  assert.equal(link, `${BASE}#/present/${DECK_ID}`);
  assert.equal(link.includes("?cfg="), false);
});

test("buildMagicLink: returns plain hash link when called with no shareableConfig", () => {
  const link = buildMagicLink(BASE, DECK_ID);
  assert.equal(link, `${BASE}#/present/${DECK_ID}`);
});

test("buildMagicLink: omits cfg when all settings are author-only keys", () => {
  // waitForIframeReadyTimeoutMs is not in SHAREABLE_SETTINGS
  const link = buildMagicLink(BASE, DECK_ID, {
    settings: { waitForIframeReadyTimeoutMs: 5000 },
  });
  assert.equal(link.includes("?cfg="), false);
});

test("buildMagicLink: round-trips settings through readMagicLinkConfig", () => {
  const settings = { playbackMode: "autoplay", typingSpeedMs: 15, presentControlsPosition: "top" };
  const link = buildMagicLink(BASE, DECK_ID, { settings });
  const hash = hashOf(link);
  const parsed = readMagicLinkConfig(hash);
  assert.deepEqual(parsed?.settings, settings);
});

test("buildMagicLink: round-trips theme through readMagicLinkConfig", () => {
  const theme = { shell: "light", accent: "indigo", presenterPosition: "right" };
  const link = buildMagicLink(BASE, DECK_ID, { theme });
  const parsed = readMagicLinkConfig(hashOf(link));
  assert.deepEqual(parsed?.theme, theme);
});

test("buildMagicLink: round-trips demoOverrides through readMagicLinkConfig", () => {
  const demoOverrides = { tenant: "Acme Corp", incidentId: "INC-007" };
  const link = buildMagicLink(BASE, DECK_ID, { demoOverrides });
  const parsed = readMagicLinkConfig(hashOf(link));
  assert.deepEqual(parsed?.demo, demoOverrides);
});

test("buildMagicLink: round-trips Unicode tenant name", () => {
  const link = buildMagicLink(BASE, DECK_ID, { demoOverrides: { tenant: "東京テナント" } });
  const parsed = readMagicLinkConfig(hashOf(link));
  assert.equal(parsed?.demo?.tenant, "東京テナント");
});

test("buildMagicLink: encodes deckId in the URL", () => {
  const link = buildMagicLink(BASE, "my deck/id", { settings: { autoAdvance: true } });
  assert.ok(link.includes(encodeURIComponent("my deck/id")));
});
