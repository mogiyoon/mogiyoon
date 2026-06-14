// MainPhrase5to8.tsx
import { motion, useScroll } from 'framer-motion';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BulbContainer } from './BulbContainer';
import { Switch } from './Switch'; // 새로 만든 스위치 컴포넌트 import
import { useScrollThreshold } from './useScrollThreshold';

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

  // 섹션 끝 감지용 — 섹션 전체(start start ~ end end) 기준
  const { scrollYProgress: sectionFullProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // 스크롤 임계점 기준 양방향 — 콘텐츠 노출 / 스위치 숨김 (위로 올리면 역재생)
  const contentShown = useScrollThreshold(scrollYProgress, 0.4);
  const switchHidden = useScrollThreshold(sectionFullProgress, 0.85);
  const switchVisible = contentShown && !switchHidden;

  // 🟡 스위치 클릭 핸들러 수정
  const handleSwitchClick = () => {
    // 현재 상태의 반대 값으로 상태를 업데이트 (토글)
    setIsSwitchedOn(prev => !prev);
  };

  return (
    <section ref={targetRef} className="relative h-[250vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-slate-800 text-white">

          <div className="absolute inset-0 z-10">
            {bulbData.map((bulb) => (
              <BulbContainer
                key={bulb.id}
                bulb={bulb}
                isSwitchedOn={isSwitchedOn}
                contentShown={contentShown}
              />
            ))}
          </div>

          <motion.div
            className={`absolute inset-0 z-20`}
            initial={{ opacity: 0 }}
            animate={{ opacity: contentShown ? 1 : 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="relative z-20 flex h-full w-full items-center justify-center">
              <p
                className="text-center text-xl sm:text-2xl lg:text-3xl tracking-widest whitespace-nowrap"
                style={{
                  textShadow: isSwitchedOn ? '0 0 10px rgba(0, 0, 0, 1), 0 0 10px rgba(0, 0, 0, 1), 0 0 10px rgba(0, 0, 0, 1)' : 'none',
                  transition: 'text-shadow 0.7s ease-in-out',
                }}
              >
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                  {t('mainPhrase5')}
                </span>
                <span className="font-thin">{t('mainPhrase6')}</span>{' '}
                <motion.span
                  className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-yellow-300"
                  animate={{ opacity: isSwitchedOn ? 1 : 0 }}
                  transition={
                    isSwitchedOn
                      ? { delay: 0, duration: 0.5, ease: 'easeInOut' }
                      : { delay: 0, duration: 0.1, ease: 'easeIn' }
                  }
                >
                  {t('mainPhrase7')}
                </motion.span>
                <span className="font-thin">{t('mainPhrase8')}</span>
              </p>
            </div>
          </motion.div>

          <Switch
            onClick={handleSwitchClick}
            visible={switchVisible}
            isSwitchedOn={isSwitchedOn}
          />
        </div>
      </div>
    </section>
  );
};