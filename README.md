# jacobtrombetta.com

Personal site for Jacob Trombetta. Plain HTML content, one small Node build
script, no dependencies. Same approach as horses4k.rodeo.

## Run locally

```sh
node scripts/serve.mjs
```

Open http://localhost:4000. It rebuilds whenever you save a file in
`content/`, `templates/`, `assets/` or `site.json`; reload the page to see it.
(`node scripts/build.mjs` builds once into `dist/` without serving.)

Needs Node 18+.

## Deploy

Push to `master`. GitHub Actions (`.github/workflows/deploy.yml`) builds and
deploys to GitHub Pages at https://jacobtrombetta.com. It also rebuilds daily
so finished shows move to "Past events" on their own.

## Project structure

```
site.json              Site title, nav menu, social links, GoatCounter code
content/
  posts/               One file per release / video: YYYY-MM-DD-slug.html → /slug
  pages/               Every other page; the file path is the URL
                       (pages/projects/watt.html → /projects/watt)
  events.json          Shows: edit this to add/update events
templates/             Page chrome (header, footer, layouts, image card)
assets/css/all.css     All styles
assets/img/            Images, referenced as /assets/img/...
assets/js/events.js    Moves finished shows to "Past" in the browser
scripts/build.mjs      Builds dist/ (pages, feed.xml, sitemap.xml, robots.txt)
scripts/serve.mjs      Local preview server
scripts/optimize-images.sh  Resize/recompress images before committing
```

## Adding a release or video

Copy an existing file in `content/posts/`, rename it `YYYY-MM-DD-slug.html`
(the slug becomes the URL), and edit it:

```html
---
title: Jacob Trombetta - Ohio River Valley
tags: [jacobtrombetta]
categories: [music]
image: jt/jt_orv_1.jpg
---
<iframe ...embed code...></iframe>

<p>Some words about it.</p>
```

- `tags` decides which project pages list it (`{{works jacobtrombetta}}` on
  `content/pages/projects/jacob_trombetta.html`). Every post also appears on
  `/projects`.
- `image` is the featured image and the card thumbnail, relative to
  `assets/img/`.
- The body is plain HTML.
- Optional `description:` sets the search-result snippet. Without it, the
  build uses the first real paragraph of the body (or the title plus the site
  description).
- Optional `headTitle:` replaces the whole browser-tab / search-result title
  (normally `Title | jacob trombetta`). The home page uses it.

## Adding images

Put the file under `assets/img/`, then shrink it before committing:

```sh
scripts/optimize-images.sh assets/img/jt/new-photo.jpg
```

It caps the longest side at 1500px, recompresses (JPEG quality 80), and
converts iPhone (Display P3) colors to sRGB so they don't shift. Running it with
no arguments checks every image; already-optimized files are left alone.
Needs ImageMagick (`brew install imagemagick`). Save photos as `.jpg`, not
`.png`, unless they need transparency.

## Adding a show

Add an entry to `content/events.json`:

```json
{
  "date": "2026-12-05",
  "venue": "The Bottle House",
  "venueUrl": "https://example.com/event",
  "city": "Cleveland Heights",
  "state": "OH",
  "details": "solo set with [Some Band](https://someband.bandcamp.com/)"
}
```

Order doesn't matter: shows are sorted, and split into Upcoming and Past by
date automatically. `venueUrl` can be `null`. `details` supports
`[text](url)` links.

## Page placeholders

Inside any page or post body:

- `{{works TAG}}`: title + image card for each post tagged `TAG`, newest first
- `{{works}}`: image card for every post
- `{{events}}`: the upcoming/past events lists

## Credits

The visual design comes from Paul Le's
[Portfolio Jekyll Theme](https://github.com/LeNPaul/portfolio-jekyll-theme)
(MIT, see `LICENSE.md`); `assets/css/all.css` is its compiled stylesheet.
