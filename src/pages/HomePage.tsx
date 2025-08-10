import React, { useEffect, useRef, useState } from 'react';
import PortfolioCard from '../components/PortfolioCard';
import { projects } from '../data/projects';
import './HomePage.css';

const HomePage: React.FC = () => {
    // 각 섹션을 참조하기 위한 ref
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const infoSectionRef = useRef<HTMLDivElement>(null);
    const projectsSectionRef = useRef<HTMLDivElement>(null);

    // 각 섹션의 노출 여부를 저장하는 상태
    const [isInfoVisible, setInfoVisible] = useState(false);
    const [isProjectsVisible, setProjectsVisible] = useState(false);

    // 연락처 및 링크 정보
    const personalInfo = {
        email: 'mogiyoon@gmail.com',
        github: 'https://github.com/mogiyoon',
        blog: 'https://velog.io/@mogiyoon/posts',
    };

    // 스크롤 위치 저장/복원 로직
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const savedSectionIndex = sessionStorage.getItem('homeScrollSectionIndex');
        if (savedSectionIndex) {
            const index = parseInt(savedSectionIndex, 10);
            container.scrollTo({ top: index * container.clientHeight, behavior: 'auto' });
        }
        
        const handleScroll = () => {
            if (!container) return;
            const currentSectionIndex = Math.round(container.scrollTop / container.clientHeight);
            sessionStorage.setItem('homeScrollSectionIndex', currentSectionIndex.toString());
        };
        
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer 로직
    useEffect(() => {
        const createObserver = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
            return new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        setter(true);
                    }
                },
                { root: scrollContainerRef.current, threshold: 0.2 }
            );
        };

        const infoObserver = createObserver(setInfoVisible);
        const projectsObserver = createObserver(setProjectsVisible);

        const currentInfoRef = infoSectionRef.current;
        const currentProjectsRef = projectsSectionRef.current;

        if (currentInfoRef) infoObserver.observe(currentInfoRef);
        if (currentProjectsRef) projectsObserver.observe(currentProjectsRef);

        return () => {
            if (currentInfoRef) infoObserver.unobserve(currentInfoRef);
            if (currentProjectsRef) projectsObserver.unobserve(currentProjectsRef);
        };
    }, []);

    return (
        <div ref={scrollContainerRef}>
            {/* --- 자기소개 섹션 --- */}
            <section >
                <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-xl sm:text-2xl text-gray-600 font-medium mb-8 fade-in-text delay-1">
                            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-800 leading-tight">주체성</span>과 <span className="text-3xl sm:text-4xl font-extrabold text-indigo-800 leading-tight">창의성</span>을 바탕으로 <span className="text-3xl sm:text-4xl font-extrabold text-indigo-800 leading-tight">도전</span>하는
                        </p>
                        <p className="text-xl sm:text-2xl text-gray-600 font-medium mb-6 fade-in-text delay-2">
                            풀스택 개발자 <span className="font-bold">노기윤</span>입니다.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mb-2 fade-in-text delay-3">
                            전직 초등교사로서 다양한 도메인에 대해 열린 태도로 학습하고 융합하는 것을 선호합니다.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mt-12 fade-in-text delay-4">
                            이곳은 제가 열정을 담아 개발한 프로젝트들을 소개하는 공간입니다.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed max-w-2xl fade-in-text delay-5">
                            각 프로젝트를 통해 저의 기술 스택과 문제 해결 능력을 확인해 보세요!
                        </p>
                    </div>
                </div>
            </section>

            {/* --- 나의 프로젝트 섹션 --- */}
            <section className={` ${isProjectsVisible ? 'section-is-visible' : ''}`}>
                <div ref={projectsSectionRef} className="min-h-screen flex items-center justify-center p-4 sm:p-8">
                    <div className="my-projects-box content-to-animate w-full h-full max-w-6xl bg-white shadow-xl rounded-2xl flex flex-col p-6 md:p-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8 text-center flex-shrink-0">
                            Project
                        </h2>
                        <div className="flex-grow overflow-y-auto p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {projects.map((project) => (
                                    <div key={project.id}>
                                        <PortfolioCard project={project} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 개인 정보 섹션 --- */}
            <section className={`info-section ${isInfoVisible ? 'section-is-visible' : ''}`}>
                <div ref={infoSectionRef} className="min-h-screen flex items-center justify-center p-4 sm:p-8">
                    <div className="info-content-box content-to-animate w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 md:p-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-10 text-center">
                            Contact
                        </h2>
                        <div className="flex flex-col gap-6 text-lg">
                            {/* Email */}
                            <a href={`mailto:${personalInfo.email}`} className="flex items-center p-4 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                <div className="w-8 h-8 mr-4 text-indigo-500 flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                {/* 👇 이 div에 min-w-0 클래스 추가 */}
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-800">Email</p>
                                    <p className="text-gray-600 break-words">{personalInfo.email}</p>
                                </div>
                            </a>
                            {/* GitHub */}
                            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                <div className="w-8 h-8 mr-4 text-indigo-500 flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                    </svg>
                                </div>
                                {/* 👇 이 div에 min-w-0 클래스 추가 */}
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-800">GitHub</p>
                                    <p className="text-gray-600 break-words">{personalInfo.github}</p>
                                </div>
                            </a>
                            {/* Blog */}
                            <a href={personalInfo.blog} target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                <div className="w-8 h-8 mr-4 text-indigo-500 flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 19.5v-.75a7.5 7.5 0 0 0-7.5-7.5H4.5m0-6.75h.75c7.5 0 13.5 6 13.5 13.5v.75M6 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                </div>
                                {/* 👇 이 div에 min-w-0 클래스 추가 */}
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-800">Blog</p>
                                    <p className="text-gray-600 break-words">{personalInfo.blog}</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <footer className="text-center pb-8 text-gray-500 text-sm">
                    &copy; 2025 My Portfolio. All rights reserved.
                </footer>
            </section>
        </div>        
    );
};

export default HomePage;