// src/types/index.ts
import React from 'react';

// 개별 기능에 대한 타입 정의
export interface Feature {
    name: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>; // SVG 아이콘 컴포넌트 타입
}

// 스크린샷 이미지에 대한 타입 정의
export interface Screenshot {
    title: string;
    src: string;
}

// 기술 스택 항목에 대한 타입 정의 (예: Core, State Management 등)
export interface TechStackItem {
    category: string;
    items: string[];
}

// 개발 과정의 각 단계를 위한 타입을 새로 정의합니다.
export interface DevelopmentStep {
  title: '문제 파악' | '접근 방식/가설' | '구현/해결' | '트러블 슈팅/회고';
  content: string; // 각 단계에 대한 상세 설명
}


// 전체 프로젝트 데이터에 대한 타입 정의
export interface ProjectData {
    id: string; // 프로젝트 고유 ID
    title: string;
    subtitle: string;
    demoGifSrc: string; // 데모 GIF 이미지 경로
    introduction: string;
    description: string;
    features: Feature[];
    screenshots: Screenshot[];
    techStack: TechStackItem[];
    license: {
        name: string;
        url: string;
    };
    developmentProcess?: DevelopmentStep[];
}