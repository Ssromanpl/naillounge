// Повторяющиеся блоки: карточки услуг и мастеров, список цен, галерея,
// отзывы, вопросы-ответы. Собраны здесь, чтобы страница оставалась
// перечнем блоков, а не простынёй разметки.
import { esc, url } from './layout.mjs';
import { icon } from './icons.mjs';
import { photo } from './photo.mjs';
import { site } from '../data/site.mjs';
import { priceLabel } from '../data/prices.mjs';
import { masterBySlug } from '../data/masters.mjs';

export const sectionHead = ({ kicker, title, lead, center = false, id = '' }) => `
<div class="section__head${center ? ' section__head--center' : ''}"${id ? ` id="${id}"` : ''}>
  ${kicker ? `<span class="kicker">${esc(kicker)}</span>` : ''}
  <h2>${esc(title)}</h2>
  ${lead ? `<p class="section__lead">${esc(lead)}</p>` : ''}
</div>`;

/**
 * Плашка скидки на первый визит. Включается галочкой в данных:
 * «Студия и контакты» → «Скидка на первый визит». Пока выключено, скидки
 * нет нигде на сайте — ни плашки, ни упоминаний в текстах. Так сделано
 * намеренно: обещание скидки, которой нет, клиент запомнит надолго.
 */
export const firstVisitOn = () => site.firstVisit.enabled === true;

export const firstVisitStrip = () =>
  firstVisitOn()
    ? `
<div class="strip">
  <span class="strip__badge">${icon('sparkle')}${esc(site.firstVisit.badge)}</span>
  <span class="strip__text">${esc(site.firstVisit.text)}</span>
</div>`
    : '';

/** Секция с плашкой целиком: выключили скидку — пустой секции не остаётся. */
export const firstVisitSection = () =>
  firstVisitOn()
    ? `
<section class="section section--tight">
  <div class="wrap">${firstVisitStrip()}</div>
</section>`
    : '';

export const serviceCard = (service, card, depth = 0) => `
<a class="svc" href="${url(service.slug + '.html', depth)}">
  ${photo({
    name: `service-${service.id}`,
    label: `Фото: ${service.title.toLowerCase()}`,
    alt: `${service.title} в студии nail.lounge`,
    w: 800,
    h: 600,
    depth,
    sizes: '(min-width: 900px) 360px, 100vw',
  })}
  <span class="svc__body">
    <span class="svc__title">${icon(service.icon)}${esc(service.title)}</span>
    <span class="svc__text">${esc(card.text)}</span>
    <span class="svc__foot">
      <span class="svc__price">${esc(card.priceHint)}</span>
      <span class="link">Подробнее ${icon('arrow')}</span>
    </span>
  </span>
</a>`;

export const masterCard = (master, depth = 0, { demo = false } = {}) => `
<article class="master" style="--card-accent: ${esc(master.accent || 'var(--accent)')}">
  ${photo({
    name: `master-${master.slug}`,
    label: `Фото: ${master.name}`,
    alt: `${master.name} — ${master.role.toLowerCase()}`,
    w: 600,
    h: 800,
    depth,
    sizes: '(min-width: 900px) 300px, 50vw',
  })}
  <div class="master__body">
    <h3 class="master__name">${esc(master.name)}</h3>
    <p class="master__role">${esc(master.role)}</p>
    <p class="master__text">${esc(master.card)}</p>
    ${demo && master.demo ? '<p class="note">Черновик: текст написан нами, мастер его ещё не подтвердил.</p>' : ''}
    <div class="master__actions">
      <button class="btn btn--primary btn--sm" type="button" data-book data-master="${esc(master.name)}">Записаться</button>
      <a class="btn btn--ghost btn--sm" href="${url('masters/' + master.slug + '.html', depth)}">Подробнее</a>
    </div>
  </div>
</article>`;

/** Одна позиция цены: название, длительность, стоимость. */
export const priceRow = (item) => `
<li>
  <span class="price__name">${esc(item.name)}${item.note ? `<span class="price__note">${esc(item.note)}</span>` : ''}</span>
  ${item.duration ? `<span class="price__dur">${icon('clock')}${esc(item.duration)}</span>` : ''}
  <span class="price__value${item.free ? ' price__value--free' : ''}">${esc(priceLabel(item))}</span>
</li>`;

export const priceGroup = (group) => `
<div class="pricegroup">
  <h3 class="pricegroup__title">${esc(group.title)}</h3>
  ${group.note ? `<p class="pricegroup__note">${esc(group.note)}</p>` : ''}
  <ul class="pricelist">
    ${group.items.map(priceRow).join('\n    ')}
  </ul>
</div>`;

export const priceCategory = (category) => `
<section class="pricecat" id="${esc(category.id)}">
  <h2>${esc(category.title)}</h2>
  ${category.lead ? `<p class="pricecat__lead">${esc(category.lead)}</p>` : ''}
  ${category.groups.map(priceGroup).join('\n  ')}
</section>`;

