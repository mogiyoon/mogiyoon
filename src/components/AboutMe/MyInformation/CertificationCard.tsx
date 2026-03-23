import type React from "react";

export const CertificationCard: React.FC<{
  title: React.ReactNode;
  period: React.ReactNode;
  issuer?: React.ReactNode;
  tag?: string;
}> = ({ title, period, issuer, tag }) => {
  return (
    <div className="my-5 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{period}</p>
          {issuer ? <p className="mt-1 text-sm text-slate-600">{issuer}</p> : null}
        </div>

        <div className="shrink-0 space-y-2 text-right">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-800">
            Certified
          </span>
          {tag ? (
            <span className="block text-xs text-slate-500">{tag}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};