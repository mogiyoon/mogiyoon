import { useCallback, useState } from 'react';

/**
 * Set<T> 의 add/delete 토글 boilerplate 를 줄이기 위한 훅.
 *
 * 인라인 `setIds(prev => { const next = new Set(prev); ... })` 패턴이
 * 5+ 곳에서 반복되어 추출함. WorkBlock 의 하이라이트 / 섹션 토글,
 * ResumePreviewPage 의 선택된 블록 / 포함 프로젝트 / 닫힌 서브패널 토글 등.
 */
export const useToggleSet = <T = string>(initial?: Iterable<T>) => {
  const [ids, setIds] = useState<Set<T>>(() => new Set(initial ?? []));

  const toggle = useCallback((id: T) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const has = useCallback((id: T) => ids.has(id), [ids]);

  const reset = useCallback((nextIds?: Iterable<T>) => {
    setIds(new Set(nextIds ?? []));
  }, []);

  return { ids, has, toggle, setIds, reset };
};
