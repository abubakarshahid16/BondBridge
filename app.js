const STORAGE_KEY = "bondbridge-verified-live-v3";
const LEGACY_STORAGE_KEYS = ["bondbridge-verified-v1", "bondbridge-verified-live-v2"];

// User-facing nav (8 items). "launch" is dev-only (URL param ?dev=1).
const views = [
  ["dashboard", "Home", "home"],
  ["discover", "Discover", "search"],
  ["connections", "Requests", "users"],
  ["chat", "Chat", "message"],
  ["family", "Family", "heart"],
  ["coach", "Coach", "sparkles"],
  ["verify", "Verify", "shield"],
  ["settings", "Settings", "gear"],
];

// Extra views that are accessible but not shown in the sidebar nav
const hiddenViews = ["auth", "landing", "admin", "launch", "privacy"];

const purposeOptions = [
  "Any",
  "Friendship",
  "Study partner",
  "Career network",
  "Culture exchange",
  "Language practice",
  "Marriage minded",
  "Family bonding",
];

const fieldOptions = [
  "Any",
  "Computer Science",
  "Medicine",
  "Engineering",
  "Business",
  "Law",
  "Design",
  "Data Science",
  "Education",
];

const iconMap = {
  home: '<path d="m3 10 9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
  sparkles: '<path d="m12 3 1.6 4.8L18 10l-4.4 2.2L12 17l-1.6-4.8L6 10l4.4-2.2Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z"/><path d="m5 3 .7 1.8L8 5.5l-2.3.7L5 8l-.7-1.8L2 5.5l2.3-.7Z"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  arrow_right: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  check: '<path d="m20 6-11 11-5-5"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="m5.7 5.7 12.6 12.6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6.5 6.5l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2Z"/>',
  flag: '<path d="M4 22V4"/><path d="M4 4h12l-1 4 1 4H4"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/>',
  download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 7.7A9 9 0 1 1 12 3Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.9 19.1 1.4-1.4"/><path d="m17.7 6.3 1.4-1.4"/>',
  camera: '<path d="M14.5 4h-5L8 6H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-3Z"/><circle cx="12" cy="13" r="4"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10.5" r="1.5"/><path d="m21 15-5-5L5 19"/>',
  video: '<path d="M23 7l-7 5 7 5V7Z"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
  rocket: '<path d="M4.5 16.5c-1 1.2-1.5 2.7-1.5 4.5 1.8 0 3.3-.5 4.5-1.5"/><path d="M9 15 4 20"/><path d="M15 3c3.5.5 5.5 2.5 6 6l-8 8-6-6Z"/><path d="M15 3 12 10"/><circle cx="15.5" cy="8.5" r="1.5"/>',
  credit: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/>',
  key: '<circle cx="7.5" cy="14.5" r="3.5"/><path d="M10 12 21 1"/><path d="m18 4 2 2"/><path d="m15 7 2 2"/>',
  server: '<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01"/><path d="M7 17h.01"/>',
};

const avatarColors = ["blue", "teal", "green", "amber", "rose", "violet"];

let localVideoStream = null;
let screenShareStream = null;
let installPromptEvent = null;
let authAccessToken = "";

const launchProviders = [
  {
    key: "authData",
    name: "Auth + database",
    detail: "Supabase free Auth, profile sync, RLS, and user-owned records.",
    env: "SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY",
    iconName: "server",
  },
  {
    key: "freeVideo",
    name: "Free live video",
    detail: "Browser WebRTC, camera, microphone, screen share, and Supabase signaling tables.",
    env: "Browser MediaDevices + Supabase RLS",
    iconName: "video",
  },
  {
    key: "identity",
    name: "Free proof review",
    detail: "Student ID, transcript, work proof, and one-account evidence stored for manual review.",
    env: "Supabase verification_documents",
    iconName: "shield",
  },
  {
    key: "ai",
    name: "Free coach + safety",
    detail: "Local respectful-message drafts, foul-language blocking, and tone rewrites without model API cost.",
    env: "No paid model key",
    iconName: "sparkles",
  },
  {
    key: "privacy",
    name: "Private data control",
    detail: "Local export/reset plus Supabase RLS for user-owned records and video signaling.",
    env: "Built in",
    iconName: "lock",
  },
];

// ─── Demo profiles shown when Supabase has no real verified users ───────────
function getDemoProfiles() {
  return [
    {
      id: "demo-1",
      name: "Aisha Rahman",
      age: 22,
      gender: "Female",
      country: "Pakistan",
      city: "Lahore",
      role: "Student",
      field: "Computer Science",
      organization: "LUMS",
      languages: ["English", "Urdu"],
      purposes: ["Study partner", "Friendship"],
      respectScore: 98,
      verified: ["Real identity", "Student proof", "Profile truth", "One account"],
      about: "CS student passionate about AI and building things that matter.",
      connectionStyle: "Respectful and consent-first.",
      profilePhoto: "",
      status: "active",
      isDemo: true,
    },
    {
      id: "demo-2",
      name: "Omar Siddiqui",
      age: 26,
      gender: "Male",
      country: "UAE",
      city: "Dubai",
      role: "Professional",
      field: "Business",
      organization: "Dubai Startup Hub",
      languages: ["English", "Arabic", "Urdu"],
      purposes: ["Career network", "Culture exchange"],
      respectScore: 95,
      verified: ["Real identity", "Professional proof", "Profile truth", "One account"],
      about: "Entrepreneur working on EdTech. Love connecting with people across cultures.",
      connectionStyle: "Respectful and consent-first.",
      profilePhoto: "",
      status: "active",
      isDemo: true,
    },
    {
      id: "demo-3",
      name: "Sara Malik",
      age: 24,
      gender: "Female",
      country: "UK",
      city: "London",
      role: "Student",
      field: "Medicine",
      organization: "King's College London",
      languages: ["English", "Urdu"],
      purposes: ["Study partner", "Friendship", "Culture exchange"],
      respectScore: 97,
      verified: ["Real identity", "Student proof", "Profile truth", "One account"],
      about: "Medical student. Interested in health tech and global connections.",
      connectionStyle: "Respectful and consent-first.",
      profilePhoto: "",
      status: "active",
      isDemo: true,
    },
    {
      id: "demo-4",
      name: "Ahmed Hassan",
      age: 28,
      gender: "Male",
      country: "Egypt",
      city: "Cairo",
      role: "Professional",
      field: "Engineering",
      organization: "Cairo University",
      languages: ["English", "Arabic"],
      purposes: ["Career network", "Language practice", "Friendship"],
      respectScore: 93,
      verified: ["Real identity", "Professional proof", "Profile truth", "One account"],
      about: "Software engineer building the next generation of Arab tech.",
      connectionStyle: "Respectful and consent-first.",
      profilePhoto: "",
      status: "active",
      isDemo: true,
    },
    {
      id: "demo-5",
      name: "Fatima Al-Zahra",
      age: 23,
      gender: "Female",
      country: "Saudi Arabia",
      city: "Riyadh",
      role: "Student",
      field: "Data Science",
      organization: "King Abdulaziz University",
      languages: ["English", "Arabic"],
      purposes: ["Study partner", "Career network"],
      respectScore: 96,
      verified: ["Real identity", "Student proof", "Profile truth", "One account"],
      about: "Data science student working on NLP for Arabic text.",
      connectionStyle: "Respectful and consent-first.",
      profilePhoto: "",
      status: "active",
      isDemo: true,
    },
    {
      id: "demo-6",
      name: "Bilal Chaudhry",
      age: 30,
      gender: "Male",
      country: "Canada",
      city: "Toronto",
      role: "Professional",
      field: "Design",
      organization: "Shopify",
      languages: ["English", "French", "Urdu"],
      purposes: ["Career network", "Culture exchange", "Friendship"],
      respectScore: 94,
      verified: ["Real identity", "Professional proof", "Profile truth", "One account"],
      about: "UX designer at Shopify. Passionate about inclusive design.",
      connectionStyle: "Respectful and consent-first.",
      profilePhoto: "",
      status: "active",
      isDemo: true,
    },
  ];
}

function isDemoMode() {
  // Demo mode when Supabase has returned no profiles
  return state.profiles.filter((p) => !p.isDemo).length === 0;
}

function getAllProfiles() {
  // Merge real profiles with demo profiles (demo shown only when no real ones)
  const real = state.profiles.filter((p) => !p.isDemo);
  if (real.length > 0) return state.profiles;
  return getDemoProfiles();
}

function createInitialState() {
  return {
    view: "landing",
    guestMode: false,
    authTab: "login",
    theme: "dark",
    verifyStep: "profile",
    selectedChat: "",
    currentMeetIndex: 0,
    meetMode: "preview",
    skipped: [],
    live: {
      profilesLoaded: false,
      loading: false,
      lastSync: "",
      error: "",
    },
    auth: {
      email: "",
      password: "",
      name: "",
      role: "Student",
      country: "",
      result: null,
      session: null,
    },
    launch: {
      checkedAt: "",
      status: null,
      apiResult: null,
    },
    currentUser: {
      id: "me",
      name: "",
      age: "",
      gender: "",
      country: "",
      city: "",
      role: "Student",
      field: "",
      organization: "",
      languages: "",
      purpose: "",
      profilePhoto: "",
      story: null,
      respectScore: 0,
      verification: {
        identity: "pending",
        role: "pending",
        gender: "pending",
        uniqueness: "pending",
      },
      proofQueue: [],
    },
    filters: {
      country: "Any",
      purpose: "Any",
      field: "Any",
      gender: "Any",
      search: "",
    },
    profiles: [],
    requests: [],
    connections: [],
    connectionRows: [],
    chats: {},
    family: [],
    reports: [],
    proofDocuments: [],
    moderationLog: [
      "Bad-language filter enabled for all chats.",
      "New users limited to 5 outgoing requests per day until role proof is verified.",
      "Private chat requires mutual connection.",
    ],
    communities: [],
    coach: {
      relation: "New verified friend",
      goal: "Start a respectful conversation",
      tone: "Warm and confident",
      context: "",
      suggestions: [],
      loading: false,
      source: "",
    },
  };
}

