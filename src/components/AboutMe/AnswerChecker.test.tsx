import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'answerChecker.correctAnswer') return 'abcd';
      return key;
    },
    i18n: { language: 'ko', resolvedLanguage: 'ko' },
  }),
}));

import AnswerChecker from './AnswerChecker';

const setEditableText = (container: HTMLElement, text: string) => {
  const editable = container.querySelector(
    '#answer-input'
  ) as HTMLDivElement | null;
  if (!editable) {
    throw new Error('contentEditable div #answer-input not found');
  }
  editable.innerText = text;
  fireEvent.input(editable, { target: { innerText: text } });
  return editable;
};

const getResultSpans = (container: HTMLElement): HTMLSpanElement[] => {
  // result spans are rendered inside the result section as <span> children.
  // They are uniquely identifiable by the bg-green-200 / bg-red-200 classes.
  return Array.from(
    container.querySelectorAll('span.bg-green-200, span.bg-red-200')
  ) as HTMLSpanElement[];
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AnswerChecker', () => {
  it('renders the correctAnswer as part of the problem label', () => {
    render(<AnswerChecker />);

    const problem = screen.getByText(/answerChecker\.problemLabel/);
    expect(problem).toBeInTheDocument();
    expect(problem.textContent).toContain('abcd');
  });

  it('Check button fills the result list with one ResultCharacter per typed char', () => {
    const { container } = render(<AnswerChecker />);

    setEditableText(container, 'abxd');

    fireEvent.click(screen.getByRole('button', { name: /answerChecker\.checkButton/ }));

    const spans = getResultSpans(container);
    expect(spans).toHaveLength(4);
    expect(spans.map((s) => s.textContent)).toEqual(['a', 'b', 'x', 'd']);
  });

  it('marks each ResultCharacter isCorrect when char === correctAnswer[index]', () => {
    const { container } = render(<AnswerChecker />);

    setEditableText(container, 'abxd');

    fireEvent.click(screen.getByRole('button', { name: /answerChecker\.checkButton/ }));

    const spans = getResultSpans(container);
    // correctAnswer = 'abcd'; input = 'abxd' → correct, correct, wrong, correct
    expect(spans[0].className).toContain('bg-green-200');
    expect(spans[1].className).toContain('bg-green-200');
    expect(spans[2].className).toContain('bg-red-200');
    expect(spans[3].className).toContain('bg-green-200');
  });

  it('Clear button empties the result and clears the contentEditable innerText', () => {
    const { container } = render(<AnswerChecker />);

    const editable = setEditableText(container, 'abcd');
    fireEvent.click(screen.getByRole('button', { name: /answerChecker\.checkButton/ }));
    expect(getResultSpans(container)).toHaveLength(4);

    fireEvent.click(screen.getByRole('button', { name: /answerChecker\.clearButton/ }));

    expect(getResultSpans(container)).toHaveLength(0);
    expect(editable.innerText).toBe('');
  });

  it('Check is a no-op when the input is empty', () => {
    const { container } = render(<AnswerChecker />);

    fireEvent.click(screen.getByRole('button', { name: /answerChecker\.checkButton/ }));

    expect(getResultSpans(container)).toHaveLength(0);
  });

  it('Check is a no-op when the input is whitespace-only', () => {
    const { container } = render(<AnswerChecker />);

    setEditableText(container, '   ');

    fireEvent.click(screen.getByRole('button', { name: /answerChecker\.checkButton/ }));

    expect(getResultSpans(container)).toHaveLength(0);
  });

  it('mouseEnter on the Check button blurs the contentEditable when input is non-empty', () => {
    const blurSpy = vi.spyOn(HTMLElement.prototype, 'blur');
    const { container } = render(<AnswerChecker />);

    setEditableText(container, 'abcd');
    blurSpy.mockClear();

    fireEvent.mouseEnter(
      screen.getByRole('button', { name: /answerChecker\.checkButton/ })
    );

    expect(blurSpy).toHaveBeenCalled();
  });

  it('mouseEnter on a button does NOT blur the contentEditable when input is empty', () => {
    const blurSpy = vi.spyOn(HTMLElement.prototype, 'blur');
    render(<AnswerChecker />);

    blurSpy.mockClear();

    fireEvent.mouseEnter(
      screen.getByRole('button', { name: /answerChecker\.checkButton/ })
    );
    fireEvent.mouseEnter(
      screen.getByRole('button', { name: /answerChecker\.clearButton/ })
    );

    expect(blurSpy).not.toHaveBeenCalled();
  });
});
