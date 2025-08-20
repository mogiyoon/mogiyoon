// Lightbulb.tsx
import { motion, MotionValue } from 'framer-motion';

interface LightbulbProps {
  top: string;
  left: string;
  size: number;
  bulbOpacity?: MotionValue<number>; // MainPhrase1to4를 위해 optional로 유지
  isSwitchedOn?: boolean; // MainPhrase5to8를 위한 prop
}

export const Lightbulb: React.FC<LightbulbProps> = ({
  top,
  left,
  size,
  bulbOpacity,
  isSwitchedOn,
}) => {
  // scrollYProgress를 사용하는지 (MainPhrase1to4) 여부 확인
  const hasScrollAnimation = bulbOpacity !== undefined;

  // 전구 이미지의 on/off 상태 정의
  const imgVariants = {
    on: {
      filter: 'brightness(1.8) drop-shadow(0 0 15px rgba(255, 223, 128, 0.8))',
    },
    off: {
      filter: 'brightness(0.6)',
    },
  };

  return (
    <motion.div
      className="absolute"
      style={{
        top,
        left,
        width: size,
        height: size,
        // 스크롤 애니메이션이 있으면 MotionValue를 직접 사용
        opacity: hasScrollAnimation ? bulbOpacity : undefined,
      }}
      // 스크롤 애니메이션이 없을 때만 (MainPhrase5to8) 초기/애니메이션 상태를 적용
      initial={!hasScrollAnimation ? { opacity: 0, scale: 1 } : false}
      animate={!hasScrollAnimation ? {
        opacity: isSwitchedOn ? 1 : 0,
      } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* 1. 전구 뒤에서 빛나는 효과 (glow) */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,223,128,0.8) 0%, rgba(255,223,128,0) 70%)',
        }}
        animate={{
          opacity: isSwitchedOn ? 1 : 0,
          scale: isSwitchedOn ? 1.5 : 0,
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />

      {/* 2. 전구 이미지 자체의 밝기 조절 */}
      <motion.img
        src="/images/aboutMe/mainPhrase/light.png"
        alt="light bulb"
        className="relative w-full h-full"
        initial="off"
        animate={isSwitchedOn ? 'on' : 'off'}
        variants={imgVariants}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};