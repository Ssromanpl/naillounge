#!/usr/bin/env node
/**
 * Собирает PDF из markdown-документа. Запуск: npm run pdf [файл]
 * По умолчанию берёт FACTS.md и кладёт рядом FACTS.pdf.
 *
 * Внешних пакетов не требует. Печатает браузером: сначала пробует
 * Playwright, если он есть в системе, иначе зовёт Chrome или Chromium
 * через `--print-to-pdf`. Браузер есть у всех, а кириллицу и таблицы
 * он раскладывает лучше, чем любая самописная генерация.
 */
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2] || 'FACTS.md';
const src = resolve(ROOT, source);
const out = src.replace(/\.md$/i, '.pdf');

if (!existsSync(src)) {
  console.error(`\n  Не нашёл файл ${source}. Укажите его первым аргументом: npm run pdf -- README.md\n`);
  process.exit(1);
}

/* --- Разметка ------------------------------------------------------------
   Свой разбор markdown, а не библиотека: документу нужны только заголовки,
   абзацы, списки, таблицы и жирный текст. Всё остальное в наших документах
   не встречается, а лишняя зависимость встречается всегда. */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(text) {
  return esc(text)
    .replace(/\\\|/g, '|')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

/** Строка таблицы: «| a | b |» → ячейки без пустых краёв. */
const cells = (line) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split(/(?<!\\)\|/)
    .map((c) => c.trim());

function render(md) {
  const lines = md.split('\n');
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    if (/^---+$/.test(line.trim())) { html.push('<hr>'); i++; continue; }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    // Таблица: строка заголовка, разделитель, дальше тело.
    if (line.trim().startsWith('|') && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] || '')) {
      const head = cells(line);
      i += 2;
      const body = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        body.push(cells(lines[i]));
        i++;
      }
      html.push(
        '<table><thead><tr>' +
          head.map((c) => `<th>${inline(c)}</th>`).join('') +
          '</tr></thead><tbody>' +
          body.map((row) => '<tr>' + row.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') +
          '</tbody></table>'
      );
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      html.push('<ul>' + items.map((t) => `<li>${inline(t)}</li>`).join('') + '</ul>');
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      html.push('<ol>' + items.map((t) => `<li>${inline(t)}</li>`).join('') + '</ol>');
      continue;
    }

    // Абзац: собираем до пустой строки.
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|\s*[-*]\s|\s*\d+\.\s|\|)/.test(lines[i]) && !/^---+$/.test(lines[i].trim())) {
      para.push(lines[i].trim());
      i++;
    }
    if (para.length) html.push(`<p>${inline(para.join(' '))}</p>`);
  }

  return html.join('\n');
}

