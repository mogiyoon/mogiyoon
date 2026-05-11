import type { ProfileData } from './types';

/**
 * 모듈 로드 시점에 introduction.json 을 미리 fetch 시작.
 * ProfileSection 이 마운트되기 전에 데이터 다운로드가 진행되어 탭 클릭 즉시 표시 가능.
 *
 * cachedData 는 fetch 완료 시 채워지며, ProfileSection 의 초기 state 로 즉시 사용된다.
 */
export let cachedData: ProfileData | null = null;

export const dataPromise = fetch('/data/introduction.json')
  .then((r) => r.json())
  .then((json) => {
    cachedData = json as ProfileData;
    return cachedData;
  })
  .catch(console.error);
