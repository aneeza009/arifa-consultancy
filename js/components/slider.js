// Accessible crossfade slider (testimonials). Auto-advance pauses on hover/focus and never runs for reduced-motion.
import { reducedMotion } from '../core/dom.js';

const CHEV_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
const CHEV_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

export function mountSlider(root, { interval = 9000 } = {}) {
  const slides = Array.from(root.querySelectorAll('.slide'));
  if (slides.length < 2) { slides[0]?.classList.add('is-active'); return; }
  const ctrl = document.createElement('div');
  ctrl.className = 'slider__ctrl';
  ctrl.innerHTML = `<button class="slider__btn" type="button" data-dir="-1" aria-label="Previous recommendation">${CHEV_L}</button>
    <div class="slider__dots">${slides.map((_, i) => `<button class="slider__dot" type="button" data-i="${i}" aria-label="Show recommendation ${i + 1}"></button>`).join('')}</div>
    <button class="slider__btn" type="button" data-dir="1" aria-label="Next recommendation">${CHEV_R}</button>`;
  root.appendChild(ctrl);
  const dots = Array.from(ctrl.querySelectorAll('.slider__dot'));
  let i = 0, timer = null, paused = false;

  const show = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', String(k !== i)); s.inert = k !== i; });
    dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
  };
  const start = () => { stop(); if (!reducedMotion() && !paused) timer = setInterval(() => show(i + 1), interval); };
  const stop = () => { clearInterval(timer); timer = null; };

  ctrl.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    show(b.dataset.dir ? i + Number(b.dataset.dir) : Number(b.dataset.i));
    start();
  });
  root.addEventListener('mouseenter', () => { paused = true; stop(); });
  root.addEventListener('mouseleave', () => { paused = false; start(); });
  root.addEventListener('focusin', () => { paused = true; stop(); });
  root.addEventListener('focusout', () => { paused = false; start(); });
  root.setAttribute('role', 'region');
  root.setAttribute('aria-roledescription', 'carousel');
  show(0); start();
}
