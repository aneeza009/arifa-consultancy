// Generates the inner pages (About, Services, Who I Help, Blog, Contact and one page per service)
// from the shared header, footer and booking modal in index.html. Run:  node tools/build-pages.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const home = readFileSync('index.html', 'utf8');
const grab = (re, name) => { const m = home.match(re); if (!m) throw new Error('missing ' + name + ' in index.html'); return m[0]; };
const HEADER = grab(/<header class="hdr"[\s\S]*?<\/header>/, 'header');
const FOOTER = grab(/<footer class="ftr">[\s\S]*?<\/footer>/, 'footer');
const MODAL = grab(/<dialog class="modal"[\s\S]*?<\/dialog>/, 'modal');

const ICONS = {
  'hr-consulting': '<path d="M9 4h6l1 2h3v14H5V6h3l1-2z"/><path d="M9 13l2 2 4-4"/>',
  'fractional-hr': '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4.5 2 4.5 4.5"/>',
  'labour-law': '<path d="M12 4v16M6 20h12M5 7h14"/><path d="M5 7l-3 7a3 3 0 006 0L5 7zM19 7l-3 7a3 3 0 006 0l-3-7z"/>',
  'employee-relations': '<path d="M4 5h10v7H8l-4 3V5z"/><path d="M10 15h4l4 3v-9h-4"/>',
  'coaching': '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z"/>'
};
const icon = (id) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[id]}</svg>`;

const SERVICES = [
  { id: 'hr-consulting', n: '01', name: 'HR Consulting', acc: 'gold',
    lead: 'Policies, performance and compliance, set up properly.',
    intro: 'HR strategy, policies, performance management and compliance, set up properly for your business.',
    who: 'Business owners and managers building or fixing their HR.', problem: 'Contracts and policies that are unclear, inconsistent or out of date.', outcome: 'Clear, documented HR practices your team can follow.',
    get: ['Policy and contract review', 'Performance management framework', 'Compliance check'], format: 'Video · 60 minutes', audience: 'Businesses',
    faq: [['Is this for businesses only?', 'This service is designed for business owners and managers who want their HR set up properly. Individuals can look at Labour Law Guidance, Employee Relations and Coaching.']] },
  { id: 'fractional-hr', n: '02', name: 'Fractional HR Support', acc: 'sage',
    lead: 'A part-time HR lead for growing companies.',
    intro: 'A part-time HR lead for growing companies that are not ready for a full-time hire.',
    who: 'Founders and growing teams without in-house HR.', problem: 'People matters landing on managers with no one owning them.', outcome: 'Consistent HR operations without the cost of a full-time role.',
    get: ['HR operations cover', 'Employee lifecycle support', 'Ongoing management advice'], format: 'Remote · Monthly', audience: 'Businesses',
    faq: [['What does fractional mean?', 'It means a part-time HR lead who works with your business on an ongoing basis, instead of a full-time employee.']] },
  { id: 'labour-law', n: '03', name: 'UAE Labour Law and Compliance Guidance', acc: 'gold',
    lead: 'Plain-English guidance on contracts, rights and end-of-service. Not legal advice.',
    intro: 'Plain-English guidance on contracts, employee rights, WPS and end-of-service. General information, not legal advice.',
    who: 'Employees and employers in the UAE.', problem: 'Not knowing where you stand on your contract or your obligations.', outcome: 'A clear understanding of the general rules, so you can decide your next step.',
    get: ['Contract walkthrough', 'Rights and obligations explained', 'End-of-service guidance'], format: 'Video · 45 minutes', audience: 'Individuals and businesses',
    note: 'This is general information, not legal advice. For legal decisions, consult a licensed UAE legal professional or contact MOHRE directly.',
    faq: [['Is this legal advice?', 'No. It is general information to help you understand the basics. For legal decisions, consult a licensed UAE legal professional or contact MOHRE directly.']] },
  { id: 'employee-relations', n: '04', name: 'Employee Relations', acc: 'sage',
    lead: 'Calm, fair support for disputes and workplace conflict.',
    intro: 'Calm, structured support for disputes, investigations and workplace conflict.',
    who: 'Employees facing conflict, and managers or businesses handling a complaint.', problem: 'Conflict or unfair treatment that is not being resolved properly.', outcome: 'A fair, practical process and clear next steps.',
    get: ['Case assessment', 'Fair, structured investigation approach', 'Resolution plan'], format: 'Video · 60 minutes', audience: 'Individuals and businesses',
    faq: [['Can both employees and employers book this?', 'Yes. Employees can book to talk through a workplace situation, and managers or businesses can book for support handling a complaint or dispute.']] },
  { id: 'coaching', n: '05', name: 'Transformation Life Coaching', acc: 'gold',
    lead: 'One-to-one coaching for career and life direction. Not therapy.',
    intro: 'One-to-one coaching for clarity, career and life direction. Coaching, not therapy.',
    who: 'Professionals at a crossroads who want a clear next step.', problem: 'Feeling stuck in your career or unsure of your direction.', outcome: 'Clearer goals and a practical action plan.',
    get: ['Clear goals', 'Career direction', 'Action plan'], format: 'Video · 60 minutes', audience: 'Individuals',
    note: 'Coaching focuses on clarity, goals and action. It is not therapy or medical advice.',
    faq: [['Is coaching the same as therapy?', 'No. Coaching focuses on clarity, goals and action. It is not therapy or medical advice.']] }
];
const svcById = Object.fromEntries(SERVICES.map((s) => [s.id, s]));
const svcUrl = (id) => `service-${id}.html`;

const COMMON_FAQ = [
  ['Is the first call really free?', 'Yes. The first conversation is free and takes 20 minutes.'],
  ['How do I book?', 'Choose a service, pick a date and time in Gulf Standard Time, and send your details. Arifa replies to confirm.']
];

/* ---------- page shell ---------- */
function page({ file, title, desc, body, active }) {
  const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | Arifa H</title>
<meta name="description" content="${desc}">
<meta name="robots" content="noindex, nofollow"><!-- demo site: remove before launch -->
<meta name="theme-color" content="#101827">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_GB">
<meta property="og:site_name" content="RRIFZ | Arifa H">
<meta property="og:title" content="${title} | Arifa H">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/DMSerifDisplay.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/Manrope.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/fonts.css">
<link rel="stylesheet" href="css/styles.css">
<script>document.documentElement.classList.add('js')</script>
<script src="js/main.js" type="module"></script>
</head>
<body class="inner" data-page="${active}">
<a class="skip" href="#main">Skip to content</a>

${HEADER}

<main id="main">
${body}
</main>

${FOOTER}

${MODAL}

</body>
</html>
`;
  writeFileSync(file, html);
  console.log('wrote', file);
}