const md = readFileSync(src, 'utf8');
const title = (md.match(/^#\s+(.*)$/m) || [, basename(src)])[1];
const today = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

const page = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<style>
  @page { size: A4; margin: 18mm 16mm 20mm; }

  :root {
    --ink: #241f2a; --ink-2: #504857; --ink-3: #6e6675;
    --accent: #7a6494; --accent-dark: #5f4c77; --soft: #f5f1f8; --line: #ddd3e6;
  }

  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "Manrope", "Liberation Sans", "DejaVu Sans", Arial, sans-serif;
    font-size: 10.2pt; line-height: 1.55; color: var(--ink);
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }

  h1, h2, h3 { font-family: "Lora", "Liberation Serif", "DejaVu Serif", Georgia, serif; line-height: 1.2; }
  h1 { font-size: 23pt; margin: 0 0 4mm; }
  h2 {
    font-size: 15pt; margin: 9mm 0 3mm; padding-top: 3mm;
    border-top: 2px solid var(--accent); color: var(--accent-dark);
    break-after: avoid;
  }
  h3 { font-size: 11.5pt; margin: 6mm 0 2mm; break-after: avoid; }
  p { margin: 0 0 3mm; }
  hr { display: none; }

  a { color: var(--accent-dark); text-decoration: none; }
  code {
    font-family: "DejaVu Sans Mono", "Liberation Mono", monospace;
    font-size: .88em; background: var(--soft); padding: 0 .35em; border-radius: 3px;
  }
  strong { font-weight: 700; }

  ul, ol { margin: 0 0 3mm; padding-left: 5mm; }
  li { margin-bottom: 1mm; }

  table {
    width: 100%; border-collapse: collapse; margin: 0 0 4mm;
    font-size: 9.2pt; break-inside: auto;
  }
  thead { display: table-header-group; }
  tr { break-inside: avoid; }
  th {
    text-align: left; vertical-align: top; padding: 2mm 2.5mm;
    background: var(--soft); color: var(--accent-dark);
    border-bottom: 1px solid var(--line); font-size: 8.6pt;
    text-transform: uppercase; letter-spacing: .04em;
  }
  td { vertical-align: top; padding: 2mm 2.5mm; border-bottom: 1px solid var(--line); color: var(--ink-2); }
  td:first-child { color: var(--ink); }

  /* Шапка первой страницы */
  .cover { border-bottom: 3px solid var(--accent); padding-bottom: 4mm; margin-bottom: 6mm; }
  .cover__brand {
    display: flex; align-items: center; gap: 3mm;
    font-size: 12pt; font-weight: 800; color: var(--accent-dark); margin-bottom: 3mm;
  }
  .cover__mark {
    display: inline-grid; place-items: center; width: 9mm; height: 9mm;
    border-radius: 2.5mm; background: var(--accent); color: #fff;
    font-family: "Lora", "Liberation Serif", Georgia, serif; font-size: 12pt;
  }
  .cover__meta { color: var(--ink-3); font-size: 9pt; }
</style>
</head>
<body>
<div class="cover">
  <div class="cover__brand"><span class="cover__mark">n</span>nail.lounge · Минск</div>
  <div class="cover__meta">Документ подготовлен ${esc(today)} · для обсуждения с владельцами студии</div>
</div>
${render(md)}
</body>
</html>`;

const tmp = mkdtempSync(join(tmpdir(), 'nl-pdf-'));
const htmlFile = join(tmp, 'doc.html');
writeFileSync(htmlFile, page);

// HTML=1 npm run pdf — оставить промежуточную вёрстку рядом с PDF.
// Удобно, когда правишь оформление документа и хочешь смотреть в браузере.
if (process.env.HTML === '1') {
  const copy = out.replace(/\.pdf$/, '.preview.html');
  writeFileSync(copy, page);
  console.log(`Вёрстка документа: ${basename(copy)}`);
}

const footer = `
  <div style="width:100%;padding:0 16mm;font-family:sans-serif;font-size:7.5pt;color:#6e6675;
              display:flex;justify-content:space-between;">
    <span>nail.lounge · ${esc(title)}</span>
    <span>стр. <span class="pageNumber"></span> из <span class="totalPages"></span></span>
  </div>`;

/** Сначала Playwright, если он есть: с ним получается колонтитул с номерами. */
async function printWithPlaywright() {
  const candidates = [
    'playwright',
    '/opt/node22/lib/node_modules/playwright/index.mjs',
    '/usr/lib/node_modules/playwright/index.mjs',
  ];
  for (const name of candidates) {
    try {
      const { chromium } = await import(name);
      const browser = await chromium.launch();
      const p = await browser.newPage();
      await p.goto('file://' + htmlFile, { waitUntil: 'networkidle' });
      await p.pdf({
        path: out,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: footer,
        margin: { top: '18mm', bottom: '20mm', left: '16mm', right: '16mm' },
      });
      await browser.close();
      return true;
    } catch {
      /* пробуем следующий путь */
    }
  }
  return false;
}

/** Запасной путь: обычный Chrome из системы, без всяких пакетов. */
function printWithChrome() {
  const binaries = [
    process.env.CHROME_PATH,
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'google-chrome',
    'chromium',
    'chromium-browser',
  ].filter(Boolean);

  for (const bin of binaries) {
    const r = spawnSync(bin, [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      `--print-to-pdf=${out}`,
      'file://' + htmlFile,
    ], { encoding: 'utf8' });
    if (r.status === 0 && existsSync(out)) return bin;
  }
  return null;
}

const viaPlaywright = await printWithPlaywright();
const viaChrome = viaPlaywright ? null : printWithChrome();
rmSync(tmp, { recursive: true, force: true });

if (!viaPlaywright && !viaChrome) {
  console.error(`
  Не нашёл браузер, которым можно напечатать PDF.
  Установите Google Chrome и запустите ещё раз — или укажите путь вручную:
  CHROME_PATH="/путь/к/chrome" npm run pdf
`);
  process.exit(1);
}

const size = (readFileSync(out).length / 1024).toFixed(0);
console.log(`Готово: ${basename(out)} — ${size} КБ (печатал ${viaPlaywright ? 'Playwright' : viaChrome}).`);
