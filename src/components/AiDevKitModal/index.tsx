import React, { useEffect } from 'react';

export interface AiDevKitFlowLoop {
  fromStep: number;
  toStep: number;
  label?: string;
  topStartStep?: number;
  topEndStep?: number;
  bottomStep?: number;
  bottomLabel?: string;
}

export interface AiDevKitGroupedDetailSection {
  title: string;
  description?: string;
  items?: AiDevKitDetailItem[];
  steps?: string[];
  layout?: 'cards' | 'flow';
}

export interface AiDevKitSkillItem {
  title: string;
  description?: string;
  chips?: string[];
  sections: AiDevKitGroupedDetailSection[];
}

export interface AiDevKitDetailItem {
  title: string;
  description?: string;
  chips?: string[];
  steps?: string[];
  loops?: AiDevKitFlowLoop[];
  iconKey?: string;
  groups?: {
    title: string;
    points: string[];
  }[];
}

export interface AiDevKitDetailSection {
  title: string;
  description?: string;
  items?: AiDevKitDetailItem[];
  skillItems?: AiDevKitSkillItem[];
  steps?: string[];
  layout?: 'cards' | 'diagram' | 'flow' | 'skill-groups';
}

export interface AiDevKitModalData {
  icon: React.ReactNode;
  title: string;
  eyebrow: string;
  summary: string;
  closeLabel: string;
  sections: AiDevKitDetailSection[];
}

interface AiDevKitModalProps {
  item: AiDevKitModalData | null;
  onClose: () => void;
}

