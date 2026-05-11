import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';

import type { ProjectData } from '../types';
import TotalSummaryComponent from '../components/TotalSummaryComponent';
import Seo from '../components/Seo';
import { SEO_COPY, pickSeoLocale } from '../seo-copy';
import { animation } from '../design-tokens';
import { useFetchJson } from '../hooks/useFetchJson';
import { createImageFallbackHandler } from '../utils/imageFallback';
import { PLACEHOLDER_NOT_FOUND_250x400 } from '../utils/placeholders';

const pageVariants = {
  initial: animation.page.initial,
  in: animation.page.animate,
};

const pageTransition = animation.page.transition;

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { t, i18n } = useTranslation([`projects/project-${projectId}`, 'common']);
  const seoLocale = pickSeoLocale(i18n.language);
  const notFoundCopy = SEO_COPY[seoLocale].notFound;
  const fallbackDescription = SEO_COPY[seoLocale].projectDetail.fallbackDescription;
  const projectsSection = SEO_COPY[seoLocale].sections.projects;

  const projectUrl = projectId ? `/data/projects/${projectId}.json` : null;
  const { data: project, isLoading } = useFetchJson<ProjectData>(projectUrl);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gifType, setGifType] = useState<"mobile" | "tablet">("mobile");

  useEffect(() => {
    if (!project?.demoGifSrc) return;
    const img = new Image();
    img.src = project.demoGifSrc;
    img.onload = () => {
      setGifType(img.width / img.height > 1 ? "tablet" : "mobile");
    };
  }, [project]);

  const handleImageError = createImageFallbackHandler({
    fallbackSrc: PLACEHOLDER_NOT_FOUND_250x400,
    onAfter: () => setIsLoaded(true),
  });

  useEffect(() => {
    if (!isLoading) {
      document.dispatchEvent(new Event('render-event'));
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-subtle">
        <div className="space-y-3 text-center">
          <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-content-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <>
        <Seo
          section={projectsSection}
          description={notFoundCopy.description}
          path={`/project/${projectId ?? ''}`}
          locale={seoLocale}
          noindex
        />
        <div className="min-h-screen flex items-center justify-center bg-surface-subtle px-4">
          <div className="text-center p-10 bg-surface shadow-xl rounded-3xl max-w-sm w-full">
            <p className="text-4xl mb-4">🔍</p>
            <h1 className="text-xl font-bold text-content mb-2">
              {t('projectNotFound', { ns: 'common' })}
            </h1>
            <Link
              to="/"
              className="mt-6 inline-block rounded-modal bg-slate-900 text-white px-6 py-3 text-sm font-semibold hover:bg-slate-700 transition-colors"
            >
              {t('backToMain', { ns: 'common' })}
            </Link>
          </div>
        </div>
      </>
    );
  }

  const gifMaxW = gifType === "tablet" ? "max-w-2xl" : "max-w-xs";

  const projectTitleRaw = t(project.title);
  const projectTitle = projectTitleRaw && projectTitleRaw !== project.title
    ? projectTitleRaw
    : (projectId ?? 'Project');
  const projectSubtitle = t(project.subtitle, { ns: `projects/project-${projectId}` });
  const seoDescription = projectSubtitle && projectSubtitle !== project.subtitle
    ? projectSubtitle
    : fallbackDescription;
  const seoImage = project.demoGifSrc ?? project.screenshots?.[0]?.src;

  return (
    <motion.div
      initial="initial"
      animate="in"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Seo
        section={projectTitle}
        description={seoDescription}
        path={`/project/${projectId ?? ''}`}
        image={seoImage}
        type="article"
        locale={seoLocale}
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-28 pb-16">

          {/* Header */}
          <header className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-content mb-3 tracking-tight">
              {t(project.title)}
            </h1>
            <p className="text-base sm:text-lg text-content-tertiary max-w-xl mx-auto">
              {t(project.subtitle, { ns: `projects/project-${projectId}` })}
            </p>
            {project.claudeInfo && (
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-200 bg-accent-50">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-sm text-accent-600 font-medium">
                  {t(project.claudeInfo.summary, { ns: `projects/project-${projectId}` })}
                </span>
              </div>
            )}
          </header>

          {/* Demo GIF */}
          <section className="mb-14 flex justify-center">
            <div className={`w-full ${gifMaxW}`}>
              {!isLoaded && (
                <div className={`rounded-modal bg-slate-200 animate-pulse w-full ${gifType === 'mobile' ? 'h-[444px]' : 'aspect-video'}`} />
              )}
              <img
                src={project.demoGifSrc}
                alt={`${t(project.title)} Demo`}
                className={`w-full rounded-modal shadow-xl border border-line transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
                onLoad={() => setIsLoaded(true)}
                onError={handleImageError}
              />
            </div>
          </section>

          {/* Content */}
          <div className="bg-surface rounded-3xl shadow-sm border border-line overflow-hidden">
            <TotalSummaryComponent project={project} t={t} />

            {/* License */}
            <div className="px-6 sm:px-10 py-8 border-t border-line">
              <p className="text-xs font-semibold uppercase tracking-widest text-content-muted mb-2">
                {t('license', { ns: 'common' })}
              </p>
              <p className="text-sm text-content-meta">
                <Trans
                  ns="common"
                  i18nKey="licenseText"
                  values={{ licenseName: project.license.name }}
                  components={[
                    <a
                      href={project.license.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-content font-semibold underline hover:no-underline"
                    />,
                  ]}
                />
              </p>
            </div>
          </div>

          <footer className="text-center mt-10 text-content-muted text-xs">
            © 2025 Giyoon Noh
          </footer>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;
