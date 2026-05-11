import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';

import BulletList from './BulletList';

describe('BulletList', () => {
  it('renders a disc-bulleted ul with all non-empty items', () => {
    const { container } = render(<BulletList items={['A', 'B', 'C']} />);
    const ul = container.querySelector('ul');

    expect(ul).not.toBeNull();
    expect(ul?.classList.contains('list-disc')).toBe(true);
    expect(ul?.querySelectorAll('li')).toHaveLength(3);
  });

  it('filters out empty / nullish entries before rendering', () => {
    const { container } = render(
      <BulletList items={['A', '', null, 'B', undefined]} />,
    );
    const items = container.querySelectorAll('li');

    expect(items).toHaveLength(2);
    expect(items[0].textContent).toBe('A');
    expect(items[1].textContent).toBe('B');
  });

  it('returns null when all items are empty / nullish', () => {
    const { container } = render(<BulletList items={['', null, undefined]} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when items is undefined', () => {
    const { container } = render(<BulletList items={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies tone "secondary" class when tone prop is secondary', () => {
    const { container } = render(
      <BulletList items={['A']} tone="secondary" />,
    );
    const ul = container.querySelector('ul');

    expect(ul?.classList.contains('text-content-secondary')).toBe(true);
  });
});
