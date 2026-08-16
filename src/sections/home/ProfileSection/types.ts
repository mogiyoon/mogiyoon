export type TabId = 'basics' | 'workSkills' | 'education' | 'awardsAndCerts';

export type HighlightItem = {
  title: string;
  problem: string;
  analysis?: string;
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
export type SkillGroup = {
  category: string;
  items: string[];
  /** 주력 스택 — 그룹 내 맨 앞 배치 + accent 톤으로 강조 표시 */
  primary?: string[];
  /** 이력서 프리뷰에서만 대체 표기할 항목 목록 (예: AWS 세부 서비스 병기) */
  resumeItems?: string[];
};

export type ProfileData = {
  workExperience: WorkItem[];
  education: EducationItem[];
  awards: AwardItem[];
  certificates: CertItem[];
  skills: SkillGroup[];
};
