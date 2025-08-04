import React from 'react';

// '개요' 섹션을 위한 타입
export interface ProjectOverview {
  period: string;
  introduction: string;
  features: string;
  techStack: string;
}

// '요약'의 각 파트를 위한 타입 (글 또는 이미지)
type SummaryTextPart = { type: 'text'; content: string; };
type SummaryImagePart = { type: 'image'; src: string; alt: string; };
export type SummaryPart = SummaryTextPart | SummaryImagePart;

// '개요'를 제외한 '요약' 섹션 타입
export interface SummarySection {
  id: string;
  title: string;
  parts: SummaryPart[][];
}

// 아이콘, 기능, 스크린샷 등 기타 타입
export type IconType = React.FC<React.SVGProps<SVGSVGElement>>;
export interface Feature { name: string; description: string; icon: IconType; }
export interface Screenshot { title: string; src: string; }
export interface TechStack { category: string; items: string[]; }
export interface DevelopmentStep { title: string; content: string; }

// 최종 프로젝트 데이터 타입
export interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  demoGifSrc: string;
  description: string;
  features: Feature[];
  screenshots: Screenshot[];
  techStack: TechStack[];
  developmentProcess?: DevelopmentStep[];
  license: {
    name: string;
    url: string;
  };

  // 확장성을 위해 수정된 부분
  overview: ProjectOverview;
  summaries: SummarySection[];
}