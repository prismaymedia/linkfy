import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule as NestPrometheusModule } from '@willsoto/nestjs-prometheus';
import {
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';
import { MetricsInterceptor } from './metrics.interceptor';

// Define metric providers as constants so they can be exported
const httpRequestsCounter = makeCounterProvider({
  name: 'linkfy_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestDuration = makeHistogramProvider({
  name: 'linkfy_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const externalApiCallsCounter = makeCounterProvider({
  name: 'linkfy_external_api_calls_total',
  help: 'Total number of external API calls',
  labelNames: ['service', 'status'],
});

const linkConversionsCounter = makeCounterProvider({
  name: 'linkfy_link_conversions_total',
  help: 'Total number of link conversions',
  labelNames: ['source_platform', 'target_platform', 'success'],
});

const apiEndpointUsageCounter = makeCounterProvider({
  name: 'linkfy_api_endpoint_usage_total',
  help: 'Public API endpoint usage for billing',
  labelNames: ['endpoint', 'api_key', 'plan_tier'],
});

@Module({
  imports: [
    NestPrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
      path: '/metrics',
      defaultLabels: {
        app: 'linkfy-api',
        environment: process.env.NODE_ENV || 'development',
      },
    }),
  ],
  providers: [
    httpRequestsCounter,
    httpRequestDuration,
    externalApiCallsCounter,
    linkConversionsCounter,
    apiEndpointUsageCounter,
    MetricsInterceptor,
  ],
  exports: [
    NestPrometheusModule,
    httpRequestsCounter,
    httpRequestDuration,
    externalApiCallsCounter,
    linkConversionsCounter,
    apiEndpointUsageCounter,
    MetricsInterceptor,
  ],
})
export class PrometheusModule {}
