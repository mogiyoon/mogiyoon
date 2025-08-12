import React from 'react';
import type { ProjectData } from '../types';

interface ProjectDetailComponentProps {
    project: ProjectData;
}

const ProjectDetailComponent: React.FC<ProjectDetailComponentProps> = ({ project }) => {

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://via.placeholder.com/250x150.png?text=Image+Not+Found';
    };

    // ✅ 변경된 부분: 2중으로 map을 사용하여 중첩 배열을 렌더링합니다.
    const renderSummaryParts = (id: string) => {
        const section = project.summaries.find(s => s.id === id);
        if (!section) return null;

        // partGroup은 SummaryPart[] 타입, part는 SummaryPart 타입
        return section.parts.map((partGroup, groupIndex) => (
            <div key={groupIndex} className="mb-4">
                {partGroup.map((part, partIndex) => {
                    if (part.type === 'text') {
                        return <p key={`${groupIndex}-${partIndex}`} className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">{part.content}</p>;
                    }
                    if (part.type === 'image') {
                        return <img key={`${groupIndex}-${partIndex}`} src={part.src} alt={part.alt} className="w-full rounded-lg shadow-md border my-6" crossOrigin="anonymous"/>;
                    }
                    return null;
                })}
            </div>
        ));
    };

    return (
        <main className="max-w-5xl mx-auto p-4 sm:p-8 bg-white text-gray-800">
            <section className="mb-16 text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-6">프로젝트 개요</h2>
                <div className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto text-left space-y-2">
                    <p><strong className="font-semibold w-28 inline-block whitespace-nowrap">▪️ 기간</strong>: {project.overview.period}</p>
                    <p><strong className="font-semibold w-28 inline-block whitespace-nowrap">▪️ 한 줄 소개</strong>: {project.overview.introduction}</p>
                    <p><strong className="font-semibold w-28 inline-block whitespace-nowrap">▪️ 주요 기능</strong>: {project.overview.features}</p>
                    {project.overview.techStack && <p><strong className="font-semibold w-28 inline-block whitespace-nowrap">▪️ 사용 기술</strong>: {project.overview.techStack.join(", ")}</p>}
                </div>
            </section>
            <hr className="my-12 border-t-2 border-gray-200" />

            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">📖 프로젝트 상세 소개</h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </section>
            <hr className="my-12 border-t-2 border-gray-200" />

            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8 text-center">✨ 주요 기능</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{project.features.map((feature, index) => (<div key={index} className="flex items-start bg-indigo-50 p-6 rounded-xl shadow-md">{feature.icon && <div className="w-8 h-8 text-indigo-600 flex-shrink-0"><feature.icon /></div>}<div className="ml-4"><h3 className="text-xl font-semibold text-indigo-800 mb-2">{feature.name}</h3><p className="text-gray-700">{feature.description}</p></div></div>))}</div>
            </section>
            <hr className="my-12 border-t-2 border-gray-200" />

            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8 text-center">📱 스크린샷</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">{project.screenshots.map((screenshot, index) => (<div key={index} className="text-center"><p className="font-semibold mb-2">{screenshot.title}</p><img src={screenshot.src} alt={screenshot.title} className="w-full max-w-[250px] rounded-lg shadow-md border" onError={handleImageError} /></div>))}</div>
            </section>
            <hr className="my-12 border-t-2 border-gray-200" />

            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8 text-center">🛠️ 기술 스택</h2>
                <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 max-w-md mx-auto">{project.techStack.map((stack, index) => (<li key={index}><span className="font-semibold">{stack.category} , </span>: {stack.items.join(', ')}</li>))}</ul>
            </section>
            <hr className="my-12 border-t-2 border-gray-200" />

            {project.developmentProcess && (<section className="mb-16"><h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8 text-center">🚀 개발 과정 상세</h2><div className="space-y-10">{project.developmentProcess.map((step, index) => (<div key={index}><h3 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-4">{step.title}</h3><p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap ml-2">{step.content}</p></div>))}</div></section>)}
            <hr className="my-12 border-t-2 border-gray-200" />

            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">🤔 트러블 슈팅</h2>
                {renderSummaryParts('troubleshooting')}
            </section>
            <hr className="my-12 border-t-2 border-gray-200" />

            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">📈 프로젝트 결과 / 성과</h2>
                {renderSummaryParts('results')}
            </section>
            <hr className="my-12 border-t-2 border-gray-200" />

            <section>
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">✍️ 리뷰 / 회고</h2>
                {renderSummaryParts('retrospective')}
            </section>
        </main>
    );
};

export default ProjectDetailComponent;