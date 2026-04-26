import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  loadResumeBuilderData,
  type ResumeBuilderData,
  type ResumeEditableBlock,
  type ResumeProjectEntry,
} from "../utils/resumePreview";

const linkOrder = ["website", "blog", "github", "linkedin"];
const projectLinkOrder = ["github", "demo", "notion"];

const cloneResumeData = (data: ResumeBuilderData): ResumeBuilderData =>
  JSON.parse(JSON.stringify(data)) as ResumeBuilderData;

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{children}</h2>
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
    {children}
  </label>
);

const CollapsibleEditorSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => (
  <section className="rounded-[2rem] border border-slate-200 bg-[#f7f8fb] p-5 shadow-lg">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 text-left"
    >
      <SectionHeading>{title}</SectionHeading>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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

    {isOpen && <div className="mt-4">{children}</div>}
  </section>
);

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${props.className ?? ""}`}
  />
);

const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${props.className ?? ""}`}
  />
);

const ResumePreviewPage: React.FC = () => {
  const { t, i18n } = useTranslation("common");
  const [sourceData, setSourceData] = useState<ResumeBuilderData | null>(null);
  const [draft, setDraft] = useState<ResumeBuilderData | null>(null);
  const [selectedBlockIds, setSelectedBlockIds] = useState<Set<string>>(new Set());
  const [includedProjectIds, setIncludedProjectIds] = useState<Set<string>>(new Set());
  const [openPanels, setOpenPanels] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
        setSelectedBlockIds(new Set(loadedData.defaultSelectedBlockIds));
        setIncludedProjectIds(new Set(loadedData.defaultIncludedProjectIds));
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
  }, [i18n.language, i18n.resolvedLanguage, t]);

  const resetDraft = () => {
    if (!sourceData) return;
    setDraft(cloneResumeData(sourceData));
    setSelectedBlockIds(new Set(sourceData.defaultSelectedBlockIds));
    setIncludedProjectIds(new Set(sourceData.defaultIncludedProjectIds));
  };

  const updateProfileField = (field: "name" | "targetRole" | "email" | "phone", value: string) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            profile: {
              ...prev.profile,
              [field]: value,
            },
          }
        : prev
    );
  };

  const updateProfileLink = (key: string, value: string) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            profile: {
              ...prev.profile,
              links: {
                ...prev.profile.links,
                [key]: value,
              },
            },
          }
        : prev
    );
  };

  const updateIntroLine = (value: string) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            profile: {
              ...prev.profile,
              intro: {
                ...prev.profile.intro,
                line: value,
              },
            },
          }
        : prev
    );
  };

  const updateIntroBullet = (index: number, value: string) => {
    setDraft((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        profile: {
          ...prev.profile,
          intro: {
            ...prev.profile.intro,
            bullets: prev.profile.intro.bullets.map((bullet, bulletIndex) =>
              bulletIndex === index ? { ...bullet, text: value } : bullet
            ),
          },
        },
      };
    });
  };

  const updateWorkBlock = (blockId: string, field: "title" | "body", value: string) => {
    setDraft((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        workExperience: prev.workExperience.map((work) => ({
          ...work,
          projects: work.projects.map((project) => ({
            ...project,
            blocks: project.blocks.map((block) =>
              block.id === blockId
                ? {
                    ...block,
                    [field]: value,
                  }
                : block
            ),
          })),
        })),
      };
    });
  };

  const updateProjectSummary = (projectId: string, value: string) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            projects: prev.projects.map((project) =>
              project.id === projectId
                ? {
                    ...project,
                    summary: value,
                  }
                : project
            ),
          }
        : prev
    );
  };

  const updateProjectBlock = (blockId: string, field: "title" | "body", value: string) => {
    setDraft((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        projects: prev.projects.map((project) => ({
          ...project,
          blocks: project.blocks.map((block) =>
            block.id === blockId
              ? {
                  ...block,
                  [field]: value,
                }
              : block
          ),
        })),
      };
    });
  };

  const toggleBlock = (blockId: string) => {
    setSelectedBlockIds((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) next.delete(blockId);
      else next.add(blockId);
      return next;
    });
  };

  const toggleIncludedProject = (projectId: string) => {
    setIncludedProjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  };

  const togglePanel = (panelId: string) => {
    setOpenPanels((prev) => {
      const next = new Set(prev);
      if (next.has(panelId)) next.delete(panelId);
      else next.add(panelId);
      return next;
    });
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-slate-100 px-4 pt-28 pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="h-10 w-56 rounded-2xl bg-slate-200 animate-pulse mb-6" />
          <div className="grid gap-6 xl:grid-cols-[24rem_1fr]">
            <div className="h-[70vh] rounded-[2rem] bg-slate-200 animate-pulse" />
            <div className="flex justify-center">
              <div className="h-[297mm] w-[210mm] max-w-full rounded-[2rem] bg-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!draft) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white px-8 py-10 text-center shadow-lg">
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
    );
  }

  const selectedWorkBlocks = draft.workExperience.flatMap((work) =>
    work.projects.flatMap((project) =>
      project.blocks
        .filter((block) => selectedBlockIds.has(block.id))
        .map((block) => ({
          workId: work.id,
          projectId: project.id,
          projectName: project.name,
          block,
        }))
    )
  );

  const includedProjects = draft.projects.filter((project) => includedProjectIds.has(project.id));
  const selectedProjectBlocks = includedProjects.flatMap((project) =>
    project.blocks
      .filter((block) => selectedBlockIds.has(block.id))
      .map((block) => ({
        projectId: project.id,
        projectName: project.title,
        block,
      }))
  );

  const renderPreviewBlock = (block: ResumeEditableBlock) => (
    <div key={block.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <h4 className="text-sm font-bold text-slate-900">{block.title}</h4>
      <div className="mt-2 space-y-2">
        {block.body
          .split("\n")
          .filter((line) => line.trim())
          .map((line, index) => (
            <p key={`${block.id}-${index}`} className="text-sm leading-6 text-slate-700 whitespace-pre-wrap">
              {line}
            </p>
          ))}
      </div>
    </div>
  );

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
          <a
            key={`${project.id}-${key}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-slate-600 underline underline-offset-2"
          >
            {label}: {href}
          </a>
        );
      })
      .filter(Boolean);

  return (
    <section className="min-h-screen bg-[#dfe5ec] print:bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-28 pb-12 print:px-0 print:pt-0">
        <div data-print-hidden="true" className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {t("resume.preview")}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">{t("resume.openPreview")}</h1>
            <p className="mt-2 text-sm text-slate-600">{t("resume.helper")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              state={{ activeTab: "profile" }}
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm"
            >
              {t("resume.backToProfile")}
            </Link>
            <button
              type="button"
              onClick={resetDraft}
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm"
            >
              {t("resume.resetDraft")}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
            >
              {t("resume.savePdf")}
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[24rem_1fr] print:block">
          <aside data-print-hidden="true" className="space-y-5">
            <CollapsibleEditorSection
              title={t("resume.builder.basics")}
              isOpen={openPanels.has("basics")}
              onToggle={() => togglePanel("basics")}
            >
              <div className="space-y-4">
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
                  <div className="space-y-3">
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
              isOpen={openPanels.has("intro")}
              onToggle={() => togglePanel("intro")}
            >
              <div className="space-y-4">
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
              isOpen={openPanels.has("workBlocks")}
              onToggle={() => togglePanel("workBlocks")}
            >
              <div className="space-y-4">
                {draft.workExperience.map((work) => (
                  <div key={work.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-bold text-slate-900">{work.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {work.position} · {work.period}
                    </p>
                    <div className="mt-3 space-y-3">
                      {work.projects.map((project) => (
                        <div key={project.id}>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {project.name}
                          </p>
                          <div className="mt-2 space-y-2">
                            {project.blocks.map((block) => (
                              <label
                                key={block.id}
                                className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedBlockIds.has(block.id)}
                                  onChange={() => toggleBlock(block.id)}
                                  className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900"
                                />
                                <span>
                                  <span className="block font-semibold text-slate-900">{block.title}</span>
                                  {block.sectionLabel && (
                                    <span className="mt-1 block text-xs text-slate-500">{block.sectionLabel}</span>
                                  )}
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
            </CollapsibleEditorSection>

            <CollapsibleEditorSection
              title={t("resume.builder.projectBlocks")}
              isOpen={openPanels.has("projectBlocks")}
              onToggle={() => togglePanel("projectBlocks")}
            >
              <div className="space-y-4">
                {draft.projects.map((project) => (
                  <div key={project.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={includedProjectIds.has(project.id)}
                        onChange={() => toggleIncludedProject(project.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900"
                      />
                      <span>
                        <span className="block font-semibold text-slate-900">{project.title}</span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {t("resume.builder.includeProject")} · {project.projectType}
                        </span>
                      </span>
                    </label>
                    {includedProjectIds.has(project.id) && (
                      <div className="mt-3 space-y-2">
                        {project.blocks.map((block) => (
                          <label
                            key={block.id}
                            className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700"
                          >
                            <input
                              type="checkbox"
                              checked={selectedBlockIds.has(block.id)}
                              onChange={() => toggleBlock(block.id)}
                              className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900"
                            />
                            <span>
                              <span className="block font-semibold text-slate-900">{block.title}</span>
                              {block.sectionLabel && (
                                <span className="mt-1 block text-xs text-slate-500">{block.sectionLabel}</span>
                              )}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleEditorSection>

            <CollapsibleEditorSection
              title={t("resume.builder.selectedCopy")}
              isOpen={openPanels.has("selectedCopy")}
              onToggle={() => togglePanel("selectedCopy")}
            >
              <div className="space-y-5">
                {includedProjects.map((project) => (
                  <div key={`summary-${project.id}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <FieldLabel>
                      {project.title} · {t("resume.builder.projectSummary")}
                    </FieldLabel>
                    <TextAreaField
                      rows={4}
                      value={project.summary}
                      onChange={(e) => updateProjectSummary(project.id, e.target.value)}
                    />
                  </div>
                ))}

                {selectedWorkBlocks.map(({ block, projectName }) => (
                  <div key={`editor-${block.id}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {projectName}
                    </p>
                    <div>
                      <FieldLabel>{t("resume.builder.title")}</FieldLabel>
                      <InputField value={block.title} onChange={(e) => updateWorkBlock(block.id, "title", e.target.value)} />
                    </div>
                    <div className="mt-4">
                      <FieldLabel>{t("resume.builder.body")}</FieldLabel>
                      <TextAreaField
                        rows={6}
                        value={block.body}
                        onChange={(e) => updateWorkBlock(block.id, "body", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                {selectedProjectBlocks.map(({ block, projectName }) => (
                  <div key={`editor-${block.id}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {projectName}
                    </p>
                    <div>
                      <FieldLabel>{t("resume.builder.title")}</FieldLabel>
                      <InputField
                        value={block.title}
                        onChange={(e) => updateProjectBlock(block.id, "title", e.target.value)}
                      />
                    </div>
                    <div className="mt-4">
                      <FieldLabel>{t("resume.builder.body")}</FieldLabel>
                      <TextAreaField
                        rows={6}
                        value={block.body}
                        onChange={(e) => updateProjectBlock(block.id, "body", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                {selectedWorkBlocks.length === 0 && selectedProjectBlocks.length === 0 && includedProjects.length === 0 && (
                  <p className="text-sm text-slate-500">{t("resume.builder.empty")}</p>
                )}
              </div>
            </CollapsibleEditorSection>
          </aside>

          <div className="flex justify-center print:block">
            <article className="resume-preview-page w-[210mm] max-w-full min-h-[297mm] rounded-[2rem] bg-white px-8 py-9 shadow-[0_24px_80px_rgba(15,23,42,0.18)] print:rounded-none print:shadow-none">
              <header className="border-b border-slate-200 pb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      {t("resume.previewSection.profile")}
                    </p>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">{draft.profile.name}</h1>
                    <p className="mt-2 text-lg font-medium text-slate-600">{draft.profile.targetRole}</p>
                  </div>
                  <div className="grid gap-2 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold text-slate-950">{t("resume.builder.email")}</span>: {draft.profile.email}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-950">{t("resume.builder.phone")}</span>: {draft.profile.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700">
                  {linkOrder.map((key) =>
                    draft.profile.links[key] ? (
                      <span key={`preview-link-${key}`}>
                        <span className="font-semibold text-slate-950">
                          {t(`resume.linkLabel.${key}`, { defaultValue: key })}
                        </span>
                        : {draft.profile.links[key]}
                      </span>
                    ) : null
                  )}
                </div>

                <p className="mt-6 text-base leading-7 text-slate-700">{draft.profile.intro.line}</p>
                <ul className="mt-4 space-y-2 pl-5">
                  {draft.profile.intro.bullets.map((bullet, index) => (
                    <li key={`preview-bullet-${index}`} className="text-sm leading-6 text-slate-700">
                      {bullet.text}
                    </li>
                  ))}
                </ul>
              </header>

              <div className="mt-8 space-y-8">
                <section style={{ breakInside: "avoid" }}>
                  <SectionHeading>{t("resume.previewSection.workExperience")}</SectionHeading>
                  <div className="mt-4 space-y-5">
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
                        <div key={`preview-work-${work.id}`} className="rounded-3xl border border-slate-200 bg-white px-5 py-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-bold text-slate-950">{work.title}</h3>
                              <p className="mt-1 text-sm font-medium text-slate-600">{work.position}</p>
                            </div>
                            <p className="text-sm font-medium text-slate-500">{work.period}</p>
                          </div>

                          <div className="mt-4 space-y-4">
                            {visibleProjects.map((project) => (
                              <div key={`preview-work-project-${project.id}`}>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold text-slate-900">{project.name}</p>
                                  {project.tech.map((tech) => (
                                    <span
                                      key={`${project.id}-${tech}`}
                                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                                <div className="mt-3 space-y-3">
                                  {project.blocks.map((block) => renderPreviewBlock(block))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section style={{ breakInside: "avoid" }}>
                  <SectionHeading>{t("resume.previewSection.projects")}</SectionHeading>
                  <div className="mt-4 space-y-5">
                    {includedProjects.map((project) => (
                      <div key={`preview-project-${project.id}`} className="rounded-3xl border border-slate-200 bg-white px-5 py-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-slate-950">{project.title}</h3>
                            <p className="mt-1 text-sm font-medium text-slate-600">{project.projectType}</p>
                          </div>
                          <p className="text-sm font-medium text-slate-500">{project.period}</p>
                        </div>

                        {project.summary && (
                          <p className="mt-4 text-sm leading-6 text-slate-700 whitespace-pre-wrap">{project.summary}</p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.techStack.map((tech) => (
                            <span
                              key={`${project.id}-tech-${tech}`}
                              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 flex flex-col gap-1.5">
                          {renderProjectLinks(project)}
                        </div>

                        <div className="mt-4 space-y-3">
                          {project.blocks
                            .filter((block) => selectedBlockIds.has(block.id))
                            .map((block) => renderPreviewBlock(block))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section style={{ breakInside: "avoid" }}>
                  <SectionHeading>{t("resume.previewSection.education")}</SectionHeading>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {draft.education.map((item) => (
                      <div key={`preview-education-${item.id}`} className="rounded-3xl border border-slate-200 bg-white px-5 py-4">
                        <h3 className="text-base font-bold text-slate-950">{item.title}</h3>
                        <p className="mt-1 text-sm text-slate-700">{item.major}</p>
                        <p className="mt-2 text-sm text-slate-500">{item.grade}</p>
                        <p className="mt-3 text-sm font-medium text-slate-500">{item.period}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section style={{ breakInside: "avoid" }}>
                  <SectionHeading>{t("resume.previewSection.skills")}</SectionHeading>
                  <div className="mt-4 grid gap-3">
                    {draft.skills.map((skillGroup) => (
                      <div key={`preview-skill-${skillGroup.category}`} className="rounded-3xl border border-slate-200 bg-white px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">{skillGroup.label}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{skillGroup.items.join(", ")}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section style={{ breakInside: "avoid" }}>
                  <SectionHeading>{t("resume.previewSection.awards")}</SectionHeading>
                  <div className="mt-4 space-y-3">
                    {draft.awards.map((award) => (
                      <div key={`preview-award-${award.id}`} className="rounded-3xl border border-slate-200 bg-white px-5 py-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="text-base font-bold text-slate-950">{award.title}</h3>
                          <p className="text-sm font-medium text-slate-500">{award.period}</p>
                        </div>
                        <ul className="mt-3 space-y-2 pl-5">
                          {award.description.map((description, index) => (
                            <li key={`preview-award-${award.id}-${index}`} className="text-sm leading-6 text-slate-700">
                              {description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <section style={{ breakInside: "avoid" }}>
                  <SectionHeading>{t("resume.previewSection.certificates")}</SectionHeading>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {draft.certificates.map((certificate) => (
                      <div
                        key={`preview-cert-${certificate.id}`}
                        className="rounded-3xl border border-slate-200 bg-white px-5 py-4"
                      >
                        <h3 className="text-sm font-bold text-slate-950">{certificate.title}</h3>
                        <p className="mt-3 text-sm font-medium text-slate-500">{certificate.period}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {draft.languages.length > 0 && (
                  <section style={{ breakInside: "avoid" }}>
                    <SectionHeading>{t("resume.previewSection.languages")}</SectionHeading>
                    <div className="mt-4 grid gap-3">
                      {draft.languages.map((language) => (
                        <div key={`preview-language-${language.id}`} className="rounded-3xl border border-slate-200 bg-white px-5 py-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <h3 className="text-base font-bold text-slate-950">{language.title}</h3>
                            <p className="text-sm font-medium text-slate-500">{language.period}</p>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-700">{language.score}</p>
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
    </section>
  );
};

export default ResumePreviewPage;
