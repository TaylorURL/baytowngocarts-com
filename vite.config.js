import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const { version } = JSON.parse(readFileSync("./package.json", "utf8"));

export default defineConfig(({ isSsrBuild }) => ({
  define: {
    __BUILD_VERSION__: JSON.stringify(version),
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
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
