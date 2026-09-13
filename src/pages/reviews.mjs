// Отзывы. Своих цитат на сайте нет: чужие отзывы нельзя пересказывать
// своими словами, а придуманные — тем более. Пока владельцы не отберут
// настоящие, страница честно отправляет читать их на площадки.
import { layout, esc, crumbsHtml, DEMO } from '../lib/layout.mjs';
import { sectionHead, reviewCard, ratingBlock, reviewSources, bookingBand } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../data/site.mjs';
import { reviews, reviewsIntro } from '../data/content.mjs';

export function reviewsPage() {
  const crumbs = [
    { name: 'Главная', path: 'index.html' },
    { name: 'Отзывы', path: 'reviews.html' },
  ];

  const content = `
<div class="wrap">${crumbsHtml(crumbs, 0)}</div>

<section class="section section--tight">
  <div class="wrap">
    <h1>Отзывы о студии nail.lounge</h1>
    <p class="section__lead">${esc(reviewsIntro.lead)}</p>
    ${ratingBlock() ? `<div class="u-mt">${ratingBlock()}</div>` : ''}
    ${DEMO ? `<p class="note">${esc(reviewsIntro.note)}</p>` : ''}
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    ${
      reviews.length
        ? `<div class="grid grid--2">
      ${reviews.map((r) => reviewCard(r, { demo: DEMO })).join('\n      ')}
    </div>`
        : reviewSources(reviewsIntro)
    }
  </div>
</section>

<section class="section section--soft">
  <div class="wrap">
    <div class="card">
      ${sectionHead({ kicker: 'Спасибо', title: reviewsIntro.cta.title, lead: reviewsIntro.cta.text, center: true })}
      <div class="cta-row">
        <a class="btn btn--primary btn--lg" href="${esc(reviewsIntro.cta.href)}" target="_blank" rel="noopener" data-goal="review">${icon('star')}${esc(reviewsIntro.cta.button)}</a>
        <a class="btn btn--ghost btn--lg" href="${esc(site.instagram.url)}" target="_blank" rel="noopener nofollow">${icon('instagram')}Написать в Instagram</a>
      </div>
      <p class="summary-note">${icon('chat')} Если визит не понравился, напишите сначала нам — администратор ответит: ${esc(site.phonePrimary.label)}.</p>
    </div>
  </div>
</section>

${bookingBand(0, {
  title: 'Записаться',
  text: `Работаем ${site.hoursShort}. Администратор подберёт время.`,
})}
`;

  return layout({
    title: 'Отзывы о студии nail.lounge в Минске — оценка 4,8',
    description:
      'Отзывы клиентов студии nail.lounge в центре Минска: оценка 4,8 на Google Maps и firmi.by. Что пишут про маникюр, педикюр, брови, атмосферу и стерильность.',
    path: 'reviews.html',
    active: 'reviews.html',
    crumbs,
    content,
  });
}
