import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";

// 사용 빈도 3단계 — primary: 회사 주력(첫 줄, 크게), secondary: 자주 사용(둘째 줄),
// occasional: 가끔 사용(둘째 줄 끝, 흑백). 바이브 코딩으로만 쓴 스택은 넣지 않는다 (예: Rust)
// type StackTier = "primary" | "secondary" | "occasional";

// type StackItem = { name: string; src: string; tier: StackTier };

// const MAIN_STACKS: StackItem[] = [
//   { name: "React Native", src: "/images/stacks/react.svg", tier: "primary" },
//   { name: "Next.js", src: "/images/stacks/nextjs.svg", tier: "primary" },
//   { name: "TypeScript", src: "/images/stacks/typescript.svg", tier: "primary" },
//   { name: "Python", src: "/images/stacks/python.svg", tier: "primary" },
//   { name: "Claude Code", src: "/images/stacks/claudecode.svg", tier: "primary" },
// ];

// const SUB_STACKS: StackItem[] = [
//   { name: "JavaScript", src: "/images/stacks/javascript.svg", tier: "secondary" },
//   { name: "FastAPI", src: "/images/stacks/fastapi.svg", tier: "secondary" },
//   { name: "NestJS", src: "/images/stacks/nestjs.svg", tier: "secondary" },
//   { name: "MySQL", src: "/images/stacks/mysql.svg", tier: "secondary" },
//   { name: "PostgreSQL", src: "/images/stacks/postgresql.svg", tier: "secondary" },
//   { name: "AWS", src: "/images/stacks/aws.svg", tier: "secondary" },
//   { name: "Docker", src: "/images/stacks/docker.svg", tier: "secondary" },
//   { name: "Flutter", src: "/images/stacks/flutter.svg", tier: "occasional" },
// ];

// const STACK_TIER_CLASSES: Record<StackTier, { logo: string; label: string }> = {
//   primary: {
//     logo: "h-9 w-auto max-w-14 object-contain sm:h-11",
//     label: "text-xs font-semibold text-content-secondary",
//   },
//   secondary: {
//     logo: "h-5 w-auto max-w-10 object-contain opacity-90 sm:h-[22px]",
//     label: "text-[9px] font-medium text-content-meta",
//   },
//   occasional: {
//     logo: "h-5 w-auto max-w-9 object-contain opacity-60 grayscale sm:h-[22px]",
//     label: "text-[9px] text-content-muted",
//   },
// };

// const StackTile: React.FC<{ stack: StackItem }> = ({ stack }) => (
//   <div className="flex flex-col items-center gap-1.5">
//     <img src={stack.src} alt={stack.name} className={STACK_TIER_CLASSES[stack.tier].logo} />
//     <span className={`whitespace-nowrap ${STACK_TIER_CLASSES[stack.tier].label}`}>
//       {stack.name}
//     </span>
//   </div>
// );

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
          className="max-w-3xl break-keep text-base leading-relaxed text-content-secondary sm:text-lg lg:text-xl"
        >
          {t("heroHook.subBefore")}
          <span className="text-accent-violet-500 font-semibold">
            {t("heroHook.subAccent")}
          </span>
          {t("heroHook.subAfter")}
        </motion.p>

        {/* 주로 쓰는 프레임워크·언어·DB·DevOps·AI 로고 카드 —
            첫 줄: 회사 주력(크게) / 둘째 줄: 자주·가끔 쓰는 것(작게).
            로고: devicon (MIT) + simple-icons (CC0), public/images/stacks/. 이름은 고유명사라 i18n 하지 않음 */}
        {/* <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
          className="w-full max-w-3xl rounded-2xl bg-surface/70 px-5 py-5 backdrop-blur sm:px-8 sm:py-6"
        >
          <div className="flex flex-wrap items-end justify-center gap-x-7 gap-y-4 sm:gap-x-10">
            {MAIN_STACKS.map((stack) => (
              <StackTile key={stack.name} stack={stack} />
            ))}
          </div> */}
          {/* 서브 줄: 왼쪽으로 흐르는 무한 루프 마퀴 (호버 시 일시정지) */}
          {/* <div
            className="mt-5 overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            }}
          >
            <div className="stack-marquee items-end">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  aria-hidden={copy === 1 || undefined}
                  // pr(복사본 간 간격): "한 벌+간격 ≥ 카드 가시 폭(≈704px)" 이어야
                  // -50% 리셋 프레임이 시작 프레임과 동일해져 점프가 안 보인다.
                  // (부수 효과: 같은 로고가 좌우에 동시에 보이는 일도 없어짐)
                  className="flex shrink-0 items-end gap-x-8 pr-8 sm:gap-x-10 sm:pr-10"
                >
                  {SUB_STACKS.map((stack) => (
                    <StackTile key={stack.name} stack={stack} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div> */}

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
