import { display } from 'html2canvas/dist/types/css/property-descriptors/display';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display:  ['Caveat', 'cursive']
      },
      keyframes: {
        'toast-in-out': { // 애니메이션 이름
          '0%': {
            transform: 'translateY(calc(100% + 1.25rem))',
            opacity: '0',
          },
          '15%, 85%': { // 나타나서 유지되는 구간
            transform: 'translateY(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(calc(100% + 1.25rem))',
            opacity: '0',
          },
        },
      },
      animation: {
        'toast-in-out': 'toast-in-out 3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
      },
    },
  },
}

