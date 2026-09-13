#!/usr/bin/env node
/**
 * Показ сайта на телефоне. Запуск: npm run phone
 *
 * Поднимает сервер, доступный с других устройств домашней сети, и печатает
 * адрес, который надо набрать в браузере телефона. Телефон и компьютер
 * должны быть в одном Wi-Fi.
 *
 * В отличие от редактора, этот сервер только отдаёт готовые страницы: ни формы
 * сохранения, ни доступа к файлам проекта у него нет. Поэтому его и можно
 * открыть в сеть, а редактор — нельзя.
 */
import { createServer } from 'node:http';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveFile, lanAddresses } from './lib/static.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 8080;

const server = createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Только чтение');
  }
  const { code, body, type } = serveFile(ROOT, new URL(req.url, 'http://localhost').pathname);
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(req.method === 'HEAD' ? undefined : body);
});

server.listen(PORT, '0.0.0.0', () => {
  const addrs = lanAddresses();
  console.log('');
  console.log('  Сайт открыт для телефона.');
  console.log('');
  if (addrs.length) {
    console.log('  Наберите этот адрес в браузере телефона:');
    addrs.forEach((a) => console.log(`      http://${a}:${PORT}`));
    console.log('');
    console.log('  Телефон должен быть в том же Wi-Fi, что и компьютер.');
  } else {
    console.log('  Не удалось определить адрес компьютера в сети.');
    console.log('  Проверьте, подключён ли компьютер к Wi-Fi или кабелю.');
  }
  console.log(`  На этом компьютере: http://127.0.0.1:${PORT}`);
  console.log('');
  console.log('  Windows может спросить разрешение для Node.js — нажмите');
  console.log('  «Разрешить доступ» для частных сетей, иначе телефон не достучится.');
  console.log('');
  console.log('  Чтобы закончить — закройте это окно или нажмите Ctrl+C.');
  console.log('');
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`\n  Порт ${PORT} занят. Запустите на другом: PORT=8081 npm run phone\n`);
  } else {
    console.error('\n  Не удалось запустить:', e.message, '\n');
  }
  process.exit(1);
});
