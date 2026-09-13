// Подарочные сертификаты. Пики продаж — декабрь и 8 марта, поэтому
// страница отвечает на три вопроса сразу: на сколько, на что и как купить.
import { layout, esc, crumbsHtml, DEMO } from '../lib/layout.mjs';
import { sectionHead, stepsList, bookingBand } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { photo } from '../lib/photo.mjs';
import { site } from '../data/site.mjs';
import { gift } from '../data/content.mjs';

export function giftPage() {
  const crumbs = [
    { name: 'Главная', path: 'index.html' },
    { name: 'Подарочные сертификаты', path: 'gift.html' },
  ];

  const content = `
<div class="wrap">${crumbsHtml(crumbs, 0)}</div>

<section class="section section--tight">
  <div class="wrap">
    <div class="split split--wide split--middle">
      <div>
        <span class="kicker">${icon('gift')} Сертификаты</span>
        <h1>${esc(gift.title)}</h1>
        <p class="section__lead">${esc(gift.lead)}</p>
        <div class="cta-row cta-row--start">
          <button class="btn btn--primary btn--lg" type="button" data-book>Заказать сертификат</button>
          <a class="btn btn--ghost btn--lg" href="${site.phonePrimary.href}" data-goal="phone">${icon('phone')}${esc(site.phonePrimary.label)}</a>
        </div>
        <p class="summary-note">${icon('clock')} ${esc(gift.seasons)}</p>
      </div>
      <div>
        ${photo({
          name: 'gift-certificate',
          label: 'Фото: сертификат в конверте',
          alt: 'Подарочный сертификат студии nail.lounge',
          w: 900,
          h: 700,
          priority: true,
          sizes: '(min-width: 900px) 500px, 100vw',
        })}
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="card">
      ${sectionHead({ title: 'На какую сумму', lead: gift.nominalsNote })}
      <div class="cta-row cta-row--start">
        <button class="btn btn--primary" type="button" data-book>Спросить у администратора</button>
        <a class="btn btn--ghost" href="${site.phonePrimary.href}" data-goal="phone">${icon('phone')}${esc(site.phonePrimary.label)}</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--soft">
  <div class="wrap">
    <div class="split">
      <div>
        ${sectionHead({ title: gift.how.title })}
        ${stepsList(gift.how.steps)}
      </div>
      ${
        gift.terms.length
          ? `<div class="card">
        <h2>Условия</h2>
        <ul class="checklist u-mt-sm">
          ${gift.terms.map((t) => `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('\n          ')}
        </ul>
        <p class="u-mt-sm"><a class="link" href="legal/offer.html">Условия из публичной оферты ${icon('arrow')}</a></p>
      </div>`
          : `<div class="card">
        <h2>Про условия</h2>
        <p class="u-mt-sm text-muted">Срок действия, доступные суммы и порядок оплаты студия определяет сама.
          Мы не публикуем их до подтверждения, чтобы не пообещать за неё лишнего — спросите администратора,
          он ответит в тот же день.</p>
        <p class="u-mt-sm"><a class="link" href="legal/offer.html">Публичная оферта ${icon('arrow')}</a></p>
      </div>`
      }
    </div>
  </div>
</section>

${bookingBand(0, {
  title: 'Заказать сертификат',
  text: 'Напишите номинал и как удобно получить — бумажный в студии или электронный в мессенджере.',
})}
`;

  return layout({
    title: 'Подарочные сертификаты студии nail.lounge в Минске',
    description:
      'Подарочный сертификат студии nail.lounge в центре Минска: маникюр, педикюр и брови в подарок. Как купить, на какую сумму и где забрать — подскажет администратор студии.',
    path: 'gift.html',
    content,
  });
}
