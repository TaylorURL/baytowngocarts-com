import { useEffect } from "react";
import { routeHead, tagSelector } from "../../lib/content/head.js";
import { recordHead } from "../../lib/content/head-sink.js";

const MANAGED = "data-route-meta";

function setTag(tag) {
  const selector = tagSelector(tag);
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(tag.rel ? "link" : "meta");
    el.setAttribute(MANAGED, "");
    document.head.appendChild(el);
  }
  Object.entries(tag).forEach(([key, value]) => el.setAttribute(key, value));
}

function setJsonLd(graph) {
  let script = document.head.querySelector(`script[${MANAGED}]`);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute(MANAGED, "");
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}

/**
 * Writes one route's head into the document.
 *
 * The build prerenders the same head into each route's HTML, so this is what
 * keeps it right after a client-side navigation, when the document that
 * arrived describes the route the visitor came in on rather than the one they
 * are looking at now.
 *
 * The metadata itself lives in the page file beside the markup it describes.
 */
const RouteMeta = ({ metadata, schema }) => {
  const head = routeHead(metadata, schema);
  recordHead(head);

  useEffect(() => {
    document.title = head.title;
    head.tags.forEach(setTag);
    setJsonLd(head.graph);
    // The head is derived from these two and nothing else.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata, schema]);

  return null;
};

export default RouteMeta;
