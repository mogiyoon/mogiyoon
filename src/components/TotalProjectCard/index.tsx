import React from 'react';
import { Link } from 'react-router-dom'; // Link 임포트
import type { ProjectData } from '../../types';

interface TotalProjectCardProps {
    project: ProjectData;
    className?: string;
}

const TotalProjectCard: React.FC<TotalProjectCardProps> = ({ project, className }) => {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://placehold.co/400x600/cccccc/333333?text=Image+Not+Found";
    };

    return (
        // ✅ 카드 전체를 Link로 감싸줍니다.
        <Link to={`/project/${project.id}`} className={`block ${className || ''}`}>
            <div className="bg-surface rounded-card shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col md:flex-row">
                
                {/* 이미지 섹션 */}
                <img
                    src={project.screenshots.length > 0 ? project.screenshots[0].src : "https://placehold.co/400x600/cccccc/333333?text=Project+Image"}
                    alt={`${project.title} Thumbnail`}
                    className="w-full h-48 object-cover flex-shrink-0 md:w-2/5 md:h-full"
                    onError={handleImageError}
                />

                {/* 콘텐츠 섹션 */}
                <div className="w-full p-6 sm:p-8 flex flex-col flex-grow">
                    <div className="mb-6">
                        <h3 className="text-3xl font-bold text-accent-700 mb-2">
                            {project.title}
                        </h3>
                        <p className="text-content-secondary text-lg">
                            {project.subtitle}
                        </p>
                    </div>
                    <p className="text-content-secondary mb-6 leading-relaxed flex-grow">
                        {project.description}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default TotalProjectCard;