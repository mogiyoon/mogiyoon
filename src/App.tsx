// test pull request
// src/App.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ResumePreviewPage from "./pages/ResumePreviewPage";
import ScrollToTop from "./components/ScrollToTop";
import ContactModal from "./components/ContactModal";
import PageHeader from "./components/PageHeader";
import { AnimatePresence } from 'framer-motion';
import { useDisclosure } from "./hooks/useDisclosure";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { easings } from "./design-tokens";

const getInitialTab = () => {
  if (window.location.pathname.startsWith('/project/')) {
    return 'projects';
  }
  if (window.location.pathname === '/resume-preview') {
    return 'profile';
  }
  return 'about';
};

const HEADER_HEIGHT = 80;
const HEADER_REVEAL_DELAY_MS = 2500;

const AppContent: React.FC = () => {
  const { isOpen: isContactModalOpen, open: openContactModal, close: closeContactModal } = useDisclosure(false);
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [headerTranslate, setHeaderTranslate] = useState(() =>
    window.location.pathname === '/' ? -HEADER_HEIGHT : 0
  );
  // 타이머/호버로 나타날 때는 부드러운 ease, 스크롤 추적 중에는 짧은 linear
  const [isSmoothReveal, setIsSmoothReveal] = useState(false);
  const lastScrollY = useRef(0);
  const headerRevealed = useRef(window.location.pathname !== '/');
  // 모바일(Tailwind md 미만)에서는 숨김/호버 로직 없이 헤더 항상 노출
  const isMobile = !useMediaQuery('(min-width: 768px)');

  const revealHeader = useCallback(() => {
    headerRevealed.current = true;
    setIsSmoothReveal(true);
    setHeaderTranslate(0);
  }, []);

  // 메인 화면 + 최상단 스크롤에서만 hover-overlay 방식으로 동작
  const isMainPageTop = useCallback(
    () => window.location.pathname === '/' && window.scrollY <= 0,
    []
  );

  const handleHeaderMouseLeave = useCallback(() => {
    if (isMainPageTop()) {
      setIsSmoothReveal(true);
      setHeaderTranslate(-HEADER_HEIGHT);
    }
  }, [isMainPageTop]);
  
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/project/')) {
      setActiveTab('projects');
    } else if (location.pathname === '/resume-preview') {
      setActiveTab('profile');
    } else if (location.pathname === '/') {
      const routeState = location.state as { activeTab?: string } | null;
      if (routeState?.activeTab) {
        setActiveTab(routeState.activeTab);
      }
    }
  }, [location.pathname, location.state]);

  useEffect(() => {
    if (location.pathname === '/') {
      window.scrollTo(0, 0);
    }
  }, [activeTab, location.pathname]);

  useEffect(() => {
    if (isMobile || headerRevealed.current) {
      return;
    }
    const timer = setTimeout(() => {
      if (isMainPageTop()) {
        revealHeader();
      }
    }, HEADER_REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isMobile, isMainPageTop, revealHeader]);

  useEffect(() => {
    if (isMobile) {
      return;
    }
    const SCROLL_THRESHOLD = 20;

    const handleScroll = () => {
      setIsSmoothReveal(false);
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) < SCROLL_THRESHOLD) {
        return;
      }

      if (currentScrollY <= 0) {
        if (headerRevealed.current) {
          setHeaderTranslate(0);
        }
        lastScrollY.current = 0;
        return;
      }
      headerRevealed.current = true;
      setHeaderTranslate((prev) =>
        Math.max(-HEADER_HEIGHT, Math.min(0, prev - delta))
      );
      lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <main>
      {/* 헤더가 숨겨져 있을 때 상단 가장자리 호버로 다시 나타나게 하는 감지 영역 */}
      {!isMobile && headerTranslate < 0 && (
        <div
          data-print-hidden="true"
          style={{ height: HEADER_HEIGHT }}
          className="fixed top-0 left-0 right-0 z-30"
          onMouseEnter={revealHeader}
        />
      )}
      <div
        data-print-hidden="true"
        onMouseEnter={!isMobile && headerTranslate < 0 ? revealHeader : undefined}
        onMouseLeave={isMobile ? undefined : handleHeaderMouseLeave}
        style={{
          transform: `translateY(${isMobile ? 0 : headerTranslate}px)`,
          transition: isSmoothReveal
            ? `transform 0.4s cubic-bezier(${easings.standard.join(",")})`
            : "transform 0.1s linear",
        }}
        className="fixed top-0 left-0 right-0 z-40 bg-surface shadow-md"
      >
        <PageHeader
          onOpenContactModal={openContactModal}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      
      <ScrollToTop />
      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage activeTab={activeTab} />} />
          <Route path="/project/:projectId" element={<ProjectDetailPage />} />
          <Route path="/resume-preview" element={<ResumePreviewPage />} />
        </Routes>
      </AnimatePresence>
      <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
    </main>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
