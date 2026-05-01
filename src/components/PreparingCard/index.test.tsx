import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'ko', resolvedLanguage: 'ko' },
  }),
}));

import {
  PLACEHOLDER_COMING_SOON_300x300,
  PLACEHOLDER_NOT_FOUND_300x300,
} from '../../utils/placeholders';
import PreparingCard, { type PreparingProjectData } from './index';

const baseProject: PreparingProjectData = {
  id: 'preparing-1',
  title: 'preparing.alpha.title',
  subtitle: 'preparing.alpha.subtitle',
};

describe('PreparingCard', () => {
  it('renders project title and subtitle through useTranslation', () => {
    render(<PreparingCard project={baseProject} />);

    expect(screen.getByText('preparing.alpha.title')).toBeInTheDocument();
    expect(screen.getByText('preparing.alpha.subtitle')).toBeInTheDocument();
  });

  it('renders the Coming+Soon placeholder image as the thumbnail', () => {
    render(<PreparingCard project={baseProject} />);

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe(PLACEHOLDER_COMING_SOON_300x300);
    expect(img.getAttribute('alt')).toBe('preparing.alpha.title Thumbnail');
  });

  it('renders the comingSoon translation key as the badge label', () => {
    render(<PreparingCard project={baseProject} />);

    expect(screen.getByText('comingSoon')).toBeInTheDocument();
  });

  it('swaps src to the not-found placeholder and clears onerror when image errors', () => {
    render(<PreparingCard project={baseProject} />);

    const img = screen.getByRole('img') as HTMLImageElement;
    fireEvent.error(img);

    expect(img.getAttribute('src')).toBe(PLACEHOLDER_NOT_FOUND_300x300);
    expect(img.onerror).toBeNull();
  });

  it('applies the dashed border and grayscale classes to the card', () => {
    const { container } = render(<PreparingCard project={baseProject} />);

    const outer = container.firstChild as HTMLElement;
    expect(outer).not.toBeNull();
    const cardInner = outer.firstChild as HTMLElement;
    expect(cardInner).not.toBeNull();
    expect(cardInner.className).toContain('border-dashed');

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.className).toContain('grayscale');
  });
});
