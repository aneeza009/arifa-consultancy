// ABOUT page: story, timeline (scroll-drawn), credentials bento + filters, values, languages.
import { $, $$, esc, reducedMotion, clamp } from '../core/dom.js';
import { getProfile, getImages } from '../core/data.js';
import { photo } from '../core/img.js';
import { toast } from '../shell/toast.js';
import { loadGsap } from '../core/gsap.js';

export async function init({ site }) {
  const [profile, images] = await Promise.all([getProfile(), getImages()]);
  $('#story-body').innerHTML = profile.about.map((p) => `<p>${esc(p)}</p>`).join('');
  $('#expertise').innerHTML = profile.expertise.map((e) => `<li>${esc(e)}</li>`).join('');
  renderTimeline(profile);
  renderBento(profile, images);
  renderCerts(profile);
  renderBeyond(profile);
  $('#dl-profile').addEventListener('click', () => toast('Demo: a one-page profile PDF will be provided in the live site.'));
  timelineScene();
}

/* ---------- Timeline ---------- */
function renderTimeline(profile) {
  const allInd = new Set(profile.roles.flatMap((r) => r.industries));
  $('#tl-ind-total').textContent = String(allInd.size);
  const list = $('#tl-list');
  const items = profile.roles.map((r) => {
    const org = r.orgHidden && !profile.showCurrentEmployer
      ? '<span class="needs">Current employer — shown once Arifa confirms</span>' : esc(r.org);
    const meta = [r.type, r.place].filter(Boolean).join(' · ');
    const sub = r.sub ? `<div class="tl__sub">${r.sub.map((s) => `<span><b style="font-weight:500">${esc(s.title)}</b> — ${esc(s.dates)}</span>`).join('')}</div>` : '';
    let desc;
    if (!r.desc) desc = '<p><span class="needs">Role description [NEEDS ARIFA]</span></p>';
    else if (r.desc.length > 330) desc = `<p class="tl__desc is-clamped">${esc(r.desc)}</p><button class="tl__btn" type="button" aria-expanded="false">Read more</button>`;
    else desc = `<p class="tl__desc">${esc(r.desc)}</p>`;
    return `<li class="tl__item" data-year="${r.year}" data-ind="${esc(r.industries.join('|'))}">
      <span class="tl__dot" aria-hidden="true"></span>
      <span class="tl__dates">${esc(r.dates)}</span>
      <h3 class="tl__title">${esc(r.title)}</h3>
      <p class="tl__org">${org}</p>
      ${meta ? `<p class="tl__meta">${esc(meta)}</p>` : ''}
      ${sub}
      ${r.industries.length ? `<div class="tl__inds">${r.industries.map((i) => `<span class="tag">${esc(i)}</span>`).join('')}</div>` : ''}
      ${desc}
    </li>`;
  }).join('');
  list.insertAdjacentHTML('beforeend', items);
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.tl__btn'); if (!b) return;
    const p = b.previousElementSibling;
    const open = p.classList.toggle('is-clamped') === false;
    b.setAttribute('aria-expanded', String(open));
    b.textContent = open ? 'Show less' : 'Read more';
  });
}

function timelineScene() {
  const list = $('#tl-list'); if (!list) return;
  const items = $$('.tl__item', list);
  const yearEl = $('#tl-year'), indEl = $('#tl-ind');
  const seen = new Set();
  let shownYear = Number(items[0]?.dataset.year || 2026);
  let yearRun = 0;
  const setYear = (target) => {
    const run = ++yearRun;
    if (reducedMotion()) { yearEl.textContent = target; shownYear = target; return; }
    const from = shownYear, t0 = performance.now(), dur = 700;
    const tick = (t) => {
      if (run !== yearRun) return; // a newer role took over
      const p = clamp((t - t0) / dur, 0, 1);
      shownYear = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      yearEl.textContent = shownYear;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const refreshInd = (idx) => {
    seen.clear();
    items.slice(0, idx + 1).forEach((it) => it.dataset.ind && it.dataset.ind.split('|').forEach((i) => i && seen.add(i)));
    indEl.textContent = String(seen.size);
  };
  // Active role = the one crossing the middle of the viewport
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      const idx = items.indexOf(e.target);
      setYear(Number(e.target.dataset.year));
      refreshInd(idx);
    });
  }, { rootMargin: '-42% 0px -42% 0px' });
  const reveal = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); reveal.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  items.forEach((i) => { io.observe(i); reveal.observe(i); });
  refreshInd(0);

  // GSAP scene: the brass line draws down the page with scroll. Static (fully drawn) if GSAP is unavailable.
  const line = $('.tl__line', list);
  const makeStatic = () => { $('#timeline')?.classList.add('tl--static'); line.style.setProperty('--p', 1); };
  if (reducedMotion()) { makeStatic(); items.forEach((i) => i.classList.add('is-in')); return; }
  loadGsap().then((g) => {
    if (!g) { makeStatic(); return; }
    window.ScrollTrigger.create({ trigger: list, start: 'top 62%', end: 'bottom 62%', scrub: 0.4, onUpdate: (self) => line.style.setProperty('--p', self.progress.toFixed(4)) });
  });
}

