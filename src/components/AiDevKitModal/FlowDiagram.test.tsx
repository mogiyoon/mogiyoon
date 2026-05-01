import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: unknown }) => {
      if (options && typeof options.defaultValue === 'string') {
        return options.defaultValue;
      }
      return key;
    },
    i18n: { language: 'ko', resolvedLanguage: 'ko' },
  }),
}));

import FlowDiagram from './FlowDiagram';
import type { AiDevKitFlowLoop } from './types';

// Helpers ------------------------------------------------------------------

const queryDesktopRoot = (container: HTMLElement) =>
  container.querySelector('.hidden.md\\:block');

const queryMobileRoot = (container: HTMLElement) =>
  container.querySelector('.md\\:hidden');

// FlowStepCard root has min-h-[132px]; LoopStepCard does not (px-3 py-2.5).
// We use min-h-[132px] as the unique signature for a main FlowStepCard.
const queryAllFlowStepCards = (root: Element | null) =>
  root ? Array.from(root.querySelectorAll('.min-h-\\[132px\\]')) : [];

// LoopStepCard signature: rounded-card border-2 border-accent-100 bg-accent-50
// and px-3 py-2.5 (vs FlowStepCard's px-4 py-3). Use px-3 fragment.
const queryAllLoopStepCards = (root: Element | null) =>
  root ? Array.from(root.querySelectorAll('.px-3.py-2\\.5')) : [];

const isHighlighted = (card: Element) =>
  card.classList.contains('border-accent-100') &&
  card.classList.contains('bg-accent-50');

const stepLabelTextOf = (card: Element) => {
  const span = card.querySelector('span');
  return span?.textContent ?? '';
};

// Tests --------------------------------------------------------------------

