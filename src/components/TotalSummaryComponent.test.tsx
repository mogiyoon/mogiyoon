import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'ko', resolvedLanguage: 'ko' },
  }),
}));

import TotalSummaryComponent from './TotalSummaryComponent';
import type { ProjectData } from '../types';

const t = ((key: string) => key) as unknown as Parameters<
  typeof TotalSummaryComponent
>[0]['t'];

const buildProject = (
  overrides: Partial<ProjectData> = {}
): ProjectData => ({
  id: 'sample',
  title: 'sample.title',
  subtitle: 'sample.subtitle',
  demoGifSrc: '/demo.gif',
  description: 'sample.description',
  features: [],
  screenshots: [],
  license: { name: 'MIT', url: 'https://example.com/license' },
  overview: {
    period: '2024.01 - 2024.06',
    projectType: 'sample.projectType',
    role: 'sample.role',
    other: 'sample.other',
    github: 'https://github.com/example/repo',
    demo: 'https://demo.example.com',
    notion: 'https://notion.example.com',
  },
  summaries: [
    {
      id: 'section-1',
      title: 'sample.section.title',
      parts: [
        [
          { type: 'text', content: 'sample.text.content' },
          {
            type: 'subtitle',
            id: 'subtitle-1',
            content: 'sample.subtitle.content',
          },
          {
            type: 'image',
            src: '/img.png',
            alt: 'sample alt',
            caption: 'sample.image.caption',
          },
          {
            type: 'image-group',
            images: [
              {
                src: '/img-a.png',
                alt: 'a alt',
                caption: 'sample.group.caption',
              },
            ],
          },
          {
            type: 'link',
            label: 'sample link',
            href: 'https://example.com',
          },
        ],
      ],
    },
  ],
  ...overrides,
});

const renderComponent = (project: ProjectData) =>
  render(<TotalSummaryComponent project={project} t={t} />);

beforeEach(() => {
  Object.defineProperty(window, 'location', {
    value: {
      origin: 'https://site.test',
      pathname: '/projects/sample',
    },
    configurable: true,
    writable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('TotalSummaryComponent', () => {
  it('renders all summary part kinds (text, subtitle, image, image-group, link)', () => {
    renderComponent(buildProject());

    // text
    expect(screen.getByText('sample.text.content')).toBeInTheDocument();
    // subtitle
    expect(screen.getByText('sample.subtitle.content')).toBeInTheDocument();
    // image
    const image = screen.getByAltText('sample alt') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toBe('/img.png');
    expect(screen.getByText('sample.image.caption')).toBeInTheDocument();
    // image-group
    const groupImage = screen.getByAltText('a alt') as HTMLImageElement;
    expect(groupImage).toBeInTheDocument();
    expect(groupImage.getAttribute('src')).toBe('/img-a.png');
    expect(screen.getByText('sample.group.caption')).toBeInTheDocument();
    // link
    const link = screen.getByText('sample link').closest('a');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe('https://example.com');
  });

  it('renders only the LinkButtons that are present in overview', () => {
    const project = buildProject({
      overview: {
        github: 'https://github.com/example/repo',
        demo: undefined,
        notion: undefined,
      },
    });

    renderComponent(project);

    expect(screen.getByText('GitHub').closest('a')?.getAttribute('href')).toBe(
      'https://github.com/example/repo'
    );
    expect(screen.queryByText('Demo')).not.toBeInTheDocument();
    expect(screen.queryByText('Notion')).not.toBeInTheDocument();
  });

  it('renders all three LinkButtons when github/demo/notion are all present', () => {
    renderComponent(buildProject());

    expect(screen.getByText('GitHub').closest('a')?.getAttribute('href')).toBe(
      'https://github.com/example/repo'
    );
    expect(screen.getByText('Demo').closest('a')?.getAttribute('href')).toBe(
      'https://demo.example.com'
    );
    expect(screen.getByText('Notion').closest('a')?.getAttribute('href')).toBe(
      'https://notion.example.com'
    );
  });

  it('renders InfoCells only for present overview fields', () => {
    renderComponent(buildProject());

    expect(screen.getByText('2024.01 - 2024.06')).toBeInTheDocument();
    expect(screen.getByText('sample.projectType')).toBeInTheDocument();
    expect(screen.getByText('sample.role')).toBeInTheDocument();
    expect(screen.getByText('sample.other')).toBeInTheDocument();
  });

  it('omits InfoCells for absent overview fields', () => {
    const project = buildProject({
      overview: {
        period: '2024.01 - 2024.06',
      },
    });

    renderComponent(project);

    expect(screen.getByText('2024.01 - 2024.06')).toBeInTheDocument();
    expect(screen.queryByText('sample.role')).not.toBeInTheDocument();
    expect(screen.queryByText('sample.other')).not.toBeInTheDocument();
    // No projectType cell
    expect(screen.queryByText('sample.projectType')).not.toBeInTheDocument();
  });

  it('copies origin+pathname#id when a subtitle is clicked and shows success toast', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    renderComponent(buildProject());

    const subtitle = screen.getByText('sample.subtitle.content');
    fireEvent.click(subtitle);

    expect(writeText).toHaveBeenCalledWith(
      'https://site.test/projects/sample#subtitle-1'
    );

    await waitFor(() => {
      expect(screen.getByText('linkCopied')).toBeInTheDocument();
    });

    const toast = screen.getByText('linkCopied');
    expect(toast.className).toContain('bg-green-200');
  });

  it('shows linkCopyFailed toast with isSuccess=false when clipboard rejects', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    renderComponent(buildProject());

    const subtitle = screen.getByText('sample.subtitle.content');
    fireEvent.click(subtitle);

    await waitFor(() => {
      expect(screen.getByText('linkCopyFailed')).toBeInTheDocument();
    });

    const toast = screen.getByText('linkCopyFailed');
    expect(toast.className).toContain('bg-red-200');
  });

  it('auto-clears the toast after 3000ms', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    renderComponent(buildProject());

    const subtitle = screen.getByText('sample.subtitle.content');
    fireEvent.click(subtitle);

    // Flush the resolved clipboard promise so setToastMessage runs
    await vi.waitFor(() => {
      expect(screen.getByText('linkCopied')).toBeInTheDocument();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('linkCopied')).not.toBeInTheDocument();
  });
});
