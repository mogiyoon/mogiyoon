import type { TFunction } from 'i18next';

/**
 * i18n 키가 배열을 가리킬 때 `t(key, { returnObjects: true, defaultValue: [] }) as T[]`
 * 보일러플레이트를 줄여주는 헬퍼.
 *
 * i18next 가 returnObjects 옵션에서 키 누락 시 문자열 fallback 을 돌려줄 수 있어
 * 항상 Array 검사 후 비어 있으면 `[]` 를 반환하도록 보장한다.
 *
 * @example
 * const highlights = fetchI18nArray<HighlightItem>(
 *   t,
 *   `work.${id}.projects.${projId}.highlights`,
 * );
 *
 * // 네임스페이스 지정 (t 가 다중 namespace 로 만들어졌고 명시가 필요할 때)
 * const desc = fetchI18nArray<string>(t, `awards.${id}.description`, { ns: 'introduction' });
 */
export interface FetchI18nArrayOptions {
  ns?: string;
}

export const fetchI18nArray = <T = unknown>(
  t: TFunction,
  key: string,
  options?: FetchI18nArrayOptions,
): T[] => {
  const result = t(key, {
    returnObjects: true,
    defaultValue: [],
    ...(options?.ns ? { ns: options.ns } : {}),
  }) as unknown;
  return Array.isArray(result) ? (result as T[]) : [];
};
