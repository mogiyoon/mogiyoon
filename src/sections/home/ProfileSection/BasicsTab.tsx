import React from 'react';
import type { ResumeProfileSourceData } from '../../../utils/resumePreview';
import ResumeProfileCard from './ResumeProfileCard';

const BasicsTab: React.FC<{
  resumeProfile: ResumeProfileSourceData | null;
  onOpenPreview: () => void;
}> = ({ resumeProfile, onOpenPreview }) => {
  if (!resumeProfile) return null;
  return (
    <div className="space-y-8">
      <ResumeProfileCard profile={resumeProfile} onOpenPreview={onOpenPreview} />
    </div>
  );
};

export default BasicsTab;
