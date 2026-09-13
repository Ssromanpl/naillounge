// Общая обвязка страниц: шапка, подвал, окно записи, липкая панель действий,
// cookie-баннер и микроразметка. Страницы отдают сюда только содержимое.
import { site, nav } from '../data/site.mjs';
import { services } from '../data/services.mjs';
import { masters } from '../data/masters.mjs';
import { priceCategories } from '../data/prices.mjs';
import { icon } from './icons.mjs';

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Относительный путь: страницы в подпапках получают «../». */
export const url = (path, depth = 0) => (depth ? '../'.repeat(depth) + path : path);

/**
 * Черновик: DEMO=1 node build.mjs.
 * Плашка сверху и запрет индексации — чтобы выложенный на показ макет
 * с придуманными ценами не нашли поиском и не приняли за настоящий сайт.
 */
export const DEMO = process.env.DEMO === '1';

const serviceOptions = () =>
  priceCategories
    .map(
      (c) =>
        `<optgroup label="${esc(c.title)}">` +
        c.groups
          .flatMap((g) => g.items)
          .map((i) => `<option value="${esc(i.name)}">${esc(i.name)}</option>`)
          .join('') +
        '</optgroup>'
    )
    .join('');

const masterOptions = () =>
  masters.map((m) => `<option value="${esc(m.name)}">${esc(m.name)} — ${esc(m.role.toLowerCase())}</option>`).join('');

/** Кнопки мессенджеров: и в окне записи, и на странице контактов. */
export function channelList(depth = 0, ids = null) {
  const list = ids ? site.channels.filter((c) => ids.includes(c.id)) : site.channels;
  const phone = `<a class="channel" href="${site.phonePrimary.href}" data-goal="phone">
      ${icon('phone')}
      <span class="channel__body"><span>Позвонить</span><span class="channel__note">${esc(site.phonePrimary.label)}</span></span>
    </a>`;
  return `<div class="channels">
    ${phone}
    ${list
      .map(
        (c) => `<a class="channel" href="${esc(c.href)}" data-goal="${esc(c.id)}"${
          c.href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''
        }>
      ${icon(c.id)}
      <span class="channel__body"><span>${esc(c.title)}</span><span class="channel__note">${esc(c.note)}</span></span>
    </a>`
      )
      .join('\n    ')}
  </div>`;
}

