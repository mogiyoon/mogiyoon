import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // public 폴더에서 번역 파일을 불러오기 위함
  .use(LanguageDetector) // 브라우저 언어 감지
  .use(initReactI18next) // react-i18next 초기화
  .init({
    fallbackLng: 'en', // 번역 파일에 없는 언어일 경우 영어로 대체
    debug: true, // 개발 중 디버그 메시지를 콘솔에 출력
    interpolation: {
      escapeValue: false, // React는 이미 XSS 방어 기능이 있으므로 false로 설정
    },
  });

export default i18n;