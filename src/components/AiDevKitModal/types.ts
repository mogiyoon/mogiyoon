import type { ReactNode } from 'react';

export interface AiDevKitFlowLoop {
  fromStep: number;
  toStep: number;
  label?: string;
  topStartStep?: number;
  topEndStep?: number;
  bottomStep?: number;
  bottomLabel?: string;
}

export interface AiDevKitStepDetail {
  actor?: string;
  action?: string;
  input?: string;
  output?: string;
}

export interface AiDevKitDetailGroup {
  title: string;
  points: string[];
}

export interface AiDevKitCodeSample {
  title: string;
  description?: string;
  language?: string;
  code: string;
}

export interface AiDevKitGroupedDetailSection {
  title: string;
  description?: string;
  items?: AiDevKitDetailItem[];
  steps?: string[];
  layout?: 'cards' | 'flow';
}

export interface AiDevKitSkillItem {
  title: string;
  description?: string;
  chips?: string[];
  sections: AiDevKitGroupedDetailSection[];
}

export interface AiDevKitDetailItem {
  title: string;
  description?: string;
  chips?: string[];
  steps?: string[];
  stepDetails?: AiDevKitStepDetail[];
  loops?: AiDevKitFlowLoop[];
  iconKey?: string;
  groups?: AiDevKitDetailGroup[];
  samples?: AiDevKitCodeSample[];
}

export interface AiDevKitDetailSection {
  title: string;
  description?: string;
  items?: AiDevKitDetailItem[];
  skillItems?: AiDevKitSkillItem[];
  steps?: string[];
  layout?: 'cards' | 'diagram' | 'flow' | 'skill-groups';
}

export interface AiDevKitModalData {
  icon: ReactNode;
  title: string;
  eyebrow: string;
  summary: string;
  closeLabel: string;
  sections: AiDevKitDetailSection[];
}