/** Форма записи. Одна и та же в окне и на странице контактов. */
export function bookingForm({ id = 'booking-form', depth = 0 } = {}) {
  return `
<form class="form" id="${id}" novalidate>
  <div class="form__row">
    <label class="field">
      <span class="field__label">Как вас зовут</span>
      <input class="field__input" type="text" name="name" autocomplete="name" required placeholder="Имя">
      <span class="field__error" data-error-for="name"></span>
    </label>
    <label class="field">
      <span class="field__label">Телефон</span>
      <input class="field__input" type="tel" name="phone" autocomplete="tel" required inputmode="tel"
             placeholder="+375 29 000-00-00" data-phone>
      <span class="field__error" data-error-for="phone"></span>
    </label>
  </div>
  <div class="form__row">
    <label class="field">
      <span class="field__label">Услуга</span>
      <select class="field__input" name="service" data-service-select>
        <option value="">Ещё не решили — подскажем</option>
        ${serviceOptions()}
      </select>
    </label>
    <label class="field">
      <span class="field__label">Мастер</span>
      <select class="field__input" name="master" data-master-select>
        <option value="">Любой свободный</option>
        ${masterOptions()}
      </select>
    </label>
  </div>
  <div class="form__row">
    <label class="field">
      <span class="field__label">Удобный день</span>
      <input class="field__input" type="date" name="date" data-date>
    </label>
    <label class="field">
      <span class="field__label">Удобное время</span>
      <select class="field__input" name="time">
        <option value="">Не принципиально</option>
        <option>Утро, 09:00–12:00</option>
        <option>День, 12:00–16:00</option>
        <option>Вечер, 16:00–21:00</option>
      </select>
    </label>
  </div>
  <label class="field">
    <span class="field__label">Комментарий <span class="field__opt">— необязательно</span></span>
    <textarea class="field__input" name="comment" rows="2" placeholder="Например: хочу исправить домашний маникюр, ногти короткие"></textarea>
  </label>
  <label class="check">
    <input type="checkbox" name="consent" value="yes" required>
    <span>Согласен(на) на обработку персональных данных согласно <a href="${url('legal/privacy.html', depth)}">политике обработки данных</a></span>
  </label>
  <span class="field__error" data-error-for="consent"></span>
  <button class="btn btn--primary btn--block" type="submit">Записаться</button>
  <p class="form__note">Администратор подтвердит запись в течение дня. Или позвоните: <a href="${site.phonePrimary.href}">${esc(site.phonePrimary.label)}</a>.</p>

  <div class="form__done" role="status" hidden>
    <strong>Заявка готова.</strong> Отправьте её в удобный мессенджер — кнопки ниже.
  </div>
  <div class="form__send" hidden>
    <div class="channels">
      <a class="channel" href="#" data-send="telegram" target="_blank" rel="noopener">${icon('telegram')}
        <span class="channel__body"><span>Отправить в Telegram</span><span class="channel__note">откроется с готовым текстом</span></span></a>
      <a class="channel" href="#" data-send="whatsapp" target="_blank" rel="noopener">${icon('whatsapp')}
        <span class="channel__body"><span>Отправить в WhatsApp</span><span class="channel__note">откроется с готовым текстом</span></span></a>
      <a class="channel" href="#" data-send="viber">${icon('viber')}
        <span class="channel__body"><span>Написать в Viber</span><span class="channel__note">текст ниже можно скопировать</span></span></a>
      <a class="channel" href="#" data-send="copy">${icon('check')}
        <span class="channel__body"><span>Скопировать текст заявки</span><span class="channel__note">и отправить как удобно</span></span></a>
    </div>
    <label class="field">
      <span class="field__label">Текст заявки</span>
      <textarea class="field__input" rows="6" data-message readonly></textarea>
    </label>
  </div>
</form>`;
}

function header(depth, active) {
  const u = (p) => url(p, depth);
  const links = nav
    .map(
      (n) =>
        `<a class="topbar__link${active === n.href ? ' is-active' : ''}" href="${u(n.href)}">${esc(n.title)}</a>`
    )
    .join('');
  return `
<header class="topbar" id="top">
  <div class="wrap topbar__inner">
    <a class="logo" href="${u('index.html')}">
      <span class="logo__mark" aria-hidden="true">${icon('sparkle')}</span>
      <span class="logo__text">
        <span class="logo__name">nail.lounge</span>
        <span class="logo__sub">маникюр · педикюр · брови</span>
      </span>
    </a>
    <nav class="topbar__nav" aria-label="Основное меню">${links}</nav>
    <div class="topbar__actions">
      <a class="topbar__phone" href="${site.phonePrimary.href}" data-goal="phone">
        ${icon('phone')}<span>${esc(site.phonePrimary.label)}</span>
      </a>
      <button class="btn btn--primary btn--sm" type="button" data-book>Записаться</button>
      <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Меню">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu" hidden>
    <div class="wrap">
      <nav class="mobile-menu__nav" aria-label="Меню">
        ${nav.map((n) => `<a href="${u(n.href)}">${esc(n.title)}</a>`).join('\n        ')}
        <a href="${u('gift.html')}">Подарочные сертификаты</a>
      </nav>
      <div class="mobile-menu__meta">
        <p>${esc(site.hoursShort)}</p>
        <a href="${site.phonePrimary.href}" data-goal="phone">${esc(site.phonePrimary.label)}</a>
      </div>
    </div>
  </div>
</header>`;
}

