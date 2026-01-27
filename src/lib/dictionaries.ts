import 'server-only';

const dictionaries = {
  en: () => import('@/dictionaries/en').then((module) => module.en),
  da: () => import('@/dictionaries/da').then((module) => module.da),
};

export const getDictionary = async (locale: 'en' | 'da') => dictionaries[locale]();
