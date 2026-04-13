import type { Config } from 'tailwindcss';
import { fonts, keyframes, tailwindAnimation } from './src/design-tokens';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: fonts.display as unknown as string[],
      },
      keyframes,
      animation: tailwindAnimation,
    },
  },
} satisfies Config;