function footer(depth) {
  const u = (p) => url(p, depth);
  const l = site.legal;
  return `
<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div class="footer__col">
        <a class="logo" href="${u('index.html')}">
          <span class="logo__mark" aria-hidden="true">${icon('sparkle')}</span>
          <span class="logo__text"><span class="logo__name">nail.lounge</span></span>
        </a>
        <p class="footer__addr">${esc(site.address.city)}, ${esc(site.address.street)}<br>метро «${esc(site.metro.name)}», ${esc(site.metro.distance)}</p>
        <p class="footer__hours">${esc(site.hours[0].days)}: ${esc(site.hours[0].time)}</p>
        <p class="footer__social">
          <a href="${esc(site.instagram.url)}" target="_blank" rel="noopener nofollow">${icon('instagram')}<span>${esc(site.instagram.label)}</span></a>
        </p>
      </div>

      <div class="footer__col">
        <h2 class="footer__title">Услуги</h2>
        <ul class="footer__list">
          ${services.map((s) => `<li><a href="${u(s.slug + '.html')}">${esc(s.title)}</a></li>`).join('\n          ')}
          <li><a href="${u('prices.html')}">Цены</a></li>
          <li><a href="${u('gift.html')}">Подарочные сертификаты</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <h2 class="footer__title">Мастера</h2>
        <ul class="footer__list">
          ${masters.map((m) => `<li><a href="${u('masters/' + m.slug + '.html')}">${esc(m.name)}</a></li>`).join('\n          ')}
        </ul>
      </div>

      <div class="footer__col">
        <h2 class="footer__title">Связаться</h2>
        <ul class="footer__list">
          <li><a href="${site.phonePrimary.href}" data-goal="phone">${esc(site.phonePrimary.label)}</a></li>
          ${site.channels
            .filter((c) => c.id !== 'instagram')
            .map((c) => `<li><a href="${esc(c.href)}" data-goal="${esc(c.id)}">${esc(c.title)}</a></li>`)
            .join('\n          ')}
          <li><a href="${u('contacts.html')}">Как нас найти</a></li>
          <li><a href="${u('works.html')}">Работы</a></li>
          <li><a href="${u('reviews.html')}">Отзывы</a></li>
        </ul>
      </div>
    </div>

    <div class="footer__legal">
      <p>
        <strong>${esc(l.entity)}</strong>, УНП ${esc(l.unp)}.
        Зарегистрировано ${esc(l.registrar)} ${esc(l.registeredAt)}.
        Юридический адрес: ${esc(l.legalAddress)}.
        Режим работы: ${esc(site.hoursShort)}.
      </p>
      <p>Информация на сайте не является публичной офертой. Итоговую стоимость услуги спрашивайте у мастера до начала работы.</p>
      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} nail.lounge, ${esc(site.address.city)}</span>
        <nav class="footer__policies" aria-label="Правовые документы">
          <a href="${u('legal/offer.html')}">Публичная оферта</a>
          <a href="${u('legal/privacy.html')}">Обработка персональных данных и cookie</a>
          <a href="${u('sitemap.xml')}">Карта сайта</a>
        </nav>
      </div>
    </div>
  </div>
</footer>

<div class="actionbar" aria-label="Быстрые действия">
  <a class="actionbar__btn" href="${site.phonePrimary.href}" data-goal="phone">${icon('phone')}<span>Позвонить</span></a>
  <a class="actionbar__btn" href="${u('prices.html')}">${icon('wallet')}<span>Цены</span></a>
  <button class="actionbar__btn actionbar__btn--primary" type="button" data-book>${icon('calendar')}<span>Записаться</span></button>
</div>

<dialog class="modal" id="booking-modal" aria-labelledby="booking-modal-title">
  <div class="modal__inner">
    <button class="modal__close" type="button" data-close-modal aria-label="Закрыть">&times;</button>
    <h2 class="modal__title" id="booking-modal-title">Записаться в nail.lounge</h2>
    <p class="modal__lead">Напишите, где удобно, — администратор подберёт время. Работаем ${esc(site.hoursShort)}.</p>
    ${channelList(depth)}
    <div class="modal__divider">или оставьте заявку</div>
    ${bookingForm({ id: 'booking-form-modal', depth })}
  </div>
</dialog>

<div class="cookiebar" id="cookiebar" hidden>
  <div class="cookiebar__inner">
    <p>Мы используем cookie и статистику посещений. Подробности — в <a href="${u('legal/privacy.html')}">политике обработки данных</a>.</p>
    <div class="cookiebar__actions">
      <button class="btn btn--ghost btn--sm" type="button" data-cookie="decline">Только необходимые</button>
      <button class="btn btn--primary btn--sm" type="button" data-cookie="accept">Принять</button>
    </div>
  </div>
</div>`;
}