function today(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function loadState() {
  const defaults = createInitialState();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaults;

  try {
    const saved = JSON.parse(raw);
    return {
      ...defaults,
      ...saved,
      currentUser: {
        ...defaults.currentUser,
        ...(saved.currentUser || {}),
        verification: {
          ...defaults.currentUser.verification,
          ...((saved.currentUser && saved.currentUser.verification) || {}),
        },
      },
      filters: { ...defaults.filters, ...(saved.filters || {}) },
      // loading is always reset — a saved "true" would freeze the button forever
      coach: { ...defaults.coach, ...(saved.coach || {}), loading: false },
      launch: { ...defaults.launch, ...(saved.launch || {}) },
      live: { ...defaults.live, ...(saved.live || {}) },
      auth: { ...defaults.auth, ...(saved.auth || {}) },
      guestMode: saved.guestMode || false,
      authTab: saved.authTab || "login",
    };
  } catch {
    return defaults;
  }
}

let state = loadState();
LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
const urlView = new URLSearchParams(window.location.search).get("view");
const allViewIds = [...views.map(([id]) => id), ...hiddenViews];
if (allViewIds.includes(urlView)) state.view = urlView;
// Dev mode: ?dev=1 unlocks the Launch screen
if (new URLSearchParams(window.location.search).get("dev") === "1") {
  state.devMode = true;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function icon(name, small = false) {
  const path = iconMap[name] || iconMap.check;
  return `<svg class="icon${small ? " sm" : ""}" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function displayName(name, fallback = "Your profile") {
  const clean = String(name || "").trim();
  return clean || fallback;
}

function initials(name) {
  const clean = String(name || "").trim();
  if (!clean) return "You";
  return clean
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function avatarNode(person, className = "") {
  const color = avatarColors[Math.abs(hashCode(person.id || person.name || "person")) % avatarColors.length];
  const photo = person.profilePhoto || person.photo || "";
  if (photo) {
    return `<img class="avatar-photo ${escapeHtml(className)}" src="${escapeHtml(photo)}" alt="${escapeHtml(displayName(person.name))}" />`;
  }
  return `<div class="avatar ${color} ${escapeHtml(className)}">${escapeHtml(initials(person.name))}</div>`;
}

function storyMediaNode() {
  const media = state.currentUser.story && state.currentUser.story.dataUrl;
  if (media) {
    return `<img class="story-photo" src="${escapeHtml(media)}" alt="Your story" />`;
  }
  if (state.currentUser.profilePhoto) {
    return `<img class="story-photo" src="${escapeHtml(state.currentUser.profilePhoto)}" alt="Your profile" />`;
  }
  return icon("plus");
}

function renderAttachment(attachment) {
  if (!attachment) return "";
  if (attachment.kind === "image") {
    return `
      <figure class="message-attachment image-attachment">
        <img src="${escapeHtml(attachment.dataUrl)}" alt="${escapeHtml(attachment.name)}" />
        <figcaption>${escapeHtml(attachment.name)}</figcaption>
      </figure>
    `;
  }
  return `
    <div class="message-attachment file-attachment">
      ${icon("file")}
      <span>${escapeHtml(attachment.name)}</span>
    </div>
  `;
}

function optionList(options, selected) {
  const placeholder = selected ? "" : '<option value="" selected disabled>Select</option>';
  return placeholder + options
    .map(
      (item) =>
        `<option value="${escapeHtml(item)}"${item === selected ? " selected" : ""}>${escapeHtml(item)}</option>`,
    )
    .join("");
}

// profileById is defined later (after getAllProfiles) to include demo profiles

function requestFor(profileId) {
  return state.requests.find((request) => request.profileId === profileId);
}

function isSignedIn() {
  return Boolean(authAccessToken && state.auth.session && state.auth.session.signedIn);
}

function requireSignedIn(action) {
  if (isSignedIn()) return true;
  state.view = "auth";
  // First-time guests should see signup; existing users coming back can use login
  state.authTab = state.guestMode ? "signup" : "login";
  toast(`Create a free account to ${action}.`);
  saveState();
  render();
  return false;
}

function otherUserIdForConnection(row) {
  if (!row) return "";
  return row.requester_id === state.currentUser.id ? row.recipient_id : row.requester_id;
}

function syncConnectionRows(rows = []) {
  state.connectionRows = rows.filter(Boolean);
  state.requests = [];
  state.connections = [];
  state.connectionRows.forEach((row) => {
    const profileId = otherUserIdForConnection(row);
    if (!profileId) return;
    if (row.status === "accepted") {
      if (!state.connections.includes(profileId)) state.connections.push(profileId);
      return;
    }
    if (row.status === "pending") {
      state.requests.push({
        id: row.id,
        profileId,
        direction: row.recipient_id === state.currentUser.id ? "incoming" : "outgoing",
        status: "pending",
        note: row.note || "Respectful connection request.",
        createdAt: String(row.created_at || today()).slice(0, 10),
      });
    }
  });
}

function applyProfileRowToCurrentUser(row) {
  if (!row) return;
  state.currentUser.id = row.id || state.currentUser.id;
  state.currentUser.name = row.full_name || state.currentUser.name;
  state.currentUser.age = row.age || state.currentUser.age;
  state.currentUser.gender = row.gender || state.currentUser.gender;
  state.currentUser.country = row.country || state.currentUser.country;
  state.currentUser.city = row.city || state.currentUser.city;
  state.currentUser.role = row.role || state.currentUser.role;
  state.currentUser.field = row.field || state.currentUser.field;
  state.currentUser.organization = row.organization || state.currentUser.organization;
  state.currentUser.languages = Array.isArray(row.languages) ? row.languages.join(", ") : state.currentUser.languages;
  state.currentUser.purpose = Array.isArray(row.purposes) ? row.purposes.join(", ") : state.currentUser.purpose;
  state.currentUser.profilePhoto = row.profile_photo_url || state.currentUser.profilePhoto;
  state.currentUser.verification = {
    identity: row.identity_status || state.currentUser.verification.identity,
    role: row.role_status || state.currentUser.verification.role,
    gender: row.gender_status || state.currentUser.verification.gender,
    uniqueness: row.uniqueness_status || state.currentUser.verification.uniqueness,
  };
}

function countries() {
  return ["Any", ...Array.from(new Set(state.profiles.map((profile) => profile.country))).sort()];
}

function genders() {
  return ["Any", "Female", "Male"];
}

function trustCompletion() {
  const checks = Object.values(state.currentUser.verification);
  const complete = checks.filter((status) => status === "verified").length;
  return Math.round((complete / checks.length) * 100);
}

function verificationBadge(status) {
  const map = {
    verified: ["green", "Verified"],
    pending: ["amber", "Pending"],
    rejected: ["rose", "Needs fix"],
  };
  const [color, label] = map[status] || ["amber", "Pending"];
  return `<span class="badge ${color}">${icon("check", true)}${label}</span>`;
}

function render() {
  document.documentElement.dataset.theme = state.theme || "dark";
  const app = document.querySelector("#app");

  // Show landing page when not signed in and not explicitly on auth/landing
  if (!isSignedIn() && !["auth", "landing"].includes(state.view) && !state.guestMode) {
    state.view = "landing";
  }

  app.dataset.view = state.view;

  // `.app-shell` is the desktop/tablet grid layout (nav + feed + notification
  // rail columns). Landing and auth are full-screen views with no sidebar —
  // they must NOT carry that class, or their content gets squeezed into the
  // narrow center grid column instead of filling the screen. This was
  // hardcoded in index.html and never removed, which is why landing/auth
  // rendered as a cramped column pinned to the left on real screens instead
  // of centering and adapting to the viewport.
  const isFullScreenView = state.view === "landing" || state.view === "auth";
  app.classList.toggle("app-shell", !isFullScreenView);

  // Full-screen layouts (no sidebar/topbar)
  if (state.view === "landing") {
    app.innerHTML = renderLanding();
    return;
  }
  if (state.view === "auth") {
    app.innerHTML = renderAuthPage();
    return;
  }

  app.innerHTML = `
    ${renderSidebar()}
    <main class="main">
      ${renderTopbar()}
      ${renderView()}
    </main>
    ${renderCoachPanel()}
    <button class="floating-theme" data-action="toggle-theme" title="Switch ${state.theme === "dark" ? "light" : "dark"} mode">
      ${icon(state.theme === "dark" ? "sun" : "moon")}
      <span>${state.theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  `;
  attachLocalVideo();
}

function renderSidebar() {
  const pendingCount = state.requests.filter((r) => r.status === "pending").length;

  const nav = views
    .map(
      ([id, label, iconName]) => {
        const badge = id === "connections" && pendingCount > 0 ? `<span class="nav-badge">${pendingCount}</span>` : "";
        return `
          <button class="nav-button ${state.view === id ? "active" : ""}" data-view="${id}" title="${escapeHtml(label)}">
            ${icon(iconName)}
            <span>${escapeHtml(label)}</span>
            ${badge}
          </button>
        `;
      },
    )
    .join("");

  const user = state.currentUser;
  const userArea = isSignedIn()
    ? `<div class="sidebar-user">
        ${avatarNode(user, "sm")}
        <div>
          <strong>${escapeHtml(displayName(user.name, "You"))}</strong>
          <small>${escapeHtml(user.role)} · ${trustCompletion()}% verified</small>
        </div>
        <button class="nav-button-icon" data-view="settings" title="Settings">${icon("gear", true)}</button>
      </div>`
    : `<div class="sidebar-user">
        <button class="button gradient sidebar-signin-btn" data-view="auth">${icon("key")}Sign in</button>
      </div>`;

  return `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">${icon("heart")}</div>
        <div>
          <h1 class="brand-name">BondBridge</h1>
          <p class="brand-subtitle">Real people. Better bonds.</p>
        </div>
      </div>
      <nav class="nav-group" aria-label="Main navigation">
        ${nav}
        <button class="nav-button theme-nav" data-action="toggle-theme" title="Switch theme">
          ${icon(state.theme === "dark" ? "sun" : "moon")}
          <span>${state.theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>
      </nav>
      ${userArea}
    </aside>
  `;
}

function renderTopbar() {
  const titles = {
    dashboard: ["Home", "Your verified connection feed."],
    auth: ["Sign In", "Create or access your BondBridge account."],
    verify: ["Get Verified", "Prove your identity, role, and one-account status."],
    discover: ["Discover", "Find verified students and professionals to connect with."],
    connections: ["Requests", "Accept the people you want — private chat opens after both agree."],
    chat: ["Chat", "Write respectfully. Call only with consent."],
    family: ["Family", "Simple reminders so bonds don't fade over distance."],
    coach: ["Coach", "Get help writing messages, reconnecting, or starting a conversation."],
    admin: ["Safety", "Your reports and verification queue."],
    launch: ["Developer", "Backend status and API testing."],
    privacy: ["Data", "Export, reset, and control your local data."],
    settings: ["Settings", "Your account, privacy, and safety in one place."],
  };
  const [title, subtitle] = titles[state.view] || titles.dashboard;
  const installed = isStandaloneApp();
  return `
    <header class="topbar">
      <div>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(subtitle)}</p>
      </div>
      <div class="topbar-actions">
        <button class="button ${installed ? "success" : "gradient"} install-button" data-action="install-pwa" title="${installed ? "App installed" : "Install app"}" ${installed ? "disabled" : ""}>
          ${icon(installed ? "check" : "download")}<span class="install-label">${installed ? "Installed" : "Install"}</span>
        </button>
      </div>
    </header>
  `;
}

function renderView() {
  const renderers = {
    dashboard: renderDashboard,
    auth: renderAuthPage,
    verify: renderVerify,
    discover: renderDiscover,
    connections: renderConnections,
    chat: renderChat,
    family: renderFamily,
    coach: renderCoach,
    admin: renderAdmin,
    launch: renderLaunch,
    privacy: renderPrivacy,
    settings: renderSettings,
  };
  return (renderers[state.view] || renderDashboard)();
}

function renderDashboard() {
  const dueContacts = state.family.filter((person) => person.lastContactDays >= person.cadence);
  const pendingRequests = state.requests.filter((request) => request.status === "pending").length;
  const accepted = state.connections.length;
  const nextFamily = dueContacts[0] || state.family[0];
  const topMatch = getFilteredProfiles()[0];
  const loungeProfile = getCurrentMeetProfile();
  const inDemoMode = isDemoMode();
  const isNew = isSignedIn() && trustCompletion() === 0 && accepted === 0;

  return `
    <section class="insta-feed">
      ${!isSignedIn() ? renderWelcomeBanner() : ""}
      ${isNew ? renderOnboardingCard() : ""}
      ${inDemoMode ? renderDemoBanner() : ""}
      ${renderInstaStories()}
      ${renderMeetPost(loungeProfile, topMatch)}
      ${renderFamilyPost(nextFamily, dueContacts.length)}
      ${renderSafetyPost(pendingRequests, accepted)}
    </section>
  `;
}

function renderOnboardingCard() {
  const profileDone = verifyStepComplete("profile");
  const proofDone = verifyStepComplete("proof");
  const hasFriend = state.connections.length > 0;
  const firstName = displayName(state.currentUser.name, "").split(" ")[0] || "there";
  return `
    <article class="insta-post card pad onboarding-card">
      <div>
        <p class="eyebrow">Getting started</p>
        <h3>Welcome, ${escapeHtml(firstName)}! 👋</h3>
        <p>Complete these steps to start meeting verified people.</p>
      </div>
      <div class="onboarding-steps">
        <button class="onboarding-step" data-view="verify" data-step="profile">
          <div class="onboarding-step-num ${profileDone ? "done" : ""}">${profileDone ? icon("check") : "1"}</div>
          <div>
            <strong>Complete your profile</strong>
            <small>${profileDone ? "Done — looking good!" : "Add your name, age, country, and field"}</small>
          </div>
          ${profileDone ? "" : icon("arrow_right")}
        </button>
        <button class="onboarding-step" data-view="verify" data-step="proof">
          <div class="onboarding-step-num ${proofDone ? "done" : ""}">${proofDone ? icon("check") : "2"}</div>
          <div>
            <strong>Verify your role</strong>
            <small>${proofDone ? "Verified — others can trust you!" : "Upload student/professional proof to unlock discovery"}</small>
          </div>
          ${proofDone ? "" : icon("arrow_right")}
        </button>
        <button class="onboarding-step" data-view="discover">
          <div class="onboarding-step-num ${hasFriend ? "done" : ""}">${hasFriend ? icon("check") : "3"}</div>
          <div>
            <strong>Send your first request</strong>
            <small>${hasFriend ? "Connected — great start!" : "Browse verified people and send a request"}</small>
          </div>
          ${hasFriend ? "" : icon("arrow_right")}
        </button>
      </div>
    </article>
  `;
}

function renderWelcomeBanner() {
  return `
    <article class="insta-post card pad welcome-banner">
      <div class="welcome-inner">
        <span class="welcome-icon">${icon("heart")}</span>
        <div>
          <h2>Welcome to BondBridge</h2>
          <p>You're exploring as a guest. Sign up to connect with verified people, send requests, and chat.</p>
          <div class="row wrap" style="margin-top:12px">
            <button class="button gradient" data-action="go-signup">${icon("plus")}Create account</button>
            <button class="button" data-action="go-login">${icon("key")}Log in</button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderDemoBanner() {
  return `
    <article class="demo-notice">
      ${icon("sparkles", true)}
      <span>You're seeing <strong>demo profiles</strong>. Real verified users will appear here after they sign up and complete verification.</span>
    </article>
  `;
}

function renderInstaStories() {
  const storyItems = [
    { label: "Meet", sub: "Live", iconName: "search", view: "discover" },
    { label: "Family", sub: "Today", iconName: "heart", view: "family" },
    { label: "Coach", sub: "AI", iconName: "sparkles", view: "coach" },
    ...state.profiles.slice(0, 5).map((profile) => ({
      label: profile.name.split(" ")[0],
      sub: profile.country,
      initials: initials(profile.name),
      profileId: profile.id,
    })),
  ];

  return `
    <article class="story-tray">
      <label class="story-bubble upload-story" title="Add story photo">
        <input id="story-upload" type="file" accept="image/*" />
        <span class="story-ring">
          <span>${storyMediaNode()}</span>
        </span>
        <strong>Your story</strong>
        <small>${state.currentUser.story ? "Live" : "Add photo"}</small>
      </label>
      ${storyItems
        .map(
          (story) => `
            <button class="story-bubble" ${story.view ? `data-view="${story.view}"` : `data-action="connect" data-id="${story.profileId}"`} title="${escapeHtml(story.label)}">
              <span class="story-ring">
                <span>${story.initials ? escapeHtml(story.initials) : icon(story.iconName)}</span>
              </span>
              <strong>${escapeHtml(story.label)}</strong>
              <small>${escapeHtml(story.sub)}</small>
            </button>
          `,
        )
        .join("")}
    </article>
  `;
}

function renderMeetPost(profile, topMatch) {
  if (!profile) {
    return `
      <article class="insta-post card pad empty-live-card">
        <span class="check-dot">${icon("search", true)}</span>
        <div>
          <p class="eyebrow">Live discovery</p>
          <h2 class="section-title">No verified people are live yet</h2>
          <p class="text-muted">Sign up and complete verification to start meeting verified people.</p>
        </div>
        <div class="row wrap">
          <button class="button primary" data-view="auth" title="Create account">${icon("key")}Account</button>
          <button class="button" data-action="refresh-live-profiles" title="Refresh live profiles">${icon("server")}Refresh</button>
        </div>
      </article>
    `;
  }
  return `
    <article class="insta-post">
      <header class="post-head">
        <div class="person">
          <div class="mini-ring"><span>${avatarNode(profile)}</span></div>
          <div>
            <h3>bondbridge.verified</h3>
            <p>${escapeHtml(profile.country)} - ${escapeHtml(profile.purposes[0])}</p>
          </div>
        </div>
        <button class="icon-button" data-action="next-lounge" title="Next verified person">${icon("ban")}</button>
      </header>
      <div class="post-visual meet-visual">
        ${avatarNode(profile, "big")}
        <div>
          <span class="soft-label">${icon("shield", true)}Verified</span>
          <h2>${escapeHtml(profile.name)}, ${profile.age}</h2>
          <p>${escapeHtml(profile.role)} - ${escapeHtml(profile.field)} - ${escapeHtml(profile.country)}</p>
          <div class="badge-row">
            <span class="badge green">Respect ${profile.respectScore}</span>
            <span class="badge blue">${escapeHtml(profile.verified[0])}</span>
          </div>
        </div>
      </div>
      <div class="post-actions">
        <button class="post-icon" data-action="start-lounge" data-id="${profile.id}" title="Start intro">${icon("phone")}</button>
        <button class="post-icon" data-action="connect" data-id="${profile.id}" title="Request">${icon("heart")}</button>
        <button class="post-icon" data-action="translate-preview" data-id="${profile.id}" title="AI help">${icon("sparkles")}</button>
        <button class="post-icon push" data-action="report-profile" data-id="${profile.id}" title="Report">${icon("flag")}</button>
      </div>
      <div class="post-caption">
        <strong>${topMatch ? "Best match for you" : "Verified intro"}</strong>
        <span>${escapeHtml(profile.about)}</span>
      </div>
      <div class="post-cta">
        <button class="button gradient" data-action="start-lounge" data-id="${profile.id}" title="Start verified intro">Start intro</button>
        <button class="button" data-action="connect" data-id="${profile.id}" title="Send request">Request</button>
      </div>
    </article>
  `;
}

function renderFamilyPost(person, dueCount) {
  if (!person) {
    return `
      <article class="insta-post card pad empty-live-card">
        <span class="check-dot">${icon("heart", true)}</span>
        <div>
          <p class="eyebrow">Private reminders</p>
          <h2 class="section-title">Add your first real family or friend reminder</h2>
          <p class="text-muted">Nothing is prefilled. Your contacts stay local until you choose production sync.</p>
        </div>
        <button class="button primary" data-view="family" title="Add reminder">${icon("plus")}Add reminder</button>
      </article>
    `;
  }
  return `
    <article class="insta-post">
      <header class="post-head">
        <div class="person">
          <div class="mini-ring"><span class="family-avatar">${icon("heart")}</span></div>
          <div>
            <h3>family.bonds</h3>
            <p>${dueCount} reminder${dueCount === 1 ? "" : "s"} due</p>
          </div>
        </div>
        <button class="icon-button" data-view="family" title="Open family">${icon("heart")}</button>
      </header>
      <div class="post-visual family-visual">
        <span class="soft-label">${icon("heart", true)}Relationship reminder</span>
        <h2>Talk to ${escapeHtml(person.name)} today</h2>
        <p>${escapeHtml(person.notes)}</p>
        <button class="button gradient" data-action="mark-contacted" data-id="${person.id}" title="Mark contacted">${icon("phone")}Mark contacted</button>
      </div>
      <div class="post-actions">
        <button class="post-icon" data-action="family-message" data-id="${person.id}" title="Write message">${icon("message")}</button>
        <button class="post-icon" data-action="family-message" data-id="${person.id}" title="AI coach">${icon("sparkles")}</button>
        <button class="post-icon push" data-view="family" title="Open reminders">${icon("database")}</button>
      </div>
      <div class="post-caption">
        <strong>bondbridge</strong>
        <span>Small reminders can protect real relationships before distance becomes normal.</span>
      </div>
    </article>
  `;
}

function renderSafetyPost(pendingRequests, accepted) {
  return `
    <article class="insta-post">
      <header class="post-head">
        <div class="person">
          <div class="mini-ring"><span class="family-avatar">${icon("shield")}</span></div>
          <div>
            <h3>safety.center</h3>
            <p>${pendingRequests} requests - ${accepted} connected</p>
          </div>
        </div>
        <button class="icon-button" data-view="admin" title="Open safety">${icon("lock")}</button>
      </header>
      <div class="safety-grid">
        <button data-view="connections">${icon("message")}<strong>Message requests</strong><span>Accept before chat opens</span></button>
        <button data-view="verify">${icon("shield")}<strong>Verified identity</strong><span>No fake accounts</span></button>
        <button data-view="coach">${icon("sparkles")}<strong>Hidden words</strong><span>AI helps rewrite</span></button>
      </div>
    </article>
  `;
}

function actionTile(title, description, view, iconName, cta) {
  return `
    <button class="action-tile" data-view="${view}" title="${escapeHtml(title)}">
      <span>${icon(iconName)}</span>
      <strong>${escapeHtml(title)}</strong>
      <small>${escapeHtml(description)}</small>
      <em>${escapeHtml(cta)}</em>
    </button>
  `;
}

function renderCircleRail() {
  const circles = [
    {
      id: "family-circle",
      label: "Family",
      sub: `${state.family.filter((person) => person.lastContactDays >= person.cadence).length} due`,
      iconName: "heart",
      view: "family",
    },
    ...state.communities.map((community) => ({
      id: community.id,
      label: communityLabel(community.name),
      sub: community.joined ? "Joined" : "Open",
      iconName: community.purpose === "Marriage minded" ? "shield" : "users",
      view: "discover",
      communityId: community.id,
    })),
    {
      id: "coach-circle",
      label: "Coach",
      sub: "AI help",
      iconName: "sparkles",
      view: "coach",
    },
  ];

  return `
    <article class="card pad social-rail-card">
      <div class="row wrap">
        <div>
          <p class="eyebrow">Trusted circles</p>
          <h2 class="section-title">Explore like social media, but with purpose</h2>
        </div>
        <span class="badge blue">${icon("shield", true)}Verified spaces</span>
      </div>
      <div class="circle-rail">
        ${circles
          .map(
            (circle) => `
              <button class="circle-button" data-view="${circle.view}" title="${escapeHtml(circle.label)}">
                <span>${icon(circle.iconName)}</span>
                <strong>${escapeHtml(circle.label)}</strong>
                <small>${escapeHtml(circle.sub)}</small>
              </button>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function communityLabel(name) {
  const labels = {
    "AI Students Worldwide": "AI Students",
    "Pakistan-USA Culture Exchange": "PK-USA",
    "Verified Young Professionals": "Professionals",
    "Serious Values Circle": "Values",
  };
  return labels[name] || name.replace("Verified ", "").replace(" Worldwide", "");
}

function getCurrentMeetProfile() {
  const profiles = getFilteredProfiles();
  if (!profiles.length) return null;
  const index = Math.abs(state.currentMeetIndex || 0) % profiles.length;
  return profiles[index];
}

function renderMeetLounge(profile) {
  if (!profile) {
    return `
      <article class="card pad meet-lounge">
        <p class="eyebrow">Verified meet</p>
        <h2 class="section-title">No live verified stranger is ready</h2>
        <p class="text-muted">Live video intros will be available once verified users are in your area. Browse profiles to send a connection request instead.</p>
        <div class="row wrap">
          <button class="button primary" data-view="auth" title="Create account">${icon("key")}Account</button>
          <button class="button" data-action="refresh-live-profiles" title="Refresh live users">${icon("server")}Refresh</button>
        </div>
      </article>
    `;
  }
  const connected = state.connections.includes(profile.id);
  const live = state.meetMode === "live";
  return `
    <article class="meet-live-shell">
      <div class="live-title-row">
        <div>
          <p class="eyebrow">Verified live</p>
          <h2>Meet a respectful stranger</h2>
          <p>Short video intros with identity checks, report tools, and mutual request before private chat.</p>
        </div>
        <span class="live-pill ${live ? "on" : ""}">${live ? "Live video" : "Preview mode"}</span>
      </div>

      <div class="live-video-grid">
        <div class="live-video-tile stranger-tile ${live ? "active" : ""}">
          ${avatarNode(profile, "big")}
          <div class="video-overlay">
            <strong>${escapeHtml(profile.name)}, ${profile.age}</strong>
            <span>${escapeHtml(profile.country)} - ${escapeHtml(profile.field)}</span>
          </div>
        </div>
        <div class="live-video-tile self-tile">
          ${live ? `<video id="self-video" class="local-video-preview" autoplay muted playsinline></video>` : avatarNode(state.currentUser, "big")}
          <div class="video-overlay">
            <strong>You</strong>
            <span>${live ? "Camera and mic are browser-native" : state.currentUser.profilePhoto ? "Profile photo ready" : "Add profile photo"}</span>
          </div>
        </div>
      </div>

      <div class="live-profile-strip">
        <span class="badge green">${icon("shield", true)}Respect ${profile.respectScore}</span>
        <span class="badge blue">${escapeHtml(profile.verified[0])}</span>
        <span class="badge">${escapeHtml(profile.purposes[0])}</span>
        <span class="badge">${escapeHtml(profile.languages.join(", "))}</span>
      </div>

      <div class="meet-controls live-controls">
        <button class="button primary" data-action="start-lounge" data-id="${profile.id}" title="Start verified video">${icon("video")}${live ? "Video active" : "Start video"}</button>
        <button class="button" data-action="end-lounge" title="End video">${icon("ban")}End</button>
        <button class="button" data-action="next-lounge" title="Next verified stranger">${icon("search")}Next</button>
        ${
          connected
            ? `<button class="button success" data-action="open-chat" data-id="${profile.id}" title="Open chat">${icon("message")}Chat</button>`
            : `<button class="button success" data-action="connect" data-id="${profile.id}" title="Send request">${icon("plus")}Request</button>`
        }
        <button class="button" data-action="request-screen" data-id="${profile.id}" title="Share screen with browser permission">${icon("database")}Screen</button>
        <button class="icon-button" data-action="translate-preview" data-id="${profile.id}" title="AI intro help">${icon("sparkles")}</button>
        <button class="icon-button" data-action="report-profile" data-id="${profile.id}" title="Report">${icon("flag")}</button>
      </div>

      <p class="live-note">${icon("shield", true)} Video and screen share use browser permissions plus authenticated Supabase signaling. If either person uses abuse, the call is blocked and sent to Safety.</p>
    </article>
  `;
}

function renderConnectionFeed() {
  const items = [
    {
      iconName: "message",
      title: "Message requests folder",
      text: "New people cannot enter your main chat until you accept them.",
    },
    {
      iconName: "shield",
      title: "Hidden words protection",
      text: "Bad language is blocked and reports go to the safety queue.",
    },
    {
      iconName: "sparkles",
      title: "Translation and tone help",
      text: "AI helps people from different countries speak clearly and respectfully.",
    },
  ];

  return `
    <article class="card pad social-feed">
      <p class="eyebrow">Better than feeds</p>
      <h2 class="section-title">Connection feed</h2>
      <div class="feed-list">
        ${items
          .map(
            (item) => `
              <div class="feed-item">
                <span>${icon(item.iconName)}</span>
                <div>
                  <strong>${escapeHtml(item.title)}</strong>
                  <p>${escapeHtml(item.text)}</p>
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function statCard(label, value, description) {
  return `
    <article class="card stat">
      <span class="eyebrow">${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <span>${escapeHtml(description)}</span>
    </article>
  `;
}

function truthRow(label, status, detail) {
  return `
    <div class="row wrap">
      <div>
        <strong>${escapeHtml(label)}</strong>
        <p class="small text-muted">${escapeHtml(detail)}</p>
      </div>
      ${verificationBadge(status)}
    </div>
  `;
}

function renderVerify() {
  const user = state.currentUser;
  const step = ["profile", "proof", "safety"].includes(state.verifyStep) ? state.verifyStep : "profile";
  const trust = trustCompletion();
  const isNewUser = trust === 0;
  const firstName = displayName(user.name, "").split(" ")[0] || "there";

  return `
    <section class="verify-flow">

      ${isNewUser ? `
        <div class="verify-welcome-banner">
          <div class="verify-welcome-icon">🎉</div>
          <div>
            <h3>Welcome to BondBridge, ${escapeHtml(firstName)}!</h3>
            <p>Your account is ready. Complete these 3 quick steps so real people can find and trust you. It only takes a few minutes.</p>
          </div>
        </div>
      ` : ""}

      <section class="verify-summary" aria-label="Verification summary">
        <div class="verify-person">
          <span class="verify-avatar">${escapeHtml(initials(user.name))}</span>
          <div>
            <p class="eyebrow">Verification</p>
            <h2>${escapeHtml(displayName(user.name))}</h2>
            <p>${escapeHtml([user.role, user.field, user.country].filter(Boolean).join(" · ") || "Add your real public details")}</p>
          </div>
        </div>
        <div class="verify-score">
          <span>${trust}%</span>
          <div>
            <strong>Trust score</strong>
            <div class="progress-track"><div class="progress-fill" style="width:${trust}%"></div></div>
          </div>
        </div>
      </section>

      <nav class="verify-steps" aria-label="Verification steps">
        ${verifyStepButton("profile", "1", "Profile", "Public details", step)}
        ${verifyStepButton("proof", "2", "Proof", `${user.role || "Role"} status`, step)}
        ${verifyStepButton("safety", "3", "Safety", "One account", step)}
      </nav>

      ${step === "profile" ? renderProfileStep(user) : ""}
      ${step === "proof" ? renderProofStep(user) : ""}
      ${step === "safety" ? renderSafetyStep(user) : ""}
    </section>
  `;
}

function verifyStepComplete(step) {
  if (step === "profile") {
    const user = state.currentUser;
    return Boolean(user.name && user.age && user.gender && user.country && user.role && user.field);
  }
  if (step === "proof") return state.currentUser.verification.role === "verified";
  if (step === "safety") {
    const { identity, gender, uniqueness } = state.currentUser.verification;
    return [identity, gender, uniqueness].every((status) => status === "verified");
  }
  return false;
}

function verifyStepButton(step, number, title, subtitle, activeStep) {
  const complete = verifyStepComplete(step);
  return `
    <button class="verify-step ${activeStep === step ? "active" : ""} ${complete ? "done" : ""}" data-action="set-verify-step" data-step="${escapeHtml(step)}" title="${escapeHtml(title)}">
      <span>${complete ? icon("check", true) : escapeHtml(number)}</span>
      <strong>${escapeHtml(title)}</strong>
      <small>${escapeHtml(subtitle)}</small>
    </button>
  `;
}

function renderProfileStep(user) {
  return `
    <article class="card pad verify-stage">
      <div class="step-heading">
        <div>
          <p class="eyebrow">Step 1</p>
          <h2 class="section-title">Profile people will see</h2>
        </div>
        <span class="badge blue">${icon("shield", true)}Public</span>
      </div>
      <div class="profile-photo-editor">
        ${avatarNode(user, "big")}
        <label class="upload-button">
          ${icon("camera")}
          <span>${user.profilePhoto ? "Change profile photo" : "Add profile photo"}</span>
          <input id="profile-photo-input" type="file" accept="image/*" />
        </label>
      </div>
      <div class="verify-form">
        ${field("Full name", "profile-name", user.name, "text", "wide")}
        ${field("Age", "profile-age", user.age, "number")}
        ${selectField("Gender", "profile-gender", ["Male", "Female"], user.gender)}
        ${field("Country", "profile-country", user.country)}
        ${selectField("Role", "profile-role", ["Student", "Professional"], user.role)}
        ${selectField("Field", "profile-field", fieldOptions.slice(1), user.field)}
        ${field("University or company", "profile-org", user.organization, "text", "wide")}
        ${field("Languages", "profile-languages", user.languages, "text", "wide")}
        <label class="field wide">
          <span>Purpose</span>
          <textarea class="textarea" id="profile-purpose">${escapeHtml(user.purpose)}</textarea>
        </label>
      </div>
      <div class="verify-actions">
        <button class="button primary large" data-action="save-profile-next" title="Save and continue">${icon("check")}Save and continue</button>
        <span class="small text-muted">Proof documents stay private.</span>
      </div>
    </article>
  `;
}

function renderProofStep(user) {
  return `
    <article class="card pad verify-stage">
      <div class="step-heading">
        <div>
          <p class="eyebrow">Step 2</p>
          <h2 class="section-title">${escapeHtml(user.role)} proof</h2>
        </div>
        ${verificationBadge(user.verification.role)}
      </div>

      <div class="privacy-strip">
        ${icon("lock")}
        <div>
          <strong>Private by design</strong>
          <p class="small text-muted">The public profile never shows IDs, transcripts, work documents, or raw proof files.</p>
        </div>
      </div>

      <div class="verify-form proof-form">
        <label class="upload-tile wide">
          ${icon("file")}
          <strong>Add proof file</strong>
          <span>Student ID, transcript, university email screenshot, work proof, or LinkedIn evidence.</span>
          <input id="proof-file" type="file" accept="image/*,.pdf,.doc,.docx" />
        </label>
        <label class="field">
          <span>Proof type</span>
          <select class="select" id="proof-type">
            <option>University email</option>
            <option>Student ID</option>
            <option>Transcript</option>
            <option>Enrollment letter</option>
            <option>Work email</option>
            <option>LinkedIn profile</option>
            <option>Employment letter</option>
          </select>
        </label>
        <label class="field">
          <span>Reference note</span>
          <input class="input" id="proof-note" placeholder="Example: myname@university.edu" />
        </label>
      </div>

      <div class="verify-actions">
        <button class="button primary large" data-action="submit-proof" title="Submit proof">${icon("plus")}Submit proof</button>
        <button class="button large" data-action="set-verify-step" data-step="safety" title="Continue to safety">Continue</button>
      </div>

      <div class="proof-list">
        <h3>Recent submissions</h3>
        ${user.proofQueue
          .map(
            (item) => `
              <div class="proof-row">
                <div>
                  <strong>${escapeHtml(item.type)}</strong>
                  <p class="small text-muted">${escapeHtml(item.detail)}</p>
                </div>
                <span class="badge amber">${escapeHtml(item.status)}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderSafetyStep(user) {
  return `
    <article class="card pad verify-stage">
      <div class="step-heading">
        <div>
          <p class="eyebrow">Step 3</p>
          <h2 class="section-title">Trust checks</h2>
        </div>
        <span class="badge green">${trustCompletion()}% complete</span>
      </div>
      <div class="verify-checklist">
        ${verificationAction("identity", "Real identity", "Government ID plus selfie/liveness")}
        ${verificationAction("role", `${user.role} proof`, "University, work, or professional evidence")}
        ${verificationAction("gender", "Profile truth", "Gender and public details match trusted evidence")}
        ${verificationAction("uniqueness", "One account", "Phone, email, and device-risk checks")}
      </div>
    </article>
  `;
}

function verificationAction(key, title, description) {
  const status = state.currentUser.verification[key];
  const label = status === "verified" ? "Verified" : status === "pending" ? "Queued" : "Start";
  return `
    <div class="verify-check ${status}">
      <span class="check-dot">${status === "verified" ? icon("check", true) : icon("shield", true)}</span>
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p class="small text-muted">${escapeHtml(description)}</p>
      </div>
      <button class="button" data-action="verify-check" data-check="${key}" title="${escapeHtml(label)} ${escapeHtml(title)}" ${status === "verified" ? "disabled" : ""}>${label}</button>
    </div>
  `;
}

function field(label, id, value, type = "text", extraClass = "") {
  return `
    <label class="field ${escapeHtml(extraClass)}">
      <span>${escapeHtml(label)}</span>
      <input class="input" id="${escapeHtml(id)}" type="${type}" value="${escapeHtml(value)}" />
    </label>
  `;
}

function selectField(label, id, options, value, extraClass = "") {
  return `
    <label class="field ${escapeHtml(extraClass)}">
      <span>${escapeHtml(label)}</span>
      <select class="select" id="${escapeHtml(id)}">${optionList(options, value)}</select>
    </label>
  `;
}

function getFilteredProfiles() {
  const { country, purpose, field: fieldFilter, gender, search } = state.filters;
  const query = search.trim().toLowerCase();

  return getAllProfiles()
    .filter((profile) => profile.status === "active")
    .filter((profile) => !state.skipped.includes(profile.id))
    .filter((profile) => country === "Any" || profile.country === country)
    .filter((profile) => gender === "Any" || profile.gender === gender)
    .filter((profile) => fieldFilter === "Any" || profile.field === fieldFilter)
    .filter((profile) => purpose === "Any" || profile.purposes.includes(purpose))
    .filter((profile) => {
      if (!query) return true;
      return [
        profile.name,
        profile.country,
        profile.city,
        profile.role,
        profile.field,
        profile.organization,
        profile.about,
        profile.purposes.join(" "),
        profile.languages.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => matchScore(b) - matchScore(a));
}

function matchScore(profile) {
  let score = profile.respectScore;
  const userPurposes = state.currentUser.purpose.split(",").map((item) => item.trim());
  const userLanguages = state.currentUser.languages.split(",").map((item) => item.trim());
  if (profile.field === state.currentUser.field) score += 8;
  score += profile.purposes.filter((purpose) => userPurposes.includes(purpose)).length * 6;
  score += profile.languages.filter((language) => userLanguages.includes(language)).length * 4;
  if (profile.verified.includes("One account")) score += 4;
  return score;
}

function renderDiscover() {
  const profiles = getFilteredProfiles();
  const loungeProfile = getCurrentMeetProfile();
  return `
    <section class="discover-screen">
      ${renderMeetLounge(loungeProfile)}

      <article class="filter-dock">
        <div class="purpose-strip">
          ${purposeOptions
            .filter((purpose) => purpose !== "Any")
            .map(
              (purpose) => `
                <button class="purpose-chip ${state.filters.purpose === purpose ? "active" : ""}" data-action="set-purpose" data-purpose="${escapeHtml(purpose)}" title="${escapeHtml(purpose)}">
                  ${escapeHtml(purpose)}
                </button>
              `,
            )
            .join("")}
          <button class="purpose-chip ${state.filters.purpose === "Any" ? "active" : ""}" data-action="set-purpose" data-purpose="Any" title="Show all">All</button>
        </div>
        <div class="filters compact-filters">
          ${selectFilter("country", countries(), state.filters.country)}
          ${selectFilter("field", fieldOptions, state.filters.field)}
          ${selectFilter("gender", genders(), state.filters.gender)}
          <label class="field">
            <span>Search</span>
            <input class="input" id="filter-search" value="${escapeHtml(state.filters.search)}" placeholder="Country, university, interest" />
          </label>
        </div>
      </article>

      ${
        profiles.length
          ? `<div class="section-heading"><h2 class="section-title">${profiles.length} respectful match${profiles.length === 1 ? "" : "es"}</h2><p class="small text-muted">Sorted by respect score, shared interests, field, and language.</p></div><div class="profile-reel">${profiles.map(renderProfileCard).join("")}</div>`
          : `<div class="empty">No verified profiles yet. Be one of the first — sign up and complete verification to appear here.</div>`
      }

      <article class="request-group">
        <p class="eyebrow">Verified circles</p>
        <h2 class="section-title">Group spaces before private trust</h2>
        <div class="community-reel">
          ${state.communities.length ? state.communities.map(renderCommunity).join("") : `<div class="empty">Verified community circles are coming soon. Stay tuned!</div>`}
        </div>
      </article>
    </section>
  `;
}

function selectFilter(key, options, value) {
  return `
    <label class="field">
      <span>${escapeHtml(key[0].toUpperCase() + key.slice(1))}</span>
      <select class="select" data-filter="${escapeHtml(key)}">${optionList(options, value)}</select>
    </label>
  `;
}

function renderProfileCard(profile) {
  const request = requestFor(profile.id);
  const connected = state.connections.includes(profile.id);
  const action = connected
    ? `<button class="button primary" data-action="open-chat" data-id="${profile.id}" title="Open chat">${icon("message")}Message</button>`
    : request
      ? `<button class="button" disabled title="Request already sent">${icon("check")}Requested</button>`
      : `<button class="button primary" data-action="connect" data-id="${profile.id}" title="Send connection request">${icon("plus")}Request</button>`;

  return `
    <article class="profile-card social-profile-card">
      <div class="profile-media">
        ${avatarNode(profile, "big")}
        <span class="soft-label">${icon("shield", true)}Verified</span>
      </div>
      <div class="profile-card-body">
        <div class="person">
          ${avatarNode(profile)}
          <div>
            <h3>${escapeHtml(profile.name)}, ${profile.age}</h3>
            <p>${escapeHtml(profile.role)} - ${escapeHtml(profile.field)} - ${escapeHtml(profile.country)}</p>
          </div>
        </div>
        <div class="badge-row">
          <span class="badge green">${icon("shield", true)}Respect ${profile.respectScore}</span>
          ${profile.verified.slice(0, 2).map((item) => `<span class="badge blue">${escapeHtml(item)}</span>`).join("")}
        </div>
        <p class="small">${escapeHtml(profile.about)}</p>
        <div class="badge-row">${profile.purposes.slice(0, 3).map((purpose) => `<span class="badge">${escapeHtml(purpose)}</span>`).join("")}</div>
        <div class="profile-actions">
          <button class="icon-button" data-action="start-lounge" data-id="${profile.id}" title="Video intro">${icon("video")}</button>
          ${action}
          <button class="icon-button" data-action="skip-profile" data-id="${profile.id}" title="Skip profile">${icon("ban")}</button>
          <button class="icon-button" data-action="report-profile" data-id="${profile.id}" title="Report profile">${icon("flag")}</button>
        </div>
      </div>
    </article>
  `;
}

function renderCommunity(community) {
  const members = Number(community.members || 0);
  return `
    <article class="community-card">
      <div class="community-art">${icon(community.purpose === "Marriage minded" ? "heart" : "users")}</div>
      <div>
        <h3>${escapeHtml(community.name)}</h3>
        <p>${members.toLocaleString()} verified members - ${escapeHtml(community.purpose)}</p>
      </div>
      <button class="button ${community.joined ? "" : "primary"}" data-action="join-community" data-id="${community.id}" title="Join community">${community.joined ? icon("check") + "Joined" : icon("plus") + "Join"}</button>
    </article>
  `;
}

function hashCode(value) {
  return value.split("").reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0);
}

function renderConnections() {
  const pending = state.requests.filter((request) => request.status === "pending");
  const accepted = state.connections.map(profileById).filter(Boolean);

  return `
    <section class="request-screen">
      <article class="request-hero">
        <div>
          <p class="eyebrow">Requests</p>
          <h2>Only mutual connections enter chat</h2>
          <p>Accept, skip, or message people from one simple inbox.</p>
        </div>
        <span>${pending.length}</span>
      </article>

      <div class="social-stack">
        <article class="request-group">
          <h2 class="section-title">Pending requests</h2>
          <div class="list">
            ${pending.length ? pending.map(renderRequest).join("") : `<div class="empty">No pending requests right now.</div>`}
          </div>
        </article>

        <article class="request-group">
          <h2 class="section-title">Trusted connections</h2>
          <div class="list">
            ${
              accepted.length
                ? accepted
                    .map(
                      (profile) => `
                        <div class="request-row">
                          <div class="person">
                            ${avatarNode(profile)}
                            <div>
                              <h4>${escapeHtml(profile.name)}</h4>
                              <p>${escapeHtml(profile.country)} - ${escapeHtml(profile.purposes.join(", "))}</p>
                            </div>
                          </div>
                          <button class="button primary" data-action="open-chat" data-id="${profile.id}" title="Open chat">${icon("message")}Chat</button>
                        </div>
                      `,
                    )
                    .join("")
                : `<div class="empty">Accepted people will appear here.</div>`
            }
          </div>
        </article>
      </div>
    </section>
  `;
}

function renderRequest(request) {
  const profile = profileById(request.profileId);
  if (!profile) return "";
  const isIncoming = request.direction === "incoming";
  return `
    <div class="request-row">
      <div class="person">
        ${avatarNode(profile)}
        <div>
          <h4>${escapeHtml(profile.name)}</h4>
          <p>${escapeHtml(request.note)} ${isIncoming ? "Incoming request." : "Waiting for acceptance."}</p>
        </div>
      </div>
      <div class="row">
        ${
          isIncoming
            ? `<button class="button success" data-action="accept-request" data-id="${request.id}" title="Accept request">${icon("check")}Accept</button>`
            : `<span class="badge amber">Waiting</span>`
        }
        <button class="icon-button" data-action="decline-request" data-id="${request.id}" title="Decline request">${icon("ban")}</button>
      </div>
    </div>
  `;
}

function renderChat() {
  const connections = state.connections.map(profileById).filter(Boolean);
  const selected = profileById(state.selectedChat) || connections[0];
  if (selected && selected.id !== state.selectedChat) state.selectedChat = selected.id;

  return `
    <section class="card chat-layout">
      <div class="chat-list">
        <div class="card-header">
          <div>
            <p class="eyebrow">People</p>
            <h2 class="section-title">Inbox</h2>
          </div>
        </div>
        <div class="chat-contact-list">
          ${
            connections.length
              ? connections
                  .map(
                    (profile) => `
                      <button class="chat-person-button ${selected && selected.id === profile.id ? "active" : ""}" data-action="select-chat" data-id="${profile.id}" title="Select ${escapeHtml(profile.name)}">
                        ${avatarNode(profile)}
                        <span>
                          <strong>${escapeHtml(profile.name)}</strong>
                          <small>${escapeHtml(chatPreview(profile.id))}</small>
                        </span>
                        ${icon("message", true)}
                      </button>
                    `,
                  )
                  .join("")
              : `<div class="empty">Accept a connection to start chatting.</div>`
          }
        </div>
      </div>

      ${
        selected
          ? renderThread(selected)
          : `<div class="empty">No selected conversation.</div>`
      }
    </section>
  `;
}

function chatPreview(profileId) {
  const messages = state.chats[profileId] || [];
  const last = messages[messages.length - 1];
  if (!last) return "Start a respectful chat.";
  if (last.attachment && !last.text) return last.attachment.kind === "image" ? "Image shared" : "File shared";
  return last.text.length > 54 ? `${last.text.slice(0, 54)}...` : last.text;
}

function renderThread(profile) {
  const messages = state.chats[profile.id] || [];
  return `
    <div class="chat-thread">
      <div class="chat-thread-header">
        <div class="person">
          ${avatarNode(profile)}
          <div>
            <h3>${escapeHtml(profile.name)}</h3>
            <p>${escapeHtml(profile.country)} - ${escapeHtml(profile.connectionStyle)}</p>
          </div>
        </div>
        <div class="chat-actions">
          <button class="icon-button" data-action="request-call" data-id="${profile.id}" title="Request call">${icon("phone")}</button>
          <button class="icon-button" data-action="request-screen" data-id="${profile.id}" title="Request screen share consent">${icon("database")}</button>
          <button class="icon-button" data-action="report-profile" data-id="${profile.id}" title="Report conversation">${icon("flag")}</button>
        </div>
      </div>
      <div class="message-list">
        ${
          messages.length
            ? messages
                .map(
                  (message) => `
                    <div class="message ${message.from === "me" ? "me" : "them"}">
                      ${message.text ? escapeHtml(message.text) : ""}
                      ${renderAttachment(message.attachment)}
                      <div class="message-time">${escapeHtml(message.time)}</div>
                    </div>
                  `,
                )
                .join("")
            : `<div class="empty">Start with a respectful message. The AI coach can help.</div>`
        }
      </div>
      <div class="composer">
        <input class="input" id="chat-input" placeholder="Write a respectful message..." />
        <label class="icon-button file-pick" title="Attach image or file">
          ${icon("image")}
          <input id="chat-attachment" type="file" accept="image/*,.pdf,.doc,.docx" />
        </label>
        <button class="button coach-button" data-action="rewrite-chat" title="Improve message">${icon("sparkles")}Improve</button>
        <button class="button primary send-button" data-action="send-message" title="Send message">${icon("send")}Send</button>
      </div>
    </div>
  `;
}

function renderFamily() {
  const due = [...state.family].sort((a, b) => b.lastContactDays / b.cadence - a.lastContactDays / a.cadence);
  const weekly = due[0] || state.family[0];

  return `
    <section class="family-screen">
      <article class="family-spotlight">
        <span class="mini-ring"><span class="family-avatar">${icon("heart")}</span></span>
        <div>
          <p class="eyebrow">This week</p>
          <h2>Talk to ${weekly ? escapeHtml(weekly.name) : "someone close"}</h2>
          <p>${weekly ? `${weekly.lastContactDays} days since last contact - ${escapeHtml(weekly.notes)}` : "Add your first family or friend reminder."}</p>
        </div>
        ${
          weekly
            ? `<button class="button success" data-action="mark-contacted" data-id="${weekly.id}" title="Mark contacted">${icon("phone")}Done</button>`
            : ""
        }
      </article>

      <article class="quick-add-card">
        <p class="eyebrow">Add bond</p>
        <h2 class="section-title">Family or friend reminder</h2>
        <div class="quick-add-grid">
            ${field("Name", "family-name", "")}
            ${selectField("Relation", "family-relation", ["Parent", "Sibling", "Cousin", "Friend", "Mentor", "Other"], "Friend")}
            ${selectField("Channel", "family-channel", ["Phone call", "WhatsApp", "Message", "Video call", "Visit"], "Message")}
            ${field("Every N days", "family-cadence", 14, "number")}
        </div>
        <label class="field">
          <span>Private note</span>
          <input class="input" id="family-notes" placeholder="Ask about exams, health, work..." />
        </label>
        <button class="button primary large" data-action="add-family" title="Add reminder">${icon("plus")}Add reminder</button>
      </article>

      <article class="request-group">
        <h2 class="section-title">People to keep close</h2>
        <div class="list">
          ${state.family.length ? state.family.map(renderFamilyPerson).join("") : `<div class="empty">Add real family members, friends, mentors, or relatives here.</div>`}
        </div>
      </article>
    </section>
  `;
}

function renderFamilyPerson(person) {
  const overdue = person.lastContactDays >= person.cadence;
  return `
    <div class="request-row">
      <div>
        <strong>${escapeHtml(person.name)}</strong>
        <p class="small text-muted">${escapeHtml(person.relation)} - ${person.lastContactDays} days since contact - every ${person.cadence} days</p>
        <p class="small">${escapeHtml(person.notes)}</p>
      </div>
      <div class="row">
        <span class="badge ${overdue ? "amber" : "green"}">${overdue ? "Due" : "Healthy"}</span>
        <button class="icon-button" data-action="family-message" data-id="${person.id}" title="Generate message">${icon("sparkles")}</button>
        <button class="icon-button" data-action="mark-contacted" data-id="${person.id}" title="Mark contacted">${icon("phone")}</button>
      </div>
    </div>
  `;
}

function renderCoach() {
  return `
    <section class="coach-screen">
      <article class="coach-composer">
        <p class="eyebrow">AI Bond Coach</p>
        <h2>Write something kind</h2>
        <p class="text-muted">Choose the relationship, goal, and tone. BondBridge suggests respectful messages you can send or edit.</p>
        <div class="coach-input-grid">
          ${selectField("Relationship", "coach-relation", ["New verified friend", "Family member", "Old friend", "Study partner", "Professional contact", "Marriage minded match"], state.coach.relation)}
          ${selectField("Goal", "coach-goal", ["Start a respectful conversation", "Reconnect after a long time", "Apologize", "Ask for advice", "Set a boundary", "Plan a call"], state.coach.goal)}
          ${selectField("Tone", "coach-tone", ["Warm and confident", "Formal", "Friendly", "Gentle", "Direct but respectful"], state.coach.tone)}
        </div>
        <label class="field" style="margin-top:12px">
          <span>Context</span>
          <textarea class="textarea" id="coach-context">${escapeHtml(state.coach.context)}</textarea>
        </label>
        <button class="button primary large" data-action="generate-coach" title="Generate suggestions" ${state.coach.loading ? "disabled" : ""}>
          ${icon("sparkles")}${state.coach.loading ? "Thinking…" : "Generate suggestions"}
        </button>
      </article>

      <article class="draft-feed">
        <p class="eyebrow">Suggestions</p>
        <h2 class="section-title">
          Respectful drafts
          ${state.coach.source === "ai" && !state.coach.loading ? `<span class="badge green" style="margin-left:8px">${icon("sparkles", true)}AI</span>` : ""}
        </h2>
        <div class="draft-list">
          ${
            state.coach.loading
              ? `<div class="draft-card coach-thinking">
                   <span class="coach-dots"><i></i><i></i><i></i></span>
                   <p class="text-muted">Coach is writing three options for you…</p>
                 </div>`
              : state.coach.suggestions.length
                ? state.coach.suggestions
                    .map(
                      (suggestion, index) => `
                        <div class="draft-card">
                          <p>${escapeHtml(suggestion)}</p>
                          <button class="button" data-action="copy-suggestion" data-index="${index}" title="Copy suggestion">${icon("check")}Copy</button>
                        </div>
                      `,
                    )
                    .join("")
                : `<div class="empty">Generate suggestions to get polished messages for real relationships.</div>`
          }
        </div>
      </article>
    </section>
  `;
}

function renderCoachPanel() {
  const due = state.family.filter((person) => person.lastContactDays >= person.cadence).length;
  const best = getFilteredProfiles()[0];
  return `
    <aside class="coach-panel suggestions-panel">
      <div class="suggest-me">
        <div class="mini-ring"><span class="avatar">${escapeHtml(initials(state.currentUser.name))}</span></div>
        <div>
          <strong>${escapeHtml(displayName(state.currentUser.name))}</strong>
          <p>${escapeHtml(state.currentUser.role)} - Trust ${trustCompletion()}%</p>
        </div>
        <button data-view="verify">Verify</button>
      </div>
      <div class="suggest-head">
        <strong>Suggestions for you</strong>
        <button data-view="discover">See all</button>
      </div>
      <div class="suggest-list">
        ${
          getAllProfiles().length
            ? getAllProfiles()
                .slice(0, 4)
                .map(
                  (profile) => `
              <div class="suggest-row">
                <div class="mini-ring"><span class="avatar ${avatarColors[Math.abs(hashCode(profile.id)) % avatarColors.length]}">${escapeHtml(initials(profile.name))}</span></div>
                <div>
                  <strong>${escapeHtml(profile.name)}</strong>
                  <p>${escapeHtml(profile.field)} - Respect ${profile.respectScore}</p>
                </div>
                <button data-action="connect" data-id="${profile.id}">Request</button>
              </div>
            `,
                )
                .join("")
            : `<div class="empty">No live verified users yet.</div>`
        }
      </div>
      <div class="side-note">
        <strong>${due ? "Reconnect today" : "Family rhythm healthy"}</strong>
        <p>${due ? `${due} family or friend bond${due === 1 ? "" : "s"} need attention.` : "Your reminders are on track."}</p>
      </div>
    </aside>
  `;
}

function renderAdmin() {
  return `
    <section class="safety-center">
      <article class="safety-hero">
        <div>
          <p class="eyebrow">Safety center</p>
          <h2>Review what you submitted</h2>
          <p>Reports and proof submissions go to the live Supabase queues. Only a trusted operator should approve proof or suspend accounts.</p>
        </div>
        <div class="safety-score">
          <strong>${state.reports.length}</strong>
          <span>your reports</span>
        </div>
      </article>

      <section class="social-stack">
        <article class="safety-feed-card">
          <div class="step-heading">
            <div>
              <p class="eyebrow">Reports</p>
              <h2 class="section-title">Needs attention</h2>
            </div>
          </div>
          <div class="stack">
            ${
              state.reports.length
                ? state.reports
                    .map((report) => {
                      const profile = profileById(report.profileId);
                      return `
                        <div class="review-card">
                          <div class="person">
                            ${profile ? avatarNode(profile) : `<div class="avatar">?</div>`}
                            <div>
                              <h4>${escapeHtml(profile ? profile.name : "Unknown")}</h4>
                              <p>${escapeHtml(report.message)}</p>
                            </div>
                          </div>
                          <div class="review-actions">
                            <span class="badge ${report.priority === "High" ? "rose" : "amber"}">${escapeHtml(report.status || "open")}</span>
                            <button class="button" disabled title="Admin review required">${icon("shield")}Under review</button>
                          </div>
                        </div>
                      `;
                    })
                    .join("")
                : `<div class="empty">No open reports.</div>`
            }
          </div>
        </article>

        <article class="safety-feed-card">
          <p class="eyebrow">Proof review</p>
          <h2 class="section-title">Evidence queue</h2>
          <div class="stack">
            ${
              state.currentUser.proofQueue.length
                ? state.currentUser.proofQueue
                    .map(
                      (item) => `
                        <div class="review-card">
                          <div class="person">
                            <span class="check-dot">${icon("file", true)}</span>
                            <div>
                              <h4>${escapeHtml(item.type)}</h4>
                              <p>${escapeHtml(item.detail)}</p>
                            </div>
                          </div>
                          <div class="review-actions">
                            <span class="badge amber">${escapeHtml(item.status)}</span>
                            <button class="button" disabled title="Admin review required">${icon("shield")}Admin only</button>
                          </div>
                        </div>
                      `,
                    )
                    .join("")
                : `<div class="empty">No proof waiting.</div>`
            }
          </div>
        </article>

        <article class="safety-feed-card">
          <p class="eyebrow">Live user controls</p>
          <h2 class="section-title">Verified people</h2>
          <div class="safety-user-list">
            ${
              state.profiles.length
                ? state.profiles
                    .map(
                      (profile) => `
                  <div class="review-card compact">
                    <div class="person">
                      ${avatarNode(profile)}
                      <div>
                        <h4>${escapeHtml(profile.name)}</h4>
                        <p>${escapeHtml(profile.role)} - ${escapeHtml(profile.field)}</p>
                      </div>
                    </div>
                    <div class="review-actions">
                      <span class="badge green">Respect ${profile.respectScore}</span>
                      <span class="badge ${profile.status === "active" ? "green" : "rose"}">${escapeHtml(profile.status)}</span>
                      <button class="button" disabled title="Admin action is not exposed here">${icon("lock")}Admin only</button>
                    </div>
                  </div>
                `,
                    )
                    .join("")
                : `<div class="empty">No live users loaded for admin review.</div>`
            }
          </div>
        </article>
      </section>
    </section>
  `;
}

function serviceCards() {
  const status = state.launch.status;
  const services = status && Array.isArray(status.services) ? status.services : launchProviders.map((item) => ({ ...item, ready: false }));

  return services
    .map((service) => {
      const base = launchProviders.find((item) => item.key === service.key) || service;
      return `
        <article class="service-card ${service.ready ? "ready" : "waiting"}">
          <span>${icon(base.iconName || "server")}</span>
          <div>
            <div class="row wrap">
              <h3>${escapeHtml(service.name || base.name)}</h3>
              <span class="badge ${service.ready ? "green" : "amber"}">${service.ready ? "Connected" : "Needs setup"}</span>
            </div>
            <p>${escapeHtml(service.detail || base.detail)}</p>
            <code>${escapeHtml(service.env || base.env)}</code>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderPlanCard(name, label, detail, plan) {
  return `
    <article class="plan-card">
      <div>
        <p class="eyebrow">${escapeHtml(name)}</p>
        <h3>${escapeHtml(label)}</h3>
        <p>${escapeHtml(detail)}</p>
      </div>
      <button class="button gradient" data-action="select-free-plan" data-plan="${escapeHtml(plan)}" title="Use this launch path">${icon("check")}Use path</button>
    </article>
  `;
}

// ─── Landing / Welcome screen (shown when not signed in) ────────────────────
function renderLanding() {
  return `
    <div class="landing-shell" data-theme="${escapeHtml(state.theme || "dark")}">
      <button class="landing-theme" data-action="toggle-theme" title="Switch theme">
        ${icon(state.theme === "dark" ? "sun" : "moon")}
      </button>

      <div class="landing-hero">
        <div class="landing-logo">
          ${icon("heart")}
        </div>
        <h1 class="landing-title">BondBridge</h1>
        <p class="landing-tagline">Real people. Verified. Better bonds.</p>
        <p class="landing-sub">Connect with verified students and professionals — safely, respectfully, and meaningfully.</p>

        <div class="landing-actions">
          <button class="button gradient landing-btn" data-action="go-signup" title="Create free account">
            ${icon("arrow_right")} Get started free
          </button>
          <button class="button landing-btn-outline" data-action="go-login" title="Log in to your account">
            ${icon("key")} Already have an account
          </button>
        </div>
        <button class="landing-btn-ghost" data-action="guest-mode" title="Browse without signing in">
          Browse as guest (limited)
        </button>
      </div>

      <div class="landing-features">
        <div class="landing-feature">
          ${icon("shield")}
          <strong>Identity Verified</strong>
          <span>Every user proves who they are. No fakes, no bots.</span>
        </div>
        <div class="landing-feature">
          ${icon("users")}
          <strong>Mutual Only</strong>
          <span>Chat only opens when both people agree to connect.</span>
        </div>
        <div class="landing-feature">
          ${icon("heart")}
          <strong>Family Reminders</strong>
          <span>Never lose touch with people who matter most to you.</span>
        </div>
        <div class="landing-feature">
          ${icon("sparkles")}
          <strong>AI Message Coach</strong>
          <span>Get help writing warm, clear, respectful messages.</span>
        </div>
        <div class="landing-feature">
          ${icon("video")}
          <strong>Verified Video</strong>
          <span>Free video intros — only with verified, consenting users.</span>
        </div>
        <div class="landing-feature">
          ${icon("lock")}
          <strong>Your Privacy</strong>
          <span>Your data is yours. Export or reset it anytime.</span>
        </div>
      </div>

      <p class="landing-footer">Free to join · No ads · Respectful by design</p>
    </div>
  `;
}

// ─── Auth page (full-screen signup/login) ───────────────────────────────────
function renderAuthPage() {
  const signedIn = isSignedIn();
  const tab = state.authTab || "signup";

  if (signedIn) {
    return `
      <div class="auth-fullpage">
        <div class="auth-fullpage-inner">
          <button class="auth-back" data-view="dashboard">${icon("home", true)} Back to home</button>
          <div class="auth-signed-in-card">
            <span class="check-dot">${icon("check")}</span>
            <div>
              <h2>You're signed in</h2>
              <p>${escapeHtml(state.auth.email || state.currentUser.name || "Your account is active.")}</p>
              <p class="small text-muted">Trust score: ${trustCompletion()}% · ${state.profiles.filter(p=>!p.isDemo).length} live verified users</p>
            </div>
            <div class="row wrap">
              <button class="button primary" data-view="discover">${icon("search")}Discover</button>
              <button class="button" data-view="verify">${icon("shield")}Get verified</button>
              <button class="button danger" data-action="auth-logout">${icon("ban")}Sign out</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="auth-fullpage">
      <div class="auth-fullpage-inner">
        <button class="auth-back" data-action="go-landing">${icon("heart", true)} BondBridge</button>

        <div class="auth-tabs">
          <button class="auth-tab ${tab === "signup" ? "active" : ""}" data-action="auth-tab-signup">Create Account</button>
          <button class="auth-tab ${tab === "login" ? "active" : ""}" data-action="auth-tab-login">Log In</button>
        </div>

        ${tab === "login" ? renderLoginForm() : renderSignupForm()}
      </div>
    </div>
  `;
}

function renderLoginForm() {
  return `
    <div class="auth-form-card">
      <h2>Welcome back</h2>
      <p class="text-muted">Log in to your BondBridge account.</p>
      <div class="auth-form-fields">
        ${field("Email", "auth-email", state.auth.email, "email")}
        ${field("Password", "auth-password", "", "password")}
      </div>
      <button class="button gradient large auth-submit" data-action="auth-login">${icon("key")} Log in</button>
      <p class="auth-switch">Don't have an account? <button class="link-button" data-action="auth-tab-signup">Sign up free</button></p>
    </div>
  `;
}

function renderSignupForm() {
  return `
    <div class="auth-form-card">
      <div class="auth-form-header">
        <div class="auth-logo">${icon("heart")}</div>
        <h2>Join BondBridge</h2>
        <p class="text-muted">Real people. Verified. Better bonds.</p>
      </div>
      <div class="auth-form-fields">
        ${field("Full name", "auth-name", state.auth.name || state.currentUser.name, "text", "wide")}
        ${field("Email address", "auth-email", state.auth.email, "email", "wide")}
        ${field("Password (min. 8 characters)", "auth-password", "", "password", "wide")}
        <div class="auth-field-row">
          ${selectField("I am a", "auth-role", ["Student", "Professional"], state.auth.role || state.currentUser.role)}
          ${selectField("Gender", "auth-gender", ["Male", "Female"], state.currentUser.gender)}
        </div>
        <div class="auth-field-row">
          ${field("Age", "auth-age", state.currentUser.age || "", "number")}
          ${field("Country", "auth-country", state.auth.country || state.currentUser.country)}
        </div>
        <div class="auth-field-row">
          ${selectField("Field / Subject", "auth-field", fieldOptions.filter(f => f !== "Any"), state.currentUser.field || "Computer Science")}
          ${field("University / Company", "auth-org", state.currentUser.organization)}
        </div>
      </div>
      <button class="button gradient large auth-submit" data-action="auth-signup">${icon("arrow_right")} Create my account</button>
      <p class="auth-switch">Already have an account? <button class="link-button" data-action="auth-tab-login">Log in instead</button></p>
      <p class="auth-legal">By signing up you agree to be honest, respectful, and to use only one account.</p>
    </div>
  `;
}

// ─── Settings view (replaces separate admin + privacy pages) ─────────────────
function renderSettings() {
  const signedIn = isSignedIn();
  const user = state.currentUser;
  const trust = trustCompletion();
  const counts = {
    profiles: getAllProfiles().filter(p => !p.isDemo).length,
    family: state.family.length,
    chats: Object.values(state.chats).reduce((sum, list) => sum + list.length, 0),
    reports: state.reports.length,
  };

  return `
    <section class="settings-screen">
      <div class="settings-sections">

        <!-- Account card -->
        <article class="settings-block">
          <p class="eyebrow">Account</p>
          ${signedIn ? `
            <div class="settings-account-header">
              ${avatarNode(user, "sm")}
              <div>
                <h2>${escapeHtml(displayName(user.name))}</h2>
                <p>${escapeHtml(state.auth.email || "")} · Trust ${trust}%</p>
              </div>
            </div>
            <div class="progress-track" style="margin: 8px 0 16px">
              <div class="progress-fill" style="width:${trust}%"></div>
            </div>
            <div class="settings-list">
              <button class="settings-row" data-view="verify">
                <span>${icon("shield")}</span>
                <div>
                  <strong>${trust >= 80 ? "You are verified" : "Complete verification"}</strong>
                  <small>${trust >= 80 ? "Other users can see your verified badge" : `${trust}% done — finish to unlock full discovery`}</small>
                </div>
                ${icon("arrow_right")}
              </button>
              <button class="settings-row" data-view="discover">
                <span>${icon("search")}</span>
                <div><strong>Browse people</strong><small>Discover verified users and send requests</small></div>
                ${icon("arrow_right")}
              </button>
            </div>
            <div class="row wrap" style="margin-top:14px">
              <button class="button danger" data-action="auth-logout">${icon("logout")}Sign out</button>
            </div>
          ` : `
            <h2>Not signed in</h2>
            <p class="text-muted" style="margin:4px 0 14px">Sign in to connect with verified people, manage your profile, and more.</p>
            <button class="button gradient" data-action="go-signup">${icon("arrow_right")}Create free account</button>
            <button class="button" style="margin-top:8px" data-action="go-login">${icon("key")}Log in</button>
          `}
        </article>

        <!-- Appearance -->
        <article class="settings-block">
          <p class="eyebrow">Appearance</p>
          <h2>Theme</h2>
          <button class="settings-row" data-action="toggle-theme">
            <span>${icon(state.theme === "dark" ? "sun" : "moon")}</span>
            <div>
              <strong>${state.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}</strong>
              <small>Currently using ${state.theme} mode</small>
            </div>
          </button>
        </article>

        <!-- Privacy & data -->
        <article class="settings-block">
          <p class="eyebrow">Privacy</p>
          <h2>Your data</h2>
          <div class="metric-strip" style="margin:4px 0 14px">
            ${metricPill("Live users", counts.profiles)}
            ${metricPill("Messages", counts.chats)}
            ${metricPill("Family", counts.family)}
          </div>
          <div class="settings-list">
            <button class="settings-row" data-action="export-data">
              <span>${icon("download")}</span>
              <div><strong>Export my data</strong><small>Download a copy of everything stored here</small></div>
            </button>
            <button class="settings-row" data-action="restore-skipped">
              <span>${icon("check")}</span>
              <div><strong>Restore skipped profiles</strong><small>Bring back people you previously passed on</small></div>
            </button>
            <button class="settings-row danger" data-action="reset-data">
              <span>${icon("trash")}</span>
              <div><strong>Reset all data</strong><small>Clears everything stored in this browser</small></div>
            </button>
          </div>
        </article>

        ${state.reports.length ? `
        <article class="settings-block">
          <p class="eyebrow">Safety</p>
          <h2>Your reports</h2>
          <div class="list">
            ${state.reports.slice(0, 5).map((report) => {
              const profile = profileById(report.profileId);
              return `
                <div class="request-row">
                  <div>
                    <strong>${escapeHtml(profile ? profile.name : "Unknown user")}</strong>
                    <p class="small text-muted">${escapeHtml(report.message || "Reported for review")}</p>
                  </div>
                  <span class="badge ${report.priority === "High" ? "rose" : "amber"}">${escapeHtml(report.status || "open")}</span>
                </div>
              `;
            }).join("")}
          </div>
        </article>
        ` : ""}

        <!-- About -->
        <article class="settings-block">
          <p class="eyebrow">About</p>
          <h2>BondBridge</h2>
          <p class="text-muted" style="margin:4px 0 12px;font-size:0.9rem">Free · No ads · Respectful by design. Every user is verified before they can connect.</p>
          <div class="settings-list">
            <button class="settings-row" data-view="privacy">
              <span>${icon("lock")}</span>
              <div><strong>Privacy policy</strong><small>How we protect your data</small></div>
              ${icon("arrow_right")}
            </button>
          </div>
        </article>

      </div>
    </section>
  `;
}

// ─── OLD renderAuth kept for backward compat — now replaced by renderAuthPage ─
function renderAuth() {
  const result = state.auth.result;
  const signedIn = isSignedIn();
  return `
    <section class="auth-screen">
      <article class="auth-hero">
        <div>
          <p class="eyebrow">Real account</p>
          <h2>${signedIn ? "Account active" : "Create your verified profile"}</h2>
          <p>${signedIn ? "You can continue profile proof, discovery, and reminders from this browser." : "Use your real details. Discovery stays empty until the live database returns verified users."}</p>
        </div>
        <span class="account-status ${signedIn ? "ready" : ""}">${signedIn ? icon("check", true) + "Signed in" : icon("key", true) + "Not signed in"}</span>
      </article>

      <div class="auth-grid">
        <article class="auth-card">
          <p class="eyebrow">Signup / login</p>
          <h3>Access</h3>
          <div class="auth-form">
            ${field("Full name", "auth-name", state.auth.name || state.currentUser.name, "text", "wide")}
            ${field("Email", "auth-email", state.auth.email, "email")}
            ${field("Password", "auth-password", "", "password")}
            ${selectField("Role", "auth-role", ["Student", "Professional"], state.auth.role)}
            ${field("Country", "auth-country", state.auth.country || state.currentUser.country)}
          </div>
          <div class="row wrap">
            <button class="button primary" data-action="auth-signup" title="Create account">${icon("plus")}Sign up</button>
            <button class="button" data-action="auth-login" title="Log in">${icon("key")}Log in</button>
            <button class="button" data-action="save-auth-draft" title="Save local draft">${icon("check")}Save draft</button>
          </div>
        </article>

        <article class="auth-card">
          <p class="eyebrow">Live database</p>
          <h3>${state.live.loading ? "Syncing..." : `${state.profiles.length} verified users`}</h3>
          <p>${state.live.error ? escapeHtml(state.live.error) : state.live.lastSync ? `Last sync ${escapeHtml(state.live.lastSync)}` : "No live profile sync has completed yet."}</p>
          <div class="auth-step-list">
            <div class="auth-step"><span>${icon("key")}</span><strong>Account</strong><small>${signedIn ? "Ready" : "Required"}</small></div>
            <div class="auth-step"><span>${icon("shield")}</span><strong>Proof</strong><small>${trustCompletion()}% trust</small></div>
            <div class="auth-step"><span>${icon("search")}</span><strong>People</strong><small>${state.profiles.length ? "Live" : "Waiting"}</small></div>
          </div>
          <button class="button primary" data-action="refresh-live-profiles" title="Refresh live profiles">${icon("server")}Refresh live users</button>
        </article>
      </div>

      ${result ? `
      <article class="auth-result-clean ${result.title.toLowerCase().includes("unavailable") || result.title.toLowerCase().includes("error") ? "error" : "success"}">
        <span>${icon(result.title.toLowerCase().includes("unavailable") || result.title.toLowerCase().includes("error") ? "ban" : "check", true)}</span>
        <div>
          <strong>${escapeHtml(result.title)}</strong>
          <p>${escapeHtml(result.message)}</p>
        </div>
      </article>` : ""}
    </section>
  `;
}

function renderLaunch() {
  const status = state.launch.status;
  const services = status && Array.isArray(status.services) ? status.services : [];
  const readyCount = services.filter((service) => service.ready).length;
  const totalCount = services.length || launchProviders.length;
  const readiness = Math.round((readyCount / totalCount) * 100);
  const result = state.launch.apiResult;

  return `
    <section class="launch-screen">
      <article class="launch-hero">
        <div>
          <p class="eyebrow">SaaS launch console</p>
          <h2>${status && status.ok ? "Free production stack online" : "Free production stack ready"}</h2>
          <p>BondBridge is deployed with signup, free WebRTC room creation, manual proof review, local safety moderation, and readiness checks.</p>
        </div>
        <div class="launch-score">
          <strong>${readiness}%</strong>
          <span>${readyCount}/${totalCount} systems connected</span>
        </div>
      </article>

      <div class="launch-actions">
        <button class="button primary" data-action="refresh-launch-status" title="Check backend status">${icon("server")}Check backend</button>
        <button class="button" data-action="test-moderation-api" title="Test moderation API">${icon("shield")}Test safety API</button>
        <button class="button" data-action="create-video-room" title="Create free browser video room">${icon("video")}Free room</button>
        <button class="button" data-action="start-identity-check" title="Check manual proof review">${icon("key")}Proof review</button>
      </div>

      <div class="service-list">
        ${serviceCards()}
      </div>

      <div class="plan-grid">
        ${renderPlanCard("Student beta", "Free", "Verified campus discovery, respectful chat, study partners, and family reminders.", "student")}
        ${renderPlanCard("Global beta", "Free", "Cross-country friendships, free video intros, translation-style drafts, and safety controls.", "global")}
        ${renderPlanCard("Family beta", "Free", "Private family reminders, reconnection prompts, and local relationship notes.", "family")}
      </div>

      <article class="launch-panel">
        <div>
          <p class="eyebrow">Result</p>
          <h3>${result ? escapeHtml(result.title) : "No action tested yet"}</h3>
          <p>${result ? escapeHtml(result.message) : "Run a backend check, safety test, free video room, or proof review action."}</p>
        </div>
        ${result ? `<div class="launch-result-badges">
          <span class="badge ${result.title.includes("unavailable") ? "rose" : "green"}">${result.title.includes("unavailable") ? "Needs setup" : "Connected"}</span>
        </div>` : ""}
      </article>
    </section>
  `;
}

function renderPrivacy() {
  const counts = {
    profiles: state.profiles.length,
    connections: state.connections.length,
    communities: state.communities.filter((community) => community.joined).length,
    family: state.family.length,
    chats: Object.values(state.chats).reduce((sum, list) => sum + list.length, 0),
    reports: state.reports.length,
  };

  return `
    <section class="privacy-screen">
      <article class="privacy-hero">
        <div>
          <p class="eyebrow">Private vault</p>
          <h2>You control local and synced data</h2>
          <p>Unsigned drafts stay in this browser. Signed-in profile, proof, chat, reports, and reminders sync through Supabase RLS.</p>
        </div>
        <span class="check-dot">${icon("lock")}</span>
      </article>

      <div class="metric-strip">
        ${metricPill("Profiles", counts.profiles)}
        ${metricPill("Chats", counts.chats)}
        ${metricPill("Family", counts.family)}
        ${metricPill("Circles", counts.communities)}
      </div>

      <article class="settings-list">
        <button class="settings-row" data-action="export-data" title="Export local data">
          <span>${icon("download")}</span>
          <div><strong>Export my data</strong><small>Download a local JSON copy</small></div>
        </button>
        <button class="settings-row" data-action="restore-skipped" title="Restore skipped profiles">
          <span>${icon("check")}</span>
          <div><strong>Restore skipped people</strong><small>Bring skipped verified profiles back</small></div>
        </button>
        <button class="settings-row danger" data-action="reset-data" title="Delete local app data">
          <span>${icon("trash")}</span>
          <div><strong>Delete local app data</strong><small>Reset this browser</small></div>
        </button>
      </article>

      <p class="privacy-note">Production should use encrypted sync, provider-hosted identity checks, strict retention, and least-privilege admin access.</p>
    </section>
  `;
}

function metricPill(label, value) {
  return `
    <div class="metric-pill">
      <strong>${escapeHtml(value)}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `;
}

function getValue(id) {
  const node = document.querySelector(`#${id}`);
  return node ? node.value.trim() : "";
}

function toast(message) {
  const node = document.querySelector("#toast");
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove("show"), 2400);
}

function attachLocalVideo() {
  const node = document.querySelector("#self-video");
  if (node && localVideoStream && node.srcObject !== localVideoStream) {
    node.srcObject = localVideoStream;
    node.play().catch(() => {});
  }
}

async function startLocalVideo() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    toast("This browser does not support camera access.");
    return false;
  }
  try {
    localVideoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    attachLocalVideo();
    toast("Camera and microphone connected for free WebRTC.");
    return true;
  } catch (error) {
    toast("Camera permission was not granted.");
    return false;
  }
}

async function startScreenShare() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    toast("This browser does not support screen share.");
    return false;
  }
  try {
    screenShareStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    screenShareStream.getVideoTracks()[0]?.addEventListener("ended", () => {
      screenShareStream = null;
      toast("Screen share ended.");
    });
    toast("Screen share started with browser permission.");
    return true;
  } catch (error) {
    toast("Screen share permission was not granted.");
    return false;
  }
}

function stopMediaStreams() {
  [localVideoStream, screenShareStream].forEach((stream) => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
  });
  localVideoStream = null;
  screenShareStream = null;
}

function isStandaloneApp() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

async function installPwa() {
  if (isStandaloneApp()) {
    toast("BondBridge is already installed.");
    return;
  }
  if (!installPromptEvent) {
    toast("Use your browser menu to add BondBridge to the home screen.");
    return;
  }
  installPromptEvent.prompt();
  const choice = await installPromptEvent.userChoice.catch(() => ({ outcome: "dismissed" }));
  installPromptEvent = null;
  toast(choice.outcome === "accepted" ? "BondBridge install started." : "Install dismissed.");
  render();
}

function registerPwa() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker").catch(() => {});
  }
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function hasAbuse(text) {
  const blocked = ["fuck", "shit", "bitch", "asshole", "stupid", "idiot", "kill", "hate"];
  const normalized = text.toLowerCase();
  return blocked.some((word) => normalized.includes(word));
}

function respectfulRewrite(text) {
  const clean = text.trim();
  if (!clean) {
    return "Hi, I saw your verified profile and thought we may have a good conversation. Would you be open to connecting?";
  }
  return `Hi, I wanted to say this respectfully: ${clean.replace(/[!]{2,}/g, ".")} I would appreciate your thoughts whenever you are comfortable.`;
}

async function generateSuggestions() {
  const relation = getValue("coach-relation") || state.coach.relation;
  const goal = getValue("coach-goal") || state.coach.goal;
  const tone = getValue("coach-tone") || state.coach.tone;
  const context = getValue("coach-context") || state.coach.context;

  state.coach = { ...state.coach, relation, goal, tone, context, loading: true };
  render();

  const aiSuggestions = await askCoachAI({ relation, goal, tone, context });
  const usedAI = aiSuggestions.length > 0;

  state.coach = {
    relation,
    goal,
    tone,
    context,
    loading: false,
    source: usedAI ? "ai" : "offline",
    suggestions: usedAI ? aiSuggestions : buildSuggestions(relation, goal, tone, context),
  };
  saveState();
  render();
  toast(usedAI ? "Coach wrote you 3 options." : "Suggestions ready.");
}

// Calls the Supabase Edge Function, which holds the AI key server-side.
// Falls back to built-in templates if the coach is unreachable.
async function askCoachAI({ relation, goal, tone, context }) {
  const url = window.BONDBRIDGE_AI_URL || "";
  const key = window.BONDBRIDGE_SUPABASE_KEY || "";
  // The Edge Function verifies a JWT. A signed-in user's access token is one;
  // the publishable key is not. Guests fall back to the built-in templates.
  const token = authAccessToken || "";
  if (!url || !key || !token) return [];

  const prompt = [
    "Write 3 short message options I could actually send.",
    `Relationship: ${relation}`,
    `Goal: ${goal}`,
    `Tone: ${tone}`,
    context ? `Extra context: ${context}` : "",
    "Return ONLY the 3 messages, numbered 1. 2. 3., each on its own line. No preamble, no explanation.",
  ].filter(Boolean).join("\n");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        apikey: key,
      },
      body: JSON.stringify({ prompt, context: context || "" }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) return [];
    const data = await response.json();
    if (!data?.ok || !data.reply) return [];

    return String(data.reply)
      .split("\n")
      .map((line) => line.replace(/^\s*\d+[.)]\s*/, "").replace(/^["“]|["”]$/g, "").trim())
      .filter((line) => line.length > 15)
      .slice(0, 3);
  } catch {
    return [];
  }
}

