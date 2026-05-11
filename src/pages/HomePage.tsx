import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AboutSection from '../sections/home/AboutSection';
import ProjectsSection from '../sections/home/ProjectsSection';
import PostsSection from '../sections/home/PostSection';
import ProfileSection from '../sections/home/ProfileSection';
import Seo from '../components/Seo';
import { SEO_COPY, pickSeoLocale } from '../seo-copy';
import { usePrerenderReadyEvent } from '../hooks/usePrerenderReadyEvent';

interface HomePageProps {
  activeTab: string;
}

const HomePage: React.FC<HomePageProps> = ({ activeTab }) => {
  const { i18n } = useTranslation();
  const seoLocale = pickSeoLocale(i18n.language);
  const seo = SEO_COPY[seoLocale].home;
  const sections = SEO_COPY[seoLocale].sections;
  const sectionLabel = (sections as Record<string, string>)[activeTab] ?? sections.about;

  usePrerenderReadyEvent();

  useEffect(() => {
    const isAboutTab = activeTab === 'about';

    document.documentElement.classList.toggle('about-active', isAboutTab);
    document.body.classList.toggle('about-active', isAboutTab);

    return () => {
      document.documentElement.classList.remove('about-active');
      document.body.classList.remove('about-active');
    };
  }, [activeTab]);
  
  // activeTab 값에 따라 보여줄 컴포넌트를 결정하는 함수
  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'posts':
        return <PostsSection />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <AboutSection />;
    }
  };

  // 'projects' 탭일 때는 중앙 정렬 클래스를 제거하고, 나머지 탭에서는 유지합니다.
  const mainClassName = activeTab === 'projects' || activeTab === 'about' || activeTab === 'profile'
    ? "min-h-screen w-full"
    : "min-h-screen flex items-center justify-center px-4 sm:px-8 py-8";

  return (
    <>
      <Seo
        section={sectionLabel}
        description={seo.description}
        keywords={seo.keywords}
        path="/"
        locale={seoLocale}
      />
      <main className={mainClassName}>
        {renderContent()}
      </main>
    </>
  );
};

export default HomePage;
