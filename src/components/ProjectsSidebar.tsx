import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { PROJECT_CARD_EASE } from '../hooks/useProjectGridEntrance';
import { useDisclosure } from '../hooks/useDisclosure';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { collapseVerticalPreset } from '../utils/motionPresets';
import type { ProjectDevKitCardData, ProjectDevKitId } from '../hooks/useProjectDevKitItems';
import type { ProjectSummary } from '../types';
import AiDevKitCard from './AiDevKitCard';
import ModalShell from './primitives/ModalShell';
import ProjectFlipPreviewCard from './ProjectFlipPreviewCard';
import StickySectionSidebar from './StickySectionSidebar';
import TechStackFilterCard, { TechStackFilterPanel } from './TechStackFilterCard';

interface ProjectsSidebarProps {
    title: string;
    subtitle: string;
    projects: ProjectSummary[];
    hasPlayedProjectEntrance: boolean;
    devKitTitle: string;
    devKitItems: ProjectDevKitCardData[];
    onSelectDevKit: (id: ProjectDevKitId) => void;
    stackFilterTitle: string;
    stackFilterCloseLabel: string;
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
    stackFilterCloseLabel,
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

    // 작은 화면(lg 미만, 사이드바가 세로 적층되는 레이아웃)에서는 아코디언 카드 대신
    // 우하단 플로팅 버튼 + 모달로 필터를 제공한다 (이력서 편집 버튼과 동일 패턴).
    const {
        isOpen: isMobileFilterOpen,
        open: openMobileFilter,
        close: closeMobileFilter,
    } = useDisclosure(false);
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
    // 필터 아코디언 카드는 데스크톱(lg+) 전용. lg 미만은 아래 플로팅 버튼 + 모달로 대체
    const toolCardsBlock = (
        <>
            {stacks.length > 0 && (
                <div className="mb-8 hidden lg:block">
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
        <>
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

            {/* 작은 화면 전용 필터 플로팅 버튼 (이력서 편집 버튼과 동일 패턴) */}
            {stacks.length > 0 && (
                <button
                    type="button"
                    onClick={openMobileFilter}
                    className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-xl lg:hidden"
                >
                    <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                    </svg>
                    {stackFilterTitle}
                    {selectedStacks.size > 0 && (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1.5 text-xs font-bold leading-none">
                            {selectedStacks.size}
                        </span>
                    )}
                </button>
            )}

            <ModalShell
                isOpen={isMobileFilterOpen}
                onClose={closeMobileFilter}
                backdropClassName="lg:hidden"
                className="fixed inset-x-3 bottom-3 mx-auto flex max-h-[75vh] max-w-xl flex-col overflow-hidden p-4"
                ariaLabelledBy="mobile-stack-filter-title"
            >
                <div className="flex shrink-0 items-center justify-between">
                    <h2 id="mobile-stack-filter-title" className="text-lg font-bold text-title">
                        {stackFilterTitle}
                    </h2>
                    <button
                        type="button"
                        onClick={closeMobileFilter}
                        aria-label={stackFilterCloseLabel}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-content-muted"
                    >
                        <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <TechStackFilterPanel
                    searchPlaceholder={stackSearchPlaceholder}
                    emptyText={stackEmptyText}
                    stacks={stacks}
                    selectedStacks={selectedStacks}
                    onToggleStack={onToggleStack}
                    listMaxHeightClassName="max-h-[50vh]"
                />
            </ModalShell>
        </>
    );
};

export default ProjectsSidebar;
