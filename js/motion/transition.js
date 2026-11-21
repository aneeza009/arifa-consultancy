// Circle-wipe page transition. A circle expands from the clicked element, then the next page
// reveals by shrinking the same circle back to the click point. transform only.
import { reducedMotion, store, $ } from '../core/dom.js';

export function initTransitions() {
  const wipe = $('.wipe');
  if (!wipe) return;

  // Arrival: head script has already painted the cover (html.wipe-in). Shrink it away.
  const arrive = () => {
    if (!document.documentElement.classList.contains('wipe-in')) return;
    wipe.classList.add('is-in');
    requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.remove('wipe-in')));
    setTimeout(() => { wipe.classList.remove('is-in'); }, 1000);
  };
  arrive();

  // bfcache restore: make sure no cover is stuck on screen
  window.addEventListener('pageshow', (e) => { if (e.persisted) { wipe.classList.remove('is-out', 'is-in'); document.documentElement.classList.remove('wipe-in'); } });

  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== '_self') return;
    if (a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return; // in-page anchor
    if (url.pathname === location.pathname && url.search === location.search) return;
    if (reducedMotion()) return; // plain navigation

    e.preventDefault();
    const r = a.getBoundingClientRect();
    const x = e.clientX || r.left + r.width / 2, y = e.clientY || r.top + r.height / 2;
    const col = a.dataset.wipe || (a.classList.contains('btn') && !a.classList.contains('btn--ghost') && !a.classList.contains('btn--ink') ? '#9E5A43' : '#2A3837');
    wipe.style.setProperty('--wx', `${x}px`);
    wipe.style.setProperty('--wy', `${y}px`);
    wipe.style.setProperty('--wipe', col);
    store.set('wipe', JSON.stringify({ x, y, c: col }));
    wipe.classList.add('is-out');
    let done = false;
    const go = () => { if (done) return; done = true; location.href = a.href; };
    wipe.addEventListener('transitionend', go, { once: true });
    setTimeout(go, 800);
  });
}
