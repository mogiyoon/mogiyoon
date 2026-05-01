import { useEffect, useRef } from 'react';

/**
 * Escape 키 입력 시 전달된 핸들러를 호출하는 공통 훅.
 *
 * 핸들러 ref 패턴을 사용하여 핸들러 참조가 매 렌더마다 바뀌어도
 * keydown 리스너는 한 번만 등록/해제됨.
 */
export function useEscapeKey(
  handler: (() => void) | null | undefined,
  active: boolean = true
): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!active || !handlerRef.current) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handlerRef.current?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);
}
