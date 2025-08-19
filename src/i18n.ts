import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: ['common', 'projects, prepareProjects'], // 사용할 네임스페이스 목록
    defaultNS: 'common', // 기본 네임스페이스

    fallbackLng: 'en',
    debug: import.meta.env.MODE === 'development', // 개발 환경에서만 디버그 모드 활성화
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // 네임스페이스 파일을 불러올 경로
    },
  });

export default i18n;
