// Тексты блоков: первый экран, стерильность, атмосфера, работы, отзывы,
// сертификаты, вопросы-ответы. Правится в src/data/content.json.
import { loadJson } from './load.mjs';

const data = loadJson('content');

export const hero = data.hero;
export const serviceCards = data.serviceCards;
export const sterility = data.sterility;
export const atmosphere = data.atmosphere;
export const worksIntro = data.worksIntro;
export const works = data.works;
export const reviewsIntro = data.reviewsIntro;
export const reviews = data.reviews;
export const gift = data.gift;
export const contactsExtra = data.contactsExtra;
export const homeFaq = data.homeFaq;

export const worksFor = (direction) => works.filter((w) => w.direction === direction);
