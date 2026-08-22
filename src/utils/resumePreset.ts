import type { ResumeBuilderData } from "./resumePreview";

/**
 * 이력서 빌더 프리셋 — "프리셋 가져오기"로 불러오는 JSON의 스키마.
 *
 * - profile: draft.profile 에 얕게 병합. intro.bullets 는 index 지정 패치로 일부만 교체 가능
 * - photo: 미리보기·인쇄에 쓸 사진 (data URL 또는 public 경로)
 * - blocks.include / exclude: 블록 id 정확 일치 또는 제목 부분 일치로 기본 선택에 추가/제거
 * - blocks.exact: 내보내기가 기록하는 정확한 선택 목록 (있으면 include/exclude 보다 우선)
 * - projects: 포함할 개인 프로젝트 조정 (id 정확 일치)
 */
export type ResumePresetBulletPatch = {
  index: number;
  text: string;
  bold?: string[];
  links?: Array<{ text: string; url: string }>;
};

export type ResumePreset = {
  profile?: Record<string, unknown> & {
    intro?: { line?: string; bullets?: ResumePresetBulletPatch[] };
  };
  photo?: string;
  blocks?: { exact?: string[]; include?: string[]; exclude?: string[] };
  projects?: { exact?: string[]; include?: string[]; exclude?: string[] };
  /** 카테고리별 유지할 항목 목록. null 이면 카테고리 제거. 키 순서가 출력 순서가 된다. */
  skills?: Record<string, string[] | null>;
  awards?: { exclude?: string[] };
  certificates?: { exclude?: string[] };
  education?: { exclude?: string[] };
  /** 경력 하위 프로젝트(예: pension, crawlers) 자체를 지면에서 제거 */
  workProjects?: { exclude?: string[] };
};

type FlatBlock = { id: string; title: string };

const flattenBlocks = (data: ResumeBuilderData): FlatBlock[] => [
  ...data.workExperience.flatMap((work) =>
    work.projects.flatMap((project) =>
      project.blocks.map((block) => ({ id: block.id, title: block.title })),
    ),
  ),
  ...data.projects.flatMap((project) =>
    project.blocks.map((block) => ({ id: block.id, title: block.title })),
  ),
];

const matches = (block: FlatBlock, pattern: string) =>
  block.id === pattern || block.title.includes(pattern);

/** 프리셋의 blocks 지시를 기본 선택 목록에 적용해 최종 블록 id 목록을 만든다. */
export const resolvePresetBlockIds = (
  data: ResumeBuilderData,
  preset: ResumePreset,
): string[] => {
  const blocks = flattenBlocks(data);
  if (preset.blocks?.exact) {
    return preset.blocks.exact.filter((id) => blocks.some((b) => b.id === id));
  }
  const ids = new Set(data.defaultSelectedBlockIds);
  (preset.blocks?.include ?? []).forEach((pattern) => {
    blocks.filter((b) => matches(b, pattern)).forEach((b) => ids.add(b.id));
  });
  (preset.blocks?.exclude ?? []).forEach((pattern) => {
    blocks.filter((b) => matches(b, pattern)).forEach((b) => ids.delete(b.id));
  });
  return blocks.map((b) => b.id).filter((id) => ids.has(id));
};

/** 프리셋의 projects 지시를 기본 포함 목록에 적용한다. */
export const resolvePresetProjectIds = (
  data: ResumeBuilderData,
  preset: ResumePreset,
): string[] => {
  if (preset.projects?.exact) return preset.projects.exact;
  const ids = new Set(data.defaultIncludedProjectIds);
  (preset.projects?.include ?? []).forEach((id) => ids.add(id));
  (preset.projects?.exclude ?? []).forEach((id) => ids.delete(id));
  return [...ids];
};

/** draft 에 프리셋 profile 을 병합한 새 draft 를 돌려준다 (원본 불변). */
export const applyPresetToDraft = <T extends { profile: ResumeBuilderData["profile"] }>(
  draft: T,
  preset: ResumePreset,
): T => {
  let next: T = draft;
  // 섹션 필터 — 스킬·수상·자격·학력·경력 하위 프로젝트를 프리셋으로 다듬는다.
  const d = next as unknown as Record<string, unknown>;
  if (preset.skills) {
    const spec = preset.skills;
    const groups = (d.skills as Array<{ category: string; items: string[]; primary: string[] }>) ?? [];
    const order = Object.keys(spec);
    d.skills = order
      .map((cat) => {
        const keep = spec[cat];
        const group = groups.find((g) => g.category === cat);
        if (!group || keep === null) return null;
        const items = group.items.filter((it) => keep.includes(it));
        const g = group as { resumeItems?: string[] };
        const resumeItems = g.resumeItems?.filter((it) =>
          items.some((kept) => it === kept || it.startsWith(kept + " ")),
        );
        return {
          ...group,
          items,
          primary: group.primary.filter((it) => items.includes(it)),
          ...(resumeItems ? { resumeItems } : {}),
        };
      })
      .filter((g) => g && (g as { items: string[] }).items.length > 0);
    next = { ...(d as unknown as T) };
  }
  for (const key of ["awards", "certificates", "education"] as const) {
    const ex = preset[key]?.exclude;
    if (ex?.length) {
      d[key] = ((d[key] as Array<{ id: string }>) ?? []).filter((item) => !ex.includes(item.id));
      next = { ...(d as unknown as T) };
    }
  }
  if (preset.workProjects?.exclude?.length) {
    const ex = preset.workProjects.exclude;
    d.workExperience = ((d.workExperience as Array<{ projects: Array<{ id: string }> }>) ?? []).map(
      (work) => ({ ...work, projects: work.projects.filter((p) => !ex.includes(p.id)) }),
    );
    next = { ...(d as unknown as T) };
  }
  draft = next;
  if (!preset.profile) return draft;
  const { intro: introPatch, ...profileRest } = preset.profile;
  const profile = { ...draft.profile, ...profileRest } as ResumeBuilderData["profile"];
  if (introPatch) {
    const intro = { ...(profile as { intro?: { line?: string; bullets?: unknown[] } }).intro };
    if (introPatch.line !== undefined) intro.line = introPatch.line;
    if (introPatch.bullets) {
      const bullets = [...((intro.bullets as ResumePresetBulletPatch[] | undefined) ?? [])];
      introPatch.bullets.forEach(({ index, ...bullet }) => {
        if (index >= 0 && index < bullets.length) bullets[index] = bullet as (typeof bullets)[number];
      });
      intro.bullets = bullets;
    }
    (profile as { intro?: unknown }).intro = intro;
  }
  return { ...draft, profile };
};

/** 현재 상태를 다시 가져올 수 있는 프리셋 JSON 으로 만든다 ("프리셋 내보내기"). */
export const buildPresetExport = (
  draft: { profile: ResumeBuilderData["profile"] },
  selectedBlockIds: Iterable<string>,
  includedProjectIds: Iterable<string>,
  photo: string | null,
): ResumePreset => ({
  profile: draft.profile as unknown as ResumePreset["profile"],
  ...(photo ? { photo } : {}),
  blocks: { exact: [...selectedBlockIds] },
  projects: { exact: [...includedProjectIds] },
});
