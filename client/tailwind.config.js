/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0a0b10',
          surface: '#16171d',
          elevated: '#1e1f28',
          border: '#2a2a38',
        },
        fg: {
          primary: '#e2e8f0',
          secondary: '#94a3b8',
          tertiary: '#64748b',
        },
        accent: {
          50:  '#eef0ff',
          100: '#e0e3ff',
          200: '#c7ccff',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        grade: {
          junior: '#34d399',
          middle: '#fbbf24',
          senior: '#fb7185',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        lg: '10px',
        xl: '14px',
      },
    },
  },
  plugins: [],
}
