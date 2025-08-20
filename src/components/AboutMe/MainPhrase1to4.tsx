// MainPhrase1to4.tsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BulbContainer } from './BulbContainer';

// 전구들의 위치, 크기, 애니메이션 타이밍 정보를 담은 데이터
const bulbData = [
  { id: 1, top: '20%', left: '25%', size: 80, range: [0.1, 0.12] },
  { id: 2, top: '40%', left: '70%', size: 160, range: [0.18, 0.20] },
  { id: 3, top: '65%', left: '15%', size: 140, range: [0.24, 0.26] },
  { id: 4, top: '75%', left: '80%', size: 90, range: [0.29, 0.31] },
  { id: 5, top: '10%', left: '55%', size: 70, range: [0.33, 0.35] },
  { id: 6, top: '80%', left: '50%', size: 110, range: [0.36, 0.38] },
  { id: 7, top: '90%', left: '29%', size: 75, range: [0.38, 0.40] },
  { id: 8, top: '15%', left: '90%', size: 60, range: [0.39, 0.41] },
  { id: 9, top: '30%', left: '42%', size: 110, range: [0.40, 0.42] },
  { id: 10, top: '5%', left: '15%', size: 85, range: [0.41, 0.43] },
  { id: 11, top: '58%', left: '62%', size: 68, range: [0.42, 0.43] },
  { id: 12, top: '2%', left: '73%', size: 110, range: [0.43, 0.44] },
  { id: 13, top: '80%', left: '7%', size: 55, range: [0.44, 0.45] },
  { id: 14, top: '26%', left: '67%', size: 85, range: [0.45, 0.46] },
  { id: 15, top: '50%', left: '5%', size: 90, range: [0.46, 0.47] },
] as const;

export const MainPhrase1to4: React.FC = () => {
  const { t } = useTranslation();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  const middleBackgroundOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]); // 범위를 조금 넓힘
  const endBackgroundOpacity = useTransform(scrollYProgress, [0.7, 0.8], [0, 1]); // 시작점을 뒤로 미룸

  return (
    <section ref={targetRef} className="relative h-[1600vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className='absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 text-gray-900'>
          {/* 시작 콘텐츠 */}
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg sm:text-2xl lg:text-3xl tracking-wide lg:tracking-wider whitespace-nowrap">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase1')}</span>{t('mainPhrase2')}{' '}
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase3')}</span>{t('mainPhrase4')}
          </p>
          
          {/* 중간 콘텐츠: 노을 배경 */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{
              background: `radial-gradient(ellipse at center bottom, rgba(255,165,0,0.4) 0%, rgba(255,255,0,0.2) 40%, transparent 70%),
                          linear-gradient(to top, #ff6f61 0%, #ffb347 50%, #ffe0b2 100%)`,
              opacity: middleBackgroundOpacity,
            }}
          />

          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg sm:text-2xl lg:text-3xl tracking-wide lg:tracking-wider whitespace-nowrap">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase1')}</span>{t('mainPhrase2')}{' '}
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase3')}</span>{t('mainPhrase4')}
          </p>


          {/* 중간 콘텐츠: 전구들 */}
          <div className="absolute inset-0 z-10">
            {bulbData.map((bulb) => (
              <BulbContainer
                key={bulb.id}
                scrollYProgress={scrollYProgress} // 전체 스크롤 진행률을 prop으로 전달
                bulb={bulb} // 해당 전구의 데이터를 prop으로 전달
              />
            ))}
          </div>

          {/* 끝 콘텐츠 */}
          <motion.div
            style={{ opacity: endBackgroundOpacity }}
            className='absolute inset-0 z-30 bg-gray-800 text-white'
          />
        </div>
      </div>
    </section>
  );
};