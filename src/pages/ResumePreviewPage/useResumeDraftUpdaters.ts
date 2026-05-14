import { useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ResumeBuilderData } from '../../utils/resumePreview';

/**
 * ResumePreviewPage 의 draft 상태를 부분 갱신하는 7개 핸들러를 한 곳에 모은 훅.
 *
 * 본문 페이지 1048 → 950 줄대로 줄이기 위해 분리. 모든 함수는 `setDraft` 클로저를 잡고
 * `prev` 가 null 이면 그대로 반환하는 가드 패턴을 공유한다.
 *
 * 각 핸들러는 immutable 갱신만 수행하며 외부 부수효과가 없어 useMemo 로 안정적인
 * reference 를 유지한다 (input 컴포넌트의 불필요한 리렌더 방지).
 */
export const useResumeDraftUpdaters = (
  setDraft: Dispatch<SetStateAction<ResumeBuilderData | null>>,
) =>
  useMemo(() => {
    const updateProfileField = (
      field: 'name' | 'targetRole' | 'email' | 'phone',
      value: string,
    ) => {
      setDraft((prev) =>
        prev
          ? {
              ...prev,
              profile: { ...prev.profile, [field]: value },
            }
          : prev,
      );
    };

    const updateProfileLink = (key: string, value: string) => {
      setDraft((prev) =>
        prev
          ? {
              ...prev,
              profile: {
                ...prev.profile,
                links: { ...prev.profile.links, [key]: value },
              },
            }
          : prev,
      );
    };

    const updateIntroLine = (value: string) => {
      setDraft((prev) =>
        prev
          ? {
              ...prev,
              profile: {
                ...prev.profile,
                intro: { ...prev.profile.intro, line: value },
              },
            }
          : prev,
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
                bulletIndex === index ? { ...bullet, text: value } : bullet,
              ),
            },
          },
        };
      });
    };

    const updateWorkBlock = (
      blockId: string,
      field: 'title' | 'body',
      value: string,
    ) => {
      setDraft((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          workExperience: prev.workExperience.map((work) => ({
            ...work,
            projects: work.projects.map((project) => ({
              ...project,
              blocks: project.blocks.map((block) =>
                block.id === blockId ? { ...block, [field]: value } : block,
              ),
            })),
          })),
        };
      });
    };

    const updateWorkBlockDetailItem = (
      blockId: string,
      detailId: string,
      value: string,
    ) => {
      setDraft((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          workExperience: prev.workExperience.map((work) => ({
            ...work,
            projects: work.projects.map((project) => ({
              ...project,
              blocks: project.blocks.map((block) => {
                if (block.id !== blockId || !block.detailItems) {
                  return block;
                }

                const detailItems = block.detailItems.map((item) =>
                  item.id === detailId ? { ...item, value } : item,
                );

                return {
                  ...block,
                  detailItems,
                  body: detailItems
                    .map((item) => item.value.trim())
                    .filter(Boolean)
                    .join('\n\n'),
                };
              }),
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
                  ? { ...project, summary: value }
                  : project,
              ),
            }
          : prev,
      );
    };

    const updateProjectBlock = (
      blockId: string,
      field: 'title' | 'body',
      value: string,
    ) => {
      setDraft((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          projects: prev.projects.map((project) => ({
            ...project,
            blocks: project.blocks.map((block) =>
              block.id === blockId ? { ...block, [field]: value } : block,
            ),
          })),
        };
      });
    };

    const updateProjectBlockDetailItem = (
      blockId: string,
      detailId: string,
      value: string,
    ) => {
      setDraft((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          projects: prev.projects.map((project) => ({
            ...project,
            blocks: project.blocks.map((block) => {
              if (block.id !== blockId || !block.detailItems) return block;

              const detailItems = block.detailItems.map((item) =>
                item.id === detailId ? { ...item, value } : item,
              );

              return {
                ...block,
                detailItems,
                body: detailItems
                  .map((item) => item.value.trim())
                  .filter(Boolean)
                  .join('\n\n'),
              };
            }),
          })),
        };
      });
    };

    return {
      updateProfileField,
      updateProfileLink,
      updateIntroLine,
      updateIntroBullet,
      updateWorkBlock,
      updateWorkBlockDetailItem,
      updateProjectSummary,
      updateProjectBlock,
      updateProjectBlockDetailItem,
    };
  }, [setDraft]);
