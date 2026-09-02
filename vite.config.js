import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const { version } = JSON.parse(readFileSync("./package.json", "utf8"));
/* Frozen at build so the copyright line is the same string on both the
   prerendered document and the render that attaches to it. Reading the year
   from the browser's clock instead leaves the two disagreeing across a New
   Year rollover and a device on the wrong time zone.

   Read in the park's own zone rather than the build machine's: CI runs in UTC,
   which turns the year over six hours before Baytown does. */
const buildYear = Number(
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
  }).format(new Date()),
);

export default defineConfig(({ isSsrBuild }) => ({
  define: {
    __BUILD_VERSION__: JSON.stringify(version),
    __BUILD_YEAR__: JSON.stringify(buildYear),
  },
  plugins: [react()],
  build: {
    /*
     * Every browser this site sees supports these. Left undeclared the
     * toolchain picks an older floor and ships transforms and polyfills for
     * engines nobody arrives on.
     */
    target: ["chrome107", "edge107", "firefox104", "safari16"],
    rollupOptions: {
      output: isSsrBuild
        ? {}
        : {
            /*
             * Dependencies change on their own schedule and application code
             * changes on every deploy. Split apart, a deploy re-fetches only
             * what it actually rewrote instead of throwing away a returning
             * visitor's whole cache.
             */
            manualChunks: {
              react: ["react", "react-dom", "react-router-dom"],
              supabase: ["@supabase/supabase-js"],
              motion: ["motion", "motion/react"],
              gl: ["ogl"],
            },
          },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
}));
