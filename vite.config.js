import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { SOFTWARE_RENDERER } from "./src/lib/software-renderer.js";

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

/*
 * Asks, before anything is painted, whether this machine draws in software.
 *
 * The hero and the section backdrops are layered gradients and patterns the
 * full width of the page. A GPU paints them for nothing; a machine with none,
 * such as the one PageSpeed measures on, rasterises every layer through a
 * software Vulkan device and spends seconds on the first frame. The probe
 * runs inline in the head, so its answer is on the root element before the
 * first frame is drawn, and the stylesheet keys the costly layers off it. The
 * pattern is the renderer module's own, so the two never disagree.
 */
function softwareRendererProbe() {
  const probe = `(function(){try{var c=document.createElement("canvas");var g=c.getContext("webgl")||c.getContext("experimental-webgl");if(!g)return;var i=g.getExtension("WEBGL_debug_renderer_info");var r=i?g.getParameter(i.UNMASKED_RENDERER_WEBGL):g.getParameter(g.RENDERER);if(${SOFTWARE_RENDERER.toString()}.test(String(r||"")))document.documentElement.setAttribute("data-gpu","software");var l=g.getExtension("WEBGL_lose_context");if(l)l.loseContext()}catch(e){}})()`;
  return {
    name: "software-renderer-probe",
    transformIndexHtml(html) {
      return html.replace(
        /(<meta[^>]*name="viewport"[^>]*>\n)/,
        `$1    <script>${probe}</script>\n`,
      );
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  define: {
    __BUILD_VERSION__: JSON.stringify(version),
    __BUILD_YEAR__: JSON.stringify(buildYear),
  },
  plugins: [react(), softwareRendererProbe()],
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
              /*
               * The JSX runtime is named here because React's own entry does
               * not reach it: it is pulled in by the compiled output of every
               * component instead, and a module no group claims joins the
               * first group that happens to reach it. Named alongside React it
               * is where everything that renders an element already looks.
               *
               * The animation library is left to the splitter. Nothing on a
               * first paint reaches for it any more, so every path to it is a
               * dynamic import and it is already a chunk of its own; naming it
               * a group only gives it the chance to claim the JSX runtime, and
               * the entry then has to load the whole library to draw a div.
               */
              react: [
                "react",
                "react-dom",
                "react-router-dom",
                "react/jsx-runtime",
              ],
              supabase: ["@supabase/supabase-js"],
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
