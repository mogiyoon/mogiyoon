/**
 * Mogiyoon Design Tokens — Single Source of Truth
 *
 * 이 파일이 디자인 시스템의 원천이다.
 * - tailwind.config.ts 가 이 파일에서 색상/폰트/간격/반지름을 import
 * - 컴포넌트가 이 파일에서 animation/durations를 import
 */

// ─── Colors ─────────────────────────────────────────────

export const colors = {
  background: {
    white: '#ffffff',
    slate50: '#f8fafc',
    slate100: '#f1f5f9',
    slate200: '#e2e8f0',
  },
  text: {
    primary: '#0f172a',     // slate-900
    strong: '#1e293b',      // slate-800
    secondary: '#334155',   // slate-700
    meta: '#475569',        // slate-600
    tertiary: '#64748b',    // slate-500
    muted: '#94a3b8',       // slate-400
  },
  accent: {
    indigo50: '#eef2ff',
    indigo100: '#e0e7ff',
    indigo500: '#6366f1',
    indigo600: '#4f46e5',
    indigo700: '#4338ca',
    violet400: '#a78bfa',
    violet500: '#8b5cf6',
  },
  border: {
    default: '#e2e8f0',     // slate-200
    strong: '#cbd5e1',      // slate-300
  },
} as const;

// ─── Typography ─────────────────────────────────────────

export const fonts = {
  body: ['Noto Sans KR', 'sans-serif'],
  latin: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Caveat', 'cursive'],
  mono: ['source-code-pro', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
} as const;

// ─── Spacing ────────────────────────────────────────────

export const spacing = {
  section: '5rem', // 80px — pt-20
} as const;

// ─── Border Radius ──────────────────────────────────────

export const radii = {
  card: '0.75rem',   // 12px — rounded-xl
  modal: '1rem',     // 16px — rounded-2xl
  pill: '9999px',    // rounded-full
} as const;

// ─── Keyframes & Animation ──────────────────────────────

export const keyframes = {
  'fade-in-up': {
    '0%': { opacity: '0', transform: 'translateY(14px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  'toast-in-out': {
    '0%': {
      transform: 'translateY(calc(100% + 1.25rem))',
      opacity: '0',
    },
    '15%, 85%': {
      transform: 'translateY(0)',
      opacity: '1',
    },
    '100%': {
      transform: 'translateY(calc(100% + 1.25rem))',
      opacity: '0',
    },
  },
} as const;

export const tailwindAnimation = {
  'toast-in-out': 'toast-in-out 3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
  'fade-in-up': 'fade-in-up 0.35s ease-out both',
} as const;

// ─── Framer Motion ──────────────────────────────────────

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

  /** 탭/토글 전환 spring */
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
