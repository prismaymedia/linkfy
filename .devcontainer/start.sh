#!/bin/bash

echo "🚀 Starting Linkfy development servers..."

# Check if .env files exist and warn if not configured
if grep -q "your-youtube-api-key-here" server/.env 2>/dev/null; then
  echo "⚠️  Warning: server/.env still contains placeholder values"
  echo "   Please configure your API keys in server/.env"
fi

if grep -q "your-backend-api-url-here" client/.env 2>/dev/null; then
  echo "⚠️  Warning: client/.env still contains placeholder values"
  echo "   Please configure your settings in client/.env"
fi

echo ""
echo "🔧 Starting development servers..."
echo "   Frontend will be available at: http://localhost:5173"
echo "   Backend will be available at: http://localhost:3000"
echo ""
echo "💡 Tip: You can view logs in the terminal or use VS Code's built-in terminal"
echo ""

# Start both servers in the background
# Note: In a real Codespace, these will run in the terminal
# Users can manually start them if needed with:
# yarn dev:client & yarn dev:server
