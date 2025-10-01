# ⚡ Vercel Deployment - Quick Start Guide

This is a condensed version of the deployment guide to get you up and running quickly.

## 🎯 5-Minute Setup

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

### Step 2: Link Projects
```bash
# Link client
cd client
vercel link
# Follow prompts, select/create "linkfy-client" project

# Link server  
cd ../server
vercel link
# Follow prompts, select/create "linkfy-server" project
```

### Step 3: Get Project IDs
```bash
# Client project ID
cat client/.vercel/project.json

# Server project ID
cat server/.vercel/project.json
```

### Step 4: Add GitHub Secrets

Go to: `https://github.com/[owner]/linkfy/settings/secrets/actions`

Add these secrets:
- `VERCEL_TOKEN` - Get from: https://vercel.com/account/tokens
- `VERCEL_ORG_ID` - From `.vercel/project.json`
- `VERCEL_PROJECT_ID_CLIENT` - From `client/.vercel/project.json`
- `VERCEL_PROJECT_ID_SERVER` - From `server/.vercel/project.json`

### Step 5: Configure Environment Variables

#### Client (linkfy-client)
Go to: `https://vercel.com/[your-org]/linkfy-client/settings/environment-variables`

Add for **Production** and **Preview**:
```env
VITE_API_URL=https://linkfy-server.vercel.app
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SENTRY_DSN=your-sentry-dsn
```

#### Server (linkfy-server)
Go to: `https://vercel.com/[your-org]/linkfy-server/settings/environment-variables`

Add for **Production**, **Preview**, and **Development**:
```env
NODE_ENV=production
PORT=3000
YOUTUBE_API_KEY=your-youtube-api-key
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=your-database-url
SENTRY_DSN=your-sentry-dsn
```

### Step 6: Test Deployment

```bash
# Open a test PR to trigger preview deployment
git checkout -b test/vercel-deployment
git commit --allow-empty -m "test: verify Vercel deployment"
git push origin test/vercel-deployment

# Create PR and check for preview URLs in comments
```

## ✅ Verification Checklist

After deployment, verify:
- [ ] PR comment appears with preview URLs
- [ ] Client preview URL loads correctly
- [ ] Server preview URL responds to API calls
- [ ] Client can communicate with server API
- [ ] Environment variables are working

## 🔍 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| No PR comment | Check GitHub Actions permissions |
| Build fails | Review build logs in Vercel dashboard |
| Env vars not working | Verify in Vercel project settings |
| CORS errors | Add client URL to server CORS_ORIGINS |

## 📚 Full Documentation

- 📖 [Complete Deployment Guide](./VERCEL_DEPLOYMENT.md)
- 📋 [Detailed Checklist](./DEPLOYMENT_CHECKLIST.md)
- 🔧 [Setup Script](../scripts/setup-vercel.sh)
- 📋 [Environment Variables Template](../.env.vercel.example)

## 🆘 Need Help?

1. Check [Troubleshooting Guide](./VERCEL_DEPLOYMENT.md#-troubleshooting)
2. Review [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
3. Open an issue on GitHub
4. Contact the maintainers

---

**Time to complete**: ~10 minutes (first time), ~2 minutes (subsequent times)  
**Difficulty**: Beginner-friendly  
**Maintained by**: Prisma y Media Team
