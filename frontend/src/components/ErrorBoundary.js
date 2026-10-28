import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('The page crashed.', error, info?.componentStack);
  }

  componentDidUpdate(prev) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className={styles.wrap} role="alert">
        <h1>Something fell off the wall</h1>
        <p>This page hit an error. Reloading usually fixes it.</p>
        <div className={styles.actions}>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Reload the page</button>
          <a className="btn btn-quiet" href="/">Go to the gallery</a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
