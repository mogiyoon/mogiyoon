import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'ko', resolvedLanguage: 'ko' },
  }),
}));

import SkillGroups from './SkillGroups';
import type {
  AiDevKitDetailSection,
  AiDevKitGroupedDetailSection,
  AiDevKitSkillItem,
} from './types';

const buildFlowSection = (
  overrides: Partial<AiDevKitGroupedDetailSection> = {}
): AiDevKitGroupedDetailSection => ({
  title: 'Flow Section',
  description: 'flow desc',
  layout: 'flow',
  steps: ['Plan', 'Build', 'Verify'],
  ...overrides,
});

const buildCardsSection = (
  title: string,
  overrides: Partial<AiDevKitGroupedDetailSection> = {}
): AiDevKitGroupedDetailSection => ({
  title,
  description: `${title} desc`,
  layout: 'cards',
  items: [
    { title: `${title} Item A`, description: `${title} item A desc` },
    { title: `${title} Item B`, description: `${title} item B desc` },
  ],
  ...overrides,
});

const buildSkillItem = (
  overrides: Partial<AiDevKitSkillItem> = {}
): AiDevKitSkillItem => ({
  title: 'Skill Alpha',
  description: 'skill alpha description',
  chips: ['chip-a', 'chip-b'],
  sections: [
    buildFlowSection(),
    buildCardsSection('Section Two'),
    buildCardsSection('Section Three'),
    buildCardsSection('Section Four'),
    buildCardsSection('Section Five'),
  ],
  ...overrides,
});

const buildSection = (
  overrides: Partial<AiDevKitDetailSection> = {}
): AiDevKitDetailSection => ({
  title: 'Top Level',
  layout: 'skill-groups',
  skillItems: [buildSkillItem()],
  ...overrides,
});

describe('SkillGroups', () => {
  it('renders nothing when layout is not skill-groups', () => {
    const { container } = render(
      <SkillGroups section={buildSection({ layout: 'cards' })} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when skillItems is empty', () => {
    const { container } = render(
      <SkillGroups section={buildSection({ skillItems: [] })} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders skillItems grouped by category when section.layout is skill-groups', () => {
    const section = buildSection({
      skillItems: [
        buildSkillItem({ title: 'Skill One' }),
        buildSkillItem({ title: 'Skill Two' }),
      ],
    });
    render(<SkillGroups section={section} />);

    expect(
      screen.getByRole('heading', { level: 5, name: 'Skill One' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 5, name: 'Skill Two' })
    ).toBeInTheDocument();

    const toggles = screen.getAllByRole('button');
    expect(toggles).toHaveLength(2);
    toggles.forEach((toggle) => {
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('expand toggle reveals detail content (sections and module diagram)', () => {
    render(<SkillGroups section={buildSection()} />);

    // Before expansion, section card titles should not be visible
    expect(screen.queryByRole('heading', { name: 'Flow Section' })).toBeNull();

    const toggle = screen.getByRole('button', { name: /Skill Alpha/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    // After expansion, all 5 nested section titles should appear (h6)
    expect(
      screen.getByRole('heading', { level: 6, name: 'Flow Section' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 6, name: 'Section Two' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 6, name: 'Section Five' })
    ).toBeInTheDocument();
  });

  it('collapses again when toggle is clicked twice', () => {
    render(<SkillGroups section={buildSection()} />);

    const toggle = screen.getByRole('button', { name: /Skill Alpha/ });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByRole('heading', { level: 6, name: 'Flow Section' })
    ).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByRole('heading', { level: 6, name: 'Flow Section' })
    ).toBeNull();
  });

  it('renders SkillFlowSteps with "Step N" labels when steps array is non-empty', () => {
    render(<SkillGroups section={buildSection()} />);

    fireEvent.click(screen.getByRole('button', { name: /Skill Alpha/ }));

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('Build')).toBeInTheDocument();
    expect(screen.getByText('Verify')).toBeInTheDocument();
  });

  it('renders nothing for SkillFlowSteps when steps array is empty', () => {
    const skillItem = buildSkillItem({
      sections: [
        buildFlowSection({ steps: [] }),
        buildCardsSection('Cards Only'),
      ],
    });
    render(<SkillGroups section={buildSection({ skillItems: [skillItem] })} />);

    fireEvent.click(screen.getByRole('button', { name: /Skill Alpha/ }));

    // No "Step N" labels should appear
    expect(screen.queryByText(/^Step 1$/)).toBeNull();
    expect(screen.queryByText(/^Step 2$/)).toBeNull();
    // The flow section header still renders, but its body is empty (returns null)
    expect(
      screen.getByRole('heading', { level: 6, name: 'Flow Section' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 6, name: 'Cards Only' })
    ).toBeInTheDocument();
  });

  it('renders 5 distinct SectionIcon SVG variants based on (index % 5)', () => {
    const { container } = render(<SkillGroups section={buildSection()} />);

    fireEvent.click(screen.getByRole('button', { name: /Skill Alpha/ }));

    const sectionElements = container.querySelectorAll('section');
    expect(sectionElements.length).toBeGreaterThanOrEqual(5);

    // Each section header should contain exactly one SVG icon (the SectionIcon)
    // We grab the first svg in each section's first inner span
    const iconSignatures: string[] = [];
    sectionElements.forEach((sectionEl) => {
      const iconSpan = sectionEl.querySelector(
        'span.inline-flex.h-10.w-10'
      );
      expect(iconSpan).not.toBeNull();
      const svg = iconSpan?.querySelector('svg');
      expect(svg).not.toBeNull();
      // Use the inner HTML (path/circle structure) as a signature
      iconSignatures.push(svg?.innerHTML ?? '');
    });

    // First 5 sections should yield 5 distinct SVG markup variants
    const firstFive = iconSignatures.slice(0, 5);
    const unique = new Set(firstFive);
    expect(unique.size).toBe(5);
  });

  it('renders the index number badge for each nested section (01, 02, ...)', () => {
    render(<SkillGroups section={buildSection()} />);
    fireEvent.click(screen.getByRole('button', { name: /Skill Alpha/ }));

    // The header card uses two-digit padded indexes
    expect(screen.getAllByText('01').length).toBeGreaterThan(0);
    expect(screen.getAllByText('02').length).toBeGreaterThan(0);
    expect(screen.getAllByText('05').length).toBeGreaterThan(0);
  });

  it('renders SkillDetailGrid items inside cards-layout sections after expansion', () => {
    render(<SkillGroups section={buildSection()} />);
    fireEvent.click(screen.getByRole('button', { name: /Skill Alpha/ }));

    // Item titles from buildCardsSection
    expect(
      screen.getByRole('heading', { level: 6, name: 'Section Two Item A' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 6, name: 'Section Two Item B' })
    ).toBeInTheDocument();
    // Their descriptions
    expect(screen.getByText('Section Two item A desc')).toBeInTheDocument();
  });

  it('uses aria-controls and id wiring between toggle button and expanded content', () => {
    render(<SkillGroups section={buildSection()} />);

    const toggle = screen.getByRole('button', { name: /Skill Alpha/ });
    const controlledId = toggle.getAttribute('aria-controls');
    expect(controlledId).toBe('skill-content-Skill-Alpha');

    fireEvent.click(toggle);
    const panel = document.getElementById(controlledId ?? '');
    expect(panel).not.toBeNull();
    // The expanded panel should contain the first nested section heading
    expect(
      within(panel as HTMLElement).getByRole('heading', {
        level: 6,
        name: 'Flow Section',
      })
    ).toBeInTheDocument();
  });
});
