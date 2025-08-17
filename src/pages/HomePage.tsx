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
        return <AboutSection />;
    }
  };

  // 'projects' 탭일 때는 중앙 정렬 클래스를 제거하고, 나머지 탭에서는 유지합니다.
  const mainClassName = activeTab === 'projects' || activeTab === 'about'
    ? "w-full"
    : "min-h-screen flex items-center justify-center px-4 sm:px-8 py-8"; // 다른 탭에서는 기존 스타일 유지

  return (
    <main className={mainClassName}>
      {renderContent()}
    </main>
  );
};

export default HomePage;