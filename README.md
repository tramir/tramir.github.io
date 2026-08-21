# tramir.github.io

Personal site, built with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages on push to `main`.

## Editing

- **Papers**: edit `src/assets/xml/research.xml`. Lists on the research page and the featured items on the home page are generated from it at build time (`src/_data/research.js`). Field conventions are documented at the top of that file. PDFs go in `src/assets/papers/`.
- **CV**: replace `src/assets/CV/CV.pdf`.
- **Bio/contact**: `src/index.njk`. Layout and footer links: `src/_includes/layouts/base.njk`.
- **Fonts/icons**: self-hosted — fonts in `src/assets/fonts/` (see `fonts.css` there for how to regenerate), icons are inline SVGs in the templates. No third-party requests.

## Local preview

```sh
npm ci
npm start        # http://localhost:8080, rebuilds on change
npm run build    # writes _site/
```
