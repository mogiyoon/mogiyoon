import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useToggleSet } from './useToggleSet';

describe('useToggleSet', () => {
  it('starts empty when no initial ids', () => {
    const { result } = renderHook(() => useToggleSet<string>());
    expect(result.current.ids.size).toBe(0);
  });

  it('accepts initial iterable (array or Set) as the starting set', () => {
    const { result } = renderHook(() => useToggleSet<string>(['a', 'b']));
    expect(result.current.ids.has('a')).toBe(true);
    expect(result.current.ids.has('b')).toBe(true);
    expect(result.current.ids.size).toBe(2);
  });

  it('toggle adds an id when absent, removes when present', () => {
    const { result } = renderHook(() => useToggleSet<string>());

    act(() => result.current.toggle('x'));
    expect(result.current.has('x')).toBe(true);

    act(() => result.current.toggle('x'));
    expect(result.current.has('x')).toBe(false);
  });

  it('toggle does not mutate previous Set (immutable update)', () => {
    const { result } = renderHook(() => useToggleSet<string>(['init']));
    const before = result.current.ids;

    act(() => result.current.toggle('new'));

    expect(result.current.ids).not.toBe(before);
    expect(before.has('new')).toBe(false);
  });

  it('reset replaces the set with new iterable', () => {
    const { result } = renderHook(() => useToggleSet<string>(['a', 'b']));

    act(() => result.current.reset(['c']));

    expect(result.current.ids.has('a')).toBe(false);
    expect(result.current.ids.has('c')).toBe(true);
    expect(result.current.ids.size).toBe(1);
  });

  it('reset with no args clears the set', () => {
    const { result } = renderHook(() => useToggleSet<string>(['a']));

    act(() => result.current.reset());

    expect(result.current.ids.size).toBe(0);
  });
});
