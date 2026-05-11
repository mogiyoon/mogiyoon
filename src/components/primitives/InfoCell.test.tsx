import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import InfoCell from './InfoCell';

describe('InfoCell', () => {
  it('renders label and value as two paragraphs', () => {
    const { container, getByText } = render(<InfoCell label="Email" value="a@b.com" />);
    const paragraphs = container.querySelectorAll('p');

    expect(paragraphs).toHaveLength(2);
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('a@b.com')).toBeTruthy();
  });

  it('defaults to subtle variant (bg-surface-subtle, no border)', () => {
    const { container } = render(<InfoCell label="Phone" value="010" />);
    const cell = container.firstChild as HTMLDivElement;

    expect(cell.className).toContain('bg-surface-subtle');
    expect(cell.className).not.toContain('border-line');
  });

  it('renders bordered variant with border + bg-surface', () => {
    const { container } = render(
      <InfoCell label="Grade" value="3.8" variant="bordered" />,
    );
    const cell = container.firstChild as HTMLDivElement;

    expect(cell.className).toContain('border');
    expect(cell.className).toContain('bg-surface');
    expect(cell.className).not.toContain('bg-surface-subtle');
  });

  it('appends extra className to the container', () => {
    const { container } = render(
      <InfoCell label="X" value="Y" className="mt-3" />,
    );
    const cell = container.firstChild as HTMLDivElement;

    expect(cell.className).toContain('mt-3');
  });

  it('appends extra class names to label and value independently', () => {
    const { getByText } = render(
      <InfoCell
        label="Label"
        value="Value"
        labelClassName="text-red-500"
        valueClassName="text-blue-500"
      />,
    );

    expect(getByText('Label').className).toContain('text-red-500');
    expect(getByText('Value').className).toContain('text-blue-500');
  });
});
