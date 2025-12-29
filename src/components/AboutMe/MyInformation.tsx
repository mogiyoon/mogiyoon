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

  // // --- Data Definition ---
  // const educationItems = useMemo<InfoItem[]>(
  //   () => [
  //     {
  //       title: "한국방송통신대학교 · 컴퓨터과학과",
  //       period: "2025.03 - 재학중",
  //     },
  //     {
  //       title: "제주대학교 · 초등교육학과",
  //       period: "2019.03 - 2023.02",
  //     },
  //   ],
  //   []
  // );

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
    const el = containerRef.current;
    if (!el) return;

    let active = false;
    let locked = false;

    // 이 섹션이 화면에 충분히 들어오면 active
    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting && entry.intersectionRatio >= 0.6;
      },
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);

    const onWheel = (e: WheelEvent) => {
      if (!active) return; // 이 화면 아닐 땐 아무 것도 안 함
      if (locked) return;

      e.preventDefault(); // 여기서만 기본 스크롤 막기
      locked = true;

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-fullpage]")
      );
      const idx = sections.indexOf(el);
      const dir = e.deltaY > 0 ? 1 : -1;
      const target = sections[idx + dir];

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // 연속 휠 방지 (트랙패드 폭주 방지)
      window.setTimeout(() => {
        locked = false;
      }, 700);
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      io.disconnect();
      window.removeEventListener("wheel", onWheel as any);
    };
  }, []);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [introductionResponse] = await Promise.all([
          fetch("/data/introduction.json"),
        ]);
        const projectsData = await introductionResponse.json();
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

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-8 pt-24">
        {/* 메인 레이아웃 */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[3fr_7fr] sm:gap-8">
          {/* 왼쪽 컬럼 (모바일에서는 아래로) */}
          <div className="order-2 space-y-8 sm:order-1">
            <InfoCard
              title={t("info.experience", "교육 및 학력")}
              items={experienceItems}
            />
            <InfoCard
              title={t("info.awards", "수상 및 기타")}
              items={awardItems}
            />
            <InfoCard
              title={t("info.certificates", "자격증")}
              items={certificateItems}
            />
          </div>

          {/* 오른쪽 컬럼 (모바일에서는 위로) */}
          <div className="order-1 space-y-8 sm:order-2">
            <InfoPost title="경력" items={introductionData?.work} />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Sub Components ---

const InfoPost: React.FC<{ title: string; items: WorkItem[] | undefined }> = ({
  title,
  items,
}) => {
  const { t } = useTranslation(["common", "introduction"]);

  if (!items) return;

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-slate-900">{title}</h2>
      {items.map((item) => (
        <div
          className="
                    group/mini rounded-2xl border border-slate-200 bg-white/80
                    p-5 my-5 shadow-sm backdrop-blur
                    transition-all duration-300
                  "
        >
          {/* 제목 줄 (항상 보임) */}
          <h3 className="font-semibold text-slate-900 leading-snug">
            {t(`work.${item.title}`, { ns: "introduction" })}
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
                  <div className="grid grid-cols-[4fr_8fr] gap-4">
                    <p className="text-sm font-semibold text-slate-900 text-center">
                      {t("period", { ns: "common" })}
                    </p>

                    {item.period && (
                      <p className="text-sm text-slate-500">
                        {t(`work.${item.period}`, { ns: "introduction" })}
                      </p>
                    )}

                    <p className="text-sm font-semibold text-slate-900 text-center">
                      {t("position", { ns: "common" })}
                    </p>

                    {item.position && (
                      <p className="text-sm text-slate-500">
                        {t(`work.${item.position}`, { ns: "introduction" })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const InfoCard: React.FC<{
  title: string;
  items: InfoItem[];
}> = ({ title }) => {
  return (
    <div className="group block duration-700 w-[300px] rounded-2xl border border-slate-200 bg-white/60 p-8 shadow-sm backdrop-blur-md">
      <h2 className="text-lg font-bold text-slate-900 ">{title}</h2>
    </div>
  );
};
