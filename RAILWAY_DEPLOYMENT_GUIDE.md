# Deploy Backend to Railway.app

## Why Railway?
- ✅ **Super Easy**: Deploy in 5 minutes with GitHub
- ✅ **Auto Deploy**: Pushes to GitHub auto-deploy
- ✅ **Fast**: Good performance worldwide
- ✅ **Free Tier**: $5 free credits/month
- ✅ **Python Native**: Built-in Python/FastAPI support
- ✅ **Environment Variables**: Easy to manage in dashboard

## Quick Setup (3 Steps)

### Step 1: Sign Up & Connect GitHub
1. Go to: https://railway.app
2. Click "Start a New Project"
3. Click "Login with GitHub"
4. Authorize Railway to access your repositories

### Step 2: Deploy from GitHub

#### Option A: Deploy from Existing GitHub Repo (Recommended)
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository (e.g., `cti-ioc-lookup`)
4. Railway will auto-detect it's a Python app
5. Click "Deploy Now"

#### Option B: Deploy from Local (If no GitHub repo yet)
1. Push your code to GitHub first:
   ```bash
   cd /app/backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/cti-ioc-lookup-backend.git
   git push -u origin main
   ```
2. Then follow Option A

### Step 3: Configure Environment Variables
1. In Railway dashboard, click on your project
2. Go to "Variables" tab
3. Add these environment variables:

```
ABUSEIPDB_API_KEY=9148d3835cb202106faff2e96ba675157fdd9ffd699662c7ddd8b0a194875a0c8f9bfdfe2b718ba7
VIRUSTOTAL_API_KEY=64c29a69f93c5a804da1d3e029919bd86ef7219df80572e09f97f1d3cf72bc4a
URLSCAN_API_KEY=019aaf63-f958-70b8-a1a4-402eddc31f40
OTX_API_KEY=a6bcac71baee8bd978f78e714173af8fecb093c6f4f987a051de0bfab2678caa
GREYNOISE_API_KEY=Jng2JXWhsaY1iCfsD3j6AbAiCdyVzUqr9saRE9kwQspwy24hOxQ81WxwzV6iS6qD
CORS_ORIGINS=*
PORT=8001
```

4. Click "Add Variable" for each one
5. Railway will auto-redeploy with new variables

## Get Your Railway URL

After deployment completes (2-3 minutes):
1. Go to your project in Railway dashboard
2. Click on "Settings" tab
3. Scroll to "Domains" section
4. Click "Generate Domain"
5. You'll get a URL like: `cti-ioc-lookup-api.up.railway.app`

Your backend URL will be: `https://cti-ioc-lookup-api.up.railway.app`

## Test Your Deployment

```bash
# Test the API
curl -X POST "https://cti-ioc-lookup-api.up.railway.app/api/ioc/lookup" \
  -H "Content-Type: application/json" \
  -d '{"text":"8.8.8.8"}'

# Verify total_scans field
curl -s -X POST "https://cti-ioc-lookup-api.up.railway.app/api/ioc/lookup" \
  -H "Content-Type: application/json" \
  -d '{"text":"8.8.8.8"}' | grep -o '"total_scans":[0-9]*'
```

**Expected:** `"total_scans":95`

## Update Frontend

### Method 1: Update Vercel Environment Variable
1. Go to Vercel Dashboard
2. Select project: `ioc-jk`
3. Settings → Environment Variables
4. Update `REACT_APP_BACKEND_URL` to: `https://cti-ioc-lookup-api.up.railway.app`
5. Redeploy frontend

### Method 2: Update .env and Redeploy
```bash
# Update frontend .env
cd /app/frontend
echo "REACT_APP_BACKEND_URL=https://cti-ioc-lookup-api.up.railway.app" > .env.production

# Deploy to Vercel
npm run build
vercel --prod
```

## Railway Features

### Auto Deployments
Every time you push to GitHub, Railway automatically:
1. Pulls latest code
2. Rebuilds the app
3. Deploys new version
4. Zero downtime deployment

### View Logs
1. Go to your project in Railway
2. Click "Deployments" tab
3. Click on latest deployment
4. View real-time logs

### Monitoring
Railway dashboard shows:
- CPU usage
- Memory usage
- Request count
- Response times
- Error rates

## Railway CLI (Optional)

### Install Railway CLI
```bash
# macOS
brew install railway

# npm
npm install -g @railway/cli

# Linux
curl -fsSL https://railway.app/install.sh | sh
```

### Login
```bash
railway login
```

