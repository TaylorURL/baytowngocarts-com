/** @type {import('tailwindcss').Config} */
const ramp = (name, stops) =>
  Object.fromEntries(stops.map((s) => [s, `var(--color-${name}-${s})`]));

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
      letterSpacing: {
        widest: "0.18em",
        speedway: "0.22em",
      },
      transitionTimingFunction: {
        snap: "var(--ease-snap)",
        decel: "var(--ease-decel)",
        drawer: "var(--ease-drawer)",
        "out-expo": "var(--ease-snap)",
        "in-out-strong": "var(--ease-decel)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "320ms",
      },
      colors: {
        asphalt: ramp("asphalt", [500, 600, 700, 800, 900, 950]),
        race: ramp("race", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        ignite: ramp("ignite", [100, 300, 400, 500, 600, 700]),
        caution: ramp("caution", [100, 300, 400, 500, 700]),

        navy: ramp("navy", [500, 600, 700, 800, 900]),
        red: ramp("red", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        gray: ramp("gray", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        yellow: {
          300: "var(--color-caution-400)",
          400: "var(--color-caution-500)",
        },
        amber: {
          400: "var(--color-caution-400)",
          500: "var(--color-caution-500)",
        },
        green: ramp("green", [50, 200, 600, 700]),
        silver: {
          light: "var(--color-silver-light)",
          DEFAULT: "var(--color-silver)",
          dark: "var(--color-silver-dark)",
        },
        chalk: "var(--color-chalk)",
        white: "var(--color-white)",
        black: "var(--color-black)",
      },
      backgroundImage: {
        "race-stripe":
          "repeating-linear-gradient(135deg, var(--color-race-600) 0 12px, var(--color-race-700) 12px 24px)",
        "caution-tape":
          "repeating-linear-gradient(135deg, var(--color-caution-500) 0 16px, var(--color-asphalt-900) 16px 32px)",
        "asphalt-grain":
          "radial-gradient(circle at 25% 25%, color-mix(in srgb, var(--color-asphalt-700) 60%, transparent) 0, transparent 40%), radial-gradient(circle at 75% 75%, color-mix(in srgb, var(--color-asphalt-700) 60%, transparent) 0, transparent 45%), linear-gradient(180deg, var(--color-asphalt-900), var(--color-asphalt-950))",
        "hero-vignette":
          "radial-gradient(ellipse at center, transparent 0%, color-mix(in srgb, var(--color-asphalt-950) 70%, transparent) 100%)",
      },
      boxShadow: {
        race: "var(--shadow-race)",
        red: "var(--shadow-race)",
        track: "var(--shadow-track)",
        racing: "var(--shadow-track)",
        lift: "var(--shadow-lift)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },
  plugins: [],
};
