// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // 라우터 임포트
import HomePage from './pages/HomePage'; // HomePage 임포트
import ProjectDetailPage from './pages/ProjectDetailPage'; // ProjectDetailPage 임포트

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/project/:projectId" element={<ProjectDetailPage />} />
            </Routes>
        </Router>
    );
};

export default App;