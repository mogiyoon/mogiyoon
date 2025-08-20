import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import AnswerChecker from "./AnswerChecker";

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
  const endImage3 = useTransform(scrollYProgress, [0.71, 0.75], [0, 1]);
  const endComponent = useTransform(scrollYProgress, [0.75, 0.8], [0, 1]);

  return (
    <section ref={targetRef} className="relative h-[2000vh]">
      <div className="sticky top-0 h-screen w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-slate-100">
          {/* 시작 콘텐츠 */}
          <motion.div
            style={{ opacity: startImage1 }}
            className={`absolute inset-0 z-0`}
          >
            <img
              src="/images/aboutMe/introLine1/1.png"
              alt="image 1"
              className="absolute top-1/2 left-1/2 -translate-x-[80%] -translate-y-[130%] sm:-translate-x-[140%] sm:-translate-y-[115%] border-[1px] border-black rounded-xl shadow-[2px_2px_7px_1px_rgba(0,0,0,0.5)] sm:shadow-[7px_7px_7px_1px_rgba(0,0,0,0.5)] w-[50%] sm:w-[32%] lg:w-[26%]"
            />
          </motion.div>

          <motion.div
            style={{ opacity: startImage2 }}
            className={`absolute inset-0 z-0`}
          >
            <img
                src="/images/aboutMe/introLine1/2.png"
                alt="image 1"
                className="absolute top-1/2 left-1/2 -translate-x-[20%] translate-y-[35%] sm:translate-x-[30%] sm:translate-y-[10%] border-[1px] border-black rounded-xl shadow-[2px_2px_7px_1px_rgba(0,0,0,0.5)] sm:shadow-[7px_7px_7px_1px_rgba(0,0,0,0.5)] w-[50%] sm:w-[32%] lg:w-[26%]"
            />
          </motion.div>

          <motion.div
            style={{ opacity: startImage3 }}
            className={`absolute inset-0 z-0`}
          >
            <img
                src="/images/aboutMe/introLine1/3.png"
                alt="image 1"
                className="absolute top-1/2 left-1/2 -translate-x-[90%] translate-y-[115%] sm:-translate-x-[100%] sm:translate-y-[50%] border-[1px] border-black rounded-xl shadow-[2px_2px_7px_1px_rgba(0,0,0,0.5)] sm:shadow-[7px_7px_7px_1px_rgba(0,0,0,0.5)] w-[50%] sm:w-[32%] lg:w-[26%]"
            />
          </motion.div>

          <motion.div
            style={{ opacity: startImage4 }}
            className={`absolute inset-0 z-0`}
          >
            <img
                src="/images/aboutMe/introLine1/4.png"
                alt="image 1"
                className="absolute top-1/2 left-1/2 translate-x-[100%] -translate-y-[145%] sm:translate-x-[15%] sm:-translate-y-[130%] border-[1px] border-black rounded-xl shadow-[2px_2px_7px_1px_rgba(0,0,0,0.5)] sm:shadow-[7px_7px_7px_1px_rgba(0,0,0,0.5)] w-[20%] sm:w-[18%] lg:w-[16%]"
            />
          </motion.div>

          <motion.div
            style={{ opacity: startContentOpacity }}
            className={`absolute inset-0 z-0`}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] text-center text-lg sm:text-2xl lg:text-3xl text-white leading-relaxed tracking-wide lg:tracking-wider whitespace-nowrap">
              {t("introLine1")}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[0%] text-center text-lg sm:text-2xl lg:text-3xl text-white leading-relaxed tracking-wide lg:tracking-wider whitespace-nowrap">
              {t("introLine1-1")}
            </div>
          </motion.div>

          {/* 끝 콘텐츠 */}
          <motion.div
            style={{ opacity: endBackgroundOpacity }}
            className="absolute inset-0 z-0 bg-gradient-to-br from-red-200 via-green-100 to-emerald-200 text-gray-800"
          ></motion.div>

          <motion.div
            style={{ opacity: endIntroLine }}
            className={`absolute inset-0 z-0`}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] text-center text-lg sm:text-2xl lg:text-3xl text-black leading-relaxed tracking-wide lg:tracking-wider whitespace-nowrap">
              {t("introLine2")}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[0%] text-center text-lg sm:text-2xl lg:text-3xl text-black leading-relaxed tracking-wide lg:tracking-wider whitespace-nowrap">
              {t("introLine2-1")}
            </div>
          </motion.div>

          <motion.div style={{ opacity: endImage1 }}>
            <img
              src="/images/aboutMe/introLine2/1.png"
              alt="image 1"
              className="absolute top-1/2 left-1/2 -translate-x-[65%] -translate-y-[180%] sm:-translate-x-[80%] sm:-translate-y-[130%] border-[1px] border-black rounded-xl shadow-[2px_2px_7px_1px_rgba(0,0,0,0.5)] sm:shadow-[7px_7px_7px_1px_rgba(0,0,0,0.5)] w-[70%] sm:w-[55%] lg:w-[40%]"
            />
          </motion.div>

          <motion.div style={{ opacity: endImage2 }}>
            <img
              src="/images/aboutMe/introLine2/2.png"
              alt="image 2"
              className="absolute top-1/2 left-1/2 -translate-x-[10%] translate-y-[40%] sm:-translate-x-[10%] sm:translate-y-[50%] border-[1px] border-black rounded-xl shadow-[2px_2px_7px_1px_rgba(0,0,0,0.5)] sm:shadow-[7px_7px_7px_1px_rgba(0,0,0,0.5)] w-[50%] sm:w-[40%] lg:w-[30%]"
            />
          </motion.div>

          <motion.div style={{ opacity: endImage3 }}>
            <img
              src="/images/aboutMe/introLine2/3.png"
              alt="image 2"
              className="absolute top-1/2 left-1/2 -translate-x-[70%] translate-y-[700%] sm:-translate-x-[130%] sm:translate-y-[700%] border-[1px] border-black rounded-sm md:rounded-md shadow-[2px_2px_7px_1px_rgba(0,0,0,0.5)] sm:shadow-[5px_5px_5px_1px_rgba(0,0,0,0.5)]  w-[50%] sm:w-[40%] lg:w-[30%]"
            />
          </motion.div>

          <motion.div style={{ opacity: endComponent }}>
            <div className="absolute top-1/2 left-1/2 translate-x-[70%] -translate-y-[120%] hidden xl:inline">
              <AnswerChecker />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
