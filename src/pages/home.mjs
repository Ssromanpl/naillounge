// Главная страница. Порядок блоков задан техзаданием: первый экран,
// скидка первого визита, три направления, стерильность, мастера, работы,
// отзывы, атмосфера, карта. Всё ведёт к одной кнопке — «Записаться».
import { layout, esc, url, DEMO } from '../lib/layout.mjs';
import {
  sectionHead, firstVisitSection, serviceCard, masterCard, workItem,
  reviewCard, ratingBlock, ratingOn, faqBlock, faqSchema, bookingBand,
} from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { photo } from '../lib/photo.mjs';
import { site } from '../data/site.mjs';
import { services } from '../data/services.mjs';
import { masters } from '../data/masters.mjs';
import { hero, serviceCards, sterility, atmosphere, works, reviews, reviewsIntro, homeFaq } from '../data/content.mjs';
import { mapBlock } from './contacts.mjs';

export function homePage() {
  const cards = serviceCards
    .map((c) => {
      const service = services.find((s) => s.id === c.id);
      return service ? serviceCard(service, c, 0) : '';
    })
    .join('\n');

  const content = `
<section class="hero">
  <div class="hero__media">
    ${photo({
      name: 'hero-studio',
      label: esc(hero.photoLabel),
      alt: 'Зал студии nail.lounge в центре Минска',
      w: 1600,
      h: 1200,
      priority: true,
      sizes: '100vw',
    })}
  </div>
  <div class="wrap hero__body">
    <div class="hero__card">
      <span class="kicker">${esc(hero.kicker)}</span>
      <h1>${esc(hero.title)}</h1>
      <p class="hero__text">${esc(hero.text)}</p>
      <div class="cta-row cta-row--start">
        <button class="btn btn--primary btn--lg" type="button" data-book>Записаться</button>
        <a class="btn btn--ghost btn--lg" href="prices.html">Смотреть цены</a>
      </div>
      <div class="hero__meta">
        <p class="hero__meta-row">${icon('pin')}<span>${esc(site.address.city)}, ${esc(site.address.street)} · метро «${esc(site.metro.name)}», ${esc(site.metro.distance)}</span></p>
        <p class="hero__meta-row">${icon('clock')}<span>${esc(site.hours[0].days)}, ${esc(site.hours[0].time)}</span></p>
        <p class="hero__meta-row">${icon('phone')}<a href="${site.phonePrimary.href}" data-goal="phone">${esc(site.phonePrimary.label)}</a></p>
      </div>
      <div class="hero__facts">
        ${hero.facts
          .map((f) => `<span class="fact"><span class="fact__value">${esc(f.value)}</span><span class="fact__label">${esc(f.label)}</span></span>`)
          .join('\n        ')}
      </div>
    </div>
  </div>
</section>

${firstVisitSection()}

<section class="section" id="services">
  <div class="wrap">
    ${sectionHead({
      kicker: 'Три направления',
      title: 'Что мы делаем',
      lead: 'У каждого направления своя страница: что входит в процедуру, цены с длительностью и мастера, которые его ведут.',
    })}
    <div class="grid grid--3">
      ${cards}
    </div>
  </div>
</section>

<section class="section section--soft" id="sterility">
  <div class="wrap">
    <div class="split split--wide">
      <div>
        ${sectionHead({ kicker: 'Безопасность', title: sterility.title, lead: sterility.lead })}
        <ol class="steps">
          ${sterility.steps
            .map((s) => `<li><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`)
            .join('\n          ')}
        </ol>
      </div>
      <div>
        <div class="card">
          <h3>${esc(sterility.disposable.title)}</h3>
          <ul class="checklist u-mt-sm">
            ${sterility.disposable.items.map((i) => `<li>${icon('check')}<span>${esc(i)}</span></li>`).join('\n            ')}
          </ul>
          ${DEMO && sterility.demo ? `<p class="note">${esc(sterility.note)}</p>` : ''}
        </div>
        <div class="card u-mt-sm">
          <h3>${icon('shield')} Спросите — покажем</h3>
          <p>Если хочется убедиться лично, попросите мастера вскрыть пакет при вас и показать индикатор. Это обычная просьба, на неё не обижаются.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" id="masters">
  <div class="wrap">
    ${sectionHead({
      kicker: 'Команда',
      title: 'Мастера',
      lead: 'К каждому можно записаться поимённо: у постоянных клиентов здесь свой мастер.',
    })}
    <div class="grid grid--4">
      ${masters.slice(0, 4).map((m) => masterCard(m, 0, { demo: DEMO })).join('\n      ')}
    </div>
    <p class="u-mt"><a class="link" href="masters.html">Все мастера и их работы ${icon('arrow')}</a></p>
  </div>
</section>

<section class="section section--soft" id="works">
  <div class="wrap">
    ${sectionHead({
      kicker: 'Портфолио',
      title: 'Работы',
      lead: 'Снято в студии. Полная галерея — с фильтром по направлению и мастеру.',
    })}
    <div class="gallery gallery--4">
      ${works.filter((w) => w.kind === 'work').slice(0, 8).map((w, i) => workItem(w, i, 0)).join('\n      ')}
    </div>
    <p class="u-mt"><a class="link" href="works.html">Вся галерея ${icon('arrow')}</a></p>
  </div>
</section>

${
  reviews.length || ratingOn()
    ? `<section class="section" id="reviews">
  <div class="wrap">
    ${sectionHead({ kicker: 'Отзывы', title: 'Что говорят клиенты', lead: reviewsIntro.lead })}
    ${ratingBlock()}
    ${
      reviews.length
        ? `<div class="grid grid--2 u-mt">
      ${reviews.slice(0, 4).map((r) => reviewCard(r, { demo: DEMO })).join('\n      ')}
    </div>`
        : ''
    }
    <p class="u-mt"><a class="link" href="reviews.html">Где почитать отзывы ${icon('arrow')}</a></p>
  </div>
</section>`
    : ''
}

${
  atmosphere.items.length
    ? `<section class="section section--ink" id="atmosphere">
  <div class="wrap">
    <div class="split">
      <div>
        ${sectionHead({ kicker: 'Атмосфера', title: atmosphere.title, lead: atmosphere.lead })}
        <div class="grid grid--sm">
          ${atmosphere.items
            .map(
              (a) => `<div class="card card--flat"><h3>${esc(a.title)}</h3><p class="u-mt-sm text-muted">${esc(a.text)}</p></div>`
            )
            .join('\n          ')}
        </div>
      </div>
      <div class="mosaic">
        ${atmosphere.photoLabels
          .map((label, i) =>
            photo({
              name: `atmosphere-${i + 1}`,
              label: esc(label),
              alt: label.replace('Фото: ', 'Студия nail.lounge: '),
              w: 600,
              h: 600,
              sizes: '(min-width: 900px) 260px, 45vw',
            })
          )
          .join('\n        ')}
      </div>
    </div>
  </div>
</section>`
    : ''
}

<section class="section" id="faq">
  <div class="wrap">
    ${sectionHead({ title: 'Частые вопросы', lead: 'Если ответа нет — напишите, администратор подскажет.' })}
    ${faqBlock(homeFaq)}
  </div>
</section>

<section class="section section--soft" id="contacts">
  <div class="wrap">
    <div class="split">
      <div>
        ${sectionHead({ kicker: 'Контакты', title: 'Как нас найти' })}
        <p class="hero__meta-row">${icon('pin')}<span>${esc(site.address.city)}, ${esc(site.address.street)}<br>Ориентиры: ${esc(site.landmarks.join(', '))}</span></p>
        <p class="hero__meta-row">${icon('chair')}<span>Метро «${esc(site.metro.name)}» — ${esc(site.metro.distance)}, ${esc(site.metro.walk)}</span></p>
        <p class="hero__meta-row">${icon('clock')}<span>${esc(site.hoursShort)}</span></p>
        <p class="hero__meta-row">${icon('phone')}<a href="${site.phonePrimary.href}" data-goal="phone">${esc(site.phonePrimary.label)}</a></p>
        <div class="cta-row cta-row--start">
          <button class="btn btn--primary" type="button" data-book>Записаться</button>
          <a class="btn btn--ghost" href="contacts.html">Все контакты и как дойти</a>
        </div>
      </div>
      ${mapBlock()}
    </div>
  </div>
</section>

${bookingBand(0, {
  title: 'Записаться в nail.lounge',
  text: `Работаем ${site.hoursShort}, рядом с метро «Площадь Ленина». Администратор подберёт время.`,
})}
`;

  return layout({
    title: 'nail.lounge — маникюр, педикюр и брови в центре Минска',
    description:
      'Студия маникюра, педикюра и бровей в центре Минска, рядом с метро «Площадь Ленина». Цены с длительностью, запись к своему мастеру, ежедневно с 09:00 до 21:00.',
    path: 'index.html',
    active: '',
    content,
    jsonLd: [faqSchema(homeFaq)],
  });
}
