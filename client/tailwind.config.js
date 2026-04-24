/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Фоны темной темы — глубокие, с легким оттенком
        bg: {
          base: '#0a0a0f',       // самый глубокий фон страницы
          surface: '#13131a',    // поверхности карточек
          elevated: '#1c1c26',   // приподнятые блоки (hover, активные)
          border: '#2a2a38',     // границы
        },
        // Текст
        fg: {
          primary: '#e8e8f0',
          secondary: '#9a9ab0',
          tertiary: '#6b6b85',
        },
        // Акцент — violet/indigo
        accent: {
          50: '#eef0ff',
          100: '#e0e3ff',
          200: '#c7ccff',
          300: '#a5a9ff',
          400: '#8482f7',
          500: '#6d66ed',     // основной акцент
          600: '#5b52d9',
          700: '#4d42b8',
          800: '#3f3694',
          900: '#342d78',
        },
        // Семантика для грейдов
        grade: {
          junior: '#97c459',
          middle: '#ef9f27',
          senior: '#e24b4a',
        },
      },
      fontFamily: {
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        lg: '10px',
        xl: '14px',
      },
    },
  },
  plugins: [],
}

