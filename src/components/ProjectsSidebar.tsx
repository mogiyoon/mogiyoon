import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { PROJECT_CARD_EASE } from '../hooks/useProjectGridEntrance';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { collapseVerticalPreset } from '../utils/motionPresets';
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
    // 기술 스택 필터가 펼쳐진 동안에는 데스크톱(lg, 사이드바가 sticky 인 레이아웃)에서
    // 플립 프리뷰 카드를 접는다. 필터 칩 목록까지 편 사이드바가 뷰포트보다 길어져
    // 하단 카드가 잘리는 것을 막고, 필터에 집중하게 한다. 작은 화면(세로 적층)은 그대로 둔다.
    const [isStackFilterOpen, setIsStackFilterOpen] = useState(stackFilterDefaultOpen);
    const isDesktop = useMediaQuery('(min-width: 1024px)'); // Tailwind lg
    const showFlipPreview = projects.length > 0 && !(isDesktop && isStackFilterOpen);
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
                        onOpenChange={setIsStackFilterOpen}
                    />
                </div>
            )}
            {devKitCardBlock}
        </>
    );

    return (
        <StickySectionSidebar title={title} subtitle={subtitle}>
            <AnimatePresence initial={false}>
                {showFlipPreview && (
                    <motion.div key="flip-preview" {...collapseVerticalPreset()}>
                        {/* 카드-필터 간격(pb-8)은 컬랩스 컨테이너 안에 둬야 높이와 함께 접힌다 */}
                        <div className="pb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={hasPlayedProjectEntrance ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                                transition={{ duration: 0.45, ease: PROJECT_CARD_EASE }}
                            >
                                <ProjectFlipPreviewCard projects={projects} />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div>
                {toolCardsBlock}
            </div>
        </StickySectionSidebar>
    );
};

export default ProjectsSidebar;
