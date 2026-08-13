const STORAGE_KEY = "bondbridge-verified-live-v3";
const LEGACY_STORAGE_KEYS = ["bondbridge-verified-v1", "bondbridge-verified-live-v2"];

const views = [
  ["dashboard", "Home", "home"],
  ["auth", "Account", "key"],
  ["verify", "Verify", "shield"],
  ["discover", "Meet People", "search"],
  ["connections", "Requests", "users"],
  ["chat", "Chat", "message"],
  ["family", "Family", "heart"],
  ["coach", "Coach", "sparkles"],
  ["admin", "Safety", "lock"],
  ["launch", "Launch", "rocket"],
  ["privacy", "Data", "database"],
];

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

function createInitialState() {
  return {
    view: "dashboard",
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
      coach: { ...defaults.coach, ...(saved.coach || {}) },
      launch: { ...defaults.launch, ...(saved.launch || {}) },
      live: { ...defaults.live, ...(saved.live || {}) },
      auth: { ...defaults.auth, ...(saved.auth || {}) },
    };
  } catch {
    return defaults;
  }
}

let state = loadState();
LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
const urlView = new URLSearchParams(window.location.search).get("view");
if (views.some(([id]) => id === urlView)) state.view = urlView;

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

function profileById(id) {
  return state.profiles.find((profile) => profile.id === id);
}

function requestFor(profileId) {
  return state.requests.find((request) => request.profileId === profileId);
}

function isSignedIn() {
  return Boolean(authAccessToken && state.auth.session && state.auth.session.signedIn);
}

