// Страница цен — главная по значимости после первого экрана. Никаких
// «цена по запросу»: у каждой позиции стоимость и длительность, а рядом
// объяснение, что входит и что считается отдельно.
import { layout, esc, crumbsHtml } from '../lib/layout.mjs';
import { sectionHead, priceCategory, firstVisitSection, bookingBand } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../data/site.mjs';
import {
  priceCategories, priceUpdated, priceNote, included, sumParts, extraTitle, extraLead,
} from '../data/prices.mjs';

/** Микроразметка каталога: поисковики показывают такие цены прямо в выдаче. */
const catalogSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Цены на услуги студии nail.lounge',
  url: `${site.origin}/prices.html`,
  provider: { '@id': `${site.origin}/#salon` },
  itemListElement: priceCategories.map((category, i) => ({
    '@type': 'OfferCatalog',
    position: i + 1,
    name: category.title,
    itemListElement: category.groups
      .flatMap((g) => g.items)
      .map((item) => ({
        '@type': 'Offer',
        name: item.name,
        price: String(item.price),
        priceCurrency: 'BYN',
        availability: 'https://schema.org/InStock',
      })),
  })),
});

export function pricesPage() {
  const crumbs = [
    { name: 'Главная', path: 'index.html' },
    { name: 'Цены', path: 'prices.html' },
  ];

  const content = `
<div class="wrap">${crumbsHtml(crumbs, 0)}</div>

<section class="section section--tight">
  <div class="wrap">
    <h1>Цены на маникюр, педикюр и брови в Минске</h1>
    <p class="section__lead">${esc(priceNote)} Итоговую сумму мастер называет до начала работы — не после.</p>
    <p class="summary-note">
      <span>${icon('clock')} Цены обновлены: ${esc(priceUpdated)}</span>
      <span>${icon('wallet')} Оплата наличными и картой в студии</span>
    </p>
  </div>
</section>

<div class="wrap">
  <nav class="pricenav" aria-label="Разделы цен">
    ${priceCategories.map((c) => `<a href="#${esc(c.id)}">${esc(c.title)}</a>`).join('\n    ')}
    <a href="#sum">Из чего складывается сумма</a>
  </nav>
</div>

<section class="section section--tight">
  <div class="wrap">
    <div class="split split--stretch">
      <div class="card">
        <h2>${esc(included.title)}</h2>
        <ul class="checklist u-mt-sm">
          ${included.items.map((i) => `<li>${icon('check')}<span>${esc(i)}</span></li>`).join('\n          ')}
        </ul>
      </div>
      <div class="card">
        <h2>${esc(extraTitle)}</h2>
        <p class="u-mt-sm text-muted">${esc(extraLead)}</p>
        <p class="u-mt-sm"><a class="link" href="#extra">Смотреть список ${icon('arrow')}</a></p>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    ${priceCategories.map(priceCategory).join('\n    ')}
  </div>
</section>

<section class="section section--soft" id="sum">
  <div class="wrap">
    ${sectionHead({ kicker: 'Прозрачно', title: sumParts.title, lead: sumParts.lead })}
    <div class="parts">
      ${sumParts.items
        .map((p) => `<article class="part"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></article>`)
        .join('\n      ')}
    </div>
    <p class="summary-note">${icon('chat')} ${esc(sumParts.note)}</p>
  </div>
</section>

${firstVisitSection()}

${bookingBand(0, {
  title: 'Записаться',
  text: `Назовите услугу — администратор посчитает итог до визита. Работаем ${site.hoursShort}.`,
})}
`;

  return layout({
    title: 'Цены на маникюр, педикюр и брови — nail.lounge, Минск',
    description:
      'Полные цены студии nail.lounge в центре Минска: маникюр, педикюр, брови, снятие, дизайн и длина. У каждой услуги стоимость и длительность, без «цены по запросу».',
    path: 'prices.html',
    active: 'prices.html',
    crumbs,
    content,
    jsonLd: [catalogSchema()],
  });
}
