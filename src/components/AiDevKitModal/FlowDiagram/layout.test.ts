import { describe, expect, it } from 'vitest';
import { getArrowPath, getLoopNodePositions, sanitizeId, toStepItems } from './layout';

describe('toStepItems', () => {
  it('maps strings to FlowStep with 0-based index when no offset', () => {
    expect(toStepItems(['a', 'b', 'c'])).toEqual([
      { step: 'a', index: 0, detail: undefined },
      { step: 'b', index: 1, detail: undefined },
      { step: 'c', index: 2, detail: undefined },
    ]);
  });

  it('shifts indices by offset (for post-loop steps)', () => {
    expect(toStepItems(['x', 'y'], 5)).toEqual([
      { step: 'x', index: 5, detail: undefined },
      { step: 'y', index: 6, detail: undefined },
    ]);
  });

  it('attaches detail by absolute index (offset + local)', () => {
    const details = [
      { actor: 'A0', action: 'do0' },
      { actor: 'A1', action: 'do1' },
      { actor: 'A2', action: 'do2' },
    ];
    const result = toStepItems(['b', 'c'], 1, details);
    expect(result[0].detail).toEqual({ actor: 'A1', action: 'do1' });
    expect(result[1].detail).toEqual({ actor: 'A2', action: 'do2' });
  });
});

describe('sanitizeId', () => {
  it('keeps alphanumerics, hyphen, underscore unchanged', () => {
    expect(sanitizeId('abc-123_XYZ')).toBe('abc-123_XYZ');
  });

  it('replaces all other chars with hyphen', () => {
    expect(sanitizeId('hello world!')).toBe('hello-world-');
    expect(sanitizeId('a/b/c')).toBe('a-b-c');
    expect(sanitizeId('한글-test')).toBe('---test');
  });
});

describe('getArrowPath', () => {
  it('returns a Move + Line SVG path string', () => {
    const path = getArrowPath({ x: 0, y: 0 }, { x: 100, y: 0 });
    expect(path).toMatch(/^M [\d.]+ [\d.]+ L [\d.]+ [\d.]+$/);
  });

  it('trims start padding from the from-point along the direction vector', () => {
    const path = getArrowPath({ x: 0, y: 0 }, { x: 100, y: 0 }, 20, 20);
    // After trimming, the start should be at x=20 (not 0).
    expect(path).toMatch(/^M 20 /);
  });

  it('caps padding so the arrow never collapses below MIN_ARROW_SEGMENT', () => {
    // Length = 10, MIN_ARROW_SEGMENT = 18, so maxPadding = max(0, (10-18)/2) = 0.
    // Both paddings should be clamped to 0; path stays full.
    const path = getArrowPath({ x: 0, y: 0 }, { x: 10, y: 0 }, 100, 100);
    expect(path).toBe('M 0 0 L 10 0');
  });
});

describe('getLoopNodePositions', () => {
  it('returns 2 hand-tuned positions for size=2', () => {
    expect(getLoopNodePositions(2, 430)).toHaveLength(2);
  });

  it('returns 3 hand-tuned positions for size=3', () => {
    expect(getLoopNodePositions(3, 430)).toHaveLength(3);
  });

  it('returns 4 hand-tuned positions for size=4', () => {
    expect(getLoopNodePositions(4, 580)).toHaveLength(4);
  });

  it('returns size N elliptically distributed positions for size > 4', () => {
    const positions = getLoopNodePositions(6, 580);
    expect(positions).toHaveLength(6);
    // Each entry should have numeric left + top.
    for (const p of positions) {
      expect(typeof p.left).toBe('number');
      expect(typeof p.top).toBe('number');
    }
  });
});
