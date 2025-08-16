// src/components/PortfolioCard/index.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // 라우터 Link 임포트
import type { ProjectData } from '../../types';

interface PortfolioCardProps {
    project: ProjectData;
    className?: string; // className prop 추가
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, className }) => {
    // 이미지 로드 실패 시 대체 이미지 URL
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://placehold.co/300x200/cccccc/333333?text=Image+Not+Found";
    };

    return (
        <Link to={`/project/${project.id}`} className={`block ${className || ''}`}>
            {/* 카드 전체 비율 9:16 유지 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col aspect-[9/16]">
                <img
                    src={project.screenshots.length > 0 ? project.screenshots[0].src : "https://placehold.co/300x300/cccccc/333333?text=Project+Image"}
                    alt={`${project.title} Thumbnail`}
                    className="w-full aspect-square object-cover p-4"
                    onError={handleImageError}
                />
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold mb-2 truncate">
                        {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow hidden sm:block">
                        {project.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                            {project.overview.projectType}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PortfolioCard;