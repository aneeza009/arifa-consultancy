// Image system: builds <img> markup from images.json with width/height, srcset, lazy loading,
// teal overlay (CSS) and an onerror fallback to a brand-colour gradient.
import { getImages } from './data.js';
import { esc } from './dom.js';

const ONERROR = "this.onerror=null;var p=this.closest('.photo');if(p)p.classList.add('is-broken');this.remove()";

export function photoURL(img, w, h, q = 70) {
  return `${img.src}?auto=format&fit=crop&w=${w}&h=${h}&q=${q}`;
}

/** Returns an <img> tag string for an image record. */
export function imgTag(img, { w = 900, h = 600, sizes = '(min-width: 900px) 40vw, 100vw', eager = false, alt, q = 70 } = {}) {
  const widths = [Math.round(w * 0.5), w, Math.round(w * 1.6)];
  const srcset = widths.map((x) => `${photoURL(img, x, Math.round(x * h / w), q)} ${x}w`).join(', ');
  return `<img src="${photoURL(img, w, h, q)}" srcset="${srcset}" sizes="${esc(sizes)}" width="${w}" height="${h}" alt="${esc(alt ?? img.alt)}" ` +
    `${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="${ONERROR}">`;
}

/** Full <figure class="photo"> markup. */
export function photo(img, opts = {}) {
  const { w = 900, h = 600, cls = '' } = opts;
  if (!img) return `<span class="photo is-broken ${cls}" style="--ar:${w}/${h}"></span>`;
  return `<span class="photo ${cls}" style="--ar:${w}/${h}">${imgTag(img, opts)}</span>`;
}

/**
 * Hydrates static placeholders:  <span class="photo" data-photo="IMG-ID" data-w="900" data-h="600" data-sizes="…">
 * The placeholder already reserves its aspect-ratio, so there is no layout shift.
 */
export async function hydratePhotos(root = document) {
  const nodes = Array.from(root.querySelectorAll('[data-photo]'));
  if (!nodes.length) return;
  const images = await getImages();
  nodes.forEach((el) => {
    const img = images[el.dataset.photo];
    const w = Number(el.dataset.w || 900), h = Number(el.dataset.h || 600);
    el.classList.add('photo');
    el.style.setProperty('--ar', `${w}/${h}`);
    if (!img) { el.classList.add('is-broken'); return; }
    el.innerHTML = imgTag(img, { w, h, sizes: el.dataset.sizes || '(min-width: 900px) 40vw, 100vw', alt: el.dataset.alt, eager: el.dataset.eager === 'true' });
    el.removeAttribute('data-photo');
  });
}
