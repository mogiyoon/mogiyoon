import React from 'react';
import { useTranslation } from 'react-i18next';

const CrazyAboutSection: React.FC = () => {
    const { t } = useTranslation();
    return <div className="animate-fade-in text-center text-xl text-gray-500">{t('crazyAbout')} (준비 중)</div>;
};

export default CrazyAboutSection;