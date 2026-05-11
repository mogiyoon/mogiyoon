import { describe, expect, it } from 'vitest';
import { matchItemIconKey } from './iconMatcher';

describe('matchItemIconKey', () => {
  it('matches by exact English keyword', () => {
    const decomposition = matchItemIconKey('Decomposition pattern', 0);
    const merge = matchItemIconKey('Merge step', 0);
    const loop = matchItemIconKey('Loop control', 0);
    const routing = matchItemIconKey('Routing condition', 0);
    const document = matchItemIconKey('Document output', 0);
    const trigger = matchItemIconKey('Trigger pipeline', 0);

    expect(decomposition).not.toBe(merge);
    expect(merge).not.toBe(loop);
    expect(loop).not.toBe(routing);
    expect(routing).not.toBe(document);
    expect(document).not.toBe(trigger);
  });

  it('matches by Korean keyword', () => {
    expect(matchItemIconKey('역할 분해', 0)).toBe(matchItemIconKey('decomposition', 0));
    expect(matchItemIconKey('병합', 0)).toBe(matchItemIconKey('merge', 0));
    expect(matchItemIconKey('루프', 0)).toBe(matchItemIconKey('loop', 0));
    expect(matchItemIconKey('분기', 0)).toBe(matchItemIconKey('routing', 0));
    expect(matchItemIconKey('산출 문서', 0)).toBe(matchItemIconKey('document', 0));
    expect(matchItemIconKey('트리거', 0)).toBe(matchItemIconKey('trigger', 0));
  });

  it('case-insensitive matching', () => {
    expect(matchItemIconKey('DECOMPOSITION', 0)).toBe(matchItemIconKey('decomposition', 0));
    expect(matchItemIconKey('Merge', 0)).toBe(matchItemIconKey('merge', 0));
  });

  it('returns alternating fallback when no keyword matches (index parity)', () => {
    const evenFallback = matchItemIconKey('totally unmatched title', 0);
    const oddFallback = matchItemIconKey('totally unmatched title', 1);

    expect(evenFallback).not.toBe(oddFallback);
    expect(matchItemIconKey('xxx', 2)).toBe(evenFallback);
    expect(matchItemIconKey('xxx', 3)).toBe(oddFallback);
  });

  it('first matching pattern wins when title has multiple keywords', () => {
    // "decomposition" comes before "merge" in the pattern table
    expect(matchItemIconKey('decomposition and merge', 0)).toBe(matchItemIconKey('decomposition', 0));
  });
});
