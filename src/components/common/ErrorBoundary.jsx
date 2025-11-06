import { Component } from 'react';
import { Button, Result } from 'antd';

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree
 * Logs errors and displays a fallback UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console or error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // You can also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      const { fallback } = this.props;
      
      if (fallback) {
        return fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Result
            status="error"
            title="Oops! Something went wrong"
            subTitle="We're sorry for the inconvenience. Please try again."
            extra={[
              <Button 
                type="primary" 
                key="home"
                onClick={() => window.location.href = '/home'}
              >
                Go Home
              </Button>,
              <Button 
                key="retry"
                onClick={this.handleReset}
              >
                Try Again
              </Button>,
            ]}
          >
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-4 p-4 bg-gray-100 rounded text-left">
                <p className="font-semibold text-sm text-gray-700 mb-2">
                  Error Details (Development Only):
                </p>
                <pre className="text-xs text-red-600 overflow-auto">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="text-xs text-gray-600 overflow-auto mt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
