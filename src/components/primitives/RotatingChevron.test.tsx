import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';

import RotatingChevron from './RotatingChevron';

describe('RotatingChevron', () => {
  it('renders an svg with default sm size (w-3.5 h-3.5)', () => {
    const { container } = render(<RotatingChevron isRotated={false} />);
    const svg = container.querySelector('svg');

    expect(svg).not.toBeNull();
    expect(svg?.classList.contains('w-3.5')).toBe(true);
    expect(svg?.classList.contains('h-3.5')).toBe(true);
  });

  it('applies size variant classes', () => {
    const { container } = render(<RotatingChevron isRotated={false} size="lg" />);
    const svg = container.querySelector('svg');

    expect(svg?.classList.contains('w-5')).toBe(true);
    expect(svg?.classList.contains('h-5')).toBe(true);
  });

  it('passes extra className through', () => {
    const { container } = render(
      <RotatingChevron isRotated={false} className="text-accent-500" />,
    );
    const svg = container.querySelector('svg');

    expect(svg?.classList.contains('text-accent-500')).toBe(true);
  });

  it('renders chevron path geometry', () => {
    const { container } = render(<RotatingChevron isRotated />);
    const path = container.querySelector('path');

    expect(path?.getAttribute('d')).toBe('M19 9l-7 7-7-7');
  });
});
