// src/App.tsx
import React, { useEffect, useRef, useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ScrollToTop from "./components/ScrollToTop";
import ContactModal from "./components/ContactModal";
import PageHeader from "./components/PageHeader";

const getInitialTab = () => {
  if (window.location.pathname.startsWith('/project/')) {
    return 'projects';
  }
  return 'about';
};


const AppContent: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { i18n } = useTranslation();
  
  // ✅ 함수를 useState에 전달하여 깜빡임 없이 초기 상태를 설정합니다.
  const [activeTab, setActiveTab] = useState(getInitialTab);

  const [headerTranslate, setHeaderTranslate] = useState(0);
  const lastScrollY = useRef(0);
  const HEADER_HEIGHT = 80;
  
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/project/')) {
      setActiveTab('projects');
    } else if (location.pathname === '/') {
      setActiveTab('about'); 
    }
  }, [location.pathname]);


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
    <main>
      <div
        style={{
          transform: `translateY(${headerTranslate}px)`,
          transition: "transform 0.1s linear",
        }}
        className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md"
      >
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
        <Route path="/" element={<HomePage activeTab={activeTab} />} />
        <Route path="/project/:projectId" element={<ProjectDetailPage />} />
      </Routes>
      <ContactModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
};


const App: React.FC = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Router>
        <AppContent />
      </Router>
    </Suspense>
  );
};

export default App;