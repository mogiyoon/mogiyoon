import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useProjectFlipPreview } from './useProjectFlipPreview';

describe('useProjectFlipPreview', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('returns activeProjectIndex=0 and isFlipped=false on initial render', () => {
        const { result } = renderHook(() => useProjectFlipPreview(3));

        expect(result.current.activeProjectIndex).toBe(0);
        expect(result.current.isFlipped).toBe(false);
    });

    it('does not start an interval when projectCount === 0', () => {
        const setIntervalSpy = vi.spyOn(window, 'setInterval');

        const { result } = renderHook(() => useProjectFlipPreview(0));

        expect(setIntervalSpy).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(10_000);
        });

        expect(result.current.activeProjectIndex).toBe(0);
        expect(result.current.isFlipped).toBe(false);
    });

    it('advances stepIndex after each intervalMs, flipping isFlipped between true and false', () => {
        const { result } = renderHook(() => useProjectFlipPreview(3, 1000));

        // step 0 -> activeProjectIndex 0, isFlipped false
        expect(result.current.activeProjectIndex).toBe(0);
        expect(result.current.isFlipped).toBe(false);

        // step 1 -> activeProjectIndex 0, isFlipped true
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(result.current.activeProjectIndex).toBe(0);
        expect(result.current.isFlipped).toBe(true);

        // step 2 -> activeProjectIndex 1, isFlipped false
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(result.current.activeProjectIndex).toBe(1);
        expect(result.current.isFlipped).toBe(false);

        // step 3 -> activeProjectIndex 1, isFlipped true
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(result.current.activeProjectIndex).toBe(1);
        expect(result.current.isFlipped).toBe(true);
    });

    it('wraps stepIndex around (projectCount * 2) modulo', () => {
        const projectCount = 2;
        const intervalMs = 500;
        const { result } = renderHook(() => useProjectFlipPreview(projectCount, intervalMs));

        // total steps = 4. After 4 ticks we should be back to step 0.
        act(() => {
            vi.advanceTimersByTime(intervalMs * 4);
        });

        expect(result.current.activeProjectIndex).toBe(0);
        expect(result.current.isFlipped).toBe(false);

        // One more tick -> step 1
        act(() => {
            vi.advanceTimersByTime(intervalMs);
        });
        expect(result.current.activeProjectIndex).toBe(0);
        expect(result.current.isFlipped).toBe(true);
    });

    it('resets stepIndex to 0 when projectCount changes', () => {
        const { result, rerender } = renderHook(
            ({ count, ms }: { count: number; ms: number }) => useProjectFlipPreview(count, ms),
            { initialProps: { count: 3, ms: 1000 } },
        );

        // Advance several steps.
        act(() => {
            vi.advanceTimersByTime(3000);
        });
        // step would be 3 -> activeProjectIndex 1, isFlipped true
        expect(result.current.activeProjectIndex).toBe(1);
        expect(result.current.isFlipped).toBe(true);

        // Change projectCount; stepIndex should reset to 0.
        act(() => {
            rerender({ count: 5, ms: 1000 });
        });

        expect(result.current.activeProjectIndex).toBe(0);
        expect(result.current.isFlipped).toBe(false);
    });

    it('clears the previous interval when projectCount or intervalMs change', () => {
        const clearSpy = vi.spyOn(window, 'clearInterval');

        const { rerender } = renderHook(
            ({ count, ms }: { count: number; ms: number }) => useProjectFlipPreview(count, ms),
            { initialProps: { count: 3, ms: 1000 } },
        );

        const baselineCalls = clearSpy.mock.calls.length;

        // Change intervalMs -> effect re-runs and previous interval should be cleared.
        act(() => {
            rerender({ count: 3, ms: 500 });
        });
        expect(clearSpy.mock.calls.length).toBeGreaterThan(baselineCalls);

        const afterMsChange = clearSpy.mock.calls.length;

        // Change projectCount -> previous interval cleared again.
        act(() => {
            rerender({ count: 4, ms: 500 });
        });
        expect(clearSpy.mock.calls.length).toBeGreaterThan(afterMsChange);
    });

    it('clears the interval on unmount and stops advancing state', () => {
        const clearSpy = vi.spyOn(window, 'clearInterval');

        const { result, unmount } = renderHook(() => useProjectFlipPreview(3, 1000));

        // Advance once to ensure interval is running.
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        const snapshotIndex = result.current.activeProjectIndex;
        const snapshotFlipped = result.current.isFlipped;

        const beforeUnmount = clearSpy.mock.calls.length;
        unmount();
        expect(clearSpy.mock.calls.length).toBeGreaterThan(beforeUnmount);

        // Further timer advancement must not change state (interval was cleared).
        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(result.current.activeProjectIndex).toBe(snapshotIndex);
        expect(result.current.isFlipped).toBe(snapshotFlipped);
    });
});
