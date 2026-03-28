import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'left' }}>
          <h3 style={{ color: 'var(--status-rejected-text)', marginBottom: '1rem' }}>Component Crashed</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>We couldn't load this section properly because of an internal error.</p>
          <pre style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '1rem', color: '#ff8a8a', overflowX: 'auto', fontSize: '12px' }}>
            {this.state.error && this.state.error.toString()}
            <br/><br/>
            {this.state.error && this.state.error.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
