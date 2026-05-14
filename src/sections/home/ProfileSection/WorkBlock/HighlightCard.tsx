import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatIndex } from '../../../../utils/formatIndex';
import { collapseVerticalPreset } from '../../../../utils/motionPresets';
import RotatingChevron from '../../../../components/primitives/RotatingChevron';
import { itemVariants } from '../animations';
import type { HighlightItem } from '../types';
import { TimelineFinalStep, TimelineInitialStep, TimelineSolidStep } from '../../../../components/primitives/TimelineStep';

/**
 * 개발 하이라이트 카드 — 문제 / 해결 / 결과 3단계 타임라인 (penned dot connector).
 * 클릭 시 본문이 펼쳐진다.
 */
const HighlightCard: React.FC<{
  highlight: HighlightItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  labels: { problem: string; analysis: string; solution: string; result: string };
}> = ({ highlight, index, isOpen, onToggle, labels }) => (
  <motion.div
    variants={itemVariants}
    className="rounded-modal border border-line bg-surface overflow-hidden"
  >
    {/* Title row (always visible) */}
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-subtle transition-colors duration-150"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="shrink-0 text-xs font-semibold text-slate-300">
          {formatIndex(index)}
        </span>
        <p className="text-sm font-semibold text-content truncate">{highlight.title}</p>
      </div>
      <div className="shrink-0 ml-3 text-content-muted">
        <RotatingChevron isRotated={isOpen} />
      </div>
    </button>

    {/* Expanded detail */}
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div key="detail" {...collapseVerticalPreset(0.22)}>
          <div className="px-5 pt-2 pb-6">
            <div className="relative pl-6">
              {/* Vertical connector */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-slate-200 via-slate-400 to-slate-900" />

              <TimelineInitialStep label={labels.problem}>{highlight.problem}</TimelineInitialStep>
              {highlight.analysis && (
                <TimelineSolidStep label={labels.analysis} shade={500}>{highlight.analysis}</TimelineSolidStep>
              )}
              <TimelineSolidStep label={labels.solution} shade={600}>{highlight.solution}</TimelineSolidStep>
              <TimelineFinalStep label={labels.result}>{highlight.result}</TimelineFinalStep>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default HighlightCard;
