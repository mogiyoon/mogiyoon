import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import ModalShell from './ModalShell';

afterEach(() => {
  document.body.style.overflow = '';
  vi.restoreAllMocks();
});

describe('ModalShell', () => {
  it('renders nothing when isOpen is false', () => {
    const onClose = vi.fn();
    const { container } = render(
      <ModalShell isOpen={false} onClose={onClose}>
        <div data-testid="shell-child">child</div>
      </ModalShell>
    );

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTestId('shell-child')).not.toBeInTheDocument();
  });

  it('renders children inside a panel inside a backdrop when open', () => {
    const onClose = vi.fn();
    render(
      <ModalShell isOpen={true} onClose={onClose}>
        <div data-testid="shell-child">child</div>
      </ModalShell>
    );

    const child = screen.getByTestId('shell-child');
    const panel = child.parentElement as HTMLElement;
    const backdrop = panel.parentElement as HTMLElement;

    expect(panel).not.toBeNull();
    expect(backdrop).not.toBeNull();
    expect(backdrop.className).toContain('fixed');
    expect(backdrop.className).toContain('z-50');
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <ModalShell isOpen={true} onClose={onClose}>
        <div data-testid="shell-child">child</div>
      </ModalShell>
    );

    const child = screen.getByTestId('shell-child');
    const backdrop = child.parentElement?.parentElement as HTMLElement;

    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when the panel is clicked', () => {
    const onClose = vi.fn();
    render(
      <ModalShell isOpen={true} onClose={onClose}>
        <div data-testid="shell-child">child</div>
      </ModalShell>
    );

    const panel = screen.getByTestId('shell-child').parentElement as HTMLElement;

    fireEvent.click(panel);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed while open', () => {
    const onClose = vi.fn();
    render(
      <ModalShell isOpen={true} onClose={onClose}>
        <div>child</div>
      </ModalShell>
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not respond to Escape while closed', () => {
    const onClose = vi.fn();
    render(
      <ModalShell isOpen={false} onClose={onClose}>
        <div>child</div>
      </ModalShell>
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks body scroll while open and restores it on unmount', () => {
    document.body.style.overflow = 'auto';
    const onClose = vi.fn();
    const { unmount } = render(
      <ModalShell isOpen={true} onClose={onClose}>
        <div>child</div>
      </ModalShell>
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('appends caller-provided className and backdropClassName', () => {
    const onClose = vi.fn();
    render(
      <ModalShell
        isOpen={true}
        onClose={onClose}
        className="custom-panel"
        backdropClassName="custom-backdrop"
      >
        <div data-testid="shell-child">child</div>
      </ModalShell>
    );

    const panel = screen.getByTestId('shell-child').parentElement as HTMLElement;
    const backdrop = panel.parentElement as HTMLElement;

    expect(panel.className).toContain('custom-panel');
    expect(panel.className).toContain('rounded-modal');
    expect(backdrop.className).toContain('custom-backdrop');
    expect(backdrop.className).toContain('bg-black/50');
  });
});
