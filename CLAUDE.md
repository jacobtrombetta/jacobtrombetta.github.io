# CLAUDE.md

Guidance for Claude Code in this repository. Read `README.md` first: it
covers structure, running locally, and how to add posts and shows.

- No dependencies and no npm. `scripts/build.mjs` is the whole build; keep it
  dependency-free.
- `dist/` is build output and gitignored. Never edit or commit it.
- URLs are a contract: posts live at `/<slug>` and project pages at
  `/projects/<name>`, matching the old Jekyll site. Don't rename content files
  without adding a redirect page.
- Content bodies are plain HTML (they were migrated from Jekyll's rendered
  output, so they contain kramdown-style smart quotes and `&amp;` entities;
  that's expected).
- Post front matter: `title`, `tags`, `categories`, `image` (relative to
  `assets/img/`), optional `description`. Page front matter: `title`,
  `layout` (`post`, `page`, `contact`, or `none`), optional `description`,
  `headTitle` (full `<title>` override) and `noindex: true`.
- Optional post `artist:` / `release:` override the `Artist - Release` title
  split used for MusicAlbum/MusicRecording JSON-LD (posts with a Bandcamp
  album/track embed; others are CreativeWork).
- Every page has exactly one `<h1>`, added by `main()` in the build: post
  titles render as `h1.project-title` (styled like the theme's old `<h4>`);
  pages with no visible title get `h1.visually-hidden` inside their first
  element (not before it: the theme's `section:nth-child(odd)` colors shift).
  Content must not contain its own `<h1>`; the build refuses.
- The build fails on broken internal links (`checkLinks()`). Visual changes
  are verified by headless-Chrome screenshots against the live site
  (`magick compare -metric AE`); the SoundCloud embed on /projects/music
  renders slightly differently each load.
- Default branch is `master`; pushing deploys via
  `.github/workflows/deploy.yml`.
