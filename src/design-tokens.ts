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
  section: '5rem',     // 80px — pt-20
  hairline: '4px',     // 4px — ProfileSection p-[4px]
  scrollViewport: {
    half: '52vh',          // PostSection p-[52vh]
    threeFifths: '55vh',   // PostSection m-[55vh]
    full: '65vh',          // PostSection p-[65vh]
  },
} as const;

// ─── Border Radius ──────────────────────────────────────

export const radii = {
  // Existing semantic tokens
  card: '0.75rem',         // 12px — rounded-xl
  modal: '1rem',           // 16px — rounded-2xl
  pill: '9999px',          // rounded-full
  // Generic scale (mirrors design-preview.html CSS variables)
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  // App-specific additions
  cardSoft28: '1.75rem',   // 28px — EducationCard, ProjectFlipPreviewCard (~28.8px treated as same)
  cardChunky: '3rem',      // 48px — PortfolioCard rounded-[3rem]
  paperEdge: '1.4rem',     // 22.4px — ResumePreviewPage rounded-[1.4rem]
  paperEdgeLg: '2rem',     // 32px — ResumePreviewPage rounded-[2rem]
} as const;

// ─── Shadows ────────────────────────────────────────────

export const shadows = {
  // Generic stack (mirrors Tailwind defaults; tokenized for design-preview parity)
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  // Brand glow — indigo-500 base
  glowAccent: '0 0 12px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.4)',
  glowAccentSm: '0 0 2px rgba(99,102,241,0.6)',
  glowAccentXs: '0 0 3px rgba(99,102,241,0.5)',
  // Decorative — polaroid drop shadow stack
  polaroidSm: '2px 2px 7px 1px rgba(0,0,0,0.5)',
  polaroidMd: '5px 5px 5px 1px rgba(0,0,0,0.5)',
  polaroidLg: '7px 7px 7px 1px rgba(0,0,0,0.5)',
  // Decorative — celestial
  starGlow: '0 0 10px #fff, 0 0 20px #fff',
  // Page-specific
  postCard: '0 8px 24px rgba(0,0,0,0.28)',         // PostSection (also covers 0.30 variant; Step B confirms)
  postCardLg: '0 10px 30px rgba(0,0,0,0.35)',
  postWhiteGlow: '0 0 15px rgba(255,255,255,0.2)',
  resumePaper: '0 24px 80px rgba(15,23,42,0.18)',
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
