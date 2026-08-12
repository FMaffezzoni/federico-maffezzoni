/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mist: {
          50: '#f4f7f6',
          100: '#e6eeeb',
          200: '#c9dbd5',
          300: '#a3c0b8',
          400: '#7aa39a',
          500: '#5b877e',
          600: '#476c66',
          700: '#3a5752',
          800: '#314744',
          900: '#2b3c39'
        },
        slateink: {
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        sand: {
          50: '#f7f6f3',
          100: '#efede7',
          200: '#ddd8cd'
        },
        accent: {
          DEFAULT: '#3d6b7a',
          soft: '#d7e8ee',
          deep: '#2a4f5c'
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 50px -24px rgba(43, 60, 57, 0.35)'
      }
    }
  },
  plugins: []
};
