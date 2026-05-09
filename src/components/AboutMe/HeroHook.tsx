import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface ProjectItem {
  number: string;
  descKey: string;
  whyKey: string;
  codename: string;
  icon: string;
  titleKey: string;
  subKey: string;
}

const PROJECTS: ProjectItem[] = [
  {
    number: "01",
    descKey: "heroHook.project1Desc",
    whyKey: "heroHook.project1Why",
    codename: "test-maker",
    icon: "/images/testMaker/Icon.png",
    titleKey: "heroHook.project1Title",
    subKey: "heroHook.project1Sub",
  },
  {
    number: "02",
    descKey: "heroHook.project2Desc",
    whyKey: "heroHook.project2Why",
    codename: "boj-snippets",
    icon: "/images/bojSnippets/Icon.png",
    titleKey: "heroHook.project2Title",
    subKey: "heroHook.project2Sub",
  },
  {
    number: "03",
    descKey: "heroHook.project3Desc",
    whyKey: "heroHook.project3Why",
    codename: "mrnsg",
    icon: "/images/mrnsg/Icon.svg",
    titleKey: "heroHook.project3Title",
    subKey: "heroHook.project3Sub",
  },
];

export const HeroHook: React.FC = () => {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<string | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showPreview = (codename: string) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setHovered(codename);
  };

  const schedulePreviewHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setHovered(null), 120);
  };

  return (
    <section className="relative h-screen w-full bg-white overflow-hidden">
      <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col items-center justify-center gap-7 px-3 pb-24 pt-12 text-center md:px-5 lg:gap-10 lg:px-8 lg:pb-28">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <span className="w-2 h-2 rounded-full bg-accent-500" />
          <span className="font-latin text-xs sm:text-sm font-semibold tracking-[0.25em] text-accent-700 uppercase">
            {t("heroHook.eyebrow")}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-content-strong tracking-tight leading-[1.2]"
        >
          <span className="block">{t("heroHook.headlineLine1")}</span>
          <span className="block">{t("heroHook.headlineLine2")}</span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          className="text-base sm:text-lg lg:text-xl text-content-secondary"
        >
          {t("heroHook.subBefore")}
          <span className="text-accent-violet-500 font-semibold">
            {t("heroHook.subAccent")}
          </span>
          {t("heroHook.subAfter")}
        </motion.p>

        {/* Hover hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="hidden md:flex items-center justify-center gap-1.5 text-[11px] lg:text-xs text-content-meta"
        >
          <span className="text-accent-500 leading-none">↗</span>
          <span>{t("heroHook.hoverHint")}</span>
        </motion.p>

        {/* Project list */}
        <ul className="flex w-full max-w-3xl flex-col gap-3 text-left lg:gap-4">
          {PROJECTS.map((p, i) => (
            <motion.li
              key={p.codename}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.5 + i * 0.08, ease: "easeOut" }}
              className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6"
            >
              <span className="font-mono font-semibold text-xs sm:text-sm text-accent-500 w-8 shrink-0 sm:pt-1">
                {p.number}
              </span>
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-base lg:text-lg text-content-strong font-medium">
                  {t(p.descKey)}
                </span>
                <span className="text-xs lg:text-sm text-content-meta leading-relaxed">
                  {t(p.whyKey)}
                </span>
              </div>

              <span
                className="relative font-mono text-xs lg:text-sm text-content-meta shrink-0 sm:w-36 sm:text-right sm:pt-1 hover:text-accent-700 transition-colors cursor-default"
                onMouseEnter={() => showPreview(p.codename)}
                onMouseLeave={schedulePreviewHide}
              >
                {p.codename}
                <AnimatePresence>
                  {hovered === p.codename && (
                    <ProjectPreview
                      icon={p.icon}
                      title={t(p.titleKey)}
                      subtitle={t(p.subKey)}
                    />
                  )}
                </AnimatePresence>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Scroll cue: text above the ▼, centered at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.85 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="font-latin text-xs font-medium text-content-meta">
          {t("heroHook.scrollCue")}
        </span>
        <motion.span
          className="text-accent-500 text-sm leading-none"
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          ▼
        </motion.span>
      </motion.div>
    </section>
  );
};

interface ProjectPreviewProps {
  icon: string;
  title: string;
  subtitle: string;
}

const ProjectPreview = ({ icon, title, subtitle }: ProjectPreviewProps) => (
  <motion.div
    initial={{ opacity: 0, y: -4, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -4, scale: 0.96 }}
    transition={{ duration: 0.16, ease: "easeOut" }}
    className="hidden md:block absolute right-0 bottom-full mb-3 w-72 lg:w-80 z-50 text-left bg-white rounded-2xl border border-line shadow-xl p-4"
  >
    <div className="flex items-start gap-3">
      <img
        src={icon}
        alt={title}
        className="w-10 h-10 rounded-lg flex-shrink-0 bg-slate-50 object-contain border border-line"
      />
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-content-strong truncate font-latin">
          {title}
        </h4>
        <p className="text-xs text-content-secondary mt-1 leading-relaxed whitespace-normal">
          {subtitle}
        </p>
      </div>
    </div>
  </motion.div>
);

export default HeroHook;
