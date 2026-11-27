// Builds the site into dist/. No dependencies: `node scripts/build.mjs`.
//
//   site.json            site title, menu, social links
//   content/posts/*.html one file per release/video (front matter + HTML)
//   content/pages/**     every other page; the path is the URL
//   content/events.json  shows, split into upcoming/past automatically
//   templates/*.html     page chrome, with {{placeholders}}
//   assets/              copied as-is
//
// Placeholders available inside page content:
//   {{works TAG}}  title + image card for every post tagged TAG
//   {{works}}      image card for every post
//   {{events}}     the upcoming/past events lists
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { inlineIcons } from "./icons.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const site = JSON.parse(fs.readFileSync(path.join(root, "site.json"), "utf8"));

// ---------- helpers ----------

const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const template = (name) => read(`templates/${name}.html`);

/** Replace {{key}} with values[key]. Unknown keys are left alone. */
const fill = (tpl, values) =>
  tpl.replace(/\{\{(\w+)\}\}/g, (m, key) => (key in values ? values[key] : m));

const escapeHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Minimal front matter: `key: value` and `key: [a, b]` lines between --- markers. */
function parseFrontMatter(src, file) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) throw new Error(`${file}: missing front matter`);
  const data = {};
  for (const line of m[1].split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (!kv) throw new Error(`${file}: can't read front matter line "${line}"`);
    let value = kv[2].trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
    } else {
      value = value.replace(/^(['"])(.*)\1$/, "$2");
    }
    data[kv[1]] = value;
  }
  return { data, body: src.slice(m[0].length) };
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

/** Last commit date of a file (ISO), or null if not committed yet. */
function gitDate(file) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], { cwd: root, encoding: "utf8" });
    return out.trim() || null;
  } catch {
    return null;
  }
}

/** Today in Eastern time as YYYY-MM-DD (CI runs in UTC). */
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());

// ---------- content ----------

const posts = fs
  .readdirSync(path.join(root, "content/posts"))
  .filter((n) => n.endsWith(".html"))
  .map((name) => {
    const file = `content/posts/${name}`;
    const m = name.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.html$/);
    if (!m) throw new Error(`${file}: name must look like YYYY-MM-DD-slug.html`);
    const { data, body } = parseFrontMatter(read(file), file);
    return {
      ...data,
      file,
      name,
      date: data.date || m[1],
      slug: m[2],
      url: `/${m[2]}`,
      out: `${m[2]}.html`,
      tags: data.tags || [],
      categories: data.categories || [],
      layout: "post",
      body,
    };
  })
  // Newest first; same-day posts in reverse filename order (matches the old Jekyll order).
  .sort((a, b) => (a.date + a.name < b.date + b.name ? 1 : -1));

const pages = walk(path.join(root, "content/pages"))
  .filter((p) => p.endsWith(".html"))
  .map((abs) => {
    const file = path.relative(root, abs);
    const out = path.relative(path.join(root, "content/pages"), abs);
    const { data, body } = parseFrontMatter(read(file), file);
    const url = out === "index.html" ? "/" : `/${out.replace(/\.html$/, "")}`;
    return { ...data, file, out, url, layout: data.layout || "page", body };
  });

const events = JSON.parse(read("content/events.json"));

// ---------- rendering ----------

function card(post) {
  return fill(template("card"), {
    url: post.url,
    image: post.image,
    alt: escapeHtml(post.title),
    text: escapeHtml(post.title),
  });
}

function works(tag) {
  if (!tag) return posts.map((p) => card(p)).join("\n\n");
  return posts
    .filter((p) => p.tags.includes(tag))
    .map((p) => `<h4 align="center">${escapeHtml(p.title)}</h4>\n${card(p)}`)
    .join("\n\n");
}

