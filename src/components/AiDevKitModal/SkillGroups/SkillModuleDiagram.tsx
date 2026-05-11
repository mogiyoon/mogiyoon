import React from 'react';
import { formatIndex } from '../../../utils/formatIndex';
import type { AiDevKitSkillItem } from '../types';

const SkillModuleDiagram: React.FC<{ skillItem: AiDevKitSkillItem }> = ({ skillItem }) => {
  const moduleCount = skillItem.sections.length;
  const insetPercent = moduleCount > 0 ? 50 / moduleCount : 0;

  return (
    <div className="rounded-card border border-line/70 bg-surface-subtle p-5 md:p-6">
      <div className="flex justify-center">
        <div className="rounded-modal border border-line bg-content px-5 py-3 text-center shadow-sm">
          <div className="inline-flex rounded-full border border-surface/15 bg-surface/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-surface shadow-sm">
            Skill
          </div>
          <div className="mt-1 text-sm font-bold text-surface">
            {skillItem.title}
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="flex justify-center">
          <div className="h-6 w-px bg-line" />
        </div>
        <div
          className="relative grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${moduleCount}, minmax(0, 1fr))`,
          }}
        >
          <div
            className="absolute top-0 h-px bg-line"
            style={{
              left: `${insetPercent}%`,
              right: `${insetPercent}%`,
            }}
          />
          {skillItem.sections.map((groupSection, index) => (
            <div
              key={`${skillItem.title}-diagram-${groupSection.title}`}
              className="relative flex flex-col items-center pt-6"
            >
              <div className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-line" />
              <div className="flex h-full w-full flex-col items-center justify-start rounded-card border border-line/70 bg-surface px-3 py-3 text-center shadow-sm">
                <div className="inline-flex h-6 min-w-[28px] items-center justify-center rounded-full bg-accent-600 px-1.5 text-[11px] font-bold text-surface">
                  {formatIndex(index)}
                </div>
                <div className="mt-1.5 text-sm font-bold text-content">
                  {groupSection.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 md:hidden">
        <div className="h-4 w-px bg-line" />
        {skillItem.sections.map((groupSection, index) => (
          <React.Fragment key={`${skillItem.title}-mobile-${groupSection.title}`}>
            <div className="inline-flex items-center gap-2 rounded-card border border-line/70 bg-surface px-3 py-2 shadow-sm">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent-600 text-[10px] font-bold text-surface">
                {index + 1}
              </span>
              <span className="text-sm font-bold text-content">
                {groupSection.title}
              </span>
            </div>
            {index < skillItem.sections.length - 1 && (
              <div className="h-3 w-px bg-line" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SkillModuleDiagram;
