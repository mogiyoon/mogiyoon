import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFetchJson } from './useFetchJson';

const originalFetch = globalThis.fetch;

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

const mockFetchOnce = (response: Partial<Response>) => {
  globalThis.fetch = vi.fn(() => Promise.resolve(response as Response)) as unknown as typeof fetch;
};

describe('useFetchJson', () => {
  it('returns loading=true initially when url is given', () => {
    mockFetchOnce({ ok: true, json: () => Promise.resolve({}) });

    const { result } = renderHook(() => useFetchJson('/data/x.json'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('resolves with data on successful fetch', async () => {
    mockFetchOnce({ ok: true, json: () => Promise.resolve({ id: 'abc' }) });

    const { result } = renderHook(() => useFetchJson<{ id: string }>('/data/x.json'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual({ id: 'abc' });
    expect(result.current.error).toBe(null);
  });

  it('sets error string on non-OK response', async () => {
    mockFetchOnce({ ok: false, status: 404, json: () => Promise.resolve({}) });

    const { result } = renderHook(() => useFetchJson('/data/missing.json'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBe(null);
    expect(result.current.error).toMatch(/404/);
  });

  it('skips fetch and loading=false when url is null', () => {
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const { result } = renderHook(() => useFetchJson(null));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(null);
  });

  it('re-fetches when url changes', async () => {
    const fetchSpy = vi.fn((url: string) =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ requested: url }),
      } as unknown as Response),
    );
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const { result, rerender } = renderHook(({ url }) => useFetchJson<{ requested: string }>(url), {
      initialProps: { url: '/data/a.json' },
    });

    await waitFor(() => expect(result.current.data?.requested).toBe('/data/a.json'));

    rerender({ url: '/data/b.json' });
    await waitFor(() => expect(result.current.data?.requested).toBe('/data/b.json'));

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
