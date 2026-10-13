# NickolasSpace: redesign and technical audit

Date: 13 October 2026. Verification was completed locally before publication. Deployment status is recorded by the repository's GitHub Pages workflow.

## Scope and retained behaviour

- EN/UK/SV, one-project slider, language-specific NickolasGames images and collapsed game details remain intact.
- Prices, contact destinations, project facts and the original logo are unchanged. Smaller logo files are derivatives of the same artwork, not a new design.
- No analytics, advertising pixels, enquiry submission or new backend was added. The separate ASP.NET project is not called by this frontend.

## Palette

The source of truth is `public/theme.css`; Tailwind and the static privacy pages use its variables.

| Token | HEX | Use |
| --- | --- | --- |
| ink | #181B1C | Main graphite background, text on light backgrounds |
| ink2 | #232928 | Secondary dark surface |
| paper | #EDF0EB | Light sections, primary text on dark backgrounds |
| mist | #B5BEB8 | Supporting dark-surface text |
| accent | #B2D5C1 | Main action, selected states, dark-surface focus |
| accent-hover | #C9E2D5 | Main action hover |
| muted-dark | #4C5D54 | Supporting text and focus on light backgrounds |
| line | #3D4843 | Decorative dividers |
| control | #6C8075 | Interactive control boundaries |

Measured contrast: paper/ink 15.07:1, mist/ink2 7.77:1, accent/ink 10.87:1, muted-dark/paper 6.09:1, control/ink2 3.51:1. The regression suite checks normal-text pairs at 4.5:1 and control boundaries at 3:1. Decorative lines are not used as the only indication of an interactive control. This is not a full WCAG certification.

## Design and usability

- Fixed heading sizes replace viewport-scaled type. Main sections have a consistent, tighter spacing rhythm.
- Primary actions use a restrained green accent; outlined buttons retain their text colour on hover. Repeated items have radii of no more than 8px.
- Added mobile navigation, Escape dismissal, a skip link and accessible standard icons.
- Contact dialog retains focus trapping, inert background and Escape handling. Mobile-menu contact restores focus to its menu trigger.
- Videos can be paused globally for the current page session. Reduced motion and Save-Data/2G avoid automatic video activation. This preference is not stored or transmitted.
- Hero text no longer starts hidden behind a delayed animation, including after switching language.

## SEO and resources

- Main content, all service descriptions and both projects remain in prerendered HTML. There is one H1 and one canonical.
- Description and social descriptions are consistent; the existing logo remains the share image. Twitter uses `summary`, matching the square logo.
- The main page still has one URL with a client-side language selector. No invented hreflang links were added to it. For independently indexed translated homepages, real language URLs and separate prerendering would be needed.
- Privacy pages now have actual EN/UK/SV URLs, reciprocal hreflang, self-canonicals and sitemap entries.
- Added a branded 404 page. Before changes, live checks returned HTTPS 200, HTTP 301 to HTTPS and a missing-page 404.
- Google font requests were removed. Bricolage Grotesque is served as local variable WOFF2 with `font-display: swap` and its OFL licence. Unsupported Cyrillic glyphs keep the existing system-font fallback.
- Added responsive WebP screenshot derivatives, smaller logo files and a WebP portrait. Original full-size project screenshots remain available through gallery links. Image dimensions reserve layout space.
- Video files were not re-encoded. They remain approximately 41 MB combined, but are loaded near the viewport, paused offscreen and omitted for reduced-motion/limited-connection preferences. Encoding smaller video variants remains a useful follow-up.

## Security

- Production HTML receives a restrictive meta CSP at build time. Scripts are same-origin, with SHA-256 allowances for the existing inline structured data; inline handlers and eval are not allowed. Fonts/media are same-origin, objects/frames/workers and form submissions are blocked.
- Inline styles remain allowed for React animation values and the no-JavaScript fallback. This is a deliberate limitation, not a claim of a fully strict style policy.
- Pages use a `no-referrer` meta policy. New-tab links retain `noreferrer`.
- The local preview configuration adds nosniff, Referrer-Policy and Permissions-Policy. These local headers are NOT automatically applied by GitHub Pages.
- The observed production homepage had no CSP, HSTS, Permissions-Policy or nosniff response headers. GitHub Pages does not consume a repository `_headers` file. Full CSP `frame-ancestors`, clickjacking protection, HSTS and Permissions-Policy need hosting/proxy support. No hosting migration or production setting was performed.
- A client source pattern scan found no obvious private key/token credentials. This is not a complete secret-history or penetration audit.
- The final dependency audit reported zero known advisories. A transient install summary differed; the explicit follow-up `npm audit --json` reported zero. The lockfile remains the reproducible install input.
- GitHub deployment now runs lint and regression tests after build, before uploading.

