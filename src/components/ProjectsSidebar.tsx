import React from 'react';
import { motion } from 'framer-motion';

import { PROJECT_CARD_EASE } from '../hooks/useProjectGridEntrance';
import type { ProjectDevKitCardData, ProjectDevKitId } from '../hooks/useProjectDevKitItems';
import { useMediaQuery } from '../hooks/useMediaQuery';
import type { ProjectSummary } from '../types';
import AiDevKitCard from './AiDevKitCard';
import ProjectFlipPreviewCard from './ProjectFlipPreviewCard';
import StickySectionSidebar from './StickySectionSidebar';

interface ProjectsSidebarProps {
    title: string;
    subtitle: string;
    projects: ProjectSummary[];
    hasPlayedProjectEntrance: boolean;
    showAiDevKit: boolean;
    devKitTitle: string;
    devKitItems: ProjectDevKitCardData[];
    onSelectDevKit: (id: ProjectDevKitId) => void;
}

const ProjectsSidebar: React.FC<ProjectsSidebarProps> = ({
    title,
    subtitle,
    projects,
    hasPlayedProjectEntrance,
    showAiDevKit,
    devKitTitle,
    devKitItems,
    onSelectDevKit,
}) => {
    // Tailwind `lg` (1024px) 기준. 데스크톱은 카드 entrance 후 AI DevKit 이 blur+scale 로
    // 등장하지만, 모바일은 처음부터 마운트해 애니메이션 없이 노출 (피드백 반영).
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const devKitCardBlock = (
        <div className="rounded-card bg-surface p-4 shadow-lg sm:p-5">
            <div className="mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-content-muted">
                    AI Layer
                </span>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                    <h3 className="text-lg font-bold text-title">
                        {devKitTitle}
                    </h3>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
                {devKitItems.map((item) => (
                    <AiDevKitCard
                        key={item.id}
                        icon={item.icon}
                        title={item.title}
                        description={item.description}
                        onClick={() => onSelectDevKit(item.id)}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <StickySectionSidebar title={title} subtitle={subtitle}>
            {projects.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={hasPlayedProjectEntrance ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                    transition={{ duration: 0.45, ease: PROJECT_CARD_EASE }}
                >
                    <ProjectFlipPreviewCard projects={projects} />
                </motion.div>
            )}

            {isDesktop ? (
                // 데스크톱: 카드 entrance 후 blur+scale 등장
                showAiDevKit && (
                    <motion.div
                        initial={{ opacity: 0, y: 36, scale: 0.98, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.55, ease: PROJECT_CARD_EASE }}
                        className={projects.length > 0 ? "mt-8" : undefined}
                    >
                        {devKitCardBlock}
                    </motion.div>
                )
            ) : (
                // 모바일: 처음부터 마운트, 애니메이션 없음
                <div className={projects.length > 0 ? "mt-8" : undefined}>
                    {devKitCardBlock}
                </div>
            )}
        </StickySectionSidebar>
    );
};

export default ProjectsSidebar;
