// ShootingStar.tsx

import { motion } from 'framer-motion';

interface ShootingStarProps {
  top: string;
  left: string;
  delay: number;
}

export const ShootingStar: React.FC<ShootingStarProps> = ({ top, left, delay }) => {
  const rotation = -45;

  return (
    <motion.div
      className="absolute"
      style={{ top, left, rotate: `${rotation}deg` }}
      initial={{ x: 0, y: 0, opacity: 0 }} 
      animate={{
        x: -400,
        y: 400,
        opacity: [0, 1, 0.5, 0],
      }}
      transition={{
        delay,
        duration: 0.8 + Math.random() * 0.4,
        ease: 'easeIn',
      }}
    >
      {/* 별똥별의 꼬리 */}
      <div
        className="absolute left-0 top-1/2 h-0.5 w-48 -translate-y-1/2" // left-0으로 변경
        style={{
          background: 'linear-gradient(to right, white, transparent)',
        }}
      />
      {/* 별똥별의 핵 */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_#fff,0_0_20px_#fff]" // left-0과 top-1/2, -translate-y-1/2 추가
      />
    </motion.div>
  );
};