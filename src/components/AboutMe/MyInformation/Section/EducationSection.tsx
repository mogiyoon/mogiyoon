import type React from "react";
import { useTranslation } from "react-i18next";
import { EducationCard } from "../EducationCard";

export type EducationItem = {
  title: string;
  period: string;
  grade: string;
  major: string;
  logo_src?: string;
  logo_alt?: string;
};

export const EducationSection: React.FC<{ items: EducationItem[] }> = ({
  items,
}) => {
  const { t } = useTranslation(["introduction"]);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {items.map((item) => (
        <EducationCard
          key={`${item.title}-${item.period}`}
          title={t(`education.${item.title}`, { ns: "introduction" })}
          period={t(`education.${item.period}`, { ns: "introduction" })}
          grade={t(`education.${item.grade}`, { ns: "introduction" })}
          major={t(`education.${item.major}`, { ns: "introduction" })}
          logoSrc={item.logo_src}
          logoAlt={item.logo_alt}
        />
      ))}
    </div>
  );
};