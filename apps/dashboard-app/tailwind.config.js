const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');
const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,modals,layout}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', ...fontFamily.sans],
      },
      colors: {
        'primary': {
          DEFAULT: '#2742F5',
          50: '#D6DCFD',
          100: '#C3CAFC',
          200: '#9CA8FA',
          300: '#7586F9',
          400: '#4E64F7',
          500: '#2742F5',
          600: '#0A25DA',
          700: '#081CA4',
          800: '#05136F',
          900: '#030A39',
          950: '#01051E'
        },
      }
    },
  },
  plugins: [],
};