function buildSuggestions(relation, goal, tone, context) {
  const baseContext = context ? ` I was thinking about this: ${context}` : "";
  const templates = {
    "Start a respectful conversation": [
      `Hi, I saw your profile and appreciated your interest in ${relation.toLowerCase()}. Would you be open to a respectful conversation this week?`,
      `Hello, nice to meet you. I am here for genuine connection, not random chatting.${baseContext}`,
      `Your background looked interesting to me. If you are comfortable, I would like to learn about your studies, work, or culture.`,
    ],
    "Reconnect after a long time": [
      `Hi, I know it has been a while. I hope you are doing well. I wanted to check in and hear how life has been for you.`,
      `I was thinking of you today and realized we have not spoken properly in some time. Would you like to catch up soon?`,
      `No pressure to reply quickly, but I wanted to reopen the connection with respect and good intention.`,
    ],
    Apologize: [
      `I want to apologize sincerely. I realize my words or actions may have hurt you, and I should have handled it with more care.`,
      `I am sorry for my part in what happened. I value the relationship and would like to listen before saying more.`,
      `You do not have to respond immediately. I just wanted to take responsibility and speak respectfully.`,
    ],
    "Ask for advice": [
      `Hi, I respect your experience and wanted to ask for advice if you have time. Your perspective would help me.`,
      `Would you be comfortable sharing how you approached this situation? I am trying to learn and make a better decision.`,
      `I would appreciate even a short suggestion. I know your time is valuable.`,
    ],
    "Set a boundary": [
      `I value respectful conversation, but I am not comfortable with that topic right now. Let us keep the discussion healthy.`,
      `I prefer to move slowly and build trust first. I hope you can respect that boundary.`,
      `I want this connection to stay positive, so I need us to communicate with patience and respect.`,
    ],
    "Plan a call": [
      `Would you be comfortable having a short call this week? We can keep it simple and talk about studies, work, or shared interests.`,
      `I would like to plan a respectful call when you are free. What day works best for you?`,
      `A short conversation may help us know each other better. No pressure if you prefer chat first.`,
    ],
  };
  const selected = templates[goal] || templates["Start a respectful conversation"];
  return selected.map((line) => `${line} Tone: ${tone}.`);
}

