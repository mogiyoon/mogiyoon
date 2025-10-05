// src/components/PageHeader.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface PageHeaderProps {
  setModalOpen: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ setModalOpen, activeTab, setActiveTab }) => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'about', label: t('about') },
    { id: 'projects', label: t('projects') },
    { id: 'posts', label: t('posts') },
    // { id: 'crazyAbout', label: t('crazyAbout') },
  ];

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setDropdownOpen(false); // 언어 선택 후 드롭다운 닫기
  };

  // 드롭다운 외부 클릭 시 닫기 위한 Effect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="h-20 flex items-center p-4 bg-gray-100">
      <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
        <Link to="/" onClick={() => setActiveTab('about')} className="flex items-center group">
          <img src="/logo.svg" alt="Mogiyoon Logo" className="h-10 w-10 mr-2 rounded-xl"/>
          <span className="hidden lg:inline text-xl font-bold font-display">
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
              className={`flex justify-center items-center w-8 h-8 md:w-28 md:h-auto md:py-2 text-base font-medium transition-colors duration-200 rounded-md ${
                activeTab === tab.id
                  ? 'text-white bg-gray-500'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">-</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={setModalOpen} className="text-gray-600 hover:text-white hover:bg-gray-500 px-1 py-2 rounded-lg transition-colors duration-300 flex items-center">
            Info
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="text-gray-600 px-1 py-2 rounded-lg transition-colors duration-300 flex items-center hover:bg-gray-100"
            >
              <span className="hidden lg:inline">{t('language')}</span>&nbsp;🌐
              <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                <button
                  onClick={() => handleLanguageChange('ko')}
                  className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${i18n.language.startsWith('ko') ? 'font-bold text-blue-600' : ''}`}
                >
                  한국어
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${i18n.language.startsWith('en') ? 'font-bold text-blue-600' : ''}`}
                >
                  English
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;