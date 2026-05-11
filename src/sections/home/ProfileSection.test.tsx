import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

// ── Hoist fetch mock + introduction.json stub: ProfileSection.tsx fires
//    the introduction.json request during render. Installing the mock ahead of
//    import keeps the shared resource deterministic across tests.
const { introStub, fetchSpy } = vi.hoisted(() => {
  const stub = {
    workExperience: [
      { id: 'companyA', projects: [{ id: 'projA', tech: ['React', 'TS'] }] },
      { id: 'companyB', projects: [] },
    ],
    education: [{ id: 'eduA' }, { id: 'eduB' }],
    awards: [{ id: 'awardA' }],
    certificates: [{ id: 'certA' }, { id: 'certB' }],
    skills: [
      { category: 'frontend', items: ['React', 'TypeScript', 'Vite'] },
      { category: 'backend', items: ['Node', 'Express'] },
    ],
  };
  const spy = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(stub),
    } as unknown as Response)
  );
  // install before any test-file import runs
  (globalThis as unknown as { fetch: typeof fetch }).fetch = spy as unknown as typeof fetch;
  return { introStub: stub, fetchSpy: spy };
});

// ── jsdom does not implement Element.scrollTo / window.scrollTo; stub them ──
if (!('scrollTo' in HTMLElement.prototype)) {
  // @ts-expect-error — augment prototype for tests
  HTMLElement.prototype.scrollTo = function scrollTo() {
    /* no-op */
  };
} else {
  vi.spyOn(HTMLElement.prototype, 'scrollTo').mockImplementation(() => undefined);
}
if (typeof window !== 'undefined') {
  (window as unknown as { scrollTo: () => void }).scrollTo = () => undefined;
}

// ── react-i18next: t(key) returns key (with defaultValue + returnObjects) ──
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (
      key: string,
      options?: { defaultValue?: unknown; returnObjects?: boolean }
    ) => {
      if (options && options.returnObjects) {
        if (Array.isArray(options.defaultValue)) return options.defaultValue;
        return [];
      }
      if (options && typeof options.defaultValue === 'string') {
        return options.defaultValue;
      }
      return key;
    },
    i18n: { language: 'ko', resolvedLanguage: 'ko' },
  }),
}));

// ── react-router-dom: capture useNavigate calls ────────────────────────────
const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

// ── framer-motion: passthrough so AnimatePresence/motion don't break tests
vi.mock('framer-motion', async () => {
  const ReactMod = await import('react');
  const FRAMER_ONLY = new Set([
    'animate',
    'initial',
    'exit',
    'variants',
    'transition',
    'whileHover',
    'whileTap',
    'layoutId',
  ]);
  const passthrough = (tag: string) =>
    ReactMod.forwardRef<HTMLElement, Record<string, unknown>>((props, ref) => {
      const { children, ...allRest } = props as Record<string, unknown> & {
        children?: React.ReactNode;
      };
      const rest: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(allRest)) {
        if (!FRAMER_ONLY.has(k)) rest[k] = v;
      }
      return ReactMod.createElement(
        tag,
        { ...rest, ref },
        children as React.ReactNode
      );
    });

  const motionProxy = new Proxy(
    {},
    { get: (_t, prop: string) => passthrough(prop) }
  );

  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) =>
      ReactMod.createElement(ReactMod.Fragment, null, children),
  };
});

// ── loadLocalizedResumeProfile mock ────────────────────────────────────────
vi.mock('../../utils/resumePreview', () => ({
  loadLocalizedResumeProfile: vi.fn(),
}));

import { loadLocalizedResumeProfile } from '../../utils/resumePreview';
import type { ResumeProfileSourceData } from '../../utils/resumePreview';
import ProfileSection from './ProfileSection';

const loadProfileMock = vi.mocked(loadLocalizedResumeProfile);

const buildProfile = (
  overrides: Partial<ResumeProfileSourceData> = {}
): ResumeProfileSourceData => ({
  name: 'Stub Name',
  targetRole: 'Stub Role',
  email: 'stub@example.com',
  phone: '010-1234-5678',
  links: {
    linkedin: 'https://linkedin.example',
    github: 'https://github.example',
    blog: 'https://blog.example',
    website: 'https://website.example',
  },
  photoPlaceholder: false,
  intro: { line: 'Stub intro line', bullets: [{ text: 'Stub bullet' }] },
  projectOrder: [],
  projectHighlights: {},
  ...overrides,
});

beforeEach(() => {
  navigateMock.mockReset();
  loadProfileMock.mockReset();
  fetchSpy.mockClear();
});

afterEach(() => {
  // do not restore globals — we want the fetch + scrollTo stubs to persist
  vi.clearAllMocks();
});

const renderSection = async (
  profile: ResumeProfileSourceData | null = buildProfile()
) => {
  if (profile === null) {
    loadProfileMock.mockReturnValue(
      new Promise<ResumeProfileSourceData>(() => undefined)
    );
  } else {
    loadProfileMock.mockResolvedValue(profile);
  }

  let utils: ReturnType<typeof render>;
  await act(async () => {
    utils = render(<ProfileSection />);
  });
  // wait for tabs to render (component mounted)
  await waitFor(() => {
    expect(screen.getAllByText('profileTabs.basics').length).toBeGreaterThan(0);
  });
  return utils!;
};

