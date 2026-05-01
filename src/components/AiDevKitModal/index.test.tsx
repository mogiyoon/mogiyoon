import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'ko', resolvedLanguage: 'ko' },
  }),
}));

vi.mock('./DetailSection', () => ({
  default: ({ section }: { section: { title: string } }) => (
    <div data-testid="detail-section" data-section-title={section.title}>
      {section.title}
    </div>
  ),
}));

vi.mock('./ModalHeader', () => ({
  default: ({
    item,
    onClose,
  }: {
    item: { title: string };
    onClose: () => void;
  }) => (
    <div
      data-testid="modal-header"
      data-item-title={item.title}
    >
      <button
        type="button"
        data-testid="modal-header-close"
        onClick={onClose}
      >
        close
      </button>
    </div>
  ),
}));

import AiDevKitModal from './index';
import type { AiDevKitModalData } from './types';

const buildItem = (
  overrides: Partial<AiDevKitModalData> = {}
): AiDevKitModalData => ({
  icon: <span data-testid="modal-icon" />,
  title: 'Modal Title',
  eyebrow: 'Modal Eyebrow',
  summary: 'Modal Summary',
  closeLabel: 'Close',
  sections: [
    { title: 'Section A' },
    { title: 'Section B' },
    { title: 'Section C' },
  ],
  ...overrides,
});

afterEach(() => {
  document.body.style.overflow = '';
  vi.restoreAllMocks();
});

describe('AiDevKitModal', () => {
  it('renders nothing when item is null', () => {
    const onClose = vi.fn();
    const { container } = render(
      <AiDevKitModal item={null} onClose={onClose} />
    );

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTestId('modal-header')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('detail-section')).toHaveLength(0);
  });

  it('sets body overflow to hidden while open and restores on unmount', () => {
    document.body.style.overflow = 'auto';
    const before = document.body.style.overflow;
    expect(before).toBe('auto');

    const onClose = vi.fn();
    const { unmount } = render(
      <AiDevKitModal item={buildItem()} onClose={onClose} />
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('auto');
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<AiDevKitModal item={buildItem()} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when a non-Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<AiDevKitModal item={buildItem()} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('removes the keydown listener on unmount', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <AiDevKitModal item={buildItem()} onClose={onClose} />
    );

    unmount();
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when the backdrop is clicked but not when the inner panel is clicked', () => {
    const onClose = vi.fn();
    render(<AiDevKitModal item={buildItem()} onClose={onClose} />);

    const header = screen.getByTestId('modal-header');
    const innerPanel = header.parentElement as HTMLElement;
    expect(innerPanel).not.toBeNull();
    const backdrop = innerPanel.parentElement as HTMLElement;
    expect(backdrop).not.toBeNull();

    fireEvent.click(innerPanel);
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders one DetailSection per item.sections entry', () => {
    const onClose = vi.fn();
    const item = buildItem({
      sections: [
        { title: 'One' },
        { title: 'Two' },
        { title: 'Three' },
        { title: 'Four' },
      ],
    });

    render(<AiDevKitModal item={item} onClose={onClose} />);

    const sections = screen.getAllByTestId('detail-section');
    expect(sections).toHaveLength(4);
    expect(sections.map((node) => node.getAttribute('data-section-title'))).toEqual([
      'One',
      'Two',
      'Three',
      'Four',
    ]);
  });

  it('passes the same item and onClose props to ModalHeader', () => {
    const onClose = vi.fn();
    const item = buildItem({ title: 'Specific Title' });
    render(<AiDevKitModal item={item} onClose={onClose} />);

    const header = screen.getByTestId('modal-header');
    expect(header.getAttribute('data-item-title')).toBe('Specific Title');

    fireEvent.click(screen.getByTestId('modal-header-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
