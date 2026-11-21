// Four-Circle Venn (Soul · Mind · Body · Career around "You").
// Layers per circle:  .vc (scroll scene / GSAP)  >  .vp (cursor parallax)  >  .vb (breathing).
import { reducedMotion, finePointer, clamp, esc } from '../core/dom.js';

const POS = { soul: [-70, -70], mind: [70, -70], body: [-70, 70], career: [70, 70] };
const LABEL = { soul: [-128, -150], mind: [128, -150], body: [-128, 158], career: [128, 158] };
const DEPTH = { soul: 1, mind: -0.7, body: -1, career: 0.8 };
const R = 118;

export function vennMarkup(pillars, { id = 'venn' } = {}) {
  const circles = pillars.map((p) => {
    const [x, y] = POS[p.id]; const [lx, ly] = LABEL[p.id];
    return `<g class="vc" data-p="${p.id}" tabindex="0" role="button" aria-pressed="false" aria-label="${esc(p.name)}: ${esc(p.line)}">
      <g class="vp"><g class="vb"><circle cx="${x}" cy="${y}" r="${R}"/></g></g>
      <text x="${lx}" y="${ly}" text-anchor="middle">${esc(p.name)}</text>
    </g>`;
  }).join('');
  return `<svg viewBox="-260 -200 520 410" role="group" aria-label="The four circles: Soul, Mind, Body and Career, around You" id="${id}">
    ${circles}
    <g class="venn__core" pointer-events="none"><circle class="venn__ring" r="42"/><text class="venn__you" text-anchor="middle" y="12">You</text></g>
  </svg>`;
}

/**
 * Mounts a Venn into `el`.
 * opts: { pillars, caption: HTMLElement|null, onSelect(pillarId|null), parallax: bool, scrollDrift: bool, select: bool }
 */
export function mountVenn(el, opts) {
  const { pillars, caption = null, onSelect = null, parallax = false, scrollDrift = false, select = false } = opts;
  el.innerHTML = vennMarkup(pillars);
  el.classList.add('venn');
  const svg = el.querySelector('svg');
  const groups = Array.from(el.querySelectorAll('.vc'));
  const byId = Object.fromEntries(pillars.map((p) => [p.id, p]));
  let active = null;

  const say = (text) => { if (caption) caption.textContent = text; };
  const setActive = (id) => {
    active = id;
    el.classList.toggle('has-active', !!id);
    groups.forEach((g) => { const on = g.dataset.p === id; g.classList.toggle('is-active', on); g.setAttribute('aria-pressed', String(on)); });
    if (onSelect) onSelect(id);
    say(id ? `${byId[id].name} — ${byId[id].line}` : '');
  };

  groups.forEach((g) => {
    const id = g.dataset.p;
    g.addEventListener('mouseenter', () => { if (!select) say(`${byId[id].name} — ${byId[id].line}`); });
    g.addEventListener('focus', () => { if (!select) say(`${byId[id].name} — ${byId[id].line}`); });
    g.addEventListener('mouseleave', () => { if (!select) say(''); });
    g.addEventListener('blur', () => { if (!select) say(''); });
    const choose = () => { if (select) setActive(active === id ? null : id); else say(`${byId[id].name} — ${byId[id].line}`); };
    g.addEventListener('click', choose);
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
  });

  // Cursor parallax + soft glow (fine pointer). Scroll-driven drift for touch devices.
  if (parallax && !reducedMotion()) {
    const area = el.closest('[data-venn-area]') || el;
    const move = (nx, ny) => {
      groups.forEach((g) => {
        const d = DEPTH[g.dataset.p];
        g.querySelector('.vp').style.transform = `translate(${(nx * 16 * d).toFixed(1)}px, ${(ny * 12 * d).toFixed(1)}px)`;
      });
    };
    if (finePointer()) {
      area.addEventListener('pointermove', (e) => {
        const r = area.getBoundingClientRect();
        const nx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
        const ny = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
        move(nx, ny);
        area.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(0)}px`);
        area.style.setProperty('--my', `${(e.clientY - r.top).toFixed(0)}px`);
      }, { passive: true });
      area.addEventListener('pointerleave', () => move(0, 0));
    }
    if (scrollDrift && !finePointer()) {
      let tick = false;
      window.addEventListener('scroll', () => {
        if (tick) return; tick = true;
        requestAnimationFrame(() => {
          tick = false;
          const p = clamp(window.scrollY / (window.innerHeight * 0.9), 0, 1);
          move(Math.sin(p * 3.2) * 0.9, p * 1.2 - 0.3);
          svg.style.transform = `rotate(${(p * 14).toFixed(1)}deg)`;
        });
      }, { passive: true });
    }
  }
  return { el, svg, groups, setActive, get active() { return active; } };
}
