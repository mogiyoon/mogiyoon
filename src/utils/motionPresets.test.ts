import { describe, expect, it } from 'vitest';
import { collapseVerticalPreset } from './motionPresets';

describe('collapseVerticalPreset', () => {
  it('returns standard height+opacity transitions', () => {
    const preset = collapseVerticalPreset();
    expect(preset.initial).toEqual({ height: 0, opacity: 0 });
    expect(preset.animate).toEqual({ height: 'auto', opacity: 1 });
    expect(preset.exit).toEqual({ height: 0, opacity: 0 });
  });

  it('uses default duration of 0.25s with easeInOut', () => {
    const preset = collapseVerticalPreset();
    expect(preset.transition).toMatchObject({ duration: 0.25, ease: 'easeInOut' });
  });

  it('respects custom duration', () => {
    const preset = collapseVerticalPreset(0.42);
    expect(preset.transition).toMatchObject({ duration: 0.42, ease: 'easeInOut' });
  });

  it('sets overflow:hidden inline style for clean height animation', () => {
    expect(collapseVerticalPreset().style).toEqual({ overflow: 'hidden' });
  });
});
