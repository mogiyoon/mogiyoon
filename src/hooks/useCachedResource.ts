import { useEffect, useState } from 'react';

export interface CachedResource<T> {
  getCached: () => T | null;
  load: () => Promise<T | null>;
}

export interface CreateCachedResourceOptions {
  /**
   * true 면 createCachedResource 호출 시점(모듈 로드 시점)에 즉시 load() 를 호출해
   * 사용자가 화면을 클릭하기 전에 fetch 를 시작한다.
   *
   * 리팩토링 이전 `useProjectLists` / ProfileSection prefetch 가 동일한 효과를
   * 모듈 최상단의 즉시 실행 Promise 로 얻고 있었기 때문에, lazy 동작으로 회귀하지
   * 않도록 정적 JSON 리소스에는 보통 true 를 지정한다.
   */
  eager?: boolean;
}

/**
 * 모듈 단위로 한 번만 로드하고 재사용할 리소스를 만든다.
 *
 * 정적 JSON처럼 여러 화면/훅에서 읽지만 요청은 한 번만 날리고 싶은 경우에 사용한다.
 * `eager: true` 옵션을 주면 모듈 로드 시점에 fetch 가 즉시 시작된다 (탭 클릭 전에
 * 미리 받아두는 prefetch 효과). 기본값은 false (lazy).
 */
export const createCachedResource = <T,>(
  loader: () => Promise<T>,
  options: CreateCachedResourceOptions = {},
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

  const resource: CachedResource<T> = {
    getCached: () => cached,
    load,
  };

  if (options.eager) {
    void load();
  }

  return resource;
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
