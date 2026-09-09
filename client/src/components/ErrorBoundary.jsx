import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message ?? String(error) };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, message: null });
    if (this.props.resetKey !== undefined) this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-void p-6">
          <div className="w-full max-w-md rounded-2xl border border-panel-line bg-panel p-8 text-center">
            <p className="font-display text-xl font-bold text-ink-primary">Something went wrong</p>
            <p className="mt-2 text-sm text-ink-muted">
              This part of the app hit an unexpected error. It has been contained so the rest of the app keeps working.
            </p>
            {this.state.message && (
              <pre className="mt-4 overflow-x-auto rounded-lg bg-void/60 p-3 text-left font-mono text-xs text-red-300">
                {this.state.message}
              </pre>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-arcane-purple px-4 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-arcane-violet"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
