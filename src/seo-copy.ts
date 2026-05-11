export type SeoLocale = 'ko' | 'en';

export const SEO_COPY = {
  ko: {
    sections: {
      about: '자기소개',
      projects: '프로젝트',
      posts: '기술 포스트',
      profile: '프로필',
      resume: '이력서',
    },
    home: {
      description: '개발자 mogiyoon의 포트폴리오. 앱·확장 프로그램·라이브러리 등 직접 만든 도구로 학습과 개발의 반복 문제를 해결합니다.',
      keywords: 'mogiyoon, 개발자, 프론트엔드, 포트폴리오, React, TypeScript, React Native, Frontend Developer',
    },
    resume: {
      description: '개발자 mogiyoon의 이력서. 경력, 프로젝트, 스킬, 학력, 수상 내역을 한 페이지에서 확인할 수 있습니다.',
      keywords: 'mogiyoon 이력서, 개발자 이력서, 프론트엔드 이력서',
    },
    projectDetail: {
      fallbackDescription: '개발자 mogiyoon이 직접 개발한 프로젝트의 개요·기능·구현 과정을 정리한 페이지입니다.',
    },
    notFound: {
      title: '프로젝트를 찾을 수 없음',
      description: '요청한 프로젝트 페이지가 존재하지 않습니다.',
    },
  },
  en: {
    sections: {
      about: 'About',
      projects: 'Projects',
      posts: 'Posts',
      profile: 'Profile',
      resume: 'Resume',
    },
    home: {
      description: 'Portfolio of mogiyoon, a developer who ships apps, browser extensions, and libraries to remove repetitive friction in learning and development.',
      keywords: 'mogiyoon, developer, frontend, portfolio, React, TypeScript, React Native, Frontend Developer',
    },
    resume: {
      description: 'Resume of developer mogiyoon — career, projects, skills, education, and awards on a single page.',
      keywords: 'mogiyoon resume, developer resume, frontend resume',
    },
    projectDetail: {
      fallbackDescription: 'Overview, features, and implementation notes for a project built by mogiyoon.',
    },
    notFound: {
      title: 'Project Not Found',
      description: 'The requested project page does not exist.',
    },
  },
} as const satisfies Record<SeoLocale, unknown>;

export const pickSeoLocale = (language: string | undefined): SeoLocale =>
  language?.startsWith('en') ? 'en' : 'ko';

export const formatSectionTitle = (section: string | undefined, locale: SeoLocale, siteName: string): string => {
  if (!section) return siteName;
  return locale === 'en' ? `${siteName}'s ${section}` : `${siteName}의 ${section}`;
};
