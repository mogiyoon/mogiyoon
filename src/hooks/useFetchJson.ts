import { useEffect, useState } from 'react';

export interface UseFetchJsonResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 정적 JSON 리소스를 fetch 해서 data / isLoading / error 3-state 를 돌려주는 훅.
 *
 * - `url` 이 `null` 이면 (e.g., 의존하는 id 가 아직 없음) fetch 를 시작하지 않는다.
 * - 언마운트 후 setState 를 피하기 위해 isMounted 가드 적용.
 * - 추가 의존성은 `deps` 배열로 넘기면 url 외에도 변경 시 refetch.
 *
 * InfoPost, ProjectDetailPage 등에서 반복되던 fetch+state+isMounted 패턴을 추출.
 */
export const useFetchJson = <T,>(
  url: string | null,
  deps: ReadonlyArray<unknown> = [],
): UseFetchJsonResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(url !== null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then((json) => {
        if (!isMounted) return;
        setData(json);
        setIsLoading(false);
      })
      .catch((e: unknown) => {
        if (!isMounted) return;
        console.error(e);
        setError(e instanceof Error ? e.message : String(e));
        setData(null);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  return { data, isLoading, error };
};
