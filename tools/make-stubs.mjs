// Generates clearly-labelled placeholder pages for routes built in Phase 2 / 3, so the nav never 404s.
// Re-running is safe: it only writes files that do not exist (or that still carry the stub marker).
import { writeFile, readFile } from 'node:fs/promises';

const pages = [
  ['coaching', 'Coaching', 2, 'Coaching for the moments when life and work stop lining up.'],
  ['hr-consulting', 'HR Consulting', 2, 'HR you can trust, without hiring a full department.'],
  ['labour-law', 'Know Your Rights', 2, 'Your rights at work in the UAE, in plain English.'],
  ['tools', 'Free Tools', 2, 'The Wheel of Life quiz, calculators and the Rights Navigator.'],
  ['book', 'Book a call', 2, "Let's find your clarity."],
  ['journal', 'The Journal', 3, 'Rights, careers and clarity, written for real people.'],
  ['post', 'Journal article', 3, 'Articles open here.'],
  ['results', 'Results & Recommendations', 3, 'Real recommendations, shown with permission.'],
  ['privacy', 'Privacy', 3, 'Privacy policy.'],
  ['disclaimer', 'Disclaimer', 3, 'General information, not legal advice.'],
  ['credits', 'Credits', 3, 'Photography credits, generated from the image data.'],
  ['404', 'Page not found', 3, "This page took a wrong turn. Let's get you back to clarity."]
];

const MARK = '<!-- STUB-PAGE -->';

for (const [slug, title, phase, line] of pages) {
  const file = new URL(`../${slug}.html`, import.meta.url);
  const existing = await readFile(file, 'utf8').catch(() => null);
  if (existing && !existing.includes(MARK)) { console.log('skip (real page)', slug); continue; }
  const isPost = slug === 'post';
  const html = `<!doctype html>
${MARK}
<html lang="en-GB" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | RRIFZ — Arifa H, HR &amp; Life Coach in Dubai</title>
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#2A3837">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="assets/fonts/CormorantGaramond.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/Jost.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/fonts.css">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <script>
    (function () {
      var d = document.documentElement; d.classList.remove('no-js'); d.classList.add('js');
      try {
        var w = sessionStorage.getItem('wipe');
        if (w) { sessionStorage.removeItem('wipe'); var o = JSON.parse(w); d.style.setProperty('--wx', o.x + 'px'); d.style.setProperty('--wy', o.y + 'px'); d.style.setProperty('--wipe', o.c); d.classList.add('wipe-in'); }
        else if (!sessionStorage.getItem('preloaded') && !matchMedia('(prefers-reduced-motion: reduce)').matches) d.classList.add('preloading');
      } catch (e) {}
      setTimeout(function () { d.classList.remove('preloading'); d.classList.remove('wipe-in'); d.classList.add('is-ready'); }, 5000);
    })();
  </script>
  <script type="module" src="js/main.js"></script>
</head>
<body data-page="${slug}">
  <a class="skip" href="#main">Skip to content</a>
  <div class="preloader" id="preloader" aria-hidden="true"></div>
  <div class="wipe" aria-hidden="true"></div>
  <header id="site-header"></header>
  <main id="main">
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">Built in Phase ${phase}</p>
        <h1 class="display">${title}</h1>
        <p class="lead">${line}</p>
        <p style="margin-top:32px"><span class="needs">Placeholder page — full build arrives in Phase ${phase}</span></p>
        <div class="btn-row" style="margin-top:28px"><a class="btn" href="index.html">Back to home</a><a class="btn btn--ghost" href="about.html">About Arifa</a></div>
      </div>
    </section>
  </main>
  <footer id="site-footer"></footer>
</body>
</html>
`;
  await writeFile(file, html);
  console.log('wrote', slug + '.html');
}
