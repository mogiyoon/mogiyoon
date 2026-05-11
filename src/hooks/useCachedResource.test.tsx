import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createCachedResource, useCachedResource } from './useCachedResource';

describe('useCachedResource', () => {
  it('loads data once and reuses the cached value for later hook instances', async () => {
    const loader = vi.fn(async () => ({ value: 42 }));
    const resource = createCachedResource(loader);

    const first = renderHook(() => useCachedResource(resource));

    expect(first.result.current.isLoading).toBe(true);
    expect(first.result.current.data).toBe(null);

    await waitFor(() => expect(first.result.current.data).toEqual({ value: 42 }));
    expect(first.result.current.isLoading).toBe(false);
    expect(loader).toHaveBeenCalledTimes(1);

    const second = renderHook(() => useCachedResource(resource));

    expect(second.result.current.data).toEqual({ value: 42 });
    expect(second.result.current.isLoading).toBe(false);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('shares an in-flight request between concurrent consumers', async () => {
    let resolveLoader: ((value: { value: number }) => void) | undefined;
    const loader = vi.fn(
      () =>
        new Promise<{ value: number }>((resolve) => {
          resolveLoader = resolve;
        }),
    );
    const resource = createCachedResource(loader);

    const first = renderHook(() => useCachedResource(resource));
    const second = renderHook(() => useCachedResource(resource));

    expect(loader).toHaveBeenCalledTimes(1);

    resolveLoader?.({ value: 7 });

    await waitFor(() => expect(first.result.current.data).toEqual({ value: 7 }));
    await waitFor(() => expect(second.result.current.data).toEqual({ value: 7 }));
  });
});
