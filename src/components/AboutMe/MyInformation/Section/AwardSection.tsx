import type React from "react";
import { useTranslation } from "react-i18next";
import { AwardCard } from '../AwardCard';

export type AwardItem = {
  title: string;
  period: string;
  description: string;
  rank?: number; // 1,2,3... (없으면 그냥 🏆)
};

export const AwardsSection: React.FC<{ items: AwardItem[] }> = ({ items }) => {
  const { t } = useTranslation(["introduction"]);

  return (
    <>
      {items.map((item) => {
        const desc = t(`awards.${item.description}`, {
          ns: "introduction",
          returnObjects: true,
        }) as string[];
        console.log("title")
        console.log(item.title);

        return (
          <AwardCard
            key={`${item.title}-${item.period}`}
            rank={item.rank}
            title={t(`awards.${item.title}`, { ns: "introduction" })}
            period={t(`awards.${item.period}`, { ns: "introduction" })}
            description={Array.isArray(desc) ? desc : []}
          />
        );
      })}
    </>
  );
};