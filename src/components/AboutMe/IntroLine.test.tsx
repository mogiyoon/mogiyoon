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

import { IntroLine } from './IntroLine';

describe('IntroLine', () => {
  it('renders the four intro line translation keys for both panels', () => {
    render(<IntroLine />);

    expect(screen.getAllByText('introLine1')).not.toHaveLength(0);
    expect(screen.getAllByText('introLine1-1')).not.toHaveLength(0);
    expect(screen.getAllByText('introLine2')).not.toHaveLength(0);
    expect(screen.getAllByText('introLine2-1')).not.toHaveLength(0);
  });

  it('renders the eyebrow and card titles for start and end panels', () => {
    render(<IntroLine />);

    expect(screen.getByText('introStart.eyebrow')).toBeInTheDocument();
    expect(screen.getByText('introStart.card01Title')).toBeInTheDocument();
    expect(screen.getByText('introStart.card02Title')).toBeInTheDocument();
    expect(screen.getByText('introEnd.eyebrow')).toBeInTheDocument();
    expect(screen.getByText('introEnd.card01Title')).toBeInTheDocument();
    expect(screen.getByText('introEnd.card02Title')).toBeInTheDocument();
  });

  it('renders the four intro images with the documented src paths', () => {
    const { container } = render(<IntroLine />);

    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(4);

    const srcs = Array.from(images).map((img) => img.getAttribute('src'));
    expect(srcs).toEqual(
      expect.arrayContaining([
        '/images/aboutMe/introLine1/1.png',
        '/images/aboutMe/introLine1/2.png',
        '/images/aboutMe/introLine2/1.png',
        '/images/aboutMe/introLine2/2.png',
      ])
    );
  });

  it('splits the two panels into separate sticky scroll sections', () => {
    const { container } = render(<IntroLine />);

    const sections = container.querySelectorAll('section');
    expect(sections).toHaveLength(2);

    sections.forEach((section) => {
      expect(section.className).toContain('h-[200vh]');

      const sticky = section.querySelector('.sticky');
      expect(sticky).not.toBeNull();
      expect(sticky?.className).toContain('top-0');
      expect(sticky?.className).toContain('h-screen');
      expect(sticky?.className).toContain('overflow-hidden');
    });
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
