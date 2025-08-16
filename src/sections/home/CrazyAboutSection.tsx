import React from 'react';
import { useTranslation } from 'react-i18next';

// 각 항목의 데이터 (번역 키만 필요)
const crazyAboutItems = [
    { tKey: 'crazyAboutGameEditors' },
    { tKey: 'crazyAboutExcelMacros' },
    { tKey: 'crazyAboutBlockCoding' },
    { tKey: 'crazyAboutMusicComposition' },
];

const CrazyAboutSection: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="animate-fade-in text-center">
            {/* 섹션 소개 문구 */}
            <p className="mb-8 text-lg text-gray-400 max-w-2xl mx-auto">
                {t('crazyAboutIntro1')}
            </p>
            <p className="mb-16 text-lg text-gray-400 max-w-2xl mx-auto">
                {t('crazyAboutIntro2')}
            </p>

            {/* 카드들을 담을 그리드 컨테이너 */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {crazyAboutItems.map((item, index) => (
                    <div
                        key={index}
                        className="
                            relative p-8 overflow-hidden
                            bg-gray-900/50 border border-gray-800 rounded-xl
                            text-left transition-all duration-300
                            hover:border-gray-700 hover:bg-gray-900
                        "
                    >
                        {/* 배경 숫자 스타일링 */}
                        <span className="absolute -top-2 right-4 text-[6rem] font-black text-white/5 font-mono select-none">
                            {(index + 1).toString().padStart(2, '0')}
                        </span>

                        <div className="relative">
                            {/* 제목 */}
                            <h3 className="text-2xl font-bold text-gray-100 mb-2">
                                {t(item.tKey)}
                            </h3>
                            
                            {/* 준비 중 뱃지 */}
                            <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-900/50 border border-indigo-800 rounded-full">
                                {t('comingSoon')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CrazyAboutSection;