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
import Beasties from "beasties";

const DIST = "dist";
const MANAGED = "data-route-meta";
// Beasties stamps the element it treated as the document; the page does not
// need to carry that.
const CONTAINER_STAMP = " data-beasties-container";

/*
 * Writes the rules a route's markup needs into the page itself.
 *
 * The first paint waits on the stylesheet: a browser will not draw a page
 * whose <link rel="stylesheet"> is still in flight, and on a phone that link is
 * a round trip and a download before any of the markup after it counts. Every
 * route here is rendered whole, so the rules its markup needs are knowable
 * here too. They go into a <style> in the head, and the sheet itself is asked
 * for on a media query that matches nothing - fetched without holding the
 * paint - and switched on when it lands. What arrives late is only what the
 * page has no element for yet.
 *
 * The exceptions are the states the page takes on after it is served: the
 * reveal marks a section with an attribute as it is scrolled to, a control
 * takes one when it is pressed or current, and none of those are on any
 * element at build time. Every rule keyed on a data- or aria- attribute rides
 * along regardless. So do the font faces: a preloaded font file with no
 * @font-face naming it is text set in the fallback and reset when the sheet
 * lands.
 */
const inline = new Beasties({
  path: DIST,
  publicPath: "/",
  preload: "media",
  pruneSource: false,
  inlineFonts: true,
  preloadFonts: false,
  allowRules: [/\[(data|aria)-/],
  reduceInlineStyles: false,
  mergeStylesheets: false,
  logLevel: "silent",
});
const VIEWPORT =
  '<meta content="width=device-width, initial-scale=1.0" name="viewport" />';

const { render, PRERENDER_PATHS } = await import("../dist-ssr/entry-server.js");
const shell = readFileSync(join(DIST, "index.html"), "utf8");

const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#x27;": "'",
};

/*
 * `<style>` holds raw text. A parser reads everything between the tags
 * literally and decodes no entity in it, so an apostrophe that arrives written
 * as `&#x27;` stays six characters wide in the document forever. The render
 * that attaches to the document produces the apostrophe, finds a stylesheet
 * that does not match the one in front of it, and throws away every node on
 * the page to draw them all again - which is the whole prerender, spent.
 *
 * `renderToString` escapes a text child wherever it finds one, having no way
 * to know this element will not decode it. Putting the text back is this
 * step's job: it is the one writing the file.
 */
