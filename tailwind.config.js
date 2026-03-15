/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "var(--color-navy-900)",
          800: "var(--color-navy-800)",
          700: "var(--color-navy-700)",
          600: "var(--color-navy-600)",
          500: "var(--color-navy-500)",
        },
        red: {
          900: "var(--color-red-900)",
          800: "var(--color-red-800)",
          700: "var(--color-red-700)",
          600: "var(--color-red-600)",
          500: "var(--color-red-500)",
          400: "var(--color-red-400)",
          300: "var(--color-red-300)",
          200: "var(--color-red-200)",
          100: "var(--color-red-100)",
          50: "var(--color-red-50)",
        },
        gray: {
          900: "var(--color-gray-900)",
          800: "var(--color-gray-800)",
          700: "var(--color-gray-700)",
          600: "var(--color-gray-600)",
          500: "var(--color-gray-500)",
          400: "var(--color-gray-400)",
          300: "var(--color-gray-300)",
          200: "var(--color-gray-200)",
          100: "var(--color-gray-100)",
          50: "var(--color-gray-50)",
        },
        yellow: {
          400: "var(--color-yellow-400)",
          300: "var(--color-yellow-300)",
        },
        amber: {
          500: "var(--color-yellow-400)",
          400: "var(--color-yellow-300)",
        },
        green: {
          700: "var(--color-green-700)",
          600: "var(--color-green-600)",
          200: "var(--color-green-200)",
          50: "var(--color-green-50)",
        },
        white: "var(--color-white)",
        black: "var(--color-black)",
      },
      boxShadow: {
        racing: "var(--shadow-racing)",
        red: "var(--shadow-red)",
      },
    },
  },
  plugins: [],
};
