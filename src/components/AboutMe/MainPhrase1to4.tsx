import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

export const MainPhrase1to4: React.FC = () => {
const { t } = useTranslation();
  const targetRef = useRef<HTMLDivElement | null>(null);

  return (
    <section ref={targetRef} className="relative h-[600vh]">
      <div className="sticky top-0 h-screen w-full">
        <div className='absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 text-gray-900'>
        {/* 시작 콘텐츠 */}
        <motion.div
          className={`absolute inset-0 z-0`}
        >
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg sm:text-2xl lg:text-3xl tracking-wide lg:tracking-wider whitespace-nowrap"> <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase1')}</span>{t('mainPhrase2')}{' '} <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase3')}</span>{t('mainPhrase4')} </p>        </motion.div>
        </div>
      </div>
    </section>
  );
};