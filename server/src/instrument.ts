import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: process.env.DNS,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 0.2,
  sendDefaultPii: false,
});

process.on('unhandledRejection', (reason) => {
  try {
    Sentry.captureException(reason as any);
  } catch (e) { }
});
process.on('uncaughtException', (err) => {
  try {
    Sentry.captureException(err as any);
  } catch (e) { }
});

if (process.env.NODE_ENV !== 'production') console.log('Sentry initialized (server/src/instrument.ts)');
