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

const SectionIcon: React.FC<{ index: number }> = ({ index }) => {
  const iconClass = 'h-5 w-5';
  const variant = index % 5;

  if (variant === 0) {
    return (
      <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="15" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6.8 6.2L9 13M13.2 6.2L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === 1) {
    return (
      <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M11.5 2.5L4.5 11H9L8 17.5L15.5 8.5H11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }

  if (variant === 2) {
    return (
      <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4 10H8.5M8.5 10C8.5 6.5 11 5 15.5 5M8.5 10C8.5 13.5 11 15 15.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13.5 3L15.5 5L13.5 7M13.5 13L15.5 15L13.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (variant === 3) {
    return (
      <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2.75L15.5 5V9.5C15.5 13 13.25 15.5 10 17.25C6.75 15.5 4.5 13 4.5 9.5V5L10 2.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M7.5 10L9.25 11.75L12.75 8.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 3.5H12L15 6.5V16.5H5V3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 3.5V6.5H15M7.5 10H12.5M7.5 13H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const ItemIcon: React.FC<{ title: string; index: number }> = ({
  title,
  index,
}) => {
  const iconClass = 'h-4 w-4';
  const normalizedTitle = title.toLowerCase();

  if (
    normalizedTitle.includes('decomposition') ||
    normalizedTitle.includes('role') ||
    normalizedTitle.includes('hierarchy') ||
    normalizedTitle.includes('분해') ||
    normalizedTitle.includes('역할') ||
    normalizedTitle.includes('계층')
  ) {
    return (
      <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="4" cy="4" r="1.75" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="4" r="1.75" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="12" r="1.75" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.5 5.5L7.25 10M10.5 5.5L8.75 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (
    normalizedTitle.includes('merge') ||
    normalizedTitle.includes('convergence') ||
    normalizedTitle.includes('handoff') ||
    normalizedTitle.includes('병합') ||
    normalizedTitle.includes('수렴')
  ) {
    return (
      <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 4.5H7M3 11.5H7M7 4.5C8.5 4.5 8.5 8 10 8H13M7 11.5C8.5 11.5 8.5 8 10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (
    normalizedTitle.includes('loop') ||
    normalizedTitle.includes('retry') ||
    normalizedTitle.includes('termination') ||
    normalizedTitle.includes('feedback') ||
    normalizedTitle.includes('루프') ||
    normalizedTitle.includes('재시도') ||
    normalizedTitle.includes('종료')
  ) {
    return (
      <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M11.5 6.5H14V4M13.75 6.25C13 4.25 11.15 3 9 3C6.25 3 4 5.25 4 8M4.5 9.5H2V12M2.25 9.75C3 11.75 4.85 13 7 13C9.75 13 12 10.75 12 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (
    normalizedTitle.includes('routing') ||
    normalizedTitle.includes('conditional') ||
    normalizedTitle.includes('branch') ||
    normalizedTitle.includes('라우팅') ||
    normalizedTitle.includes('분기')
  ) {
    return (
      <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 8H7.5M7.5 8C7.5 5.25 9.5 4 13 4M7.5 8C7.5 10.75 9.5 12 13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 2.5L13 4L11 5.5M11 10.5L13 12L11 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (
    normalizedTitle.includes('diagram') ||
    normalizedTitle.includes('document') ||
    normalizedTitle.includes('output') ||
    normalizedTitle.includes('overview') ||
    normalizedTitle.includes('개요') ||
    normalizedTitle.includes('그림') ||
    normalizedTitle.includes('문서') ||
    normalizedTitle.includes('산출')
  ) {
    return (
      <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M4 3.5H10.5L12.5 5.5V12.5H4V3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10.5 3.5V5.5H12.5M6 8H10.5M6 10.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (
    normalizedTitle.includes('trigger') ||
    normalizedTitle.includes('collaborative') ||
    normalizedTitle.includes('pipeline') ||
    normalizedTitle.includes('작업') ||
    normalizedTitle.includes('트리거')
  ) {
    return (
      <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8.75 2.5L4 8.25H7.25L6.5 13.5L12 6.75H8.75V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }

  if (index % 2 === 0) {
    return (
      <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 8H13M10 5L13 8L10 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4H12V12H4V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6.25 8.25L7.5 9.5L10 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const SkillDetailGrid: React.FC<{
  section: AiDevKitGroupedDetailSection;
  items?: AiDevKitDetailItem[];
}> = ({ section, items }) => {
  if (!items?.length) return null;

  return (
    <div className="space-y-2">
      {items.map((detailItem, itemIndex) => (
        <div
          key={`${section.title}-${detailItem.title}`}
          className="rounded-card border border-line/70 bg-surface px-3 py-3 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-card bg-accent-50 text-accent-700">
              <ItemIcon title={detailItem.title} index={itemIndex} />
            </span>
            <div className="min-w-0">
              <h6 className="text-sm font-bold text-content-strong">
                {detailItem.title}
              </h6>
              {detailItem.description && (
                <p className="mt-1 text-sm leading-relaxed text-content-secondary">
                  {detailItem.description}
                </p>
              )}
            </div>
          </div>
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
            {String(index + 1).padStart(2, '0')}
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

const SkillItemCard: React.FC<{ skillItem: AiDevKitSkillItem }> = ({
  skillItem,
}) => (
  <article className="rounded-card border border-line/70 bg-surface p-5 shadow-sm">
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