export const workItem = (work, i, depth = 0) => {
  const master = masterBySlug(work.master);
  const name = `work-${work.direction}-${i + 1}`;
  return `
<figure class="work" data-work data-direction="${esc(work.direction)}" data-master="${esc(work.master)}">
  ${photo({
    name,
    label: `Фото: ${work.title.toLowerCase()}`,
    alt: `${work.title}${master ? ', мастер ' + master.name : ''}`,
    w: 600,
    h: 600,
    depth,
    sizes: '(min-width: 1000px) 260px, 45vw',
  })}
  <figcaption>${esc(work.title)}${master ? ` · <span class="work__master">${esc(master.name)}</span>` : ''}</figcaption>
</figure>`;
};

/** «До и после» — ползунок сдвигает верхнюю картинку. */
export const beforeAfter = (work, i, depth = 0) => `
<figure class="ba" data-ba>
  <div class="ba__frame">
    <span class="ba__mark ba__mark--before">До</span>
    ${photo({
      name: `ba-${work.direction}-${i + 1}-before`,
      label: 'Фото: до визита',
      alt: esc(work.before),
      w: 800,
      h: 600,
      depth,
    })}
    <div class="ba__after">
      <span class="ba__mark ba__mark--after">После</span>
      ${photo({
        name: `ba-${work.direction}-${i + 1}-after`,
        label: 'Фото: после визита',
        alt: esc(work.after),
        w: 800,
        h: 600,
        depth,
      })}
    </div>
    <input class="ba__range" type="range" min="0" max="100" value="50" aria-label="Сдвиньте, чтобы сравнить до и после">
  </div>
  <figcaption>${esc(work.title)}</figcaption>
</figure>`;

export const stars = (n = 5) => `<span class="stars" aria-hidden="true">${icon('star').repeat(n)}</span>`;

export const reviewCard = (review, { demo = false } = {}) => `
<article class="card review">
  ${stars(review.rating)}<span class="visually-hidden">Оценка ${review.rating} из 5</span>
  <p class="review__text">${esc(review.text)}</p>
  <p class="review__foot">
    <span class="review__author">${esc(review.author)}</span>
    <span>${esc(review.source)}</span>
    <span>${esc(review.date)}</span>
    ${demo && review.demo ? '<span class="tag tag--demo">черновик</span>' : ''}
  </p>
</article>`;

/**
 * Рейтинг показываем только когда цифры подтверждены: «Студия и контакты»
 * → «Рейтинг» → галочка. Оценка, взятая из непроверенного источника, —
 * это обещание, которое студия не давала.
 */
export const ratingOn = () => site.rating.enabled === true;

export const ratingBlock = () =>
  ratingOn()
    ? `
<div class="rating">
  <span class="rating__value">${esc(site.rating.value)}<span>из 5</span></span>
  ${stars(5)}
  <span class="rating__sources">
    ${site.rating.sources
      .map((s) => `<span>${esc(s.name)}: ${esc(s.value)} — ${s.count} отзывов</span>`)
      .join('\n    ')}
  </span>
</div>`
    : '';

/** Куда идти за настоящими отзывами, пока своих цитат на сайте нет. */
export const reviewSources = (intro) => `
<div class="card">
  <h2>${esc(intro.empty.title)}</h2>
  <p class="u-mt-sm text-muted">${esc(intro.empty.text)}</p>
  <div class="channels u-mt">
    ${intro.sources
      .map(
        (s) => `<a class="channel" href="${esc(s.href)}" target="_blank" rel="noopener nofollow">
      ${icon('star')}
      <span class="channel__body"><span>${esc(s.name)}</span><span class="channel__note">откроется в новой вкладке</span></span>
    </a>`
      )
      .join('\n    ')}
  </div>
</div>`;

export const faqBlock = (items) => `
<div class="faq">
  ${items
    .map(
      (f) => `<details>
    <summary>${esc(f.q)}</summary>
    <div class="faq__body">${esc(f.a)}</div>
  </details>`
    )
    .join('\n  ')}
</div>`;

export const faqSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const stepsList = (steps, cols = false) => `
<ol class="steps${cols ? ' steps--cols' : ''}">
  ${steps
    .map(
      (s) => `<li>
    <h3>${esc(s.title)}</h3>
    <p>${esc(s.text)}</p>
  </li>`
    )
    .join('\n  ')}
</ol>`;

/** Полоса записи в конце страницы — последний шанс нажать кнопку. */
export const bookingBand = (depth = 0, { title, text, service = '', master = '' } = {}) => `
<section class="section section--soft">
  <div class="wrap">
    <div class="card">
      ${sectionHead({
        title: title || 'Записаться',
        lead: text || `Администратор подберёт время: ${site.hoursShort}.`,
        center: true,
      })}
      <div class="cta-row">
        <button class="btn btn--primary btn--lg" type="button" data-book${service ? ` data-service="${esc(service)}"` : ''}${master ? ` data-master="${esc(master)}"` : ''}>Записаться</button>
        <a class="btn btn--ghost btn--lg" href="${site.phonePrimary.href}" data-goal="phone">${icon('phone')}${esc(site.phonePrimary.label)}</a>
      </div>
    </div>
  </div>
</section>`;
