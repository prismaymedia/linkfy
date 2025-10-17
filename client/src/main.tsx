import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';

import { Router } from 'wouter';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://002a8e60e60a3ccf12fc65778c1bf56b@o4509986795356160.ingest.us.sentry.io/4509986800533504',
  tracesSampleRate: 0.2,
  sendDefaultPii: false,
});

createRoot(document.getElementById('root')!).render(
  <Router base="/">
    <Sentry.ErrorBoundary fallback={<div>Something went wrong</div>}>
      <App />
    </Sentry.ErrorBoundary>
  </Router>,
);
