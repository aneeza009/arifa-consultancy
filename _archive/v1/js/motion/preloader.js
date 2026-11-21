// Handwriting preloader: script "Arifa" draws itself, four circles drift in and overlap, hero opens.
// Once per session, skippable, never runs for reduced-motion users.
import { $, reducedMotion, store } from '../core/dom.js';
import { gsapWithin } from '../core/gsap.js';

const COLORS = ['#C78E7C', '#A9A268', '#5F9A92', '#8E8A99']; // soul, mind, body, career

export function shouldPreload() {
  return !reducedMotion() && !store.get('preloaded');
}

/** Resolves when the preloader has finished (or immediately if it does not run). */
export async function runPreloader() {
  const root = document.documentElement;
  const el = $('#preloader');
  const finish = () => { root.classList.remove('preloading'); if (el) el.hidden = true; store.set('preloaded', '1'); };
  if (!el || !root.classList.contains('preloading') || document.hidden) { finish(); return; }
  store.set('preloaded', '1'); // once per session, even if the visitor navigates away mid-animation
  // GSAP loads from the CDN in parallel; if it is not here within 1.4 s, skip the animation rather than make people wait.
  const g = await gsapWithin(1400);
  if (!g) { finish(); return; }

  return new Promise((resolve) => {
    const offs = [[-44, -44], [44, -44], [-44, 44], [44, 44]];
    const far = [[-160, -110], [160, -110], [-160, 110], [160, 110]];
    el.innerHTML = `
      <svg class="preloader__svg" viewBox="0 0 400 260" role="img" aria-label="Arifa — loading">
        <g transform="translate(200 120)">
          ${COLORS.map((c, i) => `<circle class="preloader__circle" r="62" cx="${offs[i][0]}" cy="${offs[i][1]}" fill="${c}" fill-opacity=".62"/>`).join('')}
        </g>
        <text class="preloader__script" x="200" y="150" text-anchor="middle">Arifa</text>
        <text x="200" y="236" text-anchor="middle" fill="#D9B98B" font-size="11" letter-spacing="5" font-family="Jost, sans-serif" class="preloader__sub" opacity="0">RRIFZ</text>
      </svg>
      <button class="preloader__skip" type="button">Skip</button>`;

    let ended = false;
    const end = () => {
      if (ended) return; ended = true;
      tl.kill();
      // CSS fade (not GSAP) so the page always opens, even if the animation ticker is throttled.
      el.style.transition = 'opacity .55s cubic-bezier(.22,1,.36,1)';
      el.style.opacity = '0';
      setTimeout(() => { finish(); resolve(); }, 580);
    };
    $('.preloader__skip', el).addEventListener('click', end);
    el.addEventListener('click', end);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') end(); }, { once: true });

    const circles = el.querySelectorAll('.preloader__circle');
    const script = $('.preloader__script', el);
    const tl = g.timeline();
    circles.forEach((c, i) => {
      tl.fromTo(c, { attr: { cx: far[i][0], cy: far[i][1] }, opacity: 0 }, { attr: { cx: offs[i][0], cy: offs[i][1] }, opacity: 1, duration: 1.0, ease: 'power3.out' }, 0.05 + i * 0.06);
    });
    // Wait for the script font so the stroke follows the real glyphs (900 ms cap), then write it.
    const fontReady = document.fonts?.load ? Promise.race([document.fonts.load('120px Allura', 'Arifa'), new Promise((r) => setTimeout(r, 900))]) : Promise.resolve();
    fontReady.then(() => {
      if (ended) return;
      g.timeline({ onComplete: () => g.delayedCall(0.3, end) })
        .to(script, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0)
        .to(script, { fillOpacity: 1, duration: 0.4, ease: 'power1.out' }, 0.65)
        .to('.preloader__sub', { opacity: 1, duration: 0.4 }, 0.8);
    });
    setTimeout(end, 3500); // hard stop
  });
}
