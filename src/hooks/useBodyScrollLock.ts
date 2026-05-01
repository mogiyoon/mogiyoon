import { useEffect } from 'react';

/**
 * 활성 상태일 때 document.body 의 스크롤을 잠그는 훅.
 * cleanup 시 직전에 적용되어 있던 overflow 값을 복원함 (빈 문자열 아님).
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}
