import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const serverDir = path.join(dist, "server");
const openaiDir = path.join(dist, ".openai");

const [html, css, js, hosting] = await Promise.all([
  readFile(path.join(root, "index.html"), "utf8"),
  readFile(path.join(root, "styles.css"), "utf8"),
  readFile(path.join(root, "app.js"), "utf8"),
  readFile(path.join(root, ".openai", "hosting.json"), "utf8"),
]);

const sourceFilePaths = [
  ".env.example",
  ".github/workflows/deploy-pages.yml",
  ".github/workflows/sync-live-source.yml",
  ".gitignore",
  ".openai/hosting.json",
  "PRODUCTION.md",
  "README.md",
  "app.js",
  "build-github-pages.mjs",
  "build.mjs",
  "index.html",
  "package.json",
  "styles.css",
  "supabase-schema.sql",
];

const sourceFiles = Object.fromEntries(
  await Promise.all(
    sourceFilePaths.map(async (filePath) => [
      filePath,
      await readFile(path.join(root, filePath), "utf8"),
    ]),
  ),
);

const page = html
  .replace('<link rel="stylesheet" href="./styles.css" />', `<style>${css}</style>`)
  .replace('<script src="./app.js"></script>', `<script>${js}</script>`);

const pwaManifest = {
  id: "/",
  name: "BondBridge Verified",
  short_name: "BondBridge",
  description: "Verified respectful connections, family reminders, chat, and free browser video.",
  start_url: "/",
  scope: "/",
  display: "standalone",
  display_override: ["window-controls-overlay", "standalone", "browser"],
  background_color: "#050505",
  theme_color: "#d62976",
  orientation: "portrait-primary",
  categories: ["social", "productivity"],
  icons: [
    {
      src: "/app-icon",
      sizes: "any",
      type: "image/svg+xml",
      purpose: "any maskable",
    },
  ],
  shortcuts: [
    {
      name: "Meet People",
      short_name: "Meet",
      url: "/?view=discover",
      icons: [{ src: "/app-icon", sizes: "any", type: "image/svg+xml" }],
    },
    {
      name: "Family",
      short_name: "Family",
      url: "/?view=family",
      icons: [{ src: "/app-icon", sizes: "any", type: "image/svg+xml" }],
    },
  ],
};

const pwaIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="64" y1="64" x2="448" y2="448" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f58529"/>
      <stop offset="0.45" stop-color="#dd2a7b"/>
      <stop offset="0.72" stop-color="#833ab4"/>
      <stop offset="1" stop-color="#405de6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="116" fill="url(#g)"/>
  <circle cx="256" cy="256" r="152" fill="rgba(0,0,0,0.22)"/>
  <path d="M345 178c-28-28-73-28-101 0l-8 8-8-8c-28-28-73-28-101 0s-28 73 0 101l8 8 101 98 101-98 8-8c28-28 28-73 0-101Z" fill="#fff"/>
  <path d="M256 184v145" stroke="#111" stroke-width="28" stroke-linecap="round" opacity="0.16"/>
</svg>
`.trim();

const serviceWorker = `
const CACHE_NAME = "bondbridge-pwa-v9";
const APP_SHELL = ["/", "/manifest", "/app-icon"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.pathname.startsWith("/api/") || url.pathname === "/health") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/", copy));
          return response;
        })
        .catch(() => caches.match("/")),
    );
    return;
  }

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
`.trim();

const sourcePackage = {
  app: "BondBridge Verified",
  generated_at: new Date().toISOString(),
  files: sourceFiles,
};

const worker = `
const html = ${JSON.stringify(page)};
const manifest = ${JSON.stringify(pwaManifest)};
const iconSvg = ${JSON.stringify(pwaIcon)};
const serviceWorker = ${JSON.stringify(serviceWorker)};
const sourcePackage = ${JSON.stringify(sourcePackage)};

