# Arifa H | HR consultancy and coaching website (Sorix.Co demo)

Static HTML, CSS and vanilla JavaScript, built mobile first. No framework, no tracking.

```powershell
cd code
node serve.mjs      # development server on http://localhost:5173
npm run build:dist  # minified copy in dist/ (needs Node; esbuild is fetched by npx)
```

## Files
```
index.html      the whole site (hero, services, who I help, how it works, about, experience, FAQ, contact, booking modal)
about.html      redirects to index.html#about
book.html       redirects to index.html#contact
css/            styles.css (tokens at the top), fonts.css (DM Serif Display + Manrope, self-hosted)
js/main.js      header, menu, reveals, service details, FAQ, booking modal, recommendations switch
assets/img/     Arifa's portrait (crop only), three section photos, OG image
data/testimonials.json   her LinkedIn recommendations, NOT shown until approved (see below)
_archive/       earlier designs
```

## Switching on the recommendations
Set `TESTIMONIALS_APPROVED = true` at the top of `js/main.js` once Arifa has approved publishing the names and quotes.

## Before launch
- Remove `<meta name="robots" content="noindex, nofollow">` from index.html (kept so the demo is not indexed).
- Replace `og:image` with an absolute URL once the domain is known.

## [NEEDS ARIFA] and [SAMPLE] items
| Where | What |
|---|---|
| Hero | Background is a free stock photo of an HR consultation (Unsplash, IMG-PPL-03), not Arifa. Replace with her own consultation or office photo when available |
| About | Her portrait is used here. A second, seated or consultation-setting photo would add variety |
| Services | Format and duration (tagged [SAMPLE]); the who, problem and outcome lines are drafted from her profile for approval |
| Booking | Real working hours and days (slots are sample). The form sends nothing until connected to a real scheduling service or email |
| Contact | WhatsApp number (no WhatsApp button until a verified number exists) |
| Recommendations | Permission to publish names and quotes |
| Logo | Her signature or RRIFZ logo files (text wordmark used) |
| Contact | consulting@rrifz.com was supplied in the brief; confirm it is live |
