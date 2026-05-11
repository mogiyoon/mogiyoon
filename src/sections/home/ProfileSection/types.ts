export type TabId = 'basics' | 'workSkills' | 'education' | 'awardsAndCerts';

export type HighlightItem = {
  title: string;
  problem: string;
  solution: string;
  result: string;
};

export type AiHighlightItem = {
  title: string;
  summary: string;
  context: string;
  approach: string;
  verification: string;
  impact: string;
};

export type WorkProject = { id: string; tech: string[] };
export type WorkItem = { id: string; projects: WorkProject[] };
export type EducationItem = { id: string };
export type AwardItem = { id: string };
export type CertItem = { id: string };
export type SkillGroup = { category: string; items: string[] };

export type ProfileData = {
  workExperience: WorkItem[];
  education: EducationItem[];
  awards: AwardItem[];
  certificates: CertItem[];
  skills: SkillGroup[];
};
