import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { InfoPost } from "./InfoPost";
import { tabStatusType } from "./types";

export type TabStatusType = keyof typeof tabStatusType;

const phaseType = {
  Idle: "Idle",
  Closing: "Closing",
} as const;

type PhaseType = keyof typeof phaseType;

export const MyInformation: React.FC = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const [tabStatus, setTabStatus] = useState<TabStatusType>(
    tabStatusType.workExperience
  );
  const [next, setNext] = useState<TabStatusType | null>(null);
  const [phase, setPhase] = useState<PhaseType>(phaseType.Idle);

  const animationDuration = 700;

  const handleChange = (target: TabStatusType) => {
    if (target === tabStatus) return;
    setNext(target);
    setPhase(phaseType.Closing);
  };

  // pt-24 + padding 감안해서 적당히 빼줌 (원하면 여기 수치는 네가 조절)
  const rightPaneMaxHeight =
    phase === phaseType.Idle ? "calc(100vh - 180px)" : "0px";

  const infoMainViewClass =
    phase === phaseType.Idle
      ? `transition-all duration-${animationDuration}`
      : `transition-all duration-${animationDuration}`;

  const isEducation = tabStatus === tabStatusType.education;

  useEffect(() => {
    if (phase === phaseType.Closing && next) {
      const timer = setTimeout(() => {
        setTabStatus(next);
        setNext(null);
        setPhase(phaseType.Idle);
      }, animationDuration);

      return () => clearTimeout(timer);
    }
  }, [phase, next]);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-white via-slate-50 to-slate-100 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-8 pt-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[3fr_7fr] sm:gap-8">
          {/* 왼쪽 */}
          <div className="order-2 space-y-8 sm:order-1">
            <InfoButton
              title={t("info.workExperience")}
              onClick={() => handleChange(tabStatusType.workExperience)}
            />
            <InfoButton
              title={t("info.education")}
              onClick={() => handleChange(tabStatusType.education)}
            />
            <InfoButton
              title={t("info.awards")}
              onClick={() => handleChange(tabStatusType.awards)}
            />
            <InfoButton
              title={t("info.certificates")}
              onClick={() => handleChange(tabStatusType.certificates)}
            />
          </div>

          {/* 오른쪽: ✅ 스크롤 영역 */}
          <div
            className={`
              order-1 sm:order-2
              ${isEducation ? "" : "space-y-8"}
              ${
                phase === phaseType.Closing
                  ? "overflow-hidden"
                  : "overflow-y-auto"
              }
              overscroll-contain
              ${infoMainViewClass}
            `}
            style={{
              maxHeight: rightPaneMaxHeight,
            }}
          >
            <InfoPost tabStatus={tabStatus} />
          </div>
        </div>
      </div>
    </section>
  );
};

const InfoButton: React.FC<{ title: string; onClick: () => void }> = ({
  title,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="group block duration-700 w-[300px] rounded-modal border border-line bg-surface/60 p-8 shadow-sm backdrop-blur-md"
    >
      <h2 className="text-lg text-left font-bold text-content">{title}</h2>
    </button>
  );
};
