# 📋 Deployment Checklist

This checklist ensures all deployment configurations are properly set up for Linkfy on Vercel.

## 🎯 Pre-Deployment Setup

### Vercel Account & Projects

- [ ] Vercel account created at [vercel.com](https://vercel.com)
- [ ] GitHub repository connected to Vercel
- [ ] Two Vercel projects created:
  - [ ] `linkfy-client` (React frontend)
  - [ ] `linkfy-server` (NestJS backend)

### Local Setup

- [ ] Vercel CLI installed: `npm i -g vercel`
- [ ] Logged into Vercel CLI: `vercel login`
- [ ] Client project linked: `cd client && vercel link`
- [ ] Server project linked: `cd server && vercel link`
- [ ] Project IDs copied from `.vercel/project.json` files

## 🔐 GitHub Secrets Configuration

Go to: `Settings → Secrets and variables → Actions`

- [ ] `VERCEL_TOKEN` - Created at [vercel.com/account/tokens](https://vercel.com/account/tokens)
- [ ] `VERCEL_ORG_ID` - Found in `.vercel/project.json`
- [ ] `VERCEL_PROJECT_ID_CLIENT` - Found in `client/.vercel/project.json`
- [ ] `VERCEL_PROJECT_ID_SERVER` - Found in `server/.vercel/project.json`

## 🌍 Environment Variables - Client (linkfy-client)

Go to: `Project Settings → Environment Variables`

### Production Environment
- [ ] `VITE_API_URL` - Production server URL
- [ ] `VITE_SUPABASE_URL` - Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `VITE_SENTRY_DSN` - Sentry DSN for error tracking

### Preview Environment
- [ ] `VITE_API_URL` - Preview server URL
- [ ] `VITE_SUPABASE_URL` - Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `VITE_SENTRY_DSN` - Sentry DSN for error tracking

### Development Environment
- [ ] `VITE_API_URL` - `http://localhost:3000`
- [ ] `VITE_SUPABASE_URL` - Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `VITE_SENTRY_DSN` - Sentry DSN for error tracking

## 🔧 Environment Variables - Server (linkfy-server)

Go to: `Project Settings → Environment Variables`

### All Environments (Production, Preview, Development)
- [ ] `NODE_ENV` - `production`
- [ ] `PORT` - `3000`
- [ ] `YOUTUBE_API_KEY` - YouTube Data API v3 key
- [ ] `SPOTIFY_CLIENT_ID` - Spotify app client ID
- [ ] `SPOTIFY_CLIENT_SECRET` - Spotify app client secret
- [ ] `SUPABASE_URL` - Supabase project URL
- [ ] `SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `SENTRY_DSN` - Sentry DSN for error tracking

### Optional
- [ ] `CORS_ORIGINS` - Comma-separated allowed origins

## ⚙️ Vercel Project Settings

### Client Project (linkfy-client)
- [ ] Framework Preset: **Vite**
- [ ] Root Directory: `client`
- [ ] Build Command: `yarn build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `yarn install`
- [ ] Node.js Version: **20.x**

### Server Project (linkfy-server)
- [ ] Framework Preset: **Other**
- [ ] Root Directory: `server`
- [ ] Build Command: `yarn nest:build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `yarn install`
- [ ] Node.js Version: **20.x**

## 🔄 GitHub Actions

- [ ] GitHub Actions enabled in repository
- [ ] "Read and write permissions" enabled in: `Settings → Actions → General`
- [ ] Workflow file present: `.github/workflows/vercel-deploy.yml`

## 🧪 Testing Deployment

### Initial Test (Manual)
- [ ] Run `cd client && vercel` to deploy client manually
- [ ] Run `cd server && vercel` to deploy server manually
- [ ] Verify both deployments work correctly
- [ ] Test API connectivity between client and server

### Production Deployment Test
- [ ] Push a commit to `master` branch
- [ ] Check GitHub Actions workflow runs successfully
- [ ] Verify production URLs are accessible:
  - [ ] Client: `https://linkfy-client.vercel.app`
  - [ ] Server: `https://linkfy-server.vercel.app`
- [ ] Test main functionality on production URLs

### Preview Deployment Test
- [ ] Create a test Pull Request
- [ ] Wait for GitHub Actions to complete
- [ ] Check PR comment for preview URLs
- [ ] Verify preview deployments work correctly:
  - [ ] Client preview URL accessible
  - [ ] Server preview URL accessible
  - [ ] API calls from client to server work
- [ ] Push another commit to the same PR
- [ ] Verify preview URLs are updated in the comment

## 🔍 Post-Deployment Verification

### Client Verification
- [ ] Homepage loads correctly
- [ ] All routes are accessible (no 404s)
- [ ] Static assets load (images, fonts, CSS)
- [ ] API calls to server work
- [ ] Supabase authentication works
- [ ] Error tracking (Sentry) is active
- [ ] Console has no critical errors

### Server Verification
- [ ] Health check endpoint responds: `GET /`
- [ ] API endpoints are accessible
- [ ] YouTube API integration works
- [ ] Spotify API integration works
- [ ] Database connection is established
- [ ] Error tracking (Sentry) is active
- [ ] CORS is properly configured
- [ ] Rate limiting is working (if configured)

### Integration Testing
- [ ] Client can successfully call server APIs
- [ ] YouTube URL conversion works end-to-end
- [ ] Spotify URL conversion works end-to-end
- [ ] Real-time preview functionality works
- [ ] Error messages display correctly
- [ ] Loading states work properly

## 📊 Monitoring & Analytics

### Vercel Dashboard
- [ ] Check deployment logs for errors
- [ ] Monitor function execution times
- [ ] Review bandwidth usage
- [ ] Check build duration times

### Sentry Dashboard
- [ ] Verify error reports are coming through
- [ ] Set up alert notifications
- [ ] Review performance metrics
- [ ] Configure issue assignments

### Analytics (Optional)
- [ ] Set up Vercel Analytics
- [ ] Configure Web Vitals monitoring
- [ ] Set up custom events tracking

## 🔒 Security Checklist

- [ ] No secrets committed to repository
- [ ] All API keys rotated after initial setup
- [ ] HTTPS enabled for all URLs
- [ ] CORS properly configured
- [ ] Rate limiting enabled (if applicable)
- [ ] Input validation working
- [ ] Dependency security scan passed
- [ ] Secret scanning enabled on GitHub

## 📝 Documentation Updates

- [ ] README.md updated with deployment badges
- [ ] CONTRIBUTING.md updated with deployment info
- [ ] Architecture diagrams updated to include Vercel
- [ ] Deployment guide created (VERCEL_DEPLOYMENT.md)
- [ ] Environment variables documented
- [ ] Troubleshooting guide updated

## 🎯 Final Steps

- [ ] Team members notified of new deployment process
- [ ] Production URLs documented in project wiki
- [ ] Backup/rollback plan documented
- [ ] Incident response plan created
- [ ] On-call rotation established (if applicable)

## 🆘 Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Build fails | Check build logs in Vercel dashboard |
| Environment variables not working | Verify in Vercel project settings |
| CORS errors | Update CORS_ORIGINS in server env vars |
| Preview URL not in PR comment | Check GitHub Actions permissions |
| 404 on client routes | Verify rewrites in vercel.json |
| API calls fail | Check VITE_API_URL points to correct server |

## 📚 Resources

- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Setup Helper Script](../scripts/setup-vercel.sh)
- [Environment Variables Template](../.env.vercel.example)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

**Last Updated**: October 2024  
**Maintained by**: Prisma y Media Team

**Note**: Check off each item as you complete it. This ensures nothing is missed during the deployment setup process.
