// DeveloperIntro.tsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Firework } from './Firework';

// 🟡 폭죽의 좌표 타입을 정의합니다.
interface FireworkPosition {
  id: number;
  top: string;
  left: string;
}

export const DeveloperIntro: React.FC = () => {
  const { t } = useTranslation();
  const targetRef = useRef<HTMLDivElement | null>(null);
  
  // 🟡 폭죽의 위치를 저장할 state를 만듭니다. (초기값은 빈 배열)
  const [fireworkPositions, setFireworkPositions] = useState<FireworkPosition[]>([]);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const fireworkTrigger = useTransform(scrollYProgress, [0.2, 0.25], [0, 1]);

  useEffect(() => {
    const unsubscribe = fireworkTrigger.onChange((latest) => {
      // 🟡 값이 1에 도달하고, 현재 폭죽이 없을 때만 실행
      if (latest === 1 && fireworkPositions.length === 0) {
        // 새로운 랜덤 좌표를 생성합니다.
        const newPositions = Array.from({ length:4 }).map((_, index) => ({
          id: index,
          // 화면 가장자리가 아닌 10% ~ 90% 사이에서 터지도록 설정
          top: `${Math.random() * 80 + 10}%`,
          left: `${Math.random() * 80 + 10}%`,
        }));

        setFireworkPositions(newPositions); // 생성된 좌표를 state에 저장

        // 1.5초 후에 폭죽을 사라지게(state를 비우게) 합니다.
        setTimeout(() => setFireworkPositions([]), 1500);
      }
    });

    return () => unsubscribe();
  }, [fireworkTrigger, fireworkPositions]); // 🟡 fireworkPositions를 의존성 배열에 추가

  return (
    <section ref={targetRef} className="relative"> {/* 🟡 스크롤 감지를 위해 높이 조절 */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className='absolute inset-0 bg-gradient-to-tr from-yellow-50 via-red-10 to-orange-100 text-gray-800 overflow-hidden'>

          {/* 🟡 state에 저장된 좌표를 기반으로 폭죽을 렌더링합니다. */}
          <div className="absolute inset-0 z-0">
            {fireworkPositions.map((pos) => (
              <Firework key={pos.id} top={pos.top} left={pos.left} />
            ))}
          </div>

          {/* 텍스트 */}
          <motion.div>
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] font-bold text-2xl sm:text-3xl lg:text-4xl mt-4 tracking-wide lg:tracking-wider whitespace-nowrap"> {t('developerIntro1')} </p>
          </motion.div>
          <motion.div>
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[0%] font-bold text-2xl sm:text-3xl lg:text-4xl mt-4 tracking-wide lg:tracking-wider whitespace-nowrap"> {t('developerIntro2')} </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};