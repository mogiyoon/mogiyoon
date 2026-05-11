import React from 'react';
import type { AiDevKitDetailItem, AiDevKitGroupedDetailSection } from '../types';
import { ItemIcon } from './icons';

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

export default SkillDetailGrid;
