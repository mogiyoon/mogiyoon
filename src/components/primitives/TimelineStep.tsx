import React from 'react';

/**
 * 세로 타임라인 한 단계를 그리는 헬퍼들. HighlightCard (Problem/Solution/Result 3단계) 와
 * AiHighlightCard (Context/Approach/Verification/Impact 4단계) 가 동일한 시각 패턴을 사용함.
 *
 * 단계는 시각적으로 3종류:
 * - `TimelineInitialStep` : 외곽선 원, 부드러운 텍스트 (시작 단계)
 * - `TimelineSolidStep`   : 채워진 원 + 카드 본문 (중간 단계, slate-500~700 색조 조절 가능)
 * - `TimelineFinalStep`   : 다이아몬드(회전 사각형) + 다크 카드 + 흰 글씨 (마지막 강조 단계)
 *
 * 모두 connector 라인 (`absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b ...`)
 * 가 있는 부모 컨테이너 안에서 사용된다고 가정한다.
 */

type StepLabel = React.ReactNode;
type StepContent = React.ReactNode;
type TimelineShade = 500 | 600 | 700;

const SOLID_DOT_SHADE: Record<TimelineShade, string> = {
  500: 'bg-slate-500',
  600: 'bg-slate-600',
  700: 'bg-slate-700',
};

const EYEBROW_BASE = 'block text-[10px] font-semibold uppercase tracking-widest';

export const TimelineInitialStep: React.FC<{
  label: StepLabel;
  children: StepContent;
  /** 본문 p 에 추가할 클래스 (예: `whitespace-pre-line`) */
  bodyClassName?: string;
}> = ({ label, children, bodyClassName = '' }) => (
  <div className="relative pb-6">
    <div className="absolute -left-6 top-hairline w-3 h-3 rounded-full border-2 border-line-strong bg-surface" />
    <span className={`${EYEBROW_BASE} text-slate-300 mb-1`}>{label}</span>
    <p className={`text-sm text-content-muted leading-relaxed ${bodyClassName}`.trim()}>
      {children}
    </p>
  </div>
);

export const TimelineSolidStep: React.FC<{
  label: StepLabel;
  children: StepContent;
  /** slate-500 / 600 / 700 단계 (점진적으로 어두워지는 톤). 기본 600. */
  shade?: TimelineShade;
}> = ({ label, children, shade = 600 }) => (
  <div className="relative pb-6">
    <div className={`absolute -left-6 top-hairline w-3 h-3 rounded-full ${SOLID_DOT_SHADE[shade]}`} />
    <span className={`${EYEBROW_BASE} text-content-tertiary mb-2`}>{label}</span>
    <div className="rounded-card border border-line bg-surface-subtle px-4 py-3">
      <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-wrap">
        {children}
      </p>
    </div>
  </div>
);

export const TimelineFinalStep: React.FC<{
  label: StepLabel;
  children: StepContent;
  /** 본문에 `whitespace-pre-wrap` 적용 여부 (멀티라인 description 일 때 true) */
  preserveLineBreaks?: boolean;
}> = ({ label, children, preserveLineBreaks = false }) => (
  <div className="relative">
    <div className="absolute -left-[25px] top-hairline w-[14px] h-[14px] bg-slate-900 rotate-45 rounded-sm" />
    <span className={`${EYEBROW_BASE} text-content-tertiary mb-2`}>{label}</span>
    <div className="rounded-card bg-slate-900 px-4 py-3">
      <p
        className={`text-sm font-semibold text-white leading-relaxed ${
          preserveLineBreaks ? 'whitespace-pre-wrap' : ''
        }`.trim()}
      >
        {children}
      </p>
    </div>
  </div>
);
