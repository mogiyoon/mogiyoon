// AboutSection.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer'; // 애니메이션을 위한 라이브러리
import '../../pages/homepage.css'; // 기존 CSS 파일

// 각 슬라이드(화면)를 위한 분리된 컴포넌트
// 이렇게 하면 애니메이션 관리가 매우 쉬워집니다.
const Slide: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { ref, inView } = useInView({
        threshold: 0.5, // 슬라이드가 50% 이상 보일 때 inView는 true가 됩니다.
        triggerOnce: true, // 애니메이션은 한 번만 실행됩니다.
    });

    return (
        <section
            ref={ref}
            className="h-screen w-full flex items-center justify-center relative"
        >
            <div
                // inView 상태에 따라 투명도와 위치가 변하며 애니메이션 효과를 줍니다.
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

    // 각 화면에 들어갈 내용을 배열로 정의합니다.
    const slides = [
        // Slide 1
        <div className="text-center text-lg sm:text-2xl lg:text-3xl text-gray-500 leading-relaxed tracking-wide lg:tracking-wider">
            <span className="block">{t('introLine1')}</span>
            <span className="block">{t('introLine2')}</span>
        </div>,
        // Slide 2
        <p className="text-center text-lg sm:text-2xl lg:text-3xl text-gray-500 tracking-wide lg:tracking-wider delay-2">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-black">{t('mainPhrase1')}</span>
            {t('mainPhrase2')}{" "}
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-black">{t('mainPhrase3')}</span>
            {t('mainPhrase4')}
        </p>,
        // Slide 3
        <p className="text-center text-lg sm:text-2xl lg:text-3xl text-gray-500 tracking-wide lg:tracking-wider">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-black">{t('mainPhrase5')}</span>
            {t('mainPhrase6')}{" "}
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-black">{t('mainPhrase7')}</span>
            {t('mainPhrase8')}
        </p>,
        // Slide 4
        <p className="text-lg sm:text-2xl lg:text-3xl text-gray-500 mt-4 tracking-wide lg:tracking-wider">
            {t('developerIntro')}
        </p>,
        // Slide 5
        <div className="text-center text-sm sm:text-base lg:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            <p>{t('projectIntro1')}</p>
            <p className="mt-2">{t('projectIntro2')}</p>
        </div>,
    ];

    return (
        <div className="h-screen w-full">
            {slides.map((content, index) => (
                <Slide key={index}>
                    <div className="max-w-4xl w-full mx-auto px-4">{content}</div>
                </Slide>
            ))}
        </div>
    );
};

export default AboutSection;