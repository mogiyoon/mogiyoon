import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
    const {
        projectsGridRef,
        projectCardRefs,
        projectCardOffsetsReady,
        hasPlayedProjectEntrance,
        cardVariants,
    } = useProjectGridEntrance({
        projects,
        selectedId,
    });
    const devKitItems = useProjectDevKitItems();
    const selectedStacks = useToggleSet<string>();

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

    const handleCardClick = (projectId: string) => {
        setSelectedId(projectId);
        setTimeout(() => {
            navigate(`/project/${projectId}`);
        }, 300);
    };

    const activeDevKitItem = devKitItems.find((item) => item.id === selectedDevKitId) ?? null;

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
                <div className="mx-auto w-full max-w-7xl px-3 py-6 md:px-5 lg:px-8 animate-fade-in">
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
                                stackSearchPlaceholder={t('techFilter.searchPlaceholder', { ns: 'projects' })}
                                stackEmptyText={t('techFilter.empty', { ns: 'projects' })}
                                stacks={stackOptions}
                                selectedStacks={selectedStacks.ids}
                                onToggleStack={selectedStacks.toggle}
                            />
                        </motion.div>

                        <div className="min-w-0">
                            <div
                                ref={projectsGridRef}
                                className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:px-0 xl:grid-cols-3"
                                style={{ opacity: projectCardOffsetsReady ? 1 : 0 }}
                            >
                                {visibleProjects.map((project, index) => (
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
                                        <PortfolioCard project={project as ProjectSummary} className="w-full" onClick={() => handleCardClick(project.id)}/>
                                    </motion.div>
                                ))}
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
