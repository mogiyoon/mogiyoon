import type React from "react";
import { useTranslation } from "react-i18next";
import { CertificationCard } from '../CertificationCard';

export type CertificateItem = {
  title: string;
  period: string;
  issuer?: string; // i18n key로 관리하거나 그냥 문자열로 둬도 됨
  tag?: string;    // "National", "Professional" 같은 라벨
};

export const CertificateSection: React.FC<{ items: CertificateItem[] }> = ({ items }) => {
  const { t } = useTranslation(["introduction"]);

  return (
    <>
      {items.map((item) => (
        <CertificationCard
          key={`${item.title}-${item.period}`}
          title={t(`certificate.${item.title}`, { ns: "introduction" })}
          period={t(`certificate.${item.period}`, { ns: "introduction" })}
          issuer={item.issuer}
          tag={item.tag}
        />
      ))}
    </>
  );
};