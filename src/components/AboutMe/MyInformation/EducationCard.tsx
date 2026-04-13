import type React from "react";

export const EducationCard: React.FC<{
  title: React.ReactNode;
  period: React.ReactNode;
  major: React.ReactNode;
  grade?: React.ReactNode;
  logoSrc?: string;
  logoAlt?: string;
}> = ({ title, period, major, grade, logoSrc, logoAlt }) => {
  return (
    <div className="my-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white/80 shadow-sm backdrop-blur">
      {/* Top Header (조금 더 두껍게) */}
      <div className="p-6 pb-4">
        <h3 className="text-xl font-bold text-slate-900 leading-snug">
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-500">{period}</p>
      </div>

      {/* Middle Logo Area (세로 카드의 핵심: 더 크게) */}
      <div className="px-6">
        <div className="relative flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-200/70 bg-white">
          {/* subtle background */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-slate-100/60 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-slate-100/60 blur-2xl" />

          {logoSrc ? (
            <img
              src={logoSrc}
              alt={logoAlt ?? "logo"}
              className="relative h-28 w-28 object-contain drop-shadow-sm"
            />
          ) : (
            <div className="relative text-sm font-semibold text-slate-400">
              Logo
            </div>
          )}

          {/* Badge */}
          <div className="absolute left-4 top-4 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            Education
          </div>
        </div>
      </div>

      {/* Bottom Info (섹션 느낌으로 분리) */}
      <div className="p-6 pt-5 space-y-4">
        {grade ? (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
            <p className="text-xs font-bold text-slate-900">Grade</p>
            <p className="mt-1 text-sm text-slate-700">{grade}</p>
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
          <p className="text-xs font-bold text-slate-900">Major</p>
          <p className="mt-1 text-sm text-slate-700">{major}</p>
        </div>
      </div>
    </div>
  );
};