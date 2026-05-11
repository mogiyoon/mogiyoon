import React from 'react';
import { formatIndex } from '../../../utils/formatIndex';
import type { AiDevKitGroupedDetailSection } from '../types';
import { SectionIcon } from './icons';
import SkillFlowSteps from './SkillFlowSteps';
import SkillDetailGrid from './SkillDetailGrid';

const SkillSectionCard: React.FC<{
  section: AiDevKitGroupedDetailSection;
  index: number;
}> = ({ section, index }) => (
  <section className="relative h-full overflow-hidden rounded-card border border-line/70 bg-surface-subtle shadow-sm">
    <div className="absolute inset-y-0 left-0 w-1 bg-accent-500" />
    <div className="border-b border-line/70 bg-surface px-4 py-3 pl-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-accent-50 text-accent-700">
          <SectionIcon index={index} />
        </span>
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-700">
            {formatIndex(index)}
          </div>
          <h6 className="mt-0.5 text-sm font-bold text-content">
            {section.title}
          </h6>
        </div>
      </div>
      {section.description && (
        <p className="mt-2 text-xs leading-relaxed text-content-secondary">
          {section.description}
        </p>
      )}
    </div>

    <div className="p-4 pl-5">
      {section.layout === 'flow' ? (
        <SkillFlowSteps section={section} />
      ) : (
        <SkillDetailGrid section={section} items={section.items} />
      )}
    </div>
  </section>
);

export default SkillSectionCard;
