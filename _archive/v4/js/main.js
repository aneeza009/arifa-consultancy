// Entry point: loads site data, builds the shell, runs the page module, starts scroll reveals.
import { getSite } from './core/data.js';
import { hydratePhotos } from './core/img.js';
import { buildShell } from './shell/shell.js';
import { initReveal, initCountUp, initParallax } from './motion/reveal.js';

const page = document.body.dataset.page || 'default';
const root = document.documentElement;

async function boot() {
  const pageModule = document.body.hasAttribute('data-module') ? import(`./pages/${page}.js`).catch((e) => { console.error(e); return null; }) : Promise.resolve(null);
  const site = await getSite();
  buildShell(site, page);

  let pageReady = Promise.resolve();
  const mod = await pageModule;
  if (mod?.init) pageReady = mod.init({ site, page });

  await Promise.allSettled([pageReady, hydratePhotos()]);
  initReveal();
  initCountUp();
  initParallax();

  root.classList.add('is-ready');
  const hv = document.getElementById('hero-venn');
  if (hv) requestAnimationFrame(() => hv.classList.add('venn-in'));
}

boot().catch((err) => {
  console.error(err);
  root.classList.add('is-ready');
});
