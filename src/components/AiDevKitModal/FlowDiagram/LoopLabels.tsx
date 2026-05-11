import React from 'react';
import type { AiDevKitFlowLoop } from '../types';

/** Loop 의 의미 설명 (예: "검증 실패 시 step 2 로 회귀") 를 다이어그램 아래에 배치. */
const LoopLabels: React.FC<{ loops: AiDevKitFlowLoop[] }> = ({ loops }) => {
  const labelledLoops = loops.filter((loop) => loop.label);

  if (labelledLoops.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      {labelledLoops.map((loop, index) => (
        <p
          key={`${loop.fromStep}-${loop.toStep}-${index}`}
          className="flex items-start gap-2 text-xs font-medium leading-relaxed text-content-secondary"
        >
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-600 text-surface">
            <svg
              className="h-2.5 w-2.5"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4.5 5.5H2.5V3.5M2.75 5.25C3.7 3.8 5.23 3 7 3C9.76 3 12 5.24 12 8M11.5 10.5H13.5V12.5M13.25 10.75C12.3 12.2 10.77 13 9 13C6.24 13 4 10.76 4 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {loop.label}
        </p>
      ))}
    </div>
  );
};

export default LoopLabels;
