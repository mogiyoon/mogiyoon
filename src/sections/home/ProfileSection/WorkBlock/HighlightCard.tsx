import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatIndex } from '../../../../utils/formatIndex';
import { collapseVerticalPreset } from '../../../../utils/motionPresets';
import RotatingChevron from '../../../../components/primitives/RotatingChevron';
import { itemVariants } from '../animations';
import type { HighlightItem } from '../types';

/**
 * 개발 하이라이트 카드 — 문제 / 해결 / 결과 3단계 타임라인 (penned dot connector).
 * 클릭 시 본문이 펼쳐진다.
 */
const HighlightCard: React.FC<{
  highlight: HighlightItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  labels: { problem: string; solution: string; result: string };
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

              {/* Problem */}
              <div className="relative pb-6">
                <div className="absolute -left-6 top-hairline w-3 h-3 rounded-full border-2 border-line-strong bg-surface" />
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-300 mb-1">
                  {labels.problem}
                </span>
                <p className="text-sm text-content-muted leading-relaxed">{highlight.problem}</p>
              </div>

              {/* Solution */}
              <div className="relative pb-6">
                <div className="absolute -left-6 top-hairline w-3 h-3 rounded-full bg-slate-600" />
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-content-tertiary mb-2">
                  {labels.solution}
                </span>
                <div className="rounded-card border border-line bg-surface-subtle px-4 py-3">
                  <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-line">{highlight.solution}</p>
                </div>
              </div>

              {/* Result */}
              <div className="relative">
                <div className="absolute -left-[25px] top-hairline w-[14px] h-[14px] bg-slate-900 rotate-45 rounded-sm" />
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-content-tertiary mb-2">
                  {labels.result}
                </span>
                <div className="rounded-card bg-slate-900 px-4 py-3">
                  <p className="text-sm font-semibold text-white leading-relaxed">{highlight.result}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default HighlightCard;
