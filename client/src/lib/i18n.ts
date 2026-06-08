import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from '../locales/en.json';
import esTranslation from '../locales/es.json';
import frTranslation from '../locales/fr.json';
import deTranslation from '../locales/de.json';
import zhTranslation from '../locales/zh.json';
import jaTranslation from '../locales/ja.json';
import arTranslation from '../locales/ar.json';
import ptTranslation from '../locales/pt.json';
import ruTranslation from '../locales/ru.json';
import itTranslation from '../locales/it.json';
import heTranslation from '../locales/he.json';

const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
  fr: { translation: frTranslation },
  de: { translation: deTranslation },
  zh: { translation: zhTranslation },
  ja: { translation: jaTranslation },
  ar: { translation: arTranslation },
  pt: { translation: ptTranslation },
  ru: { translation: ruTranslation },
  it: { translation: itTranslation },
  he: { translation: heTranslation },
};

const rtlLanguages = ['ar', 'he'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Handle RTL layout
i18n.on('languageChanged', (lng) => {
  const isRTL = rtlLanguages.includes(lng);
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  document.body.dir = isRTL ? 'rtl' : 'ltr';
});

// Set initial direction
const initialLng = i18n.language;
const isInitialRTL = rtlLanguages.includes(initialLng);
document.documentElement.dir = isInitialRTL ? 'rtl' : 'ltr';
document.documentElement.lang = initialLng;
document.body.dir = isInitialRTL ? 'rtl' : 'ltr';

export default i18n;
