import React from 'react';
import { useTranslation } from 'react-i18next';

import { useProjectFlipPreview } from '../hooks/useProjectFlipPreview';
import type { ProjectSummary } from '../types';
import { createImageFallbackHandler } from '../utils/imageFallback';
import { PLACEHOLDER_PROJECT_IMAGE_300x300 } from '../utils/placeholders';

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

    return (
        <div className="mx-auto flex w-full max-w-[220px] flex-col items-center gap-3">
            <div className="text-center">
            </div>

            <div className="w-[150px] sm:w-[170px]" style={{ perspective: '1000px' }}>
                <div
                    className="relative aspect-[24/41] w-full transition-transform duration-700"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                >
                    <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
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
                                <span className="mt-auto inline-flex w-fit rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-semibold text-accent-700">
                                    {t(activeProject.projectType || '')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        className="absolute inset-0"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        <div className="flex h-full flex-col items-center justify-center rounded-card bg-slate-800 px-4 py-5 text-white shadow-md">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                                Tech Stack
                            </p>
                            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                                {previewTechStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="rounded-full bg-accent-500 px-2 py-1 text-[10px] font-semibold text-white"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectFlipPreviewCard;