const picture = (name, alt, { sizes = '(min-width: 900px) 46vw, 100vw', w = 1200, h = 857, loading = 'lazy' } = {}) => `<picture>
  <source type="image/avif" srcset="assets/img/${name}-640.avif 640w, assets/img/${name}-1200.avif 1200w" sizes="${sizes}">
  <source type="image/webp" srcset="assets/img/${name}-640.webp 640w, assets/img/${name}-1200.webp 1200w" sizes="${sizes}">
  <img src="assets/img/${name}-1200.jpg" width="${w}" height="${h}" alt="${alt}" loading="${loading}" decoding="async">
</picture>`;

const phero = ({ kicker, h1, lead, crumbs, extra = '' }) => `<section class="phero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">${crumbs}</nav>
    <p class="kicker phero__in" style="--d:0">${kicker}</p>
    <h1 class="phero__in" style="--d:1">${h1}</h1>
    <p class="phero__lead phero__in" style="--d:2">${lead}</p>
    ${extra}
  </div>
</section>`;

const band = (h2, p, btn = 'Book a Free 20-Minute Consultation') => `<section class="band">
  <div class="wrap band__in" data-reveal>
    <div><h2>${h2}</h2><p>${p}</p></div>
    <button class="btn btn--gold btn--lg" type="button" data-book="intro">${btn}</button>
  </div>
</section>`;

const steps = `<ol class="steps">
  <li class="step" data-reveal style="--i:0"><span class="step__n">01</span><h3>Choose what you need</h3><p>Pick a service, or the free intro call.</p></li>
  <li class="step" data-reveal style="--i:1"><span class="step__n">02</span><h3>Pick a date and time</h3><p>Choose a slot in Gulf time (UTC+4).</p></li>
  <li class="step" data-reveal style="--i:2"><span class="step__n">03</span><h3>Send your details</h3><p>Arifa replies to confirm.</p></li>
</ol>`;

