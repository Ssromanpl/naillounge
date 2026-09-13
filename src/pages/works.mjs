// Галерея работ с фильтрами по направлению и по мастеру. Фильтрация
// на клиенте: карточек немного, страница статическая, лишний запрос
// к серверу тут не нужен.
import { layout, esc, crumbsHtml, DEMO } from '../lib/layout.mjs';
import { sectionHead, workItem, beforeAfter, bookingBand } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { services } from '../data/services.mjs';
import { masters } from '../data/masters.mjs';
import { works, worksIntro } from '../data/content.mjs';

const chip = (group, value, label, active = false) =>
  `<button class="chip" type="button" data-filter="${group}" data-value="${esc(value)}" aria-pressed="${active}">${esc(label)}</button>`;

export function worksPage() {
  const crumbs = [
    { name: 'Главная', path: 'index.html' },
    { name: 'Работы', path: 'works.html' },
  ];
  const gallery = works.filter((w) => w.kind === 'work');
  const fixes = works.filter((w) => w.kind === 'fix');

  const content = `
<div class="wrap">${crumbsHtml(crumbs, 0)}</div>

<section class="section section--tight">
  <div class="wrap">
    <h1>${esc(worksIntro.title)} студии nail.lounge</h1>
    <p class="section__lead">${esc(worksIntro.lead)}</p>
    ${DEMO ? '<p class="note">Черновик: на местах работ — заготовки. Настоящие снимки заменят их один в один, вёрстка не сдвинется.</p>' : ''}
  </div>
</section>

<section class="section section--tight">
  <div class="wrap" data-gallery>
    <div class="filters">
      <span class="filters__label">${icon('filter')} Направление</span>
      ${chip('direction', 'all', 'Все', true)}
      ${services.map((s) => chip('direction', s.id, s.title)).join('\n      ')}
    </div>
    <div class="filters">
      <span class="filters__label">${icon('sparkle')} Мастер</span>
      ${chip('master', 'all', 'Любой', true)}
      ${masters.map((m) => chip('master', m.slug, m.name)).join('\n      ')}
    </div>

    <p class="summary-note">Показано работ: <strong data-count>${gallery.length}</strong></p>

    <div class="gallery gallery--4">
      ${gallery.map((w, i) => workItem(w, i, 0)).join('\n      ')}
    </div>
    <p class="note" data-empty hidden>С такими фильтрами работ пока нет. Попробуйте выбрать другого мастера или направление.</p>
  </div>
</section>

<section class="section section--soft">
  <div class="wrap">
    ${sectionHead({
      kicker: 'Исправления',
      title: 'До и после',
      lead: 'Отдельный сюжет: приходят с чужой или домашней работой, уходят с нормальной. Потяните ползунок.',
    })}
    <div class="grid grid--3">
      ${fixes.map((w, i) => beforeAfter(w, i, 0)).join('\n      ')}
    </div>
  </div>
</section>

${bookingBand(0, {
  title: 'Хотите так же?',
  text: 'Покажите понравившуюся работу при записи — мастер скажет, что нужно для такого результата на ваших ногтях.',
})}
`;

  return layout({
    title: 'Работы студии nail.lounge — маникюр, педикюр, брови',
    description:
      'Галерея работ студии nail.lounge в Минске: маникюр, педикюр и брови с фильтром по направлению и мастеру, а также примеры исправлений в формате «до и после».',
    path: 'works.html',
    active: 'works.html',
    crumbs,
    content,
  });
}
