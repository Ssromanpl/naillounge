#!/usr/bin/env node
/**
 * Сборка сайта студии nail.lounge.
 * Никаких зависимостей: `node build.mjs` — и рядом готовые HTML-файлы,
 * которые кладутся на любой статический хостинг.
 *
 * Черновик для показа: `DEMO=1 node build.mjs` — добавляет плашку
 * «черновик» и закрывает сайт от поисковиков.
 */
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from './src/data/site.mjs';
import { services } from './src/data/services.mjs';
import { masters } from './src/data/masters.mjs';
import { homePage } from './src/pages/home.mjs';
import { servicePage } from './src/pages/service.mjs';
import { pricesPage } from './src/pages/prices.mjs';
import { mastersIndexPage, masterPage } from './src/pages/masters.mjs';
import { worksPage } from './src/pages/works.mjs';
import { reviewsPage } from './src/pages/reviews.mjs';
import { contactsPage } from './src/pages/contacts.mjs';
import { giftPage } from './src/pages/gift.mjs';
import { offerPage, privacyPage, notFoundPage } from './src/pages/legal.mjs';
import { writePhotos, photoList, photosReplaced } from './src/lib/photo.mjs';
import { Canvas } from './src/lib/png.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DEMO = process.env.DEMO === '1';

const write = (rel, content) => {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  return rel;
};

/* --- Страницы ------------------------------------------------------------ */
const pages = [
  ['index.html', homePage(), { priority: '1.0', changefreq: 'weekly' }],
  ...services.map((s) => [`${s.slug}.html`, servicePage(s), { priority: '0.9', changefreq: 'monthly' }]),
  ['prices.html', pricesPage(), { priority: '0.9', changefreq: 'weekly' }],
  ['masters.html', mastersIndexPage(), { priority: '0.8', changefreq: 'monthly' }],
  ...masters.map((m) => [`masters/${m.slug}.html`, masterPage(m), { priority: '0.7', changefreq: 'monthly' }]),
  ['works.html', worksPage(), { priority: '0.7', changefreq: 'weekly' }],
  ['reviews.html', reviewsPage(), { priority: '0.7', changefreq: 'monthly' }],
  ['contacts.html', contactsPage(), { priority: '0.8', changefreq: 'monthly' }],
  ['gift.html', giftPage(), { priority: '0.6', changefreq: 'monthly' }],
  ['legal/offer.html', offerPage(), { priority: '0.3', changefreq: 'yearly' }],
  ['legal/privacy.html', privacyPage(), { priority: '0.3', changefreq: 'yearly' }],
  ['404.html', notFoundPage(), null],
];

// Старые сборки подстраниц удаляем, чтобы не оставалось «сирот»:
// переименовали мастера — его прежняя страница не должна висеть в поиске.
for (const dir of ['masters', 'legal']) {
  const p = join(ROOT, dir);
  if (existsSync(p)) rmSync(p, { recursive: true, force: true });
}

const written = pages.map(([path, html]) => write(path, html));

/* --- Места под фотографии ------------------------------------------------ */
const photos = writePhotos(ROOT);

/* --- Значки и превью для мессенджеров ------------------------------------ */
const PAPER = [252, 250, 253];
const ACCENT = [122, 100, 148];
const INK = [36, 31, 42];

write(
  'assets/img/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#7a6494"/>
  <path d="M32 14c-5 0-8 3-8 7v20c0 5 3 8 8 8s8-3 8-8V21c0-4-3-7-8-7Z" fill="#fff" opacity=".92"/>
  <circle cx="32" cy="32" r="4" fill="#7a6494"/>
</svg>`
);

write(
  'assets/img/logo.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 64" width="300" height="64">
  <rect x="4" y="8" width="48" height="48" rx="14" fill="#7a6494"/>
  <path d="M28 18c-4 0-6.5 2.4-6.5 5.6v16.8c0 3.2 2.5 5.6 6.5 5.6s6.5-2.4 6.5-5.6V23.6c0-3.2-2.5-5.6-6.5-5.6Z" fill="#fff" opacity=".92"/>
  <text x="68" y="40" font-family="Lora, Georgia, serif" font-size="26" font-weight="600" fill="#241f2a">nail.lounge</text>
  <text x="68" y="53" font-family="Manrope, Segoe UI, Arial, sans-serif" font-size="11" fill="#6e6675">маникюр · педикюр · брови · Минск</text>
</svg>`
);

const touch = new Canvas(180, 180, PAPER);
touch.fill(0, 0, 180, 180, ACCENT);
touch.mark(90, 92, 108, [255, 255, 255]);
write('assets/img/apple-touch-icon.png', touch.toPNG());

// Превью для мессенджеров: трафик пойдёт из инстаграма и Telegram,
// поэтому картинка важнее, чем кажется.
const og = new Canvas(1200, 630, PAPER);
og.gradient([253, 250, 248], [243, 233, 230]);
og.circle(990, 190, 300, ACCENT, 0.1);
og.circle(160, 560, 220, ACCENT, 0.07);
og.circle(150, 150, 78, ACCENT);
og.mark(150, 152, 92, [255, 255, 255]);
og.fill(80, 300, 440, 8, ACCENT);
og.fill(80, 372, 700, 4, INK, 0.12);
og.fill(80, 420, 560, 4, INK, 0.12);
og.fill(80, 468, 620, 4, INK, 0.12);
write('assets/img/og.png', og.toPNG());

/* --- robots.txt, карта сайта, манифест ----------------------------------- */
const today = new Date().toISOString().slice(0, 10);
const loc = (p) => `${site.origin}/${p}`.replace(/\/index\.html$/, '/');

write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter(([, , meta]) => meta)
  .map(
    ([path, , meta]) =>
      `  <url>\n    <loc>${loc(path)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${meta.changefreq}</changefreq>\n    <priority>${meta.priority}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`
);

// В черновике закрываем сайт от поисковиков целиком: макет с придуманными
// ценами не должен находиться по запросу «nail lounge минск».
write(
  'robots.txt',
  DEMO
    ? `User-agent: *
Disallow: /
`
    : `User-agent: *
Allow: /
Disallow: /404.html

Sitemap: ${site.origin}/sitemap.xml
Host: ${site.origin.replace('https://', '')}
`
);

write(
  'site.webmanifest',
  JSON.stringify(
    {
      name: site.fullName,
      short_name: 'nail.lounge',
      description: 'Маникюр, педикюр и брови в центре Минска, у метро «Площадь Ленина».',
      lang: 'ru',
      start_url: './',
      display: 'standalone',
      background_color: '#fcfafd',
      theme_color: '#fcfafd',
      icons: [
        { src: 'assets/img/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        { src: 'assets/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    null,
    2
  ) + '\n'
);

// GitHub Pages не должен прогонять файлы через Jekyll.
write('.nojekyll', '');

/* --- Отчёт --------------------------------------------------------------- */
const real = photosReplaced();
console.log(
  `Готово${DEMO ? ' (черновик)' : ''}: ${written.length} страниц, ` +
    `${photos} мест под фотографии${real ? `, настоящих снимков: ${real}` : ''}.`
);
written.forEach((f) => console.log('  ' + f));

if (process.env.PHOTOS === '1') {
  console.log('\nМеста под фотографии. Положите в assets/img файл с таким же именем');
  console.log('и расширением .webp или .jpg — заглушка сама уступит место снимку.\n');
  photoList().forEach((p) => console.log(`  ${p.name} — ${p.label} (${p.w}×${p.h})`));
}
