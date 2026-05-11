import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import ExternalLink from './ExternalLink';

describe('ExternalLink', () => {
  it('defaults target="_blank" rel="noopener noreferrer"', () => {
    const { container } = render(<ExternalLink href="https://x.com">go</ExternalLink>);
    const a = container.querySelector('a');

    expect(a?.getAttribute('target')).toBe('_blank');
    expect(a?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('forwards href / className / children', () => {
    const { container, getByText } = render(
      <ExternalLink href="https://x.com" className="text-blue-500">link</ExternalLink>,
    );
    const a = container.querySelector('a');

    expect(a?.getAttribute('href')).toBe('https://x.com');
    expect(a?.classList.contains('text-blue-500')).toBe(true);
    expect(getByText('link')).toBeTruthy();
  });

  it('allows target/rel override', () => {
    const { container } = render(
      <ExternalLink href="/page" target="_self" rel="noreferrer">internal</ExternalLink>,
    );
    const a = container.querySelector('a');

    expect(a?.getAttribute('target')).toBe('_self');
    expect(a?.getAttribute('rel')).toBe('noreferrer');
  });
});
