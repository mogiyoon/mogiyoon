import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export const IntroLine: React.FC = () => {
  const { t } = useTranslation();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const startContentOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.45],
    [1, 0]
  );
  const startImage1 = useTransform(scrollYProgress, [0.03, 0.06, 0.30, 0.32], [0, 1, 1, 0]);
  const startImage2 = useTransform(scrollYProgress, [0.06, 0.09, 0.32, 0.34], [0, 1, 1, 0]);
  const startImage3 = useTransform(scrollYProgress, [0.09, 0.12, 0.34, 0.36], [0, 1, 1, 0]);
  const startImage4 = useTransform(scrollYProgress, [0.12, 0.15, 0.36, 0.38], [0, 1, 1, 0]);
  const endBackgroundOpacity = useTransform(
    scrollYProgress,
    [0.45, 0.5],
    [0, 1]
  );
  const endIntroLine = useTransform(scrollYProgress, [0.55, 0.60], [0, 1]);
  const endImage1 = useTransform(scrollYProgress, [0.63, 0.67], [0, 1]);
  const endImage2 = useTransform(scrollYProgress, [0.67, 0.71], [0, 1]);

  return (
    <section ref={targetRef} className="relative h-[2000vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-white text-slate-100">
          {/* 시작 콘텐츠 */}
          <motion.div
            style={{ opacity: startImage1 }}
            className={`absolute inset-0 z-0`}
          >
            <img
              src="/images/aboutMe/introLine1/1.png"
              alt="image 1"
              className="absolute top-[12%] right-[8%] sm:top-[15%] sm:right-[12%] border-[1px] border-black rounded-card shadow-polaroid-sm sm:shadow-polaroid-lg w-[40%] sm:w-[28%] lg:w-[22%]"
            />
          </motion.div>

          <motion.div
            style={{ opacity: startImage2 }}
            className={`absolute inset-0 z-0`}
          >
            <img
                src="/images/aboutMe/introLine1/2.png"
                alt="image 1"
                className="absolute bottom-[15%] right-[5%] sm:bottom-[18%] sm:right-[8%] border-[1px] border-black rounded-card shadow-polaroid-sm sm:shadow-polaroid-lg w-[40%] sm:w-[28%] lg:w-[22%]"
            />
          </motion.div>

          <motion.div
            style={{ opacity: startContentOpacity }}
            className={`absolute inset-0 z-0`}
          >
            <div className="absolute top-1/2 left-[8%] sm:left-[12%] lg:left-[16%] -translate-y-[100%] text-left text-3xl sm:text-5xl lg:text-6xl text-content-strong font-bold leading-tight tracking-tight whitespace-nowrap">
              {t("introLine1")}
            </div>
            <div className="absolute top-1/2 left-[8%] sm:left-[12%] lg:left-[16%] -translate-y-[0%] text-left text-3xl sm:text-5xl lg:text-6xl text-content-strong font-bold leading-tight tracking-tight whitespace-nowrap">
              {t("introLine1-1")}
            </div>
          </motion.div>

          {/* 끝 콘텐츠 */}
          <motion.div
            style={{ opacity: endBackgroundOpacity }}
            className="absolute inset-0 z-0 bg-white text-content-strong"
          ></motion.div>

          <motion.div
            style={{ opacity: endIntroLine }}
            className={`absolute inset-0 z-0`}
          >
            <div className="absolute top-1/2 left-[8%] sm:left-[12%] lg:left-[16%] -translate-y-[100%] text-left text-3xl sm:text-5xl lg:text-6xl text-content-strong font-bold leading-tight tracking-tight whitespace-nowrap">
              {t("introLine2")}
            </div>
            <div className="absolute top-1/2 left-[8%] sm:left-[12%] lg:left-[16%] -translate-y-[0%] text-left text-3xl sm:text-5xl lg:text-6xl text-content-strong font-bold leading-tight tracking-tight whitespace-nowrap">
              {t("introLine2-1")}
            </div>
          </motion.div>

          <motion.div style={{ opacity: endImage1 }}>
            <img
              src="/images/aboutMe/introLine2/1.png"
              alt="image 1"
              className="absolute top-[10%] right-[5%] sm:top-[12%] sm:right-[10%] border-[1px] border-black rounded-card shadow-polaroid-sm sm:shadow-polaroid-lg w-[50%] sm:w-[38%] lg:w-[28%]"
            />
          </motion.div>

          <motion.div style={{ opacity: endImage2 }}>
            <img
              src="/images/aboutMe/introLine2/2.png"
              alt="image 2"
              className="absolute bottom-[12%] right-[10%] sm:bottom-[15%] sm:right-[5%] border-[1px] border-black rounded-card shadow-polaroid-sm sm:shadow-polaroid-lg w-[40%] sm:w-[30%] lg:w-[22%]"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
