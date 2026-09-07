/*
 * Where the head of the route being rendered is left for the build to pick up.
 *
 * The build-time render produces markup and nothing else, and a route's title,
 * description, canonical and structured data are decided by the page rather
 * than by the path. RouteMeta leaves its computed head here as it renders, so
 * the prerender step can write the same head into the same document.
 */
let current = null;

export function recordHead(head) {
  current = head;
}

export function takeHead() {
  const head = current;
  current = null;
  return head;
}
