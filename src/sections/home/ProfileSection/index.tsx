import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  loadLocalizedResumeProfile,
  type ResumeProfileSourceData,
} from '../../../utils/resumePreview';

import { contentVariants } from './animations';
import { cachedData, dataPromise } from './prefetch';
import type { ProfileData, TabId } from './types';
import BasicsTab from './BasicsTab';
import WorkSkillsTab from './WorkSkillsTab';
import EducationTab from './EducationTab';
import AwardsAndCertsTab from './AwardsAndCertsTab';

const ProfileSection: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('basics');
  const [data, setData] = useState<ProfileData | null>(cachedData);
  const [resumeProfile, setResumeProfile] = useState<ResumeProfileSourceData | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const tabs: { id: TabId; labelKey: string }[] = [
    { id: 'basics', labelKey: 'profileTabs.basics' },
    { id: 'workSkills', labelKey: 'profileTabs.workSkills' },
    { id: 'education', labelKey: 'profileTabs.education' },
    { id: 'awardsAndCerts', labelKey: 'profileTabs.awardsAndCerts' },
  ];

  useEffect(() => {
    if (data) return;
    dataPromise.then((json) => {
      if (json) setData(json);
    });
  }, [data]);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const localizedProfile = await loadLocalizedResumeProfile(i18n.resolvedLanguage || i18n.language);
        if (isMounted) {
          setResumeProfile(localizedProfile);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [i18n.language, i18n.resolvedLanguage]);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    if (window.innerWidth >= 640) {
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenPreview = () => {
    navigate('/resume-preview');
  };

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100">

      {/* Mobile-only: fixed bottom tab bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-line px-4 pb-safe">
        <div className="flex gap-1 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className="relative flex-1 rounded-card px-2 py-2.5 text-xs font-semibold overflow-hidden transition-colors duration-150"
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabBgMobile"
                  className="absolute inset-0 bg-slate-900 rounded-card"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-150 ${activeTab === tab.id ? 'text-white' : 'text-content-tertiary'}`}>
                {t(tab.labelKey)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-28 sm:pb-16 pt-24 sm:pt-28">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[3fr_7fr]">

          {/* Left: tabs — desktop only */}
          <div className="hidden sm:flex sm:order-1 flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className="relative text-left rounded-modal px-6 py-5 text-sm font-semibold overflow-hidden transition-colors duration-150"
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-slate-900 rounded-modal"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
                  />
                )}
                <span className={`relative z-10 transition-colors duration-150 ${activeTab === tab.id ? 'text-white' : 'text-content-meta hover:text-content'}`}>
                  {t(tab.labelKey)}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className="sm:order-2 sm:overflow-y-auto sm:overscroll-contain sm:max-h-[calc(100vh-180px)] scroll-mt-14"
          >
            {!data ? (
              /* Skeleton: content only — tabs are already visible */
              <div className="space-y-4">
                <div className="h-8 w-48 rounded-card bg-surface-muted animate-pulse" />
                <div className="h-64 rounded-modal bg-surface-muted animate-pulse" />
                <div className="h-40 rounded-modal bg-surface-muted animate-pulse" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={contentVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {activeTab === 'basics' && (
                    <BasicsTab
                      resumeProfile={resumeProfile}
                      onOpenPreview={handleOpenPreview}
                    />
                  )}
                  {activeTab === 'workSkills' && <WorkSkillsTab data={data} />}
                  {activeTab === 'education' && <EducationTab data={data.education} />}
                  {activeTab === 'awardsAndCerts' && (
                    <AwardsAndCertsTab awards={data.awards} certs={data.certificates} />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
