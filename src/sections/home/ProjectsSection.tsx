import React from 'react';
import { useTranslation } from 'react-i18next';

import PortfolioCard from "../../components/PortfolioCard";
import { projects } from "../../data/projects";

const ProjectsSection: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full max-w-6xl flex flex-col p-2 md:p-4 animate-fade-in pt-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center flex-shrink-0">
                {t('projectTitle')}
            </h2>
            <div className="flex-grow overflow-y-auto p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="flex">
                            <PortfolioCard project={project} className="w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectsSection;