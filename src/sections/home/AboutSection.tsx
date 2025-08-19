import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import '../../pages/HomePage.css';
import AnswerChecker from '../../components/AboutMe/AnswerChecker';

// Slide 컴포넌트가 받을 props 타입을 정의
interface SlideProps {
  centeredContent?: React.ReactNode;
  absoluteContent?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Slide: React.FC<SlideProps> = ({
  centeredContent,
  absoluteContent,
  className = '',
  style,
}) => {
  // 1. useInView에 triggerOnce: true 옵션을 다시 추가합니다.
  // 이 옵션이 컴포넌트가 화면에 한 번이라도 보이면 inView를 계속 true로 유지시킵니다.
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const [animationFinished, setAnimationFinished] = useState(false);

  // 2. useEffect에서 else 블록을 제거합니다.
  // inView가 한 번 true가 되면, animationFinished도 true가 된 후 다시는 바뀌지 않습니다.
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setAnimationFinished(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [inView]);

  // 3. 불필요해진 hasBeenVisible 관련 코드를 모두 제거하고 로직을 단순화합니다.
  const slideClasses = `h-screen w-full flex items-center justify-center relative ${className} ${
    inView ? 'is-visible' : ''
  } ${animationFinished ? 'animation-finished' : ''}`;

  return (
    <section ref={ref} className={slideClasses} style={style}>
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
const AboutSection: React.FC = () => {
  const { t } = useTranslation();

  const slides = [
    {
      className: 'bg-slate-50 text-gray-800',
      centeredContent: ( <div className="text-center text-lg sm:text-2xl lg:text-3xl leading-relaxed tracking-wide lg:tracking-wider"> <span className="block">{t('introLine1')}</span> </div> ),
    },
    {
      className: 'bg-gradient-to-br from-red-200 via-green-100 to-emerald-200 text-gray-800 relative', // Added 'relative' for positioning context
      centeredContent: (
        <div className="text-center text-lg sm:text-2xl lg:text-3xl leading-relaxed tracking-wide lg:tracking-wider">
          <span className="block">{t('introLine2')}</span>
        </div>
      ),
      absoluteContent: (
        <>
            <div className="centered-screenshot fade-in-component reveal-on-large-screen absolute top-[10%] left-[60%]">
                <AnswerChecker/>
            </div>
          <img
            src="/images/aboutMe/introLine2/1.png"
            alt="Descriptive alt text for image 1"
            className="centered-screenshot fade-in-component delay-1 absolute top-[35%] left-[37%] sm:top-[27%] sm:left-[33%] border-[1px] border-black rounded-xl shadow-[2px_2px_7px_1px_rgba(0,0,0,0.5)] sm:shadow-[7px_7px_7px_1px_rgba(0,0,0,0.5)] w-[70%] sm:w-[55%] lg:w-[40%]"
          />
          <img
            src="/images/aboutMe/introLine2/2.png"
            alt="Descriptive alt text for image 2"
            className="centered-screenshot fade-in-component delay-2 absolute top-[63%] left-[65%] sm:top-[67%] sm:left-[68%] border-[1px] border-black rounded-xl shadow-[2px_2px_7px_1px_rgba(0,0,0,0.5)] sm:shadow-[7px_7px_7px_1px_rgba(0,0,0,0.5)] w-[50%] sm:w-[40%] lg:w-[30%]"
          />
          <img
            src="/images/aboutMe/introLine2/3.png"
            alt="Descriptive alt text for image 3"
            className="centered-screenshot fade-in-component delay-3 absolute top-[76%] left-[37%] sm:top-[81%] sm:left-[25%] border-[1px] border-black rounded-sm md:rounded-md shadow-[2px_2px_7px_1px_rgba(0,0,0,0.5)] sm:shadow-[5px_5px_5px_1px_rgba(0,0,0,0.5)]  w-[50%] sm:w-[40%] lg:w-[30%]"
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
      {slides.map((slide: SlideProps, index) => (
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
