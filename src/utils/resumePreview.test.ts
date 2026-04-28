import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../i18n', () => ({
  default: {
    loadNamespaces: vi.fn().mockResolvedValue(undefined),
    getFixedT:
      () =>
      (
        key: string,
        options?: { defaultValue?: unknown; returnObjects?: boolean }
      ) => {
        if (options?.returnObjects) {
          return (options.defaultValue ?? []) as unknown;
        }
        if (options && 'defaultValue' in options) {
          return options.defaultValue ?? key;
        }
        return key;
      },
  },
}));

import {
  loadLocalizedResumeProfile,
  loadResumeBuilderData,
  type ResumeProfileSourceData,
} from './resumePreview';

const buildStubProfile = (
  overrides: Partial<ResumeProfileSourceData> = {}
): ResumeProfileSourceData => ({
  name: 'Default Name',
  targetRole: 'Default Role',
  email: 'default@example.com',
  phone: '010-0000-0000',
  links: { website: 'https://example.com' },
  photoPlaceholder: false,
  intro: { line: 'intro line', bullets: [] },
  projectOrder: [],
  projectHighlights: {},
  ...overrides,
});

const okJson = <T,>(body: T) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  } as Response);

const notFound = () =>
  Promise.resolve({ ok: false, status: 404 } as Response);

const mockFetch = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('loadLocalizedResumeProfile', () => {
  it('loads the Korean profile from /data/resume-profile.json when language is ko', async () => {
    const profile = buildStubProfile({ name: 'KO Profile' });
    mockFetch.mockImplementation((input) => {
      const url = typeof input === 'string' ? input : input.toString();
      return url === '/data/resume-profile.json' ? okJson(profile) : notFound();
    });

    await expect(loadLocalizedResumeProfile('ko')).resolves.toMatchObject({
      name: 'KO Profile',
    });
    expect(mockFetch).toHaveBeenCalledWith('/data/resume-profile.json');
    expect(mockFetch).not.toHaveBeenCalledWith('/data/resume-profile.en.json');
  });

  it('loads the English profile from /data/resume-profile.en.json when language is en', async () => {
    const profile = buildStubProfile({ name: 'EN Profile' });
    mockFetch.mockImplementation((input) => {
      const url = typeof input === 'string' ? input : input.toString();
      return url === '/data/resume-profile.en.json' ? okJson(profile) : notFound();
    });

    await expect(loadLocalizedResumeProfile('en')).resolves.toMatchObject({
      name: 'EN Profile',
    });
    expect(mockFetch).toHaveBeenCalledWith('/data/resume-profile.en.json');
  });

  it('falls back to the Korean profile when the English file is missing', async () => {
    const profile = buildStubProfile({ name: 'Fallback Profile' });
    mockFetch.mockImplementation((input) => {
      const url = typeof input === 'string' ? input : input.toString();
      return url === '/data/resume-profile.json' ? okJson(profile) : notFound();
    });

    await expect(loadLocalizedResumeProfile('en-US')).resolves.toMatchObject({
      name: 'Fallback Profile',
    });
    expect(mockFetch).toHaveBeenCalledWith('/data/resume-profile.en.json');
    expect(mockFetch).toHaveBeenCalledWith('/data/resume-profile.json');
  });

  it('throws when no profile file is reachable', async () => {
    mockFetch.mockImplementation(() => notFound());
    await expect(loadLocalizedResumeProfile('ko')).rejects.toThrow(
      /Failed to fetch localized resume profile/
    );
  });
});

