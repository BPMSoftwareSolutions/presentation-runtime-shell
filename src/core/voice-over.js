function getStoredFlag(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return defaultValue;
    return raw === "true";
  } catch {
    return defaultValue;
  }
}

function setStoredFlag(key, value) {
  try {
    localStorage.setItem(key, value ? "true" : "false");
  } catch {
    // ignore storage failures
  }
}

function getOpenAIKey() {
  try {
    // Preferred: localStorage key users can set at runtime.
    const fromStorage = localStorage.getItem("openai-voice-over-key");
    if (fromStorage) return fromStorage;
  } catch {
    // ignore
  }

  // Optional global injection point for hosting environments.
  if (typeof window !== "undefined" && typeof window.OPENAI_VOICE_OVER_KEY === "string") {
    return window.OPENAI_VOICE_OVER_KEY;
  }

  return "";
}

export function createVoiceOverEngine() {
  let enabled = getStoredFlag("aps.voice.enabled", true);
  let provider = "openai";
  let openAIKey = getOpenAIKey();
  const allowBrowserFallbackWhenOpenAIExists = false;
  let currentAudio = null;
  let currentAudioUrl = "";
  let currentAbort = null;
  let currentUtterance = null;
  let speakToken = 0;
  const audioCache = new Map();
  const inflight = new Map();

  function canUseBrowserSpeech() {
    return typeof window !== "undefined" && !!window.speechSynthesis;
  }

  async function fetchOpenAIAudioBlob(text, signal) {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text,
        response_format: "mp3",
      }),
      signal,
    });

    if (!res.ok) {
      throw new Error(`OpenAI TTS failed: ${res.status}`);
    }

    return res.blob();
  }

  function getAudioBlobPromise(text) {
    if (!openAIKey) return null;

    if (audioCache.has(text)) {
      return Promise.resolve(audioCache.get(text));
    }

    if (inflight.has(text)) {
      return inflight.get(text);
    }

    const promise = fetchOpenAIAudioBlob(text)
      .then((blob) => {
        audioCache.set(text, blob);
        inflight.delete(text);
        return blob;
      })
      .catch((err) => {
        inflight.delete(text);
        throw err;
      });

    inflight.set(text, promise);
    return promise;
  }

  function cleanupAudio() {
    if (currentAudio) {
      try {
        currentAudio.pause();
      } catch {
        // no-op
      }
      currentAudio.src = "";
      currentAudio = null;
    }

    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl);
      currentAudioUrl = "";
    }
  }

  function stop() {
    speakToken += 1;

    if (currentAbort) {
      currentAbort.abort();
      currentAbort = null;
    }

    cleanupAudio();

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    currentUtterance = null;
  }

  async function speakWithOpenAI(text, token) {
    const controller = new AbortController();
    currentAbort = controller;

    const blob = await fetchOpenAIAudioBlob(text, controller.signal);
    if (token !== speakToken) return;

    currentAudioUrl = URL.createObjectURL(blob);
    currentAudio = new Audio(currentAudioUrl);
    currentAudio.volume = 1;
    await currentAudio.play();
  }

  function speakWithBrowser(text, token) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (token !== speakToken) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  async function speak(text) {
    const clean = String(text || "").trim();
    if (!enabled || !clean) return;

    stop();
    const token = ++speakToken;

    // Refresh key on each request in case user sets it at runtime.
    openAIKey = getOpenAIKey();

    if (provider === "openai" && openAIKey) {
      try {
        const cachedBlob = audioCache.get(clean);
        if (cachedBlob) {
          currentAudioUrl = URL.createObjectURL(cachedBlob);
          currentAudio = new Audio(currentAudioUrl);
          currentAudio.volume = 1;
          await currentAudio.play();
          return;
        }

        // If OpenAI audio is not ready quickly, use browser speech immediately
        // to keep the presenter from sounding choppy on first run.
        const blobPromise = getAudioBlobPromise(clean);
        if (blobPromise) {
          const race = await Promise.race([
            blobPromise.then((blob) => ({ kind: "blob", blob })),
            new Promise((resolve) => setTimeout(() => resolve({ kind: "timeout" }), 450)),
          ]);

          if (race.kind === "blob") {
            if (token !== speakToken) return;
            currentAudioUrl = URL.createObjectURL(race.blob);
            currentAudio = new Audio(currentAudioUrl);
            currentAudio.volume = 1;
            await currentAudio.play();
            return;
          }

          // Key present: keep voice provider consistent. Wait for OpenAI audio
          // instead of switching to browser voice for the same narration line.
          if (!allowBrowserFallbackWhenOpenAIExists) {
            const blob = await blobPromise;
            if (token !== speakToken) return;
            currentAudioUrl = URL.createObjectURL(blob);
            currentAudio = new Audio(currentAudioUrl);
            currentAudio.volume = 1;
            await currentAudio.play();
            return;
          }
        }
      } catch {
        // Continue to browser fallback.
      }
    }

    if (canUseBrowserSpeech()) {
      speakWithBrowser(clean, token);
    }
  }

  function prime(texts) {
    openAIKey = getOpenAIKey();
    if (provider !== "openai" || !openAIKey) return;

    const unique = [...new Set((texts || []).map((t) => String(t || "").trim()).filter(Boolean))];
    for (const text of unique) {
      if (!audioCache.has(text) && !inflight.has(text)) {
        void getAudioBlobPromise(text);
      }
    }
  }

  function pause() {
    if (currentAudio) {
      try { currentAudio.pause(); } catch { /* no-op */ }
    }
    if (typeof window !== "undefined" && window.speechSynthesis?.speaking) {
      window.speechSynthesis.pause();
    }
  }

  function resume() {
    if (currentAudio) {
      void currentAudio.play().catch(() => {});
    }
    if (typeof window !== "undefined" && window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
    }
  }

  function setEnabled(value) {
    enabled = !!value;
    setStoredFlag("aps.voice.enabled", enabled);
    if (!enabled) stop();
  }

  function toggleEnabled() {
    setEnabled(!enabled);
    return enabled;
  }

  function getState() {
    openAIKey = getOpenAIKey();
    return {
      enabled,
      provider,
      hasOpenAIKey: !!openAIKey,
      mode: openAIKey ? "openai" : "browser",
    };
  }

  return {
    prime,
    speak,
    stop,
    pause,
    resume,
    setEnabled,
    toggleEnabled,
    getState,
  };
}
