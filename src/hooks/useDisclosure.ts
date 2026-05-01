import { useCallback, useState } from 'react';

/**
 * 펼침/접힘 같은 boolean 상태를 관리하는 공통 훅.
 * open / close / toggle / setIsOpen 핸들러를 함께 반환함.
 */
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  return { isOpen, open, close, toggle, setIsOpen };
}
