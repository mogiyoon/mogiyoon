import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatIndex } from '../../../../utils/formatIndex';
import { collapseVerticalPreset } from '../../../../utils/motionPresets';
import RotatingChevron from '../../../../components/primitives/RotatingChevron';
import { itemVariants } from '../animations';
import type { AiHighlightItem } from '../types';
import { TimelineFinalStep, TimelineInitialStep, TimelineSolidStep } from '../../../../components/primitives/TimelineStep';

/**
 * AI 활용 하이라이트 카드 — Context / Approach / Verification / Impact 4단계 타임라인.
 * 두 단계 토글: 본문 펼침 → details (4-step timeline) 펼침.
 */
const AiHighlightCard: React.FC<{
  aiHighlight: AiHighlightItem;
  index: number;
  isOpen: boolean;
  isDetailOpen: boolean;
  onToggle: () => void;
  onDetailToggle: () => void;
  labels: {
    context: string;
    approach: string;
    verification: string;
    impact: string;
    showDetails: string;
    hideDetails: string;
  };
}> = ({ aiHighlight, index, isOpen, isDetailOpen, onToggle, onDetailToggle, labels }) => (
  <motion.div
    variants={itemVariants}
    className="rounded-modal border border-line bg-surface overflow-hidden"
  >
    {/* Title row */}
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-subtle transition-colors duration-150"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {formatIndex(index, 'AI·')}
        </span>
        <p className="text-sm font-semibold text-content truncate">{aiHighlight.title}</p>
      </div>
      <div className="shrink-0 ml-3 text-content-muted">
        <RotatingChevron isRotated={isOpen} />
      </div>
    </button>

    {/* Expanded: summary + details toggle */}
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div key="body" {...collapseVerticalPreset(0.22)}>
          <div className="px-5 pt-2 pb-5">
            <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line">
              {aiHighlight.summary}
            </p>

            {/* Details toggle */}
            <button
              type="button"
              onClick={onDetailToggle}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-content-muted hover:text-content transition-colors duration-150"
            >
              <span>{isDetailOpen ? labels.hideDetails : labels.showDetails}</span>
              <RotatingChevron isRotated={isDetailOpen} size="xs" strokeWidth={2.5} />
            </button>

            {/* Details: 4-step timeline */}
            <AnimatePresence initial={false}>
              {isDetailOpen && (
                <motion.div key="detail" {...collapseVerticalPreset(0.22)}>
                  <div className="relative pl-6 mt-5">
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-slate-200 via-slate-400 to-slate-900" />

                    <TimelineInitialStep label={labels.context} bodyClassName="whitespace-pre-line">
                      {aiHighlight.context}
                    </TimelineInitialStep>
                    <TimelineSolidStep label={labels.approach} shade={500}>
                      {aiHighlight.approach}
                    </TimelineSolidStep>
                    <TimelineSolidStep label={labels.verification} shade={700}>
                      {aiHighlight.verification}
                    </TimelineSolidStep>
                    <TimelineFinalStep label={labels.impact} preserveLineBreaks>
                      {aiHighlight.impact}
                    </TimelineFinalStep>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default AiHighlightCard;
