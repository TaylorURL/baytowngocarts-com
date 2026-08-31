/*
 * Writes each indexed route's markup and head into its own document.
 *
 * A single-page app serves one empty shell, so first paint waits on the bundle
 * downloading, parsing, executing and rendering, and a crawler that does not
 * run scripts is served a page with nothing on it. This renders the tree the
 * client would have produced and puts it in the file, so the document already
 * describes the page and the browser attaches to what is there.
 *
 * Run by `npm run build`, after the client and server bundles both exist.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const MANAGED = "data-route-meta";

const { render, PRERENDER_PATHS } = await import("../dist-ssr/entry-server.js");
const shell = readFileSync(join(DIST, "index.html"), "utf8");

const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const renderTag = (tag) => {
  const name = tag.rel ? "link" : "meta";
  const attrs = Object.entries(tag)
    .map(([key, value]) => `${key}="${escape(value)}"`)
    .join(" ");
  return `    <${name} ${MANAGED} ${attrs} />`;
};

const patternFor = (tag) =>
  tag.rel
    ? new RegExp(`[ \\t]*<link[^>]*rel="${tag.rel}"[^>]*>\\n?`, "g")
    : tag.property
      ? new RegExp(`[ \\t]*<meta[^>]*property="${tag.property}"[^>]*>\\n?`, "g")
      : new RegExp(`[ \\t]*<meta[^>]*name="${tag.name}"[^>]*>\\n?`, "g");

/*
 * The shell carries the home page's head. A route's own head replaces the tag
 * with the same identity rather than sitting beside it, so no document ships
 * two canonicals or two descriptions.
 */
function applyHead(html, head) {
  let out = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escape(head.title)}</title>`,
  );
  for (const tag of head.tags) out = out.replace(patternFor(tag), "");
  out = out.replace(
    /[ \t]*<link[^>]*rel="preload"[^>]*as="image"[^>]*fetchpriority="high"[^>]*\/?>\n?/g,
    "",
  );
  const graph = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": head.graph,
  }).replace(/</g, "\\u003c");
  /* The candidates travel with the href: a preload naming one file has the
     browser fetch that file whatever width the element goes on to choose. */
  const hero = head.hero
    ? [
        `    <link rel="preload" as="image" type="image/webp" fetchpriority="high" href="${escape(head.hero.href)}" imagesrcset="${escape(head.hero.imagesrcset)}" imagesizes="${escape(head.hero.imagesizes)}" ${MANAGED} />`,
      ]
    : [];
  const block = [
    ...hero,
    ...head.tags.map(renderTag),
    `    <script type="application/ld+json" ${MANAGED}>${graph}</script>`,
  ].join("\n");
  return out.replace("</head>", `${block}\n  </head>`);
}

/*
 * The shell, untouched, for every path the build did not prerender. Serving
 * those the prerendered home page instead would hand the browser one route's
 * markup to attach another route's tree to.
 */
writeFileSync(join(DIST, "app.html"), shell);
process.stdout.write("  fallback shell -> dist/app.html\n");

/*
 * The 404 gets a document too, so the host answers an unknown path with a 404
 * status and the site's own chrome rather than the app shell at 200.
 */
for (const path of [...PRERENDER_PATHS, "/404"]) {
  const { html: markup, head } = await render(path);
  if (!head)
    throw new Error(
      `${path} rendered no head; every prerendered route needs a RouteMeta`,
    );
  if (!markup.trim()) throw new Error(`${path} rendered no markup`);
  const document = applyHead(shell, head).replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>`,
  );
  const file = path === "/" ? "index.html" : `${path.replace(/^\//, "")}.html`;
  writeFileSync(join(DIST, file), document);
  process.stdout.write(
    `  ${path} -> dist/${file}  ${(document.length / 1024).toFixed(1)}KB\n`,
  );
}
