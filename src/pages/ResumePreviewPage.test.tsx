import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (
      key: string,
      options?: { defaultValue?: unknown }
    ) => {
      if (options && typeof options.defaultValue === 'string') {
        return options.defaultValue;
      }
      return key;
    },
    i18n: { language: 'ko', resolvedLanguage: 'ko' },
  }),
}));

vi.mock('../utils/resumePreview', () => ({
  loadResumeBuilderData: vi.fn(),
}));

import { loadResumeBuilderData } from '../utils/resumePreview';
import ResumePreviewPage from './ResumePreviewPage';
import type { ResumeBuilderData } from '../utils/resumePreview';

const buildStubData = (
  overrides: Partial<ResumeBuilderData> = {}
): ResumeBuilderData => ({
  profile: {
    name: 'Stub Name',
    targetRole: 'Stub Role',
    email: 'stub@example.com',
    phone: '010-1234-5678',
    links: { website: 'https://stub.example' },
    photoPlaceholder: false,
    intro: { line: 'Stub intro line', bullets: [{ text: 'Stub bullet' }] },
    projectOrder: ['alpha'],
    projectHighlights: {},
  },
  workExperience: [],
  projects: [],
  education: [],
  awards: [],
  certificates: [],
  skills: [],
  languages: [],
  defaultSelectedBlockIds: [],
  defaultIncludedProjectIds: ['alpha'],
  ...overrides,
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <ResumePreviewPage />
    </MemoryRouter>
  );

const loadMock = vi.mocked(loadResumeBuilderData);

beforeEach(() => {
  loadMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ResumePreviewPage', () => {
  it('renders profile fields once data finishes loading', async () => {
    loadMock.mockResolvedValue(buildStubData());

    renderPage();

    expect(loadMock).toHaveBeenCalledWith('ko');

    await waitFor(() => {
      expect(screen.getByText('Stub Name')).toBeInTheDocument();
    });

    expect(screen.getByText('Stub Role')).toBeInTheDocument();
    expect(screen.getByText('Stub intro line')).toBeInTheDocument();
    expect(screen.getByText('Stub bullet')).toBeInTheDocument();
  });

  it('displays the failure message when loading rejects', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    loadMock.mockRejectedValue(new Error('boom'));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('resume.downloadFailed')).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('passes the resolved language to the loader', async () => {
    loadMock.mockResolvedValue(buildStubData());

    renderPage();

    await waitFor(() => {
      expect(loadMock).toHaveBeenCalledTimes(1);
    });

    expect(loadMock).toHaveBeenCalledWith('ko');
  });
});
