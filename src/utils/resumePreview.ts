import i18n from "../i18n";
import type { ProjectData, SummaryPart } from "../types";

type ResumeProfileBulletLink = {
  text: string;
  url: string;
};

type ResumeProfileBullet = {
  text: string;
  bold?: string[];
  links?: ResumeProfileBulletLink[];
};

export type ResumeProfileSourceData = {
  name: string;
  targetRole: string;
  email: string;
  phone: string;
  links: Record<string, string>;
  photoPlaceholder: boolean;
  intro: {
    line: string;
    bullets: ResumeProfileBullet[];
  };
  projectOrder: string[];
  projectHighlights: Record<
    string,
    {
      teamType: string;
      summary: string;
      highlights: Array<{
        title: string;
        body: string;
      }>;
    }
  >;
};

type IntroData = {
  workExperience: Array<{
    id: string;
    projects: Array<{ id: string; tech: string[] }>;
  }>;
  education: Array<{ id: string }>;
  awards: Array<{ id: string }>;
  certificates: Array<{ id: string }>;
  skills: Array<{ category: string; items: string[] }>;
  languages?: Array<{ id: string }>;
};

type ProjectListItem = {
  id: string;
  techStack?: string[];
};

type HighlightItem = {
  title: string;
  problem: string;
  solution: string;
  result: string;
};

type AiHighlightItem = {
  title: string;
  summary: string;
  context: string;
  approach: string;
  verification: string;
  impact: string;
};

export type ResumeEditableBlock = {
  id: string;
  title: string;
  body: string;
  sectionLabel?: string;
  defaultSelected?: boolean;
};

export type ResumeWorkProject = {
  id: string;
  name: string;
  tech: string[];
  blocks: ResumeEditableBlock[];
};

export type ResumeWorkExperience = {
  id: string;
  title: string;
  position: string;
  period: string;
  projects: ResumeWorkProject[];
};

export type ResumeProjectEntry = {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  projectType: string;
  summary: string;
  techStack: string[];
  links: Record<string, string>;
  blocks: ResumeEditableBlock[];
  defaultIncluded: boolean;
};

export type ResumeEducationEntry = {
  id: string;
  title: string;
  major: string;
  grade: string;
  period: string;
};

export type ResumeAwardEntry = {
  id: string;
  title: string;
  period: string;
  description: string[];
};

export type ResumeCertificateEntry = {
  id: string;
  title: string;
  period: string;
};

export type ResumeLanguageEntry = {
  id: string;
  title: string;
  score: string;
  period: string;
};

export type ResumeBuilderData = {
  profile: ResumeProfileSourceData;
  workExperience: ResumeWorkExperience[];
  projects: ResumeProjectEntry[];
  education: ResumeEducationEntry[];
  awards: ResumeAwardEntry[];
  certificates: ResumeCertificateEntry[];
  skills: Array<{ category: string; label: string; items: string[] }>;
  languages: ResumeLanguageEntry[];
  defaultSelectedBlockIds: string[];
  defaultIncludedProjectIds: string[];
};

const normalizeLanguage = (language: string) =>
  language.toLowerCase().startsWith("en") ? "en" : "ko";

const fetchJson = async <T,>(path: string): Promise<T> => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return (await response.json()) as T;
};

const fetchLocalizedResumeProfile = async (language: string) => {
  const normalizedLanguage = normalizeLanguage(language);
  const candidates =
    normalizedLanguage === "en"
      ? ["/data/resume-profile.en.json", "/data/resume-profile.json"]
      : ["/data/resume-profile.json"];

  for (const path of candidates) {
    const response = await fetch(path);
    if (response.ok) {
      return (await response.json()) as ResumeProfileSourceData;
    }
  }

  throw new Error("Failed to fetch localized resume profile");
};

const safeStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const safeObjectArray = <T,>(value: unknown) =>
  Array.isArray(value) ? (value as T[]) : [];

const extractTextValue = (t: (key: string, options?: Record<string, unknown>) => unknown, key: string) => {
  const value = t(key, { defaultValue: "" });
  return typeof value === "string" ? value : "";
};

