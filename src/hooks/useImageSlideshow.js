import { useEffect, useState } from "react";
/**
 * @param {Array} images - image sources to cycle through
 * @param {number} intervalMs - milliseconds between slides
 * @returns {[number, Function]} current index, plus a setter to override it
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
