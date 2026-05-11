import type React from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFetchJson } from "../../../hooks/useFetchJson";
import type { TabStatusType } from "./MyInformation";

import { WorkSection } from "./Section/WorkSection";
import { EducationSection } from "./Section/EducationSection";
import { AwardsSection } from "./Section/AwardSection";
import { CertificateSection } from "./Section/CertificationSection";

// --- Types (✅ introduction.json 구조와 1:1 매칭) ---
export type WorkExperienceItem = {
  title: string;        // "deeptrade.title"
  period: string;       // "deeptrade.period"
  position: string;     // "deeptrade.position"
  description: string;  // "deeptrade.description" (배열 반환 키)
};

export type EducationItem = {
  title: string;  // "openUniv.title"
  period: string; // "openUniv.period"
  grade: string;  // "openUniv.grade"
  major: string;  // "openUniv.major"

  // (선택) 세로 카드용 로고를 쓰고 싶으면 introduction.json에 추가하면 됨
  logo_src?: string;
  logo_alt?: string;
};

export type AwardItem = {
  title: string;       // "seoulAiHackathon.title"
  period: string;      // "seoulAiHackathon.period"
  description: string; // "seoulAiHackathon.description" (배열 반환 키)
  rank?: number;       // 선택
};

export type CertificateItem = {
  title: string;  // "sqld.title"
  period: string; // "sqld.period"
  issuer?: string;
  tag?: string;
};

export type IntroductionData = {
  workExperience: WorkExperienceItem[];
  education: EducationItem[];
  awards: AwardItem[];
  certificates: CertificateItem[];
};

// --- Component ---
export const InfoPost: React.FC<{ tabStatus: TabStatusType }> = ({
  tabStatus,
}) => {
  const { t } = useTranslation(["common", "introduction"]);
  const { data: raw, error } = useFetchJson<Partial<IntroductionData>>("/data/introduction.json");

  const data = useMemo<IntroductionData | null>(
    () =>
      raw
        ? {
            workExperience: raw.workExperience ?? [],
            education: raw.education ?? [],
            awards: raw.awards ?? [],
            certificates: raw.certificates ?? [],
          }
        : null,
    [raw],
  );

  const title = useMemo(
    () => t(`info.${tabStatus}`, { ns: "common" }),
    [t, tabStatus]
  );

  if (error) {
    return (
      <div>
        <h2 className="mb-4 text-lg font-bold text-content">{title}</h2>
        <p className="text-sm text-rose-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <h2 className="mb-4 text-lg font-bold text-content">{title}</h2>
        <p className="text-sm text-content-tertiary">
          {t("loading", { ns: "common", defaultValue: "Loading..." })}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-content">{title}</h2>

      {tabStatus === "workExperience" && (
        <WorkSection items={data.workExperience} />
      )}

      {tabStatus === "education" && (
        <EducationSection items={data.education} />
      )}

      {tabStatus === "awards" && <AwardsSection items={data.awards} />}

      {tabStatus === "certificates" && (
        <CertificateSection items={data.certificates} />
      )}
    </div>
  );
};