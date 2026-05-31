import type { ProjectData, SummaryPart, SummaryTextCategory } from "../types";
import React from "react";
import type { TFunction } from "i18next";
import ToastNotification from "./ToastNotification";
import ReactStableTimelineDemo from "./ReactStableTimelineDemo";
import { Chip } from "./primitives/Chip";
import ExternalLink from "./primitives/ExternalLink";
import InfoCell from "./primitives/InfoCell";
import {
  TimelineFinalStep,
  TimelineInitialStep,
  TimelineSolidStep,
} from "./primitives/TimelineStep";
import { useCopyToClipboardWithToast } from "../hooks/useCopyToClipboardWithToast";

interface TotalSummaryComponentProps {
  project: ProjectData;
  t: TFunction;
  projectId?: string;
}

type CategorizedTextPart = Extract<SummaryPart, { type: "text" }> & {
  category: SummaryTextCategory;
};

const isCategorizedText = (part: SummaryPart): part is CategorizedTextPart =>
  part.type === "text" && Boolean(part.category);

// ── Categorized timeline step ─────────────────────────────────────────────────
// 카테고리별로 ProfileSection HighlightCard 와 동일한 타임라인 시각 단계에 매핑.
const renderTimelineStep = (
  part: CategorizedTextPart,
  t: TFunction,
  key: React.Key
) => {
  const label = t(`summaryCategory.${part.category}`, { ns: "common" });
  const body = t(part.content || "");
  switch (part.category) {
    case "problem":
      return (
        <TimelineInitialStep key={key} label={label} bodyClassName="whitespace-pre-wrap">
          {body}
        </TimelineInitialStep>
      );
    case "analysis":
      return (
        <TimelineSolidStep key={key} label={label} shade={500}>
          {body}
        </TimelineSolidStep>
      );
    case "solution":
      return (
        <TimelineSolidStep key={key} label={label} shade={600}>
          {body}
        </TimelineSolidStep>
      );
    case "result":
      return (
        <TimelineFinalStep key={key} label={label} preserveLineBreaks>
          {body}
        </TimelineFinalStep>
      );
  }
};

// ── Part group renderer ───────────────────────────────────────────────────────
// 연속된 categorized text 들을 하나의 타임라인으로 묶어, 단일 connector 위에
// problem → analysis → solution → result 단계가 시각적으로 이어지도록 렌더링.
const renderPartGroup = (
  partGroup: SummaryPart[],
  t: TFunction,
  onSubtitleClick: (id: string) => void
): React.ReactNode => {
  const nodes: React.ReactNode[] = [];
  let buffer: CategorizedTextPart[] = [];
  let bufferStartIndex = 0;

  const flushBuffer = () => {
    if (buffer.length === 0) return;
    const steps = buffer;
    const startIndex = bufferStartIndex;
    nodes.push(
      <div key={`tl-${startIndex}`} className="relative pl-6">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-slate-200 via-slate-400 to-slate-900" />
        {steps.map((part, i) =>
          renderTimelineStep(part, t, `${startIndex}-${i}`)
        )}
      </div>
    );
    buffer = [];
  };

  partGroup.forEach((part, index) => {
    if (isCategorizedText(part)) {
      if (buffer.length === 0) bufferStartIndex = index;
      buffer.push(part);
      return;
    }
    flushBuffer();
    nodes.push(renderSummaryPart(part, index, t, onSubtitleClick));
  });
  flushBuffer();

  return nodes;
};

