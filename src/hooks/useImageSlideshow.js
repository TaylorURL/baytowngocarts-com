import { useEffect, useState } from "react";
/**
 * Cycles through an array of images on a timed interval.
 * @param {Array} images - The list of image sources to cycle through.
 * @param {number} intervalMs - Milliseconds between each slide transition.
 * @returns {[number, Function]} The current image index and a setter to override it.
 */
const useImageSlideshow = (images, intervalMs) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (!intervalMs || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [images.length, intervalMs]);
  return [currentIndex, setCurrentIndex];
};
export default useImageSlideshow;
