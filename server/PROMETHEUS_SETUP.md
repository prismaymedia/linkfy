# 🚀 Quick Setup Guide - Prometheus & Grafana Cloud Integration

## ✅ What's Already Done

1. ✅ Prometheus packages installed (`@willsoto/nestjs-prometheus`, `prom-client`)
2. ✅ Grafana Cloud credentials configured in `.env`
3. ✅ Prometheus module created with metrics providers
4. ✅ Metrics interceptor for automatic HTTP tracking
5. ✅ Integration with NestJS app module
6. ✅ Prometheus configuration for Grafana Cloud remote write

## 🔑 Required: Generate API Token

**IMPORTANT**: You need to generate a Grafana Cloud API token:

1. Go to: https://grafana.com/orgs/yourorg/api-keys
2. Click "Generate now" or "Create API Key"
3. Name: `linkfy-prometheus`
4. Role: `MetricsPublisher`
5. Copy the token

## ⚙️ Configuration

Update `server/.env`:

```bash
# Replace 'your_generated_api_token_here' with your actual token
GRAFANA_API_TOKEN=your_actual_token_from_grafana_cloud
```

Your Grafana Cloud instance details (already configured):
- Username: `2725749`
- Push URL: `https://prometheus-prod-56-prod-us-east-2.grafana.net/api/prom/push`
- Query URL: `https://prometheus-prod-56-prod-us-east-2.grafana.net/api/prom`

## 🧪 Test Connection

```bash
cd server
export GRAFANA_API_TOKEN=your_token
chmod +x scripts/setup-grafana.sh
./scripts/setup-grafana.sh
```

## 🚀 Start the Server

```bash
# From server directory
npm run nest:start

# Or from root
npm run start:server
```

## 📊 Access Metrics

### Local Endpoint
```bash
curl http://localhost:3000/metrics
```

### Available Metrics
- `linkfy_http_requests_total` - HTTP requests by method, route, status
- `linkfy_http_request_duration_seconds` - Request duration histogram
- `linkfy_link_conversions_total` - Link conversions by platform
- `linkfy_external_api_calls_total` - External API calls (YouTube, Spotify)
- `linkfy_api_endpoint_usage_total` - API usage for monetization
- Plus default Node.js metrics (memory, CPU, etc.)

## 🎨 Import Dashboard

1. Go to your Grafana Cloud instance
2. Navigate to Dashboards → Import
3. Upload: `server/grafana/dashboards/linkfy-dashboard.json`
4. Select Prometheus data source

## 🐳 Local Development (Optional)

For local Prometheus + Grafana setup:

```bash
cd server
docker-compose -f docker-compose.metrics.yml up -d
```

Access:
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)

## 📈 Query Examples

In Grafana Explore or Dashboard:

```promql
# Request rate per second
rate(linkfy_http_requests_total[5m])

# 95th percentile response time
histogram_quantile(0.95, rate(linkfy_http_request_duration_seconds_bucket[5m]))

# Conversion success rate
rate(linkfy_link_conversions_total{success="true"}[5m]) / rate(linkfy_link_conversions_total[5m])

# External API success rate
rate(linkfy_external_api_calls_total{status="success"}[5m]) / rate(linkfy_external_api_calls_total[5m])
```

## 🔍 Troubleshooting

### Metrics not showing in Grafana Cloud

1. **Check token is set**:
   ```bash
   echo $GRAFANA_API_TOKEN
   ```

2. **Verify metrics endpoint**:
   ```bash
   curl http://localhost:3000/metrics
   ```

3. **Test connection**:
   ```bash
   ./scripts/setup-grafana.sh
   ```

### Server won't start

Check for compilation errors:
```bash
cd server
npm run nest:build
```

## 📚 Documentation

- Full setup guide: `docs/GRAFANA_SETUP.md`
- Dashboard JSON: `grafana/dashboards/linkfy-dashboard.json`
- Prometheus config: `prometheus.yml`

## 🎯 Next Steps

1. Generate and add your Grafana API token to `.env`
2. Start the server
3. Verify metrics at `/metrics` endpoint
4. Import dashboard in Grafana Cloud
5. Set up alerts for error rates and latency

---

**Questions?** Check `docs/GRAFANA_SETUP.md` for detailed documentation.
