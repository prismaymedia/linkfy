# 🚀 Vercel Deployment Guide

This guide explains how to deploy Linkfy to Vercel with automated production deployments and PR preview URLs.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Deployment Workflow](#deployment-workflow)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Linkfy uses Vercel for deploying both the client (React app) and server (NestJS API) with:

- ✅ **Production deployments** on push to `master` branch
- ✅ **Preview deployments** for every Pull Request
- ✅ **Automatic PR comments** with preview URLs
- ✅ **Environment-specific configurations**
- ✅ **Rollback capabilities**

## 📦 Prerequisites

Before setting up Vercel deployment, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Connected to Vercel
3. **Environment Variables**: API keys for YouTube, Spotify, Supabase, and Sentry
4. **Vercel CLI** (optional for local testing): `npm i -g vercel`

## 🛠️ Setup Instructions

### Step 1: Create Vercel Projects

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..." → "Project"**
3. Import your GitHub repository
4. Create **TWO separate projects**:
   - **linkfy-client** (for the React frontend)
   - **linkfy-server** (for the NestJS backend)

### Step 2: Configure Vercel Projects

#### Client Configuration (linkfy-client)

1. **Framework Preset**: Vite
2. **Root Directory**: `client`
3. **Build Command**: `yarn build`
4. **Output Directory**: `dist`
5. **Install Command**: `yarn install`

#### Server Configuration (linkfy-server)

1. **Framework Preset**: Other
2. **Root Directory**: `server`
3. **Build Command**: `yarn nest:build`
4. **Output Directory**: `dist`
5. **Install Command**: `yarn install`

### Step 3: Get Vercel IDs

Run these commands in your terminal:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link projects and get IDs
cd client
vercel link
# Copy the Project ID and Org ID

cd ../server
vercel link
# Copy the Project ID
```

### Step 4: Add GitHub Secrets

Go to your GitHub repository → **Settings → Secrets and variables → Actions**

Add the following secrets:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `VERCEL_TOKEN` | Vercel authentication token | [Vercel Account Settings → Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Your Vercel organization ID | Run `vercel link` or find in Vercel project settings |
| `VERCEL_PROJECT_ID_CLIENT` | Client project ID | Run `vercel link` in `client/` directory |
| `VERCEL_PROJECT_ID_SERVER` | Server project ID | Run `vercel link` in `server/` directory |

### Step 5: Configure Environment Variables in Vercel

#### For Client Project (linkfy-client):

Go to **Project Settings → Environment Variables** and add:

**Production Environment:**
```env
VITE_API_URL=https://linkfy-server.vercel.app
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SENTRY_DSN=your-sentry-dsn
```

**Preview Environment:**
```env
VITE_API_URL=https://linkfy-server-preview.vercel.app
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SENTRY_DSN=your-sentry-dsn
```

#### For Server Project (linkfy-server):

Go to **Project Settings → Environment Variables** and add:

**Production & Preview Environments:**
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

## 🔄 Deployment Workflow

### Production Deployment

1. Merge changes to `master` branch
2. GitHub Actions automatically triggers
3. Both client and server are deployed to production
4. Production URLs are updated

### Preview Deployment (Pull Requests)

1. Open a Pull Request
2. GitHub Actions automatically triggers
3. Preview deployments are created for both client and server
4. A comment is posted on the PR with preview URLs:

```markdown
## 🚀 Vercel Deployment

### ✅ Client Preview Deployed Successfully!

| Environment | Status | URL |
|------------|--------|-----|
| **Client Preview** | ✅ Ready | [Visit Preview](https://...) |
| **Server Preview** | ✅ Ready | [Visit API](https://...) |

### 📊 Deployment Details
- **Branch**: `feature/my-feature`
- **Commit**: abc1234
- **Triggered by**: @username
- **Environment**: Preview
```

5. Every new commit updates the preview deployments
6. Comment is updated with new URLs

## 🔍 Vercel Dashboard Features

### Deployments Tab
- View all deployments (production and preview)
- Check build logs
- Monitor deployment status

### Analytics Tab
- Track visitor metrics
- Monitor performance
- View geographic distribution

### Logs Tab
- Real-time function logs
- Error tracking
- Performance metrics

### Settings Tab
- Configure domains
- Manage environment variables
- Set up integrations

## 🐛 Troubleshooting

### Build Failures

**Problem**: Build fails with "Module not found"
```bash
Solution: Ensure all dependencies are in package.json
- Check if the module is listed in dependencies
- Run `yarn install` locally to verify
- Check build logs for specific missing modules
```

**Problem**: Build fails with TypeScript errors
```bash
Solution: Fix TypeScript errors locally first
- Run `yarn nest:check` (server) or `yarn build` (client)
- Fix all type errors before pushing
```

### Environment Variables Not Working

**Problem**: API calls fail with 401/403 errors
```bash
Solution: Verify environment variables in Vercel
- Go to Project Settings → Environment Variables
- Ensure all variables are set for the correct environment
- Redeploy after updating variables
```

### Preview URLs Not Appearing

**Problem**: PR comment not posted
```bash
Solution: Check GitHub Actions permissions
- Go to repository Settings → Actions → General
- Ensure "Read and write permissions" is enabled
- Check the workflow run logs for errors
```

### CORS Issues

**Problem**: Client can't connect to server
```bash
Solution: Update CORS configuration in server
- Add preview domain to allowed origins
- Check server/src/main.ts CORS settings
- Verify VITE_API_URL points to correct server
```

## 📊 Monitoring Deployments

### Via GitHub Actions
1. Go to **Actions** tab in GitHub
2. Select **"Deploy to Vercel"** workflow
3. View logs for each deployment step

### Via Vercel Dashboard
1. Go to your project in Vercel
2. Click **"Deployments"** tab
3. View status, logs, and metrics

### Via Vercel CLI
```bash
# List recent deployments
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Inspect deployment
vercel inspect [deployment-url]
```

## 🔄 Rollback Strategy

If a production deployment has issues:

### Method 1: Via Vercel Dashboard
1. Go to **Deployments** tab
2. Find the last working deployment
3. Click **"..."** → **"Promote to Production"**

### Method 2: Via Vercel CLI
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url] --scope=[team-name]
```

### Method 3: Via Git
```bash
# Revert the problematic commit
git revert [commit-hash]
git push origin master
```

## 🎯 Best Practices

1. **Test Locally First**: Always test builds locally before pushing
   ```bash
   cd client && yarn build
   cd ../server && yarn nest:build
   ```

2. **Use Preview Deployments**: Review changes in preview before merging

3. **Monitor Logs**: Check Vercel logs regularly for errors

4. **Secure Secrets**: Never commit API keys or secrets

5. **Update Environment Variables**: Keep Vercel environment variables in sync

6. **Use Domains**: Set up custom domains for production

7. **Enable Notifications**: Get alerts for deployment failures

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [GitHub Actions for Vercel](https://github.com/marketplace/actions/vercel-action)
- [Monorepo Deployment Guide](https://vercel.com/docs/concepts/monorepos)

## 🆘 Support

If you encounter issues:

1. Check [Vercel Status](https://www.vercel-status.com/)
2. Review [Vercel Community](https://github.com/vercel/vercel/discussions)
3. Open an issue in the repository
4. Contact Vercel Support (if on paid plan)

---

**Last Updated**: October 2024  
**Maintained by**: Prisma y Media Team
