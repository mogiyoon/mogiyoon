import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

import PortfolioCard from "../../components/PortfolioCard";
import PreparingCard from "../../components/PreparingCard";
import AiDevKitModal from "../../components/AiDevKitModal";
import ProjectsSidebar from "../../components/ProjectsSidebar";
import StickySectionSidebar from "../../components/StickySectionSidebar";
import { useProjectDevKitItems, type ProjectDevKitId } from '../../hooks/useProjectDevKitItems';
import { useProjectGridEntrance } from '../../hooks/useProjectGridEntrance';
import { useProjectLists } from '../../hooks/useProjectLists';
import { useToggleSet } from '../../hooks/useToggleSet';
import type { ProjectSummary } from '../../types';
import { durations } from '../../design-tokens';

const sectionExitAnimation = {
    opacity: 0,
    transition: { duration: durations.fast }
};

const ProjectsSection: React.FC = () => {
    const { t } = useTranslation(['projects', 'prepareProjects']);
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedDevKitId, setSelectedDevKitId] = useState<ProjectDevKitId | null>(null);
    const { projects, preparingProjects, isLoading } = useProjectLists();
    const devKitItems = useProjectDevKitItems();
    const location = useLocation();

    // 스킬 칩 클릭 등으로 route state 에 stackFilter 가 실려 오면 해당 스택을 선택한 채 시작
    const [initialStackFilter] = useState(
        () => (location.state as { stackFilter?: string } | null)?.stackFilter ?? null,
    );
    const selectedStacks = useToggleSet<string>(initialStackFilter ? [initialStackFilter] : undefined);

    // 뒤로가기/재마운트 시 필터가 다시 적용되지 않도록 소비한 state 는 제거
    useEffect(() => {
        if ((location.state as { stackFilter?: string } | null)?.stackFilter) {
            navigate('/', { replace: true, state: { activeTab: 'projects' } });
        }
    }, [location.state, navigate]);

    // 프로젝트들에 태그된 스택을 사용 빈도순(동률이면 이름순)으로 나열
    const stackOptions = useMemo(() => {
        const counts = new Map<string, number>();
        for (const project of projects) {
            for (const tech of project.techStack ?? []) {
                counts.set(tech, (counts.get(tech) ?? 0) + 1);
            }
        }
        return [...counts.keys()].sort((a, b) => {
            const countDiff = (counts.get(b) ?? 0) - (counts.get(a) ?? 0);
            return countDiff !== 0 ? countDiff : a.localeCompare(b);
        });
    }, [projects]);

    // 선택된 스택을 모두 포함하는 프로젝트만 노출 (선택 없으면 전체)
    const visibleProjects = useMemo(() => {
        if (selectedStacks.ids.size === 0) return projects;
        return projects.filter((project) =>
            [...selectedStacks.ids].every((stack) => project.techStack?.includes(stack)),
        );
    }, [projects, selectedStacks.ids]);

    // 필터가 없을 때만 "대표 프로젝트" 행을 분리한다. 필터 중에는 결과를 한 그리드로 보여줘야
    // 사용자가 "선택한 스택을 쓰는 프로젝트"를 한눈에 볼 수 있다.
    const isFiltering = selectedStacks.ids.size > 0;
    const featuredProjects = useMemo(
        () =>
            isFiltering
                ? []
                : projects
                      .filter((project) => typeof project.featured === 'number')
                      .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0)),
        [projects, isFiltering],
    );
    const hasFeaturedRow = featuredProjects.length > 0;
    const gridProjects = useMemo(
        () => (hasFeaturedRow ? visibleProjects.filter((project) => typeof project.featured !== 'number') : visibleProjects),
        [visibleProjects, hasFeaturedRow],
    );

    // entrance 훅에는 실제로 렌더되는 목록을 넘긴다. 전체 목록을 넘기면 필터로
    // 렌더되지 않은 카드의 ref 를 기다리느라 offsets 계산이 끝나지 않아
    // 그리드와 플립 카드가 opacity 0 인 채로 남는다.
    const {
        projectsGridRef,
        projectCardRefs,
        projectCardOffsetsReady,
        hasPlayedProjectEntrance,
        cardVariants,
    } = useProjectGridEntrance({
        projects: visibleProjects,
        selectedId,
    });

    const handleCardClick = (projectId: string) => {
        setSelectedId(projectId);
        setTimeout(() => {
            navigate(`/project/${projectId}`);
        }, 300);
    };

    const activeDevKitItem = devKitItems.find((item) => item.id === selectedDevKitId) ?? null;

    // 대표 행과 나머지 그리드가 같은 카드 마크업/애니메이션을 쓰도록 렌더러를 공유한다.
    // index 는 entrance stagger 순서이므로 대표 행 → 나머지 순으로 이어서 매긴다.
    const renderCard = (project: ProjectSummary, index: number) => (
        <motion.div
            key={project.id}
            ref={(element) => {
                projectCardRefs.current[project.id] = element;
            }}
            variants={cardVariants}
            initial={false}
            animate={hasPlayedProjectEntrance ? "animate" : "cluster"}
            exit="exit"
            custom={{ id: project.id, index }}
            className="flex"
        >
            <PortfolioCard
                project={project}
                className="w-full"
                onClick={() => handleCardClick(project.id)}
            />
        </motion.div>
    );

    if (isLoading) {
        return (
            <section className="min-h-screen flex flex-col items-center justify-center pt-20">
                <div className="w-full max-w-6xl p-4">
                    <div className="h-10 w-48 mx-auto rounded-card bg-surface-muted animate-pulse mb-8" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="aspect-[9/16] rounded-card bg-surface-muted animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section id="projects" className="min-h-screen pt-20">
                {/* pb-24: lg 미만에서 필터 플로팅 버튼(fixed bottom-5)이 마지막 카드 행을 가리지 않도록 여백 확보 */}
                <div className="mx-auto w-full max-w-7xl px-3 pt-6 pb-24 md:px-5 lg:px-8 lg:pb-6 animate-fade-in">
                    <div className="lg:grid lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(240px,320px)_minmax(0,1fr)] xl:gap-14">
                        <motion.div
                            exit={sectionExitAnimation}
                            className="mb-10 text-center lg:mb-0 lg:text-left"
                        >
                            <ProjectsSidebar
                                title={t('projectTitle', { ns: 'projects' })}
                                subtitle={t('projectSubtitle', { ns: 'projects' })}
                                projects={projects}
                                hasPlayedProjectEntrance={hasPlayedProjectEntrance}
                                devKitTitle={t('aiDevKit.title', { ns: 'projects' })}
                                devKitItems={devKitItems}
                                onSelectDevKit={setSelectedDevKitId}
                                stackFilterTitle={t('techFilter.title', { ns: 'projects' })}
                                stackFilterCloseLabel={t('techFilter.close', { ns: 'projects' })}
                                stackSearchPlaceholder={t('techFilter.searchPlaceholder', { ns: 'projects' })}
                                stackEmptyText={t('techFilter.empty', { ns: 'projects' })}
                                stacks={stackOptions}
                                selectedStacks={selectedStacks.ids}
                                onToggleStack={selectedStacks.toggle}
                                stackFilterDefaultOpen={Boolean(initialStackFilter)}
                            />
                        </motion.div>

                        <div className="min-w-0">
                            {/* entrance 훅은 이 wrapper 의 중심을 기준으로 카드 offset 을 계산하므로,
                                대표 행과 나머지 그리드를 모두 한 wrapper 안에 둔다. */}
                            <div
                                ref={projectsGridRef}
                                style={{ opacity: projectCardOffsetsReady ? 1 : 0 }}
                            >
                                {/* 대표 프로젝트는 배지 대신 배경이 구분되는 패널로 감싼다 */}
                                {hasFeaturedRow && (
                                    <section
                                        aria-labelledby="featured-projects-heading"
                                        className="mb-10 rounded-card border border-accent-100 bg-gradient-to-br from-accent-50/80 via-accent-50/40 to-surface p-4 shadow-sm sm:p-6"
                                    >
                                        <h3
                                            id="featured-projects-heading"
                                            className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent-700"
                                        >
                                            {t('featuredTitle', { ns: 'projects' })}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-3">
                                            {featuredProjects.map((project, index) => renderCard(project, index))}
                                        </div>
                                    </section>
                                )}
                                {hasFeaturedRow && gridProjects.length > 0 && (
                                    <h3
                                        id="all-projects-heading"
                                        className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-content-muted"
                                    >
                                        {t('otherProjectsTitle', { ns: 'projects' })}
                                    </h3>
                                )}
                                <div
                                    aria-labelledby={hasFeaturedRow ? 'all-projects-heading' : undefined}
                                    className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:px-0 xl:grid-cols-3"
                                >
                                    {gridProjects.map((project, index) => renderCard(project, featuredProjects.length + index))}
                                </div>
                            </div>
                            {visibleProjects.length === 0 && (
                                <p className="py-10 text-center text-sm text-content-muted">
                                    {t('techFilter.noProjects', { ns: 'projects' })}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 차기 프로젝트 섹션 — 데이터/코드는 유지하되 현재 화면에는 노출하지 않음 */}
            <section id="preparing-projects" className="hidden min-h-screen pt-16">
                <motion.div
                    exit={sectionExitAnimation}
                    className="mx-auto w-full max-w-7xl px-3 py-6 md:px-5 lg:px-8 animate-fade-in"
                >
                    <div className="lg:grid lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(240px,320px)_minmax(0,1fr)] xl:gap-14">
                        <div className="mb-10 text-center lg:mb-0 lg:text-left">
                            <StickySectionSidebar
                                title={t('preparingProjectTitle', { ns: 'prepareProjects' })}
                                subtitle={t('preparingProjectSubtitle', { ns: 'projects' })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6 p-4 md:grid-cols-3 lg:px-0 xl:grid-cols-3">
                            {preparingProjects.map((project) => (
                                <div key={project.id} className="flex">
                                    <PreparingCard project={project} className="w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            <AiDevKitModal
                item={activeDevKitItem}
                onClose={() => setSelectedDevKitId(null)}
            />
        </>
    );
};

export default ProjectsSection;
