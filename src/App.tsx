// test pull request
// src/App.tsx
import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ResumePreviewPage from "./pages/ResumePreviewPage";
import ScrollToTop from "./components/ScrollToTop";
import ContactModal from "./components/ContactModal";
import PageHeader from "./components/PageHeader";
import { AnimatePresence } from 'framer-motion';

const getInitialTab = () => {
  if (window.location.pathname.startsWith('/project/')) {
    return 'projects';
  }
  if (window.location.pathname === '/resume-preview') {
    return 'profile';
  }
  return 'about';
};

const AppContent: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const HEADER_HEIGHT = 80;
  const [headerTranslate, setHeaderTranslate] = useState(() =>
    window.location.pathname === '/' ? -HEADER_HEIGHT : 0
  );
  const lastScrollY = useRef(0);
  const headerRevealed = useRef(window.location.pathname !== '/');
  
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
    const SCROLL_THRESHOLD = 20;

    const handleScroll = () => {
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
  }, []);

  const handleModalOpen = () => {
    setModalOpen(true);
  }

  return (
    <main>
      <div
        data-print-hidden="true"
        style={{
          transform: `translateY(${headerTranslate}px)`,
          transition: "transform 0.1s linear",
        }}
        className="fixed top-0 left-0 right-0 z-40 bg-surface shadow-md"
      >
        <PageHeader
          setModalOpen={handleModalOpen}
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
      <ContactModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
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
