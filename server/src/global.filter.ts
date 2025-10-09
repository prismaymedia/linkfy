import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryExceptionCaptured } from '@sentry/nestjs';

@Catch()
export class YourCatchAllExceptionFilter implements ExceptionFilter {
  @SentryExceptionCaptured()
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    // Attach some non-PII user/context if available on the request
    try {
      const user = req?.user;
      if (user) {
        Sentry.setUser({ id: user.id, username: user.email ? user.email.split('@')[0] : undefined });
      }
      Sentry.setContext('request', {
        url: req?.originalUrl,
        method: req?.method,
        params: req?.params,
      });
    } catch (e) {
      // ignore context setting failures
    }

    // Capture exception in Sentry
    Sentry.captureException(exception);

    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception instanceof HttpException ? (exception.getResponse() as any)?.message ?? exception.message : 'Internal Server Error';
    res.status(status).json({ message });
  }
}
