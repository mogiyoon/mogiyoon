// BulbContainer.tsx
import { MotionValue } from 'framer-motion';
import { Lightbulb } from './Lightbulb';
import { useScrollThreshold } from './useScrollThreshold';

interface BulbData {
  id: number;
  top: string;
  left: string;
  size: number;
  range?: readonly [number, number];
}

interface BulbContainerProps {
  scrollYProgress?: MotionValue<number>;
  bulb: BulbData;
  isSwitchedOn?: boolean;
  /** 스위치 씬에서 콘텐츠 노출 여부(트리거 latch) */
  contentShown?: boolean;
}

// 스크롤 트리거(latch)를 담당하는 별도의 자식 컴포넌트
const ScrollAnimatedBulb: React.FC<
  Pick<BulbContainerProps, 'bulb'> & { scrollYProgress: MotionValue<number> }
> = ({ bulb, scrollYProgress }) => {
  // 임계점(range 시작) 통과 시 일반 속도로 fade-in, 다시 위로 올리면 역재생
  const shown = useScrollThreshold(scrollYProgress, bulb.range![0]);

  return <Lightbulb top={bulb.top} left={bulb.left} size={bulb.size} bulbShown={shown} />;
};

// 메인 컨테이너 컴포넌트
export const BulbContainer: React.FC<BulbContainerProps> = ({
  scrollYProgress,
  bulb,
  isSwitchedOn,
  contentShown,
}) => {
  // Hook 자체를 조건부로 호출하지 않도록, Hook 을 쓰는 컴포넌트의 렌더링을 조건부로 결정한다.
  if (scrollYProgress && bulb.range) {
    return <ScrollAnimatedBulb scrollYProgress={scrollYProgress} bulb={bulb} />;
  }

  // 스위치 씬 (MainPhrase5to8)
  return (
    <Lightbulb
      top={bulb.top}
      left={bulb.left}
      size={bulb.size}
      isSwitchedOn={isSwitchedOn}
      bulbShown={contentShown}
    />
  );
};
