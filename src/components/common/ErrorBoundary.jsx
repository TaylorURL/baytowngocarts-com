import { Component } from "react";
/** On-brand fallback shown when a render error is caught. */
const DefaultFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 text-center">
    <div className="max-w-md">
      <h1 className="text-4xl font-display tracking-wide text-gray-800 mb-3">
        Something Went Wrong
      </h1>
      <p className="text-gray-600 mb-6">
        An unexpected error occurred. Please refresh the page or try again.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="font-display tracking-wide bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg button-hover"
      >
        Reload Page
      </button>
    </div>
  </div>
);
/**
 * Top-level React error boundary. Captures render errors in the component
 * tree and renders a fallback instead of crashing to a blank page.
 */
class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? <DefaultFallback />;
    return this.props.children;
  }
}
export default ErrorBoundary;
