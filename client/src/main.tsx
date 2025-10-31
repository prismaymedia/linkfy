import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';

import { Router } from 'wouter';
import * as Sentry from '@sentry/react';

// Initialize Sentry with error handling
// If Sentry DSN is not configured or fails to initialize, the app will continue to run
try {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      tracesSampleRate: 0.2,
      sendDefaultPii: false,
    });
  }
} catch (error) {
  // Silently fail - Sentry is optional
  console.warn('Failed to initialize Sentry:', error);
}

createRoot(document.getElementById('root')!).render(
  <Router base="/">
    <Sentry.ErrorBoundary fallback={<div>Something went wrong</div>}>
      <App />
    </Sentry.ErrorBoundary>
  </Router>,
);
