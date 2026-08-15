import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { animation } from '../../../design-tokens';
import { useProjectLists } from '../../../hooks/useProjectLists';
import type { SkillGroup } from './types';

const CHIP_BASE_CLASS =
  'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium';

const CHIP_TONE_CLASSES = {
  // 주력 스택 강조
  primary: 'border-transparent bg-accent-100 text-accent-700',
  default: 'border-line bg-surface-subtle text-content-secondary',
};

const SkillsBlock: React.FC<{ data: SkillGroup[] }> = ({ data }) => {
  const { t } = useTranslation('introduction');
  const navigate = useNavigate();
  const { projects } = useProjectLists();

  // 프로젝트에 태그된 스택과 이름이 일치하는 칩만 클릭 시 프로젝트 필터로 연결
  const projectStacks = useMemo(
    () => new Set(projects.flatMap((project) => project.techStack ?? [])),
    [projects],
  );

  return (
    <div className="divide-y divide-slate-100">
      {data.map((group) => (
        <div key={group.category} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
          <span className="shrink-0 w-24 pt-0.5 text-sm font-semibold uppercase tracking-widest text-content-muted">
            {t(`skills.${group.category}`, { defaultValue: group.category })}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((item) => {
              const tone = group.primary?.includes(item)
                ? CHIP_TONE_CLASSES.primary
                : CHIP_TONE_CLASSES.default;

              if (projectStacks.has(item)) {
                return (
                  <motion.button
                    key={item}
                    type="button"
                    whileHover={{ y: -2 }}
                    transition={animation.chipHover.transition}
                    onClick={() =>
                      navigate('/', { state: { activeTab: 'projects', stackFilter: item } })
                    }
                    className={`${CHIP_BASE_CLASS} ${tone} cursor-pointer`}
                  >
                    {item}
                  </motion.button>
                );
              }

              return (
                <motion.span
                  key={item}
                  whileHover={{ y: -2 }}
                  transition={animation.chipHover.transition}
                  className={`${CHIP_BASE_CLASS} ${tone} cursor-default`}
                >
                  {item}
                </motion.span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsBlock;
