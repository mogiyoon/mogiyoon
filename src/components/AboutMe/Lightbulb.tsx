// Lightbulb.tsx
import { motion } from 'framer-motion';

interface LightbulbProps {
  top: string;
  left: string;
  size: number;
  /** 표시 트리거 — 스크롤 임계점 통과 시(또는 콘텐츠 노출 시) true 로 latch */
  bulbShown?: boolean;
  /** 스위치 씬(MainPhrase5to8)에서만 사용 */
  isSwitchedOn?: boolean;
}

export const Lightbulb: React.FC<LightbulbProps> = ({
  top,
  left,
  size,
  bulbShown,
  isSwitchedOn,
}) => {
  // 스위치 씬: 콘텐츠가 노출되고(bulbShown) 스위치가 켜졌을 때만 보임
  // 스크롤 씬(isSwitchedOn 미지정): 임계점 통과(bulbShown) 시 보임
  const visible =
    isSwitchedOn !== undefined ? bulbShown !== false && isSwitchedOn : !!bulbShown;

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
      style={{ top, left, width: size, height: size }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
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
