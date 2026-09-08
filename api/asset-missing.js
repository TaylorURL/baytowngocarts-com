// Every file under /assets carries a content hash, so a request for one the
// deployment does not have is a document from an older build asking for the
// bundle it was compiled against. Vercel checks the filesystem before it
// applies a rewrite, so a real asset never reaches this handler and only the
// misses do.
//
// What those misses were answered with was the prerendered 404 document: the
// right status, but under the `/assets/(.*)` header rule, which stamps
// `max-age=31536000, immutable` on whatever it matches without regard for the
// status. A browser that recorded one kept it for a year and replayed it from
// disk on every later visit, so a single miss - an edge that had not yet
// propagated a deploy, a connection that dropped mid-request - became a
// permanent failure against a file the host serves perfectly well.
//
// A negative answer is never cacheable, so this one says so itself. A handler's
// own header wins over the static rule, which is what lets the immutable one
// stay where it belongs: on the hits.
export default function handler(request, response) {
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.status(404).send("Not found");
}
