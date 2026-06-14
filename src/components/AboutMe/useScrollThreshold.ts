import { useEffect, useState } from 'react';
import { useMotionValueEvent, type MotionValue } from 'framer-motion';

/**
 * scrollYProgress 가 threshold 이상이면 true, 미만이면 false (양방향).
 *
 * useScrollLatch 와 달리 되돌아간다: 임계점을 지나면 일반 속도로 재생되고,
 * 다시 위로 올려 임계점을 벗어나면 같은 속도로 역재생된다.
 * 스크롤 위치에 opacity 를 직접 연동(useTransform)하는 대신 이 boolean 을
 * motion 의 animate 대상으로 써서 "특정 위치에서 일반 속도로 전환"되게 한다.
 */
export function useScrollThreshold(progress: MotionValue<number>, threshold: number): boolean {
  const [active, setActive] = useState(() => progress.get() >= threshold);

  useMotionValueEvent(progress, 'change', (value) => {
    setActive(value >= threshold);
  });

  useEffect(() => {
    setActive(progress.get() >= threshold);
  }, [progress, threshold]);

  return active;
}
