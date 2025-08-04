// src/components/TotalSummaryComponent.tsx

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
                <h2 className="text-4xl sm:text-5xl font-bold text-indigo-700 mb-8">개요</h2>
                <div className="space-y-4 text-xl leading-relaxed">
                    <p>
                        <span className="font-semibold w-28 inline-block whitespace-nowrap">▪️ 기간</span>
                        : {project.overview.period}
                    </p>
                    <p>
                        <span className="font-semibold w-28 inline-block whitespace-nowrap">▪️ 한 줄 소개</span>
                        : {project.overview.introduction}
                    </p>
                    <p>
                        <span className="font-semibold w-28 inline-block whitespace-nowrap">▪️ 주요 기능</span>
                        : {project.overview.features}
                    </p>
                    <p>
                        <span className="font-semibold w-28 inline-block whitespace-nowrap">▪️ 사용 기술</span>
                        : {project.overview.techStack}
                    </p>
                </div>
            </section>
            <hr className="my-12 border-t-2 border-gray-200" />

            {/* 나머지 요약 섹션들 */}
            {project.summaries.map((section, sectionIndex) => (
                <React.Fragment key={section.id}>
                    <section id={section.id} className="mb-16 pb-8">
                        <h2 className="text-4xl sm:text-5xl font-bold text-indigo-700 mb-6">
                            {section.title}
                        </h2>
                        {/* ✅ 변경된 부분: 2중으로 순회 */}
                        {section.parts.map((partGroup, groupIndex) => (
                            <div id={`${section.id}-${groupIndex}`} key={groupIndex} className="mb-6 pb-8">
                                {partGroup.map((part, partIndex) => (
                                    <div key={partIndex} className="mb-4">
                                        {part.type === 'text' ? (
                                            <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-wrap break-all">
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