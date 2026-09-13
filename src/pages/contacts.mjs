// Контакты: адрес с ориентирами, дорога от метро, мессенджеры, форма.
// Карта грузится по клику — iframe тянет много и портит первый экран.
import { layout, esc, crumbsHtml, channelList, bookingForm, DEMO } from '../lib/layout.mjs';
import { sectionHead, stepsList } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { photo } from '../lib/photo.mjs';
import { site } from '../data/site.mjs';
import { contactsExtra } from '../data/content.mjs';

/** Карта по клику. Используется и на главной, и на странице контактов. */
export function mapBlock() {
  const query = `${site.address.city}, ${site.address.street}`;
  const src = `https://yandex.by/map-widget/v1/?text=${encodeURIComponent(query)}&z=17`;
  return `
<div class="map" data-map="${esc(src)}">
  <div class="map__stub">
    <p>Карта загрузится по нажатию — так страница открывается быстрее.<br>${esc(query)}, метро «${esc(site.metro.name)}».</p>
    <button class="btn btn--ghost" type="button">${icon('pin')}Показать карту</button>
  </div>
</div>`;
}

export function contactsPage() {
  const crumbs = [
    { name: 'Главная', path: 'index.html' },
    { name: 'Контакты', path: 'contacts.html' },
  ];

  const content = `
<div class="wrap">${crumbsHtml(crumbs, 0)}</div>

<section class="section section--tight">
  <div class="wrap">
    <h1>Контакты студии nail.lounge</h1>
    <p class="section__lead">${esc(site.address.city)}, ${esc(site.address.street)}. ${esc(site.metro.walk)} от метро «${esc(site.metro.name)}», рядом ${esc(site.landmarks.join(' и '))}.</p>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="split">
      <div>
        <div class="card">
          <h2>Как связаться</h2>
          <div class="u-mt">${channelList(0)}</div>
        </div>
        <div class="card u-mt-sm">
          <h2>Адрес и режим работы</h2>
          <p class="hero__meta-row u-mt-sm">${icon('pin')}<span>${esc(site.address.city)}, ${esc(site.address.street)}, ${esc(site.address.postalCode)}<br>Ориентиры: ${esc(site.landmarks.join(', '))}</span></p>
          <p class="hero__meta-row">${icon('clock')}<span>${esc(site.hours[0].days)}, ${esc(site.hours[0].time)}</span></p>
          <p class="hero__meta-row">${icon('wallet')}<span>Оплата наличными и картой в студии</span></p>
          <p class="hero__meta-row">${icon('instagram')}<a href="${esc(site.instagram.url)}" target="_blank" rel="noopener nofollow">${esc(site.instagram.label)}</a></p>
        </div>
      </div>
      ${mapBlock()}
    </div>
  </div>
</section>

<section class="section section--soft">
  <div class="wrap">
    <div class="split">
      <div>
        ${sectionHead({ kicker: 'Дорога', title: contactsExtra.route.title })}
        ${stepsList(contactsExtra.route.steps)}
        ${DEMO && contactsExtra.route.demo ? `<p class="note">${esc(contactsExtra.route.note)}</p>` : ''}
        ${
          contactsExtra.parking
            ? `<div class="card u-mt">
          <h3>${icon('pin')} На машине</h3>
          <p class="u-mt-sm text-muted">${esc(contactsExtra.parking)}</p>
        </div>`
            : ''
        }
      </div>
      <div>
        ${photo({
          name: 'entrance',
          label: 'Фото: вход в студию',
          alt: 'Вход в студию nail.lounge на проспекте Независимости, 11/2',
          w: 800,
          h: 900,
        })}
      </div>
    </div>
  </div>
</section>

<section class="section" id="form">
  <div class="wrap">
    <div class="card">
      ${sectionHead({ title: contactsExtra.formTitle, lead: contactsExtra.formLead })}
      ${bookingForm({ id: 'contacts-form', depth: 0 })}
    </div>
  </div>
</section>
`;

  return layout({
    title: 'Контакты — nail.lounge, Независимости 11/2, Минск',
    description:
      'Адрес студии nail.lounge: Минск, проспект Независимости, 11/2, рядом с метро «Площадь Ленина» и ТЦ «Столица». Телефон, мессенджеры, режим работы и дорога от метро.',
    path: 'contacts.html',
    active: 'contacts.html',
    crumbs,
    content,
  });
}
