import React from 'react';
import type { AiDevKitDetailSection } from '../types';
import SkillItemCard from './SkillItemCard';

interface SkillGroupsProps {
  section: AiDevKitDetailSection;
}

const SkillGroups: React.FC<SkillGroupsProps> = ({ section }) => {
  if (section.layout !== 'skill-groups' || !section.skillItems?.length) {
    return null;
  }

  return (
    <div className="space-y-5">
      {section.skillItems.map((skillItem) => (
        <SkillItemCard key={`${section.title}-${skillItem.title}`} skillItem={skillItem} />
      ))}
    </div>
  );
};

export default SkillGroups;