const providers = [
  {
    key: "authData",
    name: "Auth + database",
    detail: "Supabase free Auth, profile sync, RLS, and user-owned records.",
    env: "SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY",
    required: ["SUPABASE_URL", ["SUPABASE_PUBLISHABLE_KEY", "SUPABASE_ANON_KEY"]],
  },
  {
    key: "freeVideo",
    name: "Free live video",
    detail: "Browser WebRTC, camera, microphone, screen share, and Supabase signaling tables.",
    env: "Browser MediaDevices + Supabase RLS",
    required: ["SUPABASE_URL", ["SUPABASE_PUBLISHABLE_KEY", "SUPABASE_ANON_KEY"]],
  },
  {
    key: "identity",
    name: "Free proof review",
    detail: "Student ID, transcript, work proof, and one-account evidence stored for manual review.",
    env: "Supabase verification_documents",
    required: ["SUPABASE_URL", ["SUPABASE_PUBLISHABLE_KEY", "SUPABASE_ANON_KEY"]],
  },
  {
    key: "ai",
    name: "Free coach + safety",
    detail: "Local respectful-message drafts, foul-language blocking, and tone rewrites without model API cost.",
    env: "No paid model key",
    required: [],
  },
  {
    key: "privacy",
    name: "Private data control",
    detail: "Local export/reset plus Supabase RLS for user-owned records and video signaling.",
    env: "Built in",
    required: [],
  },
];

function hasValue(env, key) {
  return Boolean(env && typeof env[key] === "string" && env[key].trim());
}

function hasRequirement(env, item) {
  return Array.isArray(item) ? item.some((key) => hasValue(env, key)) : hasValue(env, item);
}

function missingRequirement(env, item) {
  if (hasRequirement(env, item)) return null;
  return Array.isArray(item) ? item.join(" or ") : item;
}

function serviceStatus(env) {
  return providers.map((provider) => {
    const missing = provider.required.map((item) => missingRequirement(env, item)).filter(Boolean);
    return {
      key: provider.key,
      name: provider.name,
      detail: provider.detail,
      env: provider.env,
      ready: missing.length === 0,
      missing,
    };
  });
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type, authorization",
    },
  });
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function notConfigured(service, missing) {
  return json(
    {
      ok: false,
      service,
      missing,
      status: "not_configured",
      message: "This free production route is deployed, but Supabase public configuration is missing in Sites environment variables.",
    },
    200,
  );
}

function supabaseConfig(env) {
  const url = env.SUPABASE_URL;
  const publishable = env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY;
  if (!url || !publishable) return null;
  return {
    url: String(url).replace(/\\/$/, ""),
    publishable,
  };
}

function supabaseHeaders(config, token = config.publishable) {
  return {
    apikey: config.publishable,
    authorization: "Bearer " + token,
    "content-type": "application/json",
  };
}

function publicProfileSelect() {
  return [
    "id",
    "full_name",
    "gender",
    "age",
    "country",
    "city",
    "role",
    "field",
    "organization",
    "languages",
    "purposes",
    "bio",
    "profile_photo_url",
    "respect_score",
    "identity_status",
    "role_status",
    "gender_status",
    "uniqueness_status",
    "is_suspended",
  ].join(",");
}

function redactAuth(payload) {
  if (Array.isArray(payload)) return payload.map(redactAuth);
  if (!payload || typeof payload !== "object") return payload;
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      /token|password|secret/i.test(key) ? "[redacted]" : redactAuth(value),
    ]),
  );
}

function authSession(payload) {
  const session = payload && payload.session;
  if (!session || !session.access_token) return null;
  return {
    access_token: session.access_token,
    token_type: session.token_type || "bearer",
    expires_at: session.expires_at || null,
  };
}

function authUser(payload) {
  const user = payload && payload.user;
  if (!user) return null;
  return {
    id: user.id || "",
    email: user.email || "",
  };
}

