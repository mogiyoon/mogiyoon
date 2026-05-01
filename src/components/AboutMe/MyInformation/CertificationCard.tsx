import type React from "react";
import { Chip } from "../../primitives/Chip";

export const CertificationCard: React.FC<{
  title: React.ReactNode;
  period: React.ReactNode;
  issuer?: React.ReactNode;
  tag?: string;
}> = ({ title, period, issuer, tag }) => {
  return (
    <div className="my-5 rounded-3xl border border-line bg-surface/80 p-6 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-content">{title}</h3>
          <p className="mt-1 text-sm text-content-tertiary">{period}</p>
          {issuer ? <p className="mt-1 text-sm text-content-meta">{issuer}</p> : null}
        </div>

        <div className="shrink-0 space-y-2 text-right">
          <Chip tone="outlinedStrong" size="mdWide" weight="semibold">
            Certified
          </Chip>
          {tag ? (
            <span className="block text-xs text-content-tertiary">{tag}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};