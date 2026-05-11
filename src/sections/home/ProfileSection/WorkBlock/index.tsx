import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import RotatingChevron from '../../../../components/primitives/RotatingChevron';
import { listVariants } from '../animations';
import type { AiHighlightItem, HighlightItem, WorkItem } from '../types';
import HighlightCard from './HighlightCard';
import AiHighlightCard from './AiHighlightCard';

const WorkBlock: React.FC<{ data: WorkItem[] }> = ({ data }) => {
  const { t: tIntro } = useTranslation('introduction');
  const { t: tCommon } = useTranslation('common');
  const [openWorkIdx, setOpenWorkIdx] = useState<number>(0);
  const [openHighlights, setOpenHighlights] = useState<Set<string>>(new Set());
  const [toggledSections, setToggledSections] = useState<Set<string>>(new Set());

  const toggleHighlight = (key: string) => {
    setOpenHighlights((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleSection = (key: string) => {
    setToggledSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const highlightLabels = {
    problem: tCommon('highlight.problem'),
    solution: tCommon('highlight.solution'),
    result: tCommon('highlight.result'),
  };

  const aiHighlightLabels = {
    context: tCommon('highlight.context'),
    approach: tCommon('highlight.approach'),
    verification: tCommon('highlight.verification'),
    impact: tCommon('highlight.impact'),
    showDetails: tCommon('highlight.showDetails'),
    hideDetails: tCommon('highlight.hideDetails'),
  };

  return (
    <div className="space-y-3">
      {data.map((item, idx) => {
        const isWorkOpen = openWorkIdx === idx;
        const projects = item.projects ?? [];
        const hasProjects = projects.length > 0;

        return (
          <div
            key={item.id}
            className="rounded-3xl border border-line bg-surface/80 shadow-sm backdrop-blur overflow-hidden"
          >
            {/* Company header */}
            <button
              type="button"
              onClick={() => hasProjects && setOpenWorkIdx(isWorkOpen ? -1 : idx)}
              className={`w-full px-6 py-5 text-left ${hasProjects ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-content">
                    {tIntro(`work.${item.id}.title`)}
                  </h3>
                  <p className="mt-0.5 text-sm text-content-muted">
                    {tIntro(`work.${item.id}.position`)} · {tIntro(`work.${item.id}.period`)}
                  </p>
                </div>
                {hasProjects && (
                  <div className="shrink-0 text-content-muted">
                    <RotatingChevron isRotated={isWorkOpen} size="md" duration={0.2} />
                  </div>
                )}
              </div>
            </button>

            {/* Projects accordion */}
            <AnimatePresence initial={false}>
              {isWorkOpen && hasProjects && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="px-6 pb-7 space-y-6">
                    {projects.map((proj) => {
                      const highlights = tIntro(
                        `work.${item.id}.projects.${proj.id}.highlights`,
                        { returnObjects: true, defaultValue: [] },
                      ) as HighlightItem[];
                      const aiHighlights = tIntro(
                        `work.${item.id}.projects.${proj.id}.aiHighlights`,
                        { returnObjects: true, defaultValue: [] },
                      ) as AiHighlightItem[];
                      const hasAi = Array.isArray(aiHighlights) && aiHighlights.length > 0;
                      const hasDev = Array.isArray(highlights) && highlights.length > 0;
                      const devSectionKey = `${item.id}-${proj.id}-dev`;
                      const aiSectionKey = `${item.id}-${proj.id}-ai`;
                      const isDevSectionOpen = toggledSections.has(devSectionKey);
                      const isAiSectionOpen = toggledSections.has(aiSectionKey);

                      return (
                        <div key={proj.id}>
                          {/* Project name + tech */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="text-sm font-bold text-content-secondary">
                              {tIntro(`work.${item.id}.projects.${proj.id}.name`)}
                            </span>
                            {proj.tech.map((tech) => (
                              <span key={tech} className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-medium text-white">
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Development accordion header (only when AI section exists) */}
                          {hasAi && hasDev && (
                            <button
                              type="button"
                              onClick={() => toggleSection(devSectionKey)}
                              className="w-full flex items-center gap-3 mb-3 group"
                            >
                              <span className="text-[10px] font-bold uppercase tracking-widest text-content-tertiary group-hover:text-content transition-colors">
                                {tCommon('highlight.section.development')}
                              </span>
                              <div className="flex-1 h-px bg-slate-200" />
                              <RotatingChevron
                                isRotated={isDevSectionOpen}
                                className="text-content-muted group-hover:text-content transition-colors"
                              />
                            </button>
                          )}

                          {/* Dev highlight cards — collapsible when hasAi, always visible otherwise */}
                          {hasDev && (
                            <AnimatePresence initial={false}>
                              {(!hasAi || isDevSectionOpen) && (
                                <motion.div
                                  key="dev-collapse"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                                  style={{ overflow: 'hidden' }}
                                >
                                  <motion.div
                                    variants={listVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="space-y-3"
                                  >
                                    {highlights.map((h, i) => {
                                      const hKey = `${item.id}-${proj.id}-${i}`;
                                      return (
                                        <HighlightCard
                                          key={i}
                                          highlight={h}
                                          index={i}
                                          isOpen={openHighlights.has(hKey)}
                                          onToggle={() => toggleHighlight(hKey)}
                                          labels={highlightLabels}
                                        />
                                      );
                                    })}
                                  </motion.div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          )}

                          {/* AI Utilization section */}
                          {hasAi && (
                            <>
                              <button
                                type="button"
                                onClick={() => toggleSection(aiSectionKey)}
                                className="w-full flex items-center gap-3 mb-3 mt-6 group"
                              >
                                <span className="text-[10px] font-bold uppercase tracking-widest text-content-tertiary group-hover:text-content transition-colors">
                                  {tCommon('highlight.section.aiUsage')}
                                </span>
                                <div className="flex-1 h-px bg-slate-200" />
                                <RotatingChevron
                                  isRotated={isAiSectionOpen}
                                  className="text-content-muted group-hover:text-content transition-colors"
                                />
                              </button>

                              <AnimatePresence initial={false}>
                                {isAiSectionOpen && (
                                  <motion.div
                                    key="ai-collapse"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    style={{ overflow: 'hidden' }}
                                  >
                                    <motion.div
                                      variants={listVariants}
                                      initial="hidden"
                                      animate="show"
                                      className="space-y-3"
                                    >
                                      {aiHighlights.map((a, i) => {
                                        const aKey = `${item.id}-${proj.id}-ai-${i}`;
                                        const detailKey = `${aKey}-detail`;
                                        return (
                                          <AiHighlightCard
                                            key={i}
                                            aiHighlight={a}
                                            index={i}
                                            isOpen={openHighlights.has(aKey)}
                                            isDetailOpen={openHighlights.has(detailKey)}
                                            onToggle={() => toggleHighlight(aKey)}
                                            onDetailToggle={() => toggleHighlight(detailKey)}
                                            labels={aiHighlightLabels}
                                          />
                                        );
                                      })}
                                    </motion.div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default WorkBlock;
