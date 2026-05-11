import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { animation } from '../../../design-tokens';
import type { SkillGroup } from './types';

const SkillsBlock: React.FC<{ data: SkillGroup[] }> = ({ data }) => {
  const { t } = useTranslation('introduction');

  return (
    <div className="divide-y divide-slate-100">
      {data.map((group) => (
        <div key={group.category} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
          <span className="shrink-0 w-24 pt-0.5 text-sm font-semibold uppercase tracking-widest text-content-muted">
            {t(`skills.${group.category}`, { defaultValue: group.category })}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <motion.span
                key={item}
                whileHover={{ y: -2 }}
                transition={animation.chipHover.transition}
                className="inline-flex items-center rounded-full border border-line bg-surface-subtle px-3 py-1 text-sm font-medium text-content-secondary cursor-default"
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsBlock;
