import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  loadResumeBuilderData,
  type ResumeBuilderData,
  type ResumeEditableBlock,
  type ResumeProjectEntry,
} from "../../utils/resumePreview";
import Seo from "../../components/Seo";
import { SEO_COPY, pickSeoLocale } from "../../seo-copy";
import {
  cloneResumeData,
  groupBlocksBySection,
  linkOrder,
  projectLinkOrder,
} from "./helpers";
import {
  CollapsibleEditorSection,
  CollapsibleSubItem,
  FieldLabel,
  InputField,
  SectionHeading,
  TextAreaField,
} from "./editor";
import { DetailPreviewItem } from "./preview";
import { useSidebarPin } from "./useSidebarPin";
import { useResumeDraftUpdaters } from "./useResumeDraftUpdaters";
import { useResumeSelectors } from "./useResumeSelectors";
import { useToggleSet } from "../../hooks/useToggleSet";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ExternalLink from "../../components/primitives/ExternalLink";
import ModalShell from "../../components/primitives/ModalShell";
import { usePrerenderReadyEvent } from "../../hooks/usePrerenderReadyEvent";

const ResumePreviewPage: React.FC = () => {
  const { t, i18n } = useTranslation("common");
  const seoLocale = pickSeoLocale(i18n.language);
  const seo = SEO_COPY[seoLocale].resume;
  const resumeSection = SEO_COPY[seoLocale].sections.resume;
  const [sourceData, setSourceData] = useState<ResumeBuilderData | null>(null);
  const [draft, setDraft] = useState<ResumeBuilderData | null>(null);
  const selectedBlockIds = useToggleSet<string>();
  const includedProjectIds = useToggleSet<string>();
  const { reset: resetSelectedBlockIds } = selectedBlockIds;
  const { reset: resetIncludedProjectIds } = includedProjectIds;
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const closedSubPanels = useToggleSet<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { asideRef, sidebarColumnRef, isSidebarPinned, pinnedTop, togglePin } = useSidebarPin();
  // 사이드바를 옆에 배치할 수 있는 폭(Tailwind xl 이상)에서는 사이드바로,
  // 그 미만(모바일·태블릿)에서는 플로팅 버튼 + 모달로 편집 패널을 제공
  const canShowSidebar = useMediaQuery("(min-width: 1280px)");
  const {
    isOpen: isEditorModalOpen,
    open: openEditorModal,
    close: closeEditorModal,
  } = useDisclosure(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const loadedData = await loadResumeBuilderData(i18n.resolvedLanguage || i18n.language);
        if (!isMounted) return;

        setSourceData(loadedData);
        setDraft(cloneResumeData(loadedData));
        resetSelectedBlockIds(loadedData.defaultSelectedBlockIds);
        resetIncludedProjectIds(loadedData.defaultIncludedProjectIds);
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setErrorMessage(t("resume.downloadFailed"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [i18n.language, i18n.resolvedLanguage, resetIncludedProjectIds, resetSelectedBlockIds, t]);

  usePrerenderReadyEvent(!isLoading);

  const resetDraft = () => {
    if (!sourceData) return;
    setDraft(cloneResumeData(sourceData));
    resetSelectedBlockIds(sourceData.defaultSelectedBlockIds);
    resetIncludedProjectIds(sourceData.defaultIncludedProjectIds);
  };

  const {
    updateProfileField,
    updateProfileLink,
    updateIntroLine,
    updateIntroBullet,
    updateWorkBlock,
    updateWorkBlockDetailItem,
    updateProjectSummary,
    updateProjectBlock,
    updateProjectBlockDetailItem,
  } = useResumeDraftUpdaters(setDraft);

  const { selectedWorkBlocks, includedProjects, selectedProjectBlocks } = useResumeSelectors(
    draft,
    selectedBlockIds.ids,
    includedProjectIds.ids,
  );

  const togglePanel = (panelId: string) => {
    setOpenPanel((prev) => (prev === panelId ? null : panelId));
  };

  const isSubPanelOpen = (subId: string) => !closedSubPanels.has(subId);

  const resumeSeo = (
    <Seo
      section={resumeSection}
      description={seo.description}
      keywords={seo.keywords}
      path="/resume-preview"
      locale={seoLocale}
      type="profile"
    />
  );

  if (isLoading) {
    return (
      <>
      {resumeSeo}
      <section className="min-h-screen bg-slate-100 px-4 pt-28 pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="h-10 w-56 rounded-2xl bg-slate-200 animate-pulse mb-6" />
          <div className="grid gap-6 xl:grid-cols-[24rem_1fr]">
            <div className="h-[70vh] rounded-paper-edge-lg bg-slate-200 animate-pulse" />
            <div className="flex min-w-0 justify-center">
              <div className="h-[297mm] w-full max-w-[210mm] rounded-paper-edge-lg bg-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
      </>
    );
  }

  if (!draft) {
    return (
      <>
      {resumeSeo}
      <section className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="rounded-paper-edge-lg border border-slate-200 bg-white px-8 py-10 text-center shadow-lg">
          <p className="text-sm text-slate-500 mb-3">{errorMessage || t("resume.downloadFailed")}</p>
          <Link
            to="/"
            state={{ activeTab: "profile" }}
            className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            {t("resume.backToProfile")}
          </Link>
        </div>
      </section>
      </>
    );
  }

  const developmentLabel = String(t("highlight.section.development"));
  const aiUsageLabel = String(t("highlight.section.aiUsage"));
  const workSectionOrder = [developmentLabel, aiUsageLabel];

  // detailItems 가 있으면 label/value 그리드로, 없으면 body 텍스트로 렌더.
  // 경력 highlight 와 프로젝트 highlight 가 동일한 미리보기 모양을 공유한다.
  const renderPreviewBlock = (block: ResumeEditableBlock) => {
    if (block.detailItems?.length) {
      return (
        <div key={block.id} className="resume-preview-block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <h4 className="text-[13px] font-bold text-slate-900">{block.title}</h4>
          <div className="mt-1.5 space-y-1.5">
            {block.detailItems.map((item) => (
              <DetailPreviewItem key={`${block.id}-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      );
    }
    return (
      <div key={block.id} className="resume-preview-block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <h4 className="text-[13px] font-bold text-slate-900">{block.title}</h4>
        <div className="mt-1 space-y-1">
          {block.body
            .split("\n")
            .filter((line) => line.trim())
            .map((line, index) => (
              <p key={`${block.id}-${index}`} className="text-[12.5px] leading-[1.42] text-slate-700 whitespace-pre-wrap">
                {line}
              </p>
            ))}
        </div>
      </div>
    );
  };

  const renderProjectLinks = (project: ResumeProjectEntry) =>
    projectLinkOrder
      .map((key) => {
        const href = project.links[key];
        if (!href) return null;

        const label =
          key === "github"
            ? t("projectDetail.github")
            : key === "notion"
              ? t("projectDetail.notion")
              : "Demo";

        return (
          <ExternalLink
            key={`${project.id}-${key}`}
            href={href}
            className="text-xs font-medium text-slate-600 underline underline-offset-2"
          >
            {label}: {href}
          </ExternalLink>
        );
      })
      .filter(Boolean);

  // 편집 섹션 묶음 — 데스크톱에서는 사이드바(aside)에, 모바일에서는 플로팅 버튼으로 여는
  // 모달(ModalShell)에 동일하게 렌더링한다.
  const editorSections = (
    <>
            <CollapsibleEditorSection
              title={t("resume.builder.basics")}
              isOpen={openPanel === "basics"}
              onToggle={() => togglePanel("basics")}
            >
              <div className="space-y-3.5">
                <div>
                  <FieldLabel>{t("resume.builder.name")}</FieldLabel>
                  <InputField value={draft.profile.name} onChange={(e) => updateProfileField("name", e.target.value)} />
                </div>
                <div>
                  <FieldLabel>{t("resume.builder.targetRole")}</FieldLabel>
                  <InputField
                    value={draft.profile.targetRole}
                    onChange={(e) => updateProfileField("targetRole", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>{t("resume.builder.email")}</FieldLabel>
                  <InputField value={draft.profile.email} onChange={(e) => updateProfileField("email", e.target.value)} />
                </div>
                <div>
                  <FieldLabel>{t("resume.builder.phone")}</FieldLabel>
                  <InputField value={draft.profile.phone} onChange={(e) => updateProfileField("phone", e.target.value)} />
                </div>
                <div>
                  <FieldLabel>{t("resume.builder.links")}</FieldLabel>
                  <div className="space-y-2.5">
                    {linkOrder.map((key) => (
                      <InputField
                        key={key}
                        value={draft.profile.links[key] ?? ""}
                        onChange={(e) => updateProfileLink(key, e.target.value)}
                        placeholder={t(`resume.linkLabel.${key}`, { defaultValue: key })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleEditorSection>

            <CollapsibleEditorSection
              title={t("resume.builder.intro")}
              isOpen={openPanel === "intro"}
              onToggle={() => togglePanel("intro")}
            >
              <div className="space-y-3.5">
                <div>
                  <FieldLabel>{t("resume.builder.introLine")}</FieldLabel>
                  <TextAreaField
                    rows={3}
                    value={draft.profile.intro.line}
                    onChange={(e) => updateIntroLine(e.target.value)}
                  />
                </div>
                {draft.profile.intro.bullets.map((bullet, index) => (
                  <div key={`bullet-${index}`}>
                    <FieldLabel>
                      {t("resume.builder.introBullets")} {index + 1}
                    </FieldLabel>
                    <TextAreaField
                      rows={3}
                      value={bullet.text}
                      onChange={(e) => updateIntroBullet(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CollapsibleEditorSection>

            <CollapsibleEditorSection
              title={t("resume.builder.workBlocks")}
              isOpen={openPanel === "workBlocks"}
              onToggle={() => togglePanel("workBlocks")}
            >
              <div className="space-y-3">
                {draft.workExperience.map((work) => (
                  <CollapsibleSubItem
                    key={work.id}
                    isOpen={isSubPanelOpen(`work-${work.id}`)}
                    onToggle={() => closedSubPanels.toggle(`work-${work.id}`)}
                    header={
                      <>
                        <p className="text-sm font-bold text-slate-900">{work.title}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {work.position} · {work.period}
                        </p>
                      </>
                    }
                  >
                    <div className="space-y-2.5">
                      {work.projects.map((project) => (
                        <div key={project.id}>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {project.name}
                          </p>
                          <div className="mt-1.5 space-y-2">
                            {groupBlocksBySection(project.blocks, workSectionOrder).map((group) => (
                              <div key={`${project.id}-${group.key}`}>
                                {group.label && (
                                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    {group.label}
                                  </p>
                                )}
                                <div className="space-y-1.5">
                                  {group.blocks.map((block) => (
                                    <label
                                      key={block.id}
                                      className="flex gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedBlockIds.has(block.id)}
                                        onChange={() => selectedBlockIds.toggle(block.id)}
                                        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900"
                                      />
                                      <span className="block">
                                        <span className="block font-semibold text-slate-900">{block.title}</span>
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSubItem>
                ))}
              </div>
            </CollapsibleEditorSection>

            <CollapsibleEditorSection
              title={t("resume.builder.projectBlocks")}
              isOpen={openPanel === "projectBlocks"}
              onToggle={() => togglePanel("projectBlocks")}
            >
              <div className="space-y-3">
                {draft.projects.map((project) => {
                  const projOpen = isSubPanelOpen(`proj-${project.id}`);
                  const projIncluded = includedProjectIds.has(project.id);
                  return (
                  <div key={project.id} className="rounded-2xl border border-slate-200 bg-white">
                    <div className="flex items-start gap-3 p-3.5">
                      <input
                        type="checkbox"
                        checked={projIncluded}
                        onChange={() => includedProjectIds.toggle(project.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => closedSubPanels.toggle(`proj-${project.id}`)}
                        className="flex flex-1 items-start justify-between gap-2.5 text-left"
                      >
                        <span>
                          <span className="block font-semibold text-slate-900">{project.title}</span>
                          <span className="mt-0.5 block text-xs text-slate-500">
                            {t("resume.builder.includeProject")} · {project.projectType}
                          </span>
                        </span>
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
                          <svg
                            className={`h-3 w-3 transition-transform duration-200 ${projOpen ? "rotate-180" : ""}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </span>
                      </button>
                    </div>
                    {projOpen && projIncluded && (
                      <div className="space-y-1.5 px-3.5 pb-3.5">
                        {project.blocks.map((block) => (
                          <label
                            key={block.id}
                            className="flex gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700"
                          >
                            <input
                              type="checkbox"
                              checked={selectedBlockIds.has(block.id)}
                              onChange={() => selectedBlockIds.toggle(block.id)}
                              className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900"
                            />
                            <span>
                              <span className="block font-semibold text-slate-900">{block.title}</span>
                              {block.sectionLabel && (
                                <span className="mt-0.5 block text-xs text-slate-500">{block.sectionLabel}</span>
                              )}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </CollapsibleEditorSection>

            <CollapsibleEditorSection
              title={t("resume.builder.selectedCopy")}
              isOpen={openPanel === "selectedCopy"}
              onToggle={() => togglePanel("selectedCopy")}
            >
              <div className="space-y-4">
                {includedProjects.map((project) => (
                  <CollapsibleSubItem
                    key={`summary-${project.id}`}
                    isOpen={isSubPanelOpen(`summary-${project.id}`)}
                    onToggle={() => closedSubPanels.toggle(`summary-${project.id}`)}
                    header={
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        {project.title} · {t("resume.builder.projectSummary")}
                      </span>
                    }
                  >
                    <TextAreaField
                      rows={4}
                      value={project.summary}
                      onChange={(e) => updateProjectSummary(project.id, e.target.value)}
                    />
                  </CollapsibleSubItem>
                ))}

                {selectedWorkBlocks.map(({ block, projectName }) => (
                  <CollapsibleSubItem
                    key={`editor-${block.id}`}
                    isOpen={isSubPanelOpen(`sw-${block.id}`)}
                    onToggle={() => closedSubPanels.toggle(`sw-${block.id}`)}
                    header={
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {projectName}
                        </p>
                        {block.sectionLabel && (
                          <p className="mt-1.5 inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            {block.sectionLabel}
                          </p>
                        )}
                        <p className="mt-1.5 text-sm font-semibold text-slate-900">{block.title}</p>
                      </div>
                    }
                  >
                    <div>
                      <FieldLabel>{t("resume.builder.title")}</FieldLabel>
                      <InputField value={block.title} onChange={(e) => updateWorkBlock(block.id, "title", e.target.value)} />
                    </div>
                    {block.detailItems?.length ? (
                      <div className="mt-3 space-y-3">
                        {block.detailItems.map((item) => (
                          <div key={`${block.id}-${item.id}`}>
                            <FieldLabel>{item.label}</FieldLabel>
                            <TextAreaField
                              rows={3}
                              value={item.value}
                              onChange={(e) => updateWorkBlockDetailItem(block.id, item.id, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3">
                        <FieldLabel>{t("resume.builder.body")}</FieldLabel>
                        <TextAreaField
                          rows={6}
                          value={block.body}
                          onChange={(e) => updateWorkBlock(block.id, "body", e.target.value)}
                        />
                      </div>
                    )}
                  </CollapsibleSubItem>
                ))}

                {selectedProjectBlocks.map(({ block, projectName }) => (
                  <CollapsibleSubItem
                    key={`editor-${block.id}`}
                    isOpen={isSubPanelOpen(`sp-${block.id}`)}
                    onToggle={() => closedSubPanels.toggle(`sp-${block.id}`)}
                    header={
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {projectName}
                        </p>
                        <p className="mt-1.5 text-sm font-semibold text-slate-900">{block.title}</p>
                      </div>
                    }
                  >
                    <div>
                      <FieldLabel>{t("resume.builder.title")}</FieldLabel>
                      <InputField
                        value={block.title}
                        onChange={(e) => updateProjectBlock(block.id, "title", e.target.value)}
                      />
                    </div>
                    {block.detailItems?.length ? (
                      <div className="mt-3 space-y-3">
                        {block.detailItems.map((item) => (
                          <div key={`${block.id}-${item.id}`}>
                            <FieldLabel>{item.label}</FieldLabel>
                            <TextAreaField
                              rows={3}
                              value={item.value}
                              onChange={(e) => updateProjectBlockDetailItem(block.id, item.id, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3">
                        <FieldLabel>{t("resume.builder.body")}</FieldLabel>
                        <TextAreaField
                          rows={6}
                          value={block.body}
                          onChange={(e) => updateProjectBlock(block.id, "body", e.target.value)}
                        />
                      </div>
                    )}
                  </CollapsibleSubItem>
                ))}

                {selectedWorkBlocks.length === 0 && selectedProjectBlocks.length === 0 && includedProjects.length === 0 && (
                  <p className="text-sm text-slate-500">{t("resume.builder.empty")}</p>
                )}
              </div>
            </CollapsibleEditorSection>
    </>
  );

  return (
    <>
    {resumeSeo}
    <section className="min-h-screen bg-[#dfe5ec] print:bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-28 pb-10 print:px-0 print:pt-0">
        <div data-print-hidden="true" className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">{t("resume.heading")}</h1>
            <p className="mt-1.5 text-sm text-slate-600">{t("resume.helper")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              state={{ activeTab: "profile" }}
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm"
            >
              {t("resume.backToProfile")}
            </Link>
            <button
              type="button"
              onClick={resetDraft}
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm"
            >
              {t("resume.resetDraft")}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              {t("resume.savePdf")}
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[23rem_1fr] print:block">
          {canShowSidebar && (
            <div ref={sidebarColumnRef} className="min-w-0 xl:relative">
              <aside
                ref={asideRef}
                data-print-hidden="true"
                className={`space-y-4 ${
                  isSidebarPinned
                    ? "xl:absolute xl:left-0 xl:w-full"
                    : "xl:sticky xl:top-24"
                }`}
                style={
                  isSidebarPinned && pinnedTop !== null
                    ? { top: pinnedTop }
                    : undefined
                }
              >
                <label className="hidden xl:flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm">
                  <input
                    type="checkbox"
                    checked={isSidebarPinned}
                    onChange={(e) => togglePin(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-slate-900"
                  />
                  {t("resume.pinSidebar")}
                </label>
                {editorSections}
              </aside>
            </div>
          )}

          <div className="flex min-w-0 justify-center print:block">
            <article className="resume-preview-page w-full max-w-[210mm] min-h-[297mm] rounded-paper-edge-lg bg-white px-6 py-5 shadow-resume-paper print:w-[210mm] print:rounded-none print:shadow-none">
              <header className="border-b border-slate-200 pb-4">
                <div className="flex flex-wrap items-start justify-between gap-2.5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {t("resume.previewSection.profile")}
                    </p>
                    <h1 className="mt-1.5 text-[2rem] font-bold leading-none tracking-tight text-slate-950">
                      {draft.profile.name}
                    </h1>
                    <p className="mt-1 text-[15px] font-medium text-slate-600">{draft.profile.targetRole}</p>
                  </div>
                  <div className="grid gap-1 text-[13px] text-slate-700">
                    <p>
                      <span className="font-semibold text-slate-950">{t("resume.builder.email")}</span>: {draft.profile.email}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-950">{t("resume.builder.phone")}</span>: {draft.profile.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 grid grid-cols-1 gap-x-4 gap-y-1.5 text-[13px] text-slate-700 sm:grid-cols-2 print:grid-cols-2">
                  {linkOrder.map((key) =>
                    draft.profile.links[key] ? (
                      <div
                        key={`preview-link-${key}`}
                        className="grid min-w-0 grid-cols-[5.8rem_minmax(0,1fr)] items-start gap-x-2"
                      >
                        <span className="whitespace-nowrap font-semibold text-slate-950">
                          {t(`resume.linkLabel.${key}`, { defaultValue: key })}
                        </span>
                        <span className="min-w-0 break-all">: {draft.profile.links[key]}</span>
                      </div>
                    ) : null
                  )}
                </div>

                <p className="mt-4 text-[14px] leading-[1.45] text-slate-700">{draft.profile.intro.line}</p>
                <ul className="mt-2.5 space-y-1 pl-4">
                  {draft.profile.intro.bullets.map((bullet, index) => (
                    <li key={`preview-bullet-${index}`} className="text-[12.5px] leading-[1.42] text-slate-700">
                      {bullet.text}
                    </li>
                  ))}
                </ul>
              </header>

              <div className="mt-4 space-y-4">
                <section className="resume-preview-section">
                  <SectionHeading>{t("resume.previewSection.workExperience")}</SectionHeading>
                  <div className="mt-2.5 space-y-3">
                    {draft.workExperience.map((work) => {
                      const visibleProjects = work.projects
                        .map((project) => ({
                          ...project,
                          blocks: project.blocks.filter((block) => selectedBlockIds.has(block.id)),
                        }))
                        .filter((project) => project.blocks.length > 0);

                      if (visibleProjects.length === 0 && work.projects.length > 0) {
                        return null;
                      }

                      return (
                        <div
                          key={`preview-work-${work.id}`}
                          className="resume-preview-card rounded-paper-edge border border-slate-200 bg-white px-3.5 py-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="text-[16px] font-bold leading-tight text-slate-950">{work.title}</h3>
                              <p className="mt-0.5 text-[13px] font-medium text-slate-600">{work.position}</p>
                            </div>
                            <p className="text-[13px] font-medium text-slate-500">{work.period}</p>
                          </div>

                          <div className="mt-2.5 space-y-2.5">
                            {visibleProjects.map((project) => (
                              <div key={`preview-work-project-${project.id}`}>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-[13px] font-semibold text-slate-900">{project.name}</p>
                                  {project.tech.map((tech) => (
                                    <span
                                      key={`${project.id}-${tech}`}
                                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                                <div className="mt-2 space-y-2.5">
                                  {groupBlocksBySection(project.blocks, workSectionOrder).map((group) => (
                                    <div key={`preview-work-group-${project.id}-${group.key}`}>
                                      {group.label && (
                                        <p className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                          {group.label}
                                        </p>
                                      )}
                                      <div className="mt-1.5 space-y-1.5">
                                        {group.blocks.map((block) => renderPreviewBlock(block))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="resume-preview-section">
                  <SectionHeading>{t("resume.previewSection.projects")}</SectionHeading>
                  <div className="mt-2.5 space-y-3">
                    {includedProjects.map((project) => (
                      <div
                        key={`preview-project-${project.id}`}
                        className="resume-preview-card rounded-paper-edge border border-slate-200 bg-white px-3.5 py-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[16px] font-bold leading-tight text-slate-950">{project.title}</h3>
                            <p className="mt-0.5 text-[13px] font-medium text-slate-600">{project.projectType}</p>
                          </div>
                          <p className="text-[13px] font-medium text-slate-500">{project.period}</p>
                        </div>

                        {project.summary && (
                          <p className="mt-2.5 text-[12.5px] leading-[1.42] text-slate-700 whitespace-pre-wrap">
                            {project.summary}
                          </p>
                        )}

                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {project.techStack.map((tech) => (
                            <span
                              key={`${project.id}-tech-${tech}`}
                              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="mt-2.5 flex flex-col gap-0.5">
                          {renderProjectLinks(project)}
                        </div>

                        <div className="mt-2.5 space-y-2">
                          {project.blocks
                            .filter((block) => selectedBlockIds.has(block.id))
                            .map((block) => renderPreviewBlock(block))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="resume-preview-section">
                  <SectionHeading>{t("resume.previewSection.education")}</SectionHeading>
                  <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                    {draft.education.map((item) => (
                      <div
                        key={`preview-education-${item.id}`}
                        className="resume-preview-card rounded-paper-edge border border-slate-200 bg-white px-3.5 py-3"
                      >
                        <h3 className="text-[15px] font-bold leading-tight text-slate-950">{item.title}</h3>
                        <p className="mt-0.5 text-[12.5px] text-slate-700">{item.major}</p>
                        <p className="mt-1 text-[12.5px] text-slate-500">{item.grade}</p>
                        <p className="mt-2 text-[12.5px] font-medium text-slate-500">{item.period}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="resume-preview-section">
                  <SectionHeading>{t("resume.previewSection.skills")}</SectionHeading>
                  <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                    {draft.skills.map((skillGroup) => (
                      <div
                        key={`preview-skill-${skillGroup.category}`}
                        className="resume-preview-card rounded-paper-edge border border-slate-200 bg-white px-3.5 py-3"
                      >
                        <p className="text-[13px] font-semibold text-slate-900">{skillGroup.label}</p>
                        <p className="mt-1 text-[12.5px] leading-[1.42] text-slate-700">{skillGroup.items.join(", ")}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="resume-preview-section">
                  <SectionHeading>{t("resume.previewSection.awards")}</SectionHeading>
                  <div className="mt-2.5 space-y-2">
                    {draft.awards.map((award) => (
                      <div
                        key={`preview-award-${award.id}`}
                        className="resume-preview-card rounded-paper-edge border border-slate-200 bg-white px-3.5 py-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="text-[15px] font-bold leading-tight text-slate-950">{award.title}</h3>
                          <p className="text-[12.5px] font-medium text-slate-500">{award.period}</p>
                        </div>
                        <ul className="mt-2 space-y-1 pl-4">
                          {award.description.map((description, index) => (
                            <li
                              key={`preview-award-${award.id}-${index}`}
                              className="text-[12.5px] leading-[1.42] text-slate-700"
                            >
                              {description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="resume-preview-section">
                  <SectionHeading>{t("resume.previewSection.certificates")}</SectionHeading>
                  <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
                    {draft.certificates.map((certificate) => (
                      <div
                        key={`preview-cert-${certificate.id}`}
                        className="resume-preview-card rounded-paper-edge border border-slate-200 bg-white px-3.5 py-3"
                      >
                        <h3 className="text-[13px] font-bold leading-tight text-slate-950">{certificate.title}</h3>
                        <p className="mt-2 text-[12.5px] font-medium text-slate-500">{certificate.period}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {draft.languages.length > 0 && (
                  <section className="resume-preview-section">
                    <SectionHeading>{t("resume.previewSection.languages")}</SectionHeading>
                    <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                      {draft.languages.map((language) => (
                        <div
                          key={`preview-language-${language.id}`}
                          className="resume-preview-card rounded-paper-edge border border-slate-200 bg-white px-3.5 py-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <h3 className="text-[15px] font-bold leading-tight text-slate-950">{language.title}</h3>
                            <p className="text-[12.5px] font-medium text-slate-500">{language.period}</p>
                          </div>
                          <p className="mt-2 text-[12.5px] leading-[1.42] text-slate-700">{language.score}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </article>
          </div>
        </div>
      </div>

      {!canShowSidebar && (
        <button
          type="button"
          data-print-hidden="true"
          onClick={openEditorModal}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-xl"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
          {t("resume.editDraft")}
        </button>
      )}

      <ModalShell
        isOpen={!canShowSidebar && isEditorModalOpen}
        onClose={closeEditorModal}
        className="fixed inset-x-3 bottom-3 top-24 mx-auto max-w-xl flex flex-col overflow-hidden"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-3.5 py-3">
          <h2 className="text-lg font-bold text-slate-950">{t("resume.editDraft")}</h2>
          <button
            type="button"
            onClick={closeEditorModal}
            aria-label={t("resume.closeEditor")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-3.5">{editorSections}</div>
      </ModalShell>
    </section>
    </>
  );
};

export default ResumePreviewPage;
