import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ProfileData } from './types';
import SkillsBlock from './SkillsBlock';
import WorkBlock from './WorkBlock';

const WorkSkillsTab: React.FC<{ data: ProfileData }> = ({ data }) => {
  const { t: tCommon } = useTranslation('common');

  return (
    <div className="space-y-8">
      {/* Skills */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-content-muted">
            {tCommon('info.skills')}
          </p>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <div className="rounded-3xl border border-line bg-surface/80 p-6 shadow-sm backdrop-blur">
          <SkillsBlock data={data.skills} />
        </div>
      </div>

      {/* Work experience */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-content-muted">
            {tCommon('info.workExperience')}
          </p>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <WorkBlock data={data.workExperience} />
      </div>
    </div>
  );
};

export default WorkSkillsTab;
