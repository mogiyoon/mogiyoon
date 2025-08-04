import React from 'react';
import { ProjectData } from '../types';

interface TotalSummaryComponentProps {
    project: ProjectData;
}

const TotalSummaryComponent: React.FC<TotalSummaryComponentProps> = ({ project }) => {
    return (
        <main className="max-w-5xl mx-auto p-4 sm:p-8 bg-white text-gray-800">
            {/* '개요' 섹션 */}
            <section id="summary-overview" className="mb-16 pb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8">개요</h2>
                <div className="space-y-4 text-lg leading-relaxed">
                    <p><strong className="font-semibold w-24 inline-block whitespace-nowrap">▪️ 기간</strong>: {project.overview.period}</p>
                    <p><strong className="font-semibold w-24 inline-block whitespace-nowrap">▪️ 한 줄 소개</strong>: {project.overview.introduction}</p>
                    <p><strong className="font-semibold w-24 inline-block whitespace-nowrap">▪️ 주요 기능</strong>: {project.overview.features}</p>
                    <p><strong className="font-semibold w-24 inline-block whitespace-nowrap">▪️ 사용 기술</strong>: {project.overview.techStack}</p>
                </div>
            </section>
            <hr className="my-12 border-t-2 border-gray-200" />

            {/* 나머지 요약 섹션들 */}
            {project.summaries.map((section, sectionIndex) => (
                <React.Fragment key={section.id}>
                    <section id={section.id} className="mb-16 pb-8">
                        <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6">
                            {section.title}
                        </h2>
                        {section.parts.map((part, partIndex) => (
                            <div id={`${section.id}-${partIndex}`} key={partIndex} className="mb-6">
                                {part.type === 'text' ? (
                                    <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {part.content}
                                    </p>
                                ) : (
                                    <img 
                                        src={part.src} 
                                        alt={part.alt} 
                                        className="w-full rounded-lg shadow-md border my-4" 
                                        crossOrigin="anonymous" 
                                    />
                                )}
                            </div>
                        ))}
                    </section>
                    {sectionIndex < project.summaries.length - 1 && (
                        <hr className="my-12 border-t-2 border-gray-200" />
                    )}
                </React.Fragment>
            ))}
        </main>
    );
};

export default TotalSummaryComponent;