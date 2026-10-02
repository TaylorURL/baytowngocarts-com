import { useState } from "react";
import { srcSet } from "../../lib/images.js";
import {
  PHOTO_ATTEMPTS,
  announceRecovered,
  retrySrcSet,
} from "../../lib/photoRecovery.js";

/*
 * A photograph with somewhere to go when its file does not arrive.
 *
 * Every photograph outside the hero was a plain element: one request, and a
 * tile left on its placeholder for the rest of the visit if that request was
 * lost. The hero grew a retry; nothing else did, and the hero holds five of
 * the site's photographs while the gallery, the party panel and the
 * attractions cards hold the rest.
 *
 * A photograph that misses twice is taken out rather than left showing a
 * broken element, and the box it sat in keeps its placeholder.
 */
const Photo = ({ src, width, height, ...rest }) => {
  const [misses, setMisses] = useState(0);
  if (misses >= PHOTO_ATTEMPTS) return null;
  const set = srcSet(src, width);
  return (
    /* The attempt is part of the key, so a retry is a new element with a new
       request rather than the same one being asked to try again. */
    <img
      {...rest}
      key={misses}
      src={misses ? `${src}?attempt=${misses}` : src}
      srcSet={misses ? retrySrcSet(set, misses) : set}
      width={width}
      height={height}
      onError={() => setMisses((n) => (n >= PHOTO_ATTEMPTS ? n : n + 1))}
      onLoad={
        misses
          ? (event) => announceRecovered(event.currentTarget.currentSrc || src)
          : undefined
      }
    />
  );
};

export default Photo;