// ── Summary part renderer (uncategorized / non-text parts) ────────────────────
const renderSummaryPart = (
  part: SummaryPart,
  index: number,
  t: TFunction,
  onSubtitleClick: (id: string) => void
) => {
  switch (part.type) {
    case "text":
      return (
        <p
          key={index}
          className="text-base text-content-secondary leading-relaxed whitespace-pre-wrap"
        >
          {t(part.content || "")}
        </p>
      );
    case "subtitle":
      return (
        <div key={index} id={part.id} className="mt-8 mb-3 scroll-mt-24">
          <h3
            onClick={() => onSubtitleClick(part.id)}
            className="text-xl font-bold text-content inline-block cursor-pointer hover:text-content-tertiary transition-colors duration-150"
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
            className="rounded-modal shadow-md border border-line mx-auto"
            style={{ width: part.width ?? "80%", aspectRatio: part.ratio }}
            crossOrigin="anonymous"
          />
          {part.caption && (
            <figcaption className="text-sm text-content-muted mt-3">
              {t(part.caption)}
            </figcaption>
          )}
        </figure>
      );
    case "image-group":
      return (
        <div
          key={index}
          className="flex flex-col sm:flex-row my-6 gap-4 justify-center items-start mx-auto"
          style={{ width: part.width ?? "100%" }}
        >
          {part.images.map((image, imgIndex) => (
            <figure
              key={imgIndex}
              className={`text-center ${!image.width ? "flex-1" : ""}`}
              style={{ width: image.width }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="rounded-modal shadow-md border border-line mx-auto w-full"
                style={{ aspectRatio: image.ratio }}
                crossOrigin="anonymous"
              />
              {image.caption && (
                <figcaption className="text-sm text-content-muted mt-3">
                  {t(image.caption)}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      );
    case "link":
      return (
        <div key={index}>
          <ExternalLink
            href={part.href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-content underline hover:no-underline transition-colors"
          >
            {part.label}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </ExternalLink>
        </div>
      );
    default:
      return null;
  }
};

// ── Link button ────────────────────────────────────────────────────────────────
const LinkButton: React.FC<{ href: string; label: string; primary?: boolean }> = ({ href, label, primary }) => (
  <ExternalLink
    href={href}
    className={`inline-flex items-center gap-2 rounded-modal px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
      primary
        ? "bg-slate-900 text-white hover:bg-slate-700"
        : "border border-line bg-surface text-content-secondary hover:border-slate-400 hover:bg-surface-subtle"
    }`}
  >
    {label}
    <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  </ExternalLink>
);

// ── Main component ─────────────────────────────────────────────────────────────
const TotalSummaryComponent: React.FC<TotalSummaryComponentProps> = ({ project, t, projectId }) => {
  const { toast, copy } = useCopyToClipboardWithToast();

  const handleCopyLink = (sectionId: string) => {
    const urlToCopy = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    void copy(urlToCopy, {
      success: t("linkCopied", { ns: "common" }),
      failure: t("linkCopyFailed", { ns: "common" }),
    });
  };

  const { overview } = project;

  return (
    <>
      <div className="px-6 sm:px-10 py-8">

        {/* ── Overview ── */}
        <section className="mb-10">
          {/* Live demo: 라이브러리 프로젝트는 개요 칸 제일 위에 실제 라이브러리를 임베드 */}
          {projectId === "react-stable-timeline" && (
            <div className="mb-6">
              <ReactStableTimelineDemo />
            </div>
          )}

          <p className="text-xs font-semibold uppercase tracking-widest text-content-muted mb-5">
            {t("projectDetail.overview", { ns: "common" })}
          </p>

          {/* Links */}
          {(overview.github || overview.demo || overview.notion) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {overview.github && (
                <LinkButton href={overview.github} label="GitHub" />
              )}
              {overview.demo && (
                <LinkButton href={overview.demo} label="Demo" primary />
              )}
              {overview.notion && (
                <LinkButton href={overview.notion} label="Notion" />
              )}
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {overview.period && (
              <InfoCell
                label={t("projectDetail.period", { ns: "common" })}
                value={overview.period}
                className="rounded-modal py-4"
                valueClassName="text-content-strong leading-snug"
              />
            )}
            {overview.projectType && (
              <InfoCell
                label={t("projectDetail.overview", { ns: "common" })}
                value={t(overview.projectType)}
                className="rounded-modal py-4"
                valueClassName="text-content-strong leading-snug"
              />
            )}
            {overview.role && (
              <InfoCell
                label={t("projectDetail.role", { ns: "common" })}
                value={t(overview.role)}
                className="rounded-modal py-4"
                valueClassName="text-content-strong leading-snug"
              />
            )}
            {overview.other && (
              <div className="col-span-2 sm:col-span-3 rounded-modal bg-amber-50 border border-amber-100 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">🏆</p>
                <p className="text-sm font-medium text-content-strong">{t(overview.other)}</p>
              </div>
            )}
          </div>

          {/* Introduction */}
          {overview.introduction && (
            <p className="text-sm text-content-meta leading-relaxed mb-5 px-1">
              {t(overview.introduction)}
            </p>
          )}

          {/* Features */}
          {overview.features && (
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-content-muted mb-2">
                {t("projectDetail.features", { ns: "common" })}
              </p>
              <p className="text-sm text-content-secondary px-1">{t(overview.features)}</p>
            </div>
          )}

          {/* Tech stack */}
          {overview.techStack && overview.techStack.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-content-muted mb-2">
                {t("projectDetail.techStack", { ns: "common" })}
              </p>
              <div className="flex flex-wrap gap-1.5 px-1">
                {overview.techStack.map((tech) => (
                  <Chip key={tech} tone="outlined" size="mdWide" weight="medium">
                    {tech}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* Architecture */}
          {overview.architecture && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-content-muted mb-3">
                {t("projectDetail.architecture", { ns: "common" })}
              </p>
              <img
                src={overview.architecture}
                alt="Architecture"
                className="w-full rounded-modal shadow-sm border border-line"
              />
            </div>
          )}
        </section>

        <div className="border-t border-line mb-8" />

        {/* ── Summaries ── */}
        {project.summaries.map((section, sectionIndex) => (
          <React.Fragment key={section.id}>
            <section id={section.id} className="mb-10 scroll-mt-24">
              {section.parts.map((partGroup, groupIndex) => (
                <div key={groupIndex} className="mb-6 space-y-4">
                  {groupIndex === 0 && (
                    <h2 className="text-xl font-bold text-content mb-4">
                      {t(section.title || "")}
                    </h2>
                  )}
                  {renderPartGroup(partGroup, t, handleCopyLink)}
                </div>
              ))}
            </section>
            {sectionIndex < project.summaries.length - 1 && (
              <div className="border-t border-line mb-8" />
            )}
          </React.Fragment>
        ))}
      </div>

      <ToastNotification
        message={toast.message ?? ""}
        isSuccess={toast.isSuccess}
        show={toast.message !== null}
      />
    </>
  );
};

export default TotalSummaryComponent;
