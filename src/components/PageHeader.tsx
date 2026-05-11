// src/components/PageHeader.tsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useClickOutside } from '../hooks/useClickOutside';
import { useDisclosure } from '../hooks/useDisclosure';
import RotatingChevron from './primitives/RotatingChevron';

interface PageHeaderProps {
  onOpenContactModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onOpenContactModal, activeTab, setActiveTab }) => {
  const { t, i18n } = useTranslation();
  const { isOpen: isDropdownOpen, close: closeDropdown, toggle: toggleDropdown } = useDisclosure(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'about', label: t('about') },
    { id: 'projects', label: t('projects') },
    { id: 'posts', label: t('posts') },
    { id: 'profile', label: t('profile') },
  ];

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    closeDropdown();
  };

  useClickOutside(dropdownRef, closeDropdown, isDropdownOpen);

  return (
    <header className="h-20 flex items-center p-4 bg-surface-muted">
      <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
        <Link to="/" onClick={() => setActiveTab('about')} className="flex items-center group">
          <img src="/logo.svg" alt="Mogiyoon Logo" className="h-10 w-10 mr-2 rounded-card"/>
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
              className={`flex justify-center items-center w-8 h-8 md:w-28 md:h-auto md:py-2 text-base font-medium transition-colors duration-200 rounded-card ${
                activeTab === tab.id
                  ? 'text-white bg-slate-900'
                  : 'text-content-secondary hover:bg-surface-muted'
              }`}
            >
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">-</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={onOpenContactModal} className="text-content-secondary hover:text-white hover:bg-slate-900 px-1 py-2 rounded-lg transition-colors duration-300 flex items-center">
            Info
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="text-content-secondary px-1 py-2 rounded-lg transition-colors duration-300 flex items-center hover:bg-surface-muted"
            >
              <span className="hidden lg:inline">{t('language')}</span>&nbsp;🌐
              <RotatingChevron isRotated={isDropdownOpen} className="ml-1" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-surface rounded-card shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                <button
                  onClick={() => handleLanguageChange('ko')}
                  className={`block w-full text-left px-4 py-2 text-sm text-content-secondary hover:bg-surface-muted ${i18n.language.startsWith('ko') ? 'font-bold text-accent-600' : ''}`}
                >
                  한국어
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`block w-full text-left px-4 py-2 text-sm text-content-secondary hover:bg-surface-muted ${i18n.language.startsWith('en') ? 'font-bold text-accent-600' : ''}`}
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