### Link to Project
```bash
cd /app/backend
railway link
```

### Deploy from CLI
```bash
railway up
```

### View Logs from CLI
```bash
railway logs
```

### Open in Browser
```bash
railway open
```

## Cost Breakdown

**Free Tier Includes:**
- $5 in credits per month
- Equivalent to ~500 hours of usage
- More than enough for this app

**Estimated Usage:**
- Your app: ~$0.50-$1.00 per month
- Well within free tier ✅

**If you exceed free tier:**
- $0.000463/GB-hour for memory
- $0.000231/vCPU-hour

## Troubleshooting

### Issue: Build Failed
**Check:**
1. Railway logs for Python errors
2. Ensure `requirements.txt` is correct
3. Check Python version (should be 3.9+)

**Solution:**
```bash
# In Railway dashboard, go to Settings
# Set Python version explicitly:
# Add build command:
pip install -r requirements.txt
```

### Issue: App Crashes on Start
**Check logs for:**
- Missing environment variables
- Port binding issues
- Import errors

**Solution:**
1. Verify all API keys are set in Variables tab
2. Check that `PORT` variable is set (Railway auto-provides it)
3. Ensure `server.py` exists (not `main.py`)

### Issue: CORS Errors
**Solution:**
Add/update in Variables tab:
```
CORS_ORIGINS=*
```
Or specific domain:
```
CORS_ORIGINS=https://ioc-jk.vercel.app
```

### Issue: Slow Response
**Railway free tier limitations:**
- Sleeps after 10 minutes of inactivity
- First request after sleep takes ~5-10 seconds
- Subsequent requests are fast

**Solution (if needed):**
- Upgrade to Hobby plan ($5/month) - keeps app awake
- Or use a cron job to ping your API every 5 minutes

## Comparison: Railway vs Others

| Feature | Railway | Render | Fly.io |
|---------|---------|--------|--------|
| Setup | ⭐⭐⭐⭐⭐ Easiest | ⭐⭐⭐ Easy | ⭐⭐⭐⭐ Easy |
| Performance | ⭐⭐⭐⭐ Good | ⭐⭐ Slow | ⭐⭐⭐⭐⭐ Best |
| Free Tier | $5 credits/mo | 750 hrs/mo | Always free |
| Auto Deploy | ✅ Yes | ✅ Yes | ❌ Manual |
| Python Support | ✅ Native | ✅ Native | ⚠️ Docker only |
| Deployment Time | 2-3 min | 5-10 min | 2-3 min |
| Cold Start | ~5 seconds | ~30 seconds | ~2 seconds |

## Railway Advantages
- ✅ **Easiest setup**: No CLI needed, all via dashboard
- ✅ **GitHub integration**: Auto-deploys on push
- ✅ **Good performance**: Better than Render, slightly slower than Fly.io
- ✅ **Great developer experience**: Clean UI, easy to use
- ✅ **Built-in database support**: Can add PostgreSQL/Redis if needed later

## Next Steps After Deployment

1. ✅ Verify API returns `total_scans` field
2. ✅ Update Vercel environment variable
3. ✅ Test full application
4. ✅ Check VirusTotal gauge shows "2 / 95" format
5. ✅ Verify all enhanced data displays

## Monitoring Your App

Railway provides built-in metrics:
- Go to project → "Metrics" tab
- See real-time graphs of:
  - CPU usage
  - Memory usage
  - Network bandwidth
  - Request volume

## Custom Domain (Optional)

To use your own domain:
1. Go to project → "Settings" → "Domains"
2. Click "Custom Domain"
3. Add your domain (e.g., `api.yourdomain.com`)
4. Update DNS records as instructed
5. Railway handles SSL certificates automatically

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app

## Quick Verification Checklist

After deployment, verify:
- [ ] App is running (check Railway dashboard)
- [ ] Environment variables are set (all API keys)
- [ ] Domain is generated and accessible
- [ ] API endpoint responds: `/api/ioc/lookup`
- [ ] Response includes `total_scans` field
- [ ] Frontend connected and working
- [ ] VirusTotal gauge shows correct format
- [ ] All enhanced data displaying
- [ ] No CORS errors in browser console

## Estimated Timeline
- Sign up: 1 minute
- Connect GitHub: 1 minute
- Deploy: 2-3 minutes
- Configure env variables: 2 minutes
- Test: 1 minute
- Update frontend: 2 minutes
- **Total: ~10 minutes** 🚀

You're ready to deploy! Go to https://railway.app and get started! 🎉
