// Три направления студии: маникюр, педикюр, брови. Каждое — отдельная
// страница со своим заголовком под поиск. Правится в src/data/services.json.
import { loadJson } from './load.mjs';

const data = loadJson('services');

export const services = data.services;
export const serviceById = (id) => services.find((s) => s.id === id) || null;
