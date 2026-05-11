import type { ProfileData } from './types';
import { createCachedResource } from '../../../hooks/useCachedResource';
import { fetchJson } from '../../../utils/fetchJson';

/**
 * 모듈 로드 시점에 introduction.json 을 미리 fetch 시작.
 * ProfileSection 이 마운트되기 전에 데이터 다운로드가 진행되어 탭 클릭 즉시 표시 가능.
 *
 * dataResource 는 fetch 완료값을 모듈 단위로 캐시하므로 ProfileSection 재방문 시
 * 다시 요청하지 않고 즉시 재사용할 수 있다.
 */
export const dataResource = createCachedResource<ProfileData>(
  () => fetchJson<ProfileData>('/data/introduction.json'),
  { eager: true },
);
