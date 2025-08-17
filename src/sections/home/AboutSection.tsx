// AboutSection.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer'; // 애니메이션을 위한 라이브러리
import '../../pages/homepage.css'; // 기존 CSS 파일

const Slide: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '', // className prop을 받도록 추가하고 기본값 설정
}) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  // 기본 클래스와 props로 받은 className을 합쳐줍니다.
  const slideClasses = `h-screen w-full flex items-center justify-center relative ${className}`;

  return (
    <section ref={ref} className={slideClasses}>
      <div
        className={`transition-all duration-1000 ease-out ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {children}
      </div>
    </section>
  );
};

const AboutSection: React.FC = () => {
  const { t } = useTranslation();

  // 👇 여기가 핵심! 데이터 구조를 객체 배열로 변경합니다.
  const slides = [
    {
      className: 'bg-slate-50 text-gray-800',
      content: (
        <div className="text-center text-lg sm:text-2xl lg:text-3xl leading-relaxed tracking-wide lg:tracking-wider">
          <span className="block">{t('introLine1')}</span>
        </div>
      ),
    },
    {
      className: 'bg-slate-50 text-gray-800',
      content: (
        <div className="text-center text-lg sm:text-2xl lg:text-3xl leading-relaxed tracking-wide lg:tracking-wider">
          <span className="block">{t('introLine2')}</span>
        </div>
      ),
    },
    {
      className: 'bg-gradient-to-br from-blue-100 to-purple-100 text-gray-900',
      content: (
        <p className="text-center text-lg sm:text-2xl lg:text-3xl tracking-wide lg:tracking-wider">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase1')}</span>
          {t('mainPhrase2')}{' '}
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase3')}</span>
          {t('mainPhrase4')}
        </p>
      ),
    },
    {
      className: 'bg-gray-800 text-white',
      content: (
        <p className="text-center text-lg sm:text-2xl lg:text-3xl tracking-wide lg:tracking-wider">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase5')}</span>
          {t('mainPhrase6')}{' '}
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase7')}</span>
          {t('mainPhrase8')}
        </p>
      ),
    },
    {
      className: 'bg-gradient-to-tr from-yellow-50 via-red-50 to-orange-100 text-gray-800',
      content: (
        <p className="text-lg sm:text-2xl lg:text-3xl mt-4 tracking-wide lg:tracking-wider">
          {t('developerIntro')}
        </p>
      ),
    },
    {
      // Tailwind CSS로 패턴을 직접 만들기 어려울 때 유용합니다.
      className: 'text-gray-700',
      style: {
        backgroundColor: '#ffffff',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
      },
      content: (
        <div className="text-center text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
          <p>{t('projectIntro1')}</p>
          <p className="mt-2">{t('projectIntro2')}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      {slides.map((slide, index) => (
        // 👇 Slide 컴포넌트에 className과 style을 전달합니다.
        <Slide key={index} className={slide.className} style={slide.style}>
          <div className="max-w-4xl w-full mx-auto px-4">{slide.content}</div>
        </Slide>
      ))}
    </div>
  );
};

export default AboutSection;