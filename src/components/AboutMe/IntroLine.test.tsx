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

    // 모바일/데스크톱 레이아웃이 함께 렌더되어 동일 텍스트가 여러 번 나타날 수 있음
    expect(screen.getAllByText('introStart.eyebrow').length).toBeGreaterThan(0);
    expect(screen.getAllByText('introStart.card01Title').length).toBeGreaterThan(0);
    expect(screen.getAllByText('introStart.card02Title').length).toBeGreaterThan(0);
    expect(screen.getAllByText('introEnd.eyebrow').length).toBeGreaterThan(0);
    expect(screen.getAllByText('introEnd.card01Title').length).toBeGreaterThan(0);
    expect(screen.getAllByText('introEnd.card02Title').length).toBeGreaterThan(0);
  });

  it('renders the documented intro image src paths', () => {
    const { container } = render(<IntroLine />);

    // 모바일/데스크톱 레이아웃에 같은 이미지가 중복 렌더되므로 고유 경로로 검증
    const srcs = Array.from(container.querySelectorAll('img')).map((img) =>
      img.getAttribute('src')
    );
    expect(new Set(srcs)).toEqual(
      new Set([
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
