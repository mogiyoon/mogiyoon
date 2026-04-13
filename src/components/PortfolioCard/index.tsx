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
                            <div className="p-4">
                                <img
                                    src={project.screenshots.length > 0 ? project.screenshots[0].src : "https://placehold.co/300x300/cccccc/333333?text=Project+Image"}
                                    alt={`${t(project.title || '')} Thumbnail`}
                                    className="w-full aspect-square object-contain rounded-[3rem]"
                                    onError={handleImageError}
                                />
                            </div>
                        <div className="px-6 pb-4 flex flex-col flex-grow overflow-y-auto">
                            <h3 className="text-2xl font-bold mb-2 truncate">
                                {t(project.title || '')}
                            </h3>
                            <p className="
                                text-slate-700 mb-2
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
                            {project.claudeInfo && (
                                <div
                                    className="
                                        pointer-events-none select-none
                                        absolute top-3 right-3
                                        flex items-center gap-1.5
                                        pl-2 pr-2.5 py-1
                                        rounded-full
                                        border border-white/40
                                        bg-gradient-to-r from-indigo-500/20 via-violet-500/15 to-indigo-400/20
                                        backdrop-blur-md
                                        shadow-[0_0_12px_rgba(99,102,241,0.3),inset_0_1px_0_rgba(255,255,255,0.4)]
                                    "
                                    aria-hidden
                                >
                                    {/* sparkle icon */}
                                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2L13.5 9.5L20 8L14.5 12L20 16L13.5 14.5L12 22L10.5 14.5L4 16L9.5 12L4 8L10.5 9.5L12 2Z" fill="url(#vibe-sparkle)" />
                                        <defs>
                                            <linearGradient id="vibe-sparkle" x1="4" y1="2" x2="20" y2="22">
                                                <stop stopColor="#818cf8" />
                                                <stop offset="1" stopColor="#a78bfa" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <span
                                        className="
                                            text-[10px] font-bold tracking-wide
                                            bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-500
                                            bg-clip-text text-transparent
                                        "
                                    >
                                        Vibe
                                    </span>
                                    {/* secondary sparkle dot */}
                                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-violet-400 opacity-80" />
                                </div>
                            )}
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
                        <div className="bg-slate-800 text-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6 w-full h-full">
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