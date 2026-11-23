// Local preview: builds the site, serves dist/ at http://localhost:4000,
// and rebuilds whenever content/, templates/, assets/ or site.json change.
// Like GitHub Pages, /foo serves foo.html.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const port = Number(process.env.PORT) || 4000;

function build() {
  try {
    execFileSync(process.execPath, [path.join(root, "scripts/build.mjs")], { stdio: "inherit" });
  } catch {
    console.error("Build failed — fix the error above and save again.");
  }
}

build();

let timer;
for (const target of ["content", "templates", "assets", "site.json"]) {
  fs.watch(path.join(root, target), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(build, 150);
  });
}

const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".webp": "image/webp",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const base = path.join(dist, path.normalize(urlPath));
    if (!base.startsWith(dist)) return res.writeHead(403).end();
    const candidates = [base, `${base}.html`, path.join(base, "index.html")];
    const file = candidates.find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
    if (!file) return res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`Serving http://localhost:${port} (Ctrl+C to stop)`));
