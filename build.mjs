import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const serverDir = path.join(dist, "server");

const APP_NAME = "Kinora";
const APP_FULL_NAME = "Kinora Verified";
const APP_DESCRIPTION = "Verified respectful connections, family reminders, private chat, and free browser calls.";
const STORAGE_BUCKETS = Object.freeze({
  avatars: "bondbridge-avatars",
  proofs: "bondbridge-proofs",
  chat: "bondbridge-chat",
});
const STORAGE_MIME_TYPES = Object.freeze({
  [STORAGE_BUCKETS.avatars]: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  [STORAGE_BUCKETS.proofs]: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  [STORAGE_BUCKETS.chat]: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
});

const [html, css, configJs, js] = await Promise.all([
  readFile(path.join(root, "index.html"), "utf8"),
  readFile(path.join(root, "styles.css"), "utf8"),
  readFile(path.join(root, "config.js"), "utf8"),
  readFile(path.join(root, "app.js"), "utf8"),
]);

const sourceFilePaths = [
  ".env.example",
  ".github/workflows/deploy-pages.yml",
  ".gitignore",
  "RUN-THIS-FOR-PUSH-NOTIFICATIONS.sql",
  "RUN-THIS-IN-SUPABASE.sql",
  "PRODUCTION.md",
  "README.md",
  "SETUP.md",
  "app.js",
  "build-github-pages.mjs",
  "build.mjs",
  "config.js",
  "docs/ARCHITECTURE.md",
  "docs/MIGRATION.md",
  "index.html",
  "package.json",
  "styles.css",
  "supabase/functions/coach/index.ts",
  "supabase/functions/push-send/index.ts",
  "supabase/migrations/202608210001_kinora_security_compatibility.sql",
  "supabase-schema.sql",
  "supabase-setup-step2.sql",
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
  .replace('<script src="./config.js"></script>', `<script>${configJs}</script>`)
  .replace('<script src="./app.js"></script>', `<script>${js}</script>`);

const pwaManifest = {
  id: "/",
  name: APP_FULL_NAME,
  short_name: APP_NAME,
  description: APP_DESCRIPTION,
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
const CACHE_NAME = "kinora-pwa-v10";
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
  app: APP_FULL_NAME,
  generated_at: new Date().toISOString(),
  files: sourceFiles,
};

const worker = `
const html = ${JSON.stringify(page)};
const manifest = ${JSON.stringify(pwaManifest)};
const iconSvg = ${JSON.stringify(pwaIcon)};
const serviceWorker = ${JSON.stringify(serviceWorker)};
const sourcePackage = ${JSON.stringify(sourcePackage)};
const APP_NAME = ${JSON.stringify(APP_NAME)};
const APP_FULL_NAME = ${JSON.stringify(APP_FULL_NAME)};
const STORAGE_BUCKETS = ${JSON.stringify(STORAGE_BUCKETS)};
const STORAGE_MIME_TYPES = ${JSON.stringify(STORAGE_MIME_TYPES)};

const providers = [
  {
    key: "authData",
    name: "Auth + database",
    detail: "Supabase free Auth, profile sync, RLS, and user-owned records.",
    env: "KINORA_SUPABASE_URL/KINORA_SUPABASE_KEY or SUPABASE_URL/SUPABASE_PUBLISHABLE_KEY",
    required: [["KINORA_SUPABASE_URL", "SUPABASE_URL"], ["KINORA_SUPABASE_KEY", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_ANON_KEY"]],
  },
  {
    key: "freeVideo",
    name: "Free live video",
    detail: "Browser WebRTC, camera, microphone, screen share, and Supabase signaling tables.",
    env: "Browser MediaDevices + Supabase RLS",
    required: [["KINORA_SUPABASE_URL", "SUPABASE_URL"], ["KINORA_SUPABASE_KEY", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_ANON_KEY"]],
  },
  {
    key: "identity",
    name: "Free proof review",
    detail: "Student ID, transcript, work proof, and one-account evidence stored for manual review.",
    env: "Supabase verification_documents",
    required: [["KINORA_SUPABASE_URL", "SUPABASE_URL"], ["KINORA_SUPABASE_KEY", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_ANON_KEY"]],
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
  const url = env.KINORA_SUPABASE_URL || env.SUPABASE_URL;
  const publishable = env.KINORA_SUPABASE_KEY || env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY;
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

function supabaseUploadHeaders(config, token, contentType) {
  return {
    apikey: config.publishable,
    authorization: "Bearer " + token,
    "content-type": contentType || "application/octet-stream",
  };
}

function textValue(value, fallback = "") {
  return String(value || fallback).trim();
}

function textArray(value) {
  if (Array.isArray(value)) return value.map((item) => textValue(item)).filter(Boolean);
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function statusMessage(payload, fallback) {
  if (payload && typeof payload === "object") {
    if (payload.message) return payload.message;
    if (payload.error_description) return payload.error_description;
    if (payload.hint) return payload.hint;
  }
  return fallback;
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

async function authenticate(request, env) {
  const config = supabaseConfig(env);
  if (!config) {
    return {
      ok: false,
      response: notConfigured("supabase-auth", ["KINORA_SUPABASE_URL or SUPABASE_URL", "KINORA_SUPABASE_KEY or SUPABASE_PUBLISHABLE_KEY"]),

    };
  }
  const accessToken = bearerToken(request);
  if (!accessToken) {
    return {
      ok: false,
      response: json({ ok: false, status: "login_required", message: "Log in before using this live feature." }, 401),
    };
  }
  const response = await fetch(config.url + "/auth/v1/user", {
    headers: supabaseHeaders(config, accessToken),
  });
  const user = await response.json().catch(() => ({}));
  if (!response.ok || !user.id) {
    return {
      ok: false,
      response: json({ ok: false, status: "invalid_session", message: "Your session expired. Log in again.", error: redactAuth(user) }, 401),
    };
  }
  return { ok: true, config, accessToken, user };
}

async function supabaseFetch(config, accessToken, table, query = "", options = {}) {
  const path = query ? table + "?" + query : table;
  const response = await fetch(config.url + "/rest/v1/" + path, {
    ...options,
    headers: {
      ...supabaseHeaders(config, accessToken),
      ...(options.prefer ? { prefer: options.prefer } : {}),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => null);
  return { response, payload };
}

function dataUrlToBytes(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;,]+)?(;base64)?,(.*)$/);
  if (!match || !match[2]) return null;
  const binary = atob(match[3]);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function safeStorageName(name) {
  const base = textValue(name, "upload.bin").replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "");
  return base || "upload.bin";
}

async function signedStorageUrl(config, accessToken, bucket, storagePath) {
  const path = textValue(storagePath);
  if (!path) return "";
  const response = await fetch(config.url + "/storage/v1/object/sign/" + bucket + "/" + path, {
    method: "POST",
    headers: supabaseHeaders(config, accessToken),
    body: JSON.stringify({ expiresIn: 3600 }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) return "";
  const signed = payload.signedURL || payload.signedUrl || "";
  if (!signed) return "";
  return signed.startsWith("http") ? signed : config.url + "/storage/v1" + signed;
}

function roomCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

async function listProfiles(request, env) {
  const config = supabaseConfig(env);
  if (!config) return notConfigured("live-profiles", ["KINORA_SUPABASE_URL or SUPABASE_URL", "KINORA_SUPABASE_KEY or SUPABASE_PUBLISHABLE_KEY"]);

  const query = new URLSearchParams({
    select: publicProfileSelect(),
    is_suspended: "eq.false",
    identity_status: "eq.verified",
    gender_status: "eq.verified",
    role_status: "eq.verified",
    uniqueness_status: "eq.verified",
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
      full_name: body.name || user.email || "New " + APP_NAME + " user",
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
    message: "Paid checkout is intentionally disabled. " + APP_NAME + " can launch on a free beta or collect payments later without adding paid infrastructure APIs.",
  });
}

async function createIdentitySession(request, env) {
  const body = await readJson(request);
  const config = supabaseConfig(env);
  if (!config) return notConfigured("free-proof-review", ["KINORA_SUPABASE_URL or SUPABASE_URL", "KINORA_SUPABASE_KEY or SUPABASE_PUBLISHABLE_KEY"]);
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

async function currentAccount(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return auth.response;
  const query = new URLSearchParams({ select: publicProfileSelect(), id: "eq." + auth.user.id, limit: "1" });
  const { response, payload } = await supabaseFetch(auth.config, auth.accessToken, "profiles", query);
  const profile = Array.isArray(payload) ? payload[0] : null;
  return json({
    ok: response.ok,
    provider: "supabase",
    user: { id: auth.user.id, email: auth.user.email || "" },
    profile,
    message: response.ok ? "Signed-in account loaded." : statusMessage(payload, "Profile could not be loaded."),
    error: response.ok ? null : payload,
  }, response.ok ? 200 : response.status);
}

async function saveMyProfile(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return auth.response;
  const body = await readJson(request);
  const payload = {
    id: auth.user.id,
    full_name: textValue(body.full_name || body.name, auth.user.email || APP_NAME + " user"),
    gender: textValue(body.gender),
    age: Number(body.age),
    country: textValue(body.country),
    city: textValue(body.city),
    role: textValue(body.role, "Student"),
    field: textValue(body.field, "General"),
    organization: textValue(body.organization),
    languages: textArray(body.languages),
    purposes: textArray(body.purposes),
    bio: textValue(body.bio),
    profile_photo_url: textValue(body.profile_photo_url),
    updated_at: new Date().toISOString(),
  };
  if (!payload.gender || !payload.age || !payload.country || !payload.field || !payload.organization) {
    return json({ ok: false, message: "Name, age, gender, country, field, and university/company are required." }, 400);
  }
  const { response, payload: data } = await supabaseFetch(auth.config, auth.accessToken, "profiles", "", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    body: JSON.stringify(payload),
  });
  const profile = Array.isArray(data) ? data[0] : data;
  return json({
    ok: response.ok,
    provider: "supabase",
    profile: response.ok ? profile : null,
    error: response.ok ? null : data,
    message: response.ok ? "Profile saved. It stays pending until proof is reviewed." : statusMessage(data, "Profile could not be saved."),
  }, response.ok ? 200 : response.status);
}

async function uploadStorageFile(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return auth.response;
  const body = await readJson(request);
  const bucket = textValue(body.bucket);
  const allowedBuckets = Object.values(STORAGE_BUCKETS);
  if (!allowedBuckets.includes(bucket)) return json({ ok: false, message: "Unsupported storage bucket." }, 400);
  const contentType = textValue(body.contentType, "application/octet-stream");
  const allowedTypes = STORAGE_MIME_TYPES[bucket] || [];
  if (allowedTypes.length && !allowedTypes.includes(contentType)) {
    return json({ ok: false, message: "That file type is not supported for this upload." }, 415);
  }
  const bytes = dataUrlToBytes(body.dataUrl);
  if (!bytes) return json({ ok: false, message: "Upload must be sent as a base64 data URL." }, 400);
  const maxBytes = bucket === STORAGE_BUCKETS.proofs ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
  if (bytes.byteLength > maxBytes) return json({ ok: false, message: "File is too large for the free beta upload limit." }, 413);
  const fileName = Date.now() + "-" + safeStorageName(body.fileName);
  const path = auth.user.id + "/" + fileName;
  const response = await fetch(auth.config.url + "/storage/v1/object/" + bucket + "/" + path, {
    method: "POST",
    headers: {
      ...supabaseUploadHeaders(auth.config, auth.accessToken, contentType),
      "x-upsert": "false",
    },
    body: bytes,
  });
  const payload = await response.json().catch(() => ({}));
  const publicUrl = bucket === STORAGE_BUCKETS.avatars
    ? auth.config.url + "/storage/v1/object/public/" + bucket + "/" + path
    : "";
  return json({
    ok: response.ok,
    provider: "supabase-storage",
    bucket,
    path,
    public_url: response.ok ? publicUrl : "",
    error: response.ok ? null : payload,
    message: response.ok ? "File uploaded to Supabase Storage." : statusMessage(payload, "Storage upload failed."),
  }, response.ok ? 200 : response.status);
}

async function submitProofDocument(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return auth.response;
  const body = await readJson(request);
  const storagePath = textValue(body.storage_path) || "manual-note/" + auth.user.id + "/" + Date.now() + "-" + safeStorageName(body.file_name || body.document_type || "proof.txt");
  const row = {
    user_id: auth.user.id,
    document_type: textValue(body.document_type, "Identity proof"),
    storage_path: storagePath,
    status: "pending",
    reviewer_note: textValue(body.note),
  };
  const { response, payload } = await supabaseFetch(auth.config, auth.accessToken, "verification_documents", "", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify(row),
  });
  const document = Array.isArray(payload) ? payload[0] : payload;
  return json({
    ok: response.ok,
    provider: "supabase",
    document: response.ok ? document : null,
    error: response.ok ? null : payload,
    message: response.ok ? "Proof queued for private manual review." : statusMessage(payload, "Proof could not be queued."),
  }, response.ok ? 200 : response.status);
}

async function listConnections(request, env) {
  const au
th = await authenticate(request, env);
  if (!auth.ok) return auth.response;
  const query = new URLSearchParams({
    select: "*",
    or: "(requester_id.eq." + auth.user.id + ",recipient_id.eq." + auth.user.id + ")",
    order: "updated_at.desc,created_at.desc",
  });
  const { response, payload } = await supabaseFetch(auth.config, auth.accessToken, "connections", query);
  return json({
    ok: response.ok,
    provider: "supabase",
    connections: response.ok && Array.isArray(payload) ? payload : [],
    error: response.ok ? null : payload,
    message: response.ok ? "Connections loaded." : statusMessage(payload, "Connections could not be loaded."),
  }, response.ok ? 200 : response.status);
}

async function requestConnection(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return auth.response;
  const body = await readJson(request);
  const recipientId = textValue(body.recipient_id);
  if (!recipientId || recipientId === auth.user.id) return json({ ok: false, message: "Choose another verified user first." }, 400);
  const profileQuery = new URLSearchParams({ select: "id", id: "eq." + recipientId, limit: "1" });
  const { response: profileResponse, payload: profilePayload } = await supabaseFetch(auth.config, auth.accessToken, "profiles", profileQuery);
  if (!profileResponse.ok || !Array.isArray(profilePayload) || !profilePayload.length) {
    return json({ ok: false, message: "The selected person is not available for verified discovery." }, 404);
  }
  const row = {
    requester_id: auth.user.id,
    recipient_id: recipientId,
    note: textValue(body.note, "Respectful connection request."),
    status: "pending",
  };
  const { response, payload } = await supabaseFetch(auth.config, auth.accessToken, "connections", "", {
    method: "POST",
    prefer: "resolution=ignore-duplicates,return=representation",
    body: JSON.stringify(row),
  });
  const connection = Array.isArray(payload) ? payload[0] : payload;
  return json({
    ok: response.ok,
    provider: "supabase",
    connection: response.ok ? connection : null,
    error: response.ok ? null : payload,
    message: response.ok ? "Connection request sent." : statusMessage(payload, "Connection request could not be sent."),
  }, response.ok ? 200 : response.status);
}

async function respondConnection(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return auth.response;
  const body = await readJson(request);
  const connectionId = textValue(body.connection_id);
  const status = textValue(body.status);
  if (!connectionId || !["accepted", "declined", "blocked"].includes(status)) {
    return json({ ok: false, message: "Connection id and valid status are required." }, 400);
  }
  const query = new URLSearchParams({ id: "eq." + connectionId, select: "*" });
  const { response, payload } = await supabaseFetch(auth.config, auth.accessToken, "connections", query, {
    method: "PATCH",
    prefer: "return=representation",
    body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
  });
  const connection = Array.isArray(payload) ? payload[0] : payload;
  return json({
    ok: response.ok,
    provider: "supabase",
    connection: response.ok ? connection : null,
    error: response.ok ? null : payload,
    message: response.ok ? "Connection updated." : statusMessage(payload, "Connection could not be updated."),
  }, response.ok ? 200 : response.status);
}

function moderationResult(text) {
  const blocked = ["fuck", "shit", "bitch", "asshole", "stupid", "idiot", "kill", "hate"];
  const hits = blocked.filter((word) => String(text || "").toLowerCase().includes(word));
  return {
    allowed: hits.length === 0,
    hits,
    rewrite: hits.length
      ? "I want to say this respectfully and keep the conversation kind. Could we talk about it with patience?"
      : String(text || ""),
  };
}

async function findAcceptedConnection(config, accessToken, userId, otherUserId) {
  const query = new URLSearchParams({
    select: "*",
    status: "eq.accepted",
    or: "(and(requester_id.eq." + userId + ",recipient_id.eq." + otherUserId + "),and(requester_id.eq." + otherUserId + ",recipient_id.eq." + userId + "))",
    limit: "1",
  });
  const { response, payload } = await supabaseFetch(config, accessToken, "connections", query);
  return response.ok && Array.isArray(payload) ? payload[0] : null;
}

async function listMessages(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return auth.response;
  const url = new URL(request.url);
  const recipientId = textValue(url.searchParams.get("recipient_id"));
  const connectionId = textValue(url.searchParams.get("connection_id"));
  let connection = null;
  if (connectionId) {
    const query = new URLSearchParams({ select: "*", id: "eq." + connectionId, status: "eq.accepted", limit: "1" });
    const result = await supabaseFetch(auth.config, auth.accessToken, "connections", query);
    connection = result.response.ok && Array.isArray(result.payload) ? result.payload[0] : null;
  } else if (recipientId) {
    connection = await findAcceptedConnection(auth.config, auth.accessToken, auth.user.id, recipientId);
  }
  if (!connection) return json({ ok: false, message: "Accepted connection is required before chat." }, 403);
  const query = new URLSearchParams({
    select: "*",
    connection_id: "eq." + connection.id,
    order: "created_at.asc",
    limit: "100",
  });
  const { response, payload } = await supabaseFetch(auth.config, auth.accessToken, "messages", query);
  const messages = response.ok && Array.isArray(payload)
    ? await Promise.all(
        payload.map(async (row) => ({
          ...row,
          attachment_public_url: row.attachment_url
            ? await signedStorageUrl(auth.config, auth.accessToken, STORAGE_BUCKETS.chat, row.attachment_url)
            : "",
        })),
      )
    : [];
  return json({
    ok: response.ok,
    provider: "supabase",
    connection,
    messages,
    error: response.ok ? null : payload,
    message: response.ok ? "Messages loaded." : statusMessage(payload, "Messages could not be loaded."),
  }, response.ok ? 200 : response.status);
}

async function sendLiveMessage(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return auth.response;
  const body = await readJson(request);
  const recipientId = textValue(body.recipient_id);
  const messageBody = textValue(body.body);
  const moderation = moderationResult(messageBody);
  if (!recipientId) return json({ ok: false, message: "Recipient is required." }, 400);
  if (!messageBody && !body.attachment_path) return json({ ok: false, message: "Write a message or attach a file." }, 400);
  if (!moderation.allowed) return json({ ok: false, message: "Message blocked for disrespectful language.", moderation }, 400);
  const connection = await findAcceptedConnection(auth.config, auth.accessToken, auth.user.id, recipientId);
  if (!connection) return json({ ok: false, message: "Accepted mutual connection is required before chat." }, 403);
  const row = {
    connection_id: connection.id,
    sender_id: auth.user.id,
    body: messageBody,
    attachment_url: textValue(body.attachment_path),
    moderation_result: moderation,
  };
  const { response, payload } = await supabaseFetch(auth.config, auth.accessToken, "messages", "", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify(row),
  });
  const message = Array.isArray(payload) ? payload[0] : payload;
  return json({
    ok: response.ok,
    provider: "supabase",
    connection,
    saved_message: response.ok ? message : null,
    error: response.ok ? null : payload,
    message: response.ok ? "Message sent." : statusMessage(payload, "Message could not be sent."),
  }, response.ok ? 200 : response.status);
}

async function listFamilyReminders(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return auth.response;
  const query = new URLSearchParams({ select: "*", user_id: "eq." + auth.user.id, order: "created_at.desc" });
  const { response, payload } = await supabaseFetch(auth.config, auth.accessToken, "family_reminders", query);
  return json({
    ok: response.ok,
    provider: "supabase",
    reminders: response.ok && Array.isArray(payload) ? payload : [],
    error: response.ok ? null : payload,
    message: response.ok ? "Family reminders loaded." : statusMessage(payload, "Family reminders could not be loaded."),
  }, response.ok ? 200 : response.status);
}

async function createFamilyReminder(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return auth.response;
  const body = await readJson(request);
  const row = {
    user_id: auth.user.id,
    name: textValue(body.name),
    relationship: textValue(body.relationship, "Friend"),
    cadence_days: Math.max(1, Math.min(365, Number(body.cadence_days) || 7)),
    notes: textValue(body.notes),
  };
  if (!row.name) return json({ ok: false, message: "Name is required." }, 400);
  const { response, payload } = await supabaseFetch(auth.config, auth.accessToken, "family_reminders", "", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify(row),
  });
  const reminder = Array.isArray(payload) ? payload[0] : payload;
  return json({
    ok: response.ok,
    provider: "supabase",
    reminder: response.ok ? reminder : null,
    error: response.ok ? null : payload,
    message: response.ok ? "Family reminder saved." : statusMessage(payload, "Family reminder could not be saved."),
  }, response.ok ? 200 : response.status);
}

async function markFamilyReminderContacted(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return auth.response;
  const body = await readJson(request);
  const reminderId = textValue(body.reminder_id);
  if (!reminderId) return json({ ok: false, message: "Reminder id is required." }, 400);
  const query = new URLSearchParams({ id: "eq." + reminderId, user_id: "eq." + auth.user.id, select: "*" });
  const { response, payload } = await supabaseFetch(auth.config, auth.accessToken, "family_reminders", query, {
    method: "PATCH",
    prefer: "return=representation",
    body: JSON.stringify({ last_contact_at: new Date().toISOString().slice(0, 10) }),
  });
  const reminder = Array.isArray(payload) ? payload[0] : payload;
  return json({
    ok: response.ok,
    provider: "supabase",
    reminder: response.ok ? reminder : null,
    error: response.ok ? null : payload,
    message: response.ok ? "Family reminder updated." : statusMessage(payload, "Family reminder could not be updated."),
  }, response.ok ? 200 : response.status);
}

async function listReports(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return auth.response;
  const query = new URLSearchParams({ select: "*", reporter_id: "eq." + auth.user.id, order: "created_at.desc" });
  const { response, payload } = await supabaseFetch(auth.config, auth.accessToken, "reports", query);
  return json({
    ok: response.ok,
    provider: "supabase",
    reports: response.ok && Array.isArray(payload) ? payload : [],
    error: response.ok ? null : payload,
    message: response.ok ? "Reports loaded." : statusMessage(payload, "Reports could not be loaded."),
  }, response.ok ? 200 : response.status);
}

async function createReport(request, env) {
  const auth = await authenticate(request, env);
  if (!auth.ok) return auth.response;
  const body = await readJson(request);
  const reason = textValue(body.reason, "User report");
  const row = {
    reporter_id: auth.user.id,
    reported_user_id: textValue(body.reported_user_id) || null,
    con
nection_id: textValue(body.connection_id) || null,
    reason,
    status: "open",
  };
  const { response, payload } = await supabaseFetch(auth.config, auth.accessToken, "reports", "", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify(row),
  });
  const report = Array.isArray(payload) ? payload[0] : payload;
  return json({
    ok: response.ok,
    provider: "supabase",
    report: response.ok ? report : null,
    error: response.ok ? null : payload,
    message: response.ok ? "Safety report created." : statusMessage(payload, "Report could not be created."),
  }, response.ok ? 200 : response.status);
}

async function createVideoRoom(request, env) {
  const config = supabaseConfig(env);
  if (!config) return notConfigured("free-video-signaling", ["KINORA_SUPABASE_URL or SUPABASE_URL", "KINORA_SUPABASE_KEY or SUPABASE_PUBLISHABLE_KEY"]);
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
  if (!config) return notConfigured("supabase-auth", ["KINORA_SUPABASE_URL or SUPABASE_URL", "KINORA_SUPABASE_KEY or SUPABASE_PUBLISHABLE_KEY"]);
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
  if (!config) return notConfigured("supabase-auth", ["KINORA_SUPABASE_URL or SUPABASE_URL", "KINORA_SUPABASE_KEY or SUPABASE_PUBLISHABLE_KEY"]);
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
      return json({ ok: true, app: APP_FULL_NAME, api: true, free_stack: true });
    }

    if (url.pathname === "/api/status") {
      const services = serviceStatus(env);
      return json({
        ok: true,
        app: APP_FULL_NAME,
        mode: "production-worker",
        services,
        ready: services.every((service) => service.ready),
        checked_at: new Date().toISOString(),
      });
    }

    if (url.pathname === "/api/profiles" && request.method === "GET") return listProfiles(request, env);
    if (url.pathname === "/api/me" && request.method === "GET") return currentAccount(request, env);
    if (url.pathname === "/api/profiles/me" && request.method === "POST") return saveMyProfile(request, env);
    if (url.pathname === "/api/storage/upload" && request.method === "POST") return uploadStorageFile(request, env);
    if (url.pathname === "/api/proof" && request.method === "POST") return submitProofDocument(request, env);
    if (url.pathname === "/api/connections" && request.method === "GET") return listConnections(request, env);
    if (url.pathname === "/api/connections/request" && request.method === "POST") return requestConnection(request, env);
    if (url.pathname === "/api/connections/respond" && request.method === "POST") return respondConnection(request, env);
    if (url.pathname === "/api/messages" && request.method === "GET") return listMessages(request, env);
    if (url.pathname === "/api/messages" && request.method === "POST") return sendLiveMessage(request, env);
    if (url.pathname === "/api/family-reminders" && request.method === "GET") return listFamilyReminders(request, env);
    if (url.pathname === "/api/family-reminders" && request.method === "POST") return createFamilyReminder(request, env);
    if (url.pathname === "/api/family-reminders/contacted" && request.method === "POST") return markFamilyReminderContacted(request, env);
    if (url.pathname === "/api/reports" && request.method === "GET") return listReports(request, env);
    if (url.pathname === "/api/reports" && request.method === "POST") return createReport(request, env);
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
await writeFile(path.join(serverDir, "index.js"), worker);

