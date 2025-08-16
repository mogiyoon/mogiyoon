// src/components/PreparingCard/index.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

// 준비 중인 프로젝트 데이터 타입을 정의합니다.
export interface PreparingProjectData {
    id: number;
    title: string;
}

interface PreparingCardProps {
    project: PreparingProjectData;
    className?: string;
}

const PreparingCard: React.FC<PreparingCardProps> = ({ project, className }) => {
    const { t } = useTranslation();

    // 이미지 로드 실패 시 대체 이미지 URL
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://placehold.co/300x300/cccccc/333333?text=Image+Not+Found";
    };

    return (
        <div className={`block ${className || ''}`}>
            {/* 카드 전체 비율 9:16 유지, 비활성화된 느낌을 주기 위해 스타일 조정 */}
            <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden flex flex-col aspect-[9/16] border-2 border-dashed border-gray-300">
                {/* 이미지 영역 */}
                <div className="relative w-full aspect-square p-4">
                    <img
                        src={`https://placehold.co/300x300/e2e8f0/9ca3af?text=Coming+Soon`}
                        alt={`${project.title} Thumbnail`}
                        className="w-full h-full object-cover rounded-lg filter grayscale" // 그레이스케일 필터로 비활성 느낌 강조
                        onError={handleImageError}
                    />
                </div>
                {/* 컨텐츠 영역 */}
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2 truncate text-gray-600">
                        {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-auto">
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
