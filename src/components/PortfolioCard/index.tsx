import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 훅 임포트
import type { ProjectData } from '../../types';

interface PortfolioCardProps {
    project: ProjectData;
    className?: string;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, className }) => {
    // 'projects' 네임스페이스를 사용하도록 지정합니다.
    const { t } = useTranslation('projects');

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://placehold.co/300x200/cccccc/333333?text=Image+Not+Found";
    };

    return (
        <Link to={`/project/${project.id}`} className={`block ${className || ''}`}>
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col aspect-[9/16]">
                <img
                    src={project.screenshots.length > 0 ? project.screenshots[0].src : "https://placehold.co/300x300/cccccc/333333?text=Project+Image"}
                    // alt 속성도 번역 처리합니다.
                    alt={`${t(project.title || '')} Thumbnail`}
                    className="w-full aspect-square object-cover p-4"
                    onError={handleImageError}
                />
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold mb-2 truncate">
                        {/* 데이터의 키를 t 함수로 감싸 실제 텍스트를 불러옵니다. */}
                        {/* FIX: undefined 가능성을 대비해 fallback 추가 */}
                        {t(project.title || '')}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow hidden sm:block">
                        {/* FIX: undefined 가능성을 대비해 fallback 추가 */}
                        {t(project.subtitle || '')}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                            {/* FIX: undefined 가능성을 대비해 fallback 추가 */}
                            {t(project.overview.projectType || '')}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PortfolioCard;
