# Project Case Pages

Each project has a separate, prerendered page in EN, UK and SV:

- `project-autoalex.html`, `project-autoalex-uk.html`, `project-autoalex-sv.html`
- `project-nickolasgames.html`, `project-nickolasgames-uk.html`, `project-nickolasgames-sv.html`

The homepage keeps the single-project slider and screenshot galleries. Its detail links open the corresponding language page in the same tab. Project facts reuse `caseStudies.js`, `gameProjectDetails.js` and the existing translations; the explanatory feature/workflow copy lives in `projectPages.js`.

AutoAlexDE also includes the three original admin screenshots supplied by the owner: dashboard, vehicle management and enquiries. On 2026-10-22 the owner explicitly confirmed that their displayed records are test data and requested unmodified originals. The PNG originals are preserved; resized WebP previews are lossless. A translated caption identifies the admin screenshots as test data and makes clear to EN/SV readers that the admin interface shown is Ukrainian. No generatively edited screenshot is included.

## Returning To The Portfolio

On an ordinary detail-link click, the current history entry records the selected project, each gallery selection, the work section's viewport offset and the link to refocus. The destination receives a temporary `from=portfolio` parameter, replaces it with an entry-scoped history marker and removes the parameter from the visible URL. The return links use browser Back for this flow. The homepage restores the section's offset and focuses the original link without scrolling again.

Switching language on a case replaces the current history entry, keeping a single Back step to the portfolio. Direct visits, modified clicks and opening a case in a new tab retain ordinary anchors, with a fallback return URL selecting the corresponding project. No cookies, sessionStorage, localStorage keys or remote analytics are added for navigation.

## Build And SEO

`scripts/prerender.mjs` writes all six real HTML files. Each includes translated content, one H1, a self-canonical, reciprocal language alternates, project-specific social metadata, WebPage/BreadcrumbList structured data and the existing production CSP. Generated case URLs are appended to the built sitemap. Refreshing or sharing a case URL does not require a server rewrite on GitHub Pages.

Vite's development fallback renders the appropriate case in the browser. Test the built static documents with `npm run preview` as well as the dev server. Run `npm run build`, `npm run lint` and `npm test` before publishing.

## Local Verification On 2026-10-22

- All six pages were checked at 1280, 768 and 390 px; long UK/SV copy was also checked at 320 px. One H1, the expected language/canonical, loaded project images and no horizontal overflow were confirmed.
- NickolasGames -> English language switch -> Back restored NickolasGames, the catalogue screenshot and the detail link's focus. A same-language round trip restored the work section's offset within one CSS pixel.
- Direct case entry -> portfolio fallback -> select AutoAlexDE -> browser Back restored AutoAlexDE, even when the homepage URL initially selected NickolasGames.
- The game/mode disclosure works with pointer and Enter. The contact dialog receives the project name and closes with Escape.
- Browser console checks found no errors during these flows. Screenshots are in the workspace's `DesignReview/2026-10-22-project-pages` folder. These are local checks, not a statement that the changes have been deployed.
