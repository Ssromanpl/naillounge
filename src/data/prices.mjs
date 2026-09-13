// Цены в белорусских рублях, правятся в src/data/prices.json.
//
// ⚠️ ЧЕРНОВИК. Цифры собраны по рынку Минска на сентябрь 2026 года
// и ждут подтверждения владельцев студии. Раздел на сайте называется
// «Цены» — другого названия не используем, это проверяет npm run check.
import { loadJson } from './load.mjs';

const data = loadJson('prices');

export const priceUpdated = data.priceUpdated;
export const priceNote = data.priceNote;
export const priceCategories = data.priceCategories;
export const topPrices = data.topPrices;
export const included = data.included;
export const extraTitle = data.extraTitle;
export const extraLead = data.extraLead;
export const sumParts = data.sumParts;

/** «от 55 руб.», «55 руб. за ноготь», «бесплатно» — одним правилом. */
export function priceLabel(item) {
  if (item.free) return 'бесплатно';
  const value = `${item.price} руб.`;
  const withUnit = item.unit ? `${value} ${item.unit}` : value;
  return item.from ? `от ${withUnit}` : withUnit;
}

export const categoryById = (id) => priceCategories.find((c) => c.id === id) || null;

/** Все названия услуг — для выпадающего списка в форме записи. */
export const allServiceNames = priceCategories.flatMap((c) =>
  c.groups.flatMap((g) => g.items.map((i) => i.name))
);
