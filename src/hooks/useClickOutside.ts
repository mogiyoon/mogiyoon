import { useEffect } from 'react';
import type React from 'react';

/**
 * 활성 상태일 때 ref 외부 영역의 mousedown 이벤트를 감지해 handler 를 호출하는 훅.
 * active 가 false 면 리스너를 등록하지 않음.
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  handler: () => void,
  active: boolean
): void {
  useEffect(() => {
    if (!active) return;
    const onMouseDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [ref, handler, active]);
}
