import React from 'react';

export type BulletListTone = 'meta' | 'secondary' | 'muted';

const TONE_CLASSES: Record<BulletListTone, string> = {
  meta: 'text-content-meta',
  secondary: 'text-content-secondary',
  muted: 'text-content-muted',
};

export interface BulletListProps {
  items: ReadonlyArray<string | null | undefined> | undefined;
  tone?: BulletListTone;
  className?: string;
}

/**
 * 빈 문자열 / null / undefined 를 자동 필터하는 disc bullet list.
 *
 * 모든 아이템이 비어 있으면 아예 렌더링하지 않는다. description?.filter(Boolean).length
 * ? <ul>... : null 패턴을 추출한 것.
 */
const BulletList: React.FC<BulletListProps> = ({ items, tone = 'meta', className = '' }) => {
  const visibleItems = (items ?? []).filter((item): item is string => Boolean(item));

  if (visibleItems.length === 0) return null;

  return (
    <ul className={`list-disc pl-5 text-sm ${TONE_CLASSES[tone]} ${className}`.trim()}>
      {visibleItems.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  );
};

export default BulletList;
