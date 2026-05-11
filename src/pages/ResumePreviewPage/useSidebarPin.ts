import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'resume.sidebarPinned';

/**
 * 이력서 페이지 사이드바 (편집 패널) 의 "고정" 상태를 localStorage 와 sync 한다.
 *
 * 사용처: ResumePreviewPage.
 * 반환되는 togglePin 은 boolean 인자를 받으며, true 로 호출되면 현재 위치를 측정해
 * pinnedTop offset 을 계산해 둔다. false 면 그 offset 을 비우고 일반 흐름으로 복귀.
 *
 * 단일 사용처이지만 effect + ref 계산 + localStorage 가 묶여 있어 페이지 본체에서
 * 분리해 가독성을 높인다.
 */
export const useSidebarPin = () => {
  const asideRef = useRef<HTMLElement>(null);
  const sidebarColumnRef = useRef<HTMLDivElement>(null);

  const [isSidebarPinned, setIsSidebarPinned] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  });
  const [pinnedTop, setPinnedTop] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, String(isSidebarPinned));
  }, [isSidebarPinned]);

  const togglePin = (checked: boolean) => {
    if (checked && asideRef.current && sidebarColumnRef.current) {
      const asideRect = asideRef.current.getBoundingClientRect();
      const columnRect = sidebarColumnRef.current.getBoundingClientRect();
      setPinnedTop(asideRect.top - columnRect.top);
    } else {
      setPinnedTop(null);
    }
    setIsSidebarPinned(checked);
  };

  return {
    asideRef,
    sidebarColumnRef,
    isSidebarPinned,
    pinnedTop,
    togglePin,
  };
};
