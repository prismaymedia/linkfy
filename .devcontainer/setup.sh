#!/bin/bash
set -e

echo "🚀 Setting up Linkfy development environment..."

# Install uv (fast Python package manager)
echo "🐍 Installing uv (Python package manager)..."
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.cargo/bin:$PATH"
echo "✅ uv installed successfully"

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Setup environment files
echo "🔧 Setting up environment files..."

# Copy server .env.example to .env if it doesn't exist
if [ ! -f server/.env ]; then
  cp server/.env.example server/.env
  echo "✅ Created server/.env from .env.example"
  echo "⚠️  Please update server/.env with your actual API keys"
else
  echo "ℹ️  server/.env already exists"
fi

# Copy client .env.example to .env if it doesn't exist
if [ ! -f client/.env ]; then
  cp client/.env.example client/.env
  echo "✅ Created client/.env from .env.example"
  echo "⚠️  Please update client/.env with your actual configuration"
else
  echo "ℹ️  client/.env already exists"
fi

# Print instructions
echo ""
echo "📝 Setup complete! Next steps:"
echo "   1. Update server/.env with your YouTube and Spotify API keys"
echo "   2. Update client/.env with your backend API URL and Supabase credentials"
echo "   3. The development servers will start automatically"
echo ""
echo "🔗 Ports:"
echo "   - Frontend (Vite): http://localhost:5173"
echo "   - Backend (NestJS): http://localhost:3000"
echo ""
echo "📚 Useful commands:"
echo "   - yarn dev:client     # Start frontend only"
echo "   - yarn dev:server     # Start backend only"
echo "   - yarn test:client    # Run frontend tests"
echo "   - yarn test:server    # Run backend tests"
echo "   - yarn lint           # Lint all workspaces"
echo ""
