let el, timer;

/** Small status message used for demo-only actions. */
export function toast(message, ms = 4200) {
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = message;
  requestAnimationFrame(() => el.classList.add('is-on'));
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove('is-on'), ms);
}
