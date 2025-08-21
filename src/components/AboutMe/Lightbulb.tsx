// Lightbulb.tsx
import { motion, MotionValue, useTransform, useMotionValue } from 'framer-motion'; // ✨ useMotionValue import

interface LightbulbProps {
  top: string;
  left: string;
  size: number;
  bulbOpacity?: MotionValue<number>;
  isSwitchedOn?: boolean;
  scrollOpacity?: MotionValue<number>;
}

export const Lightbulb: React.FC<LightbulbProps> = ({
  top,
  left,
  size,
  bulbOpacity,
  isSwitchedOn,
  scrollOpacity,
}) => {
  const hasScrollAnimation = bulbOpacity !== undefined;

  // ✨ 수정 1: prop으로 받은 MotionValue가 없을 경우를 대비한 기본 MotionValue를 생성합니다.
  const defaultOpacity = useMotionValue(0);

  // ✨ 수정 2: `|| 0` 대신 `|| defaultOpacity`를 사용하여 항상 MotionValue 타입이 되도록 보장합니다.
  const sourceOpacity = scrollOpacity || bulbOpacity || defaultOpacity;

  const combinedOpacity = useTransform(sourceOpacity, (latestOpacity) => {
    return latestOpacity * (isSwitchedOn ? 1 : 0);
  });

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
        opacity: hasScrollAnimation ? bulbOpacity : combinedOpacity,
      }}
    >
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