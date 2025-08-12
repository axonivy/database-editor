import { deTranslation, enTranslation } from '@axonivy/database-editor';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      debug: true,
      supportedLngs: ['en', 'de'],
      fallbackLng: 'en',
      ns: ['database-editor'],
      defaultNS: 'database-editor',
      resources: {
        en: { 'database-editor': enTranslation },
        de: { 'database-editor': deTranslation }
      },
      detection: {
        order: ['querystring']
      }
    });
};
