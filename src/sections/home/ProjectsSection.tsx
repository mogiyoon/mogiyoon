import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import PortfolioCard from "../../components/PortfolioCard";
import PreparingCard, { type PreparingProjectData } from "../../components/PreparingCard";
import AiDevKitCard from "../../components/AiDevKitCard";
import AiDevKitModal, {
    type AiDevKitDetailItem,
    type AiDevKitModalData,
} from "../../components/AiDevKitModal";
import type { ProjectSummary } from '../../types';
import { durations } from '../../design-tokens';

const sectionExitAnimation = {
    opacity: 0,
    transition: { duration: durations.fast }
};

// ── Prefetch: 모듈 로드 시 즉시 fetch 시작 ──────────────────────
type PrefetchedLists = { projects: ProjectSummary[]; preparing: PreparingProjectData[] };
let cachedLists: PrefetchedLists | null = null;
const listsPromise = Promise.all([
    fetch('/data/projects-list.json').then(r => r.json()),
    fetch('/data/preparing-projects-list.json').then(r => r.json()),
]).then(([projects, preparing]) => {
    cachedLists = { projects, preparing };
    return cachedLists;
}).catch(console.error);

type DevKitId = 'skills' | 'mcp' | 'harness';
type DevKitCardData = AiDevKitModalData & {
    id: DevKitId;
    description: string;
};

