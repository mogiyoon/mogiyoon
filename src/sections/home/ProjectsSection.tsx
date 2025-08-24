import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import PortfolioCard from "../../components/PortfolioCard";
import PreparingCard, { type PreparingProjectData } from "../../components/PreparingCard";
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