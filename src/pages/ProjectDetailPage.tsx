import React, { useRef, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { projects } from "../data/projects";
import TotalSummaryComponent from "../components/TotalSummaryComponent";

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projects.find((p) => p.id === projectId);

  const { t } = useTranslation(['projects', 'common']);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [gifType, setGifType] = useState<"mobile" | "tablet">("mobile");

  useEffect(() => {
    if (!project?.demoGifSrc) return;
    const img = new Image();
    img.src = project.demoGifSrc;
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      setGifType(aspectRatio > 1 ? "tablet" : "mobile");
    };
    img.onerror = () => console.error(`Failed to detect GIF size: ${project.demoGifSrc}`);
  }, [project?.demoGifSrc]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "https://placehold.co/250x400/cccccc/333333?text=Image+Not+Found";
    // 에러 발생 시에도 로딩 상태를 완료로 변경하여 스켈레톤을 숨깁니다.
    setIsLoaded(true);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white shadow-xl rounded-2xl">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            {t('projectDetail.projectNotFound', { ns: 'common' })}
          </h1>
          <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg">
            {t('projectDetail.backToMain', { ns: 'common' })}
          </Link>
        </div>
      </div>
    );
  }

  const baseGifClasses = "w-full max-w-xs rounded-xl shadow-lg border";
  const gifFinalClasses = gifType === "tablet" ? `${baseGifClasses} md:max-w-none` : baseGifClasses;

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
      <div className="p-4 sm:p-8 pt-24">
        <div
          ref={contentRef}
          className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10 mb-12"
        >
          <header id="project-header" className="text-center pt-8 pb-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              {t(project.title || '', { ns: 'projects' })}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-medium">
              {t(project.subtitle || '', { ns: 'projects' })}
            </p>
          </header>
          <section className="my-8">
            <div className="flex justify-center items-center min-h-[400px]">
              {!isLoaded && (
                <div className={`bg-gray-200 animate-pulse ${gifFinalClasses} ${gifType === 'mobile' ? 'h-[444px]' : 'aspect-video'}`}></div>
              )}

              <img
                src={project.demoGifSrc}
                alt={`${t(project.title || '', { ns: 'projects' })} App Demo`}
                className={`${gifFinalClasses} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                onError={handleImageError}
                // 로드되기 전까지는 렌더링되지 않도록 처리
                style={{ display: isLoaded ? 'block' : 'none' }}
              />
            </div>
          </section>
          <hr className="my-12 border-t-2 border-gray-200" />
          
          <TotalSummaryComponent project={project} />

          <hr className="my-12 border-t-2 border-gray-200" />
          <section className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6">
              📜 {t('projectDetail.license', { ns: 'common' })}
            </h2>
            <p className="text-base text-gray-700">
              <Trans
                ns="common"
                i18nKey="projectDetail.licenseText"
                values={{ licenseName: project.license.name }}
                components={[
                  <a
                    href={project.license.url}
                    className="text-indigo-600 hover:underline font-semibold"
                  />,
                ]}
              />
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