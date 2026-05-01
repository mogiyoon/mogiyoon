import React from 'react';
import { useTranslation } from 'react-i18next';

import { useProjectFlipPreview } from '../hooks/useProjectFlipPreview';
import type { ProjectSummary } from '../types';
import { createImageFallbackHandler } from '../utils/imageFallback';
import { PLACEHOLDER_PROJECT_IMAGE_300x300 } from '../utils/placeholders';
import { Chip } from './primitives/Chip';
import { FlippableCard } from './primitives/FlippableCard';

interface ProjectFlipPreviewCardProps {
    projects: ProjectSummary[];
}

const ProjectFlipPreviewCard: React.FC<ProjectFlipPreviewCardProps> = ({ projects }) => {
    const { t } = useTranslation('projects');
    const previewProjects = projects.slice(0, 2);
    const { activeProjectIndex, isFlipped } = useProjectFlipPreview(previewProjects.length);

    const activeProject = previewProjects[activeProjectIndex] ?? previewProjects[0];
    const previewTechStack = activeProject?.techStack?.slice(0, 4) ?? [];

    const handleImageError = createImageFallbackHandler({
        fallbackSrc: PLACEHOLDER_PROJECT_IMAGE_300x300,
    });

    if (!activeProject) return null;

    const front = (
        <div className="flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-md">
            <div className="p-2.5">
                <img
                    src={activeProject.screenshots.length > 0 ? activeProject.screenshots[0].src : PLACEHOLDER_PROJECT_IMAGE_300x300}
                    alt={`${t(activeProject.title || '')} Thumbnail`}
                    className="aspect-square w-full rounded-[1.8rem] object-contain"
                    onError={handleImageError}
                />
            </div>
            <div className="flex flex-1 flex-col px-4 pb-3">
                <h4 className="line-clamp-2 text-sm font-bold leading-tight text-content">
                    {t(activeProject.title || '')}
                </h4>
                <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-content-secondary">
                    {t(activeProject.subtitle || '')}
                </p>
                <Chip
                    tone="accentSoft"
                    size="xs"
                    weight="semibold"
                    className="mt-auto w-fit"
                >
                    {t(activeProject.projectType || '')}
                </Chip>
            </div>
        </div>
    );

    const back = (
        <div className="flex h-full flex-col items-center justify-center rounded-card bg-slate-800 px-4 py-5 text-white shadow-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                Tech Stack
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {previewTechStack.map((tech) => (
                    <Chip
                        key={tech}
                        tone="accentSolid"
                        size="xsTall"
                        weight="semibold"
                    >
                        {tech}
                    </Chip>
                ))}
            </div>
        </div>
    );

    return (
        <div className="mx-auto flex w-full max-w-[220px] flex-col items-center gap-3">
            <div className="text-center">
            </div>

            <FlippableCard
                isFlipped={isFlipped}
                className="w-[150px] sm:w-[170px] aspect-[24/41]"
                front={front}
                back={back}
            />
        </div>
    );
};

export default ProjectFlipPreviewCard;
