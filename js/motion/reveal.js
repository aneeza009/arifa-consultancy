// Scroll reveals, count-ups and light parallax. transform / opacity only.
import { $$, reducedMotion, clamp } from '../core/dom.js';

export function initReveal(root = document) {
  const els = $$('[data-reveal]:not(.is-in)', root);
  if (!els.length) return;
  if (!('IntersectionObserver' in window) || reducedMotion()) { els.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((e) => io.observe(e));
}

/** <span data-count="400" data-suffix="+"> counts up once when visible. */
export function initCountUp(root = document) {
  const els = $$('[data-count]', root);
  const fmt = (el, v) => { el.textContent = `${Math.round(v).toLocaleString('en-GB')}${el.dataset.suffix || ''}`; };
  els.forEach((el) => {
    const target = Number(el.dataset.count);
    if (reducedMotion() || !('IntersectionObserver' in window)) { fmt(el, target); return; }
    fmt(el, 0);
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = clamp((t - t0) / dur, 0, 1);
        fmt(el, target * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
  });
}

/** [data-parallax="0.12"] — translateY driven by scroll position. Desktop + motion-OK only. */
export function initParallax(root = document) {
  if (reducedMotion()) return;
  const items = $$('[data-parallax]', root).map((el) => ({ el, k: Number(el.dataset.parallax) || 0.1 }));
  if (!items.length) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    items.forEach(({ el, k }) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const offset = (r.top + r.height / 2 - vh / 2) * -k;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
}
