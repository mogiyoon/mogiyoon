import React from "react";
import { useTranslation } from "react-i18next";
import type { ProjectData, SummaryPart } from '../types';

interface TotalSummaryComponentProps {
  project: ProjectData;
}

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
        <img
          key={index}
          src={part.src}
          alt={part.alt}
          className="w-4/5 rounded-2xl shadow-md border my-4 mx-auto"
          crossOrigin="anonymous"
        />
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

const TotalSummaryComponent: React.FC<TotalSummaryComponentProps> = ({ project }) => {
  const { t } = useTranslation(['projects', 'common']);

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-8 bg-white text-gray-800">
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

      {project.summaries.map((section, sectionIndex) => (
        <React.Fragment key={section.id}>
          <section id={section.id} className="mb-16 pb-8">
            {section.parts.map((partGroup, groupIndex) => (
              <div id={`${section.id}-${groupIndex}`} key={groupIndex} className="mb-6 pb-8 space-y-4">
                {groupIndex === 0 && (
                  <h2 className="text-3xl sm:text-4xl font-bold mb-6 col-span-full">
                    {t(section.title || '')}
                  </h2>
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
