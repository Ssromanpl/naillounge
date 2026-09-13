// Иконки — контурные SVG в одном стиле, 24×24, наследуют цвет текста.
// Эмодзи вместо иконок не используем: они выглядят по-разному в разных
// системах и не читаются скринридером.
const svg = (body) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const icons = {
  hand: svg('<path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 11V6.5a1.5 1.5 0 0 1 3 0V14"/><path d="M17 9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-3.5a1.5 1.5 0 0 1 3 0"/>'),
  foot: svg('<path d="M8.5 21c-2 0-3-1.4-3-3 0-1.6.8-2.3.8-4.2 0-1.3-.6-2-.6-3.4C5.7 7.3 7.6 5 10 5c2.2 0 3.6 1.7 3.6 4.3 0 2.6-1.2 3.6-1.2 5.6 0 1.4.5 2 .5 3 0 1.7-1.3 3.1-4.4 3.1Z"/><circle cx="16.6" cy="7.2" r="1.7"/><circle cx="19.3" cy="11" r="1.4"/><circle cx="19.6" cy="15" r="1.2"/>'),
  brow: svg('<path d="M3.5 12.5c2.6-4 6-6 10-6 3.2 0 5.6 1 7 2.4"/><path d="M4.6 15.6c2.2-2.4 4.8-3.6 7.8-3.6 2.4 0 4.4.7 6 2"/>'),
  sparkle: svg('<path d="M12 3.5 13.8 9 19.3 10.8 13.8 12.6 12 18.1 10.2 12.6 4.7 10.8 10.2 9Z"/><path d="M18.5 15.5 19.2 18l2.3.8-2.3.8-.7 2.4"/>'),
  shield: svg('<path d="M12 3 5 6v6c0 4.4 3 8 7 9 4-1 7-4.6 7-9V6Z"/><path d="m9 12 2 2 4-4"/>'),
  heart: svg('<path d="M12 20.3S3.8 15.6 3.8 9.9A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 8.2 2.5c0 5.7-8.2 10.4-8.2 10.4Z"/>'),
  phone: svg('<path d="M5 3h3l2 5-2.4 1.4a12 12 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 3 5.2 2 2 0 0 1 5 3Z"/>'),
  chat: svg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z"/>'),
  telegram: svg('<path d="M21 4.5 2.8 11.4c-.7.3-.7 1.3 0 1.5l4.6 1.5 1.8 5.2c.2.6 1 .8 1.4.3l2.4-2.6 4.6 3.4c.5.4 1.3.1 1.4-.6L21.9 5.4c.1-.7-.5-1.2-1-.9Z"/><path d="m7.4 14.4 10.4-7.6-7.3 8.6"/>'),
  viber: svg('<path d="M12 3c4.8 0 8 2.8 8 7.2 0 4.4-3.2 7.2-8 7.2-.6 0-1.2 0-1.8-.1L6 21v-3.4C4 16.3 3 13.9 3 10.9 3 6.4 6.7 3 12 3Z"/><path d="M9 8.4c1.6.3 3.2 1.7 3.6 3.4"/><path d="M9.4 11.2c.6.2 1.2.7 1.4 1.4"/>'),
  whatsapp: svg('<path d="M20.5 11.6c0 4.7-3.9 8.5-8.7 8.5-1.5 0-2.9-.4-4.1-1L3 20.6l1.6-4.4a8.3 8.3 0 0 1-1.1-4.2c0-4.7 3.9-8.5 8.7-8.5s8.3 3.8 8.3 8.1Z"/><path d="M9 9c.4 1.6 1.8 3.4 3.6 4.2l1-1.2 2 .9v1.4c0 .6-.5 1.1-1.1 1a8.6 8.6 0 0 1-7-6.6c-.1-.6.4-1.2 1-1.2h1.4L9 9Z"/>'),
  instagram: svg('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>'),
  pin: svg('<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>'),
  star: '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.2 14.6 9l6.4.6-4.8 4.2 1.4 6.2-5.6-3.3-5.6 3.3L7.8 13.8 3 9.6 9.4 9Z"/></svg>',
  arrow: svg('<path d="M5 12h13"/><path d="m13 6 6 6-6 6"/>'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  calendar: svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>'),
  gift: svg('<rect x="3.5" y="8.5" width="17" height="12" rx="2"/><path d="M3.5 13h17M12 8.5V20.5"/><path d="M12 8.5C10.5 5.5 9 4 7.6 4a2.1 2.1 0 0 0 0 4.5Z"/><path d="M12 8.5c1.5-3 3-4.5 4.4-4.5a2.1 2.1 0 0 1 0 4.5Z"/>'),
  wallet: svg('<rect x="3.5" y="5.5" width="17" height="14" rx="3"/><path d="M3.5 10h17"/><circle cx="16.5" cy="14.5" r="1.2" fill="currentColor" stroke="none"/>'),
  cup: svg('<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3.5c-.6 1 .6 1.6 0 2.6M12 3.5c-.6 1 .6 1.6 0 2.6"/>'),
  lamp: svg('<path d="M12 3v2"/><path d="M5.6 6.2 7 7.6M18.4 6.2 17 7.6"/><path d="M8 17a5.5 5.5 0 1 1 8 0l-.6 1.6a2 2 0 0 1-1.9 1.3h-3a2 2 0 0 1-1.9-1.3Z"/>'),
  chair: svg('<path d="M6 4.5h12v7H6Z" /><path d="M4 11.5h16v3.5H4Z"/><path d="M6 15v4.5M18 15v4.5"/>'),
  filter: svg('<path d="M4 6h16M7 12h10M10 18h4"/>'),
};

export const icon = (name) => icons[name] || '';
