import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { projects } from '../data/projects';
import TotalSummaryComponent from '../components/TotalSummaryComponent';
import ProjectDetailComponent from '../components/ProjectDetailComponent';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const project = projects.find(p => p.id === projectId);

    type TabType = 'summary' | 'details';
    const [activeTab, setActiveTab] = useState<TabType>('summary'); 
    const contentRef = useRef<HTMLDivElement>(null);
    const [headerTranslate, setHeaderTranslate] = useState(0);
    const [isLoadingPdf, setIsLoadingPdf] = useState(false);
    const lastScrollY = useRef(0);
    const HEADER_HEIGHT = 80;

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY.current;
            if (currentScrollY <= 0) { setHeaderTranslate(0); lastScrollY.current = 0; return; }
            setHeaderTranslate(prev => Math.max(-HEADER_HEIGHT, Math.min(0, prev - delta)));
            lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://placehold.co/250x400/cccccc/333333?text=Image+Not+Found";
    };

    const exportPdf = async () => {
        if (activeTab !== 'summary' || isLoadingPdf) { return; }
        if (!project || !contentRef.current) { console.error("PDF export failed."); return; }
        
        setIsLoadingPdf(true);

        const getCanvasAfterImageLoad = (elementId: string): Promise<HTMLCanvasElement | null> => {
            return new Promise(async (resolve) => {
                try {
                    await document.fonts.ready;
                    const element = document.getElementById(elementId);
                    if (!element) { resolve(null); return; }
                    const images = Array.from(element.getElementsByTagName('img'));
                    if (images.length > 0) {
                await Promise.all(images.map(image => new Promise<void>((imgResolve) => {
                    if (image.complete) {
                        imgResolve();
                    } else {
                        image.onload = () => imgResolve();
                        image.onerror = () => imgResolve();
                    }
                })));
            }
                    setTimeout(() => {
                        html2canvas(element, { scale: 2, logging: false, useCORS: true }).then(resolve);
                    }, 300);
                } catch (error) { console.error(`Canvas generation failed for #${elementId}`, error); resolve(null); }
            });
        };

        try {
            // ✅ 1. 가로(landscape) 방향으로 PDF 생성
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const columnGap = 5;
            const columnWidth = (pdfWidth - (margin * 2) - columnGap) / 2;
            const contentMaxHeight = pdfHeight - (margin * 2);

            // 첫 페이지: 프로젝트 헤더(왼쪽)와 개요(오른쪽)
            const headerCanvas = await getCanvasAfterImageLoad('project-header');
            const overviewCanvas = await getCanvasAfterImageLoad('summary-overview');
            
            if (headerCanvas) {
                const ratio = headerCanvas.height / headerCanvas.width;
                pdf.addImage(headerCanvas.toDataURL('image/png'), 'PNG', margin, margin, columnWidth, columnWidth * ratio);
            }
            if (overviewCanvas) {
                const ratio = overviewCanvas.height / overviewCanvas.width;
                pdf.addImage(overviewCanvas.toDataURL('image/png'), 'PNG', margin + columnWidth + columnGap, margin, columnWidth, columnWidth * ratio);
            }

            // ✅ 2. 나머지 요약 섹션들을 2개씩 짝지어 페이지에 추가
            for (let i = 0; i < project.summaries.length; i += 2) {
                pdf.addPage();

                const leftSectionId = project.summaries[i].id;
                const rightSectionId = project.summaries[i + 1]?.id; // 다음 섹션이 없을 수도 있음

                // 왼쪽 섹션 캡처 및 추가
                const leftCanvas = await getCanvasAfterImageLoad(leftSectionId);
                if (leftCanvas) {
                    // 오른쪽 섹션이 없는 경우 (마지막 1개만 남았을 때)
                    if (!rightSectionId) {
                        // 페이지 중앙에 하나만 크게 배치
                        const ratio = leftCanvas.height / leftCanvas.width;
                        let imgWidth = pdfWidth - (margin * 2);
                        let imgHeight = imgWidth * ratio;
                        if (imgHeight > contentMaxHeight) {
                            imgHeight = contentMaxHeight;
                            imgWidth = imgHeight / ratio;
                        }
                        const xOffset = (pdfWidth - imgWidth) / 2;
                        const yOffset = (pdfHeight - imgHeight) / 2;
                        pdf.addImage(leftCanvas.toDataURL('image/png'), 'PNG', xOffset, yOffset, imgWidth, imgHeight);
                    } else {
                        // 왼쪽 컬럼에 배치
                        const ratio = leftCanvas.height / leftCanvas.width;
                        pdf.addImage(leftCanvas.toDataURL('image/png'), 'PNG', margin, margin, columnWidth, columnWidth * ratio);
                    }
                }

                // 오른쪽 섹션 캡처 및 추가 (존재할 경우)
                if (rightSectionId) {
                    const rightCanvas = await getCanvasAfterImageLoad(rightSectionId);
                    if (rightCanvas) {
                        const ratio = rightCanvas.height / rightCanvas.width;
                        pdf.addImage(rightCanvas.toDataURL('image/png'), 'PNG', margin + columnWidth + columnGap, margin, columnWidth, columnWidth * ratio);
                    }
                }
            }

            pdf.save(`${project.title}-summary.pdf`);
        } catch (error) {
            console.error("PDF 생성 중 오류가 발생했습니다.", error);
            alert("PDF를 생성하는 데 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoadingPdf(false);
        }
    };

    if (!project) {
        return <div className="min-h-screen flex items-center justify-center"><div className="text-center p-8 bg-white shadow-xl rounded-2xl"><h1 className="text-4xl font-bold text-red-600 mb-4">프로젝트를 찾을 수 없습니다.</h1><Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg">메인 페이지로</Link></div></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
            <div style={{ transform: `translateY(${headerTranslate}px)`, transition: 'transform 0.1s linear' }} className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
                <PageHeader onExportPdf={exportPdf} isPdfLoading={isLoadingPdf} />
            </div>
            <div className="p-4 sm:p-8 pt-24">
                <div ref={contentRef} className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10 mb-12">
                    <header id="project-header" className="text-center pt-8 pb-4"><h1 className="text-5xl sm:text-6xl font-extrabold text-indigo-800 mb-4">{project.title}</h1><p className="text-xl sm:text-2xl text-gray-600 font-medium">{project.subtitle}</p></header>
                    <section className="my-8"><div className="flex justify-center items-center"><img src={project.demoGifSrc} alt={`${project.title} App Demo`} className="w-full max-w-xs rounded-xl shadow-lg border" onError={handleImageError} /></div></section>
                    <hr className="my-12 border-t-2 border-gray-200" />
                    <div className="border-b border-gray-200 mb-8"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button onClick={() => setActiveTab('summary')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'summary' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>요약</button><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'details' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>상세 설명</button></nav></div>
                    {activeTab === 'summary' ? <TotalSummaryComponent project={project} /> : <ProjectDetailComponent project={project} />}
                    <hr className="my-12 border-t-2 border-gray-200" />
                    <section className="text-center"><h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6">📜 라이선스</h2><p className="text-lg text-gray-700">이 프로젝트는 <a href={project.license.url} className="text-indigo-600 hover:underline font-semibold">{project.license.name}</a> 라이선스를 따릅니다.</p></section>
                </div>
                <footer className="max-w-4xl mx-auto text-center py-8 text-gray-500 text-sm">&copy; 2025 My Portfolio. All rights reserved.</footer>
            </div>
        </div>
    );
};

export default ProjectDetailPage;