async function submitProof() {
  const type = getValue("proof-type");
  const proofFile = document.querySelector("#proof-file")?.files?.[0];
  const note = getValue("proof-note");
  if (!requireSignedIn("submitting verification proof")) return;
  const detail = proofFile ? `${proofFile.name}${note ? ` - ${note}` : ""}` : note || "Reference submitted";
  let upload = null;
  try {
    if (proofFile) upload = await uploadFileToStorage("bondbridge-proofs", proofFile);
  } catch (error) {
    toast(error.message || "Proof upload failed.");
    return;
  }
  const result = await apiJson("/api/proof", {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      document_type: type,
      storage_path: upload?.path || "",
      file_name: proofFile?.name || "",
      note,
    }),
  });
  if (!result.ok) {
    toast(result.payload?.message || "Proof could not be queued.");
    return;
  }
  const row = result.payload?.document;
  state.currentUser.proofQueue.unshift({
    id: row?.id || `proof-${Date.now()}`,
    type,
    detail,
    status: row?.status || "pending",
  });
  state.proofDocuments = [row, ...state.proofDocuments].filter(Boolean);
  state.currentUser.verification.role = "pending";
  toast("Proof queued for private review.");
}

async function saveProfile() {
  state.currentUser.name = getValue("profile-name") || state.currentUser.name;
  state.currentUser.age = Number(getValue("profile-age")) || state.currentUser.age;
  state.currentUser.gender = getValue("profile-gender") || state.currentUser.gender;
  state.currentUser.country = getValue("profile-country") || state.currentUser.country;
  state.currentUser.role = getValue("profile-role") || state.currentUser.role;
  state.currentUser.field = getValue("profile-field") || state.currentUser.field;
  state.currentUser.organization = getValue("profile-org") || state.currentUser.organization;
  state.currentUser.languages = getValue("profile-languages") || state.currentUser.languages;
  state.currentUser.purpose = getValue("profile-purpose") || state.currentUser.purpose;
  if (isSignedIn()) {
    try {
      if (state.currentUser.profilePhoto && state.currentUser.profilePhoto.startsWith("data:image/")) {
        const response = await fetch(state.currentUser.profilePhoto);
        const blob = await response.blob();
        const file = new File([blob], "profile-photo.png", { type: blob.type || "image/png" });
        const uploaded = await uploadFileToStorage("bondbridge-avatars", file);
        state.currentUser.profilePhoto = uploaded.public_url || state.currentUser.profilePhoto;
      }
    } catch (error) {
      toast(error.message || "Profile photo upload failed.");
      return;
    }
    const result = await apiJson("/api/profiles/me", {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        full_name: state.currentUser.name,
        gender: state.currentUser.gender,
        age: state.currentUser.age,
        country: state.currentUser.country,
        city: state.currentUser.city,
        role: state.currentUser.role,
        field: state.currentUser.field,
        organization: state.currentUser.organization,
        languages: state.currentUser.languages.split(",").map((item) => item.trim()).filter(Boolean),
        purposes: state.currentUser.purpose.split(",").map((item) => item.trim()).filter(Boolean),
        bio: state.currentUser.purpose,
        profile_photo_url: state.currentUser.profilePhoto.startsWith("http") ? state.currentUser.profilePhoto : "",
      }),
    });
    if (!result.ok) {
      toast(result.payload?.message || "Profile could not sync.");
      return;
    }
    applyProfileRowToCurrentUser(result.payload?.profile);
    toast("Profile saved and synced.");
  } else {
    toast("Profile saved locally. Sign in to sync across devices.");
  }
  saveState();
}

