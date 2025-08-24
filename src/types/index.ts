import React from 'react';
// '요약'의 각 파트를 위한 타입 (글 또는 이미지)
type SummaryTextPart = { type: 'text'; content: string; };
type SummaryImagePart = { type: 'image'; src: string; alt: string; caption?: string; width?: string; ratio?: string; };
type SummaryLinkPart = { type: 'link'; label: string; href: string };
export type SummaryPart = SummaryTextPart | SummaryImagePart | SummaryLinkPart;

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
export interface DevelopmentStep { title: string; content: string; }

export interface ProjectSummary {
    id: string;
    title: string;
    subtitle: string;
    projectType: string;
    screenshots: { src: string; alt: string; }[];
    techStack: string[];
}

// '개요' 섹션을 위한 타입
export interface ProjectOverview {
  projectType?: string;        // 프로젝트 타입
  period?: string;             // 개발 기간
  introduction?: string;       // 프로젝트 소개
  features?: string;           // 주요 기능
  techStack?: string[];          // 사용 기술 스택
  architecture?: string;        // 아키텍처
  role?: string;               // 담당 역할 (예: 프론트엔드 개발, 백엔드 API 설계 등)
  implementationDetails?: string; // 구현 기능 상세 설명
  links?: {
    github?: string;           // GitHub 링크
    demo?: string;             // 배포 링크
    notion?: string;           // 기획 문서 등 기타 링크
  };
}

// 최종 프로젝트 데이터 타입
export interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  demoGifSrc: string;
  description: string;
  features: Feature[];
  screenshots: Screenshot[];
  developmentProcess?: DevelopmentStep[];
  license: {
    name: string;
    url: string;
  };

  // 확장성을 위해 수정된 부분
  overview: ProjectOverview;
  summaries: SummarySection[];
}