let faqId = 0;
const faq = (items) => `<div class="acc" data-reveal>${items.map(([q, a]) => { faqId++; return `
  <div class="acc__item"><h3><button type="button" aria-expanded="false" aria-controls="a${faqId}" id="q${faqId}">${q}</button></h3><div class="acc__p" id="a${faqId}" role="region" aria-labelledby="q${faqId}"><div><p>${a}</p></div></div></div>`; }).join('')}
</div>`;

/* ---------- SERVICES overview ---------- */
page({
  file: 'services.html', active: 'services',
  title: 'Services', desc: 'HR consulting, fractional HR, UAE labour law guidance, employee relations and transformation coaching in Dubai. See what each service covers and book a free 20-minute consultation.',
  body: `${phero({ crumbs: '<a href="index.html">Home</a><span>Services</span>', kicker: 'Services', h1: 'Five services. <em>Find the one that fits.</em>', lead: 'Each service has its own page with who it is for, the problem it solves and what you get. Every one begins with a free 20-minute conversation.' })}
<section class="sec sec--light">
  <div class="wrap">
    <div class="srows">
${SERVICES.map((s, i) => `      <article class="srow" id="${s.id}" data-reveal style="--acc:var(--${s.acc === 'gold' ? 'gold' : 'sage'})">
        <div class="srow__head"><span class="srow__icon">${icon(s.id)}</span><span class="srow__n">${s.n}</span></div>
        <div class="srow__main">
          <p class="srow__aud">${s.audience}</p>
          <h2>${s.name}</h2>
          <p class="srow__lead">${s.intro}</p>
          <ul class="srow__get">${s.get.map((g) => `<li>${g}</li>`).join('')}</ul>
        </div>
        <dl class="srow__facts">
          <div><dt>Who it is for</dt><dd>${s.who}</dd></div>
          <div><dt>Problem it solves</dt><dd>${s.problem}</dd></div>
          <div><dt>What to expect</dt><dd>${s.outcome}</dd></div>
        </dl>
        <div class="srow__cta">
          <a class="btn btn--ink" href="${svcUrl(s.id)}">View service</a>
          <button class="btn btn--line-ink" type="button" data-book="${s.id}">Book a Consultation</button>
        </div>
      </article>`).join('\n')}
    </div>
  </div>
</section>
<section class="sec sec--dark">
  <div class="wrap">
    <div class="head" data-reveal><p class="kicker">How it works</p><h2>Three steps to <em>your free consultation.</em></h2><p class="head__p">Free, and it takes 20 minutes.</p></div>
    ${steps}
  </div>
</section>
${band('Not sure which service fits?', 'Start with a free intro call and talk it through.')}`
});

/* ---------- SERVICE detail pages ---------- */
for (const s of SERVICES) {
  const others = SERVICES.filter((o) => o.id !== s.id);
  page({
    file: svcUrl(s.id), active: 'services',
    title: s.name, desc: `${s.intro} Book a free 20-minute consultation with Arifa H in Dubai.`,
    body: `${phero({
      crumbs: `<a href="index.html">Home</a><a href="services.html">Services</a><span>${s.name}</span>`,
      kicker: `Service ${s.n} · ${s.audience}`, h1: s.name, lead: s.intro,
      extra: `<div class="phero__cta phero__in" style="--d:3"><button class="btn btn--gold" type="button" data-book="${s.id}">Book a Consultation</button><a class="btn btn--line" href="services.html">All services</a></div>`
    })}
<section class="sec sec--light" style="--acc:var(--ink)">
  <div class="wrap detail">
    <div class="detail__main">
      <div class="block" data-reveal><h2>Who it is for</h2><p>${s.who}</p></div>
      <div class="block" data-reveal><h2>The problem it solves</h2><p>${s.problem}</p></div>
      <div class="block" data-reveal><h2>What to expect</h2><p>${s.outcome}</p></div>
      <div class="block" data-reveal><h2>What you get</h2><ul class="ticks">${s.get.map((g) => `<li>${g}</li>`).join('')}</ul></div>
      ${s.note ? `<p class="note" data-reveal>${s.note}</p>` : ''}
    </div>
    <aside class="detail__side" data-reveal style="--i:1">
      <div class="sidecard" style="--acc:var(--${s.acc === 'gold' ? 'gold' : 'sage'})">
        <span class="sidecard__icon">${icon(s.id)}</span>
        <h3>Book this service</h3>
        <p class="sidecard__meta">Format and duration<br><strong>${s.format}</strong> <span class="tag">[SAMPLE]</span></p>
        <p class="sidecard__meta">First call<br><strong>Free, 20 minutes</strong></p>
        <button class="btn btn--gold btn--full" type="button" data-book="${s.id}">Book a Consultation</button>
      </div>
    </aside>
  </div>
</section>
<section class="sec sec--dark">
  <div class="wrap">
    <div class="head" data-reveal><p class="kicker">How it works</p><h2>Three steps to <em>get started.</em></h2></div>
    ${steps}
  </div>
</section>
<section class="sec sec--light">
  <div class="wrap faq">
    <div class="head" data-reveal><p class="kicker">Questions</p><h2>Good to <em>know.</em></h2></div>
    ${faq([...s.faq, ...COMMON_FAQ])}
  </div>
</section>
<section class="sec sec--dark2">
  <div class="wrap">
    <div class="head" data-reveal><p class="kicker">Other services</p><h2>You may also <em>need.</em></h2></div>
    <div class="rel">
${others.map((o, i) => `      <a class="relcard" href="${svcUrl(o.id)}" data-reveal style="--i:${i};--acc:var(--${o.acc === 'gold' ? 'gold' : 'sage'})"><span class="relcard__icon">${icon(o.id)}</span><h3>${o.name}</h3><p>${o.lead}</p><span class="relcard__go">View service →</span></a>`).join('\n')}
    </div>
  </div>
</section>
${band('Ready to talk it through?', `Book a free 20-minute conversation about ${s.name}.`)}`
  });
}

