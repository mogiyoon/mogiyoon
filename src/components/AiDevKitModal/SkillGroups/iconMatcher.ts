import type { ComponentType } from 'react';

type IconFactory = ComponentType<{ className?: string }>;

/**
 * 키워드별 ItemIcon 매핑 테이블. 위에서 아래로 순회하다 첫 매칭에서 멈춘다.
 * keywords 는 모두 소문자. ko/en 키워드를 같은 행에 섞어 둔다.
 */
const ITEM_ICON_PATTERNS: ReadonlyArray<{
  keywords: readonly string[];
  iconKey:
    | 'decomposition'
    | 'merge'
    | 'loop'
    | 'routing'
    | 'document'
    | 'trigger';
}> = [
  { keywords: ['decomposition', 'role', 'hierarchy', '분해', '역할', '계층'], iconKey: 'decomposition' },
  { keywords: ['merge', 'convergence', 'handoff', '병합', '수렴'], iconKey: 'merge' },
  { keywords: ['loop', 'retry', 'termination', 'feedback', '루프', '재시도', '종료'], iconKey: 'loop' },
  { keywords: ['routing', 'conditional', 'branch', '라우팅', '분기'], iconKey: 'routing' },
  { keywords: ['diagram', 'document', 'output', 'overview', '개요', '그림', '문서', '산출'], iconKey: 'document' },
  { keywords: ['trigger', 'collaborative', 'pipeline', '작업', '트리거'], iconKey: 'trigger' },
];

export type SkillGroupIconKey =
  | 'decomposition'
  | 'merge'
  | 'loop'
  | 'routing'
  | 'document'
  | 'trigger'
  | 'forward'
  | 'check';

export const matchItemIconKey = (title: string, index: number): SkillGroupIconKey => {
  const normalized = title.toLowerCase();
  const matched = ITEM_ICON_PATTERNS.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  );

  if (matched) return matched.iconKey;

  return index % 2 === 0 ? 'forward' : 'check';
};

export const resolveSkillGroupIcon = (
  key: SkillGroupIconKey,
  registry: Record<SkillGroupIconKey, IconFactory>,
): IconFactory => registry[key];
