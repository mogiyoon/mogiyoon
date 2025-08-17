import React from 'react';
import { useTranslation } from 'react-i18next';

import PortfolioCard from "../../components/PortfolioCard";
import PreparingCard from "../../components/PreparingCard";
import { projects } from "../../data/projects";
import { preparingProjects } from "../../data/preparingProjects";

const ProjectsSection: React.FC = () => {
    const { t } = useTranslation();
    return (
        // 컴포넌트의 최상위를 React Fragment 또는 div로 감싸줍니다.
        <>
            {/* 첫 번째 화면: 완료된 프로젝트 섹션 */}
            <section id="projects" className="min-h-screen flex flex-col items-center justify-center pt-20">
                {/* 콘텐츠를 감싸는 컨테이너 */}
                <div className="w-full max-w-6xl p-2 md:p-4 animate-fade-in">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
                        {t('projectTitle')}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                        {projects.map((project) => (
                            <div key={project.id} className="flex">
                                <PortfolioCard project={project} className="w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 두 번째 화면: 준비 중인 프로젝트 섹션 */}
            <section id="preparing-projects" className="min-h-screen flex flex-col items-center justify-center pt-16">
                {/* 콘텐츠를 감싸는 컨테이너 */}
                <div className="w-full max-w-6xl p-2 md:p-4 animate-fade-in">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
                        {t('preparingProjectTitle')}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                        {preparingProjects.map((project) => (
                            <div key={project.id} className="flex">
                                <PreparingCard project={project} className="w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProjectsSection;