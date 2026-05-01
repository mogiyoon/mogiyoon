import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';

import { Chip } from './Chip';

describe('Chip', () => {
  it('renders default tone (neutralSoft) and size (sm) with rounded-full base classes', () => {
    const { container } = render(<Chip>Default</Chip>);
    const chip = container.firstChild as HTMLSpanElement;

    expect(chip).not.toBeNull();
    expect(chip.tagName).toBe('SPAN');
    expect(chip.className).toContain('rounded-full');
    expect(chip.className).toContain('bg-slate-200');
    expect(chip.className).toContain('text-content-strong');
    expect(chip.textContent).toBe('Default');
  });

  it('renders accentSolid tone with bg-accent-500 text-white', () => {
    const { container } = render(<Chip tone="accentSolid">Solid</Chip>);
    const chip = container.firstChild as HTMLSpanElement;

    expect(chip.className).toContain('bg-accent-500');
    expect(chip.className).toContain('text-white');
  });

  it('renders size="md" weight="semibold" with font-semibold and text-xs px-2.5 py-1', () => {
    const { container } = render(
      <Chip size="md" weight="semibold">
        Md
      </Chip>,
    );
    const chip = container.firstChild as HTMLSpanElement;

    expect(chip.className).toContain('font-semibold');
    expect(chip.className).toContain('text-xs');
    expect(chip.className).toContain('px-2.5');
    expect(chip.className).toContain('py-1');
  });
});
