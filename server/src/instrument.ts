import * as Sentry from "@sentry/nestjs";

Sentry.init({
    dsn: "https://10a3a29c84717120cd36f2760a84f9fd@o4509991418920960.ingest.us.sentry.io/4509991425409024",
    integrations: [
        // send console.log, console.warn, and console.error calls as logs to Sentry
        Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    ],
    // Enable logs to be sent to Sentry
    enableLogs: true,
});

Sentry.setUser({
    email: "user@example.com",
});

Sentry.logger.info('User triggered test log', { action: 'test_log' });