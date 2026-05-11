import React from 'react';
import { InlineArrowIcon } from '../icons';
import type { AiDevKitGroupedDetailSection } from '../types';

const SkillFlowSteps: React.FC<{ section: AiDevKitGroupedDetailSection }> = ({ section }) => {
  const steps = section.steps ?? [];

  if (!steps.length) return null;

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max flex-col gap-2 md:flex-row md:items-center">
        {steps.map((step, index) => (
          <React.Fragment key={`${section.title}-${step}`}>
            <div className="flex min-w-[140px] flex-col items-center rounded-card border border-line/70 bg-surface px-4 py-3 text-center shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-700">
                Step {index + 1}
              </span>
              <span className="mt-1 text-sm font-bold text-content">
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <>
                <div className="flex items-center justify-center md:hidden">
                  <div className="h-8 w-px bg-line" />
                </div>
                <div className="hidden items-center justify-center md:flex">
                  <div className="h-px w-7 bg-line" />
                  <InlineArrowIcon />
                  <div className="h-px w-7 bg-line" />
                </div>
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SkillFlowSteps;
