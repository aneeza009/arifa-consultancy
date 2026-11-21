// HOME page: renders the data-driven sections and wires the interactive ones.
import { $, $$, esc, ARROW, reducedMotion } from '../core/dom.js';
import { getPosts, getTestimonials, getImages } from '../core/data.js';
import { photo } from '../core/img.js';
import { mountVenn } from '../components/venn.js';
import { mountSlider } from '../components/slider.js';
import { gratuity, aed } from '../lib/gratuity.js';
import { loadGsap } from '../core/gsap.js';

export async function init({ site }) {
  const [images, posts, testimonials] = await Promise.all([getImages(), getPosts(), getTestimonials()]);
  const pillars = site.pillars;

  renderSorter(site);
  renderTrust(site);
  renderDoors(site, images);
  mountHeroVenn(pillars);
  mountFramework(pillars, images);
  renderRights(site, posts);
  renderVoices(testimonials);
  renderIndustries(site);
  renderJournal(posts, images, site);
  initMiniCalc();
  scenes();
}

/* ---------- renderers ---------- */
function renderSorter(site) {
  $('#sorter').innerHTML = site.sorter.map((s) => `<li><a href="${s.href}">${esc(s.label)}</a></li>`).join('');
}

function renderTrust(site) {
  $('#trust-list').innerHTML = site.trust.map((t) =>
    `<li>${t.count ? `<b data-count="${t.count}">${t.count}</b>` : ''}<span>${esc(t.text)}</span></li>`).join('');
}

function renderDoors(site, images) {
  $('#doors-stack').innerHTML = site.doors.map((d, i) => `
    <article class="door" style="--k:${i}">
      <div class="door__body">
        <span class="door__n">${d.n}</span>
        <h3 class="door__t">${esc(d.title)}</h3>
        <p class="door__p">${esc(d.promise)}</p>
        <a class="btn btn--ink" data-magnetic href="${d.href}">${esc(d.cta)} ${ARROW}</a>
      </div>
      ${photo(images[d.img], { w: 900, h: 700, cls: 'photo--soft', sizes: '(min-width: 900px) 40vw, 100vw' })}
    </article>`).join('');
}

function mountHeroVenn(pillars) {
  mountVenn($('#hero-venn'), { pillars, caption: $('#hero-cap'), parallax: true, scrollDrift: true });
}

function mountFramework(pillars, images) {
  const panel = $('#fw-panel');
  const wrap = $('#fw-venn');
  const pills = `<div class="pillars" role="group" aria-label="Choose a circle">${pillars.map((p) =>
    `<button type="button" class="pill" data-p="${p.id}" aria-pressed="false" style="--c:var(--${p.id})"><i></i>${esc(p.name)}</button>`).join('')}</div>`;
  panel.innerHTML = `${pills}<div class="pcard" id="pcard"></div>`;
  const card = $('#pcard');
  const intro = () => {
    card.innerHTML = `<h3>At the centre: <em>you.</em></h3><p class="lead muted">Tap a circle, or choose one above, to see what it asks. These are the same questions you meet in the Wheel of Life quiz.</p>`;
  };
  intro();

  const v = mountVenn(wrap, { pillars, caption: $('#fw-cap'), select: true, parallax: false, onSelect: (id) => {
    $$('.pill', panel).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === id)));
    if (!id) { intro(); return; }
    const p = pillars.find((x) => x.id === id);
    card.classList.remove('pcard__fade'); void card.offsetWidth; card.classList.add('pcard__fade');
    card.innerHTML = `${photo(images[p.img], { w: 800, h: 450, cls: 'photo--soft', sizes: '(min-width: 960px) 40vw, 100vw' })}
      <h3>${esc(p.name)}</h3><p class="muted lead">${esc(p.summary)}</p>
      <div><p class="label" style="color:var(--brass);margin-bottom:10px">Questions this circle asks</p><ul>${p.asks.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>`;
  } });
  panel.addEventListener('click', (e) => {
    const b = e.target.closest('.pill'); if (!b) return;
    v.setActive(v.active === b.dataset.p ? null : b.dataset.p);
  });
  // Mobile: tapping the caption area should not leave stale text
  $('#fw-cap').textContent = 'Select a circle to explore it.';
}

function statusTag(site, status) {
  const lc = site.lastChecked;
  if (status === 'verified') return `<span class="tag tag--ok">Last checked ${lc.verified}</span>`;
  if (status === 'mixed') return `<span class="tag">Notice rules checked ${lc.verified} · probation: ${lc.pending}</span>`;
  return `<span class="tag">Last checked: ${lc.pending}</span>`;
}

