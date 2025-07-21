import React from "react";
import logger from "../utils/logger.tsx";

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>> {
  state = { hasError: false };

  static getDerivedStateFromError(_: any) {
    return { hasError: true };
  }

  // This lifecycle method is called when an error is thrown in a child component
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>Please try refreshing the page or come back later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
