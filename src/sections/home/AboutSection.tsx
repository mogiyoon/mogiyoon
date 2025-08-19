import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import '../../pages/HomePage.css';
import BlockCodingSlide from '../../components/BlockCodingSlide';

// Slide 컴포넌트가 받을 props 타입을 정의
interface SlideProps {
  centeredContent?: React.ReactNode;
  absoluteContent?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ⭐️ 여기가 최종 수정된 Slide 컴포넌트입니다 ⭐️
const Slide: React.FC<SlideProps> = ({
  centeredContent,
  absoluteContent,
  className = '',
  style,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const slideClasses = `h-screen w-full flex items-center justify-center relative ${className}`;

  return (
    <section ref={ref} className={slideClasses} style={style}>
      {/* transform(translate-y) 애니메이션을 제거하여 dnd-kit과의 충돌 해결 */}
      <div
        className={`transition-opacity duration-1000 ease-out ${
          inView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {centeredContent}
      </div>
      {absoluteContent}
    </section>
  );
};

// AboutSection 컴포넌트
// AboutSection 컴포넌트
const AboutSection: React.FC = () => {
  const { t } = useTranslation();

  const slides = [
    {
      className: 'bg-slate-50 text-gray-800',
      centeredContent: ( <div className="text-center text-lg sm:text-2xl lg:text-3xl leading-relaxed tracking-wide lg:tracking-wider"> <span className="block">{t('introLine1')}</span> </div> ),
      absoluteContent: ( <div className="absolute bottom-8 right-8 lg:right-16"> <BlockCodingSlide /> </div> ),
    },
    {
      className: 'bg-slate-50 text-gray-800 relative', // Added 'relative' for positioning context
      centeredContent: (
        <div className="text-center text-lg sm:text-2xl lg:text-3xl leading-relaxed tracking-wide lg:tracking-wider">
          <span className="block">{t('introLine2')}</span>
        </div>
      ),
      absoluteContent: (
        <>
          {/* Replace these placeholder URLs with your actual image paths */}
          <img
            src="/images/aboutMe/introLine2/1.png"
            alt="Descriptive alt text for image 1"
            className="absolute top-[27%] left-[32%] transform -translate-x-1/2 -translate-y-1/2 rotate-[-20deg] opacity-100 transition-opacity duration-1000 ease-in-out border rounded-lg"
            style={{ width: '50%' }}
          />
          <img
            src="https://picsum.photos/id/50/200/300"
            alt="Descriptive alt text for image 2"
            className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2 -rotate-3 opacity-0 transition-opacity duration-1000 ease-in-out delay-500"
            style={{ width: '12%', maxWidth: '120px' }}
          />
          <img
            src="https://picsum.photos/id/60/300/220"
            alt="Descriptive alt text for image 3"
            className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 rotate-2 opacity-0 transition-opacity duration-1000 ease-in-out delay-1000"
            style={{ width: '18%', maxWidth: '180px' }}
          />
        </>
      ),
    },
    {
      className: 'bg-gradient-to-br from-blue-100 to-purple-100 text-gray-900',
      centeredContent: ( <p className="text-center text-lg sm:text-2xl lg:text-3xl tracking-wide lg:tracking-wider"> <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase1')}</span> {t('mainPhrase2')}{' '} <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase3')}</span> {t('mainPhrase4')} </p> ),
    },
    {
      className: 'bg-gray-800 text-white',
      centeredContent: ( <p className="text-center text-lg sm:text-2xl lg:text-3xl tracking-wide lg:tracking-wider"> <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase5')}</span> {t('mainPhrase6')}{' '} <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase7')}</span> {t('mainPhrase8')} </p> ),
    },
    {
      className: 'bg-gradient-to-tr from-yellow-50 via-red-50 to-orange-100 text-gray-800',
      centeredContent: ( <p className="text-lg sm:text-2xl lg:text-3xl mt-4 tracking-wide lg:tracking-wider"> {t('developerIntro')} </p> ),
    },
    {
      className: 'text-gray-700',
      style: {
        backgroundColor: '#ffffff',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
      },
      centeredContent: ( <div className="text-center text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto"> <p>{t('projectIntro1')}</p> <p className="mt-2">{t('projectIntro2')}</p> </div> ),
    },
  ];

  return (
    <div className="w-full">
      {slides.map((slide: any, index) => (
        <Slide
          key={index}
          className={slide.className}
          style={slide.style}
          centeredContent={slide.centeredContent}
          absoluteContent={slide.absoluteContent}
        />
      ))}
    </div>
  );
};

export default AboutSection;
