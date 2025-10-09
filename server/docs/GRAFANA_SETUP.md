# Grafana Cloud Integration - Setup Guide

## 📋 Overview

This guide explains how to integrate Linkfy with Grafana Cloud for metrics monitoring using Prometheus.

## 🔑 Credentials

Your Grafana Cloud instance:
- **Username/Instance ID**: `2725749`
- **Push URL**: `https://prometheus-prod-56-prod-us-east-2.grafana.net/api/prom/push`
- **Query URL**: `https://prometheus-prod-56-prod-us-east-2.grafana.net/api/prom`

## 🚀 Setup Steps

### 1. Generate API Token

1. Go to [Grafana Cloud API Keys](https://grafana.com/orgs/yourorg/api-keys)
2. Click "Generate now" or "Create API Key"
3. Give it a name: `linkfy-prometheus`
4. Set role: `MetricsPublisher`
5. Copy the generated token

### 2. Configure Environment

Add the token to `server/.env`:

```bash
GRAFANA_API_TOKEN=your_generated_token_here
```

### 3. Test Connection

```bash
cd server
chmod +x scripts/setup-grafana.sh
export GRAFANA_API_TOKEN=your_token
./scripts/setup-grafana.sh
```

### 4. Start the Server

```bash
npm run nest:start
```

The metrics endpoint will be available at: `http://localhost:3000/metrics`

## 📊 Available Metrics

### HTTP Metrics
- `linkfy_http_requests_total` - Total HTTP requests by method, route, and status code
- `linkfy_http_request_duration_seconds` - Request duration histogram

### Business Metrics
- `linkfy_link_conversions_total` - Link conversions by platform and success status
- `linkfy_external_api_calls_total` - External API calls (YouTube, Spotify) by status
- `linkfy_api_endpoint_usage_total` - Public API usage for monetization tracking

### System Metrics (default)
- Node.js process metrics
- Memory usage
- CPU usage
- Event loop lag

## 🔍 Viewing Metrics

### Local Development
```bash
curl http://localhost:3000/metrics
```

### Grafana Cloud
1. Go to your Grafana Cloud instance
2. Navigate to Explore
3. Select Prometheus data source
4. Query examples:
   ```promql
   # Request rate
   rate(linkfy_http_requests_total[5m])
   
   # 95th percentile response time
   histogram_quantile(0.95, rate(linkfy_http_request_duration_seconds_bucket[5m]))
   
   # Conversion success rate
   rate(linkfy_link_conversions_total{success="true"}[5m]) / rate(linkfy_link_conversions_total[5m])
   ```

## 📈 Creating Dashboards

### Import Pre-built Dashboard

1. Go to Dashboards → Import
2. Use the JSON from `server/grafana/dashboards/linkfy-dashboard.json`
3. Select your Prometheus data source

### Key Panels to Include

1. **Request Rate** - `rate(linkfy_http_requests_total[5m])`
2. **Response Time** - `histogram_quantile(0.95, rate(linkfy_http_request_duration_seconds_bucket[5m]))`
3. **Error Rate** - `rate(linkfy_http_requests_total{status_code=~"5.."}[5m])`
4. **Conversion Rate** - By platform pair
5. **API Success Rate** - External API reliability
6. **API Usage** - For billing/monetization

## 🐳 Docker Setup (Optional)

For local Prometheus + Grafana:

```bash
docker-compose -f docker-compose.metrics.yml up -d
```

Access:
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001` (admin/admin)

## 🔧 Troubleshooting

### Metrics not appearing in Grafana Cloud

1. Check token is valid:
   ```bash
   ./scripts/setup-grafana.sh
   ```

2. Verify server is running and exposing metrics:
   ```bash
   curl http://localhost:3000/metrics
   ```

3. Check Prometheus remote_write config:
   ```bash
   cat prometheus.yml
   ```

### High cardinality warnings

If you see warnings about too many unique label combinations:
- Avoid using dynamic values (like user IDs) in labels
- Use `api_key` label sparingly
- Aggregate data before creating metrics

## 📝 Best Practices

1. **Label Cardinality**: Keep labels low-cardinality (< 1000 unique values)
2. **Metric Naming**: Use `linkfy_` prefix for all custom metrics
3. **Histogram Buckets**: Adjust based on your actual latency patterns
4. **Retention**: Grafana Cloud free tier keeps 14 days of metrics
5. **Alerting**: Set up alerts for error rates, high latency, API failures

## 🔗 Useful Links

- [Grafana Cloud Console](https://grafana.com/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [PromQL Guide](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)
