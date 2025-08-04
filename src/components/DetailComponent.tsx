import React from 'react';

// --- 데이터 타입 정의 ---

// 주요 기능 타입
interface Feature {
    icon?: React.ElementType; // 아이콘 컴포넌트를 받을 수 있도록 설정
    name: string;
    description: string;
}

// 스크린샷 타입
interface Screenshot {
    title: string;
    src: string;
}

// 기술 스택 타입
interface TechStack {
    category: string;
    items: string[];
}

// 개발 과정 단계 타입
interface DevelopmentStep {
    title: string;
    content: string;
}

// 트러블 슈팅 항목 타입
interface TroubleshootingItem {
    problem: string;
    solution: string;
}

// 전체 프로젝트 데이터 타입
interface ProjectData {
    // 요약 정보
    summary_overview: string;
    summary_results: string;
    summary_retrospective: string;
    
    // 상세 정보
    description: string;
    features: Feature[];
    developmentProcess?: DevelopmentStep[];
    screenshots: Screenshot[];
    techStack: TechStack[];
    troubleshooting?: TroubleshootingItem[];
}

// 컴포넌트 Props 타입
interface ProjectDetailComponentProps {
    project: ProjectData;
}

const ProjectDetailComponent: React.FC<ProjectDetailComponentProps> = ({ project }) => {

    // 이미지 로드 실패 시 대체 이미지 처리
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://via.placeholder.com/250x150.png?text=Image+Not+Found';
    };

    return (
        <main className="max-w-5xl mx-auto p-4 sm:p-8 bg-white text-gray-800">

            {/* 1. 개요 */}
            <section className="mb-16 text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-6">
                    1. 프로젝트 개요
                </h2>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-wrap max-w-3xl mx-auto">
                    {project.summary_overview}
                </p>
            </section>

            <hr className="my-12 border-t-2 border-gray-200" />

            {/* 2. 상세 소개 */}
            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">📖 프로젝트 상세 소개</h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </section>

            <hr className="my-12 border-t-2 border-gray-200" />

            {/* 3. 주요 기능 */}
            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8 text-center">✨ 주요 기능</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {project.features.map((feature, index) => (
                        <div key={index} className="flex items-start bg-indigo-50 p-6 rounded-xl shadow-md">
                            {feature.icon && (
                                <div className="w-8 h-8 text-indigo-600 flex-shrink-0">
                                    <feature.icon />
                                </div>
                            )}
                            <div className="ml-4">
                                <h3 className="text-xl font-semibold text-indigo-800 mb-2">{feature.name}</h3>
                                <p className="text-gray-700">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            
            <hr className="my-12 border-t-2 border-gray-200" />

            {/* 4. 스크린샷 */}
            <section className="mb-16">
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

            {/* 5. 기술 스택 */}
            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8 text-center">🛠️ 기술 스택</h2>
                <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 max-w-md mx-auto">
                    {project.techStack.map((stack, index) => (
                        <li key={index}><span className="font-semibold">{stack.category}</span>: {stack.items.join(', ')}</li>
                    ))}
                </ul>
            </section>

            <hr className="my-12 border-t-2 border-gray-200" />

            {/* 6. 개발 과정 */}
            {project.developmentProcess && (
                <section className="mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8 text-center">🚀 개발 과정 상세</h2>
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

            {/* 7. 트러블 슈팅 */}
            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-10 text-center">🤔 트러블 슈팅</h2>
                <div className="space-y-8">
                    {project.troubleshooting && project.troubleshooting.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold text-red-600 mb-2 flex items-center">
                                    <span className="text-2xl mr-3">🐛</span> 문제 상황
                                </h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.problem}</p>
                            </div>
                            <hr className="border-t border-gray-300 my-4" />
                            <div>
                                <h3 className="text-xl font-semibold text-green-700 mb-2 flex items-center">
                                    <span className="text-2xl mr-3">💡</span> 해결 과정
                                </h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.solution}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <hr className="my-12 border-t-2 border-gray-200" />

            {/* 8. 프로젝트 결과 및 성과 */}
            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">📈 프로젝트 결과 / 성과</h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">{project.summary_results}</p>
            </section>
            
            <hr className="my-12 border-t-2 border-gray-200" />

            {/* 9. 리뷰 및 회고 */}
            <section>
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">✍️ 리뷰 / 회고</h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">{project.summary_retrospective}</p>
            </section>
        </main>
    );
};

export default ProjectDetailComponent;