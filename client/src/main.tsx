import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';

import { Router } from 'wouter';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  sendDefaultPii: true,
});

createRoot(document.getElementById('root')!).render(
  <Router base={import.meta.env.DEV ? '/' : '/linkfy'}>
    <App />
  </Router>,
);
