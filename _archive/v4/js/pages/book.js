// BOOK: frontend-only 3-step booking form. Nothing is sent anywhere.
import { $, $$ } from '../core/dom.js';

export function init({ site }) {
  const form = $('#booking-form'), service = $('#service'), dateSel = $('#date'), slots = $('#slots');

  site.services.forEach((s) => service.insertAdjacentHTML('beforeend', `<option value="${s.id}">${s.name}</option>`));
  const pre = new URLSearchParams(location.search).get('service');
  if (pre && [...service.options].some((o) => o.value === pre)) service.value = pre;

  // Next 14 working days (Mon to Fri), starting tomorrow
  const fmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const d = new Date(); d.setHours(12, 0, 0, 0);
  for (let n = 0; n < 14;) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    dateSel.insertAdjacentHTML('beforeend', `<option value="${d.toISOString().slice(0, 10)}">${fmt.format(d)}</option>`); n++;
  }
  ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].forEach((t, i) => {
    slots.insertAdjacentHTML('beforeend', `<label class="slot"><input type="radio" name="slot" value="${t}" ${i === 0 ? 'required' : ''}><span>${t}</span></label>`);
  });

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
  });
}
