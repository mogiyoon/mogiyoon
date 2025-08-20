// Firework.tsx
import { motion } from 'framer-motion';

// 폭죽 입자의 개수
const PARTICLE_COUNT = 30;
// 폭죽 색상 팔레트
const COLORS = ['#FFC700', '#FF5F5F', '#5FFF5F', '#5F5FFF', '#FF5FFF'];

interface FireworkProps {
  top: string;
  left: string;
}

export const Firework: React.FC<FireworkProps> = ({ top, left }) => {
  return (
    <div className="absolute" style={{ top, left }}>
      {[...Array(PARTICLE_COUNT)].map((_, i) => {
        // 각 입자의 최종 위치, 색상, 애니메이션 시간을 랜덤으로 설정
        const x = (Math.random() - 0.5) * 400; // 수평으로 퍼지는 거리
        const y = (Math.random() - 0.5) * 400; // 수직으로 퍼지는 거리
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const duration = 0.4 + Math.random() * 0.4; // 0.4초 ~ 0.8초
        const delay = Math.random() * 0.2; // 0초 ~ 0.2초

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: color,
              width: 8,
              height: 8,
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
            }}
            animate={{
              x: x,
              y: y,
              opacity: 0,
            }}
            transition={{
              duration,
              delay,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
};