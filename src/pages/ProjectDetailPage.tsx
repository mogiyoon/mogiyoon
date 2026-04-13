import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';

import type { ProjectData } from '../types';
import TotalSummaryComponent from '../components/TotalSummaryComponent';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  in: { opacity: 1, y: 0 },
};

const pageTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.25,
} as const;

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { t, i18n } = useTranslation([`projects/project-${projectId}`, 'common']);

  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gifType, setGifType] = useState<"mobile" | "tablet">("mobile");

  useEffect(() => {
    if (!projectId) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const dataResponse = await fetch(`/data/projects/${projectId}.json`);
        if (!dataResponse.ok) throw new Error('Data not found');
        const data: ProjectData = await dataResponse.json();
        setProject(data);

        if (data.demoGifSrc) {
          const img = new Image();
          img.src = data.demoGifSrc;
          img.onload = () => {
            setGifType(img.width / img.height > 1 ? "tablet" : "mobile");
          };
        }
      } catch (error) {
        console.error("Failed to load project:", error);
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [projectId, i18n]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "https://placehold.co/250x400/cccccc/333333?text=Image+Not+Found";
    setIsLoaded(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="space-y-3 text-center">
          <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center p-10 bg-white shadow-xl rounded-3xl max-w-sm w-full">
          <p className="text-4xl mb-4">🔍</p>
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            {t('projectNotFound', { ns: 'common' })}
          </h1>
          <Link
            to="/"
            className="mt-6 inline-block rounded-2xl bg-slate-900 text-white px-6 py-3 text-sm font-semibold hover:bg-slate-700 transition-colors"
          >
            {t('backToMain', { ns: 'common' })}
          </Link>
        </div>
      </div>
    );
  }

  const gifMaxW = gifType === "tablet" ? "max-w-2xl" : "max-w-xs";

  return (
    <motion.div
      initial="initial"
      animate="in"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-28 pb-16">

          {/* Header */}
          <header className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
              {t(project.title)}
            </h1>
            <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
              {t(project.subtitle, { ns: `projects/project-${projectId}` })}
            </p>
            {project.claudeInfo && (
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-sm text-indigo-600 font-medium">
                  {t(project.claudeInfo.summary, { ns: `projects/project-${projectId}` })}
                </span>
              </div>
            )}
          </header>

          {/* Demo GIF */}
          <section className="mb-14 flex justify-center">
            <div className={`w-full ${gifMaxW}`}>
              {!isLoaded && (
                <div className={`rounded-2xl bg-slate-200 animate-pulse w-full ${gifType === 'mobile' ? 'h-[444px]' : 'aspect-video'}`} />
              )}
              <img
                src={project.demoGifSrc}
                alt={`${t(project.title)} Demo`}
                className={`w-full rounded-2xl shadow-xl border border-slate-100 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
                onLoad={() => setIsLoaded(true)}
                onError={handleImageError}
              />
            </div>
          </section>

          {/* Content */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <TotalSummaryComponent project={project} t={t} />

            {/* License */}
            <div className="px-6 sm:px-10 py-8 border-t border-slate-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                {t('license', { ns: 'common' })}
              </p>
              <p className="text-sm text-slate-600">
                <Trans
                  ns="common"
                  i18nKey="licenseText"
                  values={{ licenseName: project.license.name }}
                  components={[
                    <a
                      href={project.license.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-900 font-semibold underline hover:no-underline"
                    />,
                  ]}
                />
              </p>
            </div>
          </div>

          <footer className="text-center mt-10 text-slate-400 text-xs">
            © 2025 Giyoon Noh
          </footer>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;
