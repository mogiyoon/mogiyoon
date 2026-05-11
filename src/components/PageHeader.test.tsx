import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const changeLanguageMock = vi.fn();
const i18nState: { language: string } = { language: 'ko' };

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      get language() {
        return i18nState.language;
      },
      changeLanguage: changeLanguageMock,
    },
  }),
}));

import PageHeader from './PageHeader';

const renderHeader = (
  overrides: Partial<{
    onOpenContactModal: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
  }> = {}
) => {
  const props = {
    onOpenContactModal: vi.fn(),
    activeTab: 'about',
    setActiveTab: vi.fn(),
    ...overrides,
  };
  const utils = render(
    <MemoryRouter initialEntries={['/']}>
      <PageHeader {...props} />
    </MemoryRouter>
  );
  return { ...utils, props };
};

beforeEach(() => {
  changeLanguageMock.mockReset();
  i18nState.language = 'ko';
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('PageHeader', () => {
  it('renders the four tab links', () => {
    renderHeader();

    expect(screen.getByText('about')).toBeInTheDocument();
    expect(screen.getByText('projects')).toBeInTheDocument();
    expect(screen.getByText('posts')).toBeInTheDocument();
    expect(screen.getByText('profile')).toBeInTheDocument();
  });

  it('applies active classes to the active tab and inactive classes to others', () => {
    renderHeader({ activeTab: 'projects' });

    const activeLink = screen.getByText('projects').closest('a');
    const inactiveLink = screen.getByText('about').closest('a');

    expect(activeLink?.className).toContain('bg-slate-900');
    expect(activeLink?.className).toContain('text-white');
    expect(inactiveLink?.className).not.toContain('bg-slate-900');
    expect(inactiveLink?.className).not.toContain('text-white');
  });

  it('invokes onOpenContactModal when the Info button is clicked', () => {
    const { props } = renderHeader();

    fireEvent.click(screen.getByRole('button', { name: /info/i }));

    expect(props.onOpenContactModal).toHaveBeenCalledTimes(1);
  });

  it('toggles the language dropdown open and closed', () => {
    renderHeader();

    const toggle = screen.getByText('language').closest('button')!;

    expect(screen.queryByText('한국어')).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.getByText('한국어')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.queryByText('한국어')).not.toBeInTheDocument();
  });

  it('calls i18n.changeLanguage("ko") and closes the dropdown when 한국어 is selected', () => {
    i18nState.language = 'en';
    renderHeader();

    fireEvent.click(screen.getByText('language').closest('button')!);
    fireEvent.click(screen.getByText('한국어'));

    expect(changeLanguageMock).toHaveBeenCalledWith('ko');
    expect(screen.queryByText('한국어')).not.toBeInTheDocument();
  });

  it('calls i18n.changeLanguage("en") and closes the dropdown when English is selected', () => {
    renderHeader();

    fireEvent.click(screen.getByText('language').closest('button')!);
    fireEvent.click(screen.getByText('English'));

    expect(changeLanguageMock).toHaveBeenCalledWith('en');
    expect(screen.queryByText('English')).not.toBeInTheDocument();
  });

  it('closes the dropdown when a mousedown happens outside it', () => {
    renderHeader();

    fireEvent.click(screen.getByText('language').closest('button')!);
    expect(screen.getByText('한국어')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText('한국어')).not.toBeInTheDocument();
  });

  it('marks the current language with bold and accent classes (ko)', () => {
    i18nState.language = 'ko';
    renderHeader();

    fireEvent.click(screen.getByText('language').closest('button')!);

    const koButton = screen.getByText('한국어');
    const enButton = screen.getByText('English');

    expect(koButton.className).toContain('font-bold');
    expect(koButton.className).toContain('text-accent-600');
    expect(enButton.className).not.toContain('font-bold');
    expect(enButton.className).not.toContain('text-accent-600');
  });

  it('marks the current language with bold and accent classes (en)', () => {
    i18nState.language = 'en';
    renderHeader();

    fireEvent.click(screen.getByText('language').closest('button')!);

    const koButton = screen.getByText('한국어');
    const enButton = screen.getByText('English');

    expect(enButton.className).toContain('font-bold');
    expect(enButton.className).toContain('text-accent-600');
    expect(koButton.className).not.toContain('font-bold');
    expect(koButton.className).not.toContain('text-accent-600');
  });
});
