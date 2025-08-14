// src/pages/ProjectDetailPage.tsx

import React, { useRef, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { projects } from "../data/projects";
import TotalSummaryComponent from "../components/TotalSummaryComponent";
// import html2canvas from "html2canvas";

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projects.find((p) => p.id === projectId);

  // type TabType = "summary" | "details";
  // const [activeTab, setActiveTab] = useState<TabType>("summary");
  const contentRef = useRef<HTMLDivElement>(null);
  const [gifType, setGifType] = useState<"mobile" | "tablet">("mobile");

  useEffect(() => {
    if (!project?.demoGifSrc) return;

    const img = new Image();
    img.src = project.demoGifSrc;

    img.onload = () => {
      const aspectRatio = img.width / img.height;

      if (aspectRatio > 1) {
        setGifType("tablet");
      } else {
        setGifType("mobile");
      }
    };
    img.onerror = () => {
      console.error(`GIF 사이즈 감지 실패: ${project.demoGifSrc}`);
    };
  }, [project?.demoGifSrc]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      "https://placehold.co/250x400/cccccc/333333?text=Image+Not+Found";
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white shadow-xl rounded-2xl">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            프로젝트를 찾을 수 없습니다.
          </h1>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg"
          >
            메인 페이지로
          </Link>
        </div>
      </div>
    );
  }

  const baseGifClasses = "w-full max-w-xs rounded-xl shadow-lg border";
  const gifFinalClasses =
    gifType === "tablet" ? `${baseGifClasses} md:max-w-none` : baseGifClasses;

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
      <div className="p-4 sm:p-8 pt-24">
        <div
          ref={contentRef}
          className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10 mb-12"
        >
          <header id="project-header" className="text-center pt-8 pb-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 mb-4">
              {project.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-medium">
              {project.subtitle}
            </p>
          </header>
          <section className="my-8">
            <div className="flex justify-center items-center">
              <img
                src={project.demoGifSrc}
                alt={`${project.title} App Demo`}
                className={gifFinalClasses}
                onError={handleImageError}
              />
            </div>
          </section>
          <hr className="my-12 border-t-2 border-gray-200" />
          {/* <div className="border-b border-gray-200 mb-8"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button onClick={() => setActiveTab('summary')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'summary' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>요약</button><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'details' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>상세 설명</button></nav></div> */}
          {/* {activeTab === 'summary' ? <TotalSummaryComponent project={project} /> : <ProjectDetailComponent project={project} />} */}
          <TotalSummaryComponent project={project} />
          <hr className="my-12 border-t-2 border-gray-200" />
          <section className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6">
              📜 라이선스
            </h2>
            <p className="text-base text-gray-700">
              이 프로젝트는{" "}
              <a
                href={project.license.url}
                className="text-indigo-600 hover:underline font-semibold"
              >
                {project.license.name}
              </a>{" "}
              라이선스를 따릅니다.
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