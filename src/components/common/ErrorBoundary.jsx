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
// Last line of defence: without this a render error takes the whole page to
// blank white.
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
