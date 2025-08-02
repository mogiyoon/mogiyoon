import React, { useRef, useState, useEffect, useCallback } from 'react'; // useCallback 추가
import { useParams, Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import { projects } from '../data/projects';

// throttle 함수 정의 (외부 라이브러리 없이 직접 구현)
const throttle = (func: (...args: any[]) => void, delay: number) => {
    let throttled = false;
    return (...args: any[]) => {
        if (!throttled) {
            throttled = true;
            setTimeout(() => {
                func(...args);
                throttled = false;
            }, delay);
        }
    };
};

const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const project = projects.find(p => p.id === projectId);

    const [activeTab, setActiveTab] = useState<'introduction' | 'development'>('introduction');
    const contentRef = useRef<HTMLDivElement>(null);

    // 스크롤 감지를 위한 상태
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);

    // useCallback을 사용하여 handleScroll 함수가 불필요하게 다시 생성되는 것을 방지
    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        
        // 스크롤을 내릴 때 헤더를 숨김
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsHeaderVisible(false);
        } else { // 스크롤을 올릴 때 헤더를 표시
            setIsHeaderVisible(true);
        }
        setLastScrollY(currentScrollY);
    }, [lastScrollY]);

    // throttle을 적용한 이벤트 핸들러
    const throttledScrollHandler = throttle(handleScroll, 200);

    useEffect(() => {
        window.addEventListener('scroll', throttledScrollHandler);
        return () => window.removeEventListener('scroll', throttledScrollHandler);
    }, [throttledScrollHandler]);


    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://placehold.co/250x400/cccccc/333333?text=Image+Not+Found";
    };

    const exportPdf = async () => { /* PDF 내보내기 로직 동일 */ };

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
            <div className={`fixed top-0 left-0 right-0 z-10 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <PageHeader onExportPdf={exportPdf} />
            </div>
            
            <div className="p-4 sm:p-8 pt-24">
                <div ref={contentRef} className="portfolio-content">
                    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10 mb-12">
                        {/* 프로젝트 헤더 */}
                        <header className="text-center py-8">
                            <h1 className="text-5xl sm:text-6xl font-extrabold text-indigo-800 mb-4 rounded-lg">
                                {project.title}
                            </h1>
                            <p className="text-xl sm:text-2xl text-gray-600 font-medium">
                                {project.subtitle}
                            </p>
                        </header>

                        {/* ... (나머지 콘텐츠는 이전과 동일) ... */}

                        {/* 데모 GIF 섹션 */}
                        <section className="mb-12">
                            <p className="text-lg text-gray-700 leading-relaxed text-center mb-8">
                                {project.introduction}
                            </p>
                            <div className="flex justify-center items-center">
                                <img
                                    src={project.demoGifSrc}
                                    alt={`${project.title} App Demo`}
                                    className="w-full max-w-xs rounded-xl shadow-lg border border-gray-200"
                                    onError={handleImageError}
                                />
                            </div>
                        </section>
                        
                        <hr className="my-12 border-t-2 border-gray-200" />
                        
                        {/* 탭 메뉴 UI */}
                        {project.developmentProcess && project.developmentProcess.length > 0 && (
                            <div className="border-b border-gray-200 mb-8">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    <button
                                        onClick={() => setActiveTab('introduction')}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 ${
                                            activeTab === 'introduction'
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        앱 소개
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('development')}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 ${
                                            activeTab === 'development'
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        개발 과정
                                    </button>
                                </nav>
                            </div>
                        )}
                        
                        {/* '앱 소개' 탭 콘텐츠 */}
                        {activeTab === 'introduction' && (
                            <>
                                <section className="mb-12">
                                    <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">📖 프로젝트 소개</h2>
                                    <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">{project.description}</p>
                                </section>
                                <hr className="my-12 border-t-2 border-gray-200" />
                                <section className="mb-12">
                                    <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8 text-center">✨ 주요 기능</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {project.features.map((feature, index) => (
                                            <div key={index} className="flex items-start bg-indigo-50 p-6 rounded-xl shadow-md">
                                                <div className="w-8 h-8 text-indigo-600 flex-shrink-0"><feature.icon /></div>
                                                <div className="ml-4">
                                                    <h3 className="text-xl font-semibold text-indigo-800 mb-2">{feature.name}</h3>
                                                    <p className="text-gray-700">{feature.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                                <hr className="my-12 border-t-2 border-gray-200" />
                                <section className="mb-12">
                                    <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8 text-center">📱 스크린샷</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
                                        {project.screenshots.map((screenshot, index) => (
                                            <div key={index} className="text-center">
                                                <p className="font-semibold mb-2">{screenshot.title}</p>
                                                <img src={screenshot.src} alt={screenshot.title} className="w-full max-w-[250px] rounded-lg shadow-md border border-gray-200" onError={handleImageError} />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                                <hr className="my-12 border-t-2 border-gray-200" />
                                <section className="mb-12">
                                    <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8 text-center">🛠️ 기술 스택</h2>
                                    <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 max-w-md mx-auto">
                                        {project.techStack.map((stack, index) => (
                                            <li key={index}><span className="font-semibold">{stack.category}</span>: {stack.items.join(', ')}</li>
                                        ))}
                                    </ul>
                                </section>
                            </>
                        )}

                        {/* '개발 과정' 탭 콘텐츠 */}
                        {activeTab === 'development' && project.developmentProcess && (
                            <section className="mb-12">
                                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8 text-center">🚀 개발 과정</h2>
                                <div className="space-y-10">
                                    {project.developmentProcess.map((step, index) => (
                                        <div key={index}>
                                            <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-4">{step.title}</h3>
                                            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap ml-2">{step.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        
                        <hr className="my-12 border-t-2 border-gray-200" />
                        <section className="text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6">📜 라이선스</h2>
                            <p className="text-lg text-gray-700">
                                이 프로젝트는 <a href={project.license.url} className="text-indigo-600 hover:underline font-semibold">{project.license.name}</a> 라이선스를 따릅니다.
                            </p>
                        </section>
                    </div>
                </div>
                <footer className="max-w-4xl mx-auto text-center py-8 text-gray-500 text-sm">
                    &copy; 2025 My Portfolio. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default ProjectDetailPage;