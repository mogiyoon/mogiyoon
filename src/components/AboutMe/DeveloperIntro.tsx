// DeveloperIntro.tsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShootingStar } from './ShootingStart';

interface FireworkPosition {
  id: number;
  top: string;
  left: string;
}

export const DeveloperIntro: React.FC = () => {
  const { t } = useTranslation();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [fireworkPositions, setFireworkPositions] = useState<FireworkPosition[]>([]);

  // ✅ 1. 여기에 원하는 폭죽 개수를 설정합니다.
  const fireworkCount = 8;
  const fireworkInterval = 0.3; // 터지는 간격 (초)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const fireworkTrigger = useTransform(scrollYProgress, [0.2, 0.25], [0, 1]);

  useEffect(() => {
    const unsubscribe = fireworkTrigger.onChange((latest) => {
      if (latest === 1 && fireworkPositions.length === 0) {
        const newPositions = Array.from({ length: fireworkCount }).map((_, index) => ({
          id: index,
          top: `${Math.random() * 80 + 10}%`,
          left: `${Math.random() * 80 + 10}%`,
        }));

        setFireworkPositions(newPositions);

        // ✅ 2. 폭죽 개수와 간격에 따라 사라지는 시간을 자동으로 계산합니다.
        const lastFireworkTime = (fireworkCount - 1) * fireworkInterval * 1000;
        const animationClearanceTime = 1500; // 마지막 폭죽 애니메이션 시간 + 여유
        const totalTimeout = lastFireworkTime + animationClearanceTime;
        
        // 8개일 경우: (7 * 0.3 * 1000) + 1500 = 2100 + 1500 = 3600ms (3.6초)
        setTimeout(() => setFireworkPositions([]), totalTimeout);
      }
    });

    return () => unsubscribe();
  }, [fireworkTrigger, fireworkPositions]);

  return (
    <section ref={targetRef} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className='absolute inset-0 bg-gradient-to-b from-gray-800 from-20% via-blue-900 via-80% to-orange-700 text-white overflow-hidden'>
          <div className="absolute inset-0 z-0">
            {fireworkPositions.map((pos, index) => (
              <ShootingStar
                key={pos.id}
                top={pos.top}
                left={pos.left}
                delay={index * fireworkInterval}
              />
            ))}
          </div>

          {/* 텍스트 */}
          <motion.div>
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] font-bold text-2xl sm:text-3xl lg:text-4xl mt-4 tracking-wide lg:tracking-wider whitespace-nowrap"> {t('developerIntro')} </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};