/* ---------- WHO I HELP ---------- */
page({
  file: 'who-i-help.html', active: 'who',
  title: 'Who I Help', desc: 'Arifa H supports employees and professionals with workplace rights, conflict and career direction, and supports UAE businesses with practical HR expertise.',
  body: `${phero({ crumbs: '<a href="index.html">Home</a><span>Who I Help</span>', kicker: 'Who I Help', h1: 'Support for people, and for <em>the businesses that employ them.</em>', lead: 'Two audiences, two kinds of support. Find the one that sounds like you.',
    extra: '<div class="phero__cta phero__in" style="--d:3"><a class="btn btn--gold" href="#individuals">For individuals</a><a class="btn btn--line" href="#businesses">For businesses</a></div>' })}
<section class="sec sec--light" id="individuals">
  <div class="wrap split">
    <div class="split__img" data-reveal>${picture('people', 'Two women in a one-to-one conversation at a desk')}</div>
    <div class="split__body" data-reveal style="--i:1; --acc:var(--sage)">
      <p class="kicker">For individuals</p>
      <h2>Employees and <em>professionals.</em></h2>
      <p>Talk it through with someone who knows how HR really works.</p>
      <ul class="ticks"><li>Unsure what your contract or UAE labour law says</li><li>Facing conflict or unfair treatment at work</li><li>Stuck in your career or unsure of your direction</li></ul>
      <div class="chips"><a href="${svcUrl('labour-law')}">Labour Law Guidance</a><a href="${svcUrl('employee-relations')}">Employee Relations</a><a href="${svcUrl('coaching')}">Life Coaching</a></div>
      <button class="btn btn--ink" type="button" data-book="intro">Book as an Individual</button>
    </div>
  </div>
</section>
<section class="sec sec--dark2" id="businesses">
  <div class="wrap split split--rev">
    <div class="split__img" data-reveal>${picture('office', 'Glass-walled meeting room in a modern office')}</div>
    <div class="split__body" data-reveal style="--i:1; --acc:var(--gold)">
      <p class="kicker">For businesses</p>
      <h2>Founders, owners and <em>managers.</em></h2>
      <p>Practical HR expertise for UAE companies, without a full-time hire.</p>
      <ul class="ticks"><li>Need HR support without a full-time hire</li><li>Contracts and policies need setting up properly</li><li>An employee issue needs handling fairly</li></ul>
      <div class="chips"><a href="${svcUrl('hr-consulting')}">HR Consulting</a><a href="${svcUrl('fractional-hr')}">Fractional HR</a><a href="${svcUrl('employee-relations')}">Employee Relations</a></div>
      <button class="btn btn--gold" type="button" data-book="hr-consulting">Book a Business Consultation</button>
    </div>
  </div>
</section>
<section class="sec sec--light">
  <div class="wrap">
    <div class="head" data-reveal><p class="kicker">Find your service</p><h2>Which service is <em>right for me?</em></h2></div>
    <div class="finder">
${[
  ['I am not sure what my rights are at work', 'labour-law'], ['I feel stuck in my career or life', 'coaching'], ['I am dealing with conflict at work', 'employee-relations'],
  ['We need HR but cannot hire full-time', 'fractional-hr'], ['Our contracts and policies are not solid', 'hr-consulting'], ['We need to handle an employee issue fairly', 'employee-relations']
].map(([q, id], i) => `      <a class="finder__item" href="${svcUrl(id)}" data-reveal style="--i:${i % 3}"><span>${q}</span><strong>${svcById[id].name} →</strong></a>`).join('\n')}
    </div>
  </div>
</section>
${band('Not sure where you fit?', 'A free 20-minute call is the easiest way to find out.')}`
});

