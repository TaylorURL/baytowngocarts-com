/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a1929',
          800: '#0f2942',
          700: '#153e5c',
          600: '#1a4971',
          500: '#1f5385',
        },
        red: {
          600: '#dc2626',
          500: '#ef4444',
          400: '#f87171',
        },
      },
      boxShadow: {
        'racing': '0 10px 15px -3px rgba(220, 38, 38, 0.1), 0 4px 6px -2px rgba(220, 38, 38, 0.05)',
      },
    },
  },
  plugins: [],
};