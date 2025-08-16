// src/components/PageHeader.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Link는 이미 import 되어 있습니다.
import { useTranslation } from 'react-i18next';

interface PageHeaderProps {
  setModalOpen: () => void;
  currentLanguage: string;
  onLanguageToggle: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ setModalOpen, currentLanguage, onLanguageToggle, activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'about', label: t('about') },
    { id: 'projects', label: t('projects') },
    { id: 'posts', label: t('posts') },
    { id: 'crazyAbout', label: t('crazyAbout') },
  ];

  return (
    <header className="h-20 flex items-center p-4">
      <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
          <Link to="/" onClick={() => setActiveTab('about')} className="flex items-center group">
            <img src="/logo.svg" alt="Mogiyoon Logo" className="h-10 w-10 mr-2 rounded-xl"/>
            <span className="hidden sm:inline text-xl font-bold font-display">
              {'Mogiyoon'.split('').map((char, index) => (
                <span key={index} className="inline-block transition-all duration-300 opacity-0 translate-y-[-0.5em] group-hover:opacity-100 group-hover:translate-y-0" style={{ transitionDelay: `${index * 25}ms` }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6 md:gap-10">
            {tabs.map(tab => (
              <Link
                key={tab.id}
                to="/"
                onClick={() => setActiveTab(tab.id)}
                className={`flex justify-center items-center w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-2 text-base font-medium transition-colors duration-200 rounded-md ${
                  activeTab === tab.id
                    ? 'text-white bg-gray-500'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">-</span>
              </Link>
            ))}
          </nav>

        <div className="flex items-center gap-4">
          <button onClick={setModalOpen} className="text-gray-600 hover:text-white hover:bg-gray-500 px-5 py-2 rounded-lg transition-colors duration-300 flex items-center">
            Contact
          </button>
          <button onClick={onLanguageToggle} className="text-gray-600 font-semibolds">
            {currentLanguage === 'ko' ? 'EN' : 'KO'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;