import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { animation } from "../../design-tokens";
import {
  loadLocalizedResumeProfile,
  type ResumeProfileSourceData,
} from "../../utils/resumePreview";

// ── Types ──────────────────────────────────────────────────────────────────────
type TabId = "basics" | "workSkills" | "education" | "awardsAndCerts";

type HighlightItem = {
  title: string;
  problem: string;
  solution: string;
  result: string;
};

type AiHighlightItem = {
  title: string;
  summary: string;
  context: string;
  approach: string;
  verification: string;
  impact: string;
};

type WorkProject = { id: string; tech: string[] };
type WorkItem = { id: string; projects: WorkProject[] };
type EducationItem = { id: string };
type AwardItem = { id: string };
type CertItem = { id: string };
type SkillGroup = { category: string; items: string[] };

type ProfileData = {
  workExperience: WorkItem[];
  education: EducationItem[];
  awards: AwardItem[];
  certificates: CertItem[];
  skills: SkillGroup[];
};

const resumeLinkOrder = ["website", "blog", "github", "linkedin"];

// ── Animation Variants ─────────────────────────────────────────────────────────
const contentVariants: Variants = animation.content;

const listVariants: Variants = animation.list.variants;

const itemVariants: Variants = animation.list.item;

// ── SkillsBlock ────────────────────────────────────────────────────────────────
const SkillsBlock: React.FC<{ data: SkillGroup[] }> = ({ data }) => {
  const { t } = useTranslation("introduction");

  return (
    <div className="divide-y divide-slate-100">
      {data.map((group) => (
        <div key={group.category} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
          <span className="shrink-0 w-24 pt-0.5 text-sm font-semibold uppercase tracking-widest text-content-muted">
            {t(`skills.${group.category}`, { defaultValue: group.category })}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <motion.span
                key={item}
                whileHover={{ y: -2 }}
                transition={animation.chipHover.transition}
                className="inline-flex items-center rounded-full border border-line bg-surface-subtle px-3 py-1 text-sm font-medium text-content-secondary cursor-default"
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── WorkBlock ──────────────────────────────────────────────────────────────────
const WorkBlock: React.FC<{ data: WorkItem[] }> = ({ data }) => {
  const { t: tIntro } = useTranslation("introduction");
  const { t: tCommon } = useTranslation("common");
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
              className={`w-full px-6 py-5 text-left ${hasProjects ? "cursor-pointer" : "cursor-default"}`}
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
                  <motion.div
                    animate={{ rotate: isWorkOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-content-muted"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </button>

            {/* Projects accordion */}
            <AnimatePresence initial={false}>
              {isWorkOpen && hasProjects && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="px-6 pb-7 space-y-6">
                    {projects.map((proj) => {
                      const highlights = tIntro(
                        `work.${item.id}.projects.${proj.id}.highlights`,
                        { returnObjects: true, defaultValue: [] }
                      ) as HighlightItem[];
                      const aiHighlights = tIntro(
                        `work.${item.id}.projects.${proj.id}.aiHighlights`,
                        { returnObjects: true, defaultValue: [] }
                      ) as AiHighlightItem[];
                      const hasAi = Array.isArray(aiHighlights) && aiHighlights.length > 0;
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
                          {hasAi && Array.isArray(highlights) && highlights.length > 0 && (
                            <button
                              type="button"
                              onClick={() => toggleSection(devSectionKey)}
                              className="w-full flex items-center gap-3 mb-3 group"
                            >
                              <span className="text-[10px] font-bold uppercase tracking-widest text-content-tertiary group-hover:text-content transition-colors">
                                {tCommon("highlight.section.development")}
                              </span>
                              <div className="flex-1 h-px bg-slate-200" />
                              <motion.svg
                                animate={{ rotate: isDevSectionOpen ? 180 : 0 }}
                                transition={{ duration: 0.18 }}
                                className="w-3.5 h-3.5 text-content-muted group-hover:text-content transition-colors"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </motion.svg>
                            </button>
                          )}

                          {/* Highlight cards — collapsible when hasAi, always visible otherwise */}
                          {Array.isArray(highlights) && highlights.length > 0 && (
                            <AnimatePresence initial={false}>
                              {(!hasAi || isDevSectionOpen) && (
                                <motion.div
                                  key="dev-collapse"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: "easeInOut" }}
                                  style={{ overflow: "hidden" }}
                                >
                            <motion.div
                              variants={listVariants}
                              initial="hidden"
                              animate="show"
                              className="space-y-3"
                            >
                              {highlights.map((h, i) => {
                                const hKey = `${item.id}-${proj.id}-${i}`;
                                const isHOpen = openHighlights.has(hKey);

                                return (
                                  <motion.div
                                    key={i}
                                    variants={itemVariants}
                                    className="rounded-modal border border-line bg-surface overflow-hidden"
                                  >
                                    {/* Title row (always visible) */}
                                    <button
                                      type="button"
                                      onClick={() => toggleHighlight(hKey)}
                                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-subtle transition-colors duration-150"
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        <span className="shrink-0 text-xs font-semibold text-slate-300">
                                          {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <p className="text-sm font-semibold text-content truncate">{h.title}</p>
                                      </div>
                                      <motion.div
                                        animate={{ rotate: isHOpen ? 180 : 0 }}
                                        transition={{ duration: 0.18 }}
                                        className="shrink-0 ml-3 text-content-muted"
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </motion.div>
                                    </button>

                                    {/* Expanded detail */}
                                    <AnimatePresence initial={false}>
                                      {isHOpen && (
                                        <motion.div
                                          key="detail"
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.22, ease: "easeInOut" }}
                                          style={{ overflow: "hidden" }}
                                        >
                                          <div className="px-5 pt-2 pb-6">
                                            {/* Timeline flow */}
                                            <div className="relative pl-6">
                                              {/* Vertical connector */}
                                              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-slate-200 via-slate-400 to-slate-900" />

                                              {/* Problem */}
                                              <div className="relative pb-6">
                                                <div className="absolute -left-6 top-[4px] w-3 h-3 rounded-full border-2 border-line-strong bg-surface" />
                                                <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-300 mb-1">
                                                  {tCommon("highlight.problem")}
                                                </span>
                                                <p className="text-sm text-content-muted leading-relaxed">{h.problem}</p>
                                              </div>

                                              {/* Solution */}
                                              <div className="relative pb-6">
                                                <div className="absolute -left-6 top-[4px] w-3 h-3 rounded-full bg-slate-600" />
                                                <span className="block text-[10px] font-semibold uppercase tracking-widest text-content-tertiary mb-2">
                                                  {tCommon("highlight.solution")}
                                                </span>
                                                <div className="rounded-card border border-line bg-surface-subtle px-4 py-3">
                                                  <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line">{h.solution}</p>
                                                </div>
                                              </div>

                                              {/* Result */}
                                              <div className="relative">
                                                <div className="absolute -left-[25px] top-[4px] w-[14px] h-[14px] bg-slate-900 rotate-45 rounded-sm" />
                                                <span className="block text-[10px] font-semibold uppercase tracking-widest text-content-tertiary mb-2">
                                                  {tCommon("highlight.result")}
                                                </span>
                                                <div className="rounded-card bg-slate-900 px-4 py-3">
                                                  <p className="text-sm font-semibold text-white leading-relaxed">{h.result}</p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </motion.div>
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
                                  {tCommon("highlight.section.aiUsage")}
                                </span>
                                <div className="flex-1 h-px bg-slate-200" />
                                <motion.svg
                                  animate={{ rotate: isAiSectionOpen ? 180 : 0 }}
                                  transition={{ duration: 0.18 }}
                                  className="w-3.5 h-3.5 text-content-muted group-hover:text-content transition-colors"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </motion.svg>
                              </button>

                              <AnimatePresence initial={false}>
                                {isAiSectionOpen && (
                                  <motion.div
                                    key="ai-collapse"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    style={{ overflow: "hidden" }}
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
                                  const isAOpen = openHighlights.has(aKey);
                                  const isDetailOpen = openHighlights.has(detailKey);

                                  return (
                                    <motion.div
                                      key={i}
                                      variants={itemVariants}
                                      className="rounded-modal border border-line bg-surface overflow-hidden"
                                    >
                                      {/* Title row */}
                                      <button
                                        type="button"
                                        onClick={() => toggleHighlight(aKey)}
                                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-subtle transition-colors duration-150"
                                      >
                                        <div className="flex items-center gap-3 min-w-0">
                                          <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            AI·{String(i + 1).padStart(2, "0")}
                                          </span>
                                          <p className="text-sm font-semibold text-content truncate">{a.title}</p>
                                        </div>
                                        <motion.div
                                          animate={{ rotate: isAOpen ? 180 : 0 }}
                                          transition={{ duration: 0.18 }}
                                          className="shrink-0 ml-3 text-content-muted"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </motion.div>
                                      </button>

                                      {/* Expanded: summary + details toggle */}
                                      <AnimatePresence initial={false}>
                                        {isAOpen && (
                                          <motion.div
                                            key="body"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.22, ease: "easeInOut" }}
                                            style={{ overflow: "hidden" }}
                                          >
                                            <div className="px-5 pt-2 pb-5">
                                              {/* Summary */}
                                              <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line">
                                                {a.summary}
                                              </p>

                                              {/* Details toggle */}
                                              <button
                                                type="button"
                                                onClick={() => toggleHighlight(detailKey)}
                                                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-content-muted hover:text-content transition-colors duration-150"
                                              >
                                                <span>
                                                  {isDetailOpen
                                                    ? tCommon("highlight.hideDetails")
                                                    : tCommon("highlight.showDetails")}
                                                </span>
                                                <motion.svg
                                                  animate={{ rotate: isDetailOpen ? 180 : 0 }}
                                                  transition={{ duration: 0.18 }}
                                                  className="w-3 h-3"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                  strokeWidth={2.5}
                                                >
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </motion.svg>
                                              </button>

                                              {/* Details: 4-step timeline */}
                                              <AnimatePresence initial={false}>
                                                {isDetailOpen && (
                                                  <motion.div
                                                    key="detail"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.22, ease: "easeInOut" }}
                                                    style={{ overflow: "hidden" }}
                                                  >
                                                    <div className="relative pl-6 mt-5">
                                                      {/* Vertical connector */}
                                                      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-slate-200 via-slate-400 to-slate-900" />

                                                      {/* Context */}
                                                      <div className="relative pb-6">
                                                        <div className="absolute -left-6 top-[4px] w-3 h-3 rounded-full border-2 border-line-strong bg-surface" />
                                                        <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-300 mb-1">
                                                          {tCommon("highlight.context")}
                                                        </span>
                                                        <p className="text-sm text-content-muted leading-relaxed whitespace-pre-line">{a.context}</p>
                                                      </div>

                                                      {/* Approach */}
                                                      <div className="relative pb-6">
                                                        <div className="absolute -left-6 top-[4px] w-3 h-3 rounded-full bg-slate-500" />
                                                        <span className="block text-[10px] font-semibold uppercase tracking-widest text-content-tertiary mb-2">
                                                          {tCommon("highlight.approach")}
                                                        </span>
                                                        <div className="rounded-card border border-line bg-surface-subtle px-4 py-3">
                                                          <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line">{a.approach}</p>
                                                        </div>
                                                      </div>

                                                      {/* Verification */}
                                                      <div className="relative pb-6">
                                                        <div className="absolute -left-6 top-[4px] w-3 h-3 rounded-full bg-slate-700" />
                                                        <span className="block text-[10px] font-semibold uppercase tracking-widest text-content-tertiary mb-2">
                                                          {tCommon("highlight.verification")}
                                                        </span>
                                                        <div className="rounded-card border border-line bg-surface-subtle px-4 py-3">
                                                          <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line">{a.verification}</p>
                                                        </div>
                                                      </div>

                                                      {/* Impact */}
                                                      <div className="relative">
                                                        <div className="absolute -left-[25px] top-[4px] w-[14px] h-[14px] bg-slate-900 rotate-45 rounded-sm" />
                                                        <span className="block text-[10px] font-semibold uppercase tracking-widest text-content-tertiary mb-2">
                                                          {tCommon("highlight.impact")}
                                                        </span>
                                                        <div className="rounded-card bg-slate-900 px-4 py-3">
                                                          <p className="text-sm font-semibold text-white leading-relaxed whitespace-pre-line">{a.impact}</p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </motion.div>
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

const ResumeProfileCard: React.FC<{
  profile: ResumeProfileSourceData;
  onOpenPreview: () => void;
}> = ({ profile, onOpenPreview }) => {
  const { t } = useTranslation("common");

  return (
    <div className="rounded-3xl border border-line bg-surface/85 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-content">{profile.name}</h2>
          <p className="mt-1 text-sm font-medium text-content-secondary">{profile.targetRole}</p>
        </div>
        <button
          type="button"
          onClick={onOpenPreview}
          className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
        >
          {t("resume.openPreview")}
        </button>
      </div>

      <div className={`mt-5 grid gap-3 ${profile.phone ? "sm:grid-cols-2" : ""}`}>
        <div className="rounded-2xl bg-surface-subtle px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-content-muted">
            {t("resume.builder.email")}
          </p>
          <p className="mt-1 text-sm font-medium text-content-secondary">{profile.email}</p>
        </div>
        {profile.phone && (
          <div className="rounded-2xl bg-surface-subtle px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-content-muted">
              {t("resume.builder.phone")}
            </p>
            <p className="mt-1 text-sm font-medium text-content-secondary">{profile.phone}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {resumeLinkOrder.map((key) =>
          profile.links[key] ? (
            <a
              key={`profile-link-${key}`}
              href={profile.links[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-content-secondary transition-colors hover:border-slate-400 hover:text-content"
            >
              {t(`resume.linkLabel.${key}`, { defaultValue: key })}
            </a>
          ) : null
        )}
      </div>

      <p className="mt-5 text-sm leading-6 text-content-secondary">{profile.intro.line}</p>
      <ul className="mt-4 space-y-2">
        {profile.intro.bullets.map((bullet, index) => (
          <li key={`resume-bullet-${index}`} className="flex gap-3 text-sm text-content-meta">
            <span className="mt-1 text-slate-300">•</span>
            <span>{bullet.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ── BasicsTab ──────────────────────────────────────────────────────────────────
const BasicsTab: React.FC<{
  resumeProfile: ResumeProfileSourceData | null;
  onOpenPreview: () => void;
}> = ({ resumeProfile, onOpenPreview }) => {
  if (!resumeProfile) return null;
  return (
    <div className="space-y-8">
      <ResumeProfileCard profile={resumeProfile} onOpenPreview={onOpenPreview} />
    </div>
  );
};

// ── WorkSkillsTab ──────────────────────────────────────────────────────────────
const WorkSkillsTab: React.FC<{
  data: ProfileData;
}> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Skills on top */}
      <div className="rounded-3xl border border-line bg-surface/80 p-6 shadow-sm backdrop-blur">
        <SkillsBlock data={data.skills} />
      </div>

      {/* Work experience below */}
      <WorkBlock data={data.workExperience} />
    </div>
  );
};

// ── EducationTab ───────────────────────────────────────────────────────────────
const EducationTab: React.FC<{ data: EducationItem[] }> = ({ data }) => {
  const { t } = useTranslation("introduction");

  return (
    <motion.div
      variants={listVariants}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {data.map((item) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          className="rounded-3xl border border-line bg-surface/80 p-6 shadow-sm backdrop-blur hover:shadow-md transition-shadow duration-200"
        >
          <h3 className="text-base font-bold text-content">
            {t(`education.${item.id}.title`)}
          </h3>
          <p className="mt-1 text-base text-content-meta">
            {t(`education.${item.id}.major`)}
          </p>
          <span className="mt-2 inline-block rounded-full bg-surface-muted px-2.5 py-0.5 text-sm text-content-tertiary">
            {t(`education.${item.id}.grade`)}
          </span>
          <p className="mt-4 text-sm text-content-muted">
            {t(`education.${item.id}.period`)}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

// ── AwardsAndCertsTab ──────────────────────────────────────────────────────────
const AwardsAndCertsTab: React.FC<{ awards: AwardItem[]; certs: CertItem[] }> = ({ awards, certs }) => {
  const { t } = useTranslation("introduction");
  const { t: tCommon } = useTranslation("common");

  return (
    <motion.div variants={listVariants} className="space-y-8">
      {/* Awards */}
      <div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-content-muted">
          {tCommon("info.awards")}
        </p>
        <div className="relative">
          <div className="absolute left-[11px] top-3 bottom-3 w-px bg-slate-200 hidden sm:block" />
          <div className="space-y-3">
            {awards.map((item) => {
              const desc = t(`awards.${item.id}.description`, {
                returnObjects: true,
                defaultValue: [],
              }) as string[];

              return (
                <motion.div key={item.id} variants={itemVariants} className="sm:pl-8 relative">
                  <div className="absolute left-0 top-5 w-[23px] h-[23px] rounded-full border-2 border-slate-900 bg-surface hidden sm:flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-900" />
                  </div>
                  <div className="rounded-3xl border border-line bg-surface/80 p-6 shadow-sm backdrop-blur hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <h3 className="text-base font-bold text-content">
                        {t(`awards.${item.id}.title`)}
                      </h3>
                      <span className="shrink-0 text-sm font-medium text-content-muted bg-surface-muted px-3 py-1 rounded-full">
                        {t(`awards.${item.id}.period`)}
                      </span>
                    </div>
                    {Array.isArray(desc) && desc.filter(Boolean).length > 0 && (
                      <ul className="mt-4 space-y-1.5">
                        {desc.filter(Boolean).map((d, i) => (
                          <li key={i} className="flex gap-2 text-sm text-content-meta">
                            <span className="shrink-0 text-slate-300 mt-0.5">—</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-sm font-semibold uppercase tracking-widest text-content-muted">
          {tCommon("info.certificates")}
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Certificates */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {certs.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="rounded-3xl border border-line bg-surface/80 p-6 shadow-sm backdrop-blur hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center mb-3">
              <svg className="w-3.5 h-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-content">
              {t(`certificate.${item.id}.title`)}
            </h3>
            <p className="mt-2 text-sm text-content-muted">
              {t(`certificate.${item.id}.period`)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ── Prefetch: 모듈 로드 시 즉시 fetch 시작 (탭 클릭 전) ──────────────────────
let cachedData: ProfileData | null = null;
const dataPromise = fetch("/data/introduction.json")
  .then((r) => r.json())
  .then((json) => { cachedData = json as ProfileData; return cachedData; })
  .catch(console.error);

// ── ProfileSection ─────────────────────────────────────────────────────────────
const ProfileSection: React.FC = () => {
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("basics");
  const [data, setData] = useState<ProfileData | null>(cachedData);
  const [resumeProfile, setResumeProfile] = useState<ResumeProfileSourceData | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const tabs: { id: TabId; labelKey: string }[] = [
    { id: "basics", labelKey: "profileTabs.basics" },
    { id: "workSkills", labelKey: "profileTabs.workSkills" },
    { id: "education", labelKey: "profileTabs.education" },
    { id: "awardsAndCerts", labelKey: "profileTabs.awardsAndCerts" },
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
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleOpenPreview = () => {
    navigate("/resume-preview");
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
                  transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-150 ${activeTab === tab.id ? "text-white" : "text-content-tertiary"}`}>
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
                    transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                  />
                )}
                <span className={`relative z-10 transition-colors duration-150 ${activeTab === tab.id ? "text-white" : "text-content-meta hover:text-content"}`}>
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
                {activeTab === "basics" && (
                  <BasicsTab
                    resumeProfile={resumeProfile}
                    onOpenPreview={handleOpenPreview}
                  />
                )}
                {activeTab === "workSkills" && <WorkSkillsTab data={data} />}
                {activeTab === "education" && <EducationTab data={data.education} />}
                {activeTab === "awardsAndCerts" && (
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
