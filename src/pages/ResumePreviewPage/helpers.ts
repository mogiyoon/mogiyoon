import type { ResumeBuilderData, ResumeEditableBlock } from '../../utils/resumePreview';

export const linkOrder = ['website', 'blog', 'github', 'linkedin'] as const;
export const projectLinkOrder = ['github', 'demo', 'notion'] as const;

export const cloneResumeData = (data: ResumeBuilderData): ResumeBuilderData =>
  JSON.parse(JSON.stringify(data)) as ResumeBuilderData;

export type BlockSectionGroup = {
  key: string;
  label: string;
  blocks: ResumeEditableBlock[];
};

export const normalizeSectionKey = (label: string) => label.trim().toLowerCase();

export const groupBlocksBySection = (
  blocks: ResumeEditableBlock[],
  preferredLabels: string[],
): BlockSectionGroup[] => {
  const groups = new Map<string, BlockSectionGroup>();

  blocks.forEach((block) => {
    const label = block.sectionLabel?.trim() || '';
    const key = label ? normalizeSectionKey(label) : 'default';
    const existingGroup = groups.get(key);

    if (existingGroup) {
      existingGroup.blocks.push(block);
      return;
    }

    groups.set(key, {
      key,
      label,
      blocks: [block],
    });
  });

  const preferredKeys = new Set(preferredLabels.map(normalizeSectionKey));
  const prioritizedGroups = preferredLabels
    .map((label) => groups.get(normalizeSectionKey(label)))
    .filter((group): group is BlockSectionGroup => Boolean(group));
  const remainingGroups = Array.from(groups.values()).filter((group) => !preferredKeys.has(group.key));

  return [...prioritizedGroups, ...remainingGroups];
};
