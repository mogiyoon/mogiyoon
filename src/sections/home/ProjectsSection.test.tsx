import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'ko', resolvedLanguage: 'ko' },
  }),
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const passthrough = (tag: string) =>
    React.forwardRef(
      (
        { children, ...rest }: { children?: React.ReactNode } & Record<string, unknown>,
        ref: React.Ref<HTMLElement>
      ) => {
        const safeProps: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(rest)) {
          if (
            [
              'initial',
              'animate',
              'exit',
              'variants',
              'transition',
              'custom',
              'whileHover',
              'whileTap',
              'whileInView',
              'layout',
              'layoutId',
              'drag',
            ].includes(key)
          ) {
            continue;
          }
          safeProps[key] = value;
        }
        return React.createElement(tag, { ref, ...safeProps }, children);
      }
    );
  return {
    motion: new Proxy(
      {},
      {
        get: (_target, prop: string) => passthrough(prop),
      }
    ),
    AnimatePresence: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useInView: () => true,
  };
});

vi.mock('../../components/PortfolioCard', () => ({
  __esModule: true,
  default: ({
    project,
    onClick,
  }: {
    project: { id: string; title?: string };
    onClick?: () => void;
  }) =>
    React.createElement(
      'button',
      {
        'data-testid': 'portfolio-card',
        'data-id': project.id,
        onClick,
      },
      project.id
    ),
}));

vi.mock('../../components/PreparingCard', () => ({
  __esModule: true,
  default: ({ project }: { project: { id: string } }) =>
    React.createElement(
      'div',
      { 'data-testid': 'preparing-card', 'data-id': project.id },
      project.id
    ),
}));

const aiDevKitModalMock = vi.fn();
vi.mock('../../components/AiDevKitModal', () => ({
  __esModule: true,
  default: (props: { item: unknown; onClose: () => void }) => {
    aiDevKitModalMock(props);
    return React.createElement(
      'div',
      {
        'data-testid': 'ai-dev-kit-modal',
        'data-has-item': props.item ? 'true' : 'false',
      },
      props.item ? (props.item as { id: string }).id : 'no-item'
    );
  },
}));

vi.mock('../../components/ProjectsSidebar', () => ({
  __esModule: true,
  default: ({
    projects,
    devKitItems,
    hasPlayedProjectEntrance,
    showAiDevKit,
    onSelectDevKit,
  }: {
    projects: { id: string }[];
    devKitItems: { id: string }[];
    hasPlayedProjectEntrance: boolean;
    showAiDevKit: boolean;
    onSelectDevKit: (id: string) => void;
  }) =>
    React.createElement(
      'div',
      {
        'data-testid': 'projects-sidebar',
        'data-projects-count': String(projects.length),
        'data-devkit-count': String(devKitItems.length),
        'data-has-played': String(hasPlayedProjectEntrance),
        'data-show-aidevkit': String(showAiDevKit),
      },
      devKitItems.map((item) =>
        React.createElement(
          'button',
          {
            key: item.id,
            'data-testid': `select-devkit-${item.id}`,
            onClick: () => onSelectDevKit(item.id),
          },
          item.id
        )
      )
    ),
}));

vi.mock('../../components/StickySectionSidebar', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) =>
    React.createElement(
      'div',
      { 'data-testid': 'sticky-section-sidebar' },
      title
    ),
}));

const useProjectListsMock = vi.fn();
vi.mock('../../hooks/useProjectLists', () => ({
  useProjectLists: () => useProjectListsMock(),
}));

const useProjectGridEntranceMock = vi.fn();
vi.mock('../../hooks/useProjectGridEntrance', () => ({
  useProjectGridEntrance: (args: unknown) => useProjectGridEntranceMock(args),
  PROJECT_CARD_EASE: [0, 0, 0, 0],
}));

const useProjectDevKitItemsMock = vi.fn();
vi.mock('../../hooks/useProjectDevKitItems', () => ({
  useProjectDevKitItems: () => useProjectDevKitItemsMock(),
}));

import ProjectsSection from './ProjectsSection';

const baseProject = (id: string) => ({
  id,
  title: `title-${id}`,
  subtitle: `sub-${id}`,
  projectType: 'app',
  screenshots: [],
  techStack: [],
});

const basePreparing = (id: string) => ({
  id,
  title: `prep-${id}`,
  subtitle: `prep-sub-${id}`,
});

const baseDevKitItem = (id: string) => ({
  id,
  title: `kit-${id}`,
  description: `desc-${id}`,
  closeLabel: 'close',
  sections: [],
});

