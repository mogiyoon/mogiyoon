import { useEffect, useState } from 'react';

import type { PreparingProjectData } from '../components/PreparingCard';
import type { ProjectSummary } from '../types';

type PrefetchedLists = {
    projects: ProjectSummary[];
    preparing: PreparingProjectData[];
};

let cachedLists: PrefetchedLists | null = null;

const listsPromise = Promise.all([
    fetch('/data/projects-list.json').then((response) => response.json()),
    fetch('/data/preparing-projects-list.json').then((response) => response.json()),
]).then(([projects, preparing]) => {
    cachedLists = { projects, preparing };
    return cachedLists;
}).catch(console.error);

export const useProjectLists = () => {
    const [projects, setProjects] = useState<ProjectSummary[]>(cachedLists?.projects ?? []);
    const [preparingProjects, setPreparingProjects] = useState<PreparingProjectData[]>(cachedLists?.preparing ?? []);
    const [isLoading, setIsLoading] = useState(!cachedLists);

    useEffect(() => {
        if (cachedLists) return;

        listsPromise.then((data) => {
            if (data) {
                setProjects(data.projects);
                setPreparingProjects(data.preparing);
            }
            setIsLoading(false);
        });
    }, []);

    return {
        projects,
        preparingProjects,
        isLoading,
    };
};
