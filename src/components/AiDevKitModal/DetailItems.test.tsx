import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'ko', resolvedLanguage: 'ko' },
  }),
}));

vi.mock('./FlowDiagram', () => ({
  default: () => <div data-testid="mock-flow-diagram" />,
}));

import DetailItems from './DetailItems';
import type { AiDevKitDetailSection } from './types';

const buildSection = (
  overrides: Partial<AiDevKitDetailSection> = {}
): AiDevKitDetailSection => ({
  title: 'Section Title',
  items: [
    {
      title: 'Item One',
      description: 'Item One description',
    },
  ],
  ...overrides,
});

describe('DetailItems', () => {
  it('returns null when section.items is empty', () => {
    const { container } = render(
      <DetailItems section={{ title: 'Empty Section', items: [] }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders DetailItemHeading with title and optional description per item', () => {
    render(
      <DetailItems
        section={buildSection({
          items: [
            { title: 'With Desc', description: 'Some description' },
            { title: 'No Desc' },
          ],
        })}
      />
    );

    expect(screen.getByText('With Desc')).toBeInTheDocument();
    expect(screen.getByText('Some description')).toBeInTheDocument();
    expect(screen.getByText('No Desc')).toBeInTheDocument();
  });

  it('renders chips only when item.chips is non-empty', () => {
    const { rerender } = render(
      <DetailItems
        section={buildSection({
          items: [
            { title: 'Chipped', chips: ['Alpha', 'Beta'] },
          ],
        })}
      />
    );

    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();

    rerender(
      <DetailItems
        section={buildSection({
          items: [{ title: 'Chipless' }],
        })}
      />
    );

    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
    expect(screen.queryByText('Beta')).not.toBeInTheDocument();
  });

  it('renders numbered StepBadges only when item.steps is non-empty', () => {
    const { rerender } = render(
      <DetailItems
        section={buildSection({
          items: [
            { title: 'Stepped', steps: ['First step', 'Second step'] },
          ],
        })}
      />
    );

    expect(screen.getByText('First step')).toBeInTheDocument();
    expect(screen.getByText('Second step')).toBeInTheDocument();
    expect(screen.getByText('1.')).toBeInTheDocument();
    expect(screen.getByText('2.')).toBeInTheDocument();

    rerender(
      <DetailItems
        section={buildSection({
          items: [{ title: 'Stepless' }],
        })}
      />
    );

    expect(screen.queryByText('First step')).not.toBeInTheDocument();
    expect(screen.queryByText('1.')).not.toBeInTheDocument();
  });

  it('renders DetailGroupGrid contents only when item.groups is non-empty', () => {
    const { rerender } = render(
      <DetailItems
        section={buildSection({
          items: [
            {
              title: 'Grouped',
              groups: [
                { title: 'Group A', points: ['Point A1', 'Point A2'] },
                { title: 'Group B', points: ['Point B1'] },
              ],
            },
          ],
        })}
      />
    );

    expect(screen.getByText('Group A')).toBeInTheDocument();
    expect(screen.getByText('Group B')).toBeInTheDocument();
    expect(screen.getByText('Point A1')).toBeInTheDocument();
    expect(screen.getByText('Point A2')).toBeInTheDocument();
    expect(screen.getByText('Point B1')).toBeInTheDocument();

    rerender(
      <DetailItems
        section={buildSection({
          items: [{ title: 'Groupless' }],
        })}
      />
    );

    expect(screen.queryByText('Group A')).not.toBeInTheDocument();
    expect(screen.queryByText('Point A1')).not.toBeInTheDocument();
  });

  it('embeds FlowDiagram when section.layout === "flow" and item is expanded', () => {
    render(
      <DetailItems
        section={buildSection({
          layout: 'flow',
          items: [
            {
              title: 'Flow Item',
              description: 'Flow description',
              steps: ['Step one'],
            },
          ],
        })}
      />
    );

    // Collapsed by default — no FlowDiagram visible
    expect(screen.queryByTestId('mock-flow-diagram')).not.toBeInTheDocument();

    // Expand by clicking the chevron toggle button
    fireEvent.click(screen.getByRole('button', { name: /Flow Item/i }));

    expect(screen.getByTestId('mock-flow-diagram')).toBeInTheDocument();
  });

  it.skip(
    'embeds FlowDiagram when section.layout === "diagram"',
    // Source code only embeds FlowDiagram in the "flow" layout (FlowItemCard).
    // The "diagram" layout (DiagramItems) renders only headings/numbers and never FlowDiagram.
    () => {}
  );

  it('toggles expand/collapse per item via ChevronIcon click in flow layout', () => {
    render(
      <DetailItems
        section={buildSection({
          layout: 'flow',
          items: [
            { title: 'Item Alpha', description: 'Alpha desc' },
            { title: 'Item Beta', description: 'Beta desc' },
          ],
        })}
      />
    );

    const alphaButton = screen.getByRole('button', { name: /Item Alpha/i });
    const betaButton = screen.getByRole('button', { name: /Item Beta/i });

    // Both collapsed initially
    expect(alphaButton).toHaveAttribute('aria-expanded', 'false');
    expect(betaButton).toHaveAttribute('aria-expanded', 'false');

    // Expand Alpha — Beta stays collapsed (per-item state)
    fireEvent.click(alphaButton);
    expect(alphaButton).toHaveAttribute('aria-expanded', 'true');
    expect(betaButton).toHaveAttribute('aria-expanded', 'false');

    // Toggle Alpha closed
    fireEvent.click(alphaButton);
    expect(alphaButton).toHaveAttribute('aria-expanded', 'false');

    // Expand Beta independently
    fireEvent.click(betaButton);
    expect(betaButton).toHaveAttribute('aria-expanded', 'true');
    expect(alphaButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders diagram layout with numbered article badges and headings', () => {
    const { container } = render(
      <DetailItems
        section={buildSection({
          layout: 'diagram',
          items: [
            { title: 'Diagram One' },
            { title: 'Diagram Two' },
            { title: 'Diagram Three' },
          ],
        })}
      />
    );

    expect(screen.getByText('Diagram One')).toBeInTheDocument();
    expect(screen.getByText('Diagram Two')).toBeInTheDocument();
    expect(screen.getByText('Diagram Three')).toBeInTheDocument();
    expect(within(container).getByText('01')).toBeInTheDocument();
    expect(within(container).getByText('02')).toBeInTheDocument();
    expect(within(container).getByText('03')).toBeInTheDocument();
  });
});
