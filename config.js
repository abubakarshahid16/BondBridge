(() => {
  const app = Object.freeze({
    name: "Kinora",
    fullName: "Kinora Verified",
    tagline: "Real people. Verified. Better bonds.",
    description: "A verified relationship platform for students, professionals, families, friendships, and serious connections.",
    supportEmail: "support@kinora.app",
  });

  const storage = Object.freeze({
    appStateKey: "kinora-verified-live-v1",
    legacyAppStateKeys: [
      "bondbridge-verified-live-v3",
      "bondbridge-verified-live-v2",
      "bondbridge-verified-v1",
    ],
    authStorageKey: "kinora-auth",
    legacyAuthStorageKeys: ["bondbridge-auth"],
    // These are production Supabase bucket identifiers. Keep them stable unless
    // data has been migrated and every deployed client has switched over.
    buckets: Object.freeze({
      avatars: "bondbridge-avatars",
      proofs: "bondbridge-proofs",
      chat: "bondbridge-chat",
    }),
  });

  const runtimeKeys = Object.freeze({
    supabaseUrl: ["KINORA_SUPABASE_URL", "BONDBRIDGE_SUPABASE_URL"],
    supabaseKey: ["KINORA_SUPABASE_KEY", "BONDBRIDGE_SUPABASE_KEY"],
    aiUrl: ["KINORA_AI_URL", "BONDBRIDGE_AI_URL"],
    turnUrl: ["KINORA_TURN_URL", "BONDBRIDGE_TURN_URL"],
    vapidPublicKey: ["KINORA_VAPID_PUBLIC_KEY", "BONDBRIDGE_VAPID_PUBLIC_KEY"],
  });

  function runtimeValue(name) {
    const keys = runtimeKeys[name] || [];
    for (const key of keys) {
      const value = window[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
  }

  function migrateAuthStorage() {
    try {
      if (localStorage.getItem(storage.authStorageKey)) return;
      for (const key of storage.legacyAuthStorageKeys) {
        const value = localStorage.getItem(key);
        if (value) {
          localStorage.setItem(storage.authStorageKey, value);
          return;
        }
      }
    } catch {
      // Local storage can be unavailable in private or locked-down browsers.
    }
  }

  window.KINORA_CONFIG = Object.freeze({
    app,
    storage,
    runtimeKeys,
    runtimeValue,
    migrateAuthStorage,
  });
})();

