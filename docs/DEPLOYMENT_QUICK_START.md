# ⚡ Vercel Deployment - Quick Start Guide

This is a condensed version of the deployment guide to get you up and running quickly.

> **Note**: This guide covers deploying the client only. The server is deployed separately and is not hosted on Vercel.

## 🎯 5-Minute Setup

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

### Step 2: Link Project
```bash
# Link client
cd client
vercel link
# Follow prompts, select/create "linkfy-client" project
```

### Step 3: Get Project ID
```bash
# Client project ID
cat client/.vercel/project.json
```

### Step 4: Add GitHub Secrets

Go to: `https://github.com/[owner]/linkfy/settings/secrets/actions`

Add these secrets:
- `VERCEL_TOKEN` - Get from: https://vercel.com/account/tokens
- `VERCEL_ORG_ID` - From `.vercel/project.json`
- `VERCEL_PROJECT_ID_CLIENT` - From `client/.vercel/project.json`

### Step 5: Configure Environment Variables

#### Client (linkfy-client)
Go to: `https://vercel.com/[your-org]/linkfy-client/settings/environment-variables`

Add for **Production** and **Preview**:
```env
VITE_API_URL=https://your-backend-api-url.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SENTRY_DSN=your-sentry-dsn
```

> **Important**: Replace `your-backend-api-url.com` with your actual backend server URL (not on Vercel).

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
- [ ] PR comment appears with preview URL
- [ ] Client preview URL loads correctly
- [ ] Client can communicate with backend API
- [ ] Environment variables are working

## 🔍 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| No PR comment | Check GitHub Actions permissions |
| Build fails | Review build logs in Vercel dashboard |
| Env vars not working | Verify in Vercel project settings |
| CORS errors | Add client URL to backend server CORS settings |

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
