import React from 'react';
import { motion } from 'framer-motion';

import { PROJECT_CARD_EASE } from '../hooks/useProjectGridEntrance';
import type { ProjectDevKitCardData, ProjectDevKitId } from '../hooks/useProjectDevKitItems';
import type { ProjectSummary } from '../types';
import AiDevKitCard from './AiDevKitCard';
import ProjectFlipPreviewCard from './ProjectFlipPreviewCard';
import StickySectionSidebar from './StickySectionSidebar';
import TechStackFilterCard from './TechStackFilterCard';

interface ProjectsSidebarProps {
    title: string;
    subtitle: string;
    projects: ProjectSummary[];
    hasPlayedProjectEntrance: boolean;
    devKitTitle: string;
    devKitItems: ProjectDevKitCardData[];
    onSelectDevKit: (id: ProjectDevKitId) => void;
    stackFilterTitle: string;
    stackSearchPlaceholder: string;
    stackEmptyText: string;
    stacks: string[];
    selectedStacks: Set<string>;
    onToggleStack: (stack: string) => void;
    stackFilterDefaultOpen?: boolean;
}

const ProjectsSidebar: React.FC<ProjectsSidebarProps> = ({
    title,
    subtitle,
    projects,
    hasPlayedProjectEntrance,
    devKitTitle,
    devKitItems,
    onSelectDevKit,
    stackFilterTitle,
    stackSearchPlaceholder,
    stackEmptyText,
    stacks,
    selectedStacks,
    onToggleStack,
    stackFilterDefaultOpen = false,
}) => {
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

    // 사이드바 도구 카드 묶음 (기술 스택 필터 아코디언 + AI DevKit) — 애니메이션 없이 즉시 노출
    const toolCardsBlock = (
        <>
            {stacks.length > 0 && (
                <div className="mb-8">
                    <TechStackFilterCard
                        title={stackFilterTitle}
                        searchPlaceholder={stackSearchPlaceholder}
                        emptyText={stackEmptyText}
                        stacks={stacks}
                        selectedStacks={selectedStacks}
                        onToggleStack={onToggleStack}
                        defaultOpen={stackFilterDefaultOpen}
                    />
                </div>
            )}
            {devKitCardBlock}
        </>
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

            <div className={projects.length > 0 ? "mt-8" : undefined}>
                {toolCardsBlock}
            </div>
        </StickySectionSidebar>
    );
};

export default ProjectsSidebar;
