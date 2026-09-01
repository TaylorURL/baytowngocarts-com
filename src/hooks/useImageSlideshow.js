import { useEffect, useState } from "react";
import { whenSettled } from "../lib/idle.js";
/**
 * The rotation begins once the page has arrived. A frame swapped behind the
 * headline while the rest of the document is still landing repaints the
 * largest thing on screen in the middle of the arrival, and the reader who has
 * not finished the first frame is the one it is taken from.
 *
 * @param {Array} images - image sources to cycle through
 * @param {number} intervalMs - milliseconds between slides
 * @returns {[number, Function]} current index, plus a setter to override it
 */
const useImageSlideshow = (images, intervalMs) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (!intervalMs || images.length <= 1) return;
    let interval;
    const cancel = whenSettled(() => {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, intervalMs);
    }, intervalMs);
    return () => {
      cancel();
      clearInterval(interval);
    };
  }, [images.length, intervalMs]);
  return [currentIndex, setCurrentIndex];
};
export default useImageSlideshow;
