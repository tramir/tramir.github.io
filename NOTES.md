# Maintenance notes

How the site is put together and where to edit things. (The public-facing description is in `README.md`.)

## Stack

Static site built with [Eleventy](https://www.11ty.dev/) 3 (Nunjucks templates), deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`. Custom domain via `CNAME`.

## Editing content

- **Papers**: edit `src/assets/xml/research.xml`. The research page lists and the featured items on the home page are generated from it at build time by `src/_data/research.js`; field conventions (dates, `<featured>`, `<media>`, CDATA for HTML in notes/abstracts, file-name resolution for `<doc>`/`<replication>`) are documented at the top of that file. PDFs go in `src/assets/papers/`.
- **Working-paper status**: put the journal status of a `<wp>` in `<status>` (CDATA when it contains HTML). Only these are displayed: `Submitted.`, `Revisions requested by <em>Journal</em>.`, `Reject and resubmit at <em>Journal</em>.`, `Revised and resubmitted at <em>Journal</em>.`, `Conditionally accepted at <em>Journal</em>.`, `Accepted at <em>Journal</em>.` Anything else (e.g. `Currently revising.`) is kept in the XML but hidden everywhere. The list lives in `STATUS_PREFIXES` in both `src/_data/research.js` and `CV.tex`; change both together. On the site the status is bold before the notes on the research page and follows the date in the "Recent working papers" widget; the CV prints it in plain text. Keep `<notes>` for everything else (NBER/IZA numbers, earlier titles).
- **Paper links**: `<doc>` (Paper), `<appendix>` (Appendix), `<replication>` (Replication package), `<doi>` (Journal version, bare DOI or full URL). Each renders a pill under the abstract when present.
- **Media coverage**: fill the `<media>` element of an entry with a comma-separated list of outlets (no links). Empty tags render nothing.
- **CV**: source is `src/assets/CV/CV.tex` (LuaLaTeX; reads `research.xml` via luacode). A pre-commit hook (`.githooks/pre-commit`, enabled by `npm ci`/`npm install` through the `prepare` script, or `git config core.hooksPath .githooks`) recompiles with `latexmk -lualatex` in a temporary `build/` folder (removed on success, kept with the log on failure) and stages `CV.pdf` whenever `CV.tex` or `research.xml` is committed; a failed compile aborts the commit. `npm run cv` compiles manually. The `.tex` and build files are excluded from the site; the PDF is also served at `/docs/CV.pdf` for old links.
- **Bio/contact**: `src/index.njk`. Header, footer links, meta tags: `src/_includes/layouts/base.njk`.
- **Footer "Last updated"**: derived from the last git commit touching `research.xml` or `CV.pdf` (`CONTENT_FILES` in `.eleventy.js`); the deploy checkout fetches full history for this.

## Behavior

- Research page: `src/assets/js/research.js` animates the abstract toggles, opens the paper named in the URL hash (`/research/#<id>`, used by the home-page links), and drives the sticky section nav (current-section highlight, `--subnav-h` for anchor offsets). Everything works without JS, minus the animation and highlight.
- Dark mode follows `prefers-color-scheme`; all colors are variables at the top of `src/styles.css`.
- Fonts (Lora, Open Sans) come from Google Fonts; icons from Font Awesome and Academicons CDNs.

## Local preview

```sh
npm ci
npm start        # http://localhost:8080, rebuilds on change
npm run build    # writes _site/
```
