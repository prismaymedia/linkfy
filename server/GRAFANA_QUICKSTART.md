# 🚀 Grafana Cloud - Quick Reference

## 📋 Your Credentials

```
Instance ID: 2725749
Push URL:    https://prometheus-prod-56-prod-us-east-2.grafana.net/api/prom/push
Query URL:   https://prometheus-prod-56-prod-us-east-2.grafana.net/api/prom
```

## ⚠️ REQUIRED: Generate API Token

1. 🔗 Visit: https://grafana.com/orgs/yourorg/api-keys
2. ➕ Click "Generate now"
3. 📝 Name: `linkfy-prometheus`
4. 🔐 Role: `MetricsPublisher`
5. 📋 Copy token
6. ✏️ Update `server/.env`:
   ```bash
   GRAFANA_API_TOKEN=your_actual_token_here
   ```

## 🧪 Quick Test

```bash
cd server
export GRAFANA_API_TOKEN=your_token
./scripts/setup-grafana.sh
```

## 🚀 Start & Verify

```bash
# Start server
npm run nest:start

# Check metrics
curl http://localhost:3000/metrics
```

## 📊 Import Dashboard

1. Go to Grafana Cloud
2. Dashboards → Import  
3. Upload: `server/grafana/dashboards/linkfy-dashboard.json`

## 📚 Docs

- Quick Start: `PROMETHEUS_SETUP.md`
- Full Guide: `docs/GRAFANA_SETUP.md`
- Summary: `INTEGRATION_COMPLETE.md`

---

**That's it!** Add your token and you're ready to monitor 🎉
