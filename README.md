# RRIFZ — Transformation Life Coaching by Arifa (frontend-only demo)

Pitch demo by **Sorix.Co** for Arifa H. Static multi-page site: plain HTML + CSS + vanilla JS modules.
No backend, no tracking, no build step required. **Status: Phase 1 of 3 complete** (foundation, Home, About).

## Run it

```powershell
cd code
node serve.mjs          # → http://localhost:5173   (or: npm run dev)
npm test                # gratuity maths vs the Content Pack worked example
npm run check:images    # HEAD-checks every URL in data/images.json
```

Any static server works (the site fetches `data/*.json`, so open it over http, not `file://`).

## Structure

```
index.html, about.html        Phase 1 pages (the other routes are labelled stubs until Phase 2/3)
css/    tokens.css (palette, type, motion) · base.css · components.css · home.css · about.css · fonts.css
js/     main.js (entry) · core/ (dom, data, img, gsap) · shell/ (header, footer, action bar, toast, time chip)
        motion/ (reveal, magnetic + cursor, circle-wipe transition, preloader) · components/ (venn, slider)
        lib/gratuity.js · pages/home.js · pages/about.js
data/   site.json · profile.json · posts.json · testimonials.json · images.json (from arifa-images.json)
assets/ favicon.svg · fonts/ (self-hosted, SIL OFL)
tools/  check-images · fetch-fonts · make-stubs
```

Content lives in `data/*.json` and is rendered through JS templates. Add a page by creating `page.html`
with `<body data-page="page">` and `js/pages/page.js` exporting `init({ site })`.

## Phase 1 — what exists

* Design tokens exactly per Blueprint §2 (palette, motion curve `cubic-bezier(.22,1,.36,1)`, 20px radius).
* Shell: demo ribbon, shrinking sticky header, mobile menu (focus-trapped), footer, **smart sticky action bar**
  (copy changes per page, see `site.json → actionBar`), floating WhatsApp button, Gulf-time chip.
* Motion: handwriting preloader (once per session, skippable), circle-wipe page transitions, magnetic buttons,
  soft cursor (desktop only), scroll reveals, count-ups, stacked door cards. All honour `prefers-reduced-motion`.
* GSAP + ScrollTrigger (CDN, loaded without blocking) powers exactly three scenes: preloader, the four circles
  converging on Home, the scroll-drawn career line on About. The site still works if the CDN is unreachable.
* Image system: `core/img.js` — width/height, srcset, lazy loading (hero eager), teal overlay, brand-gradient `onerror` fallback.
* Home: living Four-Circle Venn hero, trust strip, three doors, interactive framework, "why an HR insider",
  live gratuity mini-demo, quiz banner, recommendations slider, industries marquee, journal teasers, CTA.
* About: story, two sides, 9-role timeline with year/industry counter, credentials bento + filterable certifications,
  values, languages, volunteering.

## Quality gates measured so far (Lighthouse 13, mobile emulation, cold load)

| Page | Perf | A11y | Best practices | LCP | CLS | TBT |
|---|---|---|---|---|---|---|
| Home | 99 | 100 | 100 | 1.4 s | 0 | 0 ms |
| About | 98 | 100 | 100 | 1.2 s | 0 | 0 ms |

Home (desktop preset): 99, LCP 0.4 s. 375 px and 1440 px checked visually; no horizontal scroll at 375 px; no console errors.

## Decisions worth knowing

* **Fonts:** Blueprint §2.3 lists three families but its own rule says "never more than 2 per page except the
  signature". We use **Cormorant Garamond + Jost + Allura (signature)**; labels use Jost. To switch labels to
  Montserrat, change `--font-label` in `css/tokens.css`. Fonts are self-hosted (faster, no third-party CSS).
* **Hero image** is IMG-BOT-01 under the teal overlay. Portrait slots are deliberate `[NEEDS ARIFA]` placeholders — no stock model is ever used as Arifa.
* **Photo overlays** on people images (IMG-PPL-*) are atmosphere only and are never labelled as Arifa or a client.
* Some excerpt lines in `posts.json` (C4–C7, C8–C10) are one-line summaries written from the Content Pack bodies, because the pack gives no excerpt for them.
* Values card sentences ("Plain language, so you know where you stand." etc.) are short sample wording built from the three value names in the Content Pack — Arifa to approve.

## [NEEDS ARIFA] placeholders (Phase 1)

| Where | What is missing |
|---|---|
| Home hero, About hero | Professional portrait (cut-out ideal) |
| Logo / header | Her real script signature as SVG and RRIFZ logo files (the demo uses the Allura font) |
| Footer, floating button | WhatsApp number |
| Gulf-time chip | Real working hours (default Mon–Fri 09:00–18:00 GST) |
| About › story | Her own paragraph on why she became a coach |
| About › timeline | Descriptions for SEE Engineering, RRIFZ and Freelance roles (none on LinkedIn); whether to show the current employer (`profile.json → showCurrentEmployer`) |
| Home › rights teaser | Gratuity formula confirmation + "last checked" date (shown as `[date to be confirmed by Arifa]`) |
| Home › recommendations | Permission to publish names and quotes (tagged "permission pending") |
| About › CTA | "Download my profile" PDF (demo toast only) |

Phase 2 and 3 placeholders will be appended as those pages are built (coaching pricing, confidentiality terms,
response-time promise, MOHRE-representation wording, etc.).

## Not in Phase 1 (stub pages show a labelled placeholder)

Phase 2: Coaching, HR Consulting, Wheel of Life quiz, Free Tools + Rights Navigator, Labour Law Hub, Book/Contact, Ctrl/⌘+K search.
Phase 3: Journal + 10 posts, Results & Recommendations, Privacy, Disclaimer, 404, Credits, final QA.

Pages are `noindex, nofollow`. Photography via Unsplash contributors (Unsplash License).
