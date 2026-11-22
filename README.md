# Arifa H | HR consultancy and coaching website (Sorix.Co demo)

Static HTML, CSS and vanilla JavaScript, built mobile first. No framework, no tracking.

```powershell
cd code
node serve.mjs      # development server on http://localhost:5173
npm run build:dist  # minified copy in dist/ (needs Node; esbuild is fetched by npx)
```

## Pages
```
index.html                  Home: everything on one page (hero, services, who I help, how it works, about, experience, FAQ, contact)
about.html                  Story, career timeline, credentials, education, languages
services.html               All five services in detail
service-*.html              One page per service (hr-consulting, fractional-hr, labour-law, employee-relations, coaching)
who-i-help.html             Individuals and businesses, plus a "which service is right for me" finder
blog.html                   Coming soon (next phase): planned topics, no articles yet
contact.html                Contact details, how booking works, FAQ
book.html                   Redirects to contact.html
```
`index.html` is hand-written. The other pages are generated from it (shared header, footer and booking modal) by `npm run build:pages`. Edit `tools/build-pages.mjs` and re-run it to change them.

## Other files
```
css/styles.css, css/fonts.css     styles (tokens at the top) and self-hosted fonts
js/main.js                        header, menu, reveals, service details, FAQ, booking modal
assets/img/                       photos (hero, section images, portrait crops, OG image)
data/testimonials.json            LinkedIn recommendations, NOT shown until approved
_archive/                         earlier designs
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
