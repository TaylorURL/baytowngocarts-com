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
 * Asking again is not the recovery it looks like, and the entry is the one
 * import where that is true twice over. A module fetch that fails is recorded
 * against its URL, so a second import of the same specifier is handed the
 * recorded failure with no request made. Asking under a query does reach the
 * network - and it loads a second copy of the entry at a URL nothing else
 * names. Every chunk the page defers is built against the entry's real
 * filename, so each of them still resolves to the specifier the failure is
 * recorded under and each of them fails on a file the host served perfectly.
 * Measured here: the bundle recovers, the hero particles, the rotating text
 * and the counters all reject, and chunk-recovery spends the reload the boot
 * had just avoided. A retry can move a route chunk. It cannot move the entry.
 *
 * So the recovery is a fresh document, which pins the current build and
 * carries a clean module map, and it answers the stale tab and the dropped
 * request in one move. What has to be right is the allowance, because a
 * reload over a file that will never arrive is a loop.
 *
 * One reload per boot, and which boot it was spent on is what the mark holds.
 * An allowance is a claim about one file: a build whose entry is genuinely
 * missing must not reload the page twice, and a build whose entry arrives
 * must not leave the next build unable to reload at all. A session store
 * outlives every deploy the tab sits through, so a mark that is only ever
 * written is a tab that recovers once and is then defenceless for as long as
 * it stays open. The mark is released the moment the bundle arrives, and a
 * spent mark stops only the boot whose name it carries.
 *
 * That store is not always there. An in-app webview with storage shut, a
 * browser in a locked-down privacy mode, a visitor who blocked site data:
 * sessionStorage throws on the first touch, and a store that cannot be read
 * cannot bound anything, so it counted as an allowance already spent. The
 * page then had no recovery at all - one request, no reload, and a finished,
 * painted document that answers nothing. That is not a rare shape on a phone,
 * and it is the whole of what those readers got.
 *
 * Where the store is shut, the bound has to come from somewhere the browser
 * keeps for us. The navigation type was the first answer and it answers a
 * different question than the one being asked: it says this document was
 * reached by a reload, not that the page reloaded itself. A phone refreshes
 * pages constantly - a pull on the list, a tab coming back to the front, a
 * reader who thinks the page looks wrong and pulls again - and every one of
 * those arrives as a reload with the allowance already counted gone. So a
 * reader whose store is shut had a recovery only on a document they had
 * navigated to, and none at all on one they had refreshed themselves, which on
 * a phone is most of them. The first dropped request after a pull ends exactly
 * where it ended before any of this: a finished, painted document that answers
 * nothing.
 *
 * What the reload needs is a mark of its own, and the session history entry
 * holds one. State attached to an entry survives that entry being reloaded,
 * belongs to this tab and this entry alone, is not site data and so is not
 * what a privacy mode or a webview closes, and a document the visitor
 * navigated to carries none of it. So the question becomes the right one: not
 * whether this document was reloaded, but whether this document was reloaded
 * by the boot, over this build. It is written beside whatever state is already
 * there and taken back off the same way, so the router that reads that entry
 * after the bundle arrives finds it as it left it.
 *
 * The mark is therefore held in both places and read from whichever one can
 * answer, the session store first because it is the one that outlives a
 * visitor's own refreshes; the navigation type stays as the last resort for a
 * browser that offers neither. The allowance is one, and it is never none.
 *
 * The same notice answers a stylesheet that is gone for good. That failure
 * has its own one-reload allowance in the head script, and where that
 * allowance has been spent the sheet is never coming back on this load: the
 * document keeps its inlined critical rules, so the first screen paints and
 * the rest of the page draws blank. The head script raises
 * `speedway146:page-incomplete`, and sets a flag for the render-blocking case
 * that fails before this module is reached, so either way the reader gets the
 * notice and the button that fetches the current build.
 *
 * Where no reload is available the rejection is rethrown and reports as it
 * always did. Where the reload is taken nothing is reported, which is the
 * same trade the route chunks already make: a failure that healed itself
 * describes a deploy the visitor walked into, or a phone changing cell,
 * rather than a defect in the site.
 */
