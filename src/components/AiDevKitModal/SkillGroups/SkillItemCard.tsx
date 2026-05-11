import React from 'react';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { ChevronIcon } from '../icons';
import type { AiDevKitSkillItem } from '../types';
import SkillModuleDiagram from './SkillModuleDiagram';
import SkillSectionCard from './SkillSectionCard';

const SkillItemCard: React.FC<{ skillItem: AiDevKitSkillItem }> = ({ skillItem }) => {
  const { isOpen: expanded, toggle } = useDisclosure(false);
  const contentId = `skill-content-${skillItem.title.replace(/\s+/g, '-')}`;

  return (
    <article className="rounded-card border border-line/70 bg-surface shadow-sm">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={expanded}
        aria-controls={contentId}
        className="flex w-full items-start justify-between gap-4 rounded-card p-5 text-left transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        <div className="max-w-3xl">
          <h5 className="text-lg font-bold text-content-strong">
            {skillItem.title}
          </h5>
          {skillItem.description && (
            <p className="mt-2 text-sm leading-relaxed text-content-secondary">
              {skillItem.description}
            </p>
          )}
        </div>
        <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-700">
          <ChevronIcon expanded={expanded} />
        </span>
      </button>

      {expanded && (
        <div id={contentId} className="flex flex-col gap-4 border-t border-line/70 px-5 pb-5 pt-4">
          <SkillModuleDiagram skillItem={skillItem} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {skillItem.sections.map((groupSection, index) => (
              <SkillSectionCard
                key={`${skillItem.title}-${groupSection.title}`}
                section={groupSection}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default SkillItemCard;
