// MainPhrase5to8.tsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BulbContainer } from './BulbContainer';
import { Switch } from './Switch'; // 새로 만든 스위치 컴포넌트 import

// 전구 데이터
const bulbData = [
  { id: 1, top: '20%', left: '25%', size: 80 },
  { id: 2, top: '40%', left: '70%', size: 160 },
  { id: 3, top: '65%', left: '15%', size: 140 },
  { id: 4, top: '75%', left: '80%', size: 90 },
  { id: 5, top: '10%', left: '55%', size: 70 },
  { id: 6, top: '80%', left: '50%', size: 110 },
  { id: 7, top: '90%', left: '29%', size: 75 },
  { id: 8, top: '15%', left: '90%', size: 60 },
  { id: 9, top: '30%', left: '42%', size: 110 },
  { id: 10, top: '5%', left: '15%', size: 85 },
  { id: 11, top: '58%', left: '62%', size: 68 },
  { id: 12, top: '2%', left: '73%', size: 110 },
  { id: 13, top: '80%', left: '7%', size: 55 },
  { id: 14, top: '26%', left: '67%', size: 85 },
  { id: 15, top: '50%', left: '5%', size: 90 },
] as const;

export const MainPhrase5to8: React.FC = () => {
  const { t } = useTranslation();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [isSwitchedOn, setIsSwitchedOn] = useState(false);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'center center'],
  });

  const switchOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);

  // 🟡 스위치 클릭 핸들러 수정
  const handleSwitchClick = () => {
    // 현재 상태의 반대 값으로 상태를 업데이트 (토글)
    setIsSwitchedOn(prev => !prev);
  };

  return (
    <section ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 text-white">

          <div className="absolute inset-0 z-10">
            {bulbData.map((bulb) => (
              <BulbContainer
                key={bulb.id}
                bulb={bulb}
                isSwitchedOn={isSwitchedOn}
              />
            ))}
          </div>

          <div className="relative z-20 flex h-full w-full items-center justify-center">
            <p
              className="text-center text-lg sm:text-2xl lg:text-3xl tracking-wide lg:tracking-wider whitespace-nowrap"
              style={{
                textShadow: isSwitchedOn ? '0 0 10px rgba(0, 0, 0, 1), 0 0 10px rgba(0, 0, 0, 1), 0 0 10px rgba(0, 0, 0, 1)' : 'none',
                transition: 'text-shadow 0.7s ease-in-out', // 부드러운 그림자 효과 전환
              }}
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                {t('mainPhrase5')}
              </span>
              {t('mainPhrase6')}{' '}
              <motion.span
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-yellow-300"
                animate={{ opacity: isSwitchedOn ? 1 : 0 }}
                transition={
                  isSwitchedOn
                    ? { delay: 0, duration: 0.7, ease: 'easeInOut' }
                    : { delay: 0, duration: 0.3, ease: 'easeIn' }
                }
              >
                {t('mainPhrase7')}
              </motion.span>
              {t('mainPhrase8')}
            </p>
          </div>

          <Switch
            onClick={handleSwitchClick}
            opacity={switchOpacity}
            isSwitchedOn={isSwitchedOn}
          />
        </div>
      </div>
    </section>
  );
};