/** [text](url) -> <a href="url">text</a>, with the rest escaped. */
function inlineLinks(text) {
  let out = "";
  let last = 0;
  for (const m of text.matchAll(/\[([^\]]*)\]\(([^)\s]*)\)/g)) {
    out += escapeHtml(text.slice(last, m.index));
    out += `<a href="${escapeHtml(m[2])}">${escapeHtml(m[1])}</a>`;
    last = m.index + m[0].length;
  }
  return out + escapeHtml(text.slice(last));
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];
const formatDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}, ${y}`;
};

function eventLine(e) {
  const venue = e.venueUrl ? `<a href="${escapeHtml(e.venueUrl)}">${escapeHtml(e.venue)}</a>` : escapeHtml(e.venue);
  const parts = [formatDate(e.date), venue];
  if (e.city) parts.push(escapeHtml(e.state ? `${e.city}, ${e.state}` : e.city));
  if (e.details) parts.push(inlineLinks(e.details));
  return `<p data-date="${e.date}">${parts.join(" - ")}</p>`;
}

function eventsHtml() {
  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => (a.date < b.date ? -1 : 1));
  const past = events.filter((e) => e.date < today).sort((a, b) => (a.date < b.date ? 1 : -1));
  return fill(template("events"), {
    upcoming: upcoming.map(eventLine).join("\n\n"),
    past: past.map(eventLine).join("\n\n"),
    noUpcomingHidden: upcoming.length ? " hidden" : "",
  });
}

function expandPlaceholders(body) {
  return body
    .replace(/\{\{works(?: ([\w-]+))?\}\}/g, (_, tag) => works(tag))
    .replace(/\{\{events\}\}/g, () => eventsHtml());
}

// Every page gets exactly one <h1> (search engines and screen readers use it
// to tell what the page is about). Post pages show their title as the <h1>,
// styled like the old <h4> (.project-title in all.css). Pages without a
// visible title (home, about, events, ...) get one that is visually hidden
// but read by search engines and screen readers. The text is the page's own
// title, so it never says anything the page doesn't. It goes inside the first
// element rather than before it: the theme alternates section colors with
// section:nth-child(odd), and an extra sibling would shift that pattern.
function withHiddenH1(page, html) {
  const h1 = hiddenH1(page).trimEnd();
  const out = html.replace(/^(\s*<[a-z][^>]*>)/, `$1${h1}`);
  if (out === html) throw new Error(`${page.file}: no element to put the hidden <h1> in`);
  return out;
}

function hiddenH1(page) {
  const text = page.layout === "none" ? site.title : page.title || page.headTitle.replace(/\s*\|.*$/, "");
  return `<h1 class="visually-hidden">${escapeHtml(text)}</h1>\n`;
}

function main(page) {
  const content = expandPlaceholders(page.body).trimEnd();
  if (/<h1[\s>]/.test(content)) throw new Error(`${page.file}: has its own <h1>; the layout adds one`);
  switch (page.layout) {
    case "none":
      return withHiddenH1(page, content);
    case "post": {
      const html = fill(template("post"), {
        heading: page.title
          ? `<h1 class="project-title">${escapeHtml(page.title)}</h1>`
          : // No visible title: keep the theme's empty title element for its
            // spacing, and put a hidden <h1> at the start of the section.
            `<h4 class="project-title" style="text-align: center;"></h4>`,
        featuredImage: page.image
          ? `    <div class="image-container">\n      <img src="/assets/img/${page.image}" alt="${escapeHtml(page.title)}" class="image">\n    </div>`
          : "",
        content,
      });
      return page.title ? html : withHiddenH1(page, html);
    }
    case "page":
    case "contact":
      return withHiddenH1(page, fill(template(page.layout), { content }));
    default:
      throw new Error(`${page.file}: unknown layout "${page.layout}"`);
  }
}

// ---------- SEO ----------

const decodeEntities = (s) =>
  s.replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(n)).replace(/&amp;/g, "&");

const plainText = (html) =>
  decodeEntities(html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").replace(/ ([,.;:!?])/g, "$1").trim();

function truncate(text, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "…";
}

/**
 * Meta description: front matter `description:` if set, otherwise the first
 * paragraph of real prose in the body (skipping release dates, credits and
 * format lines), otherwise the title plus the site description.
 */
function describe(page) {
  if (page.description) return page.description;
  if (page.url === "/") return site.description;
  const skip = /^(released?|credits|listen|watch|music by|video by|directed by|\d|hd,|https?:)/i;
  for (const m of page.body.matchAll(/<p>([\s\S]*?)<\/p>/g)) {
    const text = plainText(m[1]);
    if (text.length >= 60 && !skip.test(text)) return truncate(text);
  }
  return truncate(`${page.title}. ${site.description}`);
}

const imageUrl = (img) => `${site.url}/assets/img/${img.split("/").map(encodeURIComponent).join("/")}`;

function person() {
  return {
    "@type": "Person",
    name: site.author,
    url: `${site.url}/`,
    description: site.person.description,
    image: imageUrl(site.image),
    sameAs: site.person.sameAs,
    memberOf: site.person.memberOf.map((g) => ({ "@type": "MusicGroup", ...g })),
  };
}

function eventJsonLd(e) {
  const performer = { "@type": "Person", name: site.author, url: `${site.url}/` };
  return {
    "@type": "MusicEvent",
    name: `${site.author} at ${e.venue}`,
    startDate: e.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(e.details ? { description: plainText(inlineLinks(e.details)) } : {}),
    ...(e.venueUrl ? { url: e.venueUrl } : {}),
    location: {
      "@type": "Place",
      name: e.venue,
      address: {
        "@type": "PostalAddress",
        ...(e.city ? { addressLocality: e.city } : {}),
        ...(e.state ? { addressRegion: e.state } : {}),
        addressCountry: "US",
      },
    },
    performer,
  };
}

// Posts with a Bandcamp album or track player are marked up as music
// (MusicAlbum / MusicRecording) so search engines know they're releases and
// who made them; other posts (videos, etc.) stay generic CreativeWorks.
// Titles are "Artist - Release"; a title without " - " is self-titled.
// Front matter `artist:` / `release:` override that split when the title
// doesn't follow the pattern (e.g. Robert Ethington Quintet).
function artistJsonLd(name) {
  if (name === site.author) return { "@type": "Person", name, url: `${site.url}/` };
  const band = site.person.memberOf.find((b) => b.name === name);
  return { "@type": "MusicGroup", name, ...(band ? { url: band.url } : {}) };
}

function postJsonLd(page) {
  const common = {
    url: site.url + page.url,
    datePublished: page.date,
    description: describe(page),
    ...(page.image ? { image: imageUrl(page.image) } : {}),
  };
  const kind = page.body.match(/bandcamp\.com\/EmbeddedPlayer\/(album|track)=/)?.[1];
  if (!kind) {
    return { "@type": "CreativeWork", name: page.title, ...common, creator: artistJsonLd(site.author) };
  }
  const dash = page.title.indexOf(" - ");
  const artist = page.artist || (dash > 0 ? page.title.slice(0, dash) : page.title);
  const release = page.release || (dash > 0 ? page.title.slice(dash + 3) : page.title);
  const bandcamp = page.body.match(/href="(https?:\/\/[a-z0-9-]+\.bandcamp\.com\/(?:album|track)\/[^"]+)"/)?.[1]?.replace(/^http:/, "https:");
  return {
    "@type": kind === "album" ? "MusicAlbum" : "MusicRecording",
    name: release,
    byArtist: artistJsonLd(artist),
    ...common,
    ...(bandcamp ? { sameAs: bandcamp } : {}),
    ...(bandcamp?.startsWith("https://discretespectrum.bandcamp.com/")
      ? { publisher: { "@type": "Organization", name: "Discrete Spectrum", url: "https://discretespectrum.com" } }
      : {}),
  };
}

function jsonLd(page) {
  const graph = [];
  if (site.person.pages.includes(page.url)) graph.push(person());
  if (page.body.includes("{{events}}")) graph.push(...events.map(eventJsonLd));
  if (page.slug && page.date) graph.push(postJsonLd(page));
  if (!graph.length) return null;
  const data = graph.length === 1 ? { "@context": "https://schema.org", ...graph[0] } : { "@context": "https://schema.org", "@graph": graph };
  // Keep "</script>" from ever closing the tag early.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function head(page) {
  const title = page.headTitle || (page.url === "/" ? site.title : `${page.title} | ${site.title}`);
  const description = describe(page);
  const canonical = site.url + page.url;
  // `noindex: true` (e.g. the 404 page): keep it out of search results and the sitemap.
  const noindex = page.noindex === "true";
  const image = imageUrl(page.image || site.image);
  const ld = jsonLd(page);
  const lines = [
    `<meta charset="UTF-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1">`,
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<meta name="author" content="${escapeHtml(site.author)}">`,
    noindex ? `<meta name="robots" content="noindex">` : `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:site_name" content="${escapeHtml(site.title)}">`,
    `<meta property="og:type" content="${page.layout === "post" && page.date ? "article" : "website"}">`,
    noindex ? "" : `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:title" content="${escapeHtml(page.headTitle || page.title || site.title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:alt" content="${escapeHtml(page.image ? page.title : site.author)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<link rel="icon" href="/favicon.ico">`,
    `<link rel="alternate" type="application/atom+xml" href="/feed.xml" title="${escapeHtml(site.title)}">`,
    `<link rel="stylesheet" href="/assets/css/all.css">`,
    `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">`,
  ];
  if (ld) lines.push(`<script type="application/ld+json">${ld}</script>`);
  // GoatCounter (no cookies). It skips localhost, so local previews aren't counted.
  if (site.goatcounter) {
    lines.push(
      `<script data-goatcounter="https://${site.goatcounter}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`,
    );
  }
  return lines.filter(Boolean).map((l) => `    ${l}`).join("\n");
}

