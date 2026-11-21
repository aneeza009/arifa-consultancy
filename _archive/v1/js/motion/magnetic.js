// Magnetic buttons + soft cursor ring. Desktop / fine pointer only; disabled for reduced motion.
import { reducedMotion, finePointer } from '../core/dom.js';

export function initMagnetic() {
  if (reducedMotion() || !finePointer()) return;
  // Event delegation so buttons injected later (action bar, header CTA) work too.
  let active = null;
  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest?.('[data-magnetic]');
    if (active && active !== el) { active.style.transform = ''; active = null; }
    if (!el) return;
    active = el;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    el.style.transform = `translate3d(${(dx * 14).toFixed(1)}px, ${(dy * 10).toFixed(1)}px, 0)`;
  }, { passive: true });
  document.addEventListener('pointerleave', () => { if (active) { active.style.transform = ''; active = null; } }, true);
}

export function initCursor() {
  if (reducedMotion() || !finePointer()) return;
  const ring = document.createElement('div');
  ring.className = 'cursor'; ring.setAttribute('aria-hidden', 'true');
  ring.innerHTML = '<span class="cursor__in"></span>';
  document.body.appendChild(ring);
  let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
  const loop = () => {
    rx += (x - rx) * 0.2; ry += (y - ry) * 0.2;
    ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
    raf = (Math.abs(x - rx) + Math.abs(y - ry) > 0.3) ? requestAnimationFrame(loop) : 0;
  };
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    ring.classList.add('is-on');
    ring.classList.toggle('is-link', !!e.target.closest?.('a, button, [role="button"], input, label, .vc'));
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.addEventListener('mouseleave', () => ring.classList.remove('is-on'));
}
