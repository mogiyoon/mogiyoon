import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PortfolioCard from "../../components/PortfolioCard";
import PreparingCard from "../../components/PreparingCard";
import { projects } from "../../data/projects";
import { preparingProjects } from "../../data/preparingProjects";
import { motion } from 'framer-motion'; // motion import
import { useNavigate } from 'react-router-dom';

const sectionExitAnimation = {
    opacity: 0,
    transition: { duration: 0.2 }
};

const ProjectsSection: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleCardClick = (projectId: string) => {
        setSelectedId(projectId);
        setTimeout(() => {
            navigate(`/project/${projectId}`);
        }, 300);
    };

    const cardVariants = {
        // custom: 각 카드의 고유 ID
        exit: (custom: string) => {
            // 만약 이 카드가 "선택된 카드"라면
            if (custom === selectedId) {
                // 확대되면서 사라지는 효과
                return { scale: 1.5, opacity: 0, transition: { duration: 0.3 } };
            }
            // 선택되지 않은 나머지 카드들은 그냥 사라지는 효과
            return { opacity: 0, transition: { duration: 0.2 } };
        }
    };

    return (
        <>
            {/* 첫 번째 화면: 완료된 프로젝트 섹션 */}
            <section id="projects" className="min-h-screen flex flex-col items-center justify-center pt-20">
                {/* 콘텐츠를 감싸는 컨테이너 */}
                <div className="w-full max-w-6xl p-2 md:p-4 animate-fade-in">
                    <motion.h2
                        exit={sectionExitAnimation}
                        className="text-4xl sm:text-5xl font-bold mb-8 text-center">
                        {t('projectTitle')}
                    </motion.h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                variants={cardVariants}
                                exit="exit" // 페이지 나갈 때 exit variant 실행
                                custom={project.id} // variant에 현재 카드의 id 전달
                                className="flex"
                            >
                                <PortfolioCard project={project} className="w-full" onClick={() => handleCardClick(project.id)}/>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 두 번째 화면: 준비 중인 프로젝트 섹션 */}
            <section id="preparing-projects" className="min-h-screen flex flex-col items-center justify-center pt-16">
                {/* 콘텐츠를 감싸는 컨테이너 */}
                <motion.div 
                    exit={sectionExitAnimation}
                    className="w-full max-w-6xl p-2 md:p-4 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-center">
                        {t('preparingProjectTitle')}
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