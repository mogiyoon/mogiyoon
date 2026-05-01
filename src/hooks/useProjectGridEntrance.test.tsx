import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ProjectSummary } from '../types';

const inViewState = { current: true };

vi.mock('framer-motion', () => ({
    useInView: () => inViewState.current,
}));

import { useProjectGridEntrance } from './useProjectGridEntrance';

const buildProject = (id: string): ProjectSummary => ({
    id,
    title: `${id}-title`,
    subtitle: `${id}-subtitle`,
    projectType: 'app',
    screenshots: [],
    techStack: [],
});

const stubBoundingRect = (
    element: HTMLElement,
    rect: { top: number; left: number; width: number; height: number },
) => {
    Object.defineProperty(element, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            bottom: rect.top + rect.height,
            right: rect.left + rect.width,
            x: rect.left,
            y: rect.top,
            toJSON: () => ({}),
        }),
    });
};

const attachGridAndCards = (
    result: ReturnType<typeof renderHook<ReturnType<typeof useProjectGridEntrance>, unknown>>['result'],
    projects: ProjectSummary[],
) => {
    const grid = document.createElement('div');
    stubBoundingRect(grid, { top: 0, left: 0, width: 600, height: 400 });
    result.current.projectsGridRef.current = grid;

    projects.forEach((project, index) => {
        const card = document.createElement('div');
        stubBoundingRect(card, {
            top: index * 100,
            left: index * 50,
            width: 100,
            height: 100,
        });
        result.current.projectCardRefs.current[project.id] = card;
    });
};

