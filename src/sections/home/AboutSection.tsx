import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutSection: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="max-w-4xl w-full mx-auto text-center animate-fade-in">
            <div className="text-lg sm:text-2xl lg:text-3xl text-gray-600 mb-8 leading-relaxed">
                <span className="block">{t('introLine1')}</span>
                <span className="block">{t('introLine2')}</span>
            </div>
            <div className="mb-12">
                <p className="text-lg sm:text-2xl lg:text-3xl text-gray-600">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase1')}</span>
                    {t('mainPhrase2')}{" "}
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase3')}</span>
                    {t('mainPhrase4')}{" "}
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase5')}</span>
                    {t('mainPhrase6')}{" "}
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">{t('mainPhrase7')}</span>
                </p>
                <p className="text-lg sm:text-2xl lg:text-3xl text-gray-600 mt-2">
                    {t('developerIntro')}
                </p>
            </div>
            <p className="text-xs sm:text-base lg:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                {t('projectIntro1')}
            </p>
            <p className="text-xs sm:text-base lg:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto mt-2">
                {t('projectIntro2')}
            </p>
        </div>
    );
};

export default AboutSection;