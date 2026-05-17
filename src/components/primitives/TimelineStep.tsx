import React from 'react';

/**
 * 세로 타임라인 한 단계를 그리는 헬퍼들. HighlightCard (Problem/Analysis/Solution/Result),
 * AiHighlightCard (Context/Approach/Verification/Impact), TotalSummaryComponent (프로젝트 카테고리)
 * 가 동일한 시각 패턴을 공유함.
 *
 * 단계는 시각적으로 3종류:
 * - `TimelineInitialStep` : 외곽선 원, 부드러운 텍스트 (시작 단계)
 * - `TimelineSolidStep`   : 채워진 원 + 카드 본문 (중간 단계, slate-500~700 색조 조절 가능)
 * - `TimelineFinalStep`   : 다이아몬드(회전 사각형) + 다크 카드 + 흰 글씨 (마지막 강조 단계)
 *
 * DESIGN.md: indigo 만이 유일한 accent. solution 의미에 accent='accent' 사용 (indigo tint).
 * problem 은 accent='subtle' 로 흰 bg + 외곽선 — "열린 질문" 느낌. analysis 는 기본 neutral.
 *
 * 모두 connector 라인 (`absolute left-[5.5px] top-2 bottom-2 w-px bg-gradient-to-b ...`)
 * 가 있는 부모 컨테이너 안에서 사용된다고 가정한다 — 12px 너비 dot 의 중심(x=6)에 1px
 * 라인을 정확히 정렬하기 위해 left:5.5px 사용.
 */

type StepLabel = React.ReactNode;
type StepContent = React.ReactNode;
type TimelineShade = 500 | 600 | 700;
export type TimelineAccent = 'neutral' | 'subtle' | 'accent';

const SOLID_DOT_SHADE: Record<TimelineShade, string> = {
  500: 'bg-slate-500',
  600: 'bg-slate-600',
  700: 'bg-slate-700',
};

const EYEBROW_BASE = 'block text-[10px] font-semibold uppercase tracking-widest';

const ACCENT_BOX: Record<TimelineAccent, string> = {
  neutral: 'border-line bg-surface-subtle',
  subtle: 'border-line bg-surface',
  accent: 'border-accent-100 bg-accent-50',
};

const ACCENT_LABEL: Record<TimelineAccent, string> = {
  neutral: 'text-content-tertiary',
  subtle: 'text-content-tertiary',
  accent: 'text-accent-700',
};

const ACCENT_INITIAL_DOT: Record<TimelineAccent, string> = {
  neutral: 'border-line-strong bg-surface',
  subtle: 'border-line-strong bg-surface',
  accent: 'border-accent-500 bg-surface',
};

const ACCENT_SOLID_DOT_OVERRIDE: Record<TimelineAccent, string | null> = {
  neutral: null,
  subtle: null,
  accent: 'bg-accent-500',
};

export const TimelineInitialStep: React.FC<{
  label: StepLabel;
  children: StepContent;
  /** 본문 p 에 추가할 클래스 (예: `whitespace-pre-line`) */
  bodyClassName?: string;
  /** 카테고리 톤. problem 에서는 'subtle' 권장. */
  accent?: TimelineAccent;
}> = ({ label, children, bodyClassName = '', accent = 'neutral' }) => (
  <div className="relative pb-6">
    <div className={`absolute -left-6 top-hairline w-3 h-3 rounded-full border-2 ${ACCENT_INITIAL_DOT[accent]}`} />
    <span className={`${EYEBROW_BASE} mb-2 ${ACCENT_LABEL[accent]}`}>{label}</span>
    <div className={`rounded-card border px-4 py-3 ${ACCENT_BOX[accent]}`}>
      <p className={`text-sm text-content-secondary leading-relaxed whitespace-pre-wrap ${bodyClassName}`.trim()}>
        {children}
      </p>
    </div>
  </div>
);

export const TimelineSolidStep: React.FC<{
  label: StepLabel;
  children: StepContent;
  /** slate-500 / 600 / 700 단계 (점진적으로 어두워지는 톤). 기본 600. */
  shade?: TimelineShade;
  /** 카테고리 톤. solution 에서는 'accent' (indigo) 사용. */
  accent?: TimelineAccent;
}> = ({ label, children, shade = 600, accent = 'neutral' }) => {
  const dotClass = ACCENT_SOLID_DOT_OVERRIDE[accent] ?? SOLID_DOT_SHADE[shade];
  return (
    <div className="relative pb-6">
      <div className={`absolute -left-6 top-hairline w-3 h-3 rounded-full ${dotClass}`} />
      <span className={`${EYEBROW_BASE} mb-2 ${ACCENT_LABEL[accent]}`}>{label}</span>
      <div className={`rounded-card border px-4 py-3 ${ACCENT_BOX[accent]}`}>
        <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-wrap">
          {children}
        </p>
      </div>
    </div>
  );
};

export const TimelineFinalStep: React.FC<{
  label: StepLabel;
  children: StepContent;
  /** 본문에 `whitespace-pre-wrap` 적용 여부 (멀티라인 description 일 때 true) */
  preserveLineBreaks?: boolean;
}> = ({ label, children, preserveLineBreaks = false }) => (
  <div className="relative pb-6">
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
