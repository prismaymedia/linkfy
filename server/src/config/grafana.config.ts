import { registerAs } from '@nestjs/config';

export default registerAs('grafana', () => ({
  enabled: process.env.GRAFANA_ENABLED === 'true',
  username: process.env.GRAFANA_USERNAME || '2725749',
  apiToken: process.env.GRAFANA_API_TOKEN,
  pushUrl:
    process.env.GRAFANA_PUSH_URL ||
    'https://prometheus-prod-56-prod-us-east-2.grafana.net/api/prom/push',
  queryUrl:
    process.env.GRAFANA_QUERY_URL ||
    'https://prometheus-prod-56-prod-us-east-2.grafana.net/api/prom',
}));
