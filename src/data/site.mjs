// Единый источник контактных данных: адрес, телефон, часы, реквизиты.
// Правится в src/data/site.json — вручную или через `npm run edit`.
// Меняется здесь — меняется на всём сайте, включая подвал, микроразметку
// и карту сайта.
//
// ⚠️ ЧЕРНОВИК: домен, Telegram, WhatsApp и реквизиты юрлица — заготовки.
// Что именно нужно подтвердить у владельцев, перечислено в README.
import { loadJson } from './load.mjs';

const data = loadJson('site');

/**
 * Адрес сайта можно подменить при сборке: SITE_URL=... node build.mjs
 * Нужно для показа на чужом домене — например на GitHub Pages, где сайт
 * лежит в подпапке. Без этого canonical и превью для мессенджеров
 * указывали бы на домен, которого ещё нет, и картинка в ссылке не грузилась.
 */
const origin = (process.env.SITE_URL || data.site.origin).replace(/\/$/, '');

export const site = { ...data.site, origin };
export const nav = data.nav;

/** Канал записи по id — чтобы ссылки не дублировались по шаблонам. */
export const channel = (id) => site.channels.find((c) => c.id === id) || null;
