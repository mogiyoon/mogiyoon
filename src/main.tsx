import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import { i18nInitialized } from './i18n';
import App from './App.tsx'

const mount = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>,
  )
}

// 번역 초기 로드(수 KB, 동일 오리진)가 끝난 뒤 마운트한다.
// - 첫 렌더부터 번역 적용 → raw i18n 키가 잠깐 보이던 플래시 제거
// - 프리렌더 스냅샷이 번역 로드와 경합하던 race 제거 (항상 번역된 HTML)
// 로드 실패 시에도 UI 는 떠야 하므로 실패해도 마운트한다.
i18nInitialized.then(mount).catch(mount)
