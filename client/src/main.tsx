import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';

import { Router } from 'wouter';
import * as Sentry from '@sentry/react';
import { browserTracingIntegration } from '@sentry/react';

// Initialize Sentry with error handling
// If Sentry DSN is not configured or fails to initialize, the app will continue to run
try {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      // Use 1.0 for development to capture all transactions, reduce for production
      tracesSampleRate: import.meta.env.MODE === 'production' ? 0.2 : 1.0,
      sendDefaultPii: false,
      environment: import.meta.env.MODE,
      integrations: [browserTracingIntegration()],
      tracePropagationTargets: [
        'localhost',
        /^\//,
        // Match your backend API URL
        new RegExp(`^${import.meta.env.VITE_API_URL}`),
      ],
    });

    // Send a test error to Sentry only on first app load
    // This helps verify Sentry is working correctly
    if (!localStorage.getItem('sentry_test_error_sent')) {
      localStorage.setItem('sentry_test_error_sent', 'true');
      try {
        throw new Error('Sentry initialization test - First app load');
      } catch (testError) {
        Sentry.captureException(testError, {
          tags: { type: 'initialization_test' },
        });
      }
    }
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
