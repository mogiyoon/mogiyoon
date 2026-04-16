import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type WorkItem = {
  title: string;        // "deeptrade.title"
  period: string;       // "deeptrade.period"
  position: string;     // "deeptrade.position"
  description: string;  // "deeptrade.description" (배열 반환)
};

export const WorkSection: React.FC<{ items: WorkItem[] }> = ({ items }) => {
  const { t } = useTranslation(["common", "introduction"]);

  // 첫 카드 기본 open (데이터가 비동기일 수도 있으니 effect로 보정)
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    if (openIdx === null && items.length > 0) setOpenIdx(0);
  }, [items, openIdx]);

  const w = (key: string) => t(`work.${key}`, { ns: "introduction" });

  const wArr = (key: string) => {
    const v = t(`work.${key}`, { ns: "introduction", returnObjects: true }) as string | string[];
    if (Array.isArray(v)) return v.filter(Boolean);
    if (typeof v === "string" && v.trim().length > 0) return [v];
    return [];
  };

  return (
    <div className="space-y-5">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        const desc = wArr(item.description);

        return (
          <div
            key={`${item.title}-${item.period}-${idx}`}
            className="rounded-3xl border border-line bg-surface/80 shadow-sm backdrop-blur"
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => setOpenIdx((prev) => (prev === idx ? null : idx))}
              className="w-full p-6 text-left"
              aria-expanded={isOpen}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-content">
                    {w(item.title)}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-content-secondary">
                    {w(item.position)}
                  </p>
                  <p className="mt-1 text-sm text-content-tertiary">{w(item.period)}</p>
                </div>

                <div className="shrink-0 text-right">
                  <span className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-content-secondary">
                    {isOpen ? t("close", { ns: "common", defaultValue: "Close" }) : t("details", { ns: "common", defaultValue: "Details" })}
                  </span>
                </div>
              </div>
            </button>

            {/* Body (Accordion) */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-6">
                <div className="rounded-modal border border-line/70 bg-surface p-5">
                  <p className="text-sm font-bold text-content">
                    {t("work_key_achievements", {
                      ns: "common",
                      defaultValue: "Key Highlights",
                    })}
                  </p>

                  {desc.length > 0 ? (
                    <ul className="mt-3 list-disc pl-5 text-sm text-content-secondary">
                      {desc.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-content-muted">
                      {t("no_description", {
                        ns: "common",
                        defaultValue: "Add descriptions in i18n (array).",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};