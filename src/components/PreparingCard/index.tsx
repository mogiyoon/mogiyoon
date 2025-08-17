import React from 'react';
import { useTranslation } from 'react-i18next';

export interface PreparingProjectData {
    id: string;
    title: string; // 이 title은 이제 번역 키가 됩니다.
    subtitle: string;
}

interface PreparingCardProps {
    project: PreparingProjectData;
    className?: string;
}

const PreparingCard: React.FC<PreparingCardProps> = ({ project, className }) => {
    // 기본 네임스페이스인 'common'을 사용합니다.
    const { t } = useTranslation('prepareProjects');

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://placehold.co/300x300/cccccc/333333?text=Image+Not+Found";
    };

    return (
        <div className={`block ${className || ''}`}>
            <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden flex flex-col aspect-[9/16] border-2 border-dashed border-gray-300">
                <div className="relative w-full aspect-square p-4">
                    <img
                        src={`https://placehold.co/300x300/e2e8f0/9ca3af?text=Coming+Soon`}
                        // alt 속성도 번역 처리합니다.
                        alt={`${t(project.title)} Thumbnail`}
                        className="w-full aspect-square object-cover rounded-lg filter grayscale"
                        onError={handleImageError}
                    />
                </div>
                <div className="px-6 pb-4 flex flex-col flex-grow overflow-y-auto">
                    <h3 className="text-2xl font-bold mb-2 truncate">
                        {/* 준비중인 프로젝트의 제목도 t 함수로 감싸줍니다. */}
                        {t(project.title)}
                    </h3>
                    <p className="
                        text-gray-600 mb-2 hidden sm:block 
                        text-sm h-10 
                        md:text-base md:h-20
                        line-clamp-3
                    ">
                        {t(project.subtitle || '')}
                    </p>
                    <div className="flex flex-wrap mt-auto">
                        <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            {t('comingSoon')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreparingCard;
