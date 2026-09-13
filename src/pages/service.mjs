// Страница направления: маникюр, педикюр или брови. Шаблон один, данные
// разные. Заголовок каждой страницы заточен под свой поисковый запрос —
// ради этого сайт и сделан многостраничным.
import { layout, esc, url, crumbsHtml } from '../lib/layout.mjs';
import {
  sectionHead, stepsList, faqBlock, faqSchema, priceGroup,
  workItem, beforeAfter, masterCard, bookingBand, firstVisitSection,
} from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { photo } from '../lib/photo.mjs';
import { site } from '../data/site.mjs';
import { categoryById } from '../data/prices.mjs';
import { mastersFor } from '../data/masters.mjs';
import { worksFor } from '../data/content.mjs';

const serviceSchema = (service) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${site.origin}/${service.slug}.html#service`,
  name: service.title,
  serviceType: service.h1,
  description: service.metaDescription,
  url: `${site.origin}/${service.slug}.html`,
  provider: { '@id': `${site.origin}/#salon` },
  areaServed: { '@type': 'City', name: 'Минск' },
  offers: {
    '@type': 'Offer',
    price: String(service.priceFrom),
    priceCurrency: 'BYN',
    priceSpecification: {
      '@type': 'PriceSpecification',
      minPrice: String(service.priceFrom),
      priceCurrency: 'BYN',
      valueAddedTaxIncluded: true,
    },
    availability: 'https://schema.org/InStock',
    url: `${site.origin}/${service.slug}.html`,
  },
});

export function servicePage(service) {
  const crumbs = [
    { name: 'Главная', path: 'index.html' },
    { name: service.title, path: `${service.slug}.html` },
  ];
  const category = categoryById(service.id);
  const teamed = mastersFor(service.id);
  const items = worksFor(service.id);
  const gallery = items.filter((w) => w.kind === 'work');
  const fixes = items.filter((w) => w.kind === 'fix');

  const content = `
<div class="wrap">${crumbsHtml(crumbs, 0)}</div>

<section class="section section--tight">
  <div class="wrap">
    <div class="split split--wide split--middle">
      <div>
        <span class="kicker">${icon(service.icon)} ${esc(service.title)}</span>
        <h1>${esc(service.h1)}</h1>
        <p class="section__lead">${esc(service.lead)}</p>
        <div class="cta-row cta-row--start">
          <button class="btn btn--primary btn--lg" type="button" data-book>Записаться</button>
          <a class="btn btn--ghost btn--lg" href="prices.html#${esc(service.id)}">Цены на ${esc(service.title.toLowerCase())}</a>
        </div>
        <div class="hero__facts u-mt">
          <span class="fact"><span class="fact__value">от ${service.priceFrom} руб.</span><span class="fact__label">базовая услуга</span></span>
          <span class="fact"><span class="fact__value">${esc(service.duration)}</span><span class="fact__label">длительность</span></span>
          <span class="fact"><span class="fact__value">${esc(service.keepsFor)}</span><span class="fact__label">держится</span></span>
        </div>
      </div>
      <div>
        ${photo({
          name: `service-${service.id}-hero`,
          label: `Фото: ${service.title.toLowerCase()} в студии`,
          alt: `${service.h1} — студия nail.lounge`,
          w: 900,
          h: 700,
          priority: true,
          sizes: '(min-width: 900px) 500px, 100vw',
        })}
      </div>
    </div>
  </div>
</section>

${firstVisitSection()}

<section class="section" id="how">
  <div class="wrap">
    ${sectionHead({
      kicker: 'По шагам',
      title: 'Как проходит визит',
      lead: 'Чтобы вы заранее знали, что будет происходить и сколько это займёт.',
    })}
    ${stepsList(service.steps, true)}
    <div class="card u-mt">
      <h3>Что входит в базовую цену</h3>
      <ul class="checklist u-mt-sm">
        ${service.includes.map((i) => `<li>${icon('check')}<span>${esc(i)}</span></li>`).join('\n        ')}
      </ul>
      <p class="u-mt-sm text-muted">Всё, что сверх этого — длина, укрепление, дизайн, снятие чужого покрытия, — считается отдельно и называется до начала работы. Полный список на странице <a href="prices.html#extra">цен</a>.</p>
    </div>
  </div>
</section>

<section class="section section--soft">
  <div class="wrap">
    <div class="callout">
      <h3>${esc(service.highlight.title)}</h3>
      <p>${esc(service.highlight.text)}</p>
      <div class="callout__cta">
        <button class="btn btn--primary" type="button" data-book>${esc(service.highlight.cta)}</button>
      </div>
    </div>
  </div>
</section>

<section class="section" id="prices">
  <div class="wrap">
    ${sectionHead({
      kicker: 'Цены',
      title: `${esc(service.title)}: цены и длительность`,
      lead: category ? category.lead : '',
    })}
    ${category ? category.groups.map(priceGroup).join('\n    ') : ''}
    <p class="summary-note">${icon('wallet')} Полная таблица со снятием, длиной и дизайном — на странице <a href="prices.html">цен</a>.</p>
  </div>
</section>

${
  gallery.length
    ? `<section class="section section--soft" id="works">
  <div class="wrap">
    ${sectionHead({ kicker: 'Портфолио', title: `Работы: ${esc(service.title.toLowerCase())}` })}
    <div class="gallery">
      ${gallery.map((w, i) => workItem(w, i, 0)).join('\n      ')}
    </div>
    ${
      fixes.length
        ? `<div class="u-mt-lg">
      <h3>До и после</h3>
      <div class="grid grid--2 u-mt-sm">
        ${fixes.map((w, i) => beforeAfter(w, i, 0)).join('\n        ')}
      </div>
    </div>`
        : ''
    }
    <p class="u-mt"><a class="link" href="works.html">Вся галерея с фильтрами ${icon('arrow')}</a></p>
  </div>
</section>`
    : ''
}

${
  teamed.length
    ? `<section class="section" id="masters">
  <div class="wrap">
    ${sectionHead({ kicker: 'Команда', title: `Кто ведёт ${esc(service.title.toLowerCase())}` })}
    <div class="grid grid--3">
      ${teamed.map((m) => masterCard(m, 0)).join('\n      ')}
    </div>
  </div>
</section>`
    : ''
}

<section class="section section--soft" id="faq">
  <div class="wrap">
    ${sectionHead({ title: 'Частые вопросы' })}
    ${faqBlock(service.faq)}
  </div>
</section>

${bookingBand(0, {
  title: `Записаться на ${esc(service.title.toLowerCase())}`,
  text: `Работаем ${site.hoursShort}. Можно записаться к конкретному мастеру — по имени.`,
})}
`;

  return layout({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `${service.slug}.html`,
    active: `${service.slug}.html`,
    crumbs,
    content,
    jsonLd: [serviceSchema(service), faqSchema(service.faq)],
  });
}
