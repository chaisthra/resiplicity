/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        'brown': {
          100: '#F5F0E9',
          200: '#E6DFD3',
          300: '#D7CCBB',
          400: '#C8B8A4',
          500: '#B9A58C',
          600: '#8B7355',
          700: '#5D4D39',
          800: '#2F261D',
          900: '#1A1510'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
};