function requireSignedIn(action) {
  if (isSignedIn()) return true;
  state.view = "auth";
  toast(`Log in before ${action}.`);
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
  app.dataset.view = state.view;
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
  const nav = views
    .map(
      ([id, label, iconName]) => `
        <button class="nav-button ${state.view === id ? "active" : ""}" data-view="${id}" title="${escapeHtml(label)}">
          ${icon(iconName)}
          <span>${escapeHtml(label)}</span>
        </button>
      `,
    )
    .join("");

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
        <button class="nav-button theme-nav" data-action="toggle-theme" title="Switch ${state.theme === "dark" ? "light" : "dark"} mode">
          ${icon(state.theme === "dark" ? "sun" : "moon")}
          <span>${state.theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>
      </nav>
      <div class="sidebar-note">
        <h3>Safe by design</h3>
        <p>Verified identity, mutual requests, respectful chat, and family reminders in one simple place.</p>
      </div>
    </aside>
  `;
}

function renderTopbar() {
  const titles = {
    dashboard: ["BondBridge", "Verified social connection feed."],
    auth: ["Account", "Create your real account, then verify before discovery."],
    verify: ["Get Verified", "Prove your identity, student/professional role, and one-account status."],
    discover: ["Meet People", "Choose a purpose, country, field, or community before sending a request."],
    connections: ["Requests", "Accept only the people you want. Private chat opens after both sides agree."],
    chat: ["Chat", "Write clearly, stay respectful, and request calls only with consent."],
    family: ["Family", "Simple reminders help you call, message, and reconnect before bonds fade."],
    coach: ["Coach", "Get help writing messages, apologizing, reconnecting, or starting a conversation."],
    admin: ["Safety", "Review reports, proof queues, respect scores, and account actions."],
    launch: ["Launch", "Free Supabase, browser video, proof review, and local safety are connected."],
    privacy: ["Data", "Export, reset, and understand what this app stores locally."],
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
    auth: renderAuth,
    verify: renderVerify,
    discover: renderDiscover,
    connections: renderConnections,
    chat: renderChat,
    family: renderFamily,
    coach: renderCoach,
    admin: renderAdmin,
    launch: renderLaunch,
    privacy: renderPrivacy,
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

  return `
    <section class="insta-feed">
      ${renderInstaStories()}
      ${renderMeetPost(loungeProfile, topMatch)}
      ${renderFamilyPost(nextFamily, dueContacts.length)}
      ${renderSafetyPost(pendingRequests, accepted)}
    </section>
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
          <p class="text-muted">Create a real account, complete verification, and connect Supabase so live approved users appear here.</p>
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
        <p class="text-muted">Live people appear after real users sign up, pass verification, and are returned by Supabase.</p>
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
  return `
    <section class="verify-flow">
      <section class="verify-summary" aria-label="Verification summary">
        <div class="verify-person">
          <span class="verify-avatar">${escapeHtml(initials(user.name))}</span>
          <div>
            <p class="eyebrow">Get verified</p>
            <h2>${escapeHtml(displayName(user.name))}</h2>
            <p>${escapeHtml([user.role, user.field, user.country].filter(Boolean).join(" - ") || "Add your real public details")}</p>
          </div>
        </div>
        <div class="verify-score">
          <span>${trustCompletion()}%</span>
          <div>
            <strong>Trust ready</strong>
            <div class="progress-track"><div class="progress-fill" style="width:${trustCompletion()}%"></div></div>
          </div>
        </div>
      </section>

      <nav class="verify-steps" aria-label="Verification steps">
        ${verifyStepButton("profile", "1", "Profile", "Public details", step)}
        ${verifyStepButton("proof", "2", "Proof", `${user.role} status`, step)}
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

  return state.profiles
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
          : `<div class="empty">No live verified profiles returned yet. Create an account, complete proof, or refresh the live database.</div>`
      }

      <article class="request-group">
        <p class="eyebrow">Verified circles</p>
        <h2 class="section-title">Group spaces before private trust</h2>
        <div class="community-reel">
          ${state.communities.length ? state.communities.map(renderCommunity).join("") : `<div class="empty">Live circles will appear after the database has approved groups.</div>`}
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
        <button class="button primary large" data-action="generate-coach" title="Generate suggestions">${icon("sparkles")}Generate suggestions</button>
      </article>

      <article class="draft-feed">
        <p class="eyebrow">Suggestions</p>
        <h2 class="section-title">Respectful drafts</h2>
        <div class="draft-list">
          ${
            state.coach.suggestions.length
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
          state.profiles.length
            ? state.profiles
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

      <article class="auth-result">
        <div>
          <p class="eyebrow">Latest response</p>
          <h3>${result ? escapeHtml(result.title) : "Nothing submitted yet"}</h3>
          <p>${result ? escapeHtml(result.message) : "Signup, login, and live-user sync results will appear here."}</p>
        </div>
        <pre>${escapeHtml(result ? JSON.stringify(result.payload, null, 2) : "{ }")}</pre>
      </article>
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
          <p class="eyebrow">API result</p>
          <h3>${result ? escapeHtml(result.title) : "No action tested yet"}</h3>
          <p>${result ? escapeHtml(result.message) : "Run a backend check, safety test, free video room, or proof review action."}</p>
        </div>
        <pre>${escapeHtml(result ? JSON.stringify(result.payload, null, 2) : "{ }")}</pre>
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

function generateSuggestions() {
  const relation = getValue("coach-relation") || state.coach.relation;
  const goal = getValue("coach-goal") || state.coach.goal;
  const tone = getValue("coach-tone") || state.coach.tone;
  const context = getValue("coach-context") || state.coach.context;
  state.coach = { relation, goal, tone, context, suggestions: buildSuggestions(relation, goal, tone, context) };
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
    toast("Profile synced to Supabase.");
  } else {
    toast("Profile saved locally. Log in to sync it.");
  }
  saveState();
}

async function connect(profileId) {
  const profile = profileById(profileId);
  if (!profile) return;
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
    toast("Message blocked. Please rewrite it respectfully.");
    return;
  }
  const profileId = state.selectedChat;
  if (!profileId) return;
  if (!requireSignedIn("sending a real message")) return;

  let attachment = null;
  let attachmentPath = "";
  try {
    if (file) {
      attachment = await buildChatAttachment();
      const uploaded = await uploadFileToStorage("bondbridge-chat", file);
      attachmentPath = uploaded?.path || "";
    }
  } catch (error) {
    toast(error.message || "Attachment upload failed.");
    return;
  }

  const result = await apiJson("/api/messages", {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      recipient_id: profileId,
      body: text,
      attachment_path: attachmentPath,
    }),
  });
  if (!result.ok) {
    toast(result.payload?.message || "Message could not be sent.");
    return;
  }

  if (!state.chats[profileId]) state.chats[profileId] = [];
  state.chats[profileId].push({ from: "me", text, attachment, time: nowTime() });
  if (input) input.value = "";
  toast("Message sent to Supabase.");
  await refreshMessages(profileId, false);
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

async function apiJson(path, options = {}) {
  try {
    const headers = {
      "content-type": "application/json",
      ...(options.auth && authAccessToken ? { authorization: `Bearer ${authAccessToken}` } : {}),
      ...(options.headers || {}),
    };
    const fetchOptions = { ...options };
    delete fetchOptions.auth;
    const response = await fetch(apiEndpoint(path), {
      ...fetchOptions,
      headers,
    });
    const text = await response.text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = { raw: text.slice(0, 500) };
    }
    return { ok: response.ok && (!payload || payload.ok !== false), status: response.status, payload };
  } catch (error) {
    return { ok: false, status: 0, payload: { error: error.message } };
  }
}

function apiEndpoint(path) {
  const base = window.BONDBRIDGE_API_BASE || "";
  if (!base || /^https?:\/\//i.test(path)) return path;
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
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
  saveAuthDraft();
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
      languages: state.currentUser.languages.split(",").map((item) => item.trim()).filter(Boolean),
      purposes: state.currentUser.purpose.split(",").map((item) => item.trim()).filter(Boolean),
      bio: state.currentUser.purpose,
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
    setAuthResult("Signup request completed", "Supabase accepted the account request. Continue with profile proof.", result.payload);
    toast("Signup completed.");
    await refreshSignedInData(false);
  } else {
    setAuthResult("Signup unavailable", result.payload?.message || "Signup could not complete.", result.payload);
    toast("Signup route needs Supabase config.");
  }
  saveState();
  render();
}

async function loginAccount() {
  const password = getValue("auth-password");
  saveAuthDraft();
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
    setAuthResult("Login completed", "Supabase returned an auth response for this account.", result.payload);
    toast("Logged in.");
    await refreshSignedInData(false);
  } else {
    setAuthResult("Login unavailable", result.payload?.message || "Login could not complete.", result.payload);
    toast("Login route needs Supabase config.");
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

  if (view) {
    state.view = view;
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
    generateSuggestions();
    toast("Suggestions generated.");
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

render();
refreshLaunchStatus(false);
refreshLiveProfiles(false);
