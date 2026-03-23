import type React from "react";

export const WorkExperienceCard: React.FC<{
  company: React.ReactNode;
  role: React.ReactNode;
  period: React.ReactNode;
  metaRight?: React.ReactNode; // employment/location 같은 것
  oneLiner?: React.ReactNode;
  achievements?: string[];
  tech?: string[];
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode; // projects
}> = ({
  company,
  role,
  period,
  metaRight,
  oneLiner,
  achievements,
  tech,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="my-5 rounded-3xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-6 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-900">{company}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-700">{role}</p>
            <p className="mt-1 text-sm text-slate-500">{period}</p>
          </div>

          <div className="shrink-0 text-right">
            {metaRight}
            <p className="mt-2 text-xs text-slate-500">{isOpen ? "접기" : "자세히"}</p>
          </div>
        </div>

        {oneLiner ? (
          <p className="mt-4 text-sm text-slate-600">{oneLiner}</p>
        ) : null}

        {/* Tech chips (항상 노출 추천) */}
        {tech?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tech.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {s}
              </span>
            ))}
          </div>
        ) : null}
      </button>

      {/* Body: achievements + projects */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6">
          {achievements?.filter(Boolean).length ? (
            <div className="mt-2 rounded-2xl border border-slate-200/70 bg-white p-5">
              <p className="text-sm font-bold text-slate-900">Key Achievements</p>
              <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
                {achievements.filter(Boolean).map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {children ? <div className="mt-4">{children}</div> : null}
        </div>
      </div>
    </div>
  );
};