function renderPage(page) {
  if (!page.title && !page.headTitle) throw new Error(`${page.file}: needs a title: (or headTitle:) in its front matter`);
  const scripts = page.body.includes("{{events}}") ? `    <script src="/assets/js/events.js"></script>` : "";
  return inlineIcons(fill(template("base"), {
    head: head(page),
    siteTitle: escapeHtml(site.title),
    menu: site.menu.map((m) => `          <a href="${m.url}">${escapeHtml(m.name)}</a>`).join("\n"),
    social: site.social
      .map((s) => `              <a href="${s.link}" target="_blank" rel="noopener" aria-label="${escapeHtml(s.label || s.icon)}"><i class="fa fa-${s.icon}" aria-hidden="true"></i></a>`)
      .join("\n"),
    main: main(page),
    scripts,
  }));
}

// ---------- feed + sitemap ----------

function feed() {
  const entries = posts.slice(0, 20).map((p) => `  <entry>
    <title>${escapeHtml(p.title)}</title>
    <link href="${site.url}${p.url}"/>
    <id>${site.url}${p.url}</id>
    <published>${p.date}T00:00:00Z</published>
    <updated>${p.date}T00:00:00Z</updated>
${p.categories.map((c) => `    <category term="${escapeHtml(c)}"/>`).join("\n")}
    <content type="html">${escapeHtml(inlineIcons(expandPlaceholders(p.body)))}</content>
  </entry>`);
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeHtml(site.title)}</title>
  <subtitle>${escapeHtml(site.description)}</subtitle>
  <link href="${site.url}/feed.xml" rel="self"/>
  <link href="${site.url}/"/>
  <id>${site.url}/</id>
  <updated>${posts[0].date}T00:00:00Z</updated>
  <author><name>${escapeHtml(site.author)}</name></author>
