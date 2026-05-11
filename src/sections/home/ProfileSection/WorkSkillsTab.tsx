import React from 'react';
import type { ProfileData } from './types';
import SkillsBlock from './SkillsBlock';
import WorkBlock from './WorkBlock';

const WorkSkillsTab: React.FC<{ data: ProfileData }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Skills on top */}
      <div className="rounded-3xl border border-line bg-surface/80 p-6 shadow-sm backdrop-blur">
        <SkillsBlock data={data.skills} />
      </div>

      {/* Work experience below */}
      <WorkBlock data={data.workExperience} />
    </div>
  );
};

export default WorkSkillsTab;
