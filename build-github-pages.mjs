import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "dist", "github-pages");
const productionUrl = "https://bondbridge-verified-20260813.tabisharshad51.chatgpt.site";

const [html, css, js] = await Promise.all([
  readFile(path.join(root, "index.html"), "utf8"),
  readFile(path.join(root, "styles.css"), "utf8"),
  readFile(path.join(root, "app.js"), "utf8"),
]);

const page = html
  .replace('href="/manifest"', 'href="./manifest.webmanifest"')
  .replace('href="/app-icon"', 'href="./icon.svg"')
  .replace('href="/app-icon"', 'href="./icon.svg"')
  .replace('<link rel="stylesheet" href="./styles.css" />', '<link rel="stylesheet" href="./styles.css" />')
  .replace(
    '<script src="./app.js"></script>',
    `<script>window.BONDBRIDGE_API_BASE = ${JSON.stringify(productionUrl)};</script>\n    <script src="./app.js"></script>`,
  );

const pagesJs = js.replace('navigator.serviceWorker.register("/service-worker")', 'navigator.serviceWorker.register("./sw.js")');

const manifest = {
  id: "./",
  name: "BondBridge Verified",
  short_name: "BondBridge",
  description: "Verified respectful connections, family reminders, chat, and free browser video.",
  start_url: "./",
  scope: "./",
  display: "standalone",
  background_color: "#050505",
  theme_color: "#d62976",
  orientation: "portrait-primary",
  categories: ["social", "productivity"],
  icons: [
    {
      src: "./icon.svg",
      sizes: "any",
      type: "image/svg+xml",
      purpose: "any maskable",
    },
  ],
  shortcuts: [
    {
      name: "Meet People",
      short_name: "Meet",
      url: "./?view=discover",
      icons: [{ src: "./icon.svg", sizes: "any", type: "image/svg+xml" }],
    },
    {
      name: "Family",
      short_name: "Family",
      url: "./?view=family",
      icons: [{ src: "./icon.svg", sizes: "any", type: "image/svg+xml" }],
    },
  ],
};

const icon = `
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
const CACHE_NAME = "bondbridge-github-pages-v1";
const APP_SHELL = ["./", "./styles.css", "./app.js", "./manifest.webmanifest", "./icon.svg"];

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
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("./")));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
`.trim();

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all([
  writeFile(path.join(output, "index.html"), page),
  writeFile(path.join(output, "styles.css"), css),
  writeFile(path.join(output, "app.js"), pagesJs),
  writeFile(path.join(output, "manifest.webmanifest"), JSON.stringify(manifest, null, 2)),
  writeFile(path.join(output, "icon.svg"), icon),
  writeFile(path.join(output, "sw.js"), serviceWorker),
  writeFile(path.join(output, ".nojekyll"), ""),
]);
