import React from 'react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Panel className override / additions. Appended after the default panel classes. */
  className?: string;
  /** Backdrop className override / additions. Appended after the default backdrop classes. */
  backdropClassName?: string;
  /** 다이얼로그의 접근 가능한 이름 (WCAG 4.1.2). 패널 안 제목 요소의 id 를 넘긴다. */
  ariaLabelledBy?: string;
  /** 제목 요소가 없을 때 쓰는 문자열 이름. ariaLabelledBy 가 있으면 그쪽이 우선. */
  ariaLabel?: string;
}

const DEFAULT_BACKDROP_CLASSES = 'fixed inset-0 z-50 bg-black/50';
const DEFAULT_PANEL_CLASSES =
  'rounded-modal bg-surface shadow-2xl animate-fade-in-up';

/**
 * 공용 모달 셸 (primitive).
 *
 * - `isOpen`이 false면 아무것도 렌더링하지 않음.
 * - 열려 있는 동안 body 스크롤을 잠그고 Escape 키로 닫힘.
 * - 백드롭 클릭 시 `onClose` 호출, 패널 클릭은 백드롭으로 전파되지 않음.
 * - 헤더/콘텐츠 마크업은 `children` 슬롯으로 호출자가 직접 제공함.
 */
const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  children,
  className,
  backdropClassName,
  ariaLabelledBy,
  ariaLabel,
}) => {
  useBodyScrollLock(isOpen);
  useEscapeKey(isOpen ? onClose : null, isOpen);

  if (!isOpen) return null;

  const backdropClass = backdropClassName
    ? `${DEFAULT_BACKDROP_CLASSES} ${backdropClassName}`
    : DEFAULT_BACKDROP_CLASSES;
  const panelClass = className
    ? `${DEFAULT_PANEL_CLASSES} ${className}`
    : DEFAULT_PANEL_CLASSES;

  return (
    <div className={backdropClass} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        className={panelClass}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalShell;
