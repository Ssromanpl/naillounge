#!/bin/bash
# Двойной клик по этому файлу запускает редактор сайта.
cd "$(dirname "$0")" || exit 1
clear

if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  Node.js не установлен — без него редактор не запустится."
  echo ""
  echo "  1. Откройте https://nodejs.org"
  echo "  2. Нажмите большую зелёную кнопку LTS и установите"
  echo "  3. Перезагрузите компьютер"
  echo "  4. Запустите этот файл ещё раз"
  echo ""
  read -n 1 -s -r -p "  Нажмите любую клавишу, чтобы закрыть окно…"
  exit 1
fi

node tools/editor.mjs

echo ""
read -n 1 -s -r -p "  Редактор остановлен. Нажмите любую клавишу, чтобы закрыть окно…"
