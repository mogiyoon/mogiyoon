import React, { useState } from 'react';
import FlowDiagram from './FlowDiagram';
import { ChevronIcon, DetailIcon, GroupIcon } from './icons';
import type {
  AiDevKitCodeSample,
  AiDevKitDetailGroup,
  AiDevKitDetailItem,
  AiDevKitDetailSection,
} from './types';

interface DetailItemsProps {
  section: AiDevKitDetailSection;
}

const DetailItemHeading: React.FC<{ item: AiDevKitDetailItem }> = ({ item }) => (
  <div className="min-w-0">
    <h5 className="text-sm font-bold text-content-strong">{item.title}</h5>
    {item.description && (
      <p className="mt-2 text-sm leading-relaxed text-content-secondary">
        {item.description}
      </p>
    )}
  </div>
);

const Chips: React.FC<{ item: AiDevKitDetailItem }> = ({ item }) => {
  if (!item.chips?.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {item.chips.map((chip) => (
        <span
          key={`${item.title}-${chip}`}
          className="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-semibold text-content-secondary"
        >
          {chip}
        </span>
      ))}
    </div>
  );
};

const StepBadges: React.FC<{ item: AiDevKitDetailItem }> = ({ item }) => {
  if (!item.steps?.length) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {item.steps.map((step, index) => (
        <span
          key={`${item.title}-${step}`}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-content px-3 py-1.5 text-xs font-semibold text-surface shadow-sm"
        >
          <span className="text-surface/70">{index + 1}.</span>
          {step}
        </span>
      ))}
    </div>
  );
};

const DetailGroupGrid: React.FC<{
  itemTitle: string;
  groups?: AiDevKitDetailGroup[];
}> = ({ itemTitle, groups }) => {
  if (!groups?.length) return null;

  return (
    <div className="mt-5 border-t border-line pt-4">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {groups.map((group, groupIndex) => (
          <div
            key={`${itemTitle}-${group.title}`}
            className="min-w-0 rounded-card border border-line/70 bg-surface-subtle/70 p-3"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                <GroupIcon index={groupIndex} />
              </span>
              <h6 className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-700">
                {group.title}
              </h6>
            </div>
            <div className="mt-2 space-y-1.5">
              {group.points.map((point) => (
                <p
                  key={`${group.title}-${point}`}
                  className="flex gap-2 text-xs leading-relaxed text-content-secondary"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                  <span>{point}</span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CodeSamples: React.FC<{ itemTitle: string; samples?: AiDevKitCodeSample[] }> = ({
  itemTitle,
  samples,
}) => {
  if (!samples?.length) return null;

  return (
    <div className="mt-5 space-y-3 border-t border-line pt-4">
      {samples.map((sample) => (
        <div key={`${itemTitle}-${sample.title}`}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h6 className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-700">
                {sample.title}
              </h6>
              {sample.description && (
                <p className="mt-1 text-xs leading-relaxed text-content-secondary">
                  {sample.description}
                </p>
              )}
            </div>
            {sample.language && (
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-content-muted">
                {sample.language}
              </span>
            )}
          </div>
          <pre className="mt-3 overflow-x-auto rounded-card border border-line/70 bg-content p-4 text-[11px] leading-relaxed text-surface shadow-sm">
            <code>{sample.code}</code>
          </pre>
        </div>
      ))}
    </div>
  );
};

const DiagramItems: React.FC<DetailItemsProps> = ({ section }) => (
  <div className="rounded-card border border-line/70 bg-surface-subtle p-4 shadow-sm sm:p-5">
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {section.items?.map((detailItem, index) => (
        <article
          key={`${section.title}-${detailItem.title}`}
          className="rounded-card border border-line/70 bg-surface p-4 shadow-sm"
        >
          <div className="mb-3 inline-flex h-6 min-w-[28px] items-center justify-center rounded-full bg-accent-600 px-1.5 text-[11px] font-bold text-surface">
            {String(index + 1).padStart(2, '0')}
          </div>
          <DetailItemHeading item={detailItem} />
        </article>
      ))}
    </div>
  </div>
);

const FlowItemCard: React.FC<{
  sectionTitle: string;
  detailItem: AiDevKitDetailItem;
}> = ({ sectionTitle, detailItem }) => {
  const [expanded, setExpanded] = useState(false);
  const contentId = `flow-content-${sectionTitle}-${detailItem.title}`.replace(/\s+/g, '-');

  return (
    <article className="rounded-card border border-line/70 bg-surface shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls={contentId}
        className="flex w-full items-start justify-between gap-4 rounded-card p-5 text-left transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        <div className="min-w-0">
          <div className="inline-flex items-center rounded-full border border-line bg-content px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-surface shadow-sm">
            Harness Run
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
        <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-700">
          <ChevronIcon expanded={expanded} />
        </span>
      </button>

      {expanded && (
        <div id={contentId} className="border-t border-line/70 px-5 pb-5 pt-4">
          <FlowDiagram
            idBase={`${sectionTitle}-${detailItem.title}`}
            steps={detailItem.steps ?? []}
            loops={detailItem.loops ?? []}
            stepDetails={detailItem.stepDetails ?? []}
          />

          <DetailGroupGrid itemTitle={detailItem.title} groups={detailItem.groups} />
          <CodeSamples itemTitle={detailItem.title} samples={detailItem.samples} />
        </div>
      )}
    </article>
  );
};

const FlowItems: React.FC<DetailItemsProps> = ({ section }) => (
  <div className="space-y-4">
    {section.items?.map((detailItem) => (
      <FlowItemCard
        key={`${section.title}-${detailItem.title}`}
        sectionTitle={section.title}
        detailItem={detailItem}
      />
    ))}
  </div>
);

const CardItems: React.FC<DetailItemsProps> = ({ section }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    {section.items?.map((detailItem) => (
      <article
        key={`${section.title}-${detailItem.title}`}
        className={`rounded-card border border-line/70 bg-surface p-4 shadow-sm ${
          detailItem.groups?.length ? 'md:col-span-2' : ''
        } ${
          detailItem.iconKey &&
          !detailItem.description &&
          !detailItem.chips?.length &&
          !detailItem.steps?.length
            ? 'flex items-center gap-4'
            : ''
        }`}
      >
        {detailItem.iconKey && (
          <div className="shrink-0">
            <DetailIcon iconKey={detailItem.iconKey} />
          </div>
        )}

        <DetailItemHeading item={detailItem} />
        <Chips item={detailItem} />

        {detailItem.groups?.length && (
          <div className="mt-4 space-y-3">
            {detailItem.groups.map((group) => (
              <div
                key={`${detailItem.title}-${group.title}`}
                className="rounded-card border border-line/70 bg-surface-subtle p-4"
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

        <StepBadges item={detailItem} />
      </article>
    ))}
  </div>
);

const DetailItems: React.FC<DetailItemsProps> = ({ section }) => {
  if (!section.items?.length) return null;

  if (section.layout === 'diagram') {
    return <DiagramItems section={section} />;
  }

  if (section.layout === 'flow') {
    return <FlowItems section={section} />;
  }

  return <CardItems section={section} />;
};

export default DetailItems;
