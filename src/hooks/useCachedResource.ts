import { useEffect, useState } from 'react';

export interface CachedResource<T> {
  getCached: () => T | null;
  load: () => Promise<T | null>;
}

/**
 * 모듈 단위로 한 번만 로드하고 재사용할 리소스를 만든다.
 *
 * 정적 JSON처럼 여러 화면/훅에서 읽지만 요청은 한 번만 날리고 싶은 경우에 사용한다.
 */
export const createCachedResource = <T,>(
  loader: () => Promise<T>,
): CachedResource<T> => {
  let cached: T | null = null;
  let pending: Promise<T | null> | null = null;

  const load = () => {
    if (cached !== null) {
      return Promise.resolve(cached);
    }

    if (!pending) {
      pending = loader()
        .then((value) => {
          cached = value;
          return value;
        })
        .catch((error: unknown) => {
          console.error(error);
          return null;
        });
    }

    return pending;
  };

  return {
    getCached: () => cached,
    load,
  };
};

/**
 * createCachedResource 로 만든 리소스를 React 컴포넌트에서 읽기 위한 훅.
 */
export const useCachedResource = <T,>(resource: CachedResource<T>) => {
  const [data, setData] = useState<T | null>(() => resource.getCached());
  const [isLoading, setIsLoading] = useState(() => resource.getCached() === null);

  useEffect(() => {
    const cached = resource.getCached();

    if (cached !== null) {
      setData(cached);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    resource.load().then((value) => {
      if (!isMounted) return;

      setData(value);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [resource]);

  return { data, isLoading };
};
