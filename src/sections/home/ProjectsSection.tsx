import React from 'react';
import { useTranslation } from 'react-i18next';

import PortfolioCard from "../../components/PortfolioCard";
import PreparingCard from "../../components/PreparingCard"; // 새로 만든 컴포넌트 임포트
import { projects } from "../../data/projects";
import { preparingProjects } from "../../data/preparingProjects"; // 새로 만든 데이터 임포트

//TODO: 새로고침 시 다른 탭 선택되는 것 수정하기

const ProjectsSection: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full max-w-6xl flex flex-col p-2 md:p-4 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center flex-shrink-0 pt-16">
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

                <h2 className="text-3xl sm:text-4xl font-bold mt-20 mb-8 text-center flex-shrink-0">
                    {t('preparingProjectTitle')} 
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {preparingProjects.map((project) => (
                        <div key={project.id} className="flex">
                            <PreparingCard project={project} className="w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectsSection;
