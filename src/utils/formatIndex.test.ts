import { describe, expect, it } from 'vitest';
import { formatIndex } from './formatIndex';

describe('formatIndex', () => {
  it('returns 0-padded 2-digit string from 0-based index', () => {
    expect(formatIndex(0)).toBe('01');
    expect(formatIndex(8)).toBe('09');
    expect(formatIndex(9)).toBe('10');
    expect(formatIndex(98)).toBe('99');
  });

  it('does not truncate when index has more digits than width', () => {
    expect(formatIndex(99)).toBe('100');
    expect(formatIndex(123)).toBe('124');
  });

  it('prepends prefix when provided', () => {
    expect(formatIndex(0, 'AI·')).toBe('AI·01');
    expect(formatIndex(4, '#')).toBe('#05');
  });

  it('respects custom width', () => {
    expect(formatIndex(0, undefined, 3)).toBe('001');
    expect(formatIndex(9, 'V', 3)).toBe('V010');
  });
});
