import React from 'react';
import AboutSection from '../sections/home/AboutSection';
import ProjectsSection from '../sections/home/ProjectsSection';
import PostsSection from '../sections/home/PostSection';
import CrazyAboutSection from '../sections/home/CrazyAboutSection';

interface HomePageProps {
  activeTab: string;
}

const HomePage: React.FC<HomePageProps> = ({ activeTab }) => {
  
  // activeTab 값에 따라 보여줄 컴포넌트를 결정하는 함수
  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'posts':
        return <PostsSection />;
      case 'crazyAbout':
        return <CrazyAboutSection />;
      default:
        return <AboutSection />; // 기본값으로 '자기소개' 섹션을 보여줍니다.
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-8 py-8">
      {renderContent()}
    </main>
  );
};

export default HomePage;