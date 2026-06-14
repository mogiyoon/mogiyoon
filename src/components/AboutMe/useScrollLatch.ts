import { useEffect, useState } from 'react';
import { useMotionValueEvent, type MotionValue } from 'framer-motion';

/**
 * scrollYProgress 가 threshold 를 한 번이라도 통과하면 true 로 고정(latch)된다.
 * 스크롤을 다시 위로 올려도 false 로 되돌아가지 않는다 ("한 번만 재생 후 유지").
 *
 * 스크롤 위치에 opacity 를 직접 연동(useTransform)하는 대신,
 * 이 boolean 을 motion 의 animate 대상으로 써서 임계점 도달 시
 * 일정 시간 동안 일반 속도로 재생되도록 한다.
 */
export function useScrollLatch(progress: MotionValue<number>, threshold: number): boolean {
  const [latched, setLatched] = useState(() => progress.get() >= threshold);

  useMotionValueEvent(progress, 'change', (value) => {
    if (value >= threshold) setLatched(true);
  });

  useEffect(() => {
    if (progress.get() >= threshold) setLatched(true);
  }, [progress, threshold]);

  return latched;
}
