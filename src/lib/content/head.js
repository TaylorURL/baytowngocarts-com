import { BRAND } from "./brand.js";
import { photoSize, srcSet } from "../images.js";
import {
  SHARE_IMAGE,
  SITE_URL,
  breadcrumbSchema,
  localBusinessSchema,
  websiteSchema,
} from "./seo.js";

/** The width both heroes ask for, each painting its photograph full bleed. */
const HERO_SIZES = "100vw";

/**
 * The preload for a route's hero, described the way the element is.
 *
 * A preload naming one file commits the browser to that file, while the element
 * chooses a width from its srcset. Name only the original and a phone that
 * chooses the 960 wide derivative downloads the 1800 wide one as well and
 * paints no sooner for it. The same candidates and the same sizes on both leave
 * one file for the two of them to resolve to.
 *
 * @returns {{href: string, imagesrcset: string, imagesizes: string}|null}
 */
function heroPreload(src) {
  if (!src) return null;
  return {
    href: src,
    imagesrcset: srcSet(src, photoSize(src).width),
    imagesizes: HERO_SIZES,
  };
}

/**
 * One route's head, as data.
 *
 * The same description is applied to a live document by RouteMeta and written
 * into the prerendered HTML at build time, so what a crawler is served and what
 * a visitor's browser ends up with cannot drift apart.
 *
 * @returns {{title: string, tags: object[], graph: object[], hero: object|null}}
 */
export function routeHead(metadata, schema) {
  const { title, description, canonical, robots, openGraph, heroImage } =
    metadata;
  const url = `${SITE_URL}${canonical}`;
  const card = openGraph?.image || SHARE_IMAGE;

  return {
    title,
    /* The image the route's hero paints. The document preloads it so the
       request is in flight before the bundle has run and mounted the element
       that shows it. */
    hero: heroPreload(heroImage),
    tags: [
      { name: "description", content: description },
      { name: "robots", content: robots || "index, follow" },
      { rel: "canonical", href: url },
      { property: "og:title", content: openGraph?.title || title },
      {
        property: "og:description",
        content: openGraph?.description || description,
      },
      { property: "og:url", content: url },
      { property: "og:type", content: openGraph?.type || "website" },
      { property: "og:image", content: card },
      { property: "og:site_name", content: BRAND.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: card },
    ],
    graph: [
      websiteSchema(),
      localBusinessSchema(),
      breadcrumbSchema(metadata.crumbs),
      ...(schema || []),
    ].filter(Boolean),
  };
}

/** The selector RouteMeta reuses a tag by, and the prerender writes under. */
export function tagSelector(tag) {
  if (tag.rel) return `link[rel="${tag.rel}"]`;
  if (tag.property) return `meta[property="${tag.property}"]`;
  return `meta[name="${tag.name}"]`;
}
