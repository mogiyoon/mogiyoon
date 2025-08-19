import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

export const DeveloperIntro: React.FC = () => {
const { t } = useTranslation();
  const targetRef = useRef<HTMLDivElement | null>(null);

  return (
    <section ref={targetRef} className="relative h-[600vh]">
      <div className="sticky top-0 h-screen w-full">
        <div className='absolute inset-0 bg-gradient-to-tr from-yellow-50 via-red-50 to-orange-100 text-gray-800'>
        {/* 시작 콘텐츠 */}
        <motion.div
          className={`absolute inset-0 z-0`}
        >
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg sm:text-2xl lg:text-3xl mt-4 tracking-wide lg:tracking-wider whitespace-nowrap"> {t('developerIntro')} </p>
        </motion.div>
        </div>
      </div>
    </section>
  );
};