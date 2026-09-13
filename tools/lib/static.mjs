/**
 * Общая часть двух локальных серверов: редактора и просмотра с телефона.
 * Проверка пути живёт здесь в единственном экземпляре — именно на ней
 * я однажды ошибся, сравнив пути со слешем «/», из-за чего на Windows
 * не открывалась ни одна страница.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, relative, isAbsolute, extname, sep } from 'node:path';
import { networkInterfaces } from 'node:os';

export const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

/** Служебные папки наружу не отдаём никогда. */
const BLOCKED = /^(src|tools|node_modules|dist|\.git)[\\/]/;

/**
 * Путь обязан остаться внутри проекта. relative() знает разделитель своей
 * системы — на Windows он обратный, и сравнение строк с «/» отвергало всё.
 */
export function insideRoot(root, file) {
  const rel = relative(root, file);
  if (rel === '' || isAbsolute(rel)) return false;
  // «..» именно как отдельный сегмент: файл «..заметки.html» законен.
  return rel !== '..' && !rel.startsWith('..' + sep);
}

/**
 * Отдаёт файл сайта из корня проекта.
 * @returns {{code:number, body:Buffer|string, type:string}}
 */
export function serveFile(root, urlPath, prefix = '') {
  const rel = decodeURIComponent(urlPath.replace(prefix, '').replace(/^\//, '')) || 'index.html';
  const file = resolve(root, rel);

  if (!insideRoot(root, file)) return { code: 403, body: 'Нельзя: путь ведёт за пределы проекта', type: MIME['.txt'] };
  if (BLOCKED.test(rel.replace(/\\/g, '/'))) return { code: 403, body: 'Нельзя: служебная папка', type: MIME['.txt'] };

  if (!existsSync(file) || statSync(file).isDirectory()) {
    const fallback = join(root, '404.html');
    if (existsSync(fallback)) return { code: 404, body: readFileSync(fallback), type: MIME['.html'] };
    return { code: 404, body: 'Не найдено', type: MIME['.txt'] };
  }
  return { code: 200, body: readFileSync(file), type: MIME[extname(file)] || 'application/octet-stream' };
}

/** Адреса компьютера в домашней сети — по ним и заходят с телефона. */
export function lanAddresses() {
  const out = [];
  for (const list of Object.values(networkInterfaces())) {
    for (const nic of list || []) {
      if (nic.family === 'IPv4' && !nic.internal) out.push(nic.address);
    }
  }
  return out;
}