const flattenSummaryGroup = (
  projectId: string,
  sectionId: string,
  sectionTitle: string,
  group: SummaryPart[],
  index: number,
  tProject: (key: string, options?: Record<string, unknown>) => unknown
) => {
  const texts: string[] = [];
  const links: string[] = [];
  let title = "";

  group.forEach((part) => {
    if (part.type === "subtitle" && !title) {
      const subtitle = tProject(part.content, { defaultValue: part.content });
      title = typeof subtitle === "string" ? subtitle : part.content;
      return;
    }

    if (part.type === "text") {
      const text = tProject(part.content || "", { defaultValue: part.content || "" });
      if (typeof text === "string" && text.trim()) {
        texts.push(text.trim());
      }
      return;
    }

    if (part.type === "link" && part.href) {
      links.push(`${part.label}: ${part.href}`);
    }
  });

  const body = [...texts, ...links].filter(Boolean).join("\n\n");

  if (!body.trim()) {
    return null;
  }

  return {
    id: `project:${projectId}:${sectionId}:${index}`,
    title: title || `${sectionTitle} ${index + 1}`,
    body,
    sectionLabel: sectionTitle,
    defaultSelected: false,
  } satisfies ResumeEditableBlock;
};

export const loadLocalizedResumeProfile = async (language: string) =>
  fetchLocalizedResumeProfile(language);

