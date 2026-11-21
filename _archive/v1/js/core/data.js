// Loads /data/*.json once and caches the promise.
const cache = new Map();

export function getJSON(name) {
  if (!cache.has(name)) {
    cache.set(name, fetch(`data/${name}.json`).then((r) => {
      if (!r.ok) throw new Error(`Could not load data/${name}.json (${r.status})`);
      return r.json();
    }));
  }
  return cache.get(name);
}

export const getSite = () => getJSON('site');
export const getProfile = () => getJSON('profile');
export const getPosts = () => getJSON('posts');
export const getTestimonials = () => getJSON('testimonials');
export const getImages = () => getJSON('images').then((list) => Object.fromEntries(list.map((i) => [i.id, i])));
