// Shared site shell: demo ribbon, sticky header, mobile menu, footer.
import { $, $$, esc } from '../core/dom.js';

const here = () => location.pathname.split('/').pop() || 'index.html';

export function buildShell(site, page) {
  const cur = here();
  const navLinks = site.nav.map((n) => `<a href="${n.href}"${cur === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('');
  const menuLinks = site.nav.map((n, i) => `<a href="${n.href}" style="--i:${i}"${cur === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}<small>0${i + 1}</small></a>`).join('');

  const hdr = $('#site-header');
  hdr.className = 'hdr';
  hdr.innerHTML = `
    <div class="hdr__ribbon" role="note"><span><strong>Demo</strong> website by Sorix.Co — content is sample and for review.</span></div>
    <div class="hdr__bar"><div class="container hdr__inner">
      <a class="logo" href="index.html"><span class="logo__script">Arifa</span><span class="logo__sub">RRIFZ</span><span class="sr-only"> — home</span></a>
      <nav class="nav" aria-label="Main">${navLinks}</nav>
      <a class="btn btn--sm hdr__cta" href="${site.cta.href}">${esc(site.cta.short)}</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span><span></span><span></span></button>
    </div></div>`;

  const menu = document.createElement('div');
  menu.className = 'menu'; menu.id = 'menu';
  menu.setAttribute('aria-label', 'Menu'); menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-modal', 'true');
  menu.innerHTML = `
    <nav class="menu__list" aria-label="Mobile">${menuLinks}</nav>
    <div class="menu__foot">
      <a class="btn" href="${site.cta.href}">${esc(site.cta.label)}</a>
      <p>${esc(site.contact.email)} · ${esc(site.contact.location)}</p>
    </div>`;
  document.body.insertBefore(menu, hdr.nextSibling);

  const burger = $('.burger', hdr);
  let open = false;
  const setOpen = (v) => {
    open = v;
    hdr.classList.toggle('is-open', v);
    menu.classList.toggle('is-open', v);
    document.body.classList.toggle('is-locked', v);
    burger.setAttribute('aria-expanded', String(v));
    burger.setAttribute('aria-label', v ? 'Close menu' : 'Open menu');
    $$('a, button', menu).forEach((el) => { el.tabIndex = v ? 0 : -1; });
    if (v) $('a', menu).focus({ preventScroll: true });
  };
  setOpen(false);
  burger.addEventListener('click', () => setOpen(!open));
  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') { setOpen(false); burger.focus(); }
    if (e.key === 'Tab') { // focus trap between burger + menu items
      const items = [burger, ...$$('a', menu)];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  window.matchMedia('(min-width: 1080px)').addEventListener('change', (e) => { if (e.matches && open) setOpen(false); });

  // Shrink / hide ribbon on scroll (transform only)
  const onScroll = () => hdr.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  buildFooter(site);
}

function buildFooter(site) {
  const f = $('#site-footer');
  f.className = 'footer';
  const links = site.nav.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('');
  f.innerHTML = `
    <div class="container">
      <div class="footer__top">
        <div>
          <a class="logo" href="index.html"><span class="logo__script">Arifa</span><span class="logo__sub">RRIFZ</span><span class="sr-only"> — home</span></a>
          <p class="footer__lead">${esc(site.brand.tagline)}</p>
        </div>
        <div class="footer__cols">
          <div><h2>Explore</h2><ul>${links}</ul></div>
          <div><h2>Contact</h2><ul>
            <li><a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a></li>
            <li>${esc(site.contact.location)}</li>
            <li><a href="${site.contact.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><span class="needs">WhatsApp [NEEDS ARIFA]</span></li>
          </ul></div>
        </div>
      </div>
      <div class="footer__legal">
        <p>${esc(site.disclaimerShort)}</p>
        <div class="footer__legal-row">
          <span>© 2026 RRIFZ — Transformation Life Coaching by Arifa · Photography via Unsplash contributors</span>
          <span>Website by <a href="https://sorix.co" target="_blank" rel="noopener">Sorix.Co</a></span>
        </div>
      </div>
    </div>`;
}