describe('FlowDiagram', () => {
  it('renders nothing when steps is empty', () => {
    const { container } = render(
      <FlowDiagram idBase="empty" steps={[]} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders one FlowStepCard per step in linear mode (no loops) on desktop', () => {
    const steps = ['Plan', 'Build', 'Ship'];
    const { container } = render(
      <FlowDiagram idBase="linear" steps={steps} />
    );

    const desktop = queryDesktopRoot(container);
    const cards = queryAllFlowStepCards(desktop);

    expect(cards).toHaveLength(steps.length);
  });

  it('renders Step N+1 label using 1-based index from item.index on desktop cards', () => {
    const steps = ['A', 'B', 'C'];
    const { container } = render(
      <FlowDiagram idBase="labels" steps={steps} />
    );

    const desktop = queryDesktopRoot(container);
    const cards = queryAllFlowStepCards(desktop);
    const labels = cards.map(stepLabelTextOf);

    expect(labels).toEqual(['Step 1', 'Step 2', 'Step 3']);
  });

  it('highlights cards whose index appears in a non-circular loop range', () => {
    // Forward loop (fromStep <= toStep) does NOT trigger circular cluster.
    // It only contributes to loopStepIndexes -> highlight.
    const steps = ['One', 'Two', 'Three', 'Four'];
    const loops: AiDevKitFlowLoop[] = [{ fromStep: 2, toStep: 3 }];
    const { container } = render(
      <FlowDiagram idBase="hl" steps={steps} loops={loops} />
    );

    const desktop = queryDesktopRoot(container);
    const cards = queryAllFlowStepCards(desktop);

    // Build a map of step label -> highlighted boolean.
    const status = Object.fromEntries(
      cards.map((card) => [stepLabelTextOf(card), isHighlighted(card)])
    );

    expect(status['Step 1']).toBe(false);
    expect(status['Step 2']).toBe(true);
    expect(status['Step 3']).toBe(true);
    expect(status['Step 4']).toBe(false);
  });

  it('splits steps into preLoop / loop cluster / postLoop when a backward loop is supplied', () => {
    // 5 steps: 1, 2, 3, 4, 5
    // Backward loop 4 -> 2 means loop cluster covers indices 1..3 (steps 2,3,4).
    // preLoop = [1], postLoop = [5].
    const steps = ['One', 'Two', 'Three', 'Four', 'Five'];
    const loops: AiDevKitFlowLoop[] = [{ fromStep: 4, toStep: 2 }];
    const { container } = render(
      <FlowDiagram idBase="cluster" steps={steps} loops={loops} />
    );

    const desktop = queryDesktopRoot(container);
    const mainCards = queryAllFlowStepCards(desktop);
    const loopCards = queryAllLoopStepCards(desktop);

    // Main-line (FlowStepCard) cards on desktop = preLoop + postLoop = 2.
    expect(mainCards).toHaveLength(2);
    // Loop cluster (LoopStepCard) cards = 3 (steps 2,3,4).
    expect(loopCards).toHaveLength(3);

    const mainLabels = mainCards.map(stepLabelTextOf).sort();
    expect(mainLabels).toEqual(['Step 1', 'Step 5']);

    const loopLabels = loopCards.map(stepLabelTextOf).sort();
    expect(loopLabels).toEqual(['Step 2', 'Step 3', 'Step 4']);
  });

  it('ignores loop entries whose fromStep/toStep fall outside the steps array', () => {
    const steps = ['One', 'Two', 'Three'];
    // All of these are out-of-range and should be filtered out.
    const loops: AiDevKitFlowLoop[] = [
      { fromStep: 0, toStep: 2 },
      { fromStep: 1, toStep: 9 },
      { fromStep: 8, toStep: 1 },
    ];
    const { container } = render(
      <FlowDiagram idBase="invalid" steps={steps} loops={loops} />
    );

    const desktop = queryDesktopRoot(container);
    const mainCards = queryAllFlowStepCards(desktop);
    const loopCards = queryAllLoopStepCards(desktop);

    // No backward valid loop -> linear mode, all 3 main cards, no loop cluster.
    expect(mainCards).toHaveLength(3);
    expect(loopCards).toHaveLength(0);

    // Nothing should be highlighted because no valid loop contributed indices.
    expect(mainCards.every((card) => !isHighlighted(card))).toBe(true);
  });

  it('renders both desktop (md:block) and mobile (md:hidden) variants in the same output', () => {
    const steps = ['Plan', 'Build'];
    const { container } = render(
      <FlowDiagram idBase="both" steps={steps} />
    );

    const desktop = queryDesktopRoot(container);
    const mobile = queryMobileRoot(container);

    expect(desktop).not.toBeNull();
    expect(mobile).not.toBeNull();

    // Desktop renders one FlowStepCard per step.
    expect(queryAllFlowStepCards(desktop)).toHaveLength(steps.length);
    // Mobile (linear) also renders one FlowStepCard per step.
    expect(queryAllFlowStepCards(mobile)).toHaveLength(steps.length);
  });

  it('renders LoopLabels only for loops that have a label', () => {
    const stepsWithLabel = ['One', 'Two', 'Three'];
    const labelledLoops: AiDevKitFlowLoop[] = [
      { fromStep: 1, toStep: 2, label: 'retry on failure' },
    ];
    const { container: withLabel } = render(
      <FlowDiagram
        idBase="with-label"
        steps={stepsWithLabel}
        loops={labelledLoops}
      />
    );

    expect(withLabel.textContent).toContain('retry on failure');

    const stepsNoLabel = ['One', 'Two', 'Three'];
    const unlabelledLoops: AiDevKitFlowLoop[] = [
      { fromStep: 1, toStep: 2 },
    ];
    const { container: noLabel } = render(
      <FlowDiagram
        idBase="no-label"
        steps={stepsNoLabel}
        loops={unlabelledLoops}
      />
    );

    // The LoopLabels block renders a <p> with leading-relaxed; without
    // labelled loops the component returns null, so no such <p> exists.
    const labelParagraphs = noLabel.querySelectorAll(
      'p.leading-relaxed.text-content-secondary'
    );
    expect(labelParagraphs).toHaveLength(0);
  });
});
