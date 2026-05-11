import { useMemo } from 'react';
import type {
  ResumeBuilderData,
  ResumeEditableBlock,
  ResumeProjectEntry,
} from '../../utils/resumePreview';

export interface SelectedWorkBlock {
  workId: string;
  projectId: string;
  projectName: string;
  block: ResumeEditableBlock;
}

export interface SelectedProjectBlock {
  projectId: string;
  projectName: string;
  block: ResumeEditableBlock;
}

export interface ResumeSelectorsResult {
  selectedWorkBlocks: SelectedWorkBlock[];
  includedProjects: ResumeProjectEntry[];
  selectedProjectBlocks: SelectedProjectBlock[];
}

/**
 * draft + selection 상태로부터 미리보기에 표시할 항목들을 파생한다.
 *
 * - selectedWorkBlocks: 선택된 work block 들을 work/project 메타 동봉해서 평탄화
 * - includedProjects: 포함 토글 ON 인 프로젝트만 필터링
 * - selectedProjectBlocks: 포함 프로젝트들 중 선택된 block 만 평탄화
 *
 * draft 가 null 일 때 (로딩 / 에러 상태) 빈 결과를 반환해 호출 컴포넌트의 early-return
 * 분기보다 위에서 호출되어도 hooks 순서 규칙을 위반하지 않도록 한다.
 */
export const useResumeSelectors = (
  draft: ResumeBuilderData | null,
  selectedBlockIdsSet: Set<string>,
  includedProjectIdsSet: Set<string>,
): ResumeSelectorsResult =>
  useMemo(() => {
    if (!draft) {
      return { selectedWorkBlocks: [], includedProjects: [], selectedProjectBlocks: [] };
    }

    const selectedWorkBlocks: SelectedWorkBlock[] = draft.workExperience.flatMap(
      (work) =>
        work.projects.flatMap((project) =>
          project.blocks
            .filter((block) => selectedBlockIdsSet.has(block.id))
            .map((block) => ({
              workId: work.id,
              projectId: project.id,
              projectName: project.name,
              block,
            })),
        ),
    );

    const includedProjects = draft.projects.filter((project) =>
      includedProjectIdsSet.has(project.id),
    );

    const selectedProjectBlocks: SelectedProjectBlock[] = includedProjects.flatMap(
      (project) =>
        project.blocks
          .filter((block) => selectedBlockIdsSet.has(block.id))
          .map((block) => ({
            projectId: project.id,
            projectName: project.title,
            block,
          })),
    );

    return { selectedWorkBlocks, includedProjects, selectedProjectBlocks };
  }, [draft, selectedBlockIdsSet, includedProjectIdsSet]);