${entries.join("\n")}
</feed>
`;
}

function sitemap(all) {
  const urls = all.filter((p) => p.noindex !== "true").map((p) => {
    // The events page changes when events.json does.
    const sources = p.body.includes("{{events}}") ? [p.file, "content/events.json"] : [p.file];
    const dates = sources.map(gitDate).filter(Boolean).sort();
    const lastmod = dates.at(-1) || today;
    return `  <url>\n    <loc>${site.url}${p.url}</loc>\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

// ---------- write ----------

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const all = [...pages, ...posts];
const seen = new Map();
for (const page of all) {
  if (seen.has(page.out)) throw new Error(`${page.file} and ${seen.get(page.out)} both build ${page.out}`);
  seen.set(page.out, page.file);
  const file = path.join(dist, page.out);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, renderPage(page));
}

fs.cpSync(path.join(root, "assets"), path.join(dist, "assets"), { recursive: true });
for (const f of ["CNAME", "favicon.ico"]) fs.copyFileSync(path.join(root, f), path.join(dist, f));
fs.writeFileSync(path.join(dist, "feed.xml"), feed());
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap(all));
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

// ---------- check links ----------
// Every link and image on the site that points within the site must lead to
// a file in dist/ (served as GitHub Pages would: /x finds x, x.html or
// x/index.html). A broken one stops the build, so it never deploys.

function checkLinks() {
  const files = new Set();
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = path.join(dir, e.name);
      e.isDirectory() ? walk(f) : files.add("/" + path.relative(dist, f).split(path.sep).join("/"));
    }
  };
  walk(dist);
  const exists = (u) => u === "/" || files.has(u) || files.has(`${u}.html`) || files.has(`${u.replace(/\/$/, "")}/index.html`);
  const broken = [];
  for (const f of files) {
    if (!f.endsWith(".html")) continue;
    const html = fs.readFileSync(path.join(dist, f), "utf8");
    for (const [, raw] of html.matchAll(/(?:href|src)="(\/(?!\/)[^"#?]*)/g)) {
      let u = raw;
      try { u = decodeURIComponent(raw); } catch {}
      if (!exists(u)) broken.push(`  ${f} links to ${raw}`);
    }
  }
  if (broken.length) {
    console.error(`Broken internal links (fix the link or add the file):\n${[...new Set(broken)].join("\n")}`);
    process.exit(1);
  }
}

checkLinks();

console.log(`Built ${all.length} pages into dist/ (${events.filter((e) => e.date >= today).length} upcoming events).`);
