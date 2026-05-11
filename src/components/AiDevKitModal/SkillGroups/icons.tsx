import React from 'react';
import {
  matchItemIconKey,
  resolveSkillGroupIcon,
  type SkillGroupIconKey,
} from './iconMatcher';

/**
 * SkillGroups 전용 아이콘 모음.
 *
 * - SectionIcon: 인덱스 mod 5 로 5종류 중 하나 선택 (Section 카드 헤더)
 * - ItemIcon: title 내 키워드 매칭으로 7종류 중 하나 선택 (DetailItem 행 좌측)
 *
 * 양쪽 모두 if-chain → 룩업 테이블 패턴으로 작성되어 있어 신규 variant 추가 시
 * 데이터 한 줄만 늘리면 된다.
 */

type IconComponent = React.FC<{ className?: string }>;

// ── Section Icons ─────────────────────────────────────────────────────────────

const SectionIconNodes: IconComponent[] = [
  ({ className = 'h-5 w-5' }) => (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="15" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.8 6.2L9 13M13.2 6.2L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  ({ className = 'h-5 w-5' }) => (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M11.5 2.5L4.5 11H9L8 17.5L15.5 8.5H11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  ({ className = 'h-5 w-5' }) => (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10H8.5M8.5 10C8.5 6.5 11 5 15.5 5M8.5 10C8.5 13.5 11 15 15.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.5 3L15.5 5L13.5 7M13.5 13L15.5 15L13.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ({ className = 'h-5 w-5' }) => (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2.75L15.5 5V9.5C15.5 13 13.25 15.5 10 17.25C6.75 15.5 4.5 13 4.5 9.5V5L10 2.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7.5 10L9.25 11.75L12.75 8.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ({ className = 'h-5 w-5' }) => (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 3.5H12L15 6.5V16.5H5V3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 3.5V6.5H15M7.5 10H12.5M7.5 13H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
];

export const SectionIcon: React.FC<{ index: number }> = ({ index }) => {
  const Icon = SectionIconNodes[index % SectionIconNodes.length];
  return <Icon />;
};

// ── Item Icons ────────────────────────────────────────────────────────────────

const DecompositionIcon: IconComponent = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="4" cy="4" r="1.75" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="4" r="1.75" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8" cy="12" r="1.75" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.5 5.5L7.25 10M10.5 5.5L8.75 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const MergeIcon: IconComponent = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 4.5H7M3 11.5H7M7 4.5C8.5 4.5 8.5 8 10 8H13M7 11.5C8.5 11.5 8.5 8 10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LoopIcon: IconComponent = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M11.5 6.5H14V4M13.75 6.25C13 4.25 11.15 3 9 3C6.25 3 4 5.25 4 8M4.5 9.5H2V12M2.25 9.75C3 11.75 4.85 13 7 13C9.75 13 12 10.75 12 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RoutingIcon: IconComponent = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8H7.5M7.5 8C7.5 5.25 9.5 4 13 4M7.5 8C7.5 10.75 9.5 12 13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 2.5L13 4L11 5.5M11 10.5L13 12L11 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocumentIcon: IconComponent = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 3.5H10.5L12.5 5.5V12.5H4V3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M10.5 3.5V5.5H12.5M6 8H10.5M6 10.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TriggerIcon: IconComponent = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8.75 2.5L4 8.25H7.25L6.5 13.5L12 6.75H8.75V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const ForwardArrowIcon: IconComponent = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8H13M10 5L13 8L10 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckSquareIcon: IconComponent = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 4H12V12H4V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M6.25 8.25L7.5 9.5L10 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ITEM_ICONS: Record<SkillGroupIconKey, IconComponent> = {
  decomposition: DecompositionIcon,
  merge: MergeIcon,
  loop: LoopIcon,
  routing: RoutingIcon,
  document: DocumentIcon,
  trigger: TriggerIcon,
  forward: ForwardArrowIcon,
  check: CheckSquareIcon,
};

export const ItemIcon: React.FC<{ title: string; index: number }> = ({ title, index }) => {
  const Icon = resolveSkillGroupIcon(matchItemIconKey(title, index), ITEM_ICONS);
  return <Icon />;
};
