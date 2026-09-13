// Проверка собранного сайта: микроразметка, метатеги, битые ссылки и якоря,
// доступность картинок, баланс тегов и запрещённые слова.
// Запуск: npm run check
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const walk = (d, out = []) => {
  for (const f of readdirSync(d)) {
    if (['.git', 'node_modules', 'src', 'tools', 'dist'].includes(f)) continue;
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
};

// .preview.html — вёрстка документов для печати, а не страницы сайта.
const htmls = walk(ROOT).filter((f) => f.endsWith('.html') && !f.endsWith('.preview.html'));
let errors = 0;
let warnings = 0;
const err = (m) => { console.log('  ✗ ' + m); errors++; };
const warn = (m) => { console.log('  ! ' + m); warnings++; };

// Заказчик просил называть раздел «Цены». Проверяем, что второе слово
// не просочилось обратно ни в тексты, ни в меню.
const BANNED = [['прайс', 'вместо него на сайте только «цены»']];

// Скидку на первый визит подтвердить не удалось, поэтому она выключена
// в данных. Пока выключатель стоит в «нет», упоминаний скидки на сайте
// быть не должно: обещание, которого студия не давала, дороже опечатки.
const site = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'site.json'), 'utf8')).site;
if (!site.rating.enabled) {
  // Оценка и число отзывов не подтверждены: ни на странице, ни в разметке.
  BANNED.push(['aggregateRating', 'рейтинг выключен в данных']);
  BANNED.push(['ratingValue', 'рейтинг выключен в данных']);
}

if (!site.firstVisit.enabled) {
  for (const word of ['скидк', '−10', 'первый визит', 'первом посещении']) {
    BANNED.push([word, 'скидка на первый визит выключена в данных']);
  }
}

for (const file of htmls) {
  const rel = file.replace(ROOT + '/', '');
  const html = readFileSync(file, 'utf8');
  console.log('— ' + rel);

  /* Микроразметка */
  let schemas = 0;
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); schemas++; } catch (e) { err('битая микроразметка: ' + e.message); }
  }
  if (!schemas) err('нет микроразметки Schema.org');

  /* Базовые теги */
  if (!/<html lang="ru">/.test(html)) err('нет lang="ru"');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(`h1 в количестве ${h1}`);
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) err('описание короткое или отсутствует');
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  if (title.length < 20 || title.length > 75) err(`заголовок длиной ${title.length}: ${title}`);
  if (!/<link rel="canonical"/.test(html)) err('нет canonical');
  if (!/property="og:image"/.test(html)) err('нет og:image — превью в мессенджерах будет пустым');

  /* Следы шаблонизатора */
  if (html.includes('${')) err('невыполненная подстановка');
  if (html.includes('undefined')) err('в разметке есть "undefined"');
  if (/\[object Object\]/.test(html)) err('следы отладки');
  for (const [word, hint] of BANNED) {
    if (new RegExp(word, 'i').test(html)) err(`запрещённое слово «${word}»: ${hint}`);
  }

  /* Доступность и верстка картинок */
  for (const m of html.matchAll(/<img[^>]*>/g)) {
    const tag = m[0];
    if (!/\salt="/.test(tag)) err('картинка без alt: ' + tag.slice(0, 70));
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) {
      err('картинка без размеров — страница будет прыгать при загрузке: ' + tag.slice(0, 70));
    }
  }

  /* Запись должна быть доступна с каждой страницы */
  if (!/data-book/.test(html)) err('на странице негде записаться');
  if (!/class="actionbar"/.test(html)) err('нет липкой панели действий');

  /* Ссылки и якоря */
  const dir = dirname(file);
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|viber:|data:|#)/.test(ref)) continue;
    const [path, hash] = ref.split('#');
    if (!path) continue;
    const target = resolve(dir, path);
    if (!existsSync(target)) err(`битая ссылка: ${ref}`);
    else if (hash && target.endsWith('.html')) {
      const t = readFileSync(target, 'utf8');
      if (!new RegExp(`id="${hash}"`).test(t)) err(`нет якоря #${hash} в ${path}`);
    }
  }

  /* Баланс тегов */
  for (const tag of ['div', 'section', 'article', 'ul', 'ol', 'li', 'form', 'dialog', 'figure', 'details', 'nav']) {
    const open = (html.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
    const close = (html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    if (open !== close) err(`несбалансированный <${tag}>: ${open} открыто, ${close} закрыто`);
  }

  /* Незаполненные данные — не ошибка, но перед запуском их быть не должно */
  const placeholders = (html.match(/‹[^›]+›/g) || []).length;
  if (placeholders) warn(`незаполненных данных: ${placeholders} (реквизиты юрлица)`);
}

console.log('');
if (warnings) console.log(`Предупреждений: ${warnings} — это заготовки, которые заполняются перед запуском.`);
console.log(errors ? `ОШИБОК: ${errors}` : `Всё чисто: ${htmls.length} страниц`);
process.exit(errors ? 1 : 0);
