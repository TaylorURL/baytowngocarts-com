import { Component } from "react";
const DefaultFallback = () => (
  <div className="min-h-dvh flex items-center justify-center bg-chalk px-6 text-center">
    <div className="max-w-md">
      <h1 className="text-4xl font-display tracking-wide text-asphalt-900 mb-3">
        Something Went Wrong
      </h1>
      <p className="text-asphalt-600 mb-6">
        An unexpected error occurred. Please refresh the page or try again.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="font-display tracking-speedway uppercase bg-race-600 hover:bg-race-500 text-chalk px-6 py-3 rounded-md button-hover"
      >
        Reload Page
      </button>
    </div>
  </div>
);
/*
 * A node React wrote and then could not find again is not a fault in the
 * render that follows it. The browser's own page translation rewrites the
 * text of a document and moves the inline elements standing in it, and an
 * extension, an in-app host or a carrier proxy does the same; the next update
 * then asks for a node the tree no longer holds and the commit throws
 * NotFoundError or HierarchyRequestError from insertBefore or removeChild.
 * The page itself is correct - it is the document underneath it that moved -
 * so the tree is worth drawing once more from nothing rather than handing a
 * reader an error screen over a page that had loaded and was working.
 *
 * The retry is offered by whoever mounted the root, once per page: a second
 * attempt against a document something is still rewriting would draw and
 * throw and draw again for as long as the tab is open, and the fallback is
 * the better end to that.
 */
const DETACHED = /^(NotFoundError|HierarchyRequestError)$/;
const isDetachedNode = (error) =>
  !!error && (DETACHED.test(error.name || "") || DETACHED.test(String(error)));

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    const { onDetached } = this.props;
    if (!onDetached || !isDetachedNode(error)) return;
    // Out of the commit that is still unwinding: the root cannot be replaced
    // from inside its own lifecycle.
    setTimeout(onDetached, 0);
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? <DefaultFallback />;
    return this.props.children;
  }
}
export default ErrorBoundary;