describe('loadResumeBuilderData', () => {
  const setupSuccessfulFetches = ({
    profile,
    introduction,
    projectsList,
    project,
  }: {
    profile: ResumeProfileSourceData;
    introduction: unknown;
    projectsList: unknown;
    project: unknown;
  }) => {
    mockFetch.mockImplementation((input) => {
      const url = typeof input === 'string' ? input : input.toString();
      switch (url) {
        case '/data/resume-profile.json':
          return okJson(profile);
        case '/data/introduction.json':
          return okJson(introduction);
        case '/data/projects-list.json':
          return okJson(projectsList);
        case '/data/projects/alpha.json':
          return okJson(project);
        default:
          return notFound();
      }
    });
  };

  it('aggregates profile, work experience, projects, and metadata into a single builder payload', async () => {
    const profile = buildStubProfile({
      name: 'Builder Name',
      projectOrder: ['alpha'],
      projectHighlights: {
        alpha: {
          teamType: 'Personal',
          summary: 'alpha summary',
          highlights: [{ title: 'Alpha Highlight', body: 'Alpha body' }],
        },
      },
    });

    const introduction = {
      workExperience: [
        {
          id: 'work-1',
          projects: [{ id: 'p1', tech: ['TypeScript'] }],
        },
      ],
      education: [{ id: 'edu-1' }],
      awards: [{ id: 'award-1' }],
      certificates: [{ id: 'cert-1' }],
      skills: [{ category: 'frontend', items: ['React', 'TypeScript'] }],
      languages: [{ id: 'lang-1' }],
    };

    const projectsList = [{ id: 'alpha', techStack: ['React'] }];

    const project = {
      id: 'alpha',
      title: 'Alpha Title',
      subtitle: 'Alpha Subtitle',
      overview: {
        introduction: 'alpha.introduction',
        period: '2025.01 ~ 2025.06',
        techStack: ['React', 'Vite'],
        github: 'https://github.com/example/alpha',
        demo: '',
        notion: '',
      },
      summaries: [],
      license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
    };

    setupSuccessfulFetches({ profile, introduction, projectsList, project });

    const data = await loadResumeBuilderData('ko');

    expect(data.profile.name).toBe('Builder Name');

    expect(data.workExperience).toHaveLength(1);
    expect(data.workExperience[0]).toMatchObject({
      id: 'work-1',
      projects: [{ id: 'p1', tech: ['TypeScript'] }],
    });

    expect(data.projects).toHaveLength(1);
    const alpha = data.projects[0];
    expect(alpha.id).toBe('alpha');
    expect(alpha.summary).toBe('alpha summary');
    expect(alpha.techStack).toEqual(['React', 'Vite']);
    expect(alpha.links.github).toBe('https://github.com/example/alpha');
    expect(alpha.defaultIncluded).toBe(true);

    const resumeBlockIds = alpha.blocks.map((block) => block.id);
    expect(resumeBlockIds).toContain('project:alpha:resume:0');
    expect(resumeBlockIds).toContain('project:alpha:overview:introduction');

    expect(data.education).toHaveLength(1);
    expect(data.awards[0].id).toBe('award-1');
    expect(data.certificates[0].id).toBe('cert-1');
    expect(data.skills[0]).toMatchObject({
      category: 'frontend',
      items: ['React', 'TypeScript'],
    });
    expect(data.languages).toHaveLength(1);

    expect(data.defaultIncludedProjectIds).toEqual(['alpha']);
    expect(data.defaultSelectedBlockIds).toContain('project:alpha:resume:0');
  });

  it('flattens summaries[].parts into ResumeEditableBlock entries with subtitle, text, and link', async () => {
    const profile = buildStubProfile({
      projectOrder: ['alpha'],
      projectHighlights: {},
    });
    const introduction = {
      workExperience: [],
      education: [],
      awards: [],
      certificates: [],
      skills: [],
    };
    const projectsList = [{ id: 'alpha', techStack: [] }];

    // Mirror the real summaries shape used by projects/<id>.json:
    // summaries[].parts is SummaryPart[][] — each inner array is one block.
    const project = {
      id: 'alpha',
      title: 'Alpha Title',
      subtitle: 'Alpha Subtitle',
      overview: { period: '2025.01 ~ 2025.06', techStack: [] },
      summaries: [
        {
          id: 'development',
          title: 'alpha.summaries.development.title',
          parts: [
            [
              {
                type: 'subtitle',
                id: 's0',
                content: 'alpha.summaries.development.parts.0.subtitle',
              },
              {
                type: 'text',
                content: 'alpha.summaries.development.parts.0.text',
              },
              {
                type: 'link',
                href: 'https://github.com/example/alpha/pull/1',
                label: 'PR',
              },
            ],
            [
              {
                type: 'text',
                content: 'alpha.summaries.development.parts.1.text',
              },
            ],
          ],
        },
      ],
      license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
    };

    setupSuccessfulFetches({ profile, introduction, projectsList, project });

    const data = await loadResumeBuilderData('ko');
    const alpha = data.projects[0];
    const summaryBlocks = alpha.blocks.filter((block) =>
      block.id.startsWith('project:alpha:development:')
    );

    expect(summaryBlocks).toHaveLength(2);

    const firstBlock = summaryBlocks[0];
    expect(firstBlock.id).toBe('project:alpha:development:0');
    // i18n mock returns the key as the value, so the subtitle key surfaces as title.
    expect(firstBlock.title).toBe('alpha.summaries.development.parts.0.subtitle');
    expect(firstBlock.body).toContain('alpha.summaries.development.parts.0.text');
    expect(firstBlock.body).toContain('PR: https://github.com/example/alpha/pull/1');

    // Block without a subtitle falls back to the section title plus index.
    const secondBlock = summaryBlocks[1];
    expect(secondBlock.id).toBe('project:alpha:development:1');
    expect(secondBlock.title).toMatch(/2$/);
  });

  it('emits overview blocks for introduction, role, features, and other when present', async () => {
    const profile = buildStubProfile({
      projectOrder: ['alpha'],
      projectHighlights: {},
    });
    const introduction = {
      workExperience: [],
      education: [],
      awards: [],
      certificates: [],
      skills: [],
    };
    const projectsList = [{ id: 'alpha', techStack: [] }];

    const project = {
      id: 'alpha',
      title: 'Alpha Title',
      subtitle: 'Alpha Subtitle',
      overview: {
        introduction: 'alpha.overview.introduction',
        role: 'alpha.overview.role',
        features: 'alpha.overview.features',
        other: 'alpha.overview.other',
        period: '2025.01 ~ 2025.06',
        techStack: [],
      },
      summaries: [],
      license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
    };

    setupSuccessfulFetches({ profile, introduction, projectsList, project });

    const data = await loadResumeBuilderData('ko');
    const blockIds = data.projects[0].blocks.map((block) => block.id);

    expect(blockIds).toEqual(
      expect.arrayContaining([
        'project:alpha:overview:introduction',
        'project:alpha:overview:role',
        'project:alpha:overview:features',
        'project:alpha:overview:other',
      ])
    );
  });

  it('handles missing optional sections without throwing', async () => {
    const profile = buildStubProfile({ projectOrder: [], projectHighlights: {} });
    const introduction = {
      workExperience: [],
      education: [],
      awards: [],
      certificates: [],
      skills: [],
    };
    const projectsList: unknown[] = [];

    mockFetch.mockImplementation((input) => {
      const url = typeof input === 'string' ? input : input.toString();
      switch (url) {
        case '/data/resume-profile.json':
          return okJson(profile);
        case '/data/introduction.json':
          return okJson(introduction);
        case '/data/projects-list.json':
          return okJson(projectsList);
        default:
          return notFound();
      }
    });

    const data = await loadResumeBuilderData('ko');

    expect(data.workExperience).toEqual([]);
    expect(data.projects).toEqual([]);
    expect(data.languages).toEqual([]);
    expect(data.defaultIncludedProjectIds).toEqual([]);
    expect(data.defaultSelectedBlockIds).toEqual([]);
  });
});