function profileById(id) {
  // Check real profiles first, then demo profiles
  return state.profiles.find((p) => p.id === id) || getAllProfiles().find((p) => p.id === id);
}

async function connect(profileId) {
  const profile = profileById(profileId);
  if (!profile) return;

  // Demo profile — prompt to sign up instead of sending a real request
  if (profile.isDemo) {
    toast("Sign up to send real connection requests to verified people.");
    state.view = "auth";
    state.authTab = "signup";
    saveState();
    render();
    return;
  }
  if (requestFor(profileId) || state.connections.includes(profileId)) {
    toast("This person is already in your request or connection list.");
    return;
  }
  if (!requireSignedIn("sending a real connection request")) return;
  const result = await apiJson("/api/connections/request", {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      recipient_id: profileId,
      note: `I would like a respectful ${profile.purposes[0]?.toLowerCase() || "friendship"} connection.`,
    }),
  });
  if (!result.ok) {
    toast(result.payload?.message || "Connection request could not be sent.");
    return;
  }
  state.requests.unshift({
    id: result.payload?.connection?.id || `r-${Date.now()}`,
    profileId,
    direction: "outgoing",
    status: "pending",
    note: `You requested a ${(profile.purposes[0] || "friendship").toLowerCase()} connection with ${profile.name}.`,
    createdAt: today(),
  });
  await refreshConnections(false);
  toast(`Connection request sent to ${profile.name}.`);
}

