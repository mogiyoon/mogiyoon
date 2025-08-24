import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // 기본적으로 로드할 네임스페이스 목록 (페이지 진입 시 동적으로 로드할 것이므로 최소화)
    ns: ['common', 'projects', 'prepareProjects'],
    defaultNS: 'common',

    lng: 'ko',
    fallbackLng: 'en',
    debug: import.meta.env.MODE === 'development',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // 성능을 위해 LanguageDetector가 매번 실행되지 않도록 설정
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;