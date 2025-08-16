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
      }
    },
  },
  plugins: [],
}

