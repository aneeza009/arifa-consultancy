// HOME: renders the data-driven sections (problems, services, steps, recommendations) and the hero circles.
import { $, esc, ARROW } from '../core/dom.js';
import { getTestimonials } from '../core/data.js';
import { mountVenn } from '../components/venn.js';
import { mountSlider } from '../components/slider.js';

export async function init({ site }) {
  const testimonials = await getTestimonials();
  mountVenn($('#hero-venn'), { pillars: site.pillars, caption: $('#hero-cap'), parallax: true, scrollDrift: false });
  $('#trust-list').innerHTML = site.trust.map((t) => `<li><span>${esc(t.text)}</span></li>`).join('');
  renderSolve(site);
  renderServices(site);
  $('#steps').innerHTML = site.steps.map((s) => `
    <li class="step" data-reveal><span class="step__n">${s.n}</span><h3>${esc(s.t)}</h3><p>${esc(s.p)}</p></li>`).join('');
  renderVoices(testimonials);
}

function renderSolve(site) {
  const nameOf = Object.fromEntries(site.services.map((s) => [s.id, s.name]));
  const col = (title, sub, rows) => `
    <div class="solve__col" data-reveal>
      <h3 class="solve__title">${title}</h3>
      <p class="solve__sub muted">${sub}</p>
      <ul class="solve__rows">${rows.map((r) => `
        <li class="solve__row">
          <p class="solve__q">${esc(r.q)}</p>
          <p class="solve__a">${esc(r.a)}</p>
          <a class="link-arrow" href="#svc-${r.service}">${esc(nameOf[r.service])} ${ARROW}</a>
        </li>`).join('')}</ul>
    </div>`;
  $('#solve-grid').innerHTML =
    col('For individuals', 'Employees, professionals and expats.', site.solve.individuals) +
    col('For businesses', 'Founders and growing UAE companies.', site.solve.businesses);
}

function renderServices(site) {
  $('#svc-list').innerHTML = site.services.map((s) => `
    <article class="svc" id="svc-${s.id}" data-reveal>
      <span class="svc__n">${s.n}</span>
      <div class="svc__main">
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.sum)}</p>
        ${s.note ? `<p class="svc__note">${esc(s.note)}</p>` : ''}
      </div>
      <div class="svc__get">
        <p class="label">What you get</p>
        <ul>${s.get.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
      </div>
      <div class="svc__meta">
        <p><span class="label">Best for</span>${esc(s.best)}</p>
        <p><span class="label">Format and duration</span>${esc(s.format)} <span class="tag">[SAMPLE]</span></p>
        <a class="btn btn--ink" href="book.html?service=${s.id}">Book this service</a>
      </div>
    </article>`).join('');
}

function renderVoices(list) {
  const items = list.filter((t) => t.short);
  $('#voices-stage').innerHTML = items.map((t) => `
    <figure class="slide vq">
      <blockquote>${t.text.map((p, i) => `<p>${i === 0 ? '“' : ''}${esc(p)}${i === t.text.length - 1 ? '”' : ''}</p>`).join('')}</blockquote>
      <footer><b>${esc(t.name)}</b><span>${esc(t.role)}</span><span>${esc(t.date)} · ${esc(t.rel)}</span></footer>
      <span class="tag">From LinkedIn · permission pending</span>
    </figure>`).join('');
  mountSlider($('#voices-slider'));
}
