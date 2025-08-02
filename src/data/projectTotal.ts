// src/data/projectTotal.ts
import { ProjectData } from '../types';
import { LightbulbIcon } from '../assets/icons'; // 요약 아이콘으로 전구 아이콘 재사용

export const projectTotal: ProjectData = {
    id: 'all-projects-summary',
    title: '전체 프로젝트 요약',
    subtitle: '저의 모든 프로젝트를 한눈에!',
    demoGifSrc: '', // 실제 요약 GIF/이미지로 변경
    introduction: '이 카드는 제가 진행한 모든 프로젝트의 핵심 역량과 성과를 종합적으로 보여줍니다.',
    description: `저는 주체성과 창의성을 바탕으로 다양한 기술 스택을 활용하여 문제 해결에 도전하는 풀스택 개발자입니다.
    이 포트폴리오를 통해 저의 학습 과정, 기술 적용 능력, 그리고 프로젝트 완수 경험을 확인하실 수 있습니다.
    각 프로젝트는 실제 문제를 해결하기 위한 저의 노력과 성장을 담고 있습니다.`,
    features: [
        {
            name: '다양한 기술 스택',
            description: '프론트엔드와 백엔드를 아우르는 폭넓은 기술 경험을 보유하고 있습니다.',
            icon: LightbulbIcon,
        },
        {
            name: '문제 해결 능력',
            description: '복잡한 문제를 다양한 관점에서 분석하고 효과적인 해결책을 제시합니다.',
            icon: LightbulbIcon,
        }, 
        {
            name: '주체적 학습',
            description: '새로운 기술과 트렌드를 능동적으로 학습하고 프로젝트에 적용합니다.',
            icon: LightbulbIcon,
        },
    ],
    screenshots: [
        { title: 'Overview', src: 'https://placehold.co/250x400/cccccc/333333?text=Summary+Shot' },
    ],
    techStack: [
        { category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS'] },
        { category: 'Backend', items: ['Node.js', 'Express', 'Python'] },
        { category: 'Database', items: ['MongoDB', 'SQL'] },
        { category: 'Mobile', items: ['React Native'] },
    ],
    license: {
        name: 'Portfolio License',
        url: '#',
    },
};