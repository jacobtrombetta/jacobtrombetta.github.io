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
  `layout` (`post`, `page`, `contact`, or `none`), optional `description` and
  `headTitle` (full `<title>` override).
- Default branch is `master`; pushing deploys via
  `.github/workflows/deploy.yml`.
