import React from 'react';
import { readableTextStyle } from './constants';
import type { FlowStep } from './types';

/** 데스크탑 / 모바일 메인 라인에서 공통으로 쓰는 카드. */
const FlowStepCard: React.FC<{
  item: FlowStep;
  highlighted?: boolean;
  className?: string;
  style?: React.CSSProperties;
}> = ({ item, highlighted = false, className = '', style }) => (
  <div
    className={`${className} flex min-h-[132px] flex-col items-center justify-center rounded-card px-4 py-3 text-center ${
      highlighted
        ? 'border-2 border-accent-100 bg-accent-50'
        : 'border border-line/70 bg-surface'
    }`}
    style={style}
  >
    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-700">
      Step {item.index + 1}
    </span>
    {item.detail?.actor && (
      <span
        className="mt-1 max-w-full rounded-full bg-surface px-2 py-0.5 text-[10px] font-bold text-accent-700"
        style={readableTextStyle}
      >
        {item.detail.actor}
      </span>
    )}
    <span className="mt-1 text-sm font-bold text-content" style={readableTextStyle}>
      {item.step}
    </span>
    {item.detail?.action && (
      <span
        className="mt-1 text-[11px] font-medium leading-snug text-content-secondary"
        style={readableTextStyle}
      >
        {item.detail.action}
      </span>
    )}
  </div>
);

export default FlowStepCard;