async function acceptRequest(requestId) {
  const request = state.requests.find((item) => item.id === requestId);
  if (!request) return;
  if (isSignedIn()) {
    const result = await apiJson("/api/connections/respond", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ connection_id: requestId, status: "accepted" }),
    });
    if (!result.ok) {
      toast(result.payload?.message || "Request could not be accepted.");
      return;
    }
  }
  request.status = "accepted";
  request.direction = "accepted";
  if (!state.connections.includes(request.profileId)) {
    state.connections.push(request.profileId);
  }
  if (!state.chats[request.profileId]) state.chats[request.profileId] = [];
  state.selectedChat = request.profileId;
  await refreshConnections(false);
  toast("Connection accepted. Private chat is now open.");
}

async function reportProfile(profileId) {
  const profile = profileById(profileId);
  if (!profile) return;
  if (!requireSignedIn("sending a real safety report")) return;
  const result = await apiJson("/api/reports", {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      reported_user_id: profileId,
      reason: `${profile.name} was reported for admin review.`,
    }),
  });
  if (!result.ok) {
    toast(result.payload?.message || "Report could not be sent.");
    return;
  }
  state.reports.unshift({
    id: result.payload?.report?.id || `rep-${Date.now()}`,
    profileId,
    type: "User report",
    message: `${profile.name} was reported for admin review.`,
    status: "Open",
    priority: "High",
  });
  toast("Report sent to Safety Admin.");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function buildChatAttachment() {
  const file = document.querySelector("#chat-attachment")?.files?.[0];
  if (!file) return null;
  if (file.type.startsWith("image/")) {
    return {
      kind: "image",
      name: file.name,
      type: file.type,
      dataUrl: await readFileAsDataUrl(file),
    };
  }
  return {
    kind: "file",
    name: file.name,
    type: file.type || "application/octet-stream",
  };
}

async function uploadFileToStorage(bucket, file) {
  if (!file || !isSignedIn()) return null;
  const maxBytes = bucket === "bondbridge-proofs" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`File must be ${Math.round(maxBytes / 1024 / 1024)}MB or smaller.`);
  }
  const dataUrl = await readFileAsDataUrl(file);
  const result = await apiJson("/api/storage/upload", {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      bucket,
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      dataUrl,
    }),
  });
  if (!result.ok) throw new Error(result.payload?.message || "File upload failed.");
  return result.payload;
}

async function sendMessage() {
  const input = document.querySelector("#chat-input");
  const text = input ? input.value.trim() : "";
  const file = document.querySelector("#chat-attachment")?.files?.[0];
  if (!text && !file) return;
  if (hasAbuse(text)) {
    state.moderationLog.unshift("Blocked outgoing message for disrespectful language.");
    toast("Message blocked — please rewrite it respectfully.");
    return;
  }
  const profileId = state.selectedChat;
  if (!profileId) return;

  // Build attachment locally first (works without Supabase)
  let attachment = null;
  if (file) {
    try {
      attachment = await buildChatAttachment();
    } catch (error) {
      toast("Could not read the attachment. Try again.");
      return;
    }
  }

  // Save message locally immediately so UX feels instant
  if (!state.chats[profileId]) state.chats[profileId] = [];
  state.chats[profileId].push({
    id: `msg-${Date.now()}`,
    from: "me",
    text,
    attachment,
    time: nowTime(),
  });
  if (input) input.value = "";
  // Clear attachment input
  const attachInput = document.querySelector("#chat-attachment");
  if (attachInput) attachInput.value = "";

  saveState();
  render();

  // Optionally try to sync to Supabase if signed in (non-blocking)
  if (isSignedIn()) {
    let attachmentPath = "";
    if (file && attachment) {
      try {
        const uploaded = await uploadFileToStorage("bondbridge-chat", file);
        attachmentPath = uploaded?.path || "";
      } catch (_) {
        // Attachment stays local — not a fatal error
      }
    }
    apiJson("/api/messages", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ recipient_id: profileId, body: text, attachment_path: attachmentPath }),
    }).catch(() => {});
  }
}

async function addFamily() {
  const name = getValue("family-name");
  if (!name) {
    toast("Add a name first.");
    return;
  }
  const reminder = {
    id: `f-${Date.now()}`,
    name,
    relation: getValue("family-relation") || "Friend",
    channel: getValue("family-channel") || "Message",
    cadence: Math.max(1, Number(getValue("family-cadence")) || 14),
    lastContactDays: 0,
    notes: getValue("family-notes") || "Check in with kindness.",
  };

  if (isSignedIn()) {
    const result = await apiJson("/api/family-reminders", {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        name: reminder.name,
        relationship: reminder.relation,
        cadence_days: reminder.cadence,
        notes: reminder.notes,
      }),
    });
    if (!result.ok) {
      toast(result.payload?.message || "Reminder could not sync.");
      return;
    }
    await refreshFamilyReminders(false);
    toast("Relationship reminder synced.");
    return;
  }

  state.family.unshift(reminder);
  toast("Reminder saved locally. Log in to sync it.");
}

async function markFamilyContacted(id) {
  const person = state.family.find((item) => item.id === id);
  if (!person) return;
  if (isSignedIn()) {
    const result = await apiJson("/api/family-reminders/contacted", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ reminder_id: id }),
    });
    if (!result.ok) {
      toast(result.payload?.message || "Reminder could not be updated.");
      return;
    }
    await refreshFamilyReminders(false);
    toast(`${person.name} marked as contacted.`);
    return;
  }
  person.lastContactDays = 0;
  toast(`${person.name} marked locally. Log in to sync it.`);
}

async function declineRequest(requestId) {
  if (isSignedIn()) {
    const result = await apiJson("/api/connections/respond", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ connection_id: requestId, status: "declined" }),
    });
    if (!result.ok) {
      toast(result.payload?.message || "Request could not be declined.");
      return;
    }
  }
  state.requests = state.requests.filter((request) => request.id !== requestId);
  await refreshConnections(false);
  toast("Request declined.");
}

function familyMessage(id) {
  const person = state.family.find((item) => item.id === id);
  if (!person) return;
  state.coach.relation = person.relation;
  state.coach.goal = "Reconnect after a long time";
  state.coach.tone = "Warm and confident";
  state.coach.context = `I want to reconnect with ${person.name}. Private note: ${person.notes}`;
  state.coach.suggestions = buildSuggestions(state.coach.relation, state.coach.goal, state.coach.tone, state.coach.context);
  state.view = "coach";
  toast("AI coach prepared a reconnection message.");
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "bondbridge-local-data.json";
  anchor.click();
  URL.revokeObjectURL(url);
  toast("Local data exported.");
}

// ═══════════════════════════════════════════════════════════════════════════
//  SUPABASE BACKEND
//  The app used to call /api/* on a Node server. On static hosting there is
//  no server, so every call failed. These functions talk to Supabase directly
//  from the browser — Row Level Security enforces permissions in the database.
// ═══════════════════════════════════════════════════════════════════════════

let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;
  const url = window.BONDBRIDGE_SUPABASE_URL || "";
  const key = window.BONDBRIDGE_SUPABASE_KEY || "";
  if (!url || !key || !window.supabase || typeof window.supabase.createClient !== "function") return null;
  supabaseClient = window.supabase.createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: "bondbridge-auth",
    },
    realtime: { params: { eventsPerSecond: 10 } },
  });
  return supabaseClient;
}

function backendReady() {
  return Boolean(getSupabase());
}

async function currentAuthUser(client) {
  const { data } = await client.auth.getUser();
  return data?.user || null;
}

// Keeps the same { ok, status, payload } shape the whole app already expects,
// so every existing call site keeps working.
async function apiJson(path, options = {}) {
  const client = getSupabase();
  if (!client) {
    return {
      ok: false,
      status: 0,
      payload: { ok: false, message: "Can't reach BondBridge servers. Check your internet connection." },
    };
  }
  let body = {};
  if (options.body) {
    try { body = JSON.parse(options.body); } catch { body = {}; }
  }
  const method = String(options.method || "GET").toUpperCase();
  try {
    const payload = await supabaseRoute(client, path, method, body);
    if (payload && payload.ok === false) return { ok: false, status: 400, payload };
    return { ok: true, status: 200, payload: payload || { ok: true } };
  } catch (error) {
    return { ok: false, status: 0, payload: { ok: false, message: error?.message || "Something went wrong." } };
  }
}

async function supabaseRoute(client, rawPath, method, body) {
  const [pathname, queryString = ""] = String(rawPath).split("?");
  const params = new URLSearchParams(queryString);

  switch (`${method} ${pathname}`) {
    case "POST /api/auth/signup":          return sbSignup(client, body);
    case "POST /api/auth/login":           return sbLogin(client, body);
    case "GET /api/status":                return sbStatus(client);
    case "GET /api/profiles":              return sbListProfiles(client);
    case "GET /api/me":                    return sbGetMe(client);
    case "POST /api/profiles/me":          return sbSaveProfile(client, body);
    case "GET /api/connections":           return sbListConnections(client);
    case "POST /api/connections/request":  return sbRequestConnection(client, body);
    case "POST /api/connections/respond":  return sbRespondConnection(client, body);
    case "GET /api/messages":              return sbListMessages(client, params.get("recipient_id"));
    case "POST /api/messages":             return sbSendMessageRow(client, body);
    case "GET /api/family-reminders":      return sbListFamily(client);
    case "POST /api/family-reminders":     return sbAddFamily(client, body);
    case "POST /api/family-reminders/contacted": return sbFamilyContacted(client, body);
    case "GET /api/reports":               return sbListReports(client);
    case "POST /api/reports":              return sbAddReport(client, body);
    case "POST /api/proof":                return sbAddProof(client, body);
    case "POST /api/storage/upload":       return sbUploadFile(client, body);
    case "POST /api/video/room":           return sbCreateVideoRoom(client, body);
    case "POST /api/moderate":
      return { ok: true, allowed: !hasAbuse(body.text || ""), provider: "on-device" };
    case "POST /api/identity/session":
      return { ok: true, provider: "supabase", message: "Proof review is handled inside the app." };
    case "POST /api/checkout":
      return { ok: true, provider: "free", paid_api: false, message: "BondBridge is free." };
    default:
      return { ok: false, message: "That feature isn't available yet." };
  }
}

// ─── Auth ────────────────────────────────────────────────────────────────────

async function sbSignup(client, body) {
  const { data, error } = await client.auth.signUp({
    email: String(body.email || "").trim(),
    password: body.password,
    options: {
      data: {
        full_name: body.name,
        gender: body.gender,
        age: body.age,
        country: body.country,
        role: body.role,
        field: body.field,
        organization: body.organization,
        languages: Array.isArray(body.languages) ? body.languages : ["English"],
        purposes: Array.isArray(body.purposes) ? body.purposes : ["Friendship"],
        bio: body.bio || "",
      },
    },
  });
  if (error) return { ok: false, message: friendlyAuthError(error.message) };

  if (data.session) authAccessToken = data.session.access_token;
  if (data.user) state.currentUser.id = data.user.id;

  return {
    ok: true,
    user: data.user ? { id: data.user.id, email: data.user.email } : null,
    session: data.session
      ? { access_token: data.session.access_token, expires_at: data.session.expires_at }
      : null,
    needs_email_confirmation: !data.session,
  };
}

