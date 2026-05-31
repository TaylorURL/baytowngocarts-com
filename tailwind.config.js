/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', "system-ui", "sans-serif"],
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out-strong": "cubic-bezier(0.77, 0, 0.175, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
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
        silver: {
          light: "var(--color-silver-light)",
          DEFAULT: "var(--color-silver)",
          dark: "var(--color-silver-dark)",
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
