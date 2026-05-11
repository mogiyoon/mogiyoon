import type { PreparingProjectData } from '../components/PreparingCard';
import type { ProjectSummary } from '../types';
import { createCachedResource, useCachedResource } from './useCachedResource';
import { fetchJson } from '../utils/fetchJson';

type PrefetchedLists = {
    projects: ProjectSummary[];
    preparing: PreparingProjectData[];
};

const projectListsResource = createCachedResource<PrefetchedLists>(
    async () => {
        const [projects, preparing] = await Promise.all([
            fetchJson<ProjectSummary[]>('/data/projects-list.json'),
            fetchJson<PreparingProjectData[]>('/data/preparing-projects-list.json'),
        ]);

        return { projects, preparing };
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
