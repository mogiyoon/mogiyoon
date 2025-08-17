import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ProjectData } from '../../types';

interface PortfolioCardProps {
    project: ProjectData;
    className?: string;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, className }) => {
    const { t } = useTranslation('projects');
    
    // 1. 카드의 뒤집힘 상태를 관리하기 위한 state 추가
    const [isFlipped, setIsFlipped] = useState(false);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://placehold.co/300x200/cccccc/333333?text=Image+Not+Found";
    };

    return (
        <Link to={`/project/${project.id}`} className={`block ${className || ''}`}>
            {/* 3D 효과를 위한 perspective 컨테이너 */}
            <div
                className="w-full aspect-[9/16]"
                style={{ perspective: '1000px' }}
                onMouseEnter={() => setIsFlipped(true)}
                onMouseLeave={() => setIsFlipped(false)}
            >
                <div
                    className="relative w-full h-full transition-transform duration-700"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                >
                    <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
                            <img
                                src={project.screenshots.length > 0 ? project.screenshots[0].src : "https://placehold.co/300x300/cccccc/333333?text=Project+Image"}
                                alt={`${t(project.title || '')} Thumbnail`}
                                className="w-full aspect-square object-cover p-4"
                                onError={handleImageError}
                            />
                            <div className="p-6 flex flex-col flex-grow overflow-y-auto">
                                <h3 className="text-2xl font-bold mb-2 truncate">
                                    {t(project.title || '')}
                                </h3>
                                <p className="
                                    text-gray-600 mb-4 hidden sm:block 
                                    text-sm h-10 
                                    md:text-base md:h-12
                                    line-clamp-2
                                ">
                                    {t(project.subtitle || '')}
                                </p>
                                <div className="flex flex-wrap mt-auto">
                                    <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                        {t(project.overview.projectType || '')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="absolute w-full h-full"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        <div className="bg-gray-400 text-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6 w-full h-full">
                            <h4 className="text-xl font-bold mb-4">Tech Stack</h4>
                            <div className="flex flex-wrap justify-center gap-2">
                                {project.overview.techStack?.map((tech) => (
                                    <span
                                        key={tech}
                                        className="bg-indigo-500 text-white text-sm font-medium px-3 py-1 rounded-full"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PortfolioCard;