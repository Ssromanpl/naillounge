// Данные сайта лежат в JSON рядом с этими модулями: так их безопасно правит
// редактор (`npm run edit`) — ему не приходится переписывать JavaScript.
// Модули .mjs остаются тонкой обёрткой: подгружают JSON и считают
// производные значения, которые в самих данных хранить незачем.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));

export const loadJson = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), 'utf8'));
