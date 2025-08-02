import React, { useEffect, useRef, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { projectTotal } from '../data/projectTotal';
import { ProjectData } from '../types';
import './HomePage.css';

const TotalSummaryPage: React.FC = () => {
    const project: ProjectData = projectTotal;
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const exportPdf = () => {
        alert("현재 페이지 레이아웃에서는 PDF 내보내기 기능이 지원되지 않습니다.");
    };

    const introRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const techStackRef = useRef<HTMLDivElement>(null);

    const [isIntroVisible, setIntroVisible] = useState(false);
    const [isFeaturesVisible, setFeaturesVisible] = useState(false);
    const [isTechStackVisible, setTechStackVisible] = useState(false);
    
    const sections = [
        {
            id: 'intro',
            ref: introRef,
            isVisible: isIntroVisible,
            setter: setIntroVisible,
            content: (
                <div className="text-center">
                    <h1 className="text-5xl sm:text-6xl font-extrabold text-indigo-800 mb-4">{project.title}</h1>
                    <p className="text-xl sm:text-2xl text-gray-600 font-medium mb-8">{project.subtitle}</p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-8">{project.introduction}</p>
                    <div className="flex justify-center items-center">
                        <img src={project.demoGifSrc} alt={`${project.title} Demo`} className="w-full max-w-xs rounded-xl shadow-lg border border-gray-200" />
                    </div>
                </div>
            )
        },
        {
            id: 'features',
            ref: featuresRef,
            isVisible: isFeaturesVisible,
            setter: setFeaturesVisible,
            content: (
                <>
                    <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8 text-center">✨ 핵심 역량</h2>
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
                </>
            )
        },
        {
            id: 'techStack',
            ref: techStackRef,
            isVisible: isTechStackVisible,
            setter: setTechStackVisible,
            content: (
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8">🛠️ 주요 기술 스택</h2>
                    <div className="max-w-md mx-auto space-y-4">
                        {project.techStack.map((stack, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg text-left">
                                <p className="text-lg"><span className="font-semibold text-indigo-800">{stack.category}:</span> {stack.items.join(', ')}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-center mt-12 text-gray-500">포트폴리오의 마지막 페이지입니다.</p>
                </div>
            )
        }
    ];

    useEffect(() => {
        const createObserver = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
            return new IntersectionObserver(
                (entries) => { if (entries[0].isIntersecting) setter(true); },
                { root: scrollContainerRef.current, threshold: 0.2 }
            );
        };
        const activeObservers = sections.map(({ ref, setter }) => {
            const observer = createObserver(setter);
            if (ref.current) observer.observe(ref.current);
            return { observer, ref };
        });
        return () => {
            activeObservers.forEach(({ observer, ref }) => {
                if (ref.current && observer) observer.unobserve(ref.current);
            });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <PageHeader onExportPdf={exportPdf} />

            <div className="scroll-snap-container summary-scroll-container" ref={scrollContainerRef}>
                {sections.map(section => (
                    <section key={section.id} ref={section.ref} className={`scroll-snap-section ${section.isVisible ? 'section-is-visible' : ''}`}>
                        {/* ✅ pt-20을 제거하고, items-center를 사용하여 수직 중앙 정렬을 적용합니다. */}
                        <div className="flex items-center justify-center w-full h-full p-8">
                            <div className="content-to-animate w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 md:p-10">
                                {section.content}
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </>
    );
};

export default TotalSummaryPage;