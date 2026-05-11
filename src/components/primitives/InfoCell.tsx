import React from 'react';

export type InfoCellVariant = 'subtle' | 'bordered';

const CONTAINER_CLASSES: Record<InfoCellVariant, string> = {
  subtle: 'rounded-2xl bg-surface-subtle px-4 py-3',
  bordered: 'rounded-modal border border-line/70 bg-surface p-4',
};

const LABEL_CLASSES: Record<InfoCellVariant, string> = {
  subtle: 'text-xs font-semibold uppercase tracking-widest text-content-muted',
  bordered: 'text-xs font-bold text-content',
};

const VALUE_CLASSES: Record<InfoCellVariant, string> = {
  subtle: 'mt-1 text-sm font-medium text-content-secondary',
  bordered: 'mt-1 text-sm text-content-secondary',
};

export interface InfoCellProps {
  label: React.ReactNode;
  value: React.ReactNode;
  variant?: InfoCellVariant;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

/**
 * 라벨 + 값 한 쌍을 보여주는 작은 정보 셀.
 *
 * 두 가지 변형:
 * - `subtle`: 부모 카드 안에 들어가는 soft 채움 (bg-surface-subtle, 경계선 없음)
 * - `bordered`: 독립 정보 블록 강조 (rounded-modal + border)
 *
 * ResumeProfileCard (email/phone) 등에서 반복되어 추출.
 */
const InfoCell: React.FC<InfoCellProps> = ({
  label,
  value,
  variant = 'subtle',
  className = '',
  labelClassName = '',
  valueClassName = '',
}) => (
  <div className={`${CONTAINER_CLASSES[variant]} ${className}`.trim()}>
    <p className={`${LABEL_CLASSES[variant]} ${labelClassName}`.trim()}>{label}</p>
    <p className={`${VALUE_CLASSES[variant]} ${valueClassName}`.trim()}>{value}</p>
  </div>
);

export default InfoCell;
