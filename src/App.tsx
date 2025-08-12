// src/App.tsx
import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // 라우터 임포트
import HomePage from "./pages/HomePage"; // HomePage 임포트
import ProjectDetailPage from "./pages/ProjectDetailPage"; // ProjectDetailPage 임포트
import ScrollToTop from "./components/ScrollToTop";
import ContactModal from "./components/ContactModal";
import PageHeader from "./components/PageHeader";

const App: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

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

  return (
    <Router>
      <div
        style={{
          transform: `translateY(${headerTranslate}px)`,
          transition: "transform 0.1s linear",
        }}
        className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md"
      >
        <PageHeader setModalOpen={handleModalOpen} />
      </div>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:projectId" element={<ProjectDetailPage />} />
      </Routes>
      <ContactModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </Router>
  );
};

export default App;
