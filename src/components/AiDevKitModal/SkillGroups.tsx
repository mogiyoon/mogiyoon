import React from 'react';
import { InlineArrowIcon } from './icons';
import type {
  AiDevKitDetailItem,
  AiDevKitDetailSection,
  AiDevKitGroupedDetailSection,
  AiDevKitSkillItem,
} from './types';

interface SkillGroupsProps {
  section: AiDevKitDetailSection;
}

const SkillFlowSteps: React.FC<{ section: AiDevKitGroupedDetailSection }> = ({
  section,
}) => {
  const steps = section.steps ?? [];

  if (!steps.length) return null;

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max flex-col gap-3 md:flex-row md:items-center">
        {steps.map((step, index) => (
          <React.Fragment key={`${section.title}-${step}`}>
            <div className="flex min-w-[132px] flex-col items-center rounded-[20px] border border-line/70 bg-surface-subtle px-4 py-3 text-center">
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

const SkillDetailGrid: React.FC<{
  section: AiDevKitGroupedDetailSection;
  items?: AiDevKitDetailItem[];
}> = ({ section, items }) => {
  if (!items?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((detailItem) => (
        <div
          key={`${section.title}-${detailItem.title}`}
          className="rounded-card bg-surface-subtle p-3"
        >
          <h6 className="text-sm font-semibold text-content-strong">
            {detailItem.title}
          </h6>
          {detailItem.description && (
            <p className="mt-1.5 text-sm leading-relaxed text-content-secondary">
              {detailItem.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

const SkillModuleDiagram: React.FC<{ skillItem: AiDevKitSkillItem }> = ({
  skillItem,
}) => {
  const moduleCount = skillItem.sections.length;
  const insetPercent = moduleCount > 0 ? 50 / moduleCount : 0;

  return (
    <div className="rounded-card bg-surface-subtle p-5 md:p-6">
      <div className="flex justify-center">
        <div className="rounded-2xl bg-slate-900 px-5 py-3 text-center shadow-sm">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-300">
            Skill
          </div>
          <div className="mt-1 text-sm font-bold text-white">
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
              <div className="flex h-full w-full flex-col items-center justify-start rounded-2xl bg-surface px-3 py-3 text-center shadow-sm">
                <div className="inline-flex h-6 min-w-[28px] items-center justify-center rounded-full bg-accent-600 px-1.5 text-[11px] font-bold text-white">
                  {String(index + 1).padStart(2, '0')}
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
            <div className="inline-flex items-center gap-2 rounded-2xl bg-surface px-3 py-2 shadow-sm">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent-600 text-[10px] font-bold text-white">
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

const SkillSectionCard: React.FC<{
  section: AiDevKitGroupedDetailSection;
  index: number;
}> = ({ section, index }) => (
  <section className="h-full rounded-card bg-surface p-4">
    <div className="mb-3 flex items-start gap-2">
      <span className="inline-flex h-6 min-w-[28px] shrink-0 items-center justify-center rounded-full bg-accent-600 px-1.5 text-[11px] font-bold text-white">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <h6 className="text-sm font-bold text-content">{section.title}</h6>
        {section.description && (
          <p className="mt-1 text-xs leading-relaxed text-content-secondary">
            {section.description}
          </p>
        )}
      </div>
    </div>

    <div className="space-y-3">
      {section.layout === 'flow' ? (
        <SkillFlowSteps section={section} />
      ) : (
        <SkillDetailGrid section={section} items={section.items} />
      )}
    </div>
  </section>
);

const SkillItemCard: React.FC<{ skillItem: AiDevKitSkillItem }> = ({
  skillItem,
}) => (
  <article className="rounded-card bg-surface p-5 shadow-lg">
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
      </div>

      <SkillModuleDiagram skillItem={skillItem} />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {skillItem.sections.map((groupSection, index) => (
          <SkillSectionCard
            key={`${skillItem.title}-${groupSection.title}`}
            section={groupSection}
            index={index}
          />
        ))}
      </div>
    </div>
  </article>
);

const SkillGroups: React.FC<SkillGroupsProps> = ({ section }) => {
  if (section.layout !== 'skill-groups' || !section.skillItems?.length) {
    return null;
  }

  return (
    <div className="space-y-5">
      {section.skillItems.map((skillItem) => (
        <SkillItemCard key={`${section.title}-${skillItem.title}`} skillItem={skillItem} />
      ))}
    </div>
  );
};

export default SkillGroups;
