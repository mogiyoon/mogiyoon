import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { PROJECT_CARD_EASE } from '../hooks/useProjectGridEntrance';
import type { ProjectDevKitCardData, ProjectDevKitId } from '../hooks/useProjectDevKitItems';
import type { ProjectSummary } from '../types';
import AiDevKitCard from './AiDevKitCard';
import ProjectFlipPreviewCard from './ProjectFlipPreviewCard';
import StickySectionSidebar from './StickySectionSidebar';

const AiDevKitSkeleton: React.FC = () => (
    <div className="rounded-card bg-surface p-4 shadow-lg sm:p-5">
        <div className="mb-4">
            <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
            <div className="mt-2 h-6 w-32 rounded bg-slate-200 animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="aspect-square rounded-lg bg-slate-200 animate-pulse"
                />
            ))}
        </div>
    </div>
);

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
    // 카드 entrance 가 끝나기 전엔 비워두고, 카드가 자리잡은 직후부터 AI DevKit
    // 실제 등장까지의 ~1초 공백을 skeleton 으로 메운다 (모바일에서 갑자기 등장하는 문제 완화).
    const showSkeleton = hasPlayedProjectEntrance && !showAiDevKit;

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
                <AnimatePresence mode="wait">
                    {showAiDevKit ? (
                        <motion.div
                            key="real"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, ease: PROJECT_CARD_EASE }}
                        >
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
                        </motion.div>
                    ) : showSkeleton ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <AiDevKitSkeleton />
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </StickySectionSidebar>
    );
};

export default ProjectsSidebar;
