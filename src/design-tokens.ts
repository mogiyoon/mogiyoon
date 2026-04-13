/**
 * Mogiyoon Design Tokens
 *
 * Framer Motion 애니메이션에서 사용하는 공유 값.
 * 색상/타이포/간격 등 Tailwind 기반 토큰은 DESIGN.md를 참조한다.
 */

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
