import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';

const normalizeLang = (lng: string | null) => {
  if (!lng) return 'en';
  return lng.startsWith('es') ? 'es' : 'en';
};

const savedLang = normalizeLang(localStorage.getItem('lang'));

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', normalizeLang(lng));
});

export default i18n;
