import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

export const MainPhrase5to8: React.FC = () => {
const { t } = useTranslation();
  const targetRef = useRef<HTMLDivElement | null>(null);

  return (
    <section ref={targetRef} className="relative h-[600vh]">
      <div className="sticky top-0 h-screen w-full">
        <div className='absolute inset-0 bg-gray-800 text-white'>
        {/* 시작 콘텐츠 */}
        <motion.div
          className={`absolute inset-0 z-0`}
        >
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg sm:text-2xl lg:text-3xl tracking-wide lg:tracking-wider whitespace-nowrap"><span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase5')}</span>{t('mainPhrase6')}{' '} <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase7')}</span>{t('mainPhrase8')} </p>
        </motion.div>
        </div>
      </div>
    </section>
  );
};