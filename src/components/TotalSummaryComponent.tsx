import type { ProjectData, SummaryPart } from '../types';
import React, { useState } from "react";
import type { TFunction } from 'i18next';
import ToastNotification from './ToastNotification'; // Toast 컴포넌트 import

// Props 타입 정의
interface TotalSummaryComponentProps {
  project: ProjectData;
  t: TFunction;
}

/**
 * 개별 콘텐츠 파트를 렌더링하는 헬퍼 함수
 */
const renderSummaryPart = (
  part: SummaryPart,
  index: number,
  t: TFunction,
  onSubtitleClick: (id: string) => void
) => {
  switch (part.type) {
    case "text":
      return (
        <p key={index} className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap break-all">
          {t(part.content || '')}
        </p>
      );
    case "subtitle":
      return (
        <div key={index} id={part.id} className="mt-10 mb-4 scroll-mt-20">
          <h3
            onClick={() => onSubtitleClick(part.id)}
            className="text-2xl font-bold text-gray-800 inline-block cursor-pointer hover:text-indigo-600 transition-colors duration-200"
            title="클릭하여 링크 복사"
          >
            {t(part.content)}
          </h3>
        </div>
      );
    case "image":
      return (
        <figure key={index} className="my-6 mx-auto text-center">
          <img
            src={part.src}
            alt={part.alt}
            className="rounded-xl shadow-lg border mx-auto"
            style={{
              width: part.width ?? '80%',
              aspectRatio: part.ratio,
            }}
            crossOrigin="anonymous"
          />
          {part.caption && (
            <figcaption className="text-sm text-gray-400 mt-3">
              {t(part.caption)}
            </figcaption>
          )}
        </figure>
      );
case "image-group":
  return (
    // 💡 1. 그룹 전체의 너비를 적용하는 컨테이너
    <div
      key={index}
      className="flex flex-col sm:flex-row my-6 gap-4 justify-center items-start mx-auto"
      style={{ width: part.width ?? '100%' }}
    >
      {part.images.map((image, imgIndex) => (
        <figure
          key={imgIndex}
          className={`text-center ${!image.width ? 'flex-1' : ''}`}
          style={{ width: image.width }}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="rounded-xl shadow-lg border mx-auto w-full"
            style={{ aspectRatio: image.ratio }}
            crossOrigin="anonymous"
          />
          {image.caption && (
            <figcaption className="text-sm text-gray-400 mt-3">
              {t(image.caption)}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
    case "link":
      return (
        <div key={index} className="text-lg">
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

/**
 * 메인 컴포넌트
 */
const TotalSummaryComponent: React.FC<TotalSummaryComponentProps> = ({ project, t }) => {
  const [toastMessage, setToastMessage] = useState<string>('');
  const [linkCopySuccess, setLinkCopySuccess] = useState<boolean>(false);

  const handleCopyLink = (sectionId: string) => {
    const urlToCopy = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    navigator.clipboard.writeText(urlToCopy)
      .then(() => {
        setToastMessage(t('linkCopied', { ns: 'common' }));
        setLinkCopySuccess(true);
        setTimeout(() => setToastMessage(''), 3000); // 3초 후 메시지 자동 제거
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        setToastMessage(t('linkCopyFailed', { ns: 'common' }));
        setLinkCopySuccess(false);
        setTimeout(() => setToastMessage(''), 3000);
      });
  };

  return (
    <>
      <main className="max-w-5xl mx-auto p-4 sm:p-8 bg-white text-gray-800">
        {/* --- Overview 섹션 --- */}
        <section id="summary-overview" className="mb-16 pb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            {t('projectDetail.overview', { ns: 'common' })}
          </h2>
          <div className="space-y-4 text-lg leading-relaxed">
            {project.overview.projectType && (
              <div className="flex">
                <span className="font-semibold w-100 shrink-0">
                  ▪️ {t(project.overview.projectType || '')}
                </span>
              </div>
            )}
            {project.overview.other && (
              <div className="flex">
                <span className="font-semibold w-100 shrink-0">
                  ▪️ {t(project.overview.other || '')}
                </span>
              </div>
            )}
            {project.overview.period && (
              <div className="flex">
                <span className="font-semibold w-40 shrink-0">
                  ▪️ {t('projectDetail.period', { ns: 'common' })}
                </span>
                <span>{project.overview.period}</span>
              </div>
            )}
            {project.overview.introduction && (
              <div className="flex items-start">
                <span className="font-semibold w-40 shrink-0">
                  ▪️ {t('projectDetail.introduction', { ns: 'common' })}
                </span>
                <span className="flex-1">{t(project.overview.introduction || '')}</span>
              </div>
            )}
            {project.overview.features && (
              <div className="flex items-start">
                <span className="font-semibold w-40 shrink-0">
                  ▪️ {t('projectDetail.features', { ns: 'common' })}
                </span>
                <span className="flex-1">{t(project.overview.features || '')}</span>
              </div>
            )}
            {project.overview.techStack && project.overview.techStack.length > 0 && (
              <div className="flex items-start">
                <span className="font-semibold w-40 shrink-0">
                  ▪️ {t('projectDetail.techStack', { ns: 'common' })}
                </span>
                <span className="flex-1">{project.overview.techStack.join(", ")}</span>
              </div>
            )}
            {project.overview.architecture && (
               <div className="flex flex-col items-start">
                <span className="font-semibold w-40 shrink-0">
                  ▪️ {t('projectDetail.architecture', { ns: 'common' })}
                </span>
                <img src={project.overview.architecture} alt='Architecture' className="w-4/5 rounded-2xl shadow-md border mt-2 mx-auto"/>
              </div>
            )}
            {project.overview.role && (
              <div className="flex items-start">
                <span className="font-semibold w-40 shrink-0">
                  ▪️ {t('projectDetail.role', { ns: 'common' })}
                </span>
                <span className="flex-1">{t(project.overview.role || '')}</span>
              </div>
            )}
            {project.overview.implementationDetails && (
              <div className="flex items-start">
                <span className="font-semibold w-40 shrink-0">
                  ▪️ {t('projectDetail.implementationDetails', { ns: 'common' })}
                </span>
                <span className="flex-1">{t(project.overview.implementationDetails || '')}</span>
              </div>
            )}
            {project.overview.demo && (
              <div className="flex items-start">
                <span className="font-semibold w-40 shrink-0">
                  ▪️ {t('projectDetail.website', { ns: 'common' })}
                </span>
                <a href={project.overview.demo} target="_blank" rel="noopener noreferrer" className="flex-1 underline text-blue-600 break-all">
                  {project.overview.demo}
                </a>
              </div>
            )}
            {project.overview.github && (
              <div className="flex items-start">
                <span className="font-semibold w-40 shrink-0">
                  ▪️ {t('projectDetail.github', { ns: 'common' })}
                </span>
                <a href={project.overview.github} target="_blank" rel="noopener noreferrer" className="flex-1 underline text-blue-600 break-all">
                  {project.overview.github}
                </a>
              </div>
            )}
            {project.overview.notion && (
              <div className="flex items-start">
                <span className="font-semibold w-40 shrink-0">
                  ▪️ {t('projectDetail.notion', { ns: 'common' })}
                </span>
                <a href={project.overview.notion} target="_blank" rel="noopener noreferrer" className="flex-1 underline text-blue-600 break-all">
                  {project.overview.notion}
                </a>
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
                <div key={groupIndex} className="mb-6 pb-8 space-y-4">
                  {groupIndex === 0 && (
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                      {t(section.title || '')}
                    </h2>
                  )}
                  {partGroup.map((part, partIndex) =>
                    renderSummaryPart(part, partIndex, t, handleCopyLink)
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

      <ToastNotification message={toastMessage} isSuccess={linkCopySuccess} show={!!toastMessage} />
    </>
  );
};

export default TotalSummaryComponent;