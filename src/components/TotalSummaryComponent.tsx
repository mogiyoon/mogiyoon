import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ProjectData, SummaryPart } from '../types'; // 프로젝트의 타입 정의 파일 경로

// Props 타입 정의
interface TotalSummaryComponentProps {
  project: ProjectData;
}

// 개별 콘텐츠 파트를 렌더링하는 헬퍼 함수
const renderSummaryPart = (part: SummaryPart, index: number, t: (key: string) => string) => {
  switch (part.type) {
    case "text":
      return (
        <p key={index} className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap break-all">
          {t(part.content || '')}
        </p>
      );
    case "image":
      return (
        <figure key={index} className="my-6 mx-auto text-center">
          <img
            src={part.src}
            alt={part.alt}
            className="w-4/5 rounded-xl shadow-lg border mx-auto" // 스타일 약간 수정
            crossOrigin="anonymous"
          />
          {/* 캡션이 존재할 경우에만 figcaption 태그를 렌더링합니다. */}
          {part.caption && (
            <figcaption className="text-sm text-gray-600 mt-3">
              {t(part.caption)}
            </figcaption>
          )}
        </figure>
      );
    case "link":
      return (
        <div key={index} className="text-lg my-2">
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-blue-600 underline hover:text-blue-800 transition-colors break-words"
          >
            {part.label}
          </a>
        </div>
      );
    default:
      return null;
  }
};

// 메인 컴포넌트
const TotalSummaryComponent: React.FC<TotalSummaryComponentProps> = ({ project }) => {
  const { t } = useTranslation(['projects', 'common']);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 링크 복사 핸들러 함수
  const handleCopyLink = (sectionId: string) => {
    const urlToCopy = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    navigator.clipboard.writeText(urlToCopy)
      .then(() => {
        setCopiedId(sectionId);
        setTimeout(() => setCopiedId(null), 1500); // 1.5초 후 메시지 숨김
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-8 bg-white text-gray-800">
      {/* --- Overview 섹션 --- */}
      <section id="summary-overview" className="mb-16 pb-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">
          {t('projectDetail.overview', { ns: 'common' })}
        </h2>
        <div className="space-y-4 text-lg leading-relaxed">
          {project.overview.projectType && (
            <div className="flex">
              <span className="font-semibold w-36 shrink-0">
                ▪️ {t(project.overview.projectType || '')}
              </span>
            </div>
          )}
          {project.overview.period && (
            <div className="flex">
              <span className="font-semibold w-36 shrink-0">
                ▪️ {t('projectDetail.period', { ns: 'common' })}
              </span>
              <span>: {project.overview.period}</span>
            </div>
          )}
          {project.overview.introduction && (
            <div className="flex items-start">
              <span className="font-semibold w-36 shrink-0">
                ▪️ {t('projectDetail.introduction', { ns: 'common' })}
              </span>
              <span className="flex-1">: {t(project.overview.introduction || '')}</span>
            </div>
          )}
          {project.overview.features && (
            <div className="flex items-start">
              <span className="font-semibold w-36 shrink-0">
                ▪️ {t('projectDetail.features', { ns: 'common' })}
              </span>
              <span className="flex-1">: {t(project.overview.features || '')}</span>
            </div>
          )}
          {project.overview.techStack && project.overview.techStack.length > 0 && (
            <div className="flex items-start">
              <span className="font-semibold w-36 shrink-0">
                ▪️ {t('projectDetail.techStack', { ns: 'common' })}
              </span>
              <span className="flex-1">: {project.overview.techStack.join(", ")}</span>
            </div>
          )}
          {project.overview.architecture && (
             <div className="flex flex-col items-start">
              <span className="font-semibold w-36 shrink-0">
                ▪️ {t('projectDetail.architecture', { ns: 'common' })}
              </span>
              <img src={project.overview.architecture} alt='Architecture' className="w-4/5 rounded-2xl shadow-md border mt-2 mx-auto"/>
            </div>
          )}
          {project.overview.role && (
            <div className="flex items-start">
              <span className="font-semibold w-36 shrink-0">
                ▪️ {t('projectDetail.role', { ns: 'common' })}
              </span>
              <span className="flex-1">: {t(project.overview.role || '')}</span>
            </div>
          )}
          {project.overview.implementationDetails && (
            <div className="flex items-start">
              <span className="font-semibold w-36 shrink-0">
                ▪️ {t('projectDetail.implementationDetails', { ns: 'common' })}
              </span>
              <span className="flex-1">: {t(project.overview.implementationDetails || '')}</span>
            </div>
          )}
          {(project.overview.links?.github || project.overview.links?.demo || project.overview.links?.notion) && (
            <div className="space-y-2">
              {project.overview.links.github && (
                <div className="flex items-start">
                  <span className="font-semibold w-36 shrink-0">
                    ▪️ {t('projectDetail.github', { ns: 'common' })}
                  </span>
                  <a href={project.overview.links.github} target="_blank" rel="noopener noreferrer" className="flex-1 underline text-blue-600 break-all">
                    : {project.overview.links.github}
                  </a>
                </div>
              )}
              {project.overview.links.demo && (
                <div className="flex items-start">
                  <span className="font-semibold w-36 shrink-0">
                    ▪️ {t('projectDetail.website', { ns: 'common' })}
                  </span>
                  <a href={project.overview.links.demo} target="_blank" rel="noopener noreferrer" className="flex-1 underline text-blue-600 break-all">
                    : {project.overview.links.demo}
                  </a>
                </div>
              )}
              {project.overview.links.notion && (
                <div className="flex items-start">
                  <span className="font-semibold w-36 shrink-0">
                    ▪️ {t('projectDetail.notion', { ns: 'common' })}
                  </span>
                  <a href={project.overview.links.notion} target="_blank" rel="noopener noreferrer" className="flex-1 underline text-blue-600 break-all">
                    : {project.overview.links.notion}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <hr className="my-12 border-t-2 border-gray-200" />

      {/* --- Summaries 섹션 --- */}
      {project.summaries.map((section, sectionIndex) => (
        <React.Fragment key={section.id}>
          <section id={section.id} className="mb-16 pb-8 scroll-mt-20">
            {section.parts.map((partGroup, groupIndex) => (
              <div id={`${section.id}-${groupIndex}`} key={groupIndex} className="mb-6 pb-8 space-y-4">
                {groupIndex === 0 && (
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-3xl sm:text-4xl font-bold">
                      {t(section.title || '')}
                    </h2>
                    <button
                      onClick={() => handleCopyLink(section.id)}
                      title="Copy link"
                      className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      🔗
                    </button>
                    {copiedId === section.id && (
                      <span className="text-sm text-green-600">
                        Copied!
                      </span>
                    )}
                  </div>
                )}
                {partGroup.map((part, partIndex) =>
                  renderSummaryPart(part, partIndex, t)
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