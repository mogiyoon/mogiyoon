import React from "react";
import { ProjectData, SummaryPart } from "../types"; // SummaryPart 타입도 import 합니다.

interface TotalSummaryComponentProps {
  project: ProjectData;
}

/**
 * 각 요약 파트(SummaryPart)를 렌더링하는 헬퍼 함수
 */
const renderSummaryPart = (part: SummaryPart, index: number) => {
  switch (part.type) {
    case "text":
      return (
        <p key={index} className="text-xl text-gray-700 leading-relaxed whitespace-pre-wrap break-all">
          {part.content}
        </p>
      );
    case "image":
      return (
        <img
          key={index}
          src={part.src}
          alt={part.alt}
          className="w-full rounded-lg shadow-md border my-4"
          crossOrigin="anonymous"
        />
      );
    case "link":
      return (
        <div key={index} className="text-xl my-2">
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

const TotalSummaryComponent: React.FC<TotalSummaryComponentProps> = ({
  project,
}) => {
  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-8 bg-white text-gray-800">
      {/* '개요' 섹션 (변경 없음) */}
      <section id="summary-overview" className="mb-16 pb-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-indigo-700 mb-8">
          개요
        </h2>
        <div className="space-y-4 text-xl leading-relaxed">
          {project.overview.projectType && (
            <p>
              <span className="font-semibold w-28 inline-block whitespace-nowrap">
                ▪️ {project.overview.projectType}
              </span>
            </p>
          )}
          {project.overview.period && (
            <p>
              <span className="font-semibold w-28 inline-block whitespace-nowrap">
                ▪️ 기간
              </span>
              : {project.overview.period}
            </p>
          )}
          {project.overview.introduction && (
            <p>
              <span className="font-semibold w-28 inline-block whitespace-nowrap">
                ▪️ 한 줄 소개
              </span>
              : {project.overview.introduction}
            </p>
          )}
          {project.overview.features && (
            <p>
              <span className="font-semibold w-28 inline-block whitespace-nowrap">
                ▪️ 주요 기능
              </span>
              : {project.overview.features}
            </p>
          )}
          {project.overview.techStack && project.overview.techStack.length > 0 && (
            <p>
              <span className="font-semibold w-28 inline-block whitespace-nowrap">
                ▪️ 사용 기술
              </span>
              : {project.overview.techStack.join(", ")}
            </p>
          )}
          {project.overview.environment && (
            <p>
              <span className="font-semibold w-28 inline-block whitespace-nowrap">
                ▪️ 개발 환경
              </span>
              : {project.overview.environment}
            </p>
          )}
          {project.overview.role && (
            <p>
              <span className="font-semibold w-28 inline-block whitespace-nowrap">
                ▪️ 역할
              </span>
              : {project.overview.role}
            </p>
          )}
          {project.overview.implementationDetails && (
            <p>
              <span className="font-semibold w-28 inline-block whitespace-nowrap">
                ▪️ 구현 기능
              </span>
              : {project.overview.implementationDetails}
            </p>
          )}
          {(project.overview.links?.github ||
            project.overview.links?.demo ||
            project.overview.links?.notion) && (
            <div>
              {project.overview.links.github && (
                <p>
                  <span className="font-semibold w-28 inline-block whitespace-nowrap">
                    ▪️ GitHub
                  </span>
                  :{" "}
                  <a
                    href={project.overview.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 break-words"
                  >
                    {project.overview.links.github}
                  </a>
                </p>
              )}
              {project.overview.links.demo && (
                <p>
                  <span className="font-semibold w-28 inline-block whitespace-nowrap">
                    ▪️ 데모
                  </span>
                  :{" "}
                  <a
                    href={project.overview.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 break-words"
                  >
                    {project.overview.links.demo}
                  </a>
                </p>
              )}
              {project.overview.links.notion && (
                <p>
                  <span className="font-semibold w-28 inline-block whitespace-nowrap">
                    ▪️ 노션
                  </span>
                  :{" "}
                  <a
                    href={project.overview.links.notion}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 break-words"
                  >
                    {project.overview.links.notion}
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      </section>
      <hr className="my-12 border-t-2 border-gray-200" />

      {/* ✅ '요약' 섹션 구조 수정 */}
      {project.summaries.map((section, sectionIndex) => (
        <React.Fragment key={section.id}>
          <section id={section.id} className="mb-16 pb-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-indigo-700 mb-6">
              {section.title}
            </h2>
            {section.parts.map((partGroup, groupIndex) => (
              <div
                id={`${section.id}-${groupIndex}`}
                key={groupIndex}
                className="mb-6 pb-8 space-y-4"
              >
                {/* 헬퍼 함수 또는 switch 문을 사용하여 각 part 타입을 렌더링합니다.
                  이렇게 하면 'text', 'image', 'link' 타입을 모두 처리할 수 있습니다.
                */}
                {partGroup.map((part, partIndex) =>
                  renderSummaryPart(part, partIndex)
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