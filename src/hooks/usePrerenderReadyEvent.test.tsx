import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePrerenderReadyEvent } from './usePrerenderReadyEvent';

describe('usePrerenderReadyEvent', () => {
  it('dispatches render-event on mount by default', () => {
    const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

    renderHook(() => usePrerenderReadyEvent());

    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'render-event' }));
  });

  it('waits until ready becomes true before dispatching', () => {
    const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

    const { rerender } = renderHook(
      ({ ready }) => usePrerenderReadyEvent(ready),
      { initialProps: { ready: false } },
    );

    expect(dispatchSpy).not.toHaveBeenCalled();

    rerender({ ready: true });

    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'render-event' }));
  });
});
