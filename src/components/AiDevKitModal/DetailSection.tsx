import React from 'react';
import DetailItems from './DetailItems';
import SkillGroups from './SkillGroups';
import type { AiDevKitDetailSection } from './types';

interface DetailSectionProps {
  section: AiDevKitDetailSection;
}

const SectionStepPills: React.FC<{ section: AiDevKitDetailSection }> = ({
  section,
}) => {
  if (!section.steps?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {section.steps.map((step, index) => (
        <div
          key={`${section.title}-${step}`}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-subtle px-3 py-2 text-xs font-semibold text-content-secondary"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-600 text-[11px] text-surface">
            {index + 1}
          </span>
          {step}
        </div>
      ))}
    </div>
  );
};

const DetailSection: React.FC<DetailSectionProps> = ({ section }) => (
  <section className="rounded-card border border-line/70 bg-surface p-5 shadow-sm">
    <div className="mb-4">
      <h4 className="text-lg font-bold text-content">{section.title}</h4>
      {section.description && (
        <p className="mt-2 text-sm leading-relaxed text-content-secondary">
          {section.description}
        </p>
      )}
    </div>

    <SectionStepPills section={section} />
    <DetailItems section={section} />
    <SkillGroups section={section} />
  </section>
);

export default DetailSection;