async function sbLogin(client, body) {
  const { data, error } = await client.auth.signInWithPassword({
    email: String(body.email || "").trim(),
    password: body.password,
  });
  if (error) return { ok: false, message: friendlyAuthError(error.message) };

  if (data.session) authAccessToken = data.session.access_token;
  if (data.user) state.currentUser.id = data.user.id;

  return {
    ok: true,
    user: { id: data.user.id, email: data.user.email },
    session: { access_token: data.session.access_token, expires_at: data.session.expires_at },
  };
}

function friendlyAuthError(message = "") {
  const text = message.toLowerCase();
  if (text.includes("already registered") || text.includes("already been registered")) {
    return "An account with this email already exists.";
  }
  if (text.includes("invalid login") || text.includes("invalid credentials")) {
    return "Incorrect email or password.";
  }
  if (text.includes("email not confirmed")) {
    return "Please confirm your email first — check your inbox.";
  }
  if (text.includes("password")) return "Password must be at least 8 characters.";
  if (text.includes("rate limit")) return "Too many attempts. Wait a minute and try again.";
  return message || "Something went wrong. Please try again.";
}

async function sbStatus(client) {
  const { error } = await client.from("profiles").select("id", { count: "exact", head: true });
  return {
    ok: !error,
    mode: "supabase",
    message: error ? error.message : "Connected.",
    services: launchProviders.map((item) => ({ ...item, ready: !error })),
  };
}

// ─── Profiles ────────────────────────────────────────────────────────────────

async function sbListProfiles(client) {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("is_suspended", false)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return { ok: false, message: error.message };
  const myId = state.currentUser.id;
  return { ok: true, profiles: (data || []).filter((row) => row.id !== myId) };
}

async function sbGetMe(client) {
  const user = await currentAuthUser(client);
  if (!user) return { ok: false, message: "You're signed out." };
  const { data, error } = await client.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error) return { ok: false, message: error.message };
  return { ok: true, profile: data, user: { id: user.id, email: user.email } };
}

async function sbSaveProfile(client, body) {
  const user = await currentAuthUser(client);
  if (!user) return { ok: false, message: "You're signed out." };

  const age = Math.min(90, Math.max(18, Number(body.age) || 18));
  const row = {
    id: user.id,
    full_name: String(body.full_name || "").trim() || "BondBridge member",
    gender: ["Male", "Female"].includes(body.gender) ? body.gender : "Male",
    age,
    country: String(body.country || "").trim() || "Not set",
    city: body.city || null,
    role: ["Student", "Professional"].includes(body.role) ? body.role : "Student",
    field: String(body.field || "").trim() || "Not set",
    organization: String(body.organization || "").trim() || "Not set",
    languages: Array.isArray(body.languages) && body.languages.length ? body.languages : ["English"],
    purposes: Array.isArray(body.purposes) && body.purposes.length ? body.purposes : ["Friendship"],
    bio: body.bio || "",
    updated_at: new Date().toISOString(),
  };
  if (body.profile_photo_url) row.profile_photo_url = body.profile_photo_url;

  const { data, error } = await client.from("profiles").upsert(row).select().maybeSingle();
  if (error) return { ok: false, message: error.message };
  return { ok: true, profile: data };
}

// ─── Connections ─────────────────────────────────────────────────────────────

async function sbListConnections(client) {
  const user = await currentAuthUser(client);
  if (!user) return { ok: false, message: "You're signed out." };
  const { data, error } = await client
    .from("connections")
    .select("*")
    .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false });
  if (error) return { ok: false, message: error.message };
  return { ok: true, connections: data || [] };
}

async function sbRequestConnection(client, body) {
  const user = await currentAuthUser(client);
  if (!user) return { ok: false, message: "You're signed out." };
  if (!body.recipient_id) return { ok: false, message: "No person selected." };
  if (body.recipient_id === user.id) return { ok: false, message: "You can't connect with yourself." };

  const { data, error } = await client
    .from("connections")
    .insert({
      requester_id: user.id,
      recipient_id: body.recipient_id,
      note: body.note || "",
      status: "pending",
    })
    .select()
    .maybeSingle();

  if (error) {
    if (error.code === "23505") return { ok: false, message: "You already have a request with this person." };
    if (error.code === "23503") return { ok: false, message: "That person is no longer available." };
    return { ok: false, message: error.message };
  }
  return { ok: true, connection: data };
}

async function sbRespondConnection(client, body) {
  const user = await currentAuthUser(client);
  if (!user) return { ok: false, message: "You're signed out." };
  const status = ["accepted", "declined", "blocked"].includes(body.status) ? body.status : "accepted";
  const { data, error } = await client
    .from("connections")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", body.connection_id)
    .select()
    .maybeSingle();
  if (error) return { ok: false, message: error.message };
  return { ok: true, connection: data };
}

// Finds the connection between me and another user (either direction)
async function sbFindConnection(client, otherUserId) {
  const user = await currentAuthUser(client);
  if (!user || !otherUserId) return null;
  const { data } = await client
    .from("connections")
    .select("id,status,requester_id,recipient_id")
    .or(
      `and(requester_id.eq.${user.id},recipient_id.eq.${otherUserId}),` +
      `and(requester_id.eq.${otherUserId},recipient_id.eq.${user.id})`,
    )
    .limit(1)
    .maybeSingle();
  return data || null;
}

// ─── Messages ────────────────────────────────────────────────────────────────

async function sbListMessages(client, otherUserId) {
  if (!otherUserId) return { ok: true, messages: [] };
  const connection = await sbFindConnection(client, otherUserId);
  if (!connection) return { ok: true, messages: [] };
  const { data, error } = await client
    .from("messages")
    .select("*")
    .eq("connection_id", connection.id)
    .order("created_at", { ascending: true })
    .limit(500);
  if (error) return { ok: false, message: error.message };
  return { ok: true, messages: data || [], connection_id: connection.id };
}

async function sbSendMessageRow(client, body) {
  const user = await currentAuthUser(client);
  if (!user) return { ok: false, message: "You're signed out." };
  const connection = await sbFindConnection(client, body.recipient_id);
  if (!connection) return { ok: false, message: "Send a connection request first." };
  if (connection.status !== "accepted") {
    return { ok: false, message: "You can chat once your request is accepted." };
  }
  const { data, error } = await client
    .from("messages")
    .insert({
      connection_id: connection.id,
      sender_id: user.id,
      body: body.body || "",
      attachment_url: body.attachment_path || null,
    })
    .select()
    .maybeSingle();
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: data };
}

// ─── Family reminders ────────────────────────────────────────────────────────

async function sbListFamily(client) {
  const user = await currentAuthUser(client);
  if (!user) return { ok: false, message: "You're signed out." };
  const { data, error } = await client
    .from("family_reminders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return { ok: false, message: error.message };
  return { ok: true, reminders: data || [] };
}

async function sbAddFamily(client, body) {
  const user = await currentAuthUser(client);
  if (!user) return { ok: false, message: "You're signed out." };
  const { data, error } = await client
    .from("family_reminders")
    .insert({
      user_id: user.id,
      name: body.name,
      relationship: body.relationship || "Friend",
      cadence_days: Math.min(365, Math.max(1, Number(body.cadence_days) || 7)),
      notes: body.notes || "",
    })
    .select()
    .maybeSingle();
  if (error) return { ok: false, message: error.message };
  return { ok: true, reminder: data };
}

async function sbFamilyContacted(client, body) {
  const user = await currentAuthUser(client);
  if (!user) return { ok: false, message: "You're signed out." };
  const { data, error } = await client
    .from("family_reminders")
    .update({ last_contact_at: new Date().toISOString().slice(0, 10) })
    .eq("id", body.id)
    .eq("user_id", user.id)
    .select()
    .maybeSingle();
  if (error) return { ok: false, message: error.message };
  return { ok: true, reminder: data };
}

// ─── Reports ─────────────────────────────────────────────────────────────────

async function sbListReports(client) {
  const user = await currentAuthUser(client);
  if (!user) return { ok: false, message: "You're signed out." };
  const { data, error } = await client
    .from("reports")
    .select("*")
    .eq("reporter_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return { ok: false, message: error.message };
  return { ok: true, reports: data || [] };
}

async function sbAddReport(client, body) {
  const user = await currentAuthUser(client);
  if (!user) return { ok: false, message: "You're signed out." };
  const { data, error } = await client
    .from("reports")
    .insert({
      reporter_id: user.id,
      reported_user_id: body.reported_user_id || null,
      reason: body.reason || "Reported for review.",
    })
    .select()
    .maybeSingle();
  if (error) return { ok: false, message: error.message };
  return { ok: true, report: data };
}

async function sbAddProof(client, body) {
  const user = await currentAuthUser(client);
  if (!user) return { ok: false, message: "You're signed out." };
  const { data, error } = await client
    .from("verification_documents")
    .insert({
      user_id: user.id,
      document_type: body.document_type || "proof",
      storage_path: body.storage_path || "",
      reviewer_note: body.note || null,
    })
    .select()
    .maybeSingle();
  if (error) return { ok: false, message: error.message };
  await client.from("profiles").update({ role_status: "pending" }).eq("id", user.id);
  return { ok: true, document: data };
}

// ─── Storage ─────────────────────────────────────────────────────────────────

async function sbUploadFile(client, body) {
  const user = await currentAuthUser(client);
  if (!user) return { ok: false, message: "You're signed out." };
  const bucket = body.bucket || "bondbridge-chat";
  const response = await fetch(body.dataUrl);
  const blob = await response.blob();
  const extension = (String(body.fileName || "file").split(".").pop() || "bin").toLowerCase().slice(0, 8);
  const objectPath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  const { error } = await client.storage.from(bucket).upload(objectPath, blob, {
    contentType: body.contentType || blob.type || "application/octet-stream",
    upsert: false,
  });
  if (error) return { ok: false, message: error.message };

  let publicUrl = "";
  if (bucket === "bondbridge-avatars") {
    publicUrl = client.storage.from(bucket).getPublicUrl(objectPath).data?.publicUrl || "";
  }
  return { ok: true, path: objectPath, public_url: publicUrl, bucket };
}

// ─── Video rooms ─────────────────────────────────────────────────────────────

async function sbCreateVideoRoom(client, body) {
  const user = await currentAuthUser(client);
  if (!user) return { ok: false, message: "Sign in to start a video call." };
  const { data, error } = await client
    .from("webrtc_rooms")
    .insert({ host_user_id: user.id, purpose: body.purpose || "verified-intro" })
    .select()
    .maybeSingle();
  if (error) return { ok: false, message: error.message };
  return { ok: true, room: data, room_code: data?.room_code || "" };
}

function setLaunchResult(title, message, payload) {
  state.launch.apiResult = { title, message, payload };
  state.launch.checkedAt = nowTime();
}

function offlineStatus(payload) {
  return {
    ok: false,
    mode: "local-or-unconfigured",
    message: payload.error || "The production API is unavailable in this browser context.",
    services: launchProviders.map((item) => ({ ...item, ready: false })),
  };
}

async function refreshLaunchStatus(showToast = true) {
  const result = await apiJson("/api/status");
  state.launch.status = result.ok ? result.payload : offlineStatus(result.payload || {});
  setLaunchResult(
    result.ok ? "Backend status checked" : "Backend status unavailable",
    result.ok ? "The production worker replied successfully with the free stack status." : "Open the deployed HTTPS URL or add Supabase public config in Sites.",
    result.payload,
  );
  saveState();
  if (showToast) toast(result.ok ? "Free stack status refreshed." : "Supabase config needs attention.");
  render();
}

async function testModerationApi() {
  const result = await apiJson("/api/moderate", {
    method: "POST",
    body: JSON.stringify({ text: "You are stupid, but I want to rewrite this respectfully." }),
  });
  setLaunchResult(
    result.ok ? "Safety API working" : "Safety API unavailable",
    result.ok ? "The moderation route returned a decision." : "The route could not complete.",
    result.payload,
  );
  saveState();
  toast(result.ok ? "Safety API tested." : "Safety API needs attention.");
  render();
}

async function createVideoRoom() {
  const result = await apiJson("/api/video/room", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ purpose: "verified-intro", profileId: state.selectedChat || "waiting-room" }),
  });
  setLaunchResult(
    result.ok ? "Free video room ready" : "Free video setup not connected",
    result.ok ? "A real Supabase signaling room was created for browser WebRTC." : result.payload?.message || "Log in and finish verification before creating a room.",
    result.payload,
  );
  saveState();
  toast(result.ok ? "Free video room created." : "Login and verification required.");
  render();
}

function saveAuthDraft() {
  state.auth.name = getValue("auth-name");
  state.auth.email = getValue("auth-email");
  state.auth.password = "";
  state.auth.role = getValue("auth-role") || state.auth.role;
  state.auth.country = getValue("auth-country");
  if (state.auth.name) state.currentUser.name = state.auth.name;
  if (state.auth.role) state.currentUser.role = state.auth.role;
  if (state.auth.country) state.currentUser.country = state.auth.country;
  state.auth.result = {
    title: "Local draft saved",
    message: "Your account details are saved in this browser until Supabase signup/login succeeds.",
    payload: { ok: true, local_only: true },
  };
  saveState();
  toast("Account draft saved locally.");
}

function setAuthResult(title, message, payload) {
  state.auth.result = { title, message, payload: sanitizeAuthPayload(payload) };
}

function sanitizeAuthPayload(value) {
  if (Array.isArray(value)) return value.map(sanitizeAuthPayload);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      /token|password|secret/i.test(key) ? "[redacted]" : sanitizeAuthPayload(entry),
    ]),
  );
}

function normalizeProfiles(rows = []) {
  return rows
    .filter(Boolean)
    .map((row) => {
      const name = row.full_name || row.name || "Verified user";
      const purposes = Array.isArray(row.purposes) ? row.purposes : String(row.purpose || "").split(",").map((item) => item.trim()).filter(Boolean);
      const languages = Array.isArray(row.languages) ? row.languages : String(row.languages || "").split(",").map((item) => item.trim()).filter(Boolean);
      const verified = [];
      if (row.identity_status === "verified") verified.push("Real identity");
      if (row.role_status === "verified") verified.push(`${row.role || "Role"} proof`);
      if (row.gender_status === "verified") verified.push("Profile truth");
      if (row.uniqueness_status === "verified") verified.push("One account");
      return {
        id: row.id || `live-${hashCode(name)}`,
        name,
        age: row.age || "",
        gender: row.gender || "",
        country: row.country || "",
        city: row.city || "",
        role: row.role || "Verified member",
        field: row.field || "General",
        organization: row.organization || "",
        languages: languages.length ? languages : ["English"],
        purposes: purposes.length ? purposes : ["Friendship"],
        respectScore: row.respect_score ?? 100,
        verified: verified.length ? verified : ["Verified"],
        about: row.bio || "Verified BondBridge member.",
        connectionStyle: "Respectful and consent-first.",
        profilePhoto: row.profile_photo_url || "",
        status: row.is_suspended ? "suspended" : "active",
      };
    });
}

async function refreshLiveProfiles(showToast = true) {
  state.live.loading = true;
  state.live.error = "";
  saveState();
  render();
  const result = await apiJson("/api/profiles");
  if (result.ok && Array.isArray(result.payload?.profiles)) {
    state.profiles = normalizeProfiles(result.payload.profiles);
    state.live.profilesLoaded = true;
    state.live.lastSync = nowTime();
    state.live.error = "";
    setAuthResult("Live profiles refreshed", `${state.profiles.length} verified user${state.profiles.length === 1 ? "" : "s"} loaded from the database.`, result.payload);
  } else {
    state.profiles = [];
    state.live.profilesLoaded = false;
    state.live.error = result.payload?.message || "Live profiles are unavailable.";
    setAuthResult("Live profiles unavailable", state.live.error, result.payload);
  }
  state.live.loading = false;
  saveState();
  if (showToast) toast(state.profiles.length ? "Live profiles refreshed." : "No live profiles returned yet.");
  render();
}

function normalizeFamilyRows(rows = []) {
  return rows.map((row) => {
    const last = row.last_contact_at ? Math.max(0, Math.floor((Date.now() - new Date(row.last_contact_at).getTime()) / 86400000)) : 0;
    return {
      id: row.id,
      name: row.name || "Relationship",
      relation: row.relationship || "Friend",
      channel: "Message",
      cadence: row.cadence_days || 7,
      lastContactDays: last,
      notes: row.notes || "Check in with kindness.",
    };
  });
}

