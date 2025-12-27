import { motion, useScroll, useSpring } from "framer-motion";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// --- Types ---
interface InfoItem {
  title: string;
  period?: string;
  description?: string[];
  badge?: string;
}

interface SkillSet {
  framework: string[];
  language: string[];
  db: string[];
  infra: string[];
}

type WorkItem = {
  title: string;
  period: string;
  position: string;
  description: string;
};

type IntroductionDataType = {
  work: WorkItem[];
};

// --- Main Component ---
export const MyInformation: React.FC = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  // 섹션 전체의 스크롤 진행률 추적
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 진행 바 애니메이션 (부드럽게 보정)
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // --- Data Definition ---
  const educationItems = useMemo<InfoItem[]>(
    () => [
      {
        title: "한국방송통신대학교 · 컴퓨터과학과",
        period: "2025.03 - 재학중",
      },
      {
        title: "제주대학교 · 초등교육학과",
        period: "2019.03 - 2023.02",
      },
    ],
    []
  );

  const experienceItems = useMemo<InfoItem[]>(
    () => [
      {
        title: "딥트레이드테크놀러지스",
        period: "2025.09.27 ~",
        badge: "Work",
        description: ["재직중"],
      },
      {
        title: "크래프톤 정글 교육 과정 이수",
        period: "2025.03 - 2025.07",
        badge: "Education",
        description: [
          "자료구조/알고리즘, 메모리 관리, 네트워크, 운영체제 학습",
          "자료구조 구현을 통한 동작 원리의 깊은 이해",
          "Pintos 미니 운영체제: 시스템콜/가상메모리 구현 경험",
        ],
      },
    ],
    []
  );

  const skillsItems = useMemo<SkillSet>(
    () => ({
      framework: ["React", "React Native", "Nest.js", "SpringBoot"],
      language: ["TypeScript", "C", "JAVA", "Python"],
      db: ["PostgreSQL", "MongoDB"],
      infra: ["AWS (EC2, S3, ALB, VPC, CloudFront)"],
    }),
    []
  );

  const awardItems = useMemo<InfoItem[]>(
    () => [
      {
        title: "서울AI 해커톤 대상 (서울특별시장상)",
        period: "2025.10.02",
        badge: "Award",
      },
      {
        title: "제주지역 대학 발명 창의 대회 은상",
        period: "2019.11",
        badge: "Award",
        description: ["‘손가락 에어백’ — 물체의 상태 변화와 부피의 관계 활용"],
      },
    ],
    []
  );

  const certificateItems = useMemo<InfoItem[]>(
    () => [
      {
        title: "정보처리기사",
        period: "필기 2024.08.08",
        badge: "Certificate",
      },
      {
        title: "SQLD",
        period: "2024.12.12",
        badge: "Certificate",
      },
      {
        title: "교원자격증",
        period: "2023.02.17",
        badge: "Certificate",
      },
    ],
    []
  );

  const [introductionData, setIntroductionData] =
    useState<IntroductionDataType>();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [introductionResponse] = await Promise.all([
          fetch("/data/introduction.json"),
        ]);
        console.log('=--====-=-=-=-=-=')
        const projectsData = await introductionResponse.json();
        console.log(projectsData)
        setIntroductionData(projectsData);
      } catch (error) {
        console.error("Failed to fetch project lists:", error);
      } finally {
        // setIsLoading(false);
      }
    };
    fetchLists();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full">
      {/* 배경 그라디언트 (고정) */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-white via-slate-50 to-slate-100 pointer-events-none" />

      {/* 상단 진행 바 (Sticky) */}
      <div className="sticky top-0 z-50 h-1.5 w-full bg-slate-200/50 backdrop-blur-sm">
        <motion.div
          style={{ scaleX, transformOrigin: "0%" }}
          className="h-full bg-slate-900"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-24">
        {/* 메인 그리드 */}
        {introductionData && <InfoPost items={introductionData?.work} />}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
          {/* 왼쪽 컬럼 */}
          <div className="space-y-8">
            <InfoCard
              title={t("info.experience", "경력 · 교육")}
              items={experienceItems}
            />
            <InfoCard
              title={t("info.education", "학력")}
              items={educationItems}
            />
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="space-y-8">
            <SkillCard title={t("info.skills", "스킬")} skills={skillsItems} />
            <InfoCard
              title={t("info.awards", "수상 및 기타")}
              items={awardItems}
            />
            <InfoCard
              title={t("info.certificates", "자격증")}
              items={certificateItems}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Sub Components ---

const InfoPost: React.FC<{ items: WorkItem[] }> = ({ items }) => {
  const { t } = useTranslation('introduction');

  return items.map((item) => (
    <div
      className="
              group/mini rounded-2xl border border-slate-200 bg-white/80
              p-5 my-5 shadow-sm backdrop-blur
              transition-all duration-300
            "
    >
      {/* 제목 줄 (항상 보임) */}
      <h3 className="font-semibold text-slate-900 leading-snug">
        {t(`work.${item.title}`)}
      </h3>

      {/* 아래로 펼쳐지는 흰 패널 */}
      <div
        className="
                mt-3 overflow-hidden rounded-xl border border-slate-200/70 bg-white
                transition-all duration-700
                max-h-60 opacity-100 translate-y-0
              "
      >
        <div className="p-4">
          {/* period + badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {item.period && (
                <p className="text-sm text-slate-500">{t(`work.${item.period}`)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
};

const InfoCard: React.FC<{
  title: string;
  items: InfoItem[];
}> = ({ title, items }) => {
  return (
    <div className="group block duration-700 w-[300px] hover:w-[100%] rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur-md">
      <h2 className="mb-4 text-lg font-bold text-slate-900">{title}</h2>
      <div
        className="
        space-y-4 transition-all duration-700 ease
        max-h-0 opacity-0 group-hover:max-h-[500px] group-hover:opacity-100 group-hover:delay-700"
      >
        {items.map((item) => (
          <div
            className="
              group/mini rounded-2xl border border-slate-200 bg-white/80
              p-5 shadow-sm backdrop-blur
              transition-all duration-300
              hover:shadow-md
            "
          >
            {/* 제목 줄 (항상 보임) */}
            <h3 className="font-semibold text-slate-900 leading-snug">
              {item.title}
            </h3>

            {/* 아래로 펼쳐지는 흰 패널 */}
            <div
              className="
                mt-3 overflow-hidden rounded-xl border border-slate-200/70 bg-white
                transition-all duration-700
                max-h-0 opacity-0 translate-y-1
                group-hover/mini:max-h-60 group-hover/mini:opacity-100 group-hover/mini:translate-y-0
              "
            >
              <div className="p-4">
                {/* period + badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {item.period && (
                      <p className="text-sm text-slate-500">{item.period}</p>
                    )}
                  </div>

                  {item.badge && (
                    <span className="flex-shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* description */}
                {item.description?.length ? (
                  <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-slate-600">
                    {item.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillCard: React.FC<{
  title: string;
  skills: SkillSet;
}> = ({ title, skills }) => {
  return (
    <div className="block rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur-md">
      <h2 className="mb-4 text-lg font-bold text-slate-900">{title}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SkillBlock category="Framework" items={skills.framework} />
        <SkillBlock category="Language" items={skills.language} />
        <SkillBlock category="Database" items={skills.db} />
        <SkillBlock category="Infrastructure" items={skills.infra} />
      </div>
    </div>
  );
};

const SkillBlock: React.FC<{ category: string; items: string[] }> = ({
  category,
  items,
}) => (
  <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
      {category}
    </p>
    <div className="flex flex-wrap gap-2">
      {items.map((skill) => (
        <span
          key={skill}
          className="rounded-md bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
);
