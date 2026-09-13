// Мастера студии. Правится в src/data/masters.json.
//
// ⚠️ ЧЕРНОВИК: состав команды собран по упоминаниям в отзывах за 2021–2025
// годы, тексты «о мастере» написаны нами. Список и биографии нужно
// подтвердить у владельцев, имя мастера по бровям — узнать.
import { loadJson } from './load.mjs';

const data = loadJson('masters');

export const masters = data.masters;
export const founders = data.founders;
export const admin = data.admin;

export const masterBySlug = (slug) => masters.find((m) => m.slug === slug) || null;

/** Кто ведёт направление: маникюр, педикюр или брови. */
export const mastersFor = (direction) => masters.filter((m) => m.directions.includes(direction));
