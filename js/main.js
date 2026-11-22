// Arifa H. site: header, mobile menu, reveals, hero parallax, service details, FAQ, booking modal (frontend only).
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Set to true once Arifa has approved publishing the LinkedIn recommendations in data/testimonials.json */
const TESTIMONIALS_APPROVED = false;

/* Header turns solid on scroll */
const hdr = $('#hdr');
let ticking = false;
function onScroll() {
  ticking = false;
  hdr.classList.toggle('is-solid', scrollY > 24);
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* Mobile menu */
const nav = $('#nav'), menuBtn = $('#menu-btn');
const setMenu = (open) => {
  nav.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('is-locked', open);
  if (innerWidth < 1000) hdr.classList.toggle('is-solid', open || scrollY > 24);
};
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.addEventListener('click', (e) => { if (e.target.closest('a, button')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });
matchMedia('(min-width: 1000px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

/* Scroll reveals */
const items = $$('[data-reveal]');
if ('IntersectionObserver' in window && !calm) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  items.forEach((el) => io.observe(el));
} else items.forEach((el) => el.classList.add('is-in'));

/* Service cards: Explore Service expands the details (who, problem, outcome, what you get) */
$$('[data-more]').forEach((b) => b.addEventListener('click', () => {
  const card = b.closest('.svc');
  const open = !card.classList.contains('is-open');
  card.classList.toggle('is-open', open);
  b.setAttribute('aria-expanded', String(open));
  b.textContent = open ? 'Show Less' : 'Explore Service';
}));

/* FAQ accordion */
$$('.acc button').forEach((b) => b.addEventListener('click', () => {
  const panel = document.getElementById(b.getAttribute('aria-controls'));
  const open = !panel.classList.contains('is-open');
  panel.classList.toggle('is-open', open);
  b.setAttribute('aria-expanded', String(open));
}));

/* Booking modal */
const modal = $('#modal'), form = $('#booking-form'), service = $('#service'), dateSel = $('#date'), slots = $('#slots');
const fmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
(function fillDates() {
  const d = new Date(); d.setHours(12, 0, 0, 0);
  for (let n = 0; n < 14;) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue; // sample working days Mon to Fri
    dateSel.insertAdjacentHTML('beforeend', `<option value="${d.toISOString().slice(0, 10)}">${fmt.format(d)}</option>`); n++;
  }
})();
['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].forEach((t, i) => {
  slots.insertAdjacentHTML('beforeend', `<label class="slot"><input type="radio" name="slot" value="${t}" ${i === 0 ? 'required' : ''}><span>${t}</span></label>`);
});

let opener = null;
function openBooking(id, from) {
  opener = from || null;
  if (id) { service.value = id; clearErr(service); }
  form.hidden = false; $('#done').hidden = true;
  if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
  document.body.classList.add('is-locked');
  setTimeout(() => (id ? dateSel : service).focus({ preventScroll: true }), 60);
}
function closeBooking() { modal.close ? modal.close() : modal.removeAttribute('open'); }
modal.addEventListener('close', () => { document.body.classList.remove('is-locked'); opener?.focus?.({ preventScroll: true }); });
modal.addEventListener('click', (e) => { if (e.target === modal) closeBooking(); });
$('#modal-x').addEventListener('click', closeBooking);
$('#done-close').addEventListener('click', closeBooking);
$$('[data-book]').forEach((b) => b.addEventListener('click', () => { if (nav.classList.contains('is-open')) setMenu(false); openBooking(b.dataset.book, b); }));

const errBox = (el) => document.getElementById(el.id + '-err');
const setErr = (el, m) => { errBox(el).textContent = m; el.setAttribute('aria-invalid', 'true'); };
const clearErr = (el) => { errBox(el).textContent = ''; el.removeAttribute('aria-invalid'); };
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
  $('#recap').textContent = `${service.selectedOptions[0].textContent} · ${dateSel.selectedOptions[0].textContent} · ${slot.value} GST`;
  form.hidden = true; $('#done').hidden = false; $('#done').focus();
  form.reset();
});

/* Recommendations: published only after Arifa approves */
if (TESTIMONIALS_APPROVED) {
  fetch('data/testimonials.json').then((r) => r.json()).then((list) => {
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    $('#t-list').innerHTML = list.filter((t) => t.short).map((t) => `<figure class="tq"><blockquote>“${esc(t.text[0])}”</blockquote><footer><strong>${esc(t.name)}</strong><br>${esc(t.role.split('|')[0].trim())}</footer></figure>`).join('');
    $('#testimonials').hidden = false;
  }).catch(() => {});
}

/* Mark the current page in the navigation */
(function markCurrent() {
  const here = location.pathname.split('/').pop() || 'index.html';
  $$('#nav a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === here || (/^service-/.test(here) && href === 'services.html')) a.setAttribute('aria-current', 'page');
  });
})();