const renderSection = () =>
  render(
    <MemoryRouter>
      <ProjectsSection />
    </MemoryRouter>
  );

beforeEach(() => {
  navigateMock.mockReset();
  aiDevKitModalMock.mockReset();
  useProjectListsMock.mockReset();
  useProjectGridEntranceMock.mockReset();
  useProjectDevKitItemsMock.mockReset();

  useProjectGridEntranceMock.mockReturnValue({
    projectsGridRef: { current: null },
    projectCardRefs: { current: {} },
    projectCardOffsetsReady: true,
    hasPlayedProjectEntrance: true,
    showAiDevKit: true,
    cardVariants: {},
  });

  useProjectDevKitItemsMock.mockReturnValue([
    baseDevKitItem('skills'),
    baseDevKitItem('mcp'),
    baseDevKitItem('harness'),
  ]);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('ProjectsSection', () => {
  it('renders 4 skeleton placeholders while loading', () => {
    useProjectListsMock.mockReturnValue({
      projects: [],
      preparingProjects: [],
      isLoading: true,
    });

    const { container } = renderSection();

    const skeletons = container.querySelectorAll('.aspect-\\[9\\/16\\]');
    expect(skeletons.length).toBe(4);
    expect(screen.queryByTestId('portfolio-card')).toBeNull();
  });

  it('renders one PortfolioCard per project after loading', () => {
    useProjectListsMock.mockReturnValue({
      projects: [baseProject('a'), baseProject('b'), baseProject('c')],
      preparingProjects: [],
      isLoading: false,
    });

    renderSection();

    const cards = screen.getAllByTestId('portfolio-card');
    expect(cards).toHaveLength(3);
    expect(cards.map((c) => c.getAttribute('data-id'))).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('renders one PreparingCard per preparingProject in the second section', () => {
    useProjectListsMock.mockReturnValue({
      projects: [baseProject('a')],
      preparingProjects: [basePreparing('p1'), basePreparing('p2')],
      isLoading: false,
    });

    renderSection();

    const preparing = screen.getAllByTestId('preparing-card');
    expect(preparing).toHaveLength(2);
    expect(preparing.map((c) => c.getAttribute('data-id'))).toEqual([
      'p1',
      'p2',
    ]);
  });

  it('navigates to /project/:id 300ms after a card is clicked', () => {
    vi.useFakeTimers();
    useProjectListsMock.mockReturnValue({
      projects: [baseProject('alpha'), baseProject('beta')],
      preparingProjects: [],
      isLoading: false,
    });

    renderSection();

    const cards = screen.getAllByTestId('portfolio-card');
    act(() => {
      fireEvent.click(cards[1]);
    });

    expect(navigateMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(navigateMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(navigateMock).toHaveBeenCalledWith('/project/beta');
  });

  it('passes projects, devKitItems, hasPlayedProjectEntrance, and showAiDevKit to ProjectsSidebar', () => {
    useProjectListsMock.mockReturnValue({
      projects: [baseProject('a'), baseProject('b')],
      preparingProjects: [],
      isLoading: false,
    });
    useProjectGridEntranceMock.mockReturnValue({
      projectsGridRef: { current: null },
      projectCardRefs: { current: {} },
      projectCardOffsetsReady: true,
      hasPlayedProjectEntrance: false,
      showAiDevKit: false,
      cardVariants: {},
    });

    renderSection();

    const sidebar = screen.getByTestId('projects-sidebar');
    expect(sidebar.getAttribute('data-projects-count')).toBe('2');
    expect(sidebar.getAttribute('data-devkit-count')).toBe('3');
    expect(sidebar.getAttribute('data-has-played')).toBe('false');
    expect(sidebar.getAttribute('data-show-aidevkit')).toBe('false');
  });

  it('AiDevKitModal receives null item until a dev-kit card is selected, then the matching item', () => {
    useProjectListsMock.mockReturnValue({
      projects: [baseProject('a')],
      preparingProjects: [],
      isLoading: false,
    });

    renderSection();

    const modal = screen.getByTestId('ai-dev-kit-modal');
    expect(modal.getAttribute('data-has-item')).toBe('false');

    act(() => {
      fireEvent.click(screen.getByTestId('select-devkit-mcp'));
    });

    const updatedModal = screen.getByTestId('ai-dev-kit-modal');
    expect(updatedModal.getAttribute('data-has-item')).toBe('true');
    expect(updatedModal.textContent).toBe('mcp');
  });
});
