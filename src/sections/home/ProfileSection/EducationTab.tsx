import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { EducationItem } from './types';
import { itemVariants, listVariants } from './animations';

const EducationTab: React.FC<{ data: EducationItem[] }> = ({ data }) => {
  const { t } = useTranslation('introduction');

  return (
    <motion.div
      variants={listVariants}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {data.map((item) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          className="rounded-3xl border border-line bg-surface/80 p-6 shadow-sm backdrop-blur hover:shadow-md transition-shadow duration-200"
        >
          <h3 className="text-base font-bold text-content">
            {t(`education.${item.id}.title`)}
          </h3>
          <p className="mt-1 text-base text-content-meta">
            {t(`education.${item.id}.major`)}
          </p>
          <span className="mt-2 inline-block rounded-full bg-surface-muted px-2.5 py-0.5 text-sm text-content-tertiary">
            {t(`education.${item.id}.grade`)}
          </span>
          <p className="mt-4 text-sm text-content-muted">
            {t(`education.${item.id}.period`)}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EducationTab;
