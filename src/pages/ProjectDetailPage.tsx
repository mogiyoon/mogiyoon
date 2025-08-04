import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import { projects } from '../data/projects';
import TotalSummaryComponent from '../components/TotalSummaryComponent';
import ProjectDetailComponent from '../components/DetailComponent';

const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const project = projects.find(p => p.id === projectId);

    type TabType = 'summary' | 'details';
    const [activeTab, setActiveTab] = useState<TabType>('summary'); 
    const contentRef = useRef<HTMLDivElement>(null);

    const [headerTranslate, setHeaderTranslate] = useState(0);
    const lastScrollY = useRef(0); // ✅ state 대신 ref를 사용하여 불필요한 리렌더링 방지
    const HEADER_HEIGHT = 80;

    // ✅ 1. 스크롤 이벤트 처리를 위한 useEffect
    // 이 효과는 컴포넌트가 처음 마운트될 때 한 번만 실행됩니다.
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY.current;
            
            if (currentScrollY <= 0) {
                setHeaderTranslate(0);
                lastScrollY.current = 0;
                return;
            }

            // 헤더의 Y 위치를 이전 위치에서 스크롤 변화량만큼 빼서 업데이트합니다.
            setHeaderTranslate(prevTranslate => {
                const newTranslate = prevTranslate - delta;
                // 헤더가 화면 위로 완전히 사라지거나 원래 위치보다 아래로 내려가지 않도록 제한합니다.
                return Math.max(-HEADER_HEIGHT, Math.min(0, newTranslate));
            });

            lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0;
        };
        
        // 탭 종류와 상관없이 스크롤 이벤트 리스너를 항상 추가합니다.
        window.addEventListener('scroll', handleScroll, { passive: true });

        // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
        return () => window.removeEventListener('scroll', handleScroll);
    }, []); // 의존성 배열이 비어있으므로 한 번만 실행됩니다.

    // ✅ 2. 탭 전환 처리를 위한 useEffect
    // activeTab이 변경될 때마다 실행됩니다.
    useEffect(() => {
        // 탭을 전환하면 페이지를 맨 위로 스크롤합니다.
        window.scrollTo(0, 0);
        // 헤더를 즉시 보이게 합니다.
        setHeaderTranslate(0);
        // 스크롤 위치 기록도 초기화합니다.
        lastScrollY.current = 0;
    }, [activeTab]);


    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://placehold.co/250x400/cccccc/333333?text=Image+Not+Found";
    };

    const exportPdf = async () => {
        if (activeTab !== 'details') {
            alert("'상세 설명' 탭의 내용만 PDF로 내보낼 수 있습니다.");
            return;
        }
        const containerToPrint = contentRef.current;
        if (!containerToPrint) {
            console.error("PDF export failed: Content area not found.");
            return;
        }
        // ... (PDF 내보내기 로직)
    };

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
                <div className="text-center p-8 bg-white shadow-xl rounded-2xl">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">프로젝트를 찾을 수 없습니다.</h1>
                    <p className="text-lg text-gray-700 mb-6">올바른 URL인지 확인해주세요.</p>
                    <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                        메인 페이지로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
            <div style={{ transform: `translateY(${headerTranslate}px)`, transition: 'transform 0.1s linear' }} className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
                <PageHeader onExportPdf={exportPdf} />
            </div>
            <div className="p-4 sm:p-8 pt-24">
                <div ref={contentRef} className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10 mb-12">
                    {/* 프로젝트 헤더 */}
                    <header className="text-center pt-8 pb-4">
                        <h1 className="text-5xl sm:text-6xl font-extrabold text-indigo-800 mb-4">
                            {project.title}
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-600 font-medium">
                            {project.subtitle}
                        </p>
                    </header>
                    
                    <section className="my-8">
                        <div className="flex justify-center items-center">
                            <img src={project.demoGifSrc} alt={`${project.title} App Demo`} className="w-full max-w-xs rounded-xl shadow-lg border border-gray-200" onError={handleImageError} />
                        </div>
                    </section>
                    
                    <hr className="my-12 border-t-2 border-gray-200" />

                    {/* 탭 메뉴 UI */}
                    <div className="border-b border-gray-200 mb-8">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button 
                                onClick={() => setActiveTab('summary')} 
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${
                                    activeTab === 'summary'
                                    ? 'border-indigo-500 text-indigo-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                요약
                            </button>
                            <button 
                                onClick={() => setActiveTab('details')} 
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${
                                    activeTab === 'details'
                                    ? 'border-indigo-500 text-indigo-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                상세 설명
                            </button>
                        </nav>
                    </div>
                    
                    { activeTab === 'summary' 
                        ? <TotalSummaryComponent project={project}/> 
                        : <ProjectDetailComponent project={project} /> 
                    }

                    <hr className="my-12 border-t-2 border-gray-200" />
                    <section className="text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6">📜 라이선스</h2>
                        <p className="text-lg text-gray-700">
                            이 프로젝트는 <a href={project.license.url} className="text-indigo-600 hover:underline font-semibold">{project.license.name}</a> 라이선스를 따릅니다.
                        </p>
                    </section>
                </div>
                <footer className="max-w-4xl mx-auto text-center py-8 text-gray-500 text-sm">
                    &copy; 2025 My Portfolio. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default ProjectDetailPage;