/* ---------- ABOUT ---------- */
const ROLES = [
  ['Jan 2023 – present', 'Human Resources Consultant', 'Freelance · Dubai (remote)', 'HR consulting for UAE businesses.'],
  ['Dec 2025 – present', 'Transformation Life Coach', 'RRIFZ Transformation Life Coaching', ''],
  ['Nov 2025 – Jan 2026', 'Human Resources Consultant', 'Zarvista Capital Markets · Dubai', ''],
  ['Aug 2023 – Oct 2025', 'Human Resources Manager', 'Zarvista Capital Markets · Dubai', 'Led end-to-end HR operations across multi-jurisdictional offices, including an HRMS rollout and automated payroll and leave processes.'],
  ['Dec 2024 – Sep 2025', 'Fractional HR Manager', 'City Gold Global · Dubai', 'Established and led the HR function for the first retail showroom in Dubai.'],
  ['Jan 2024 – Aug 2024', 'Fractional HR Manager', 'DHF Management DMCC · Dubai', 'Managed HR operations, contracts, visas and compliance for an IT division.'],
  ['Jul 2020 – Nov 2022', 'Group Senior HR Executive', 'Safe Line Group of Companies · Dubai', 'Managed HR operations for 400+ employees across business units and introduced an Employee Happiness Survey.'],
  ['Apr 2019 – Sep 2019', 'Group HR Recruiter', 'Noura Group · UAE', 'Full-cycle recruitment across education and beauty and wellness business units.']
];
const CERTS = [
  ['Certified Human Resources Professional', 'American Certification Institute (ACI), 2019'], ['Certified Transformation Life Coach', 'Transformation Academy, 2024'],
  ['Generative AI in HR', 'LinkedIn, 2025'], ['Change Management for HR in the Wake of AI', 'LinkedIn, 2025'], ['Coaching Skills for Leaders and Managers', 'LinkedIn, 2024']
];
const MORE_CERTS = ['Learning LinkedIn Recruiter, 2022', 'Human Resources: Running Company Onboarding, 2020', 'The Human Resources Hero, 2020', 'Creating a Compelling Job Description, 2020', 'Employer Branding to Attract Talent, 2020', 'Performance-Based Hiring, 2020', 'Strategic Thinking, 2020', 'Talent Sourcing, 2020', 'Human Resources: Leadership and Strategic Impact, 2020', 'People Analytics, 2020', 'Microsoft Office, 2008', 'AutoCAD 2D and 3D, 2008'];
page({
  file: 'about.html', active: 'about',
  title: 'About Arifa', desc: 'Arifa H is a Certified HR Professional and Certified Transformation Life Coach in Dubai, with HR leadership across financial services, IT, retail, contracting, education and wellness.',
  body: `<section class="phero phero--about">
  <div class="wrap about-hero">
    <div>
      <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>About Arifa</span></nav>
      <p class="kicker phero__in" style="--d:0">About Arifa</p>
      <h1 class="phero__in" style="--d:1">An HR leader who understands <em>both sides of the desk.</em></h1>
      <p class="phero__lead phero__in" style="--d:2">Certified Human Resources Professional and Certified Transformation Life Coach, based in Dubai.</p>
      <div class="phero__cta phero__in" style="--d:3"><button class="btn btn--gold" type="button" data-book="intro">Book a Free Consultation</button><a class="btn btn--line" href="services.html">View services</a></div>
    </div>
    <figure class="portrait portrait--dark phero__in" style="--d:2">
      <picture>
        <source type="image/avif" srcset="assets/img/arifa-480.avif 480w, assets/img/arifa-800.avif 800w, assets/img/arifa-1084.avif 1084w" sizes="(min-width: 900px) 440px, 90vw">
        <source type="image/webp" srcset="assets/img/arifa-480.webp 480w, assets/img/arifa-800.webp 800w, assets/img/arifa-1084.webp 1084w" sizes="(min-width: 900px) 440px, 90vw">
        <img src="assets/img/arifa-800.jpg" srcset="assets/img/arifa-480.jpg 480w, assets/img/arifa-800.jpg 800w, assets/img/arifa-1084.jpg 1084w" sizes="(min-width: 900px) 440px, 90vw" width="1084" height="1355" alt="Arifa H., HR consultant and Transformation Life Coach, in a black blazer" fetchpriority="high" decoding="async">
      </picture>
    </figure>
  </div>
</section>
<section class="sec sec--light">
  <div class="wrap story">
    <div class="story__lead" data-reveal><p class="kicker">Her story</p><h2>People-first HR, <em>with practical systems.</em></h2></div>
    <div class="story__body" data-reveal style="--i:1">
      <p>Arifa has led HR across financial services, IT, retail, electrical and mechanical contracting, education, and beauty and wellness, supporting multi-country teams and aligning people strategy with business goals.</p>
      <p>She combines strategic HR partnering with a people-first approach: implementing HR systems, developing policies and leading organisational change, while keeping compliance and engagement in view.</p>
      <p>As a Certified Transformation Life Coach she brings empathy, coaching and development into HR practice, helping employees and leaders unlock their strengths and perform at their best.</p>
    </div>
  </div>
</section>
<section class="sec sec--dark2">
  <div class="wrap">
    <div class="head" data-reveal><p class="kicker">Career</p><h2>Where Arifa has <em>worked.</em></h2></div>
    <ol class="tl">
${ROLES.map(([d, t, o, x], i) => `      <li class="tl__item" data-reveal><span class="tl__d">${d}</span><h3>${t}</h3><p class="tl__o">${o}</p>${x ? `<p class="tl__t">${x}</p>` : ''}</li>`).join('\n')}
    </ol>
  </div>
</section>
<section class="sec sec--light">
  <div class="wrap creds2">
    <div data-reveal>
      <p class="kicker">Credentials</p><h2>Certified and <em>recognised.</em></h2>
      <ul class="credlist">${CERTS.map(([t, by]) => `<li><strong>${t}</strong><span>${by}</span></li>`).join('')}</ul>
      <details class="more"><summary>View all 17 certifications</summary><ul class="plainlist">${MORE_CERTS.map((c) => `<li>${c}</li>`).join('')}</ul></details>
    </div>
    <div data-reveal style="--i:1">
      <div class="facts">
        <div><h3>Recognition</h3><p>Special Recognition Award, Safe Line Group of Companies, January 2022</p></div>
        <div><h3>Education</h3><p>Bachelor's degree, Business Administration and Management, University of Calicut (Abu Dhabi), 2008 to 2011</p></div>
        <div><h3>Languages</h3><p>English and Hindi (full professional), Malayalam (native), Arabic (elementary)</p></div>
        <div><h3>Top skills</h3><p>Employee Relations, Labour and Employment Law, HR Policies, HR Management, HR Business Partnering</p></div>
      </div>
    </div>
  </div>
</section>
${band('Let\'s talk about what you need.', 'Book a free 20-minute conversation with Arifa.')}`
});

