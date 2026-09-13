// Генератор мест под фотографии. Настоящих снимков студии у нас нет, а брать
// чужие из 2ГИС и инстаграма нельзя — права у авторов. Поэтому на их местах
// аккуратные заглушки в палитре сайта: имя файла и размер те же, реальное
// фото кладётся поверх одним копированием, вёрстка не сдвигается.
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const IMG_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'assets', 'img');

/**
 * Настоящее фото побеждает заглушку. Достаточно положить в assets/img файл
 * с тем же именем — hero-studio.webp вместо hero-studio.svg — и пересобрать:
 * ни строчки кода править не нужно.
 */
const REAL_EXT = ['.webp', '.jpg', '.jpeg', '.png', '.avif'];
const realFile = (name) => {
  for (const ext of REAL_EXT) if (existsSync(join(IMG_DIR, name + ext))) return name + ext;
  return null;
};

const PALETTES = [
  ['#F2ECF7', '#DFD3EC', '#7A6494'],
  ['#F3EFF6', '#DED6E8', '#6C74A0'],
  ['#F5EFF5', '#E4D7E4', '#8E6597'],
  ['#EEF2EF', '#D9E2DB', '#5C6E61'],
  ['#F4EEF3', '#E2D5E0', '#8A5F7A'],
];

const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const registry = new Map();
const replaced = new Set();
const clean = (s) => String(s).replace(/[<>&"]/g, '');

function svgFor(name, label, w, h) {
  const seed = hash(name);
  const [bg, mid, accent] = PALETTES[seed % PALETTES.length];
  const cx = 0.28 + ((seed >> 3) % 44) / 100;
  const cy = 0.26 + ((seed >> 7) % 40) / 100;
  const r = 0.26 + ((seed >> 11) % 20) / 100;
  const rot = ((seed >> 5) % 50) - 25;
  const s = Math.min(w, h);
  const round = (n) => Math.round(n);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${clean(label)}">
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${mid}"/>
  </linearGradient>
  <clipPath id="c"><rect width="${w}" height="${h}"/></clipPath>
</defs>
<g clip-path="url(#c)">
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${round(w * cx)}" cy="${round(h * cy)}" r="${round(s * r)}" fill="${accent}" opacity="0.12"/>
  <g transform="rotate(${rot} ${round(w * 0.74)} ${round(h * 0.72)})" opacity="0.14">
    <rect x="${round(w * 0.58)}" y="${round(h * 0.52)}" width="${round(w * 0.4)}" height="${round(h * 0.44)}" rx="${round(s * 0.14)}" fill="${accent}"/>
  </g>
  <g transform="translate(${round(w / 2)} ${round(h / 2 - s * 0.05)})" fill="none" stroke="${accent}" stroke-opacity="0.55" stroke-width="${Math.max(1.5, s * 0.008)}" stroke-linejoin="round">
    <path d="M${-s * 0.1} ${-s * 0.16} h${s * 0.2} a${s * 0.1} ${s * 0.1} 0 0 1 ${s * 0.1} ${s * 0.1} v${s * 0.12} a${s * 0.1} ${s * 0.1} 0 0 1 ${-s * 0.1} ${s * 0.1} h${-s * 0.2} a${s * 0.1} ${s * 0.1} 0 0 1 ${-s * 0.1} ${-s * 0.1} v${-s * 0.12} a${s * 0.1} ${s * 0.1} 0 0 1 ${s * 0.1} ${-s * 0.1} z"/>
    <circle cx="0" cy="${s * 0.02}" r="${s * 0.06}"/>
  </g>
  <text x="${round(w / 2)}" y="${round(h / 2 + s * 0.2)}" text-anchor="middle"
        font-family="Manrope, Segoe UI, Helvetica, Arial, sans-serif" font-size="${Math.max(11, Math.min(30, round(s * 0.04)))}"
        font-weight="600" fill="${accent}" fill-opacity="0.9">${clean(label)}</text>
</g>
</svg>`;
}

/**
 * Регистрирует место под фотографию и возвращает готовый <img>.
 * @param {object} o
 * @param {string} o.name  имя файла без расширения — по нему кладут реальный снимок
 * @param {string} o.label подпись внутри заглушки: что здесь должно быть
 * @param {string} o.alt   alt для доступности и поиска
 */
export function photo({ name, label, alt, w = 800, h = 600, depth = 0, className = '', sizes = '', priority = false }) {
  const real = realFile(name);
  if (real) replaced.add(name);
  else registry.set(name, { label, w, h });
  const src = (depth ? '../'.repeat(depth) : '') + `assets/img/${real || name + '.svg'}`;
  const cls = ['photo', className].filter(Boolean).join(' ');
  const load = priority ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<img class="${cls}" src="${src}" width="${w}" height="${h}" alt="${clean(alt)}" ${load} decoding="async"${sizes ? ` sizes="${sizes}"` : ''}>`;
}

export function writePhotos(outDir) {
  const dir = join(outDir, 'assets', 'img');
  mkdirSync(dir, { recursive: true });
  for (const [name, meta] of registry) {
    writeFileSync(join(dir, `${name}.svg`), svgFor(name, meta.label, meta.w, meta.h));
  }
  return registry.size;
}

/** Список мест под фотографии — попадает в отчёт сборки: npm run photos. */
export const photoList = () => [...registry.entries()].map(([name, m]) => ({ name, ...m }));

/** Сколько заглушек уже заменено настоящими снимками. */
export const photosReplaced = () => replaced.size;
