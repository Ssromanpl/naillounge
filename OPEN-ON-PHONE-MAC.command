#!/bin/bash
# Двойной клик — и сайт можно открыть с телефона в том же Wi-Fi.
cd "$(dirname "$0")" || exit 1
clear
if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  Node.js не установлен — сначала откройте START-EDITOR-MAC.command."
  echo ""
  read -n 1 -s -r -p "  Нажмите любую клавишу…"
  exit 1
fi
node tools/serve-phone.mjs
echo ""
read -n 1 -s -r -p "  Показ остановлен. Нажмите любую клавишу…"