/* ---------- BLOG (next phase) ---------- */
const TOPICS = [
  ['Labour law basics', 'Sick leave in the UAE: the basics', 'A plain-English look at how sick leave works for private-sector employees on the mainland.'],
  ['Pay', 'Salary, WPS and basic vs gross pay', 'How salary payment, the Wage Protection System and end-of-service pay connect.'],
  ['Public holidays', 'Why public holidays move to weekends', 'What the rule on moving public holidays means for employees and employers.'],
  ['Your rights', 'Know your rights at work', 'Where employees can start when they are unsure about their contract.'],
  ['For businesses', 'Setting up HR in a growing company', 'The first policies, contracts and processes a growing team should have in place.'],
  ['Coaching', 'Finding career clarity', 'Questions that help you work out what you want from your next step.']
];
page({
  file: 'blog.html', active: 'blog',
  title: 'Blog', desc: 'Plain-English articles on UAE workplace rights, HR for growing businesses and career clarity from Arifa H. Coming in the next phase.',
  body: `${phero({ crumbs: '<a href="index.html">Home</a><span>Blog</span>', kicker: 'Blog · Coming soon', h1: 'Plain-English insights on work, <em>rights and HR.</em>', lead: 'Arifa\'s articles are being prepared and will launch in the next phase of this website. Here is what is planned.',
    extra: '<p class="phero__badge phero__in" style="--d:3"><span class="tag">Next phase</span> Articles launch soon</p>' })}
<section class="sec sec--light">
  <div class="wrap">
    <div class="head" data-reveal><p class="kicker">Planned topics</p><h2>What the blog <em>will cover.</em></h2><p class="head__p">These are topic areas, not published articles. Anything about the law will be general information, not legal advice.</p></div>
    <div class="topics">
${TOPICS.map(([c, t, d], i) => `      <article class="topic" data-reveal style="--i:${i % 3}"><p class="topic__c">${c}</p><h3>${t}</h3><p>${d}</p><span class="topic__s">Coming soon</span></article>`).join('\n')}
    </div>
  </div>
</section>
<section class="sec sec--dark">
  <div class="wrap suggest" data-reveal>
    <div><p class="kicker">Have a question?</p><h2>Suggest a <em>topic.</em></h2><p class="head__p">Tell Arifa what you would like explained and it may become an article.</p></div>
    <div class="suggest__cta"><a class="btn btn--gold" href="mailto:consulting@rrifz.com?subject=Blog%20topic%20suggestion">Email a suggestion</a><button class="btn btn--line" type="button" data-book="intro">Book a free call</button></div>
  </div>
</section>`
});

