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
            <div className="bg-surface-subtle rounded-card shadow-sm overflow-hidden flex flex-col aspect-[24/41] border-2 border-dashed border-line-strong">
                <div className="relative w-full aspect-square p-3 sm:p-4">
                    <img
                        src={`https://placehold.co/300x300/e2e8f0/9ca3af?text=Coming+Soon`}
                        // alt 속성도 번역 처리합니다.
                        alt={`${t(project.title)} Thumbnail`}
                        className="w-full aspect-square object-cover rounded-lg filter grayscale"
                        onError={handleImageError}
                    />
                </div>
                <div className="px-5 pb-4 flex flex-col flex-grow overflow-y-auto sm:px-6">
                    <h3 className="mb-2 line-clamp-2 min-h-[3.2rem] text-lg font-bold leading-tight sm:min-h-[3.6rem] sm:text-[1.35rem]">
                        {/* 준비중인 프로젝트의 제목도 t 함수로 감싸줍니다. */}
                        {t(project.title)}
                    </h3>
                    <p className="
                        mb-2 hidden min-h-[3.8rem]
                        text-sm leading-relaxed text-content-secondary
                        line-clamp-3
                        sm:block sm:text-[0.95rem]
                    ">
                        {t(project.subtitle || '')}
                    </p>
                    <div className="flex flex-wrap mt-auto">
                        <span className="bg-slate-200 text-content-strong text-xs font-medium px-2 py-0.5 rounded-full">
                            {t('comingSoon')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreparingCard;