/** Основная карточка организации — она же в поиске и на картах. */
function jsonLdSalon() {
  const l = site.legal;
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': `${site.origin}/#salon`,
    name: site.name,
    alternateName: site.instagramNick,
    legalName: l.demo ? undefined : l.entity,
    taxID: l.demo ? undefined : l.unp,
    url: `${site.origin}/`,
    image: `${site.origin}/assets/img/og.png`,
    logo: `${site.origin}/assets/img/logo.svg`,
    description:
      'Студия маникюра, педикюра и оформления бровей в центре Минска, рядом с метро «Площадь Ленина». Работает с 2021 года, ежедневно с 09:00 до 21:00.',
    foundingDate: '2021',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lon },
    telephone: site.phonePrimary.raw,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    priceRange: '$$',
    currenciesAccepted: 'BYN',
    publicAccess: true,
    sameAs: [site.instagram.url],
    // Разметку отзывов отдаём поисковикам только вместе с настоящими
    // отзывами на странице: за оценку, которой нет на сайте, Google
    // снимает звёзды со всей карточки.
    ...(site.rating.enabled
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: site.rating.value,
            reviewCount: String(site.rating.count),
            bestRating: '5',
          },
        }
      : {}),
    areaServed: [{ '@type': 'Place', name: 'Центр Минска' }],
    hasMap: `https://yandex.by/maps/?text=${encodeURIComponent(site.address.city + ', ' + site.address.street)}`,
  };
}

function jsonLdBreadcrumbs(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${site.origin}/${it.path}`.replace(/\/index\.html$/, '/'),
    })),
  };
}

/** Хлебные крошки в разметке страницы — по ним же строится микроразметка. */
export function crumbsHtml(items, depth) {
  return `<nav aria-label="Хлебные крошки"><ol class="crumbs">
    ${items
      .map((it, i) =>
        i === items.length - 1
          ? `<li aria-current="page">${esc(it.name)}</li>`
          : `<li><a href="${url(it.path, depth)}">${esc(it.name)}</a></li>`
      )
      .join('\n    ')}
  </ol></nav>`;
}

const demoBar = DEMO
  ? `<div class="demobar">
  <div class="wrap">
    <strong>Черновик сайта.</strong>
    Цены, тексты, отзывы и фотографии предварительные — их предстоит заменить на настоящие.
  </div>
</div>`
  : '';

export function layout({
  title,
  description,
  path,
  depth = 0,
  active = '',
  bodyClass = '',
  crumbs = null,
  jsonLd = [],
  content,
}) {
  const u = (p) => url(p, depth);
  const canonical = `${site.origin}/${path}`.replace(/\/index\.html$/, '/');
  const schemas = [jsonLdSalon(), ...(crumbs ? [jsonLdBreadcrumbs(crumbs)] : []), ...jsonLd];
  const config = {
    bookingEndpoint: site.booking.endpoint,
    phone: site.phonePrimary.raw,
    metrikaId: site.analytics.metrikaId,
    gaId: site.analytics.gaId,
  };

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#fcfafd">
${DEMO ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow">'}
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:site_name" content="nail.lounge — маникюр, педикюр, брови в Минске">
<meta property="og:locale" content="ru_RU">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.origin}/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${u('assets/img/favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${u('assets/img/apple-touch-icon.png')}">
<link rel="manifest" href="${u('site.webmanifest')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@500;600&family=Manrope:wght@400;600;700;800&display=swap">
<link rel="stylesheet" href="${u('assets/css/style.css')}">
<script>window.NL_CONFIG = ${JSON.stringify(config)};</script>
${schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Перейти к содержанию</a>
${demoBar}
${header(depth, active)}
<main id="main">
${content}
</main>
${footer(depth)}
<script src="${u('assets/js/main.js')}" defer></script>
</body>
</html>
`;
}
