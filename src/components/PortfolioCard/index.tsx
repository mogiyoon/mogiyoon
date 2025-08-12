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
        <Link to={`/project/${project.id}`} className={`block ${className || ''}`}> {/* className 적용 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                <img
                    src={project.screenshots.length > 0 ? project.screenshots[0].src : "https://placehold.co/300x200/cccccc/333333?text=Project+Image"}
                    alt={`${project.title} Thumbnail`}
                    className="w-full h-48 object-contain object-top mt-4"
                    onError={handleImageError}
                />
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-indigo-800 mb-2 truncate">
                        {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                        {project.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {project.overview.projectType}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PortfolioCard;