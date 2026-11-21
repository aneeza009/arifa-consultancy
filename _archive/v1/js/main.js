// Entry point: loads site data, builds the shell, starts motion, then the page module.
import { $, reducedMotion } from './core/dom.js';
import { getSite } from './core/data.js';
import { hydratePhotos } from './core/img.js';
import { buildShell } from './shell/shell.js';
import { mountTimeChips } from './shell/timechip.js';
import { initReveal, initCountUp, initParallax } from './motion/reveal.js';
import { initMagnetic, initCursor } from './motion/magnetic.js';
import { initTransitions } from './motion/transition.js';
import { runPreloader } from './motion/preloader.js';
import { loadGsap } from './core/gsap.js';

const page = document.body.dataset.page || 'default';
const root = document.documentElement;

async function boot() {
  loadGsap(); // non-blocking: scenes and the preloader pick it up when it arrives
  // Start everything in parallel: site data + page module (no serial waterfall).
  // Pages that render data declare <body data-module>; static/stub pages skip the request (no 404 noise).
  const pageModule = document.body.hasAttribute('data-module') ? import(`./pages/${page}.js`).catch(() => null) : Promise.resolve(null);
  const site = await getSite();
  buildShell(site, page);
  initTransitions();
  initMagnetic();
  initCursor();

  // Page module (renders data-driven sections). Missing module = static page, which is fine.
  let pageReady = Promise.resolve();
  try {
    const mod = await pageModule;
    if (mod?.init) pageReady = mod.init({ site, page });
  } catch (err) { console.error(err); }

  await Promise.allSettled([pageReady, hydratePhotos()]);
  mountTimeChips();
  initReveal();
  initCountUp();
  initParallax();

  // Preloader (first visit per session) → then open the hero.
  await runPreloader();
  root.classList.add('is-ready');
  const hv = $('#hero-venn');
  if (hv) requestAnimationFrame(() => hv.classList.add('venn-in'));
  loadGsap().then((g) => { if (g) window.ScrollTrigger.refresh(); });
}

boot().catch((err) => {
  console.error(err);
  root.classList.remove('preloading', 'wipe-in'); root.classList.add('is-ready');
});
