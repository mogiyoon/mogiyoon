import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { easings } from '../design-tokens';
import type { ProjectSummary } from '../types';

export const PROJECT_CARD_EASE = easings.projectCard;

export type ProjectCardCustom = {
    id: string;
    index: number;
};

type ProjectCardOffset = {
    x: number;
    y: number;
    zIndex: number;
};

type UseProjectGridEntranceArgs = {
    projects: ProjectSummary[];
    selectedId: string | null;
};

export const useProjectGridEntrance = ({
    projects,
    selectedId,
}: UseProjectGridEntranceArgs) => {
    const projectsGridRef = useRef<HTMLDivElement | null>(null);
    const projectCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const [projectCardOffsets, setProjectCardOffsets] = useState<Record<string, ProjectCardOffset>>({});
    const [hasPlayedProjectEntrance, setHasPlayedProjectEntrance] = useState(false);
    const [showAiDevKit, setShowAiDevKit] = useState(false);

    useLayoutEffect(() => {
        if (projects.length === 0) return;

        const updateProjectCardOffsets = () => {
            const gridElement = projectsGridRef.current;
            if (!gridElement) return;

            const gridRect = gridElement.getBoundingClientRect();
            const gridCenterX = gridRect.left + gridRect.width / 2;
            const gridCenterY = gridRect.top + gridRect.height / 2;
            const nextOffsets: Record<string, ProjectCardOffset> = {};

            for (const project of projects) {
                const cardElement = projectCardRefs.current[project.id];
                if (!cardElement) return;

                const cardRect = cardElement.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                const deltaX = gridCenterX - cardCenterX;
                const deltaY = gridCenterY - cardCenterY;
                const centerDistance = Math.abs(deltaX) + Math.abs(deltaY);

                nextOffsets[project.id] = {
                    x: deltaX,
                    y: deltaY,
                    zIndex: Math.max(1, Math.round(1000 - centerDistance)),
                };
            }

            setProjectCardOffsets(nextOffsets);
        };

        updateProjectCardOffsets();
        window.addEventListener('resize', updateProjectCardOffsets);

        return () => {
            window.removeEventListener('resize', updateProjectCardOffsets);
        };
    }, [projects]);

    const projectCardOffsetsReady =
        projects.length > 0 && projects.every((project) => Boolean(projectCardOffsets[project.id]));

    // offsets 가 준비되는 즉시 entrance 애니메이션을 발화한다.
    // 모바일 레이아웃에서 사이드바가 위 / 그리드가 아래에 쌓여 그리드가 초기 fold 아래에 있을 때,
    // viewport 진입을 게이트로 두면 사용자가 스크롤하기 전까지 카드들이 opacity: 0 인 채 보이지 않는다.
    useEffect(() => {
        if (!projectCardOffsetsReady || hasPlayedProjectEntrance) return;

        const animationFrame = window.requestAnimationFrame(() => {
            setHasPlayedProjectEntrance(true);
        });

        return () => {
            window.cancelAnimationFrame(animationFrame);
        };
    }, [projectCardOffsetsReady, hasPlayedProjectEntrance]);

    useEffect(() => {
        if (!hasPlayedProjectEntrance || showAiDevKit) return;

        const lastCardDelay = 0.08 + Math.max(projects.length - 1, 0) * 0.05;
        const revealDelayMs = (lastCardDelay + 1.05) * 1000;
        const timeoutId = window.setTimeout(() => {
            setShowAiDevKit(true);
        }, revealDelayMs);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [hasPlayedProjectEntrance, projects.length, showAiDevKit]);

    const getProjectCardClusterState = ({ id, index }: ProjectCardCustom) => {
        const offset = projectCardOffsets[id];

        if (!offset) {
            return {
                opacity: 0,
                scale: 0.8,
                x: 0,
                y: 0,
                rotate: 0,
                filter: 'blur(12px)',
                zIndex: projects.length - index,
            };
        }

        return {
            opacity: 0,
            scale: 0.68,
            x: offset.x,
            y: offset.y,
            rotate: 0,
            filter: 'blur(12px)',
            zIndex: offset.zIndex,
        };
    };

    const cardVariants = {
        cluster: (custom: ProjectCardCustom) => ({
            ...getProjectCardClusterState(custom),
            transition: { duration: 0 },
        }),
        animate: ({ index }: ProjectCardCustom) => ({
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotate: 0,
            filter: 'blur(0px)',
            zIndex: 1,
            transition: {
                delay: 0.08 + index * 0.05,
                duration: 0.9,
                ease: PROJECT_CARD_EASE,
            },
        }),
        exit: ({ id }: ProjectCardCustom) => {
            if (id === selectedId) {
                return { scale: 1.5, opacity: 0, transition: { duration: 0.3 } };
            }
            return { opacity: 0, transition: { duration: 0.2 } };
        },
    };

    return {
        projectsGridRef,
        projectCardRefs,
        projectCardOffsetsReady,
        hasPlayedProjectEntrance,
        showAiDevKit,
        cardVariants,
    };
};
