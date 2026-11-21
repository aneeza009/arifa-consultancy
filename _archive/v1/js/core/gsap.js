// GSAP + ScrollTrigger from CDN, loaded without blocking first render. Used by only 3 scenes:
//   1) preloader  2) Home: four circles converge  3) About: scroll-drawn timeline.
// Every consumer must cope with `null` (CDN blocked / offline): the site works without it.
import { loadScript } from './dom.js';

const GSAP = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
const ST = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';

let promise;
export function loadGsap() {
  if (!promise) {
    promise = (async () => {
      try {
        await loadScript(GSAP);
        await loadScript(ST);
        window.gsap.registerPlugin(window.ScrollTrigger);
        return window.gsap;
      } catch { return null; }
    })();
  }
  return promise;
}

/** Resolves with gsap, or null if it is not ready within `ms`. */
export function gsapWithin(ms) {
  return Promise.race([loadGsap(), new Promise((r) => setTimeout(() => r(null), ms))]);
}