export const loadResumeBuilderData = async (language: string): Promise<ResumeBuilderData> => {
  const normalizedLanguage = normalizeLanguage(language);
  const [profile, introData, projectList] = await Promise.all([
    fetchLocalizedResumeProfile(normalizedLanguage),
    fetchJson<IntroData>("/data/introduction.json"),
    fetchJson<ProjectListItem[]>("/data/projects-list.json"),
  ]);

  const projectIds = projectList.map((project) => project.id);
  const namespaces = ["common", "introduction", ...projectIds.map((id) => `projects/project-${id}`)];
  await i18n.loadNamespaces(namespaces);

  const projectsData = await Promise.all(
    projectIds.map((projectId) => fetchJson<ProjectData>(`/data/projects/${projectId}.json`))
  );

  const tCommon = i18n.getFixedT(normalizedLanguage, "common");
  const tIntro = i18n.getFixedT(normalizedLanguage, "introduction");

  const defaultSelectedBlockIds: string[] = [];
  const defaultIncludedProjectIds = [...profile.projectOrder];

  const workExperience = introData.workExperience.map((workItem) => {
    const projects = workItem.projects.map((project) => {
      const standardHighlights = safeObjectArray<HighlightItem>(
        tIntro(`work.${workItem.id}.projects.${project.id}.highlights`, {
          returnObjects: true,
          defaultValue: [],
        })
      );

      const aiHighlights = safeObjectArray<AiHighlightItem>(
        tIntro(`work.${workItem.id}.projects.${project.id}.aiHighlights`, {
          returnObjects: true,
          defaultValue: [],
        })
      );

      const blocks: ResumeEditableBlock[] = [];

      standardHighlights.forEach((highlight, index) => {
        const blockId = `work:${workItem.id}:${project.id}:highlight:${index}`;
        defaultSelectedBlockIds.push(blockId);
        blocks.push({
          id: blockId,
          title: highlight.title,
          body: [highlight.problem, highlight.solution, highlight.result].filter(Boolean).join("\n\n"),
          sectionLabel: extractTextValue(tCommon, "highlight.section.development"),
          defaultSelected: true,
        });
      });

      aiHighlights.forEach((highlight, index) => {
        blocks.push({
          id: `work:${workItem.id}:${project.id}:ai:${index}`,
          title: highlight.title,
          body: highlight.summary,
          sectionLabel: extractTextValue(tCommon, "highlight.section.aiUsage"),
          defaultSelected: false,
        });
      });

      return {
        id: project.id,
        name: extractTextValue(tIntro, `work.${workItem.id}.projects.${project.id}.name`),
        tech: project.tech ?? [],
        blocks,
      } satisfies ResumeWorkProject;
    });

    return {
      id: workItem.id,
      title: extractTextValue(tIntro, `work.${workItem.id}.title`),
      position: extractTextValue(tIntro, `work.${workItem.id}.position`),
      period: extractTextValue(tIntro, `work.${workItem.id}.period`),
      projects,
    } satisfies ResumeWorkExperience;
  });

  const projects = projectsData.map((project) => {
    const tProject = i18n.getFixedT(normalizedLanguage, `projects/project-${project.id}`);
    const profileProject = profile.projectHighlights[project.id];

    const blocks: ResumeEditableBlock[] = [];

    if (project.overview.introduction) {
      blocks.push({
        id: `project:${project.id}:overview:introduction`,
        title: extractTextValue(tCommon, "projectDetail.introduction"),
        body: extractTextValue(tProject, project.overview.introduction),
        sectionLabel: extractTextValue(tCommon, "projectDetail.overview"),
        defaultSelected: false,
      });
    }

    if (project.overview.role) {
      blocks.push({
        id: `project:${project.id}:overview:role`,
        title: extractTextValue(tCommon, "projectDetail.role"),
        body: extractTextValue(tProject, project.overview.role),
        sectionLabel: extractTextValue(tCommon, "projectDetail.overview"),
        defaultSelected: false,
      });
    }

    if (project.overview.features) {
      blocks.push({
        id: `project:${project.id}:overview:features`,
        title: extractTextValue(tCommon, "projectDetail.features"),
        body: extractTextValue(tProject, project.overview.features),
        sectionLabel: extractTextValue(tCommon, "projectDetail.overview"),
        defaultSelected: false,
      });
    }

    if (project.overview.other) {
      blocks.push({
        id: `project:${project.id}:overview:other`,
        title: extractTextValue(tCommon, "projectDetail.overview"),
        body: extractTextValue(tProject, project.overview.other),
        sectionLabel: extractTextValue(tCommon, "projectDetail.overview"),
        defaultSelected: false,
      });
    }

    if (profileProject) {
      profileProject.highlights.forEach((highlight, index) => {
        const blockId = `project:${project.id}:resume:${index}`;
        defaultSelectedBlockIds.push(blockId);
        blocks.push({
          id: blockId,
          title: highlight.title,
          body: highlight.body,
          sectionLabel: profileProject.teamType,
          defaultSelected: true,
        });
      });
    }

    project.summaries.forEach((section) => {
      const sectionTitle = extractTextValue(tProject, section.title || "");
      section.parts.forEach((group, index) => {
        const flattened = flattenSummaryGroup(project.id, section.id, sectionTitle, group, index, tProject);
        if (flattened) {
          blocks.push(flattened);
        }
      });
    });

    return {
      id: project.id,
      title: extractTextValue(tProject, project.title),
      subtitle: extractTextValue(tProject, project.subtitle),
      period: project.overview.period ?? "",
      projectType: project.overview.projectType
        ? extractTextValue(tProject, project.overview.projectType)
        : profileProject?.teamType ?? "",
      summary:
        profileProject?.summary ??
        (project.overview.introduction ? extractTextValue(tProject, project.overview.introduction) : ""),
      techStack: project.overview.techStack ?? [],
      links: {
        github: project.overview.github ?? "",
        demo: project.overview.demo ?? "",
        notion: project.overview.notion ?? "",
      },
      blocks,
      defaultIncluded: profile.projectOrder.includes(project.id),
    } satisfies ResumeProjectEntry;
  });

  const education = introData.education.map((item) => ({
    id: item.id,
    title: extractTextValue(tIntro, `education.${item.id}.title`),
    major: extractTextValue(tIntro, `education.${item.id}.major`),
    grade: extractTextValue(tIntro, `education.${item.id}.grade`),
    period: extractTextValue(tIntro, `education.${item.id}.period`),
  }));

  const awards = introData.awards.map((item) => ({
    id: item.id,
    title: extractTextValue(tIntro, `awards.${item.id}.title`),
    period: extractTextValue(tIntro, `awards.${item.id}.period`),
    description: safeStringArray(
      tIntro(`awards.${item.id}.description`, {
        returnObjects: true,
        defaultValue: [],
      })
    ),
  }));

  const certificates = introData.certificates.map((item) => ({
    id: item.id,
    title: extractTextValue(tIntro, `certificate.${item.id}.title`),
    period: extractTextValue(tIntro, `certificate.${item.id}.period`),
  }));

  const skills = introData.skills.map((skillGroup) => ({
    category: skillGroup.category,
    label: extractTextValue(tIntro, `skills.${skillGroup.category}`),
    items: skillGroup.items,
  }));

  const languages = (introData.languages ?? []).map((item) => ({
    id: item.id,
    title: extractTextValue(tIntro, `languages.${item.id}.title`),
    score: extractTextValue(tIntro, `languages.${item.id}.score`),
    period: extractTextValue(tIntro, `languages.${item.id}.period`),
  }));

  return {
    profile,
    workExperience,
    projects,
    education,
    awards,
    certificates,
    skills,
    languages,
    defaultSelectedBlockIds,
    defaultIncludedProjectIds,
  };
};
