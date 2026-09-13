// Список мастеров и отдельная страница на каждого. Имена работают:
// в отзывах людей ведут к конкретной Екатерине и конкретной Карине,
// поэтому у каждого мастера своя страница и своя кнопка записи.
import { layout, esc, url, crumbsHtml } from '../lib/layout.mjs';
import { sectionHead, masterCard, bookingBand, faqSchema } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { photo } from '../lib/photo.mjs';
import { site } from '../data/site.mjs';
import { masters, founders, admin } from '../data/masters.mjs';
import { services } from '../data/services.mjs';
import { DEMO } from '../lib/layout.mjs';

const directionTitle = (id) => (services.find((s) => s.id === id) || {}).title || id;

const personSchema = (master) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${site.origin}/masters/${master.slug}.html#person`,
  name: master.name,
  jobTitle: master.role,
  worksFor: { '@id': `${site.origin}/#salon` },
  url: `${site.origin}/masters/${master.slug}.html`,
  knowsAbout: master.specialties,
});

export function mastersIndexPage() {
  const crumbs = [
    { name: 'Главная', path: 'index.html' },
    { name: 'Мастера', path: 'masters.html' },
  ];

  const content = `
<div class="wrap">${crumbsHtml(crumbs, 0)}</div>

<section class="section section--tight">
  <div class="wrap">
    <h1>Мастера студии nail.lounge</h1>
    <p class="section__lead">У каждого мастера своя страница и своя кнопка записи: имя подставится в заявку, и администратор сразу посмотрит именно его расписание.</p>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="split">
      <div class="card">
        <span class="kicker">Семейный бизнес</span>
        <h2>${esc(founders.title)}</h2>
        ${founders.paragraphs.map((p) => `<p class="u-mt-sm text-muted">${esc(p)}</p>`).join('\n        ')}
        ${DEMO && founders.demo ? '<p class="note">Черновик: историю студии нужно подтвердить у владельцев.</p>' : ''}
      </div>
      <div class="card">
        <span class="kicker">Запись</span>
        <h2>${esc(admin.name)}</h2>
        <p class="master__role">${esc(admin.role)}</p>
        <p class="text-muted">${esc(admin.text)}</p>
        <div class="cta-row cta-row--start">
          <button class="btn btn--primary" type="button" data-book>Написать администратору</button>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ kicker: 'Команда', title: 'Кто вас примет' })}
    <div class="grid grid--3">
      ${masters.map((m) => masterCard(m, 0, { demo: DEMO })).join('\n      ')}
    </div>
  </div>
</section>

${bookingBand(0, {
  title: 'Записаться к своему мастеру',
  text: 'Если ещё не выбрали — напишите, администратор подскажет, кто свободен и кто чем занимается.',
})}
`;

  return layout({
    title: 'Мастера студии nail.lounge — маникюр, педикюр, брови',
    description:
      'Мастера студии nail.lounge в центре Минска: кто ведёт маникюр, педикюр и брови, чем занимается каждый и как записаться к конкретному человеку по имени.',
    path: 'masters.html',
    active: 'masters.html',
    crumbs,
    content,
  });
}