const ProjectsSection: React.FC = () => {
    const { t } = useTranslation(['projects', 'prepareProjects']);
    const navigate = useNavigate();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedDevKitId, setSelectedDevKitId] = useState<DevKitId | null>(null);
    const [projects, setProjects] = useState<ProjectSummary[]>(cachedLists?.projects ?? []);
    const [preparingProjects, setPreparingProjects] = useState<PreparingProjectData[]>(cachedLists?.preparing ?? []);
    const [isLoading, setIsLoading] = useState(!cachedLists);

    useEffect(() => {
        if (cachedLists) return;
        listsPromise.then((data) => {
            if (data) {
                setProjects(data.projects);
                setPreparingProjects(data.preparing);
            }
            setIsLoading(false);
        });
    }, []);

    const handleCardClick = (projectId: string) => {
        setSelectedId(projectId);
        setTimeout(() => {
            navigate(`/project/${projectId}`);
        }, 300);
    };

    const cardVariants = {
        exit: (custom: string) => {
            if (custom === selectedId) {
                return { scale: 1.5, opacity: 0, transition: { duration: 0.3 } };
            }
            return { opacity: 0, transition: { duration: 0.2 } };
        }
    };

    const skillsCardItems = t('aiDevKit.skills.detail.cardItems', {
        ns: 'projects',
        returnObjects: true,
    }) as AiDevKitDetailItem[];
    const skillsOrchestratorItems = t('aiDevKit.skills.detail.orchestratorItems', {
        ns: 'projects',
        returnObjects: true,
    }) as AiDevKitDetailItem[];
    const skillsTriggerItems = t('aiDevKit.skills.detail.triggerItems', {
        ns: 'projects',
        returnObjects: true,
    }) as AiDevKitDetailItem[];
    const skillsPatternItems = t('aiDevKit.skills.detail.patternItems', {
        ns: 'projects',
        returnObjects: true,
    }) as AiDevKitDetailItem[];
    const skillsPrincipleItems = t('aiDevKit.skills.detail.principleItems', {
        ns: 'projects',
        returnObjects: true,
    }) as AiDevKitDetailItem[];
    const skillsOutputItems = t('aiDevKit.skills.detail.outputItems', {
        ns: 'projects',
        returnObjects: true,
    }) as AiDevKitDetailItem[];
    const mcpServersItems = t('aiDevKit.mcp.detail.serversItems', {
        ns: 'projects',
        returnObjects: true,
    }) as AiDevKitDetailItem[];
    const harnessPatternItems = t('aiDevKit.harness.detail.patternsItems', {
        ns: 'projects',
        returnObjects: true,
    }) as AiDevKitDetailItem[];
    const harnessAbstractItems = t('aiDevKit.harness.detail.abstractItems', {
        ns: 'projects',
        returnObjects: true,
    }) as AiDevKitDetailItem[];

    const closeLabel = t('aiDevKit.modal.close', { ns: 'projects' });

    const devKitItems: DevKitCardData[] = [
        {
            id: 'skills',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
            ),
            title: t('aiDevKit.skills.title', { ns: 'projects' }),
            description: t('aiDevKit.skills.description', { ns: 'projects' }),
            eyebrow: t('aiDevKit.skills.detail.eyebrow', { ns: 'projects' }),
            summary: t('aiDevKit.skills.detail.summary', { ns: 'projects' }),
            closeLabel,
            sections: [
                {
                    title: t('aiDevKit.skills.detail.cardTitle', { ns: 'projects' }),
                    description: t('aiDevKit.skills.detail.cardDescription', { ns: 'projects' }),
                    items: skillsCardItems,
                },
                {
                    title: t('aiDevKit.skills.detail.orchestratorTitle', { ns: 'projects' }),
                    description: t('aiDevKit.skills.detail.orchestratorDescription', { ns: 'projects' }),
                    items: skillsOrchestratorItems,
                },
                {
                    title: t('aiDevKit.skills.detail.triggerTitle', { ns: 'projects' }),
                    description: t('aiDevKit.skills.detail.triggerDescription', { ns: 'projects' }),
                    items: skillsTriggerItems,
                },
                {
                    title: t('aiDevKit.skills.detail.patternTitle', { ns: 'projects' }),
                    description: t('aiDevKit.skills.detail.patternDescription', { ns: 'projects' }),
                    items: skillsPatternItems,
                },
                {
                    title: t('aiDevKit.skills.detail.principleTitle', { ns: 'projects' }),
                    description: t('aiDevKit.skills.detail.principleDescription', { ns: 'projects' }),
                    items: skillsPrincipleItems,
                },
                {
                    title: t('aiDevKit.skills.detail.outputTitle', { ns: 'projects' }),
                    description: t('aiDevKit.skills.detail.outputDescription', { ns: 'projects' }),
                    items: skillsOutputItems,
                },
            ],
        },
        {
            id: 'mcp',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
            ),
            title: t('aiDevKit.mcp.title', { ns: 'projects' }),
            description: t('aiDevKit.mcp.description', { ns: 'projects' }),
            eyebrow: t('aiDevKit.mcp.detail.eyebrow', { ns: 'projects' }),
            summary: t('aiDevKit.mcp.detail.summary', { ns: 'projects' }),
            closeLabel,
            sections: [
                {
                    title: t('aiDevKit.mcp.detail.serversTitle', { ns: 'projects' }),
                    items: mcpServersItems,
                },
            ],
        },
        {
            id: 'harness',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            ),
            title: t('aiDevKit.harness.title', { ns: 'projects' }),
            description: t('aiDevKit.harness.description', { ns: 'projects' }),
            eyebrow: t('aiDevKit.harness.detail.eyebrow', { ns: 'projects' }),
            summary: t('aiDevKit.harness.detail.summary', { ns: 'projects' }),
            closeLabel,
            sections: [
                {
                    title: t('aiDevKit.harness.detail.abstractTitle', { ns: 'projects' }),
                    description: t('aiDevKit.harness.detail.abstractDescription', { ns: 'projects' }),
                    items: harnessAbstractItems,
                    layout: 'diagram',
                },
                {
                    title: t('aiDevKit.harness.detail.patternsTitle', { ns: 'projects' }),
                    description: t('aiDevKit.harness.detail.patternsDescription', { ns: 'projects' }),
                    items: harnessPatternItems,
                    layout: 'flow',
                },
            ],
        },
    ];

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
            <section id="projects" className="min-h-screen flex flex-col items-center justify-center pt-20">
                <div className="w-full max-w-6xl p-2 md:p-4 animate-fade-in">
                    <motion.div
                        exit={sectionExitAnimation}
                        className="mb-10 text-center"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold text-content">
                            {t('projectTitle', { ns: 'projects' })}
                        </h2>
                        <div className="mt-3 mx-auto w-12 h-1 rounded-full bg-accent-600" />
                        <p className="mt-2 text-sm text-content-muted">
                            {t('projectSubtitle', { ns: 'projects' })}
                        </p>
                    </motion.div>

                    {/* AI DevKit */}
                    <div className="px-4 mb-10">
                        <div className="bg-surface-subtle border border-line rounded-modal p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-lg font-bold text-accent-700">
                                    {t('aiDevKit.title', { ns: 'projects' })}
                                </h3>
                                <span className="text-xs text-content-muted font-medium">
                                    {t('aiDevKit.subtitle', { ns: 'projects' })}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {devKitItems.map((item) => (
                                    <AiDevKitCard
                                        key={item.id}
                                        icon={item.icon}
                                        title={item.title}
                                        description={item.description}
                                        onClick={() => setSelectedDevKitId(item.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                variants={cardVariants}
                                exit="exit"
                                custom={project.id}
                                className="flex"
                            >
                                <PortfolioCard project={project as ProjectSummary} className="w-full" onClick={() => handleCardClick(project.id)}/>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="preparing-projects" className="min-h-screen flex flex-col items-center justify-center pt-16">
                <motion.div
                    exit={sectionExitAnimation}
                    className="w-full max-w-6xl p-2 md:p-4 animate-fade-in">
                    <div className="mb-10 text-center">
                        <h2 className="text-4xl sm:text-5xl font-bold text-content">
                            {t('preparingProjectTitle', { ns: 'prepareProjects' })}
                        </h2>
                        <div className="mt-3 mx-auto w-12 h-1 rounded-full bg-accent-600" />
                        <p className="mt-2 text-sm text-content-muted">
                            {t('preparingProjectSubtitle', { ns: 'projects' })}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                        {preparingProjects.map((project) => (
                            <div key={project.id} className="flex">
                                <PreparingCard project={project} className="w-full" />
                            </div>
                        ))}
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
