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

## Browser regression tests

```bash
npx playwright install chromium
npm run build
npm run test:browser
```

The smoke suite starts its own production preview on port 5191 and checks
desktop/mobile contact, services, language switching, portfolio navigation,
reduced-motion posters and video handoffs. GitHub Actions runs it before deployment.
Original MP4 sources remain in `public/assets`; the site uses the smaller `-web.mp4`
variants with matching `-web-poster.webp` stills.

`public/privacy.html` describes the site's current technical data use. Keep it
up to date when adding analytics, forms or external services.

## GitHub Pages

The repository includes a GitHub Actions workflow in `.github/workflows/deploy.yml`.
After pushing to `main`, enable GitHub Pages with **Source: GitHub Actions** in the repository settings.
