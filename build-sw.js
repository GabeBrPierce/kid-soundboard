// Regenerates sw.js with a precache list of every file. Run: node build-sw.js
const fs = require("fs"), path = require("path");
const skip = new Set(["sw.js", "build-sw.js", ".git"]);
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    if (skip.has(f.name)) continue;
    const p = path.join(d, f.name);
    f.isDirectory() ? walk(p) : files.push("./" + p.split(path.sep).join("/"));
  }
})(".");
const version = Date.now();
fs.writeFileSync("sw.js", `const CACHE = "soundboard-${version}";
const FILES = ${JSON.stringify(["./", ...files], null, 1)};
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((r) => r || fetch(e.request)));
});
`);