function bearerToken(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function roomCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

async function listProfiles(request, env) {
  const config = supabaseConfig(env);
  if (!config) return notConfigured("live-profiles", ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"]);

  const query = new URLSearchParams({
    select: publicProfileSelect(),
    is_suspended: "eq.false",
    identity_status: "eq.verified",
    gender_status: "eq.verified",
    role_status: "in.(pending,verified)",
    order: "respect_score.desc,created_at.desc",
    limit: "50",
  });
  const response = await fetch(config.url + "/rest/v1/profiles?" + query, {
    headers: supabaseHeaders(config),
  });
  const payload = await response.json().catch(() => []);
  return json(
    {
      ok: response.ok,
      provider: "supabase-rest",
      live: true,
      profiles: response.ok && Array.isArray(payload) ? payload : [],
      error: response.ok ? null : payload,
      message: response.ok ? "Live verified profiles loaded from Supabase." : "Supabase profile query could not complete.",
    },
    response.ok ? 200 : response.status,
  );
}

async function upsertSignupProfile(config, body, authPayload) {
  const user = authPayload && authPayload.user;
  const accessToken = authPayload && authPayload.session && authPayload.session.access_token;
  if (!user || !accessToken) return { synced: false, reason: "email_confirmation_or_session_required" };
  if (!body.gender || !body.age) return { synced: false, reason: "profile_truth_required_before_public_profile_sync" };

  const response = await fetch(config.url + "/rest/v1/profiles", {
    method: "POST",
    headers: {
      ...supabaseHeaders(config, accessToken),
      prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      id: user.id,
      full_name: body.name || user.email || "New BondBridge user",
      gender: body.gender,
      age: Number(body.age),
      country: body.country || "",
      role: body.role || "Student",
      field: body.field || "General",
      organization: body.organization || "",
      languages: body.languages || [],
      purposes: body.purposes || [],
      bio: body.bio || "",
      identity_status: "pending",
      role_status: "pending",
      gender_status: "pending",
      uniqueness_status: "pending",
    }),
  });
  const payload = await response.json().catch(() => ({}));
  return { synced: response.ok, status: response.status, payload };
}

async function createCheckout(request, env) {
  const body = await readJson(request);
  return json({
    ok: true,
    provider: "free-beta",
    paid_api: false,
    plan: String(body.plan || "founder-free"),
    billing_enabled: false,
    message: "Paid checkout is intentionally disabled. BondBridge can launch on a free beta or collect payments later without adding paid infrastructure APIs.",
  });
}

async function createIdentitySession(request, env) {
  const body = await readJson(request);
  const url = env.SUPABASE_URL;
  const publishable = env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY;
  if (!url || !publishable) return notConfigured("free-proof-review", ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"]);
  return json({
    ok: true,
    provider: "supabase-manual-proof-review",
    paid_api: false,
    user_id: String(body.userId || "anonymous"),
    evidence_needed: ["student ID or transcript", "work email or employment proof", "selfie/liveness evidence", "one-account review"],
    next_step: "Upload proof in the Verify page. Admin review happens from the Supabase verification_documents queue.",
    message: "Free verification is connected through Supabase and manual review, without a paid ID API.",
  });
}

async function createVideoRoom(request, env) {
  const config = supabaseConfig(env);
  if (!config) return notConfigured("free-video-signaling", ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"]);
  const accessToken = bearerToken(request);
  if (!accessToken) {
    return json(
      {
        ok: false,
        status: "login_required",
        message: "Log in with Supabase before creating a live video room.",
      },
      401,
    );
  }
  const body = await readJson(request);
  const origin = new URL(request.url).origin;
  const userResponse = await fetch(config.url + "/auth/v1/user", {
    headers: supabaseHeaders(config, accessToken),
  });
  const user = await userResponse.json().catch(() => ({}));
  if (!userResponse.ok || !user.id) {
    return json(
      {
        ok: false,
        status: "invalid_session",
        message: "Your Supabase session could not be verified. Log in again before starting video.",
        error: redactAuth(user),
      },
      401,
    );
  }

  const response = await fetch(config.url + "/rest/v1/webrtc_rooms", {
    method: "POST",
    headers: {
      ...supabaseHeaders(config, accessToken),
      prefer: "return=representation",
    },
    body: JSON.stringify({
      host_user_id: user.id,
      purpose: String(body.purpose || "verified-intro"),
    }),
  });
  const payload = await response.json().catch(() => ({}));
  const room = Array.isArray(payload) ? payload[0] : payload;
  return json({
    ok: response.ok,
    provider: "browser-webrtc-supabase-signaling",
    paid_api: false,
    room: response.ok
      ? {
          id: room.id,
          room_code: room.room_code,
          room_url: origin + "/?room=" + encodeURIComponent(room.room_code),
          status: room.status,
          expires_at: room.expires_at,
        }
      : null,
    error: response.ok ? null : payload,
    purpose: String(body.purpose || "verified-intro"),
    signaling_tables: ["public.webrtc_rooms", "public.webrtc_signals"],
    media: ["camera", "microphone", "screen-share"],
    message: response.ok
      ? "Free video room created in Supabase for native browser WebRTC signaling."
      : "Video room creation is connected but requires a signed-in, verified profile allowed by RLS.",
  }, response.ok ? 200 : response.status);
}

async function signup(request, env) {
  const body = await readJson(request);
  const config = supabaseConfig(env);
  if (!config) return notConfigured("supabase-auth", ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"]);
  if (!body.email || !body.password) return json({ ok: false, message: "Email and password are required." }, 400);

  const response = await fetch(config.url + "/auth/v1/signup", {
    method: "POST",
    headers: {
      apikey: config.publishable,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
      data: {
        name: body.name || "",
        role: body.role || "",
        field: body.field || "",
        country: body.country || "",
      },
    }),
  });
  const payload = await response.json().catch(() => ({}));
  const profileSync = response.ok ? await upsertSignupProfile(config, body, payload).catch((error) => ({ synced: false, error: error.message })) : null;
  return json(
    {
      ok: response.ok,
      provider: "supabase",
      user: authUser(payload),
      session: authSession(payload),
      payload: redactAuth(payload),
      profile_sync: profileSync,
    },
    response.ok ? 200 : response.status,
  );
}

async function login(request, env) {
  const body = await readJson(request);
  const config = supabaseConfig(env);
  if (!config) return notConfigured("supabase-auth", ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"]);
  if (!body.email || !body.password) return json({ ok: false, message: "Email and password are required." }, 400);

  const response = await fetch(config.url + "/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: {
      apikey: config.publishable,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  return json(
    {
      ok: response.ok,
      provider: "supabase",
      user: authUser(payload),
      session: authSession(payload),
      payload: redactAuth(payload),
    },
    response.ok ? 200 : response.status,
  );
}

async function moderate(request, env) {
  const body = await readJson(request);
  const text = String(body.text || "");
  const blocked = ["fuck", "shit", "bitch", "asshole", "stupid", "idiot", "kill", "hate"];
  const hits = blocked.filter((word) => text.toLowerCase().includes(word));
  const rewrite = hits.length
    ? "I want to say this respectfully and keep the conversation kind. Could we talk about it with patience?"
    : text;
  return json({
    ok: true,
    provider: "local-rules-free",
    paid_api: false,
    allowed: hits.length === 0,
    hits,
    rewrite,
  });
}

export default {
  async fetch(request, env = {}) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return json({ ok: true });

    if (url.pathname === "/manifest" || url.pathname === "/manifest.webmanifest") {
      return new Response(JSON.stringify(manifest), {
        headers: {
          "content-type": "application/manifest+json; charset=utf-8",
          "cache-control": "public, max-age=3600",
        },
      });
    }

    if (url.pathname === "/service-worker" || url.pathname === "/sw.js") {
      return new Response(serviceWorker, {
        headers: {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    }

    if (url.pathname === "/source.json") {
      return new Response(JSON.stringify(sourcePackage), {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
          "access-control-allow-origin": "*",
        },
      });
    }

    if (url.pathname === "/app-icon" || url.pathname === "/icon.svg") {
      return new Response(iconSvg, {
        headers: {
          "content-type": "image/svg+xml; charset=utf-8",
          "cache-control": "public, max-age=86400",
        },
      });
    }

    if (url.pathname === "/health") {
      return json({ ok: true, app: "BondBridge Verified", api: true, free_stack: true });
    }

    if (url.pathname === "/api/status") {
      const services = serviceStatus(env);
      return json({
        ok: true,
        app: "BondBridge Verified",
        mode: "production-worker",
        services,
        ready: services.every((service) => service.ready),
        checked_at: new Date().toISOString(),
      });
    }

    if (url.pathname === "/api/profiles" && request.method === "GET") return listProfiles(request, env);
    if (url.pathname === "/api/checkout" && request.method === "POST") return createCheckout(request, env);
    if (url.pathname === "/api/identity/session" && request.method === "POST") return createIdentitySession(request, env);
    if (url.pathname === "/api/video/room" && request.method === "POST") return createVideoRoom(request, env);
    if (url.pathname === "/api/auth/signup" && request.method === "POST") return signup(request, env);
    if (url.pathname === "/api/auth/login" && request.method === "POST") return login(request, env);
    if (url.pathname === "/api/moderate" && request.method === "POST") return moderate(request, env);

    if (url.pathname.startsWith("/api/")) {
      return json({ ok: false, message: "API route not found." }, 404);
    }

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=60",
      },
    });
  },
};
`.trimStart();

await rm(dist, { recursive: true, force: true });
await mkdir(serverDir, { recursive: true });
await mkdir(openaiDir, { recursive: true });
await writeFile(path.join(serverDir, "index.js"), worker);
await writeFile(path.join(openaiDir, "hosting.json"), hosting);
