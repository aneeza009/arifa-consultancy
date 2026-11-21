// Shared site shell: demo ribbon, sticky header, mobile menu, footer, smart action bar, WhatsApp button.
import { $, $$, esc, ARROW } from '../core/dom.js';
import { toast } from './toast.js';

const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.5A9.93 9.93 0 1 0 12.04 2Zm0 18.1c-1.5 0-2.97-.4-4.25-1.17l-.3-.18-3.1.89.9-3.02-.2-.31a8.1 8.1 0 1 1 6.95 3.79Zm4.45-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.2-.72-.64-1.2-1.43-1.35-1.67-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.47-.4-.4-.55-.41h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z"/></svg>';

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
      <a class="btn btn--sm hdr__cta" data-magnetic href="${site.cta.href}">${esc(site.cta.short)}</a>
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
  buildActionBar(site, page);
  buildWhatsApp(site);
}

function buildFooter(site) {
  const f = $('#site-footer');
  f.className = 'footer';
  const doors = site.doors.map((d) => `<li><a href="${d.href}">${esc(d.title)}</a></li>`).join('');
  f.innerHTML = `
    <div class="container">
      <div class="footer__top">
        <div>
          <a class="logo" href="index.html"><span class="logo__script">Arifa</span><span class="logo__sub">RRIFZ</span><span class="sr-only"> — home</span></a>
          <p class="footer__lead">${esc(site.brand.tagline)}</p>
          <div style="margin-top:22px" data-timechip></div>
        </div>
        <div class="footer__cols">
          <div><h2>Three doors</h2><ul>${doors}<li><a href="tools.html">Free Tools</a></li><li><a href="journal.html">Journal</a></li></ul></div>
          <div><h2>Contact</h2><ul>
            <li><a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a></li>
            <li>${esc(site.contact.location)}</li>
            <li><a href="${site.contact.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><span class="needs">WhatsApp [NEEDS ARIFA]</span></li>
            <li><a href="book.html">Book a free call</a></li>
          </ul></div>
          <div>
            <h2>The Rights Brief</h2>
            <form class="news" novalidate>
              <label class="sr-only" for="news-email">Email address</label>
              <div class="news__row"><input id="news-email" type="email" placeholder="Your email" autocomplete="email" required><button class="btn btn--sm" type="submit">Join</button></div>
              <small>Demo form — nothing is sent or stored.</small>
            </form>
          </div>
        </div>
      </div>
      <div class="footer__legal">
        <p>${esc(site.disclaimerShort)}</p>
        <div class="footer__legal-row">
          <span>© 2026 RRIFZ — Transformation Life Coaching by Arifa · Photography via Unsplash contributors · This demo uses no tracking.</span>
          <span><a href="privacy.html">Privacy</a> · <a href="disclaimer.html">Disclaimer</a> · <a href="credits.html">Credits</a> · Website by <a href="https://sorix.co" target="_blank" rel="noopener">Sorix.Co</a></span>
        </div>
      </div>
    </div>`;
  const form = $('.news', f);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('input', form);
    if (!input.value || !input.checkValidity()) { input.focus(); toast('Please enter a valid email address.'); return; }
    toast(`Thank you. In the live site this would join "The Rights Brief".`);
    form.reset();
  });
}

function buildActionBar(site, page) {
  const cfg = site.actionBar[page] || site.actionBar.default;
  const bar = document.createElement('aside');
  bar.className = 'abar';
  bar.setAttribute('aria-label', 'Quick action');
  bar.innerHTML = `<p>${esc(cfg.text)}</p><div class="abar__r"><a class="btn" data-magnetic href="${cfg.href}">${esc(cfg.label)} ${ARROW}</a><button class="abar__x" type="button" aria-label="Dismiss">×</button></div>`;
  document.body.appendChild(bar);
  let dismissed = false, footerVisible = false;
  const update = () => {
    const on = !dismissed && !footerVisible && window.scrollY > window.innerHeight * 0.85;
    bar.classList.toggle('is-on', on);
    document.body.classList.toggle('bar-on', on);
    bar.querySelectorAll('a, button').forEach((el) => { el.tabIndex = on ? 0 : -1; });
    bar.setAttribute('aria-hidden', String(!on));
  };
  $('.abar__x', bar).addEventListener('click', () => { dismissed = true; update(); });
  window.addEventListener('scroll', update, { passive: true });
  const foot = $('#site-footer');
  if ('IntersectionObserver' in window && foot) {
    new IntersectionObserver((es) => { footerVisible = es[0].isIntersecting; update(); }).observe(foot);
  }
  update();
}

function buildWhatsApp() {
  const a = document.createElement('a');
  a.className = 'wa';
  a.href = 'book.html#whatsapp';
  a.setAttribute('aria-label', 'WhatsApp (number to be supplied)');
  a.innerHTML = `${WA_ICON}<span class="wa__tip">WhatsApp — [NEEDS ARIFA] number</span>`;
  a.addEventListener('click', (e) => {
    e.preventDefault();
    toast('Demo: WhatsApp number is [NEEDS ARIFA]. In the live site this opens a chat.');
  });
  document.body.appendChild(a);
}