function normalizeMessageRows(rows = [], profileId) {
  return rows.map((row) => ({
    id: row.id,
    from: row.sender_id === state.currentUser.id ? "me" : "them",
    text: row.body || "",
    attachment: row.attachment_url
      ? {
          kind: row.attachment_url.match(/\.(png|jpe?g|webp|gif)$/i) ? "image" : "file",
          name: row.attachment_url.split("/").pop() || "Attachment",
          dataUrl: row.attachment_public_url || "",
          path: row.attachment_url,
        }
      : null,
    time: row.created_at ? new Date(row.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : nowTime(),
    profileId,
  }));
}

async function refreshMe(showToast = false) {
  if (!isSignedIn()) return false;
  const result = await apiJson("/api/me", { auth: true });
  if (!result.ok) {
    if (showToast) toast(result.payload?.message || "Account sync failed.");
    return false;
  }
  applyProfileRowToCurrentUser(result.payload?.profile);
  saveState();
  if (showToast) toast("Account synced.");
  return true;
}

async function refreshConnections(showToast = false) {
  if (!isSignedIn()) return false;
  const result = await apiJson("/api/connections", { auth: true });
  if (!result.ok) {
    if (showToast) toast(result.payload?.message || "Connections could not sync.");
    return false;
  }
  syncConnectionRows(result.payload?.connections || []);
  saveState();
  if (showToast) toast("Connections synced.");
  return true;
}

async function refreshMessages(profileId = state.selectedChat, showToast = false) {
  if (!isSignedIn() || !profileId) return false;
  const result = await apiJson(`/api/messages?recipient_id=${encodeURIComponent(profileId)}`, { auth: true });
  if (!result.ok) {
    if (showToast) toast(result.payload?.message || "Messages could not sync.");
    return false;
  }
  state.chats[profileId] = normalizeMessageRows(result.payload?.messages || [], profileId);
  saveState();
  if (showToast) toast("Messages synced.");
  render();
  return true;
}

async function refreshFamilyReminders(showToast = false) {
  if (!isSignedIn()) return false;
  const result = await apiJson("/api/family-reminders", { auth: true });
  if (!result.ok) {
    if (showToast) toast(result.payload?.message || "Family reminders could not sync.");
    return false;
  }
  state.family = normalizeFamilyRows(result.payload?.reminders || []);
  saveState();
  if (showToast) toast("Family reminders synced.");
  render();
  return true;
}

async function refreshReports(showToast = false) {
  if (!isSignedIn()) return false;
  const result = await apiJson("/api/reports", { auth: true });
  if (!result.ok) {
    if (showToast) toast(result.payload?.message || "Reports could not sync.");
    return false;
  }
  state.reports = (result.payload?.reports || []).map((row) => ({
    id: row.id,
    profileId: row.reported_user_id || "",
    type: "User report",
    message: row.reason || "Report submitted for admin review.",
    status: row.status || "open",
    priority: row.status === "open" ? "High" : "Medium",
  }));
  saveState();
  if (showToast) toast("Reports synced.");
  render();
  return true;
}

async function refreshSignedInData(showToast = false) {
  if (!isSignedIn()) return;
  await refreshMe(false);
  await refreshLiveProfiles(false);
  await refreshConnections(false);
  await refreshFamilyReminders(false);
  await refreshReports(false);
  if (state.selectedChat) await refreshMessages(state.selectedChat, false);
  saveState();
  if (showToast) toast("Live data synced.");
  render();
}

async function signupAccount() {
  const password = getValue("auth-password");
  // Read all form fields
  state.auth.name = getValue("auth-name") || state.auth.name;
  state.auth.email = getValue("auth-email") || state.auth.email;
  state.auth.role = getValue("auth-role") || state.auth.role || "Student";
  state.auth.country = getValue("auth-country") || state.auth.country;
  state.currentUser.name = state.auth.name || state.currentUser.name;
  state.currentUser.role = state.auth.role || state.currentUser.role;
  state.currentUser.country = state.auth.country || state.currentUser.country;
  state.currentUser.gender = getValue("auth-gender") || state.currentUser.gender || "Male";
  state.currentUser.age = Number(getValue("auth-age")) || state.currentUser.age || 18;
  state.currentUser.field = getValue("auth-field") || state.currentUser.field || "Computer Science";
  state.currentUser.organization = getValue("auth-org") || state.currentUser.organization || "";

  if (!state.auth.name || !state.auth.email || !password) {
    toast("Please fill in your name, email, and password.");
    return;
  }
  if (password.length < 8) {
    toast("Password must be at least 8 characters.");
    return;
  }

  const result = await apiJson("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      name: state.auth.name,
      email: state.auth.email,
      password,
      role: state.auth.role,
      country: state.auth.country,
      gender: state.currentUser.gender,
      age: state.currentUser.age,
      field: state.currentUser.field,
      organization: state.currentUser.organization,
      languages: typeof state.currentUser.languages === "string"
        ? state.currentUser.languages.split(",").map((item) => item.trim()).filter(Boolean)
        : (state.currentUser.languages || ["English"]),
      purposes: typeof state.currentUser.purpose === "string"
        ? state.currentUser.purpose.split(",").map((item) => item.trim()).filter(Boolean)
        : ["Friendship"],
      bio: `${state.auth.role} from ${state.auth.country} studying ${state.currentUser.field}.`,
    }),
  });
  if (result.ok) {
    authAccessToken = result.payload?.session?.access_token || authAccessToken;
    state.currentUser.id = result.payload?.user?.id || state.currentUser.id;
    state.auth.session = {
      email: state.auth.email,
      provider: "supabase",
      signedIn: Boolean(authAccessToken),
      expiresAt: result.payload?.session?.expires_at || "",
    };
    toast(`Welcome to BondBridge, ${state.currentUser.name.split(" ")[0]}! Complete your profile to get verified.`);
    state.view = "verify";
    state.verifyStep = "profile";
    await refreshSignedInData(false);
  } else {
    const msg = result.payload?.message || "";
    if (msg.toLowerCase().includes("already")) {
      toast("An account with this email already exists. Try logging in.");
      state.authTab = "login";
    } else {
      toast(result.status === 0 ? "No internet connection. Check your connection and try again." : (msg || "Signup failed. Please try again."));
    }
  }
  saveState();
  render();
}

async function loginAccount() {
  state.auth.email = getValue("auth-email") || state.auth.email;
  const password = getValue("auth-password");

  if (!state.auth.email || !password) {
    toast("Please enter your email and password.");
    return;
  }

  const result = await apiJson("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: state.auth.email,
      password,
    }),
  });
  if (result.ok) {
    authAccessToken = result.payload?.session?.access_token || "";
    state.currentUser.id = result.payload?.user?.id || state.currentUser.id;
    state.auth.session = {
      email: state.auth.email,
      provider: "supabase",
      signedIn: Boolean(authAccessToken),
      expiresAt: result.payload?.session?.expires_at || "",
    };
    const name = state.currentUser.name ? state.currentUser.name.split(" ")[0] : "back";
    toast(`Welcome back, ${name}!`);
    state.view = "dashboard";
    await refreshSignedInData(false);
  } else {
    const msg = result.payload?.message || "";
    if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("wrong") || msg.toLowerCase().includes("credentials")) {
      toast("Incorrect email or password. Please try again.");
    } else {
      toast(result.status === 0 ? "No internet connection. Check your connection and try again." : (msg || "Login failed. Please try again."));
    }
  }
  saveState();
  render();
}

async function startIdentityCheck() {
  const result = await apiJson("/api/identity/session", {
    method: "POST",
    body: JSON.stringify({ userId: state.currentUser.id, email: state.auth.email || "" }),
  });
  setLaunchResult(
    result.ok ? "Proof review connected" : "Proof review not connected",
    result.ok ? "Manual verification is connected through Supabase proof queues." : "Add Supabase public config for proof review.",
    result.payload,
  );
  saveState();
  toast(result.ok ? "Proof review is ready." : "Supabase config needed.");
  render();
}

async function startCheckout(plan) {
  const result = await apiJson("/api/checkout", {
    method: "POST",
    body: JSON.stringify({ plan, email: state.auth.email || "" }),
  });
  setLaunchResult(
    result.ok ? "Free beta ready" : "Free beta route unavailable",
    result.ok ? "Checkout is disabled by design for the free launch stack." : "The free beta route could not complete.",
    result.payload,
  );
  saveState();
  toast(result.ok ? "Free beta route checked." : "Free beta route needs attention.");
  render();
}

function selectFreePlan(plan) {
  const label = plan === "student" ? "Student beta" : plan === "family" ? "Family beta" : "Global beta";
  setLaunchResult("Free path selected", `${label} is active. No paid API or checkout is required for this launch path.`, {
    ok: true,
    provider: "free-beta",
    plan,
    paid_api: false,
  });
  saveState();
  toast(`${label} selected.`);
}

document.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const view = button.dataset.view;
  const action = button.dataset.action;
  const id = button.dataset.id;

  // Landing / auth navigation shortcuts
  if (action === "go-signup") {
    state.view = "auth";
    state.authTab = "signup";
    saveState();
    render();
    return;
  }
  if (action === "go-login") {
    state.view = "auth";
    state.authTab = "login";
    saveState();
    render();
    return;
  }
  if (action === "go-landing") {
    state.guestMode = false;
    state.view = "landing";
    saveState();
    render();
    return;
  }
  if (action === "guest-mode") {
    state.guestMode = true;
    state.view = "dashboard";
    toast("Exploring as guest. Sign up to unlock all features.");
    saveState();
    render();
    return;
  }
  if (action === "auth-tab-login") {
    state.authTab = "login";
    render();
    return;
  }
  if (action === "auth-tab-signup") {
    state.authTab = "signup";
    render();
    return;
  }
  if (action === "auth-logout") {
    stopRealtime();
    const client = getSupabase();
    if (client) {
      try { await client.auth.signOut(); } catch { /* sign out locally anyway */ }
    }
    authAccessToken = "";
    state.auth.session = null;
    state.guestMode = false;
    state.view = "landing";
    // Clear synced data so the next person on this device starts clean
    state.chats = {};
    state.requests = [];
    state.connections = [];
    state.connectionRows = [];
    state.profiles = [];
    state.reports = [];
    state.selectedChat = "";
    toast("Signed out successfully.");
    saveState();
    render();
    return;
  }

  if (view) {
    state.view = view;
    // If navigating away from landing/auth into the app, treat as guest mode
    if (!isSignedIn() && !["auth", "landing"].includes(view)) {
      state.guestMode = true;
    }
    // Support data-step alongside data-view (e.g. onboarding buttons)
    const step = button.dataset.step;
    if (step && view === "verify" && ["profile", "proof", "safety"].includes(step)) {
      state.verifyStep = step;
    }
    saveState();
    render();
    return;
  }

  if (!action) return;

  if (action === "verify-check") {
    if (!requireSignedIn("starting verification")) return;
    state.currentUser.verification[button.dataset.check] = "pending";
    await startIdentityCheck();
    saveState();
    render();
    return;
  }

  if (action === "set-verify-step") {
    state.verifyStep = button.dataset.step || "profile";
  }

  if (action === "submit-proof") {
    await submitProof();
  }
  if (action === "save-profile") {
    await saveProfile();
  }

  if (action === "save-profile-next") {
    await saveProfile();
    state.verifyStep = "proof";
  }

  if (action === "connect") await connect(id);

  if (action === "toggle-theme") {
    state.theme = state.theme === "dark" ? "light" : "dark";
    toast(`${state.theme === "dark" ? "Dark" : "Light"} mode enabled.`);
  }

  if (action === "set-purpose") {
    state.filters.purpose = button.dataset.purpose || "Any";
    state.view = "discover";
    toast(`Showing ${state.filters.purpose === "Any" ? "all purposes" : state.filters.purpose}.`);
  }

  if (action === "start-lounge") {
    const profile = profileById(id);
    if (profile) {
      state.meetMode = "live";
      state.view = "discover";
      state.moderationLog.unshift(`Verified intro started with ${profile.name}.`);
      toast(`Verified intro started with ${profile.name}.`);
      saveState();
      render();
      const started = await startLocalVideo();
      if (!started) {
        state.meetMode = "preview";
        saveState();
        render();
      }
      return;
    }
  }

  if (action === "next-lounge") {
    state.currentMeetIndex = (state.currentMeetIndex || 0) + 1;
    state.meetMode = "preview";
    toast("Skipped politely. Showing the next verified person.");
  }

  if (action === "end-lounge") {
    state.meetMode = "preview";
    stopMediaStreams();
    toast("Video intro ended.");
  }

  if (action === "translate-preview") {
    const profile = profileById(id);
    if (profile) {
      state.coach.relation = "New verified friend";
      state.coach.goal = "Start a respectful conversation";
      state.coach.tone = "Friendly";
      state.coach.context = `Help me start a respectful cross-country conversation with ${profile.name}, who speaks ${profile.languages.join(", ")}.`;
      state.coach.suggestions = buildSuggestions(state.coach.relation, state.coach.goal, state.coach.tone, state.coach.context);
      toast("Translation and tone help prepared in Coach.");
    }
  }

  if (action === "join-community") {
    const community = state.communities.find((item) => item.id === id);
    if (community) {
      community.joined = true;
      toast(`Joined ${community.name}.`);
    }
  }

  if (action === "skip-profile") {
    if (!state.skipped.includes(id)) state.skipped.push(id);
    toast("Profile skipped.");
  }

  if (action === "report-profile") await reportProfile(id);
  if (action === "accept-request") await acceptRequest(id);

  if (action === "decline-request") {
    await declineRequest(id);
  }

  if (action === "open-chat" || action === "select-chat") {
    state.selectedChat = id;
    state.view = "chat";
    await refreshMessages(id, false);
  }

  if (action === "rewrite-chat") {
    const input = document.querySelector("#chat-input");
    if (input) {
      input.value = respectfulRewrite(input.value);
      input.focus();
      toast("Message improved.");
      return;
    }
  }

  if (action === "send-message") await sendMessage();

  if (action === "request-call") {
    const profile = profileById(id);
    if (profile) {
      state.moderationLog.unshift(`Call consent requested with ${profile.name}.`);
      toast("Call request sent. The other person must approve first.");
    }
  }

  if (action === "request-screen") {
    const profile = profileById(id);
    if (profile) {
      state.moderationLog.unshift(`Screen-share consent requested with ${profile.name}.`);
      saveState();
      await startScreenShare();
      return;
    }
  }

  if (action === "add-family") await addFamily();

  if (action === "mark-contacted") {
    await markFamilyContacted(id);
  }

  if (action === "family-message") familyMessage(id);

  if (action === "generate-coach") {
    await generateSuggestions();
  }

  if (action === "copy-suggestion") {
    const suggestion = state.coach.suggestions[Number(button.dataset.index)];
    if (suggestion && navigator.clipboard) navigator.clipboard.writeText(suggestion);
    toast("Suggestion copied.");
  }

  if (action === "resolve-report") {
    state.reports = state.reports.filter((report) => report.id !== id);
    toast("Report resolved.");
  }

  if (action === "suspend-user") {
    const profile = profileById(id);
    if (profile) {
      profile.status = "suspended";
      state.reports = state.reports.filter((report) => report.profileId !== id);
      toast(`${profile.name} suspended.`);
    }
  }

  if (action === "restore-user") {
    const profile = profileById(id);
    if (profile) {
      profile.status = "active";
      toast(`${profile.name} restored.`);
    }
  }

  if (action === "restore-skipped") {
    state.skipped = [];
    toast("Skipped profiles restored.");
  }

  if (action === "export-data") {
    exportData();
    return;
  }

  if (action === "reset-data") {
    localStorage.removeItem(STORAGE_KEY);
    state = createInitialState();
    toast("Local app data reset.");
  }

  if (action === "refresh-launch-status") {
    await refreshLaunchStatus();
    return;
  }

  if (action === "test-moderation-api") {
    await testModerationApi();
    return;
  }

  if (action === "create-video-room") {
    await createVideoRoom();
    return;
  }

  if (action === "start-identity-check") {
    await startIdentityCheck();
    return;
  }

  if (action === "start-checkout") {
    await startCheckout(button.dataset.plan || "pro");
    return;
  }

  if (action === "select-free-plan") {
    selectFreePlan(button.dataset.plan || "global");
    render();
    return;
  }

  if (action === "auth-signup") {
    await signupAccount();
    return;
  }

  if (action === "auth-login") {
    await loginAccount();
    return;
  }

  if (action === "save-auth-draft") {
    saveAuthDraft();
  }

  if (action === "refresh-live-profiles") {
    await refreshLiveProfiles();
    return;
  }

  if (action === "install-pwa") {
    await installPwa();
    return;
  }

  saveState();
  render();
});

document.addEventListener("change", (event) => {
  if (event.target.id === "profile-photo-input") {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    readFileAsDataUrl(file).then((dataUrl) => {
      state.currentUser.profilePhoto = dataUrl;
      saveState();
      toast("Profile photo updated.");
      render();
    });
    return;
  }

  if (event.target.id === "story-upload") {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    readFileAsDataUrl(file).then((dataUrl) => {
      state.currentUser.story = {
        name: file.name,
        dataUrl,
        createdAt: nowTime(),
      };
      saveState();
      toast("Story added.");
      render();
    });
    return;
  }

  const filter = event.target.dataset.filter;
  if (!filter) return;
  state.filters[filter] = event.target.value;
  saveState();
  render();
});

let searchTimer;

document.addEventListener("input", (event) => {
  if (event.target.id !== "filter-search") return;
  state.filters.search = event.target.value;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    saveState();
    render();
  }, 300);
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPromptEvent = event;
  render();
});

window.addEventListener("appinstalled", () => {
  installPromptEvent = null;
  toast("BondBridge installed.");
  render();
});

window.addEventListener("load", registerPwa);

// ═══════════════════════════════════════════════════════════════════════════
//  REALTIME — makes chat appear instantly on both devices
// ═══════════════════════════════════════════════════════════════════════════

let realtimeChannel = null;

function startRealtime() {
  const client = getSupabase();
  if (!client || realtimeChannel || !isSignedIn()) return;

  realtimeChannel = client
    .channel("bondbridge-live")
    // New message arrives → show it immediately
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
      handleIncomingMessage(payload.new).catch(() => {});
    })
    // Someone sent/accepted a request → refresh the lists
    .on("postgres_changes", { event: "*", schema: "public", table: "connections" }, () => {
      handleConnectionChange().catch(() => {});
    })
    .subscribe();
}

function stopRealtime() {
  const client = getSupabase();
  if (client && realtimeChannel) {
    try { client.removeChannel(realtimeChannel); } catch { /* ignore */ }
  }
  realtimeChannel = null;
}

async function handleIncomingMessage(row) {
  if (!row || !row.connection_id) return;
  // Our own messages are already on screen — don't duplicate them
  if (row.sender_id === state.currentUser.id) return;

  let connection = state.connectionRows.find((item) => item.id === row.connection_id);
  if (!connection) {
    await refreshConnections(false);
    connection = state.connectionRows.find((item) => item.id === row.connection_id);
  }
  const profileId = connection ? otherUserIdForConnection(connection) : "";
  if (!profileId) return;

  if (!state.chats[profileId]) state.chats[profileId] = [];
  if (state.chats[profileId].some((message) => message.id === row.id)) return;

  state.chats[profileId].push({
    id: row.id,
    from: "them",
    text: row.body || "",
    attachment: null,
    time: row.created_at
      ? new Date(row.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : nowTime(),
    profileId,
  });
  saveState();

  const isViewingThisChat = state.view === "chat" && state.selectedChat === profileId;
  if (!isViewingThisChat) {
    const profile = profileById(profileId);
    const who = profile?.name ? profile.name.split(" ")[0] : "someone";
    toast(`New message from ${who}`);
  }
  render();
}

async function handleConnectionChange() {
  const beforePending = state.requests.filter((item) => item.direction === "incoming").length;
  await refreshConnections(false);
  const afterPending = state.requests.filter((item) => item.direction === "incoming").length;
  if (afterPending > beforePending) toast("You have a new connection request.");
  render();
}

// Restores an existing Supabase login so a page refresh keeps you signed in
async function restoreSupabaseSession() {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { data } = await client.auth.getSession();
    const session = data?.session;
    if (!session?.access_token || !session.user) return false;
    authAccessToken = session.access_token;
    state.currentUser.id = session.user.id;
    state.auth.email = session.user.email || state.auth.email;
    state.auth.session = {
      email: session.user.email || "",
      provider: "supabase",
      signedIn: true,
      expiresAt: session.expires_at || "",
    };
    return true;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════════════════════════════════

(async function boot() {
  const restored = await restoreSupabaseSession();
  if (!restored) {
    // Stale local flag but no real session — treat as signed out
    authAccessToken = "";
    if (state.auth.session) state.auth.session.signedIn = false;
  }

  if (!isSignedIn() && !state.guestMode) {
    state.view = "landing";
  } else if (state.view === "landing" || state.view === "auth") {
    state.view = "dashboard";
  }

  render();

  if (isSignedIn()) {
    startRealtime();
    refreshSignedInData(false);
  } else {
    refreshLiveProfiles(false);
  }

  // Keep realtime alive after the auth state changes
  const client = getSupabase();
  if (client) {
    client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") stopRealtime();
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") startRealtime();
    });
  }
})();
