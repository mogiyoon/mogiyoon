import type { PreparingProjectData } from '../components/PreparingCard';
import type { ProjectSummary } from '../types';
import { createCachedResource, useCachedResource } from './useCachedResource';
import { fetchJson } from '../utils/fetchJson';

type PrefetchedLists = {
    projects: ProjectSummary[];
    preparing: PreparingProjectData[];
};

// "2026.05" 또는 "2024.11 ~ 2025.02" 같은 period 문자열에서 끝 날짜만 추출.
// 동일 포맷(YYYY.MM)이라면 사전식 비교가 곧 시간순 비교가 된다.
const parsePeriodEnd = (period?: string): string => {
    if (!period) return '';
    const parts = period.split('~');
    return parts[parts.length - 1].trim();
};

const sortByPeriodDesc = (projects: ProjectSummary[]): ProjectSummary[] =>
    [...projects].sort((a, b) => {
        const aEnd = parsePeriodEnd(a.period);
        const bEnd = parsePeriodEnd(b.period);
        if (!aEnd && !bEnd) return 0;
        if (!aEnd) return 1;
        if (!bEnd) return -1;
        return bEnd.localeCompare(aEnd);
    });

const projectListsResource = createCachedResource<PrefetchedLists>(
    async () => {
        const [projects, preparing] = await Promise.all([
            fetchJson<ProjectSummary[]>('/data/projects-list.json'),
            fetchJson<PreparingProjectData[]>('/data/preparing-projects-list.json'),
        ]);

        return { projects: sortByPeriodDesc(projects), preparing };
    },
    { eager: true },
);

export const useProjectLists = () => {
    const { data, isLoading } = useCachedResource(projectListsResource);

    return {
        projects: data?.projects ?? [],
        preparingProjects: data?.preparing ?? [],
        isLoading,
    };
};