function renderRights(site, posts) {
  const want = ['sick-leave-uae-explained', 'late-salary-wps-2026', 'national-day-2026-private-sector'];
  $('#rights-cards').innerHTML = want.map((slug, i) => posts.find((p) => p.slug === slug)).filter(Boolean).map((p, i) => `
    <a class="rcard" href="post.html?slug=${p.slug}" data-reveal style="--i:${i}">
      <div class="rcard__meta">${statusTag(site, p.status)}<span class="muted" style="font-size:13px">${p.readMin} min</span></div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.excerpt)}</p>
      <span class="link-arrow">Read the guide ${ARROW}</span>
    </a>`).join('');
}

function renderVoices(list) {
  const items = list.filter((t) => t.short);
  $('#voices-stage').innerHTML = items.map((t) => `
    <figure class="slide vq">
      <blockquote>${t.text.map((p, i) => `<p>${i === 0 ? '“' : ''}${esc(p)}${i === t.text.length - 1 ? '”' : ''}</p>`).join('')}</blockquote>
      <footer><b>${esc(t.name)}</b><span>${esc(t.role)}</span><span>${esc(t.date)} · ${esc(t.rel)}</span></footer>
      <span class="tag">From LinkedIn · permission pending</span>
    </figure>`).join('');
  mountSlider($('#voices-slider'));
}

function renderIndustries(site) {
  const row = site.industries.map((n) => `<span class="marquee__item" role="listitem">${esc(n)}</span>`).join('');
  const dup = site.industries.map((n) => `<span class="marquee__item" aria-hidden="true">${esc(n)}</span>`).join('');
  $('#industries').innerHTML = `<div class="marquee__track">${row}${dup}</div>`;
}

function renderJournal(posts, images, site) {
  const feat = posts.filter((p) => p.featured).slice(0, 3);
  $('#journal-cards').innerHTML = feat.map((p, i) => `
    <a class="card" href="post.html?slug=${p.slug}" data-reveal style="--i:${i}">
      <div class="card__img">${photo(images[p.cover], { w: 900, h: 600, cls: 'photo--soft', sizes: '(min-width: 760px) 30vw, 100vw' })}</div>
      <div class="card__meta"><span class="tag">${esc(p.category)}</span><span>${p.readMin} min read</span>${p.status === 'draft' ? '<span class="tag">Draft for Arifa</span>' : ''}</div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.excerpt)}</p>
    </a>`).join('');
}

/* ---------- gratuity mini-demo (Content Pack E, Tool 1) ---------- */
function initMiniCalc() {
  const basic = $('#calc-basic'), years = $('#calc-years'), out = $('#calc-out'), bar = $('#calc-bar'), cap = $('#calc-cap');
  const run = () => {
    const r = gratuity({ basic: parseFloat(basic.value), years: parseFloat(years.value) });
    if (!r.valid) { out.innerHTML = '—<small>Enter your basic wage and years of service.</small>'; bar.style.transform = 'scaleX(0)'; cap.textContent = ''; return; }
    if (!r.eligible) { out.innerHTML = '—<small>Usually not eligible under one year of continuous service; check your contract.</small>'; bar.style.transform = 'scaleX(0)'; cap.textContent = ''; return; }
    out.innerHTML = `≈ ${aed(r.total)}<small>Daily wage ${aed(r.daily)} · based on basic wage only${r.capped ? ' · <b>capped at two years’ wage</b>' : ''}</small>`;
    bar.style.transform = `scaleX(${Math.min(1, r.total / r.cap).toFixed(3)})`;
    cap.textContent = `Cap (two years’ wage): ${aed(r.cap)}`;
  };
  $('#mini-calc').addEventListener('submit', (e) => e.preventDefault());
  [basic, years].forEach((el) => el.addEventListener('input', run));
  run();
}

/* ---------- GSAP scene: the four circles converge as the framework section scrolls in ---------- */
async function scenes() {
  if (reducedMotion()) return;
  const g = await loadGsap();
  if (!g) return;
  const groups = $$('#fw-venn .vc');
  const spread = { soul: [-110, -90], mind: [110, -90], body: [-110, 90], career: [110, 90] };
  groups.forEach((el) => {
    const [x, y] = spread[el.dataset.p];
    g.fromTo(el, { x, y }, { x: 0, y: 0, ease: 'none', scrollTrigger: { trigger: '#fw-venn-wrap', start: 'top 92%', end: 'center 55%', scrub: 0.7 } });
  });
}