const AiDevKitModal: React.FC<AiDevKitModalProps> = ({ item, onClose }) => {
  const renderDetailIcon = (iconKey?: string) => {
    if (!iconKey) return null;

    if (iconKey === 'unity') {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-base font-black text-white shadow-sm">
          U
        </div>
      );
    }

    if (iconKey === 'blender') {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-base font-black text-white shadow-sm">
          B
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    if (!item) return;

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl overflow-hidden rounded-card bg-surface shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-fade-in-up"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line bg-surface p-6">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-700">
                {item.eyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-content sm:text-3xl">
                {item.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line bg-surface p-2 text-content-muted transition-colors duration-200 hover:text-content"
            aria-label={item.closeLabel}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <div className="space-y-6">
            {item.sections.map((section) => (
              <section key={section.title} className="rounded-card bg-surface p-5 shadow-lg">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-content">{section.title}</h4>
                  {section.description && (
                    <p className="mt-2 text-sm leading-relaxed text-content-secondary">
                      {section.description}
                    </p>
                  )}
                </div>

                {section.steps && section.steps.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {section.steps.map((step, index) => (
                      <div
                        key={`${section.title}-${step}`}
                        className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-2 text-xs font-semibold text-accent-700"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-600 text-[11px] text-white">
                          {index + 1}
                        </span>
                        {step}
                      </div>
                    ))}
                  </div>
                )}

                {section.items && section.items.length > 0 && (
                  section.layout === 'diagram' ? (
                    <div className="rounded-card bg-surface-subtle p-4 sm:p-5 shadow-sm">
                      <div className="flex justify-center">
                        <div className="w-full max-w-sm rounded-card bg-surface px-5 py-4 text-center shadow-lg">
                          <div className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                            Core
                          </div>
                          <h5 className="mt-3 text-base font-bold text-content-strong">
                            {section.title}
                          </h5>
                          {section.description && (
                            <p className="mt-2 text-sm leading-relaxed text-content-secondary">
                              {section.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <div className="h-8 w-px bg-line" />
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {section.items.map((detailItem) => (
                          <article
                            key={`${section.title}-${detailItem.title}`}
                            className="relative rounded-card bg-surface p-4 shadow-lg"
                          >
                            <div className="absolute left-1/2 top-0 hidden h-5 w-px -translate-x-1/2 -translate-y-full bg-line sm:block" />
                            <div className="absolute left-1/2 top-0 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-[18px] rounded-full bg-accent-500 sm:block" />
                            <h5 className="text-sm font-bold text-content-strong">{detailItem.title}</h5>
                            {detailItem.description && (
                              <p className="mt-2 text-sm leading-relaxed text-content-secondary">
                                {detailItem.description}
                              </p>
                            )}
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : section.layout === 'flow' ? (
                    <div className="space-y-4">
                      {section.items.map((detailItem) => {
                        const loopStepIndexes = new Set(
                          (detailItem.loops ?? []).flatMap((loop) => {
                            const indexes = [loop.fromStep - 1, loop.toStep - 1];

                            if (loop.topStartStep) indexes.push(loop.topStartStep - 1);
                            if (loop.topEndStep) indexes.push(loop.topEndStep - 1);
                            if (loop.bottomStep) indexes.push(loop.bottomStep - 1);

                            return indexes;
                          })
                        );

                        return (
                          <article
                            key={`${section.title}-${detailItem.title}`}
                            className="rounded-card bg-surface p-5 shadow-lg"
                          >
                            <div className="flex flex-col gap-5">
                              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                                <div className="max-w-2xl">
                                  <div className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                                    Flow
                                  </div>
                                  <h5 className="mt-4 text-base font-bold text-content-strong">
                                    {detailItem.title}
                                  </h5>
                                  {detailItem.description && (
                                    <p className="mt-2 text-sm leading-relaxed text-content-secondary">
                                      {detailItem.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {detailItem.steps && detailItem.steps.length > 0 && (
                                <div className="overflow-x-auto pb-1">
                                  <div className="flex min-w-max flex-col gap-3 md:flex-row md:items-center">
                                    {detailItem.steps.map((step, index) => (
                                      <React.Fragment key={`${detailItem.title}-${step}`}>
                                        <div
                                          className={`flex min-w-[136px] flex-col items-center rounded-card px-4 py-3 text-center shadow-sm ${
                                            loopStepIndexes.has(index)
                                              ? 'border border-accent-300 bg-accent-50'
                                              : 'bg-surface'
                                          }`}
                                        >
                                          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-700">
                                            Step {index + 1}
                                          </span>
                                          <span className="mt-1 text-sm font-bold text-content">
                                            {step}
                                          </span>
                                        </div>

                                        {index < detailItem.steps!.length - 1 && (
                                          <>
                                            <div className="flex items-center justify-center md:hidden">
                                              <div className="h-8 w-px bg-line" />
                                            </div>
                                            <div className="hidden items-center justify-center md:flex">
                                              <div className="h-px w-8 bg-line" />
                                              <svg
                                                className="mx-1 h-4 w-4 text-accent-500"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M3 8H13M13 8L9 4M13 8L9 12"
                                                  stroke="currentColor"
                                                  strokeWidth="1.5"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                              <div className="h-px w-8 bg-line" />
                                            </div>
                                          </>
                                        )}
                                      </React.Fragment>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {detailItem.loops && detailItem.loops.length > 0 && detailItem.steps && (
                                <div className="rounded-card border border-dashed border-accent-300 bg-accent-50/70 p-4">
                                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-700 shadow-sm">
                                    <svg
                                      className="h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M6 7V3L2 7L6 11V7H11C13.7614 7 16 9.23858 16 12C16 14.7614 13.7614 17 11 17H6"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    Feedback Loop
                                  </div>

                                  <div className="space-y-4">
                                    {detailItem.loops.map((loop) => {
                                      const topStartLabel = detailItem.steps![(
                                        (loop.topStartStep ?? loop.toStep) - 1
                                      )];
                                      const topEndLabel = detailItem.steps![(
                                        (loop.topEndStep ?? loop.fromStep) - 1
                                      )];
                                      const bottomLabel = loop.bottomLabel ?? detailItem.steps![(
                                        (loop.bottomStep ?? loop.fromStep) - 1
                                      )];

                                      return (
                                        <div
                                          key={`${detailItem.title}-${loop.fromStep}-${loop.toStep}`}
                                          className="rounded-card bg-white p-4 shadow-lg"
                                        >
                                          <div className="flex items-center justify-center gap-3">
                                            <div className="min-w-[132px] rounded-card bg-accent-50 px-3 py-2 text-center shadow-sm">
                                              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-700">
                                                Return
                                              </div>
                                              <div className="mt-1 text-sm font-bold leading-snug text-accent-800">
                                                {topStartLabel}
                                              </div>
                                            </div>

                                            <div className="flex items-center text-accent-500">
                                              <div className="h-px w-6 bg-current" />
                                              <svg
                                                className="h-4 w-4"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M3 8H13M13 8L9 4M13 8L9 12"
                                                  stroke="currentColor"
                                                  strokeWidth="1.6"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                            </div>

                                            <div className="min-w-[132px] rounded-card bg-slate-900 px-3 py-2 text-center shadow-sm">
                                              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                                                Check
                                              </div>
                                              <div className="mt-1 text-sm font-bold leading-snug text-white">
                                                {topEndLabel}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="mt-3 flex items-start justify-center gap-24 sm:gap-32">
                                            <svg
                                              className="h-6 w-6 text-accent-500"
                                              viewBox="0 0 16 16"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M8 13V3M8 3L4.5 6.5M8 3L11.5 6.5"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                            <svg
                                              className="h-6 w-6 text-accent-500"
                                              viewBox="0 0 16 16"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M8 3V13M8 13L4.5 9.5M8 13L11.5 9.5"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          </div>

                                          <div className="mt-2 flex justify-center">
                                            <div className="min-w-[168px] max-w-[240px] rounded-card bg-white px-4 py-3 text-center shadow-sm">
                                              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-700">
                                                Loop
                                              </div>
                                              <div className="mt-1 text-sm font-bold leading-snug text-content">
                                                {bottomLabel}
                                              </div>
                                            </div>
                                          </div>

                                          {loop.label && (
                                            <p className="mt-3 text-xs font-medium leading-relaxed text-content-secondary">
                                              {loop.label}
                                            </p>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {section.items.map((detailItem) => (
                        <article
                          key={`${section.title}-${detailItem.title}`}
                          className={`rounded-card bg-surface p-4 shadow-lg ${
                            detailItem.groups?.length ? 'md:col-span-2' : ''
                          } ${
                            detailItem.iconKey && !detailItem.description && !detailItem.chips?.length && !detailItem.steps?.length
                              ? 'flex items-center gap-4'
                              : ''
                          }`}
                        >
                          {detailItem.iconKey && (
                            <div className="shrink-0">
                              {renderDetailIcon(detailItem.iconKey)}
                            </div>
                          )}

                          <div className="min-w-0">
                            <h5 className="text-sm font-bold text-content-strong">{detailItem.title}</h5>
                            {detailItem.description && (
                              <p className="mt-2 text-sm leading-relaxed text-content-secondary">
                                {detailItem.description}
                              </p>
                            )}
                          </div>

                          {detailItem.chips && detailItem.chips.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {detailItem.chips.map((chip) => (
                                <span
                                  key={`${detailItem.title}-${chip}`}
                                  className="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-semibold text-content-secondary"
                                >
                                  {chip}
                                </span>
                              ))}
                            </div>
                          )}

                          {detailItem.groups && detailItem.groups.length > 0 && (
                            <div className="mt-4 space-y-3">
                              {detailItem.groups.map((group) => (
                                <div
                                  key={`${detailItem.title}-${group.title}`}
                                  className="rounded-card bg-surface-subtle p-4 shadow-sm"
                                >
                                  <h6 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-700">
                                    {group.title}
                                  </h6>
                                  <div className="mt-3 space-y-2">
                                    {group.points.map((point) => (
                                      <p
                                        key={`${group.title}-${point}`}
                                        className="text-sm leading-relaxed text-content-secondary"
                                      >
                                        {point}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {detailItem.steps && detailItem.steps.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {detailItem.steps.map((step, index) => (
                                <span
                                  key={`${detailItem.title}-${step}`}
                                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                                >
                                  <span className="text-slate-300">{index + 1}.</span>
                                  {step}
                                </span>
                              ))}
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  )
                )}

                {section.skillItems && section.skillItems.length > 0 && section.layout === 'skill-groups' && (
                  <div className="space-y-5">
                    {section.skillItems.map((skillItem) => (
                      <article
                        key={`${section.title}-${skillItem.title}`}
                        className="rounded-card bg-surface p-5 shadow-lg"
                      >
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="max-w-3xl">
                                <h5 className="text-lg font-bold text-content-strong">{skillItem.title}</h5>
                                {skillItem.description && (
                                <p className="mt-2 text-sm leading-relaxed text-content-secondary">
                                    {skillItem.description}
                                  </p>
                                )}
                              </div>
                            </div>

                          <div className="rounded-card bg-surface-subtle p-4 shadow-sm">
                            <div className="flex justify-center">
                              <div className="w-full max-w-xs rounded-card bg-accent-50 px-4 py-3 text-center shadow-sm">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-700">
                                  Skill
                                </div>
                                <div className="mt-1 text-sm font-bold text-accent-800">
                                  {skillItem.title}
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-center">
                              <div className="h-6 w-px bg-line" />
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                              {skillItem.sections.map((groupSection) => (
                                <div
                                  key={`${skillItem.title}-diagram-${groupSection.title}`}
                                  className="relative rounded-card bg-surface p-3 text-center shadow-sm"
                                >
                                  <div className="absolute left-1/2 top-0 hidden h-4 w-px -translate-x-1/2 -translate-y-full bg-line md:block" />
                                  <div className="absolute left-1/2 top-0 hidden h-2 w-2 -translate-x-1/2 -translate-y-[18px] rounded-full bg-accent-500 md:block" />
                                  <div className="text-sm font-semibold text-content-strong">
                                    {groupSection.title}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                            {skillItem.sections.map((groupSection) => (
                              <section
                                key={`${skillItem.title}-${groupSection.title}`}
                                className="h-full rounded-card bg-surface p-4 shadow-lg"
                              >
                                <div className="mb-3">
                                  <h6 className="text-sm font-bold text-content">{groupSection.title}</h6>
                                  {groupSection.description && (
                                    <p className="mt-1 text-xs leading-relaxed text-content-secondary">
                                      {groupSection.description}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-3">
                                  {groupSection.layout === 'flow' && groupSection.steps && groupSection.steps.length > 0 ? (
                                    <div className="overflow-x-auto pb-1">
                                      <div className="flex min-w-max flex-col gap-3 md:flex-row md:items-center">
                                        {groupSection.steps.map((step, index) => (
                                          <React.Fragment key={`${groupSection.title}-${step}`}>
                                            <div className="flex min-w-[132px] flex-col items-center rounded-[20px] border border-line/70 bg-surface-subtle px-4 py-3 text-center shadow-sm">
                                              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-700">
                                                Step {index + 1}
                                              </span>
                                              <span className="mt-1 text-sm font-bold text-content">
                                                {step}
                                              </span>
                                            </div>

                                            {index < groupSection.steps!.length - 1 && (
                                              <>
                                                <div className="flex items-center justify-center md:hidden">
                                                  <div className="h-8 w-px bg-line" />
                                                </div>
                                                <div className="hidden items-center justify-center md:flex">
                                                  <div className="h-px w-7 bg-line" />
                                                  <svg
                                                    className="mx-1 h-4 w-4 text-accent-500"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                  >
                                                    <path
                                                      d="M3 8H13M13 8L9 4M13 8L9 12"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                  </svg>
                                                  <div className="h-px w-7 bg-line" />
                                                </div>
                                              </>
                                            )}
                                          </React.Fragment>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    groupSection.items && groupSection.items.length > 0 && (
                                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {groupSection.items.map((detailItem) => (
                                          <div
                                            key={`${groupSection.title}-${detailItem.title}`}
                                            className="rounded-card bg-surface-subtle p-3 shadow-sm"
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
                                    )
                                  )}
                                </div>
                              </section>
                            ))}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiDevKitModal;