const bootScript = (src) =>
  [
    `const boot=${JSON.stringify(src)},MARK="speedway146:boot-refresh",NOTICE=${JSON.stringify(NOTICE_ID)};`,
    `const stored=()=>{try{return sessionStorage.getItem(MARK)}catch{return undefined}};`,
    `const held=()=>{try{return(history.state||{})[MARK]||null}catch{return undefined}};`,
    `const reloaded=()=>{try{return performance.getEntriesByType("navigation")[0].type==="reload"}catch{return true}};`,
    `const spent=()=>{const s=stored();if(s!==undefined)return s===boot;const h=held();return h===undefined?reloaded():h===boot};`,
    `const hold=()=>{try{history.replaceState(Object.assign({},history.state,{[MARK]:boot}),"");return held()===boot}catch{return false}};`,
    `const spend=()=>{let ok=hold();try{sessionStorage.setItem(MARK,boot);ok=true}catch{}return ok};`,
    `const release=()=>{try{if(stored()===boot)sessionStorage.removeItem(MARK)}catch{}try{if(held()===boot){const s=Object.assign({},history.state);delete s[MARK];history.replaceState(s,"")}}catch{}};`,
    `const stall=()=>{try{const n=document.getElementById(NOTICE);if(!n)return;const b=n.querySelector("button");if(b)b.addEventListener("click",()=>{b.disabled=true;location.reload()});n.style.display="flex";if(b)b.focus({preventScroll:true})}catch{}};`,
    `addEventListener("speedway146:page-incomplete",stall);`,
    `if(window.__speedway146Incomplete)stall();`,
    `requestAnimationFrame(()=>requestAnimationFrame(()=>{import(boot).then(release,(error)=>{if(spent()||(!spend()&&reloaded())){stall();throw error}location.reload()})}));`,
  ].join("");

/*
 * What the reader is left holding when the reload is already gone.
 *
 * Every allowance above is one reload, and that is deliberate: a second one
 * over a file that will never arrive is a loop. So the last failure on a
 * build has nowhere to go and the rejection is rethrown, which reports it and
 * nothing else. The reader's half of that moment had never been written. A
 * prerendered route is a finished, painted page, so what they are looking at
 * is a site that appears entirely normal and answers nothing - the menu does
 * not open, the pricing does not expand, the booking does not start - with no
 * error boundary over it, because the boundary is in the code that did not
 * arrive. There is nothing in the page to tell them, and nothing to press.
 *
 * The one thing that is certainly there is the document, so the notice lives
 * in the document: markup the prerender writes, carrying its own colours and
 * type in a style attribute, revealed by the boot and by nothing else. It
 * asks the stylesheet for the site's tokens and names a plain fallback for
 * each, so it reads correctly whether or not the sheet landed, and it needs
 * no script of its own - the boot is what binds the button, and the boot has
 * already run by the time anyone can see it.
 *
 * A reload is the only thing the button can usefully do and it is the right
 * thing: the document is served must-revalidate, so a fresh one pins the
 * current build and brings a clean module map with it. The allowance stays
 * spent, so nothing reloads on its own behind the reader's back; the loop the
 * allowance exists to prevent needs a deliberate press each time round.
 *
 * The rejection is still reported, unchanged. This says what happened to the
 * reader; it does not stop the site saying it to us.
 */
const NOTICE_ID = "boot-incomplete";

const NOTICE_STYLE = [
  "display:none",
  "position:fixed",
  "left:0",
  "right:0",
  "bottom:0",
  "z-index:2147483647",
  "flex-wrap:wrap",
  "gap:0.75rem 1rem",
  "align-items:center",
  "justify-content:center",
  "padding:1rem 1.25rem",
  "background:var(--color-asphalt-900,#0e0f12)",
  "border-top:2px solid var(--color-race-500,#e11d2a)",
  "color:var(--color-asphalt-50,#f4f5f8)",
  "font:400 1rem/1.45 Barlow,system-ui,-apple-system,Segoe UI,sans-serif",
  "text-align:center",
].join(";");

const NOTICE_BUTTON_STYLE = [
  "flex:none",
  "padding:0.625rem 1.25rem",
  "border:0",
  "border-radius:0.25rem",
  "background:var(--color-race-500,#e11d2a)",
  "color:#fff",
  "font:600 0.875rem/1 Barlow,system-ui,-apple-system,Segoe UI,sans-serif",
  "letter-spacing:0.08em",
  "text-transform:uppercase",
  "cursor:pointer",
].join(";");

const notice = [
  `<div id="${NOTICE_ID}" role="alert" style="${NOTICE_STYLE}">`,
  `<span>This page did not finish loading.</span>`,
  `<button type="button" style="${NOTICE_BUTTON_STYLE}">Try Again</button>`,
  `</div>`,
].join("");

function offerRetry(html) {
  if (!html.includes("</body>"))
    throw new Error("the shell has no closing body for the notice");
  return html.replace("</body>", `  ${notice}\n  </body>`);
}

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
  const rendered = paintFirst(offerRetry(applyHead(shell, head))).replace(
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