const clickDesktopTab = async (labelKey: string) => {
  // labels appear inside <span>s within <button>s; both desktop + mobile share text
  const spans = screen.getAllByText(labelKey);
  const button = spans[0].closest('button');
  expect(button).not.toBeNull();
  await act(async () => {
    fireEvent.click(button!);
  });
};

describe('ProfileSection', () => {
  it('defaults the active tab to basics on mount and shows resume profile card', async () => {
    await renderSection(buildProfile({ name: 'Default Mount Name' }));

    await waitFor(() => {
      expect(screen.getByText('Default Mount Name')).toBeInTheDocument();
    });
    expect(screen.getByText('Stub Role')).toBeInTheDocument();
  });

  it('switches tabs and swaps the rendered block (workSkills / education / awardsAndCerts)', async () => {
    await renderSection();

    await clickDesktopTab('profileTabs.workSkills');
    await waitFor(() => {
      // "React" appears both as skill chip and as project tech tag → use getAllByText
      expect(screen.getAllByText('React').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node')).toBeInTheDocument();

    await clickDesktopTab('profileTabs.education');
    await waitFor(() => {
      expect(screen.getByText('education.eduA.title')).toBeInTheDocument();
    });
    expect(screen.getByText('education.eduB.title')).toBeInTheDocument();

    await clickDesktopTab('profileTabs.awardsAndCerts');
    await waitFor(() => {
      expect(screen.getByText('awards.awardA.title')).toBeInTheDocument();
    });
    expect(screen.getByText('certificate.certA.title')).toBeInTheDocument();
    expect(screen.getByText('certificate.certB.title')).toBeInTheDocument();
  });

  it('WorkBlock starts with openWorkIdx=0 and lets user toggle the section open state', async () => {
    await renderSection();

    await clickDesktopTab('profileTabs.workSkills');

    // companyA has projects → openWorkIdx defaults to 0 → its project name is visible
    await waitFor(() => {
      expect(
        screen.getByText('work.companyA.projects.projA.name')
      ).toBeInTheDocument();
    });

    // toggle: clicking its header collapses the accordion
    const companyAHeader = screen
      .getByText('work.companyA.title')
      .closest('button');
    expect(companyAHeader).not.toBeNull();
    await act(async () => {
      fireEvent.click(companyAHeader!);
    });

    await waitFor(() => {
      expect(
        screen.queryByText('work.companyA.projects.projA.name')
      ).not.toBeInTheDocument();
    });

    // re-open
    await act(async () => {
      fireEvent.click(companyAHeader!);
    });
    await waitFor(() => {
      expect(
        screen.getByText('work.companyA.projects.projA.name')
      ).toBeInTheDocument();
    });
  });

  it('SkillsBlock renders one chip per group.items entry, grouped by category label', async () => {
    await renderSection();

    await clickDesktopTab('profileTabs.workSkills');

    // Category labels — t() falls back to defaultValue (group.category) here
    await waitFor(() => {
      expect(screen.getByText('frontend')).toBeInTheDocument();
    });
    expect(screen.getByText('backend')).toBeInTheDocument();

    // Each item should appear at least once as a chip
    introStub.skills.forEach((g) => {
      g.items.forEach((item) => {
        expect(screen.getAllByText(item).length).toBeGreaterThan(0);
      });
    });
  });

  it("renders resume profile links in the order ['website','blog','github','linkedin'] when present", async () => {
    await renderSection(buildProfile());

    await waitFor(() => {
      expect(screen.getByText('Stub Name')).toBeInTheDocument();
    });

    const stubbedHosts = [
      'website.example',
      'blog.example',
      'github.example',
      'linkedin.example',
    ];
    const orderedHrefs = screen
      .getAllByRole('link')
      .map((a) => a.getAttribute('href') || '')
      .filter((href) => stubbedHosts.some((h) => href.includes(h)));

    expect(orderedHrefs).toEqual([
      'https://website.example',
      'https://blog.example',
      'https://github.example',
      'https://linkedin.example',
    ]);
  });

  it('navigates to /resume-preview when the resume CTA is clicked', async () => {
    await renderSection(buildProfile());

    await waitFor(() => {
      expect(screen.getByText('Stub Name')).toBeInTheDocument();
    });

    const previewBtn = screen.getByRole('button', { name: 'resume.preview' });
    await act(async () => {
      fireEvent.click(previewBtn);
    });

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/resume-preview');
  });

  it('drives the rendered tabs from loadLocalizedResumeProfile (loading vs loaded)', async () => {
    // loading: loader never resolves → BasicsTab returns null → no profile name in DOM
    await renderSection(null);

    expect(screen.queryByText('Stub Name')).not.toBeInTheDocument();
    expect(screen.getAllByText('profileTabs.basics').length).toBeGreaterThan(0);

    expect(loadProfileMock).toHaveBeenCalledWith('ko');
  });
});
