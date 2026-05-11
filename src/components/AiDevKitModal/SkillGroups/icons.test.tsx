import { describe, expect, it } from 'vitest';
import { matchItemIcon } from './icons';

describe('matchItemIcon', () => {
  it('matches by exact English keyword', () => {
    const decomposition = matchItemIcon('Decomposition pattern', 0);
    const merge = matchItemIcon('Merge step', 0);
    const loop = matchItemIcon('Loop control', 0);
    const routing = matchItemIcon('Routing condition', 0);
    const document = matchItemIcon('Document output', 0);
    const trigger = matchItemIcon('Trigger pipeline', 0);

    expect(decomposition).not.toBe(merge);
    expect(merge).not.toBe(loop);
    expect(loop).not.toBe(routing);
    expect(routing).not.toBe(document);
    expect(document).not.toBe(trigger);
  });

  it('matches by Korean keyword', () => {
    expect(matchItemIcon('역할 분해', 0)).toBe(matchItemIcon('decomposition', 0));
    expect(matchItemIcon('병합', 0)).toBe(matchItemIcon('merge', 0));
    expect(matchItemIcon('루프', 0)).toBe(matchItemIcon('loop', 0));
    expect(matchItemIcon('분기', 0)).toBe(matchItemIcon('routing', 0));
    expect(matchItemIcon('산출 문서', 0)).toBe(matchItemIcon('document', 0));
    expect(matchItemIcon('트리거', 0)).toBe(matchItemIcon('trigger', 0));
  });

  it('case-insensitive matching', () => {
    expect(matchItemIcon('DECOMPOSITION', 0)).toBe(matchItemIcon('decomposition', 0));
    expect(matchItemIcon('Merge', 0)).toBe(matchItemIcon('merge', 0));
  });

  it('returns alternating fallback when no keyword matches (index parity)', () => {
    const evenFallback = matchItemIcon('totally unmatched title', 0);
    const oddFallback = matchItemIcon('totally unmatched title', 1);

    expect(evenFallback).not.toBe(oddFallback);
    expect(matchItemIcon('xxx', 2)).toBe(evenFallback);
    expect(matchItemIcon('xxx', 3)).toBe(oddFallback);
  });

  it('first matching pattern wins when title has multiple keywords', () => {
    // "decomposition" comes before "merge" in the pattern table
    expect(matchItemIcon('decomposition and merge', 0)).toBe(matchItemIcon('decomposition', 0));
  });
});
