import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'ko', resolvedLanguage: 'ko' },
  }),
}));

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>(
    'framer-motion'
  );
  const React = await import('react');
  return {
    ...actual,
    useScroll: () => ({
      scrollYProgress: { get: () => 0, on: vi.fn(), set: vi.fn() },
    }),
    useTransform: () => ({ get: () => 0 }),
    motion: new Proxy(
      {},
      {
        get:
          (_target, tag: string) =>
          ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
            React.createElement(tag === 'div' || !tag ? 'div' : tag, props, children),
      }
    ),
  };
});

vi.mock('./AnswerChecker', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="answer-checker-stub">answer-checker-stub</div>
  ),
}));

import { IntroLine } from './IntroLine';

describe('IntroLine', () => {
  it('renders the four intro line translation keys', () => {
    render(<IntroLine />);

    expect(screen.getByText('introLine1')).toBeInTheDocument();
    expect(screen.getByText('introLine1-1')).toBeInTheDocument();
    expect(screen.getByText('introLine2')).toBeInTheDocument();
    expect(screen.getByText('introLine2-1')).toBeInTheDocument();
  });

  it('renders all 7 intro images with the documented src paths', () => {
    const { container } = render(<IntroLine />);

    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(7);

    const srcs = Array.from(images).map((img) => img.getAttribute('src'));
    expect(srcs).toEqual(
      expect.arrayContaining([
        '/images/aboutMe/introLine1/1.png',
        '/images/aboutMe/introLine1/2.png',
        '/images/aboutMe/introLine1/3.png',
        '/images/aboutMe/introLine1/4.png',
        '/images/aboutMe/introLine2/1.png',
        '/images/aboutMe/introLine2/2.png',
        '/images/aboutMe/introLine2/3.png',
      ])
    );
  });

  it('wraps content in a section with the h-[2000vh] sticky scroll container', () => {
    const { container } = render(<IntroLine />);

    const section = container.querySelector('section');
    expect(section).not.toBeNull();
    expect(section?.className).toContain('h-[2000vh]');

    const sticky = section?.querySelector('.sticky');
    expect(sticky).not.toBeNull();
    expect(sticky?.className).toContain('top-0');
    expect(sticky?.className).toContain('h-screen');
  });

  it('renders AnswerChecker only inside the xl:inline branch', () => {
    const { container } = render(<IntroLine />);

    const stub = screen.getByTestId('answer-checker-stub');
    expect(stub).toBeInTheDocument();

    const wrapper = stub.parentElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper?.className).toContain('xl:inline');
    expect(wrapper?.className).toContain('hidden');

    expect(container.querySelectorAll('[data-testid="answer-checker-stub"]')).toHaveLength(1);
  });

  it('forwards the section ref to the targetRef element so useScroll can attach', () => {
    const useScrollSpy = vi.fn(() => ({
      scrollYProgress: { get: () => 0, on: vi.fn(), set: vi.fn() },
    }));

    return import('framer-motion').then((fm) => {
      const original = fm.useScroll;
      // @ts-expect-error overriding for spy assertion
      fm.useScroll = useScrollSpy;

      const { container } = render(<IntroLine />);
      const section = container.querySelector('section');
      expect(section).not.toBeNull();

      expect(useScrollSpy).toHaveBeenCalled();
      const callArg = (useScrollSpy.mock.calls as unknown[][])[0]?.[0] as
        | { target?: { current: HTMLElement | null }; offset?: unknown[] }
        | undefined;
      expect(callArg).toBeDefined();
      expect(callArg?.target?.current).toBe(section);
      expect(callArg?.offset).toEqual(['start start', 'end start']);

      fm.useScroll = original;
    });
  });
});
