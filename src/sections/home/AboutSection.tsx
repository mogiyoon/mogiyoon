import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../pages/homepage.css'

const AboutSection: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="max-w-4xl w-full mx-auto text-center">
            <div className="text-lg sm:text-2xl lg:text-3xl text-gray-500 mb-8 leading-relaxed tracking-wide lg:tracking-wider">
                <span className="block fade-in-text delay-1">{t('introLine1')}</span>
                <span className="block fade-in-text delay-2">{t('introLine2')}</span>
            </div>
            <div className="mb-12">
                {/* 자간을 추가하고 강조 텍스트 색상을 더 밝게 변경했습니다. */}
                <p className="text-lg sm:text-2xl lg:text-3xl text-gray-500 tracking-wide lg:tracking-wider fade-in-text delay-3">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-black">{t('mainPhrase1')}</span>
                    {t('mainPhrase2')}{" "}
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-black">{t('mainPhrase3')}</span>
                    {t('mainPhrase4')}{" "}
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-black">{t('mainPhrase5')}</span>
                    {t('mainPhrase6')}{" "}
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-black">{t('mainPhrase7')}</span>
                    {t('mainPhrase8')}{" "}
                </p>
                {/* 자간을 추가하고 위쪽 여백(mt-4)을 조금 더 주었습니다. */}
                <p className="text-lg sm:text-2xl lg:text-3xl text-gray-500 mt-4 tracking-wide lg:tracking-wider fade-in-text delay-4">
                    {t('developerIntro')}
                </p>
            </div>
            {/* 하단 설명 텍스트의 색상과 크기를 가독성을 위해 미세 조정했습니다. */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto fade-in-text delay-5">
                {t('projectIntro1')}
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mt-2 fade-in-text delay-6">
                {t('projectIntro2')}
            </p>
        </div>
    );
};

export default AboutSection;
