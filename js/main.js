// Interactions: fade-up reveal, audience switch, services accordion with image swap, "Book this service" preselect,
// 3-step booking card (frontend only), testimonial arrows, certifications expand, mobile menu.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const behavior = calm ? 'auto' : 'smooth';

/* Reveal on first view */
const targets = $$('[data-reveal], [data-img]');
if ('IntersectionObserver' in window && !calm) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
  targets.forEach((el) => io.observe(el));
} else targets.forEach((el) => el.classList.add('is-in'));

/* Mobile menu */
const menu = $('#menu'), menuBtn = $('.menu-btn');
const setMenu = (o) => { menu.classList.toggle('is-open', o); menuBtn.setAttribute('aria-expanded', String(o)); };
menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });

/* Audience switch (tabs) */
const tabs = $$('[role=tab]');
let swapTimer;
function selectTab(tab, focus) {
  if (tab.getAttribute('aria-selected') === 'true') return;
  const next = document.getElementById(tab.getAttribute('aria-controls'));
  const prev = $('.tabpanel.is-on');
  tabs.forEach((t) => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
  clearTimeout(swapTimer);
  const show = () => { if (prev) { prev.hidden = true; prev.classList.remove('is-on'); } next.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => next.classList.add('is-on'))); };
  if (prev && !calm) { prev.classList.remove('is-on'); swapTimer = setTimeout(show, 280); } else show();
  if (focus) tab.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(t));
  t.addEventListener('keydown', (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: tabs.length - 1 - i }[e.key];
    if (k === undefined) return; e.preventDefault();
    selectTab(tabs[(i + k + tabs.length) % tabs.length], true);
  });
});

/* Services accordion + image swap */
const items = $$('.acc__item');
const pics = $$('.svc-photo picture');
function setOpen(item, open) {
  item.classList.toggle('is-open', open);
  $('.acc__btn', item).setAttribute('aria-expanded', String(open));
}
function openService(id) {
  items.forEach((it) => setOpen(it, it.dataset.svc === id));
  pics.forEach((p) => p.classList.toggle('is-on', p.dataset.for === id));
}
items.forEach((it) => $('.acc__btn', it).addEventListener('click', () => {
  if (it.classList.contains('is-open')) { setOpen(it, false); return; }
  openService(it.dataset.svc);
}));

// Solutions row link: "See the service" opens that service and scrolls to it
$$('[data-open]').forEach((a) => a.addEventListener('click', (e) => {
  e.preventDefault();
  const id = a.dataset.open;
  openService(id);
  setTimeout(() => document.querySelector(`.acc__item[data-svc="${id}"]`).scrollIntoView({ behavior, block: 'start' }), 60);
}));
// Service "Solves" link: switch to the right audience and scroll to that problem
$$('[data-solve]').forEach((a) => a.addEventListener('click', (e) => {
  e.preventDefault();
  const [aud, id] = a.dataset.solve.split(':');
  selectTab(document.getElementById(aud === 'biz' ? 'tab-biz' : 'tab-ind'));
  setTimeout(() => document.getElementById(id).scrollIntoView({ behavior, block: 'center' }), calm ? 60 : 340);
}));

/* Booking card */
const form = $('#booking-form'), service = $('#service'), dateSel = $('#date'), slots = $('#slots');
const dateFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
(function fillDates() {
  const d = new Date(); d.setHours(12, 0, 0, 0);
  for (let n = 0; n < 14;) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue; // sample working days Mon to Fri
    const o = document.createElement('option');
    o.value = d.toISOString().slice(0, 10); o.textContent = dateFmt.format(d); dateSel.append(o); n++;
  }
})();
['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].forEach((t, i) => {
  const l = document.createElement('label'); l.className = 'slot';
  l.innerHTML = `<input type="radio" name="slot" value="${t}" ${i === 0 ? 'required' : ''}><span>${t}</span>`;
  slots.append(l);
});
function goBook(id, force) {
  if (id && (force || !service.value)) { service.value = id; clearErr(service); }
  $('#book').scrollIntoView({ behavior, block: 'start' });
  setTimeout(() => service.focus({ preventScroll: true }), calm ? 60 : 650);
}
$$('[data-service]').forEach((b) => b.addEventListener('click', () => goBook(b.dataset.service, true)));
$$('[data-book]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); setMenu(false); goBook(a.dataset.book, false); }));

const errBox = (el) => document.getElementById(el.id + '-err') || document.getElementById(el.name + '-err');
function setErr(el, m) { const b = errBox(el); if (b) b.textContent = m; if (el.type !== 'radio') el.setAttribute('aria-invalid', 'true'); }
function clearErr(el) { const b = errBox(el); if (b) b.textContent = ''; el.removeAttribute('aria-invalid'); }
const checks = [
  [service, (e) => e.value ? '' : 'Please choose a service.'],
  [dateSel, (e) => e.value ? '' : 'Please choose a date.'],
  [$('#name'), (e) => e.value.trim() ? '' : 'Please enter your name.'],
  [$('#email'), (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.value.trim()) ? '' : 'Please enter a valid email address.'],
  [$('#consent'), (e) => e.checked ? '' : 'Please tick to continue.']
];
checks.forEach(([el, fn]) => {
  el.addEventListener(el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'blur', () => { const m = fn(el); m ? setErr(el, m) : clearErr(el); });
  el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') && !fn(el)) clearErr(el); });
});
slots.addEventListener('change', () => { $('#slot-err').textContent = ''; });
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let first = null;
  checks.forEach(([el, fn]) => { const m = fn(el); if (m) { setErr(el, m); first ||= el; } else clearErr(el); });
  const slot = form.querySelector('input[name=slot]:checked');
  if (!slot) { $('#slot-err').textContent = 'Please choose a time.'; first ||= form.querySelector('input[name=slot]'); }
  if (first) { first.focus(); return; }
  const done = $('#done');
  $('#recap').textContent = `${service.selectedOptions[0].textContent} · ${dateSel.selectedOptions[0].textContent} · ${slot.value} GST`;
  form.hidden = true; done.hidden = false; done.focus();
});

/* Testimonial arrows */
const track = $('#track'), prev = $('#prev'), next = $('#next');
const quotes = $$('.quote', track);
let idx = 0;
const perView = () => (matchMedia('(min-width: 800px)').matches ? 2 : 1);
function slide() {
  const max = quotes.length - perView();
  idx = Math.max(0, Math.min(idx, max));
  const step = quotes[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
  track.style.transform = `translateX(${-idx * step}px)`;
  prev.disabled = idx === 0; next.disabled = idx >= max;
  quotes.forEach((q, i) => { q.inert = i < idx || i >= idx + perView(); q.setAttribute('aria-hidden', String(q.inert)); });
}
prev.addEventListener('click', () => { idx--; slide(); });
next.addEventListener('click', () => { idx++; slide(); });
addEventListener('resize', slide);
slide();

/* Certifications expand */
const certBtn = $('#certs-toggle'), more = $('#more-certs');
certBtn.addEventListener('click', () => {
  const o = !more.classList.contains('is-open');
  more.classList.toggle('is-open', o);
  certBtn.setAttribute('aria-expanded', String(o));
  certBtn.textContent = o ? 'Show fewer' : 'View all 17';
});
