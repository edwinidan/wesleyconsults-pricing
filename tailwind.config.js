/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f3f9',
          100: '#d9e0f0',
          200: '#b3c1e0',
          300: '#8da2d1',
          400: '#6683c1',
          500: '#1B2A4A',
          600: '#162240',
          700: '#111a33',
          800: '#0c1226',
          900: '#070a19',
        },
        gold: {
          50: '#fdf9ef',
          100: '#f9edcf',
          200: '#f3dba0',
          300: '#edc970',
          400: '#e7b740',
          500: '#C4961A',
          600: '#a07a15',
          700: '#7c5f10',
          800: '#58430b',
          900: '#342806',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
    },
  },
  plugins: [],
};
