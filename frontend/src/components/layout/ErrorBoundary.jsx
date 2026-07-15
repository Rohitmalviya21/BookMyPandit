import React from 'react';

// PERFORMANCE OPTIMIZATION:
// ErrorBoundary added to catch runtime JavaScript errors anywhere in their child component tree.
// Why it is used: It prevents the entire application from crashing when a single page or component throws an error.
// What problem it solves: Prevents "white screen of death" error pages, improving resilience.
// What output improvement we get: Renders a friendly fallback UI while keeping the rest of the application tree alive.
// Why modern companies use it: Production React apps use error boundaries to log client-side errors and improve fault tolerance.
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light-cream text-center px-4">
                    <h2 className="text-danger fw-bold mb-3 font-traditional">Something went wrong</h2>
                    <p className="text-muted mb-4" style={{ maxWidth: '400px' }}>
                        We encountered an unexpected error. Please try reloading the page or contact support if the issue persists.
                    </p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="btn btn-warning px-4 py-2 rounded-pill fw-bold text-white"
                        style={{ backgroundColor: '#ff9800', borderColor: '#ff9800' }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
