import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type {
    AiDevKitDetailItem,
    AiDevKitModalData,
    AiDevKitSkillItem,
} from '../components/AiDevKitModal';

export type ProjectDevKitId = 'skills' | 'mcp' | 'harness';

export type ProjectDevKitCardData = AiDevKitModalData & {
    id: ProjectDevKitId;
    description: string;
    icon: ReactNode;
};

export const useProjectDevKitItems = () => {
    const { t } = useTranslation('projects');

    const skillItems = t('aiDevKit.skills.detail.cardItems', {
        returnObjects: true,
    }) as AiDevKitSkillItem[];
    const mcpServersItems = t('aiDevKit.mcp.detail.serversItems', {
        returnObjects: true,
    }) as AiDevKitDetailItem[];
    const harnessPatternItems = t('aiDevKit.harness.detail.patternsItems', {
        returnObjects: true,
    }) as AiDevKitDetailItem[];
    const harnessAbstractItems = t('aiDevKit.harness.detail.abstractItems', {
        returnObjects: true,
    }) as AiDevKitDetailItem[];

    const closeLabel = t('aiDevKit.modal.close');

    return [
        {
            id: 'skills',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
            ),
            title: t('aiDevKit.skills.title'),
            description: t('aiDevKit.skills.description'),
            eyebrow: t('aiDevKit.skills.detail.eyebrow'),
            summary: t('aiDevKit.skills.detail.summary'),
            closeLabel,
            sections: [
                {
                    title: t('aiDevKit.skills.detail.skillsTitle'),
                    description: t('aiDevKit.skills.detail.skillsDescription'),
                    skillItems,
                    layout: 'skill-groups',
                },
            ],
        },
        {
            id: 'mcp',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
            ),
            title: t('aiDevKit.mcp.title'),
            description: t('aiDevKit.mcp.description'),
            eyebrow: t('aiDevKit.mcp.detail.eyebrow'),
            summary: t('aiDevKit.mcp.detail.summary'),
            closeLabel,
            sections: [
                {
                    title: t('aiDevKit.mcp.detail.serversTitle'),
                    items: mcpServersItems,
                },
            ],
        },
        {
            id: 'harness',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            ),
            title: t('aiDevKit.harness.title'),
            description: t('aiDevKit.harness.description'),
            eyebrow: t('aiDevKit.harness.detail.eyebrow'),
            summary: t('aiDevKit.harness.detail.summary'),
            closeLabel,
            sections: [
                {
                    title: t('aiDevKit.harness.detail.abstractTitle'),
                    description: t('aiDevKit.harness.detail.abstractDescription'),
                    items: harnessAbstractItems,
                    layout: 'diagram',
                },
                {
                    title: t('aiDevKit.harness.detail.patternsTitle'),
                    description: t('aiDevKit.harness.detail.patternsDescription'),
                    items: harnessPatternItems,
                    layout: 'flow',
                },
            ],
        },
    ] as ProjectDevKitCardData[];
};
