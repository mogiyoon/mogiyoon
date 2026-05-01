import type { Config } from 'tailwindcss';
import { colors, fonts, spacing, radii, shadows, keyframes, tailwindAnimation } from './src/design-tokens';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: colors.background.white,
          subtle: colors.background.slate50,
          muted: colors.background.slate100,
          border: colors.background.slate200,
        },
        content: {
          DEFAULT: colors.text.primary,
          strong: colors.text.strong,
          secondary: colors.text.secondary,
          meta: colors.text.meta,
          tertiary: colors.text.tertiary,
          muted: colors.text.muted,
        },
        accent: {
          DEFAULT: colors.accent.indigo500,
          50: colors.accent.indigo50,
          100: colors.accent.indigo100,
          500: colors.accent.indigo500,
          600: colors.accent.indigo600,
          700: colors.accent.indigo700,
        },
        'accent-violet': {
          400: colors.accent.violet400,
          500: colors.accent.violet500,
        },
        line: {
          DEFAULT: colors.border.default,
          strong: colors.border.strong,
        },
      },
      fontFamily: {
        body: fonts.body as unknown as string[],
        latin: fonts.latin as unknown as string[],
        display: fonts.display as unknown as string[],
        mono: fonts.mono as unknown as string[],
      },
      spacing: {
        section: spacing.section,
        hairline: spacing.hairline,
        'scroll-viewport-half': spacing.scrollViewport.half,
        'scroll-viewport-three-fifths': spacing.scrollViewport.threeFifths,
        'scroll-viewport-full': spacing.scrollViewport.full,
      },
      borderRadius: {
        // Existing semantic tokens (preserved as-is)
        card: radii.card,
        modal: radii.modal,
        pill: radii.pill,
        // Generic scale (Tailwind defaults already exist; these mirror the token source)
        md: radii.md,
        lg: radii.lg,
        xl: radii.xl,
        '2xl': radii['2xl'],
        '3xl': radii['3xl'],
        // App-specific
        'card-soft-28': radii.cardSoft28,
        'card-chunky': radii.cardChunky,
        'paper-edge': radii.paperEdge,
        'paper-edge-lg': radii.paperEdgeLg,
      },
      boxShadow: {
        // Generic stack (mirrors Tailwind defaults but enables design-preview parity)
        sm: shadows.sm,
        lg: shadows.lg,
        xl: shadows.xl,
        '2xl': shadows['2xl'],
        // Brand
        'glow-accent': shadows.glowAccent,
        'glow-accent-sm': shadows.glowAccentSm,
        'glow-accent-xs': shadows.glowAccentXs,
        // Decorative
        'polaroid-sm': shadows.polaroidSm,
        'polaroid-md': shadows.polaroidMd,
        'polaroid-lg': shadows.polaroidLg,
        'star-glow': shadows.starGlow,
        // Page-specific
        'post-card': shadows.postCard,
        'post-card-lg': shadows.postCardLg,
        'post-white-glow': shadows.postWhiteGlow,
        'resume-paper': shadows.resumePaper,
      },
      dropShadow: {
        'glow-accent-sm': '0 0 2px rgba(99,102,241,0.6)',
      },
      keyframes,
      animation: tailwindAnimation,
    },
  },
} satisfies Config;
