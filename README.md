# NickolasSpace Frontend

React + Vite landing page for NickolasSpace.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run test:seo
```

The build prerenders the homepage into static HTML using the same React components
as the interactive app. All service categories are included in the HTML; the
client hydrates it and restores the saved language. Without JavaScript, the
catalogue displays all categories. Decorative videos load near the viewport.

`public/privacy.html` describes the site's current technical data use. Keep it
up to date when adding analytics, forms or external services.

## GitHub Pages

The repository includes a GitHub Actions workflow in `.github/workflows/deploy.yml`.
After pushing to `main`, enable GitHub Pages with **Source: GitHub Actions** in the repository settings.
