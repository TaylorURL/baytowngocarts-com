import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// Renders nothing. It sits in the Router tree for its side effect alone.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Focus follows the reader to the new page, so a screen reader is not left
    // at the top of chrome it has already read.
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}
