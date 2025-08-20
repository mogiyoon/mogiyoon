// Firework.tsx
import { motion } from 'framer-motion';

const PARTICLE_COUNT = 30;
const COLORS = ['#FFC700', '#FF5F5F', '#5FFF5F', '#5F5FFF', '#FF5FFF'];

// ✅ delay prop 타입을 추가합니다.
interface FireworkProps {
  top: string;
  left: string;
  delay: number;
}

export const Firework: React.FC<FireworkProps> = ({ top, left, delay }) => {
  return (
    <motion.div
      className="absolute"
      style={{ top, left }}
      initial={{ opacity: 0, scale: 0.5 }} // 처음엔 안 보이고 작은 상태
      animate={{ opacity: 1, scale: 1 }}   // 나타나면서 원래 크기로
      transition={{ delay, duration: 0.2 }} // ✅ 부모에게 전달받은 delay를 여기서 적용!
    >
      {[...Array(PARTICLE_COUNT)].map((_, i) => {
        const x = (Math.random() - 0.5) * 400;
        const y = (Math.random() - 0.5) * 400;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const duration = 0.6 + Math.random() * 0.4;
        // ✅ 입자 자체의 delay는 그대로 두어, 폭죽이 나타난 후 내부 입자들이 자연스럽게 퍼지는 효과를 유지합니다.
        const particleDelay = Math.random() * 0.2;

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
              delay: particleDelay, // 이 delay는 부모의 delay 이후에 적용됩니다.
              ease: 'easeOut',
            }}
          />
        );
      })}
    </motion.div>
  );
};