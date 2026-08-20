import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// init() 은 backend 의 초기 네임스페이스 로드까지 끝난 뒤 resolve 된다.
// main.tsx 가 이 promise 를 기다렸다가 마운트해, 첫 렌더부터 번역이 적용되게 한다
// (raw i18n 키 플래시 제거 + 프리렌더 스냅샷이 항상 번역된 상태가 되도록 보장).
export const i18nInitialized = i18n
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
    // Suspense 비활성화 — 번역 미로드 시 빈 문자열 반환 (Loading 플래시 제거)
    react: {
      useSuspense: false,
    },
    // 성능을 위해 LanguageDetector가 매번 실행되지 않도록 설정
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// <html lang> 을 현재 언어와 맞춘다 (WCAG 3.1.1 페이지 언어). index.html 은 ko 고정이라
// 영어로 바꾼 뒤에도 스크린리더가 한국어 발음 규칙으로 읽는 문제를 막는다.
const syncDocumentLanguage = (language: string) => {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = language.startsWith('en') ? 'en' : 'ko';
};
syncDocumentLanguage(i18n.language ?? 'ko');
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;