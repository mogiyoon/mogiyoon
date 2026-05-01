import { useCallback, useEffect, useRef, useState } from 'react';
import { TOAST_VISIBLE_MS } from '../design-tokens';

interface ToastState {
  message: string | null;
  isSuccess: boolean;
}

interface CopyMessages {
  success: string;
  failure: string;
}

/**
 * 클립보드 복사 + 토스트 노출/자동 해제까지 처리하는 공통 훅.
 *
 * 빠르게 연속 호출되는 경우 직전 setTimeout 을 정리하여 타이머 경합을 방지함.
 * 언마운트 시에도 미해제 타이머를 정리함.
 */
export function useCopyToClipboardWithToast(durationMs: number = TOAST_VISIBLE_MS) {
  const [toast, setToast] = useState<ToastState>({ message: null, isSuccess: true });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const copy = useCallback(
    async (text: string, messages: CopyMessages) => {
      try {
        await navigator.clipboard.writeText(text);
        clearTimer();
        setToast({ message: messages.success, isSuccess: true });
      } catch {
        clearTimer();
        setToast({ message: messages.failure, isSuccess: false });
      }
      timerRef.current = setTimeout(() => {
        setToast({ message: null, isSuccess: true });
        timerRef.current = null;
      }, durationMs);
    },
    [durationMs]
  );

  useEffect(() => () => clearTimer(), []);

  return { toast, copy };
}
