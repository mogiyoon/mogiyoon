import { describe, expect, it } from 'vitest';
import type { TFunction } from 'i18next';
import { fetchI18nArray } from './i18nArray';

const makeT = (response: unknown) =>
  ((() => response) as unknown) as TFunction;

describe('fetchI18nArray', () => {
  it('returns the array when t() resolves to an array', () => {
    const t = makeT([{ title: 'A' }, { title: 'B' }]);

    const result = fetchI18nArray<{ title: string }>(t, 'some.key');

    expect(result).toEqual([{ title: 'A' }, { title: 'B' }]);
  });

  it('returns [] when t() resolves to a string (key fallback)', () => {
    const t = makeT('some.key');

    const result = fetchI18nArray(t, 'some.key');

    expect(result).toEqual([]);
  });

  it('returns [] when t() resolves to null/undefined', () => {
    expect(fetchI18nArray(makeT(null), 'k')).toEqual([]);
    expect(fetchI18nArray(makeT(undefined), 'k')).toEqual([]);
  });

  it('preserves array element types via the generic', () => {
    type Item = { id: string; tech: string[] };
    const t = makeT([{ id: 'x', tech: ['react'] }] as Item[]);

    const result = fetchI18nArray<Item>(t, 'work.projects');

    expect(result[0].id).toBe('x');
    expect(result[0].tech).toEqual(['react']);
  });
});