export function masterPage(master) {
  const depth = 1;
  const crumbs = [
    { name: 'Главная', path: 'index.html' },
    { name: 'Мастера', path: 'masters.html' },
    { name: master.name, path: `masters/${master.slug}.html` },
  ];
  const u = (p) => url(p, depth);

  const content = `
<div class="wrap">${crumbsHtml(crumbs, depth)}</div>

<section class="section section--tight">
  <div class="wrap">
    <div class="profile">
      <div class="profile__side">
        <div class="profile__card">
          ${photo({
            name: `master-${master.slug}-portrait`,
            label: `Фото: ${master.name}`,
            alt: `${master.name} — ${master.role.toLowerCase()} студии nail.lounge`,
            w: 600,
            h: 800,
            depth,
            priority: true,
            sizes: '(min-width: 900px) 340px, 100vw',
          })}
          <div class="profile__facts">
            <p class="profile__fact">${icon('sparkle')}<span>${esc(master.role)}</span></p>
            ${master.experience ? `<p class="profile__fact">${icon('clock')}<span>${esc(master.experience)}</span></p>` : ''}
            <p class="profile__fact">${icon('hand')}<span>${esc(master.directions.map(directionTitle).join(', '))}</span></p>
          </div>
          <div class="profile__cta">
            <button class="btn btn--primary btn--block" type="button" data-book data-master="${esc(master.name)}">Записаться к ${esc(master.dative)}</button>
          </div>
        </div>
      </div>

      <div>
        <h1>${esc(master.name)} — ${esc(master.role.toLowerCase())}</h1>
        <p class="section__lead">${esc(master.lead)}</p>
        ${DEMO && master.demo ? '<p class="note">Черновик: текст написан нами по отзывам, мастер его ещё не подтвердил.</p>' : ''}

        ${
          master.approach.length
            ? `<div class="card u-mt">
          <h2>Как работает</h2>
          ${master.approach.map((p) => `<p class="u-mt-sm text-muted">${esc(p)}</p>`).join('\n          ')}
        </div>`
            : ''
        }

        <div class="split u-mt">
          <div class="card">
            <h2>Что делает</h2>
            <ul class="checklist u-mt-sm">
              ${master.specialties.map((s) => `<li>${icon('check')}<span>${esc(s)}</span></li>`).join('\n              ')}
            </ul>
            <p class="u-mt-sm"><a class="link" href="${u('prices.html')}">Цены на услуги ${icon('arrow')}</a></p>
          </div>
          ${
            master.education.length
              ? `<div class="card">
            <h2>Обучение</h2>
            <ul class="checklist u-mt-sm">
              ${master.education.map((s) => `<li>${icon('sparkle')}<span>${esc(s)}</span></li>`).join('\n              ')}
            </ul>
          </div>`
              : `<div class="card">
            <h2>Записаться к мастеру</h2>
            <p class="u-mt-sm text-muted">Имя подставится в заявку, и администратор посмотрит расписание
              именно этого мастера.</p>
            <div class="cta-row cta-row--start">
              <button class="btn btn--primary" type="button" data-book data-master="${esc(master.name)}">Записаться к ${esc(master.dative)}</button>
            </div>
          </div>`
          }
        </div>

        <div class="u-mt-lg">
          <h2>Работы ${esc(master.genitive)}</h2>
          <div class="gallery u-mt-sm">
            ${master.portfolio
              .map((caption, i) =>
                `<figure class="work">
              ${photo({
                name: `work-${master.slug}-${i + 1}`,
                label: `Фото: ${caption.toLowerCase()}`,
                alt: `${caption} — работа мастера ${master.name}`,
                w: 600,
                h: 600,
                depth,
                sizes: '(min-width: 900px) 220px, 45vw',
              })}
              <figcaption>${esc(caption)}</figcaption>
            </figure>`
              )
              .join('\n            ')}
          </div>
          <p class="u-mt"><a class="link" href="${u('works.html')}">Все работы студии ${icon('arrow')}</a></p>
        </div>
      </div>
    </div>
  </div>
</section>

${bookingBand(depth, {
  title: `Записаться к ${esc(master.dative)}`,
  text: `Работаем ${site.hoursShort}. Если удобное время занято, администратор предложит ближайшее свободное.`,
  master: master.name,
})}
`;

  return layout({
    title: `${master.name} — ${master.role.toLowerCase()} в студии nail.lounge`.slice(0, 70),
    description: `${master.name}: ${master.role.toLowerCase()} студии nail.lounge в центре Минска. ${master.card}`.slice(0, 300),
    path: `masters/${master.slug}.html`,
    depth,
    active: 'masters.html',
    crumbs,
    content,
    jsonLd: [personSchema(master)],
  });
}
