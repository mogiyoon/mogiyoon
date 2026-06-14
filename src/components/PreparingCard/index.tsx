import React from 'react';
import { useTranslation } from 'react-i18next';

import { createImageFallbackHandler } from '../../utils/imageFallback';
import {
    PLACEHOLDER_COMING_SOON_300x300,
    PLACEHOLDER_NOT_FOUND_300x300,
} from '../../utils/placeholders';
import { Chip } from '../primitives/Chip';

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

    const handleImageError = createImageFallbackHandler({
        fallbackSrc: PLACEHOLDER_NOT_FOUND_300x300,
    });

    return (
        <div className={`block ${className || ''}`}>
            <div className="bg-surface-subtle rounded-card shadow-sm overflow-hidden flex flex-col aspect-[24/48] border-2 border-dashed border-line-strong sm:aspect-[24/41]">
                <div className="relative w-full aspect-[4/3] p-3 sm:p-4">
                    <img
                        src={PLACEHOLDER_COMING_SOON_300x300}
                        // alt 속성도 번역 처리합니다.
                        alt={`${t(project.title)} Thumbnail`}
                        className="h-full w-full object-cover rounded-lg filter grayscale"
                        onError={handleImageError}
                    />
                </div>
                <div className="px-5 pb-4 flex flex-col flex-grow overflow-y-auto sm:px-6">
                    {/* div 래퍼로 flex 아이템화를 막아야 line-clamp(-webkit-box)가 blockify 되지 않음 */}
                    <div className="mb-2 min-h-[3.2rem] sm:min-h-[3.6rem]">
                        <h3 className="line-clamp-2 text-lg font-bold leading-tight sm:text-[1.35rem]">
                            {/* 준비중인 프로젝트의 제목도 t 함수로 감싸줍니다. */}
                            {t(project.title)}
                        </h3>
                    </div>
                    <div className="mb-2 hidden min-h-[3.8rem] sm:block">
                        <p className="text-sm leading-relaxed text-content-secondary line-clamp-3 sm:text-[0.95rem]">
                            {t(project.subtitle || '')}
                        </p>
                    </div>
                    <div className="flex flex-wrap mt-auto">
                        <Chip tone="neutralSoft" size="sm" weight="medium">
                            {t('comingSoon')}
                        </Chip>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreparingCard;
