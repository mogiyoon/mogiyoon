import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

export const DeveloperIntro: React.FC = () => {
const { t } = useTranslation();
  const targetRef = useRef<HTMLDivElement | null>(null);

  return (
    <section ref={targetRef} className="relative">
      <div className="sticky top-0 h-screen w-full">
        <div className='absolute inset-0 bg-gradient-to-tr from-yellow-50 via-red-10 to-orange-100 text-gray-800'>
        <motion.div
          className={`absolute inset-0 z-0`}
        >
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] font-bold text-2xl sm:text-3xl lg:text-4xl mt-4 tracking-wide lg:tracking-wider whitespace-nowrap"> {t('developerIntro1')} </p>
        </motion.div>
        <motion.div
          className={`absolute inset-0 z-0`}
        >
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[0%] font-bold text-2xl sm:text-3xl lg:text-4xl mt-4 tracking-wide lg:tracking-wider whitespace-nowrap"> {t('developerIntro2')} </p>
        </motion.div>
        </div>
      </div>
    </section>
  );
};