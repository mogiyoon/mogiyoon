import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import PortfolioCard from "../../components/PortfolioCard";
import PreparingCard, { type PreparingProjectData } from "../../components/PreparingCard";
import AiDevKitCard from "../../components/AiDevKitCard";
import type { ProjectSummary } from '../../types';

const sectionExitAnimation = {
    opacity: 0,
    transition: { duration: 0.2 }
};

const ProjectsSection: React.FC = () => {
    const { t } = useTranslation(['projects', 'prepareProjects']);
    const navigate = useNavigate();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [preparingProjects, setPreparingProjects] = useState<PreparingProjectData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const [projectsResponse, preparingResponse] = await Promise.all([
                    fetch('/data/projects-list.json'),
                    fetch('/data/preparing-projects-list.json')
                ]);
                const projectsData = await projectsResponse.json();
                const preparingData = await preparingResponse.json();
                setProjects(projectsData);
                setPreparingProjects(preparingData);
            } catch (error) {
                console.error("Failed to fetch project lists:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLists();
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

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <>
            <section id="projects" className="min-h-screen flex flex-col items-center justify-center pt-20">
                <div className="w-full max-w-6xl p-2 md:p-4 animate-fade-in">
                    <motion.h2
                        exit={sectionExitAnimation}
                        className="text-4xl sm:text-5xl font-bold mb-8 text-center">
                        {t('projectTitle', { ns: 'projects' })}
                    </motion.h2>
                    {/* AI DevKit */}
                    <div className="px-4 mb-8">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-slate-900">
                                {t('aiDevKit.title', { ns: 'projects' })}
                            </h3>
                            <span className="text-xs text-slate-400 font-medium">
                                {t('aiDevKit.subtitle', { ns: 'projects' })}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                            <AiDevKitCard
                                icon={
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                    </svg>
                                }
                                title={t('aiDevKit.skills.title', { ns: 'projects' })}
                                description={t('aiDevKit.skills.description', { ns: 'projects' })}
                                count={3}
                                countLabel={t('aiDevKit.skills.countLabel', { ns: 'projects' })}
                            />
                            <AiDevKitCard
                                icon={
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                    </svg>
                                }
                                title={t('aiDevKit.mcp.title', { ns: 'projects' })}
                                description={t('aiDevKit.mcp.description', { ns: 'projects' })}
                                count={2}
                                countLabel={t('aiDevKit.mcp.countLabel', { ns: 'projects' })}
                            />
                            <AiDevKitCard
                                icon={
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                    </svg>
                                }
                                title={t('aiDevKit.harness.title', { ns: 'projects' })}
                                description={t('aiDevKit.harness.description', { ns: 'projects' })}
                                count={4}
                                countLabel={t('aiDevKit.harness.countLabel', { ns: 'projects' })}
                            />
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
                    <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-center">
                        {t('preparingProjectTitle', { ns: 'prepareProjects' })}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                        {preparingProjects.map((project) => (
                            <div key={project.id} className="flex">
                                <PreparingCard project={project} className="w-full" />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>
        </>
    );
};

export default ProjectsSection;