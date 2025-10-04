import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProjectSummary } from '../../types';

interface PortfolioCardProps {
    project: ProjectSummary;
    className?: string;
    onClick: () => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, className, onClick }) => {
    const { t } = useTranslation('projects');

    // 1. 카드의 뒤집힘 상태를 관리하기 위한 state 추가
    const [isFlipped, setIsFlipped] = useState(false);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://placehold.co/300x200/cccccc/333333?text=Image+Not+Found";
    };

    const handleCardClick = () => {
        onClick();
        setIsFlipped(false);
    }

    return (
        <div onClick={handleCardClick} className={`block cursor-pointer ${className || ''}`}>
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
                                className="w-full aspect-square object-contain p-4"
                                onError={handleImageError}
                            />
                        <div className="px-6 pb-4 flex flex-col flex-grow overflow-y-auto">
                            <h3 className="text-2xl font-bold mb-2 truncate">
                                {t(project.title || '')}
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
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                    {t(project.projectType || '')}
                                </span>
                            </div>
                        </div>
                            {project.stickerText && (
                                <div
                                className={`
                                    pointer-events-none select-none
                                    absolute bottom-4 right-4
                                    w-8 h-8
                                    flex items-center justify-center
                                    rounded-full shadow-lg
                                    bg-gradient-to-br from-amber-300 via-yellow-300 to-amber-500
                                    `}
                                aria-hidden
                                >
                                {/* 하이라이트(광택) */}
                                    <span
                                        className="
                                            absolute -top-1 -left-1 w-10 h-10 rounded-full
                                            bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.7),rgba(255,255,255,0)_60%)]
                                        "
                                    />

                                    <div className="flex flex-col items-center justify-center leading-none">
                                        <span className="text-white font-extrabold [text-shadow:0_0_1px_#000,0.5px_0.5px_0.5px_#000]" >
                                        {project.stickerText}
                                        </span>
                                    </div>

                                    {/* 리본 꼬리 (좌/우) */}
                                    <span
                                    className="
                                        absolute -bottom-1.5 left-1.5 w-2.5 h-3
                                        [clip-path:polygon(0%_0%,100%_0%,50%_100%)]
                                        rotate-[-90deg]
                                        bg-gradient-to-l from-red-400 via-red-500 to-red-700  
                                    "
                                    />
                                    <span
                                    className="
                                        absolute -bottom-1.5 right-1.5 w-2.5 h-3
                                        [clip-path:polygon(0%_0%,100%_0%,50%_100%)]
                                        rotate-[90deg]
                                        bg-gradient-to-r from-red-400 via-red-500 to-red-700
                                    "
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className="absolute w-full h-full"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        <div className="bg-gray-400 text-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6 w-full h-full">
                            <h4 className="text-xl font-bold mb-4">Tech Stack</h4>
                            <div className="flex flex-wrap justify-center gap-2">
                                {project.techStack?.map((tech) => (
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
        </div>
    );
};

export default PortfolioCard;