## Actual data flows

| Flow | Data / purpose | Destination and storage |
| --- | --- | --- |
| Page/media/font requests | IP and HTTP connection/browser information, content delivery | GitHub Pages and its infrastructure; provider-controlled logs |
| Explicit language choice | `en`, `uk` or `sv`, remembering requested language | Device localStorage, key `nickolas-language`, until cleared/removed; not sent to an application server |
| Contact dialog | No enquiry is sent by opening it | In-memory UI only |
| Email or social contact | Message, contact details and any supplied attachments, responding to the request | Gmail, Instagram or Telegram when the visitor chooses and uses that channel |
| Social/profile/project links | Normal navigation to the selected service | Destination's processing begins on navigation; no embedded widgets on this page |
| Analytics/ads | None in the reviewed implementation | No tracking integration added |

## GDPR foundation and remaining owner decisions

The owner confirmed: Mykola Kosmachevskyi / Микола Космачевський, Ukraine. Existing contact: kkosmacevskij@gmail.com. No company registration or postal address was invented.

The public notice describes the actual website, providers, device storage and requests concerning correspondence. It expressly identifies that the operational legal information is not complete. Language storage can be removed from the notice page, and blocked storage does not prevent the app working.

No decorative consent banner was added. The only application storage is the user's requested language setting, with no analytics or advertising. Applicability of the necessary-storage exception and any additional territorial obligations still need confirmation for the actual business. Introducing optional tracking or embedded third-party content requires a fresh review and, where required, prior consent with equivalent refusal and withdrawal.

Before treating this as a complete privacy policy, the owner needs to establish:

1. Full controller identity/contact address and business status; applicability of GDPR and any EU representative obligations for a Ukraine-based operator targeting EU customers.
2. Lawful bases per purpose, including pre-contract enquiries versus organisational contact correspondence; any legitimate-interest assessment.
3. Retention/deletion schedules for correspondence, attachments, backups and client records, including applicable statutory requirements.
4. Provider roles, contractual/DPA terms, processing locations and safeguards for transfers outside the EEA.
5. A practical process for data-rights requests and security incidents, with access controls and account security for communication services.

An on-page checkbox or banner cannot supply these missing organisational arrangements. No claim of full GDPR compliance is made.

## Verification

- Build, lint and 11 SEO/design/security tests passed.
- Browser checks covered EN/UK/SV at 1440x1000, 768x1024 and 390x844, plus 320x640. No horizontal overflow; one active project and one H1.
- Checked language-specific galleries, game-details expansion, keyboard service tabs, mobile navigation, contact-dialog Tab/Shift+Tab/Escape, global video pause and language reset.
- Production preview ran with the built CSP and no observed site CSP violations. The instrumentation iframe produced browser-integration MutationObserver warnings, not an observer present in application source.
- Local unthrottled performance smoke measurements: desktop LCP 204 ms / CLS 0.0194; mobile LCP 192 ms / CLS 0.0292 and maximum observed interaction-event duration 48 ms. These are cached local iframe measurements, NOT PageSpeed scores, real-device/4G results or field INP. A deployment-specific Lighthouse/CrUX check is still needed after approval to publish.
- The performance harness lives under `tests/browser` and is manually copied to `dist` only for local testing. Normal builds do not include it.
- Screenshots are in `D:/NickolasSpace/DesignReview/2026-10-13`.

## References

- [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [OWASP CSP](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [GitHub Pages HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [PTS cookie guidance](https://pts.se/internet-och-telefoni/kakor-cookies/)
- [European Commission: information and rights](https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en)
