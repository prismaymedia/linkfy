#!/bin/bash

# 🚀 Vercel Setup Helper Script
# This script helps you set up Vercel deployment for Linkfy

set -e

echo "🚀 Linkfy - Vercel Setup Helper"
echo "================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found!"
    echo "📦 Installing Vercel CLI globally..."
    npm install -g vercel
    echo "✅ Vercel CLI installed successfully!"
else
    echo "✅ Vercel CLI found!"
fi

echo ""
echo "🔐 Step 1: Login to Vercel"
echo "================================"
echo "Please login to your Vercel account..."
vercel login

echo ""
echo "📦 Step 2: Link Client Project"
echo "================================"
cd client
echo "Linking client project to Vercel..."
vercel link --yes

echo ""
echo "Please copy the following values:"
echo "-----------------------------------"
echo "1. Vercel Org ID (from .vercel/project.json)"
echo "2. Vercel Project ID (from .vercel/project.json)"
echo ""
read -p "Press Enter to continue..."

if [ -f ".vercel/project.json" ]; then
    echo ""
    echo "📋 Client Project Details:"
    cat .vercel/project.json
    echo ""
fi

cd ..

echo ""
echo "📦 Step 3: Link Server Project"
echo "================================"
cd server
echo "Linking server project to Vercel..."
vercel link --yes

echo ""
echo "Please copy the following values:"
echo "-----------------------------------"
echo "1. Vercel Project ID (from .vercel/project.json)"
echo ""
read -p "Press Enter to continue..."

if [ -f ".vercel/project.json" ]; then
    echo ""
    echo "📋 Server Project Details:"
    cat .vercel/project.json
    echo ""
fi

cd ..

echo ""
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "🔑 Next Steps:"
echo "1. Go to https://vercel.com/account/tokens to create an API token"
echo "2. Add the following secrets to your GitHub repository:"
echo "   - VERCEL_TOKEN (from step 1)"
echo "   - VERCEL_ORG_ID (from client/.vercel/project.json)"
echo "   - VERCEL_PROJECT_ID_CLIENT (from client/.vercel/project.json)"
echo "   - VERCEL_PROJECT_ID_SERVER (from server/.vercel/project.json)"
echo ""
echo "3. Configure environment variables in Vercel dashboard:"
echo "   - Client: https://vercel.com/[your-org]/linkfy-client/settings/environment-variables"
echo "   - Server: https://vercel.com/[your-org]/linkfy-server/settings/environment-variables"
echo ""
echo "4. Read the full deployment guide:"
echo "   📖 docs/VERCEL_DEPLOYMENT.md"
echo ""
echo "Happy deploying! 🚀"