const rawText = (markup) =>
  markup.replace(
    /(<style\b[^>]*>)([\s\S]*?)(<\/style>)/g,
    (whole, open, body, close) =>
      open +
      body.replace(/&(?:amp|lt|gt|quot|#x27);/g, (e) => ENTITIES[e]) +
      close,
  );

/*
 * Runs the bundle after the first frame rather than before it.
 *
 * Every route written here is a finished document, so its first frame owes
 * the bundle nothing. A module script is deferred, which only means it waits
 * for the parser: it runs the moment parsing ends, and on a slow phone that
 * moment arrives before the browser has found a frame to paint the document
 * in. The page then sits blank while the bundle adopts markup nobody has been
 * shown, and the whole download is charged to the first paint.
 *
 * The entry keeps its early fetch, as a module preload, and loses its script
 * tag. An inline module in its place asks for the bundle one frame after the
 * first, which is the first frame the document can have been painted in and
 * the earliest the bundle can no longer hold it back. The shell the app
 * mounts into is left alone: with nothing served, nothing waits.
 */

/*
 * Recovers the one import nothing was watching.
 *
 * withBuildRefresh covers the route chunks and the deferred components, but it
 * lives inside the bundle, so the import that fetches the bundle itself has
 * never been under it. That import failing is the worst of the set and the
 * quietest: the document is a finished page and it is already painted, so the
 * visitor is left reading a site that looks entirely normal and answers
 * nothing - no navigation, no cart, no booking - and no error boundary ever
 * runs to say otherwise, because the code that would have drawn one is the
 * code that did not arrive. A hashed filename goes missing whenever a tab is
 * loaded across a deploy, and a phone drops a request on its own account, and
 * either one ends here.
 *
 * Asking again is not the recovery it looks like. A module fetch that fails is
 * recorded against its URL in the document's module map, and every later
 * import of that specifier is handed the recorded failure with no request
 * made, so a second import of the same URL cannot reach the network at all.
 * Reaching it means asking for a different URL, and an entry imported under a
 * query is an entry whose dependency preloads no longer match the ones the
 * document already holds - measured here, that recovers the bundle and then
 * costs a second reload when the mismatch reaches the deferred components.
 *
 * So the boot recovers the way the route chunks already do. The document is
 * what pins a build, it is served must-revalidate, and a fresh one carries the
 * current hashes and a clean module map, which answers the stale tab and the
 * dropped request in one move. One reload per tab, gated on the mark being
 * written rather than on the reload being wanted, because a bundle missing
 * from every build would otherwise reload the page forever. The key is the
 * boot's own, so it can never spend the allowance chunk-recovery needs once
 * the bundle is running.
 *
 * Where no reload is available the rejection is rethrown and reports as it
 * always did. Where the reload is taken nothing is reported, which is the same
 * trade the route chunks already make: a failure that healed itself describes
 * a deploy the visitor walked into rather than a defect in the site.
 */
const bootScript = (src) =>
  [
    `const boot=${JSON.stringify(src)},MARK="speedway146:boot-refresh";`,
    `const spent=()=>{try{return sessionStorage.getItem(MARK)!==null}catch{return true}};`,
    `const spend=()=>{try{sessionStorage.setItem(MARK,boot);return true}catch{return false}};`,
    `requestAnimationFrame(()=>requestAnimationFrame(()=>{import(boot).catch((error)=>{if(spent()||!spend())throw error;location.reload()})}));`,
  ].join("");

function paintFirst(html) {
  const entry = html.match(
    /^[ \t]*<script type="module" crossorigin src="([^"]+)"><\/script>\n/m,
  );
  if (!entry) throw new Error("the shell carries no module entry");
  const [tag, src] = entry;
  const preload = `    <link rel="modulepreload" crossorigin href="${src}" />\n`;
  const boot = `    <script type="module">${bootScript(src)}</script>\n`;
  return html.replace(tag, `${preload}${boot}`);
}

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
  const block = [
    ...head.tags.map(renderTag),
    `    <script type="application/ld+json" ${MANAGED}>${graph}</script>`,
  ].join("\n");
  out = out.replace("</head>", `${block}\n  </head>`);
  /*
   * The candidates travel with the href: a preload naming one file has the
   * browser fetch that file whatever width the element goes on to choose.
   *
   * It goes directly under the viewport, ahead of the fonts, the stylesheet
   * and the bundle. A preload is queued where it is read, so one appended at
   * the end of the head waits on a render-blocking file before the photograph
   * the page is measured on is even asked for; and one read above the
   * viewport measures `100vw` against the 980px desktop fallback and fetches
   * a file several times the width the phone paints.
   */
  if (!head.hero) return out;
  if (!out.includes(VIEWPORT))
    throw new Error(
      "the shell has no viewport meta for the hero preload to follow",
    );
  const hero = `    <link rel="preload" as="image" type="image/webp" fetchpriority="high" href="${escape(head.hero.href)}" imagesrcset="${escape(head.hero.imagesrcset)}" imagesizes="${escape(head.hero.imagesizes)}" ${MANAGED} />`;
  return out.replace(VIEWPORT, () => `${VIEWPORT}\n${hero}`);
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
  const rendered = paintFirst(applyHead(shell, head)).replace(
    '<div id="root"></div>',
    `<div id="root">${rawText(markup)}</div>`,
  );
  const document = (await inline.process(rendered)).replace(
    CONTAINER_STAMP,
    "",
  );
  const file = path === "/" ? "index.html" : `${path.replace(/^\//, "")}.html`;
  writeFileSync(join(DIST, file), document);
  process.stdout.write(
    `  ${path} -> dist/${file}  ${(document.length / 1024).toFixed(1)}KB\n`,
  );
}
