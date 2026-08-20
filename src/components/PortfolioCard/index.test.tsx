import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import type { ProjectSummary } from '../../types';
import {
  PLACEHOLDER_NOT_FOUND_300x200,
  PLACEHOLDER_PROJECT_IMAGE_300x300,
} from '../../utils/placeholders';
import PortfolioCard from './index';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'ko', resolvedLanguage: 'ko' },
  }),
}));

const baseProject: ProjectSummary = {
  id: 'sample',
  title: 'sample.title',
  subtitle: 'sample.subtitle',
  projectType: 'sample.projectType',
  screenshots: [{ src: 'https://example.com/shot1.png', alt: 'shot1' }],
  techStack: ['React', 'TypeScript', 'Vitest'],
};

const renderCard = (
  overrides: Partial<ProjectSummary> = {},
  onClick: () => void = () => undefined,
) => {
  const project: ProjectSummary = { ...baseProject, ...overrides };
  return render(<PortfolioCard project={project} onClick={onClick} />);
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('PortfolioCard', () => {
  it('renders translated title, subtitle, and project type via i18n keys', () => {
    renderCard();

    expect(screen.getByText('sample.title')).toBeInTheDocument();
    expect(screen.getByText('sample.subtitle')).toBeInTheDocument();
    expect(screen.getByText('sample.projectType')).toBeInTheDocument();
  });

  it('renders the first screenshot src as the thumbnail image', () => {
    renderCard();

    const img = screen.getByAltText('sample.title Thumbnail') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/shot1.png');
  });

  it('falls back to placeholder URL when screenshots is empty', () => {
    renderCard({ screenshots: [] });

    const img = screen.getByAltText('sample.title Thumbnail') as HTMLImageElement;
    expect(img.src).toBe(PLACEHOLDER_PROJECT_IMAGE_300x300);
  });

  it('swaps src to the not-found placeholder and clears onerror on image error', () => {
    renderCard();

    const img = screen.getByAltText('sample.title Thumbnail') as HTMLImageElement;
    fireEvent.error(img);

    expect(img.src).toBe(PLACEHOLDER_NOT_FOUND_300x200);
    expect(img.onerror).toBeNull();
  });

  it('invokes onClick prop when the card is clicked', () => {
    const onClick = vi.fn();
    renderCard({}, onClick);

    const title = screen.getByText('sample.title');
    fireEvent.click(title);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('flips to the back face on mouseEnter (rotateY(180deg))', () => {
    const { container } = renderCard();

    const perspectiveContainer = container.querySelector(
      'div[style*="perspective"]',
    ) as HTMLElement;
    expect(perspectiveContainer).toBeTruthy();

    const inner = perspectiveContainer.firstElementChild as HTMLElement;
    expect(inner.style.transform).toBe('rotateY(0deg)');

    fireEvent.mouseEnter(perspectiveContainer);

    expect(inner.style.transform).toBe('rotateY(180deg)');
  });

  it('resets the flip state when the card is clicked', () => {
    const { container } = renderCard();

    const perspectiveContainer = container.querySelector(
      'div[style*="perspective"]',
    ) as HTMLElement;
    const inner = perspectiveContainer.firstElementChild as HTMLElement;

    fireEvent.mouseEnter(perspectiveContainer);
    expect(inner.style.transform).toBe('rotateY(180deg)');

    fireEvent.click(perspectiveContainer);

    expect(inner.style.transform).toBe('rotateY(0deg)');
  });

  it('renders as a real anchor to /project/:id so crawlers can discover the detail page', () => {
    renderCard();

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/project/sample');
    // 접근 가능한 이름에 제목과 부제가 들어간다
    expect(link.getAttribute('aria-label')).toBe('sample.title — sample.subtitle');
  });

  it('prevents default navigation on a plain left click and calls onClick instead', () => {
    const onClick = vi.fn();
    renderCard({}, onClick);

    const link = screen.getByRole('link');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    link.dispatchEvent(event);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('lets modifier clicks (cmd/ctrl) fall through to the browser for open-in-new-tab', () => {
    const onClick = vi.fn();
    renderCard({}, onClick);

    const link = screen.getByRole('link');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, metaKey: true });
    link.dispatchEvent(event);

    expect(onClick).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it('flips on keyboard focus and flips back on blur', () => {
    const { container } = renderCard();

    const link = screen.getByRole('link');
    const perspectiveContainer = container.querySelector(
      'div[style*="perspective"]',
    ) as HTMLElement;
    const inner = perspectiveContainer.firstElementChild as HTMLElement;

    fireEvent.focus(link);
    expect(inner.style.transform).toBe('rotateY(180deg)');

    fireEvent.blur(link);
    expect(inner.style.transform).toBe('rotateY(0deg)');
  });

  it('renders the Vibe sparkle badge only when claudeInfo is truthy', () => {
    const { rerender } = renderCard();
    expect(screen.queryByText('Vibe')).toBeNull();

    rerender(
      <PortfolioCard
        project={{
          ...baseProject,
          claudeInfo: {
            method: 'direct',
            summary: 'sample.claudeInfo.summary',
          },
        }}
        onClick={() => undefined}
      />,
    );

    expect(screen.getByText('Vibe')).toBeInTheDocument();
  });

  it('renders the stickerText badge only when stickerText is truthy', () => {
    const { rerender } = renderCard();
    expect(screen.queryByText('NEW')).toBeNull();

    rerender(
      <PortfolioCard
        project={{ ...baseProject, stickerText: 'NEW' }}
        onClick={() => undefined}
      />,
    );

    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('renders one tech-stack chip per techStack entry on the back face', () => {
    renderCard();

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Vitest')).toBeInTheDocument();
  });
});
