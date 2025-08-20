// BulbContainer.tsx
import { useTransform, MotionValue } from 'framer-motion';
import { Lightbulb } from './Lightbulb';

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
}

// 스크롤 애니메이션을 담당하는 별도의 자식 컴포넌트
const ScrollAnimatedBulb: React.FC<
  Pick<BulbContainerProps, 'bulb'> & { scrollYProgress: MotionValue<number> }
> = ({ bulb, scrollYProgress }) => {
  const bulbOpacity = useTransform(scrollYProgress, [bulb.range![0], bulb.range![1]], [0, 1]);

  return (
    <Lightbulb
      top={bulb.top}
      left={bulb.left}
      size={bulb.size}
      bulbOpacity={bulbOpacity}
    />
  );
};

// 메인 컨테이너 컴포넌트
export const BulbContainer: React.FC<BulbContainerProps> = ({
  scrollYProgress,
  bulb,
  isSwitchedOn,
}) => {
  // 조건에 따라 어떤 컴포넌트를 렌더링할지 결정합니다.
  // Hook 자체를 조건부로 호출하는 것이 아니라, Hook을 사용하는 컴포넌트의 렌더링을 조건부로 결정합니다.
  if (scrollYProgress && bulb.range) {
    return <ScrollAnimatedBulb scrollYProgress={scrollYProgress} bulb={bulb} />;
  }

  // 스크롤 애니메이션이 없는 경우 (e.g., MainPhrase5to8)
  return (
    <Lightbulb
      top={bulb.top}
      left={bulb.left}
      size={bulb.size}
      isSwitchedOn={isSwitchedOn}
    />
  );
};