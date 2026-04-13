import type { Config } from 'tailwindcss';
import { colors, fonts, spacing, radii, keyframes, tailwindAnimation } from './src/design-tokens';

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
      },
      borderRadius: {
        card: radii.card,
        modal: radii.modal,
        pill: radii.pill,
      },
      keyframes,
      animation: tailwindAnimation,
    },
  },
} satisfies Config;
