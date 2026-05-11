import type React from "react";
import { Chip } from "../../primitives/Chip";
import InfoCell from "../../primitives/InfoCell";

export const EducationCard: React.FC<{
  title: React.ReactNode;
  period: React.ReactNode;
  major: React.ReactNode;
  grade?: React.ReactNode;
  logoSrc?: string;
  logoAlt?: string;
}> = ({ title, period, major, grade, logoSrc, logoAlt }) => {
  return (
    <div className="my-6 overflow-hidden rounded-card-soft-28 border border-line bg-surface/80 shadow-sm backdrop-blur">
      {/* Top Header (조금 더 두껍게) */}
      <div className="p-6 pb-4">
        <h3 className="text-xl font-bold text-content leading-snug">
          {title}
        </h3>
        <p className="mt-2 text-sm text-content-tertiary">{period}</p>
      </div>

      {/* Middle Logo Area (세로 카드의 핵심: 더 크게) */}
      <div className="px-6">
        <div className="relative flex min-h-[240px] items-center justify-center rounded-modal border border-line/70 bg-surface">
          {/* subtle background */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-surface-muted/60 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-surface-muted/60 blur-2xl" />

          {logoSrc ? (
            <img
              src={logoSrc}
              alt={logoAlt ?? "logo"}
              className="relative h-28 w-28 object-contain drop-shadow-sm"
            />
          ) : (
            <div className="relative text-sm font-semibold text-content-muted">
              Logo
            </div>
          )}

          {/* Badge */}
          <Chip
            tone="outlined"
            size="mdWide"
            weight="semibold"
            className="absolute left-4 top-4"
          >
            Education
          </Chip>
        </div>
      </div>

      {/* Bottom Info (섹션 느낌으로 분리) */}
      <div className="p-6 pt-5 space-y-4">
        {grade ? <InfoCell label="Grade" value={grade} variant="bordered" /> : null}
        <InfoCell label="Major" value={major} variant="bordered" />
      </div>
    </div>
  );
};