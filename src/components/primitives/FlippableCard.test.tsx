import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { FlippableCard } from './FlippableCard';

describe('FlippableCard', () => {
  it('renders both faces regardless of isFlipped (CSS-only flip)', () => {
    render(
      <FlippableCard
        isFlipped={false}
        front={<span>front-face</span>}
        back={<span>back-face</span>}
      />,
    );

    expect(screen.getByText('front-face')).toBeInTheDocument();
    expect(screen.getByText('back-face')).toBeInTheDocument();
  });

  it('applies rotateY(0deg) inline style on inner when isFlipped=false', () => {
    const { container } = render(
      <FlippableCard
        isFlipped={false}
        front={<span>f</span>}
        back={<span>b</span>}
      />,
    );

    const perspectiveContainer = container.querySelector(
      'div[style*="perspective"]',
    ) as HTMLElement;
    expect(perspectiveContainer).toBeTruthy();

    const inner = perspectiveContainer.firstElementChild as HTMLElement;
    expect(inner.style.transform).toBe('rotateY(0deg)');
  });

  it('applies rotateY(180deg) inline style on inner when isFlipped=true', () => {
    const { container } = render(
      <FlippableCard
        isFlipped={true}
        front={<span>f</span>}
        back={<span>b</span>}
      />,
    );

    const perspectiveContainer = container.querySelector(
      'div[style*="perspective"]',
    ) as HTMLElement;
    const inner = perspectiveContainer.firstElementChild as HTMLElement;
    expect(inner.style.transform).toBe('rotateY(180deg)');
  });

  it('fires onClick, onMouseEnter, and onMouseLeave on the perspective wrapper', () => {
    const onClick = vi.fn();
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();

    const { container } = render(
      <FlippableCard
        isFlipped={false}
        front={<span>f</span>}
        back={<span>b</span>}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />,
    );

    const perspectiveContainer = container.querySelector(
      'div[style*="perspective"]',
    ) as HTMLElement;

    fireEvent.mouseEnter(perspectiveContainer);
    fireEvent.mouseLeave(perspectiveContainer);
    fireEvent.click(perspectiveContainer);

    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
