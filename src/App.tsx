// src/App.tsx
import React, { useEffect, useRef, useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // ✅ i18next 훅 임포트
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ScrollToTop from "./components/ScrollToTop";
import ContactModal from "./components/ContactModal";
import PageHeader from "./components/PageHeader";

const App: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { i18n } = useTranslation(); // ✅ i18n 객체 가져오기
  const [activeTab, setActiveTab] = useState('about'); // ✅ activeTab 상태 관리

  const [headerTranslate, setHeaderTranslate] = useState(0);
  const lastScrollY = useRef(0);
  const HEADER_HEIGHT = 80;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      if (currentScrollY <= 0) {
        setHeaderTranslate(0);
        lastScrollY.current = 0;
        return;
      }
      setHeaderTranslate((prev) =>
        Math.max(-HEADER_HEIGHT, Math.min(0, prev - delta))
      );
      lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleModalOpen = () => {
    setModalOpen(true);
  }
  
  const handleLanguageToggle = () => {
    i18n.changeLanguage(i18n.language === 'ko' ? 'en' : 'ko');
  };

  return (
    // ✅ i18next 사용을 위한 Suspense 추가
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Router>
        <div
          style={{
            transform: `translateY(${headerTranslate}px)`,
            transition: "transform 0.1s linear",
          }}
          className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md"
        >
          {/* ✅ PageHeader에 필요한 모든 props 전달 */}
          <PageHeader
            setModalOpen={handleModalOpen}
            currentLanguage={i18n.language}
            onLanguageToggle={handleLanguageToggle}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
        <ScrollToTop />
        <Routes>
          {/* ✅ HomePage에 activeTab prop 전달 */}
          <Route path="/" element={<HomePage activeTab={activeTab} />} />
          <Route path="/project/:projectId" element={<ProjectDetailPage />} />
        </Routes>
        <ContactModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      </Router>
    </Suspense>
  );
};

export default App;