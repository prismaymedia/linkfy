import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('linkfy_http_requests_total')
    private readonly requestCounter: Counter<string>,
    @InjectMetric('linkfy_http_request_duration_seconds')
    private readonly requestDuration: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, route } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;
          const duration = (Date.now() - startTime) / 1000;

          this.requestCounter.inc({
            method,
            route: route?.path || request.url,
            status_code: statusCode.toString(),
          });

          this.requestDuration.observe(
            {
              method,
              route: route?.path || request.url,
              status_code: statusCode.toString(),
            },
            duration,
          );
        },
        error: (error) => {
          const statusCode = error.status || 500;
          const duration = (Date.now() - startTime) / 1000;

          this.requestCounter.inc({
            method,
            route: route?.path || request.url,
            status_code: statusCode.toString(),
          });

          this.requestDuration.observe(
            {
              method,
              route: route?.path || request.url,
              status_code: statusCode.toString(),
            },
            duration,
          );
        },
      }),
    );
  }
}
