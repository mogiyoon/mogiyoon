import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";

export const HeroHook: React.FC = () => {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const scrollCueOpacity = useTransform(scrollY, [0, 200], [1, 0]);

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
          className="max-w-3xl text-base leading-relaxed text-content-secondary sm:text-lg lg:text-xl"
        >
          {t("heroHook.subBefore")}
          <span className="text-accent-violet-500 font-semibold">
            {t("heroHook.subAccent")}
          </span>
          {t("heroHook.subAfter")}
        </motion.p>

      </div>

      {/* Scroll cue: text above the ▼, centered at bottom.
          스크롤할수록 자연스럽게 opacity 감소 (0 → 200px). */}
      <motion.div
        style={{ opacity: scrollCueOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="font-latin text-xs font-medium text-content-meta">
          {t("heroHook.scrollCue")}
        </span>
        <motion.span
          className="text-accent-500 text-sm leading-none"
          animate={{
            y: [0, 10, 0],
            scale: [1, 1.15, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          ▼
        </motion.span>
      </motion.div>
    </section>
  );
};

export default HeroHook;
