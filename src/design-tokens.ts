/**
 * Mogiyoon Design Tokens
 *
 * DESIGN.md에 정의된 디자인 시스템의 프로그래밍 참조 값.
 * Tailwind 유틸리티 클래스와 1:1 대응하며, JS 레벨에서 디자인 값이
 * 필요할 때 (Framer Motion, 동적 스타일 등) 사용한다.
 */

// ─── Colors ─────────────────────────────────────────────

export const colors = {
  background: {
    white: '#ffffff',
    slate50: '#f8fafc',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
  },
  text: {
    primary: '#0f172a',     // slate-900
    secondary: '#334155',   // slate-700
    tertiary: '#64748b',    // slate-500
    muted: '#94a3b8',       // slate-400
    body: '#374151',        // gray-700
    bodyAlt: '#1f2937',     // gray-800
    meta: '#4b5563',        // gray-600
    placeholder: '#9ca3af', // gray-400
  },
  accent: {
    indigo700: '#4338ca',
    indigo600: '#4f46e5',
    indigo500: '#6366f1',
    indigo100: '#e0e7ff',
    indigo50: '#eef2ff',
    violet500: '#8b5cf6',
    violet400: '#a78bfa',
  },
  border: {
    default: '#e2e8f0',     // slate-200
    strong: '#cbd5e1',      // slate-300
    glass: 'rgba(255,255,255,0.4)',
  },
  glassmorphism: {
    bg: 'linear-gradient(to right, rgba(99,102,241,0.2), rgba(139,92,246,0.15), rgba(129,140,248,0.2))',
    glow: '0 0 12px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.4)',
  },
} as const;

// ─── Typography ─────────────────────────────────────────

export const fonts = {
  body: "'Noto Sans KR', sans-serif",
  latin: "'Inter', system-ui, sans-serif",
  display: "'Caveat', cursive",
  mono: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
} as const;

export const fontSizes = {
  hero: '3rem',        // text-5xl — 48px
  display: '2.25rem',  // text-4xl — 36px
  h1: '2.25rem',       // text-4xl
  h2: '1.875rem',      // text-3xl — 30px
  h3: '1.5rem',        // text-2xl — 24px
  subtitle: '1.25rem', // text-xl — 20px
  bodyLg: '1.125rem',  // text-lg — 18px
  body: '1rem',        // text-base — 16px
  label: '0.875rem',   // text-sm — 14px
  small: '0.75rem',    // text-xs — 12px
  tiny: '0.625rem',    // 10px
} as const;

export const fontWeights = {
  black: 900,
  extrabold: 800,
  bold: 700,
  semibold: 600,
  medium: 500,
  normal: 400,
  light: 300,
  thin: 100,
} as const;

// ─── Spacing ────────────────────────────────────────────

export const spacing = {
  xs: '4px',     // 1
  sm: '8px',     // 2
  md: '16px',    // 4  (p-4)
  lg: '24px',    // 6  (p-6)
  xl: '32px',    // 8  (p-8)
  '2xl': '48px', // 12
  section: '80px', // pt-20
} as const;

// ─── Border Radius ──────────────────────────────────────

export const radii = {
  full: '9999px',
  '3xl': '24px',
  '2xl': '16px',
  xl: '12px',
  lg: '8px',
  md: '6px',
} as const;

// ─── Shadows ────────────────────────────────────────────

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  glow: '0 0 12px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.4)',
} as const;

// ─── Container ──────────────────────────────────────────

export const containers = {
  main: '1152px',   // max-w-6xl
  profile: '1024px', // max-w-5xl
  text: '768px',    // max-w-3xl
  narrow: '672px',  // max-w-2xl
  modal: '384px',   // max-w-sm
} as const;

// ─── Breakpoints ────────────────────────────────────────

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
} as const;

// ─── Animation (Framer Motion) ──────────────────────────

export const animation = {
  /** 페이지 전환 */
  page: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'tween' as const, ease: 'easeOut', duration: 0.25 },
  },

  /** 리스트 아이템 stagger */
  list: {
    variants: {
      hidden: {},
      show: { transition: { staggerChildren: 0.07 } },
    },
    item: {
      hidden: { opacity: 0, y: 12 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.28, ease: 'easeOut' },
      },
    },
  },

  /** 칩/뱃지 hover */
  chipHover: {
    whileHover: { y: -2 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
  },

  /** 탭 전환 spring */
  tabSpring: {
    type: 'spring' as const,
    stiffness: 700,
    damping: 30,
  },

  /** 콘텐츠 진입/퇴장 */
  content: {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
  },
} as const;

// ─── Duration Scale ─────────────────────────────────────

export const durations = {
  instant: 0.1,   // 100ms — press feedback
  micro: 0.15,    // 150ms — micro-interaction
  fast: 0.2,      // 200ms — quick hover, exit
  page: 0.25,     // 250ms — page transition
  item: 0.28,     // 280ms — item entrance
  standard: 0.3,  // 300ms — standard hover, shadow
  flip: 0.7,      // 700ms — card flip (exception)
} as const;