describe('useProjectGridEntrance', () => {
    beforeEach(() => {
        inViewState.current = true;
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('exposes projectsGridRef and projectCardRefs that can be attached to DOM nodes', () => {
        const projects = [buildProject('alpha'), buildProject('beta')];
        const { result } = renderHook(() =>
            useProjectGridEntrance({ projects, selectedId: null }),
        );

        const grid = document.createElement('div');
        const card = document.createElement('div');
        result.current.projectsGridRef.current = grid;
        result.current.projectCardRefs.current['alpha'] = card;

        expect(result.current.projectsGridRef.current).toBe(grid);
        expect(result.current.projectCardRefs.current['alpha']).toBe(card);
    });

    it('projectCardOffsetsReady is false when offsets are missing', () => {
        const projects = [buildProject('alpha'), buildProject('beta')];
        const { result } = renderHook(() =>
            useProjectGridEntrance({ projects, selectedId: null }),
        );

        // No refs attached -> the layout effect bails out before populating offsets
        expect(result.current.projectCardOffsetsReady).toBe(false);
    });

    it('projectCardOffsetsReady becomes true only once every project has an offset entry', () => {
        const projects = [buildProject('alpha'), buildProject('beta')];

        const { result, rerender } = renderHook(
            ({ projects: p }) => useProjectGridEntrance({ projects: p, selectedId: null }),
            { initialProps: { projects: [] as ProjectSummary[] } },
        );

        expect(result.current.projectCardOffsetsReady).toBe(false);

        // Pre-attach refs before the hook re-runs its layout effect for the populated list
        const grid = document.createElement('div');
        stubBoundingRect(grid, { top: 0, left: 0, width: 600, height: 400 });
        result.current.projectsGridRef.current = grid;
        projects.forEach((project, index) => {
            const card = document.createElement('div');
            stubBoundingRect(card, {
                top: index * 100,
                left: index * 50,
                width: 100,
                height: 100,
            });
            result.current.projectCardRefs.current[project.id] = card;
        });

        act(() => {
            rerender({ projects });
        });

        expect(result.current.projectCardOffsetsReady).toBe(true);
    });

    it('hasPlayedProjectEntrance flips to true after offsets are ready AND the grid is in view', async () => {
        inViewState.current = true;
        const projects = [buildProject('alpha'), buildProject('beta')];

        const { result, rerender } = renderHook(
            ({ projects: p }) => useProjectGridEntrance({ projects: p, selectedId: null }),
            { initialProps: { projects: [] as ProjectSummary[] } },
        );

        attachGridAndCards(result, projects);

        await act(async () => {
            rerender({ projects });
        });

        // Flush the requestAnimationFrame the entrance effect schedules
        await act(async () => {
            await vi.advanceTimersByTimeAsync(32);
        });

        expect(result.current.hasPlayedProjectEntrance).toBe(true);
    });

    it('does not play entrance when grid is not in view', async () => {
        inViewState.current = false;
        const projects = [buildProject('alpha'), buildProject('beta')];

        const { result, rerender } = renderHook(
            ({ projects: p }) => useProjectGridEntrance({ projects: p, selectedId: null }),
            { initialProps: { projects: [] as ProjectSummary[] } },
        );

        attachGridAndCards(result, projects);

        await act(async () => {
            rerender({ projects });
        });

        await act(async () => {
            await vi.advanceTimersByTimeAsync(64);
        });

        expect(result.current.projectCardOffsetsReady).toBe(true);
        expect(result.current.hasPlayedProjectEntrance).toBe(false);
    });

    it('showAiDevKit becomes true after a delay scaled by projects.length once entrance has played', async () => {
        inViewState.current = true;
        const projects = [buildProject('alpha'), buildProject('beta'), buildProject('gamma')];

        const { result, rerender } = renderHook(
            ({ projects: p }) => useProjectGridEntrance({ projects: p, selectedId: null }),
            { initialProps: { projects: [] as ProjectSummary[] } },
        );

        attachGridAndCards(result, projects);

        await act(async () => {
            rerender({ projects });
        });

        await act(async () => {
            await vi.advanceTimersByTimeAsync(32);
        });

        expect(result.current.hasPlayedProjectEntrance).toBe(true);

        // delay = (0.08 + (3-1)*0.05 + 1.05) * 1000 = 1230ms
        const expectedDelay = (0.08 + (projects.length - 1) * 0.05 + 1.05) * 1000;

        // Just before the timer fires
        await act(async () => {
            await vi.advanceTimersByTimeAsync(expectedDelay - 10);
        });
        expect(result.current.showAiDevKit).toBe(false);

        await act(async () => {
            await vi.advanceTimersByTimeAsync(20);
        });
        expect(result.current.showAiDevKit).toBe(true);
    });

    it('cardVariants.cluster returns offset-driven {x, y, zIndex} when offsets exist', async () => {
        const projects = [buildProject('alpha'), buildProject('beta')];
        const { result, rerender } = renderHook(
            ({ projects: p }) => useProjectGridEntrance({ projects: p, selectedId: null }),
            { initialProps: { projects: [] as ProjectSummary[] } },
        );

        attachGridAndCards(result, projects);

        await act(async () => {
            rerender({ projects });
        });

        const cluster = result.current.cardVariants.cluster({ id: 'alpha', index: 0 }) as {
            x: number;
            y: number;
            zIndex: number;
        };

        // Grid center: (300, 200). Card 0 center: (50, 50). Delta: (250, 150)
        expect(cluster.x).toBe(250);
        expect(cluster.y).toBe(150);
        expect(cluster.zIndex).toBeGreaterThan(0);
    });

    it('cardVariants.cluster falls back when offsets do not exist', () => {
        const projects = [buildProject('alpha'), buildProject('beta')];
        const { result } = renderHook(() =>
            useProjectGridEntrance({ projects, selectedId: null }),
        );

        const cluster = result.current.cardVariants.cluster({ id: 'alpha', index: 0 }) as {
            x: number;
            y: number;
            zIndex: number;
            scale: number;
        };

        expect(cluster.x).toBe(0);
        expect(cluster.y).toBe(0);
        expect(cluster.scale).toBe(0.8);
        // fallback zIndex = projects.length - index = 2 - 0 = 2
        expect(cluster.zIndex).toBe(2);
    });

    it('cardVariants.exit returns scale:1.5 for the selectedId card and opacity:0 for others', () => {
        const projects = [buildProject('alpha'), buildProject('beta')];
        const { result } = renderHook(() =>
            useProjectGridEntrance({ projects, selectedId: 'alpha' }),
        );

        const selectedExit = result.current.cardVariants.exit({ id: 'alpha', index: 0 }) as {
            scale?: number;
            opacity: number;
        };
        const otherExit = result.current.cardVariants.exit({ id: 'beta', index: 1 }) as {
            scale?: number;
            opacity: number;
        };

        expect(selectedExit.scale).toBe(1.5);
        expect(selectedExit.opacity).toBe(0);
        expect(otherExit.scale).toBeUndefined();
        expect(otherExit.opacity).toBe(0);
    });

    it('removes the resize listener and clears timers on unmount', async () => {
        inViewState.current = true;
        const projects = [buildProject('alpha')];

        const removeSpy = vi.spyOn(window, 'removeEventListener');
        const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

        const { result, rerender, unmount } = renderHook(
            ({ projects: p }) => useProjectGridEntrance({ projects: p, selectedId: null }),
            { initialProps: { projects: [] as ProjectSummary[] } },
        );

        attachGridAndCards(result, projects);

        await act(async () => {
            rerender({ projects });
        });

        // Run through the entrance so that the showAiDevKit setTimeout is scheduled
        await act(async () => {
            await vi.advanceTimersByTimeAsync(32);
        });

        unmount();

        expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
        expect(clearTimeoutSpy).toHaveBeenCalled();
    });
});
