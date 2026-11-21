// Interactions: fade-up reveal, mobile menu, service preselect, 3-step booking form (frontend only), certifications expand.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Fade up on first scroll into view */
const reveals = $$('[data-reveal]');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  reveals.forEach((el) => io.observe(el));
} else reveals.forEach((el) => el.classList.add('is-in'));

/* Mobile menu */
const menu = $('#menu'), menuBtn = $('.menu-btn');
const setMenu = (open) => { menu.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', String(open)); };
menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });

/* Certifications expand */
const certBtn = $('#certs-toggle'), more = $('#more-certs');
certBtn.addEventListener('click', () => {
  const open = more.hidden;
  more.hidden = !open;
  certBtn.setAttribute('aria-expanded', String(open));
  certBtn.textContent = open ? 'Show fewer' : 'View all 17';
});

/* Booking form */
const form = $('#booking-form'), service = $('#service'), dateSel = $('#date'), slots = $('#slots');
const dateFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

// Next 14 working days (Mon to Fri), starting tomorrow
(function fillDates() {
  const d = new Date(); d.setHours(12, 0, 0, 0);
  let n = 0;
  while (n < 14) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const o = document.createElement('option');
    o.value = d.toISOString().slice(0, 10); o.textContent = dateFmt.format(d);
    dateSel.append(o); n++;
  }
})();

// Sample slots, Gulf Standard Time
['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].forEach((t, i) => {
  const l = document.createElement('label'); l.className = 'slot';
  l.innerHTML = `<input type="radio" name="slot" value="${t}" ${i === 0 ? 'required' : ''}><span>${t}</span>`;
  slots.append(l);
});

// "Book this service" buttons preselect the service, then take you to the form
$$('[data-service]').forEach((b) => b.addEventListener('click', () => {
  service.value = b.dataset.service;
  clearErr(service);
  $('#booking').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  setTimeout(() => service.focus({ preventScroll: true }), 350);
}));

const errBox = (el) => document.getElementById(el.id + '-err') || document.getElementById(el.name + '-err');
function setErr(el, msg) { const b = errBox(el); if (b) b.textContent = msg; if (el.type !== 'radio') el.setAttribute('aria-invalid', 'true'); }
function clearErr(el) { const b = errBox(el); if (b) b.textContent = ''; el.removeAttribute('aria-invalid'); }

const checks = [
  [service, (e) => e.value ? '' : 'Please choose a service.'],
  [dateSel, (e) => e.value ? '' : 'Please choose a date.'],
  [$('#name'), (e) => e.value.trim() ? '' : 'Please enter your name.'],
  [$('#email'), (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.value.trim()) ? '' : 'Please enter a valid email address.'],
  [$('#consent'), (e) => e.checked ? '' : 'Please tick to continue.']
];
checks.forEach(([el, fn]) => {
  const ev = el.type === 'checkbox' ? 'change' : 'blur';
  el.addEventListener(ev, () => { const m = fn(el); m ? setErr(el, m) : clearErr(el); });
  el.addEventListener('input', () => { if (el.getAttribute('aria-invalid')) { const m = fn(el); if (!m) clearErr(el); } });
  el.addEventListener('change', () => { if (el.getAttribute('aria-invalid') && !fn(el)) clearErr(el); });
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
