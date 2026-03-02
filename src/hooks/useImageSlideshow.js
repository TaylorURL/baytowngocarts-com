import { useEffect, useState } from "react";

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