/* ---------- Credentials bento ---------- */
function renderBento(profile, images) {
  const tex = (cls = '') => `<span class="tex" aria-hidden="true">${photo(images['IMG-TEX-02'], { w: 800, h: 600, sizes: '40vw', cls: 'photo--flat' })}</span>`;
  const [ctlc, chrp] = profile.certs.filter((c) => c.hl);
  const edu = profile.education.map((e) => `<li><b>${esc(e.school)}</b><span>${esc(e.what)}</span><span>${esc(e.years)} · ${esc(e.score)}</span></li>`).join('');
  $('#bento').innerHTML = `
    <article class="tile tile--hl tile--big" data-reveal>${tex()}<span class="tag">Highlight · ${esc(ctlc.d)}</span><h3>${esc(ctlc.t)}</h3><p class="tile__by">${esc(ctlc.by)}</p></article>
    <article class="tile tile--hl tile--big" data-reveal style="--i:1">${tex()}<span class="tag">Highlight · ${esc(chrp.d)}</span><h3>${esc(chrp.t)}</h3><p class="tile__by">${esc(chrp.by)}</p></article>
    <article class="tile tile--teal" data-reveal style="--i:2"><span class="stat" data-count="${profile.certs.length}">${profile.certs.length}</span><p class="small">certifications, from HR and coaching to AI and change</p></article>
    <article class="tile" data-reveal style="--i:3">${tex()}<span class="stat" data-count="400" data-suffix="+">400+</span><p class="small">employees supported across business units at Safe Line Group</p></article>
    <article class="tile tile--wide" data-reveal style="--i:2">${tex()}<p class="label">Award</p><h3 style="font-family:var(--font-head);font-weight:500;font-size:32px;line-height:1.1">${esc(profile.award.title)}</h3><p class="tile__by">${esc(profile.award.by)} · ${esc(profile.award.d)}</p></article>
    <article class="tile tile--wide" data-reveal style="--i:3"><p class="label">Education</p><ul class="edu">${edu}</ul></article>
    <article class="tile tile--wide tile--teal" data-reveal style="--i:2"><p class="label">Top skills</p><ul class="skills" style="--x:1">${profile.topSkills.map((s) => `<li style="background:rgba(248,244,236,.1)">${esc(s)}</li>`).join('')}</ul></article>
    <article class="tile tile--wide" data-reveal style="--i:3"><span class="stat" data-count="7">7</span><p class="small">industries led: ${profile.roles.flatMap((r) => r.industries).filter((v, i, a) => a.indexOf(v) === i).map(esc).join(' · ')}</p></article>`;
}

function renderCerts(profile) {
  const cats = ['All', ...Array.from(new Set(profile.certs.map((c) => c.cat)))];
  const filters = $('#cert-filters'), grid = $('#cert-grid');
  filters.innerHTML = cats.map((c, i) => `<button type="button" class="chip" data-cat="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join('');
  grid.innerHTML = profile.certs.map((c) => `<li class="cert${c.hl ? ' cert--hl' : ''}" data-cat="${esc(c.cat)}"><b>${esc(c.t)}</b><span>${esc(c.by)}</span><span>${esc(c.d)} · ${esc(c.cat)}</span></li>`).join('');
  filters.addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip', filters).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $$('.cert', grid).forEach((li) => {
      const show = b.dataset.cat === 'All' || li.dataset.cat === b.dataset.cat;
      li.hidden = !show;
      if (show) { li.style.animation = 'none'; void li.offsetWidth; li.style.animation = ''; }
    });
  });
}

function renderBeyond(profile) {
  $('#values').innerHTML = profile.values.map((v, i) => `<article class="vcard" data-reveal style="--i:${i}"><span class="n">0${i + 1}</span><h3>${esc(v.t)}</h3><p class="muted">${esc(v.p)}</p></article>`).join('');
  $('#langs').innerHTML = profile.languages.map((l) => `<li><div><b>${esc(l.name)}</b><br><span>${esc(l.level)}</span></div><span class="dots" aria-hidden="true">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= l.n ? 'on' : ''}"></i>`).join('')}</span></li>`).join('');
  $('#vol-causes').textContent = profile.volunteering.causes.join(' and ').toLowerCase();
  $('#vol-where').textContent = profile.volunteering.where;
}
