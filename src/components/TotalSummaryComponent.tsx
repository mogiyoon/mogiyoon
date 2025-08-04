import React from 'react';
import { ProjectData } from '../types'; // 프로젝트 데이터 타입을 불러옵니다.

// 컴포넌트 Props 타입 정의
interface TotalSummaryComponentProps {
    project: ProjectData;
}

// 메인 컴포넌트
const TotalSummaryComponent: React.FC<TotalSummaryComponentProps> = ({ project }) => {
    return (
        // ProjectDetailComponent와 동일한 <main> 레이아웃을 사용합니다.
        <main className="max-w-5xl mx-auto p-4 sm:p-8 bg-white text-gray-800">

            {/* 1. 개요 */}
            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">
                    1. 개요
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {project.summary_overview}
                </p>
            </section>

            <hr className="my-12 border-t-2 border-gray-200" />

            {/* 2. 구현 기능 / 개발 과정 */}
            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">
                    2. 구현 기능 / 개발 과정
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {project.summary_development}
                </p>
            </section>

            <hr className="my-12 border-t-2 border-gray-200" />

            {/* 3. 트러블 슈팅 */}
            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">
                    3. 트러블 슈팅
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {project.summary_troubleshooting}
                </p>
            </section>

            <hr className="my-12 border-t-2 border-gray-200" />

            {/* 4. 프로젝트 결과 / 성과 */}
            <section className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">
                    4. 프로젝트 결과 / 성과
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {project.summary_results}
                </p>
            </section>
            
            <hr className="my-12 border-t-2 border-gray-200" />

            {/* 5. 리뷰 / 회고 */}
            <section>
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 text-center">
                    5. 리뷰 / 회고
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {project.summary_retrospective}
                </p>
            </section>
        </main>
    );
};

export default TotalSummaryComponent;
