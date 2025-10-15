#!/bin/bash

echo "🔧 Setting up Grafana Cloud integration..."

# Check if API token is set
if [ -z "$GRAFANA_API_TOKEN" ]; then
    echo "❌ Error: GRAFANA_API_TOKEN not set"
    echo "Please generate a token at: https://grafana.com/orgs/yourorg/api-keys"
    echo "Then add it to server/.env file"
    exit 1
fi

# Test connection
echo "🧪 Testing Grafana Cloud connection..."
curl -X POST \
  -H "Content-Type: text/plain" \
  -u "2725749:$GRAFANA_API_TOKEN" \
  https://prometheus-prod-56-prod-us-east-2.grafana.net/api/prom/push \
  --data-binary @- << EOF
# TYPE test_metric counter
test_metric{service="linkfy"} 1
EOF

if [ $? -eq 0 ]; then
    echo "✅ Grafana Cloud connection successful!"
    echo ""
    echo "📊 Next steps:"
    echo "1. Start your NestJS server: npm run nest:start"
    echo "2. Access metrics locally: http://localhost:3000/metrics"
    echo "3. Metrics will be pushed to Grafana Cloud automatically"
    echo "4. Create dashboards at: https://grafana.com/grafana/dashboards"
else
    echo "❌ Connection failed. Please check your credentials."
    exit 1
fi