/* ---------- CONTACT ---------- */
page({
  file: 'contact.html', active: 'contact',
  title: 'Contact', desc: 'Book a free 20-minute consultation with Arifa H in Dubai, or get in touch by email or LinkedIn.',
  body: `${phero({ crumbs: '<a href="index.html">Home</a><span>Contact</span>', kicker: 'Contact', h1: 'Let\'s find the right <em>way forward.</em>', lead: 'Book a free 20-minute conversation. Tell Arifa what you need and she will confirm a time with you.',
    extra: '<div class="phero__cta phero__in" style="--d:3"><button class="btn btn--gold btn--lg" type="button" data-book="intro">Book a Free 20-Minute Consultation</button></div>' })}
<section class="sec sec--light">
  <div class="wrap cwrap">
    <div class="ccards">
      <div class="ccard" data-reveal><span class="ccard__k">Email</span><a href="mailto:consulting@rrifz.com">consulting@rrifz.com</a></div>
      <div class="ccard" data-reveal style="--i:1"><span class="ccard__k">LinkedIn</span><a href="https://www.linkedin.com/in/arifa-h" target="_blank" rel="noopener">linkedin.com/in/arifa-h</a></div>
      <div class="ccard" data-reveal style="--i:2"><span class="ccard__k">Location</span><p>Dubai, United Arab Emirates</p></div>
    </div>
    <div class="cbook" data-reveal>
      <h2>How booking works</h2>
      ${steps}
      <p class="center"><button class="btn btn--ink" type="button" data-book="intro">Start Booking</button></p>
    </div>
  </div>
</section>
<section class="sec sec--dark2">
  <div class="wrap faq">
    <div class="head" data-reveal><p class="kicker">Questions</p><h2>Before you <em>book.</em></h2></div>
    ${faq([
      ...COMMON_FAQ,
      ['Who can book a consultation?', 'Employees and professionals who want guidance on work or direction, and business owners and managers who need HR support.'],
      ['Is the labour law guidance legal advice?', 'No. It is general information to help you understand the basics. For legal decisions, consult a licensed UAE legal professional or contact MOHRE directly.']
    ])}
  </div>
</section>`
});

/* ---------- book.html keeps working ---------- */
writeFileSync('book.html', `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Book a consultation | Arifa H</title><meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=contact.html"><link rel="canonical" href="contact.html">
<script>location.replace("contact.html")</script></head>
<body style="font-family:system-ui;background:#101827;color:#F4F1EA;padding:24px"><p>Moving to <a href="contact.html" style="color:#C5A477">Contact</a>…</p></body></html>
`);
console.log('done');
