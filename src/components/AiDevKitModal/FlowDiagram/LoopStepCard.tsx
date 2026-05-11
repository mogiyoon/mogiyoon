import React from 'react';
import { readableTextStyle } from './constants';
import type { FlowStep } from './types';

/**
 * Loop 클러스터 안에 들어가는 작은 카드. 여러 개가 한 블록에 들어가야 하므로
 * FlowStepCard 보다 패딩과 폰트가 작다.
 */
const LoopStepCard: React.FC<{
  item: FlowStep;
  className?: string;
  style?: React.CSSProperties;
}> = ({ item, className = '', style }) => (
  <div
    className={`${className} flex flex-col items-center justify-center rounded-card border-2 border-accent-100 bg-accent-50 px-3 py-2.5 text-center`}
    style={style}
  >
    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-700">
      Step {item.index + 1}
    </span>
    {item.detail?.actor && (
      <span
        className="mt-0.5 max-w-full rounded-full bg-surface px-1.5 py-0.5 text-[9px] font-bold text-accent-700"
        style={readableTextStyle}
      >
        {item.detail.actor}
      </span>
    )}
    <span
      className="mt-0.5 text-xs font-bold leading-tight text-content"
      style={readableTextStyle}
    >
      {item.step}
    </span>
    {item.detail?.action && (
      <span
        className="mt-0.5 text-[10px] font-medium leading-tight text-content-secondary"
        style={readableTextStyle}
      >
        {item.detail.action}
      </span>
    )}
  </div>
);

export default LoopStepCard;
