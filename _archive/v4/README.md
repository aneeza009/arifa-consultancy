# Arifa H portfolio demo (Sorix.Co)

Static HTML + CSS + vanilla JS. No backend, no tracking, no build step. Pages are `noindex`.
This is the first design (four-circle hero, Cormorant + Jost) restored, in a brown, grey, black and beige palette.

```powershell
cd code
node serve.mjs     # http://localhost:5173
```

## Pages
- `index.html`: hero, trust strip, **What I solve** (individuals and businesses), **Services** (five), **How to book** (three steps), why an HR insider, recommendations, final call to action
- `about.html`: her story, timeline, credentials, values
- `book.html`: the booking form (service, date and time in Gulf time, details). `?service=` preselects a service.

Content is in `data/*.json` (`site.json` holds the problems, services and booking steps).
Palette is in `css/tokens.css`. Older versions are in `_archive/` (v1 original, v2, v3).

## Removed from this version
Gratuity calculator, all other calculators, Wheel of Life quiz, Rights Navigator, journal, preloader, page transitions, custom cursor, magnetic buttons, sticky action bar, WhatsApp float button, newsletter form, extra pages.

## [NEEDS ARIFA] and [SAMPLE] items
| Where | What |
|---|---|
| Home hero, About hero | Professional portrait (placeholder) |
| Services | Format and duration (tagged [SAMPLE]); "What you get" and "Best for" lines are drafted from her profile for approval |
| Solve section | Problem and solution lines are drafted wording; confirm they match how she describes her work |
| Booking | Real working hours and days (slots are sample); WhatsApp number |
| Recommendations | Permission to publish names and quotes |
| About | Her own paragraph on why she became a coach; role descriptions for SEE Engineering, RRIFZ and Freelance; whether to show her current employer |
| Header | Her real signature or RRIFZ logo (Allura font used for now) |
| Email | consulting@rrifz.com was supplied in the brief; confirm it is live |
